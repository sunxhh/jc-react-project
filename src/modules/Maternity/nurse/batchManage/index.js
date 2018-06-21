import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { Button, Table, Form, Row, Col, Radio, DatePicker, Select, Input, Popover, Divider } from 'antd'
import {
  getBatchList,
  getBatchTypeList,
  getBatchStatusList,
  addBatch,
  getBatchDetail,
  editBatch,
  batchInvalid,
  setQueryPar,
  resetQueryPar
} from './reduck'
import { getCenterList } from '../scheduleManage/reduck'
import { showModalForm } from '../../../../components/modal/ModalForm'
import styles from './styles.less'
import { isEmpty } from 'Utils/lang'
import { genPagination } from 'Utils/helper'

const FormItem = Form.Item
const ButtonGroup = Button.Group
const RadioGroup = Radio.Group
const SelectOption = Select.Option

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

class BatchList extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  static defaultProps = {
    centerList: [],
    nurseGrid: []
  }

  _columns = [
    {
      key: 'key',
      title: '编号',
      dataIndex: 'key',
      render: (text, record, index) => {
        const { pageSize, current } = this.props.page
        return (
          <span>{(current - 1) * pageSize + index + 1}</span>
        )
      }
    },
    {
      key: 'centerName',
      title: '所在中心',
      dataIndex: 'centerName',
      render: (text, record) => (
        <span>{this._getCenterName(record.centerId)}</span>
      )
    },
    {
      key: 'planName',
      title: '班次名称',
      dataIndex: 'planName',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'planTypeName',
      title: '班次类型',
      dataIndex: 'planTypeName',
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'startTime',
      title: '开始时间',
      dataIndex: 'startTime',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'endTime',
      title: '结束时间',
      dataIndex: 'endTime',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'isValid',
      title: '是否有效',
      dataIndex: 'isValid',
      render: (text) => (
        <span>{text === 1 ? '有效' : '无效'}</span>
      )
    },
    {
      key: 'createTime',
      title: '创建时间',
      dataIndex: 'createTime',
      width: 100,
      render: (text) => {
        return (
          <Popover
            placement='topRight'
            content={<div className={styles['pop']}>{moment(text).format('YYYY-MM-DD HH:mm')}</div>}
            title='创建时间'
          >
            <span>{moment(text).format('YYYY-MM-DD')}</span>
          </Popover>
        )
      }
    },
    {
      key: 'createUserName',
      title: '创建人',
      dataIndex: 'createUserName',
      width: 70,
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    }, {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 150,
      render: (text, record) => {
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        return (
          <div className={styles['table-ope']}>
            {
              btnRole.includes('check') &&
              <a
                href='javascript:;'
                onClick={(e) => { this._detailShowModal(e, record, true) }}
              >查看
              </a>
            }
            {
              btnRole.includes('check') &&
              (btnRole.includes('edit') || btnRole.includes('invalid')) && this._currentGtPlanDate(record) &&
              <Divider type='vertical' />
            }
            {
              btnRole.includes('edit') && this._currentGtPlanDate(record) &&
              <a
                href='javascript:;'
                onClick={(e) => { this._editShowModal(e, record) }}
              >编辑
              </a>
            }
            {
              btnRole.includes('edit') && btnRole.includes('invalid') && this._currentGtPlanDate(record) &&
              <Divider type='vertical' />
            }
            {
              btnRole.includes('invalid') && this._currentGtPlanDate(record) &&
              <a
                href='javascript:;'
                onClick={(e) => { this._handleInvalid(e, record) }}
              >
                {
                  record.isValid === 1
                    ? '置为无效'
                    : '置为有效'
                }
              </a>
            }
          </div>
        )
      }
    }
  ]

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getParameter(current, pageSize)
    dispatch(getBatchList(arg))
  }

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.page.current, pageSize = this.props.page.pageSize) => {
    const { dispatch, form } = this.props
    const arg = form.getFieldsValue()
    dispatch(setQueryPar(arg))
    return {
      ...arg,
      currentPage: current,
      pageSize: pageSize,
    }
  }

  // 点击查询
  _handleQuery = () => {
    this._getList(1)
  }

  // 当前日期与班次日期对比
  _currentGtPlanDate = (record) => {
    let curr = moment().toString()
    let endTime = ''
    if (record.planType === '3') {
      endTime = '23:59:59'
    } else {
      endTime = record.endTime
    }
    let planDate = moment(record.planDate).format('YYYY-MM-DD').toString() + ' ' + endTime
    return new Date(planDate).getTime() >= new Date(curr).getTime()
  }

  // 禁用开始时间
  _disabledStartDate = (dateStart) => {
    const { getFieldValue } = this.props.form
    const dateEnd = getFieldValue('endTime')
    if (!dateStart || !dateEnd) {
      return false
    }
    return dateStart.valueOf() > dateEnd.valueOf()
  }

  // 禁用结束时间
  _disabledEndDate = (dateEnd) => {
    const { getFieldValue } = this.props.form
    const dateStart = getFieldValue('startTime')
    if (!dateEnd || !dateStart) {
      return false
    }
    return dateEnd.valueOf() <= dateStart.valueOf()
  }

  // 禁用当前日期之前
  _disabledCurrentDate = (dateStart) => {
    const dateEnd = new Date()
    if (!dateStart) {
      return false
    }
    return dateStart.valueOf() < dateEnd.valueOf()
  }

  // 时间区域选择
  _handleTimeFlagChange = (value) => {
    const { setFieldsValue } = this.props.form
    let currDate = moment()
    let preDate = ''
    if (value === 'a') {
      setFieldsValue({ startTime: currDate, endTime: currDate })
    } else if (value === 'b') {
      preDate = moment().subtract(6, 'days')
      setFieldsValue({ startTime: preDate, endTime: currDate })
    } else if (value === 'c') {
      preDate = moment().subtract(29, 'days')
      setFieldsValue({ startTime: preDate, endTime: currDate })
    } else if (value === 'd') {
      preDate = moment().subtract(89, 'days')
      setFieldsValue({ startTime: preDate, endTime: currDate })
    }
  }

  // 弹层班次类型
  _handlePlanTypeChange = (value) => {
    let str = ''
    if (value === '0') {
      str = '09:00 - 11:00'
    } else if (value === '1') {
      str = '12:00 - 15:30'
    } else if (value === '2') {
      str = '18:00 - 21:00'
    } else if (value === '3') {
      str = '--'
    }
    document.getElementById('planTime').innerText = str
  }

  // 获取班次时间
  _getBatchTime = (data) => {
    if (data.startTime) {
      return `${data.startTime} - ${data.endTime}`
    } else {
      return '--'
    }
  }

  // 新增
  _addShowModal = (e) => {
    e.preventDefault()
    const { centerList, batchTypeList } = this.props
    showModalForm({
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 }
      },
      title: '新增班次',
      okText: '提交',
      cancelText: '取消',
      fields: [
        {
          id: 'centerId',
          props: {
            label: '所在中心：'
          },
          options: {
            rules: [{
              required: true,
              message: '请选择所在中心!'
            }]
          },
          element: (
            <Select
              placeholder='请选择所在中心'
              getPopupContainer={() => document.getElementsByClassName('ant-modal-wrap')[0]}
            >
              {
                !isEmpty(centerList) && centerList.map(item => (
                  <SelectOption
                    key={item.id}
                    value={item.id}
                  >
                    {item.orgName}
                  </SelectOption>
                ))
              }
            </Select>
          )
        },
        {
          id: 'planType',
          props: {
            label: '班次类型：'
          },
          options: {
            rules: [{
              required: true,
              message: '请选择班次类型!'
            }]
          },
          element: (
            <Select
              placeholder='请选择班次类型'
              onChange={this._handlePlanTypeChange}
              getPopupContainer={() => document.getElementsByClassName('ant-modal-wrap')[0]}
            >
              {
                !isEmpty(batchTypeList) && batchTypeList.map(item => (
                  <SelectOption
                    key={item.value}
                    value={item.value}
                  >
                    {item.name}
                  </SelectOption>
                ))
              }
            </Select>
          )
        },
        {
          id: 'planDate',
          props: {
            label: '班次日期：'
          },
          options: {
            rules: [{
              required: true,
              message: '请选择班次日期!'
            }]
          },
          element: (
            <DatePicker
              disabledDate={this._disabledCurrentDate}
              format='YYYY-MM-DD'
              placeholder=''
              getCalendarContainer={() => document.getElementsByClassName('ant-modal-wrap ')[0]}
            />
          )
        },
        {
          id: 'planTime',
          props: {
            label: '班次时间：'
          },
          element: (
            <p
              className={styles['modal-plan-date']}
              id='planTime'
            />
          )
        },
        {
          id: 'isValid',
          props: {
            label: '是否有效：'
          },
          options: {
            initialValue: 1
          },
          element: (
            <RadioGroup>
              <Radio
                key={1}
                value={1}
              >
                有效
              </Radio>
              <Radio
                key={0}
                value={0}
              >
                无效
              </Radio>
            </RadioGroup>
          )
        },
        {
          id: 'planRemark',
          props: {
            label: '备注：'
          },
          element: (
            <Input.TextArea
              maxLength={500}
              placeholder='请输入备注'
            />
          )
        }
      ],
      onOk: values => {
        const { dispatch } = this.props
        return dispatch(addBatch(this._getParam(values))).then(res => {
          if (res.status === 'success') {
            this._getList()
            return res
          }
        })
      }
    })
  }

  // 编辑
  _editShowModal = (e, record) => {
    const { dispatch, centerList, batchTypeList } = this.props
    e.preventDefault()
    dispatch(getBatchDetail({
      id: record.id
    })).then(res => {
      const data = res.result
      showModalForm({
        formItemLayout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 16 }
        },
        title: '编辑班次',
        okText: '提交',
        cancelText: '取消',
        fields: [
          {
            id: 'centerId',
            props: {
              label: '所在中心：'
            },
            options: {
              initialValue: data && data.centerId ? data.centerId : '',
              rules: [{
                required: true,
                message: '请选择所在中心!'
              }]
            },
            element: (
              <Select
                placeholder='请选择所在中心'
                getPopupContainer={() => document.getElementsByClassName('ant-modal-wrap')[0]}
              >
                {
                  !isEmpty(centerList) && centerList.map(item => (
                    <SelectOption
                      key={item.id}
                      value={item.id}
                    >
                      {item.orgName}
                    </SelectOption>
                  ))
                }
              </Select>
            )
          },
          {
            id: 'planType',
            props: {
              label: '班次类型：'
            },
            options: {
              initialValue: data && data.planType ? data.planType : '',
              rules: [{
                required: true,
                message: '请选择班次类型!'
              }]
            },
            element: (
              <Select
                placeholder='请选择班次类型'
                onChange={this._handlePlanTypeChange}
                getPopupContainer={() => document.getElementsByClassName('ant-modal-wrap')[0]}
              >
                {
                  !isEmpty(batchTypeList) && batchTypeList.map(item => (
                    <SelectOption
                      key={item.value}
                      value={item.value}
                    >
                      {item.name}
                    </SelectOption>
                  ))
                }
              </Select>
            )
          },
          {
            id: 'planDate',
            props: {
              label: '班次日期：'
            },
            options: {
              initialValue: moment(data.planDate),
              rules: [{
                required: true,
                message: '请选择班次日期!'
              }]
            },
            element: (
              <DatePicker
                disabledDate={this._disabledCurrentDate}
                format='YYYY-MM-DD'
                placeholder=''
                getCalendarContainer={() => document.getElementsByClassName('ant-modal-wrap ')[0]}
              />
            )
          },
          {
            id: 'planTime',
            props: {
              label: '班次时间：'
            },
            element: (
              <p
                className={styles['modal-plan-date']}
                id='planDate'
              >{this._getBatchTime(data)}
              </p>
            )
          },
          {
            id: 'isValid',
            props: {
              label: '是否有效：'
            },
            options: {
              initialValue: data && data.isValid
            },
            element: (
              <RadioGroup>
                <Radio
                  key={1}
                  value={1}
                >
                  有效
                </Radio>
                <Radio
                  key={0}
                  value={0}
                >
                  无效
                </Radio>
              </RadioGroup>
            )
          },
          {
            id: 'planRemark',
            props: {
              label: '备注：'
            },
            options: {
              initialValue: data && data.planRemark
            },
            element: (
              <Input.TextArea
                maxLength={500}
                placeholder='请输入备注'
              />
            )
          },
          {
            id: 'createTime',
            props: {
              label: '创建时间：',
            },
            element: (
              <p>{moment(data.createTime).format('YYYY-MM-DD HH:mm')}</p>
            )
          },
          {
            id: 'createUserName',
            props: {
              label: '创建人：',
            },
            element: (
              <p>{data.createUserName}</p>
            )
          },
        ],
        onOk: values => {
          const { dispatch } = this.props
          return dispatch(editBatch(this._getParam(values, data))).then(res => {
            if (res.status === 'success') {
              this._getList()
              return res
            }
          })
        }
      })
    })
  }

  // 查看
  _detailShowModal = (e, record, isShow) => {
    const { dispatch, centerList, batchTypeList } = this.props
    e.preventDefault()
    dispatch(getBatchDetail({
      id: record.id
    })).then(res => {
      const data = res.result
      showModalForm({
        formItemLayout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 16 }
        },
        title: '查看班次',
        okVisible: false,
        cancelText: '关闭',
        fields: [
          {
            id: 'centerId',
            props: {
              label: '所在中心：'
            },
            options: {
              initialValue: data && data.centerId ? data.centerId : '',
              rules: [{
                required: !isShow,
                message: '请选择所在中心!'
              }]
            },
            element: (
              <Select
                placeholder='请选择所在中心'
                disabled={isShow}
                getPopupContainer={() => document.getElementsByClassName('ant-modal-wrap')[0]}
              >
                {
                  !isEmpty(centerList) && centerList.map(item => (
                    <SelectOption
                      key={item.id}
                      value={item.id}
                    >
                      {item.orgName}
                    </SelectOption>
                  ))
                }
              </Select>
            )
          },
          {
            id: 'planType',
            props: {
              label: '班次类型：'
            },
            options: {
              initialValue: data && data.planType ? data.planType : '',
              rules: [{
                required: !isShow,
                message: '请选择班次类型!'
              }]
            },
            element: (
              <Select
                placeholder='请选择班次类型'
                onChange={this._handlePlanTypeChange}
                disabled={isShow}
                getPopupContainer={() => document.getElementsByClassName('ant-modal-wrap')[0]}
              >
                {
                  !isEmpty(batchTypeList) && batchTypeList.map(item => (
                    <SelectOption
                      key={item.value}
                      value={item.value}
                    >
                      {item.name}
                    </SelectOption>
                  ))
                }
              </Select>
            )
          },
          {
            id: 'planDate',
            props: {
              label: '班次日期：'
            },
            options: {
              initialValue: moment(data.planDate),
              rules: [{
                required: !isShow,
                message: '请选择班次日期!'
              }]
            },
            element: (
              <DatePicker
                disabledDate={this._disabledCurrentDate}
                format='YYYY-MM-DD'
                disabled={isShow}
                placeholder=''
                getCalendarContainer={() => document.getElementsByClassName('ant-modal-wrap ')[0]}
              />
            )
          },
          {
            id: 'planTime',
            props: {
              label: '班次时间：'
            },
            element: (
              <p
                className={styles['modal-plan-date']}
                id='planDate'
              >{this._getBatchTime(data)}
              </p>
            )
          },
          {
            id: 'isValid',
            props: {
              label: '是否有效：'
            },
            options: {
              initialValue: data && data.isValid
            },
            element: (
              <RadioGroup disabled={isShow}>
                <Radio
                  key={1}
                  value={1}
                >
                  有效
                </Radio>
                <Radio
                  key={0}
                  value={0}
                >
                  无效
                </Radio>
              </RadioGroup>
            )
          },
          {
            id: 'createTime',
            props: {
              label: '创建时间：',
            },
            element: (
              <p className={styles['item-content']}>{moment(data.createTime).format('YYYY-MM-DD HH:mm')}</p>
            )
          },
          {
            id: 'createUserName',
            props: {
              label: '创建人：',
            },
            element: (
              <p className={styles['item-content']}>{data.createUserName}</p>
            )
          },
          {
            id: 'planRemark',
            props: {
              label: '备注：'
            },
            options: {
              initialValue: data && data.planRemark
            },
            element: (
              <p className={styles['item-content']}>
                {
                  <Popover
                    placement='topRight'
                    content={<div className={styles['pop']}>{data.planRemark}</div>}
                    title='备注'
                  >
                    <span>{data.planRemark && data.planRemark.length > 80 ? `${data.planRemark.substring(0, 80)}...` : data.planRemark}</span>
                  </Popover>
                }
              </p>
            )
          },
        ],
        onOk: values => {
          const { dispatch } = this.props
          return dispatch(editBatch(this._getParam(values, data))).then(res => {
            if (res.status === 'success') {
              this._getList()
              return res
            }
          })
        }
      })
    })
  }

  // 获取表单提交参数
  _getParam = (values, data) => {
    if (data && data.id) {
      values['id'] = data.id
    }
    values['planDate'] = moment(values['planDate']).format('YYYY-MM-DD')
    return values
  }

  // 根据centerId获取centerName
  _getCenterName = (centerId) => {
    const { centerList } = this.props
    const center = centerList.find((item) => {
      return centerId === item.id
    })
    return center && center.orgName ? center.orgName : ''
  }

  // 置为无效/有效
  _handleInvalid = (e, record) => {
    const { dispatch } = this.props
    let isValid = record.isValid === 1 ? 0 : 1
    dispatch(batchInvalid({ id: record.id, isValid })).then((res) => {
      if (res.status === 'success') {
        this._getList()
      }
    })
  }

  // 月子中心点击
  _handleMenuClick = (item) => {
    const { centerList } = this.props
    const center = centerList.find((val) => {
      return val.id === item.key
    })
    this.setState({ centerId: center.id, centerName: center.orgName }, () => {
      this._getList()
    })
  }

  // 点击分页获取列表数据
  _handlePageChange = (pages) => {
    console.log(pages)
    const { page } = this.props
    const arg = { current: page && page.pageSize !== pages.pageSize ? 1 : pages.current, pageSize: pages.pageSize }
    this._getList(arg.page, arg.pageSize)
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(resetQueryPar())
  }

  // 生命周期， 初始化表格数据
  componentDidMount() {
    const { dispatch } = this.props
    document.querySelector('.ant-layout-content').style.background = '#f8f8f8'
    this._getList()
    dispatch(getBatchStatusList())
    dispatch(getBatchTypeList())
    dispatch(getCenterList())
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { list, showListSpin, batchTypeList, batchStatusList, initQueryPar, page, auths, match } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    const pages = genPagination({ ...page, records: page.total, pageNo: page.current })
    return (
      <div>
        <Form
          className={styles['parameter-wrap']}
        >
          <Row id='rowUser'>
            <Col span={18}>
              <Row>
                <Col span={12}>
                  <FormItem
                    label='班次时间：'
                    {...formItemLayout}
                  >
                    <Col span={11}>
                      <FormItem>
                        {getFieldDecorator('startTime', {
                          initialValue: initQueryPar.startTime,
                        })(
                          <DatePicker
                            disabledDate={this._disabledStartDate}
                            format='YYYY-MM-DD'
                            placeholder=''
                            allowClear
                            getCalendarContainer={() => document.getElementById('rowUser')}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={2}>
                      <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                      至
                      </span>
                    </Col>
                    <Col span={11}>
                      <FormItem>
                        {getFieldDecorator('endTime', {
                          initialValue: initQueryPar.endTime,
                        })(
                          <DatePicker
                            disabledDate={this._disabledEndDate}
                            format='YYYY-MM-DD'
                            placeholder=''
                            allowClear
                            getCalendarContainer={() => document.getElementById('rowUser')}
                          />
                        )}
                      </FormItem>
                    </Col>
                  </FormItem>
                </Col>
                <Col
                  span={12}
                  style={{ paddingLeft: 65 }}
                >
                  <FormItem>
                    <ButtonGroup className={styles['time-flag-area']}>
                      <Button style={{ marginLeft: 0 }} onClick={() => { this._handleTimeFlagChange('a') }}>今天</Button>
                      <Button style={{ marginLeft: 0 }} onClick={() => { this._handleTimeFlagChange('b') }}>近7天</Button>
                      <Button style={{ marginLeft: 0 }} onClick={() => { this._handleTimeFlagChange('c') }}>近1个月</Button>
                      <Button style={{ marginLeft: 0 }} onClick={() => { this._handleTimeFlagChange('d') }}>近3个月</Button>
                    </ButtonGroup>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='班次类型：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('planType', {
                      initialValue: initQueryPar.planType
                    })(
                      <Select
                        allowClear={false}
                        optionLabelProp='title'
                        filterOption={false}
                        placeholder='请选择班次类型'
                        getPopupContainer={() => document.getElementById('rowUser')}
                      >
                        <SelectOption
                          key=''
                          value=''
                          title='全部'
                        >
                          全部
                        </SelectOption>
                        {!isEmpty(batchTypeList) ? batchTypeList.map(d => (
                          <SelectOption
                            key={d.value}
                            value={d.value}
                            title={d.name}
                          >
                            {d.name}
                          </SelectOption>
                        )) : null}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label='班次状态：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('isValid', {
                      initialValue: initQueryPar.isValid,
                    })(
                      <Select
                        allowClear={false}
                        optionLabelProp='title'
                        filterOption={false}
                        placeholder='请选择值班状态'
                        getPopupContainer={() => document.getElementById('rowUser')}
                      >
                        <SelectOption
                          key=''
                          value=''
                          title='全部'
                        >
                          全部
                        </SelectOption>
                        {!isEmpty(batchStatusList) ? batchStatusList.map(d => (
                          <SelectOption
                            key={d.value}
                            value={d.value}
                            title={d.name}
                          >
                            {d.name}
                          </SelectOption>
                        )) : null}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col
              span={6}
            >
              <div className={styles['operate-btn']}>
                <Button
                  type='primary'
                  title='点击查询'
                  onClick={this._handleQuery}
                >
                  查询
                </Button>
                {
                  btnRole.indexOf('add') !== -1 &&
                  <Button
                    type='primary'
                    title='新建'
                    onClick={this._addShowModal}
                  >
                    新建
                  </Button>
                }
              </div>
            </Col>
          </Row>
        </Form>
        <div className={styles['table-wrapper']}>
          <Table
            className={styles['c-table-center']}
            columns={this._columns}
            rowKey='id'
            dataSource={list}
            loading={showListSpin}
            pagination={pages}
            onChange={this._handlePageChange}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.nurseBatch.batchList,
    page: state.nurseBatch.page,
    batchTypeList: state.nurseBatch.batchTypeList,
    batchStatusList: state.nurseBatch.batchStatusList,
    centerList: state.nurseSchedule.centerList,
    initQueryPar: state.nurseBatch.initQueryPar,
    auths: state.common.auths,
    showListSpin: state.common.showListSpin,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(BatchList))

