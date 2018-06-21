import React, { Component } from 'react'
import { Select, Table, Switch, Input, Form, Row, Col, Button, DatePicker, Divider } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getEnrollList, enrollReview, getEnrollDetail, getActivityList, getDepartmentList } from './reduck'
import styles from './styles.less'
import { showModalForm } from '../../../components/modal/ModalForm'
import { showModalWrapper } from '../../../components/modal/ModalWrapper'
import { isEmpty } from '../../../utils/lang'
import EnrollDetail from './enrollDetail'
import ParamsUtil from '../../../utils/params'
import { baseUrl } from '../../../config'
import * as actions from './reduck'
import moment from 'moment'
import storage from '../../../utils/storage'
import { genPagination } from 'Utils/helper'

const Option = Select.Option
const TextArea = Input.TextArea
const FormItem = Form.Item
const { RangePicker } = DatePicker

const sexItems = [
  { optionKey: '', optionValue: '全部' },
  { optionKey: '0', optionValue: '男' },
  { optionKey: '1', optionValue: '女' },
]

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

const enrollStatus = {
  '0': '待审核',
  '1': '已批准',
  '2': '未批准'
}

class Enroll extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reqBean: {
        activityId: '',
        signType: '',
        sex: '',
        department: '',
        userName: '',
        status: '',
        currentPage: 1
      },
      categoryName: [],
      selectDisabled: true
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(getEnrollList({ currentPage: 1 }))
    dispatch(getActivityList({}))
    dispatch(getDepartmentList({}))
  }

  _handleReview = (record) => {
    showModalForm({
      title: '报名审核',
      fields: [
        {
          id: 'status',
          props: {
            label: '审核是否通过'
          },
          element: (
            <Switch
              checkedChildren='ON'
              unCheckedChildren='OFF'
            />
          )
        },
        {
          id: 'reviewMessage',
          props: {
          },
          options: {
            rules: [{
              required: true,
              message: '请输入审核意见',
            }],
          },
          element: (
            <TextArea placeholder='请输入审核意见' />
          )
        },
      ],
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
      },
      layout: 'horizontal',
      onOk: values => {
        const reqBean = {
          signId: record.signId,
          status: values.status ? '1' : '2',
          reviewMessage: values.reviewMessage
        }
        return this.props.dispatch(enrollReview(reqBean)).then(res => {
          this.props.dispatch(getEnrollList(this.state.reqBean))
          return res
        })
      }
    })
  }

  _handleDetail = (record = {}) => {
    this.props.dispatch(getEnrollDetail({ signId: record.signId })).then(res => {
      if (res) {
        showModalWrapper(
          (
            <EnrollDetail
              dataSource={res}
              onSubmit={(values) => {
                const reqBean = {
                  signId: record.signId,
                  status: values.status ? '1' : '2',
                  reviewMessage: values.reviewMessage
                }
                return this.props.dispatch(enrollReview(reqBean)).then(res => {
                  this.props.dispatch(getEnrollList(this.state.reqBean))
                  return res
                })
              }}
            />
          ),
          {
            title: '报名查看'
          })
      }
    })
  }

  _handleGive = (userNo, activityId) => {
    showModalForm({
      title: '补送积分',
      fields: [
        {
          id: 'activityId',
          placeHolder: '活动名称',
          props: {
            label: '活动名称',
          },
          options: {
            initialValue: activityId,
            rules: [{
              required: true,
              message: '活动名称必填'
            }]
          },
          element: (
            <Select
              disabled={true}
              getPopupContainer={() => document.getElementById('activityId')}
            >
              {
                this.props.activityList && this.props.activityList.map(item => (
                  <Option
                    key={item.activityId}
                    value={item.activityId}
                  >{item.activityName}
                  </Option>
                ))
              }
            </Select>
          ),
          hasPopup: true
        },
        {
          id: 'time',
          props: {
            label: '参与时间',
          },
          options: {
            initialValue: '',
            rules: [{
              required: true,
              message: '参与时间必填'
            }]
          },
          element: (
            <RangePicker
              style={{ width: '100%' }}
              format='YYYY-MM-DD HH:mm:ss'
              showTime={{ hideDisabledOptions: true }}
              getPopupContainer={() => document.getElementById('time')}
            />
          ),
          hasPopup: true
        },
        {
          id: 'integral',
          placeHolder: '积分',
          props: {
            label: '补送积分'
          },
          options: {
            initialValue: '',
            rules: [{
              required: true,
              pattern: /^[0-9]\d{0,4}$/,
              message: '填写五位以内大于等于0整数'
            }]
          },
        },
      ],
      onOk: values => {
        const { dispatch } = this.props
        dispatch(actions.signIntergrate({ flag: '1', activityId: values.activityId, userNo: userNo, integral: parseInt(values.integral), startTime: values.time[0].format('YYYY-MM-DD HH:mm:ss'), endTime: values.time[1].format('YYYY-MM-DD HH:mm:ss') })).then(res => {
          res && dispatch(actions.getEnrollList(this.state.reqBean))
        })
      }
    })
  }

  _handleDelete = (userNo, activityId) => {
    showModalForm({
      title: '扣除积分',
      fields: [
        {
          id: 'activityId',
          placeHolder: '活动名称',
          props: {
            label: '活动名称',
          },
          options: {
            initialValue: activityId,
            rules: [{
              required: true,
              message: '活动名称必填'
            }]
          },
          element: (
            <Select
              disabled={true}
              getPopupContainer={() => document.getElementById('activityId')}
            >
              {
                this.props.activityList && this.props.activityList.map(item => (
                  <Option
                    key={item.activityId}
                    value={item.activityId}
                  >{item.activityName}
                  </Option>
                ))
              }
            </Select>
          ),
          hasPopup: true
        },
        {
          id: 'integral',
          placeHolder: '扣除积分',
          props: {
            label: '积分'
          },
          options: {
            initialValue: '',
            rules: [{
              required: true,
              pattern: /^[0-9]\d{0,4}$/,
              message: '填写五位以内大于等于0整数'
            }]
          },
        },
      ],
      onOk: values => {
        const { dispatch } = this.props
        dispatch(actions.signIntergrate({ flag: '2', activityId: values.activityId, userNo: userNo, integral: parseInt(values.integral), startTime: !isEmpty(values.time) ? moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss') : '', endTime: !isEmpty(values.time) ? moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss') : '' })).then(res => {
          res && dispatch(actions.getEnrollList(this.state.reqBean))
        })
      }
    })
  }

  columns = [
    {
      key: 'activityName',
      title: '活动名称',
      dataIndex: 'activityName',
    },
    {
      key: 'userName',
      title: '姓名',
      dataIndex: 'userName',
    },
    {
      key: 'officeSite',
      title: '所在城市',
      dataIndex: 'officeSite'
    },
    {
      key: 'sex',
      title: '性别',
      dataIndex: 'sex'
    },
    {
      key: 'department',
      title: '部门',
      dataIndex: 'department',
    },
    {
      key: 'mobile',
      title: '手机',
      dataIndex: 'mobile'
    },
    {
      key: 'signTime',
      title: '申请时间',
      dataIndex: 'signTime'
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render: (text, record) => (
        <span>{enrollStatus[text]}</span>
      )
    },
    {
      key: 'operate',
      title: '操作',
      dataIndex: 'operate',
      width: 260,
      fixed: 'right',
      render: (text, record, index) => {
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        return (
          <span>
            {(record.status === '0') && (btnRole.includes('audit')) && (
              <a size='small'><span onClick={() => this._handleReview(record)}>审核</span></a>
            )}
            {(record.status === '0') && (btnRole.includes('audit')) && (
              <Divider type='vertical' />
            )}
            {(btnRole.includes('audit')) && (
              <Link
                to='#'
                onClick={() => this._handleDetail(record)}
              >查看
              </Link>
            )}
            <Divider type='vertical' />
            {btnRole.includes('repair') && (
              <a size='small'><span onClick={() => this._handleGive(record.userNo, record.activityId)}>补送积分</span></a>
            )}
            <Divider type='vertical' />
            {btnRole.includes('deduct') && (
              <a size='small'><span onClick={() => this._handleDelete(record.userNo, record.activityId)}>扣除积分</span></a>
            )}
          </span>
        )
      }
    }
  ]

  _handSearch = values => {
    const newReqBean = {
      activityId: values.activityId,
      signType: values.signType,
      sex: values.sex,
      department: values.department,
      userName: values.userName,
      status: values.status,
      currentPage: 1
    }
    this.setState({
      reqBean: newReqBean
    }, () => {
      this.props.dispatch(getEnrollList(this.state.reqBean))
    })
  }

  _handlePageChange = (page) => {
    this.setState({
      reqBean: { ...this.state.reqBean, currentPage: page.current }
    }, () => this.props.dispatch(getEnrollList(this.state.reqBean)))
  }

  _handleExport = () => {
    const { reqBean } = this.state
    const reqBody = {
      activityId: reqBean.activityId || '',
      signType: reqBean.signType || '',
      sex: reqBean.sex || '',
      department: reqBean.department || '',
      userName: reqBean.userName || '',
      status: reqBean.status || '',
      ticket: storage.get('userInfo') && storage.get('userInfo').ticket
    }
    const params = ParamsUtil.json2url(reqBody)
    let url = (baseUrl === '/') ? `http://${location.host}` : baseUrl
    let newUrl = `${url}/api/charity/web/sign/export?${params}`
    location.href = newUrl
  }

  _handleActivityChange = (value) => {
    this.props.form.setFieldsValue({ 'signType': '' })
    if (value === '') {
      this.setState({
        selectDisabled: true
      })
    } else {
      this.props.activityList.filter((item) => {
        if (item.activityId === value) {
          this.setState({
            categoryName: item.categoryName,
            selectDisabled: false
          })
        }
      })
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const newReqBean = {
          activityId: values.activityId,
          signType: values.signType,
          sex: values.sex,
          department: values.department,
          userName: values.userName,
          status: values.status,
          currentPage: 1
        }
        this.setState({
          reqBean: newReqBean
        }, () => {
          this.props.dispatch(getEnrollList(this.state.reqBean))
        })
      }
    })
  }

  render() {
    const { list, page, activityList, departmentList, auths, match } = this.props
    const { getFieldDecorator } = this.props.form
    const { categoryName, selectDisabled } = this.state
    const btnRole = auths[match.path] ? auths[match.path] : []
    const pagination = genPagination(page, false)
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='活动名称'
              >
                <div
                  id='activityId'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('activityId', {
                    rules: [{
                      required: false,
                    }],
                    initialValue: '',
                  })(
                    <Select
                      getPopupContainer={() => document.getElementById('activityId')}
                      onChange={this._handleActivityChange}
                    >
                      <Option value=''>全部</Option>
                      {
                        activityList.map(item => (
                          <Option
                            key={item.activityId}
                            value={item.activityId}
                          >{item.activityName}
                          </Option>
                        ))
                      }
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='报名类型'
              >
                <div
                  id='signType'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('signType', {
                    rules: [{
                      required: false,
                    }],
                    initialValue: '',
                  })(
                    <Select
                      getPopupContainer={() => document.getElementById('signType')}
                      disabled={selectDisabled}
                    >
                      <Option value=''>全部</Option>
                      {
                        categoryName.map(item => (
                          <Option
                            key={item}
                            value={item}
                          >{item}
                          </Option>
                        ))
                      }
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='性别'
              >
                <div
                  id='sex'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('sex', {
                    rules: [{
                      required: false,
                    }],
                    initialValue: '',
                  })(
                    <Select
                      getPopupContainer={() => document.getElementById('sex')}
                    >
                      {
                        sexItems.map(item => (
                          <Option
                            key={item.optionKey}
                            value={item.optionKey.toString()}
                          >{item.optionValue}
                          </Option>
                        ))
                      }
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label = '部门'
              >
                <div
                  id='department'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('department', {
                    rules: [{
                      required: false,
                    }],
                    initialValue: '',
                  })(
                    <Select
                      getPopupContainer={() => document.getElementById('department')}
                    >
                      <Option value=''>全部</Option>
                      {
                        departmentList && departmentList.filter(item => !!item).map(item => (
                          <Option
                            key={item}
                            value={item}
                          >{item}
                          </Option>
                        ))
                      }
                    </Select>)}
                </div>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label = '报名状态'
              >
                <div
                  id='status'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('status', {
                    rules: [{
                      required: false,
                    }],
                    initialValue: '',
                  })(
                    <Select
                      getPopupContainer={() => document.getElementById('status')}
                    >
                      <Option value=''>全部</Option>
                      {
                        Object.keys(enrollStatus).map(item => (
                          <Option
                            key={item}
                            value={item}
                          >{enrollStatus[item]}
                          </Option>
                        ))
                      }
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem
                wrapperCol={{ span: 22 }}
              >
                {getFieldDecorator('userName', {
                  rules: [{
                    required: false
                  }],
                  initialValue: '',
                })(
                  <Input placeholder='姓名' />
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem>
                <Button
                  type='primary'
                  htmlType='submit'
                >查询
                </Button>
                {btnRole.includes('export') && (
                  <Button
                    type='primary'
                    onClick={this._handleExport}
                  >导出
                  </Button>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Table
          className={styles['c-table-center']}
          columns={this.columns}
          dataSource={list}
          rowKey='signId'
          scroll={{ x: 1300 }}
          pagination= {pagination}
          onChange={this._handlePageChange}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.enroll.enrollList,
    page: state.enroll.enrollPage,
    activityList: state.enroll.activityList,
    departmentList: state.enroll.departmentList,
    auths: state.common.auths,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Enroll))

