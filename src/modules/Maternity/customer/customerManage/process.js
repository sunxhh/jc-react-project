import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { Table, Form, Row, Col, Popover, Select, Button, DatePicker, Input } from 'antd'
import {
  getProcessList,
  getProcessCustomer,
  getProcessConditions,
  addProcess,
  modifyProcess,
  resetProcessCustomer,
  resetProcessList,
} from './reduck'
import style from './index.less'
import { isEmpty } from 'Utils/lang'
import { showModalForm } from 'Components/modal/ModalForm'

const FormItem = Form.Item
const SelectOption = Select.Option

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

class CustomerProcess extends Component {
  constructor(props) {
    super(props)
    this.state = {
      customerId: ''
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(resetProcessCustomer())
    dispatch(resetProcessList())
  }

  // 生命周期， 初始化表格数据
  componentWillMount() {
    const { dispatch, match } = this.props
    dispatch(getProcessConditions()).then((data) => {
      if (data.status === 'success') {
        if (match.params && match.params.id) {
          this.setState({ customerId: match.params.id }, () => {
            this._getList()
            dispatch(getProcessCustomer({ id: match.params.id }))
          })
        }
      }
    })
  }

  _columns = [
    {
      key: 'processType',
      title: '跟进方式',
      dataIndex: 'processType',
      render: (text, record) => (
        <span>{this._getProcessTypeName(text)}</span>
      )
    },
    {
      key: 'processTime',
      title: '跟进时间',
      dataIndex: 'processTime',
      render: (text) => {
        return (
          <Popover
            placement='topRight'
            content={<div className={style['pop']}>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</div>}
            title='创建时间'
          >
            <span>{text ? moment(text).format('YYYY-MM-DD') : ''}</span>
          </Popover>
        )
      }
    },
    {
      key: 'title',
      title: '标题',
      dataIndex: 'title',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'remark',
      title: '跟进内容',
      dataIndex: 'remark',
      width: 300,
      render: (text) => (
        <Popover
          placement='topRight'
          content={<div className={style['pop']}>{text}</div>}
          title='跟进内容'
        >
          <span>{text && text.length > 30 ? `${text.substring(0, 30)}...` : text}</span>
        </Popover>
      )
    }, {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 100,
      render: (text, record) => {
        return (
          <div className={style['table-ope']}>
            {
              <a
                href='javascript:;'
                onClick={(e) => { this._handleProcessEdit(e, record) }}
              >编辑
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
    dispatch(getProcessList(arg))
  }

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.page.current, pageSize = this.props.page.pageSize) => {
    const { customerId } = this.state
    return {
      customerId,
      currentPage: current,
      pageSize: pageSize,
    }
  }

  // 获取跟进状态
  _getProcessName = (value) => {
    if (!value) {
      return ''
    }
    const { processStatusList } = this.props
    const process = !isEmpty(processStatusList) && processStatusList.find((item) => {
      return value.toString() === item.value.toString()
    })
    return process && process.name ? process.name : ''
  }

  // 获取跟进方式状态
  _getProcessTypeName = (value) => {
    if (!value) {
      return ''
    }
    const { processTypeList } = this.props
    const process = !isEmpty(processTypeList) && processTypeList.find((item) => {
      return value.toString() === item.value.toString()
    })
    return process && process.name ? process.name : ''
  }

  // 获取客户来源
  _getSourceName = (value) => {
    if (!value) {
      return ''
    }
    const { sourceList } = this.props
    const source = !isEmpty(sourceList) && sourceList.find((item) => {
      return value.toString() === item.value.toString()
    })
    return source && source.name ? source.name : ''
  }

  disabledDate = (current) => {
    return current && current.valueOf() > Date.now()
  }

  // 获取跟进方式
  _generateProcessType = () => {
    const { processTypeList } = this.props
    return (
      <Select
        allowClear={false}
        optionLabelProp='title'
        filterOption={false}
        placeholder='请选择跟进方式'
        getPopupContainer={() => document.getElementsByClassName('ant-modal-wrap ')[0]}
      >
        {!isEmpty(processTypeList) ? processTypeList.map(d => (
          <SelectOption
            key={d.value}
            value={d.value}
            title={d.name}
          >
            {d.name}
          </SelectOption>
        )) : null}
      </Select>
    )
  }

  // 新增跟进记录
  _handleProcessAdd = () => {
    const { customerId } = this.state
    showModalForm({
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 }
      },
      title: '新增跟进记录',
      fields: [
        {
          id: 'title',
          props: {
            label: '标题：'
          },
          options: {
            rules: [{
              required: true,
              message: '请输入标题!'
            }]
          },
          element: (
            <Input
              maxLength='20'
              placeholder='请输入标题'
            />
          )
        },
        {
          id: 'processType',
          props: {
            label: '跟进方式：'
          },
          options: {
            rules: [{
              required: true,
              message: '请选择跟进方式!'
            }]
          },
          element: (
            this._generateProcessType()
          )
        }, {
          id: 'processTime',
          props: {
            label: '跟进时间：'
          },
          options: {
            rules: [{
              required: true,
              message: '请选择跟进时间!'
            }]
          },
          element: (
            <DatePicker
              format='YYYY-MM-DD'
              placeholder=''
              disabledDate={this.disabledDate}
              getCalendarContainer={() => document.getElementsByClassName('ant-modal-wrap ')[0]}
            />
          )
        },
        {
          id: 'remark',
          props: {
            label: '跟进内容：'
          },
          options: {
            rules: [{
              required: true,
              message: '请输入跟进内容!'
            }]
          },
          element: (
            <Input.TextArea
              maxLength={1000}
              style={{ height: '300px' }}
              placeholder='请输入跟进内容'
            />
          )
        }
      ],
      onOk: values => {
        const { dispatch } = this.props
        values.processTime = moment(values.processTime).format('YYYY-MM-DD HH:mm:ss')
        return dispatch(addProcess({ ...values, customerId })).then(res => {
          if (res.status === 'success') {
            this._getList()
            return res
          }
        })
      }
    })
  }

  // 编辑跟进记录
  _handleProcessEdit = (e, record) => {
    showModalForm({
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 }
      },
      title: '编辑跟进记录',
      fields: [
        {
          id: 'title',
          props: {
            label: '标题：'
          },
          options: {
            initialValue: record && record.title ? record.title : '',
            rules: [{
              required: true,
              message: '请输入标题!'
            }]
          },
          element: (
            <Input
              maxLength='20'
              placeholder='请输入标题'
            />
          )
        },
        {
          id: 'processType',
          props: {
            label: '跟进方式：'
          },
          options: {
            initialValue: record && record.processType ? record.processType : '',
            rules: [{
              required: true,
              message: '请选择跟进方式!'
            }]
          },
          element: (
            this._generateProcessType()
          )
        }, {
          id: 'processTime',
          props: {
            label: '跟进时间：'
          },
          options: {
            initialValue: record && record.processTime ? moment(record.processTime) : '',
            rules: [{
              required: true,
              message: '请选择跟进时间!'
            }]
          },
          element: (
            <DatePicker
              format='YYYY-MM-DD'
              placeholder=''
              getCalendarContainer={() => document.getElementsByClassName('ant-modal-wrap ')[0]}
            />
          )
        },
        {
          id: 'remark',
          props: {
            label: '跟进内容：'
          },
          options: {
            initialValue: record && record.remark ? record.remark : '',
            rules: [{
              required: true,
              message: '请输入跟进内容!'
            }]
          },
          element: (
            <Input.TextArea
              maxLength={1000}
              style={{ height: '300px' }}
              placeholder='请输入跟进内容'
            />
          )
        }
      ],
      onOk: values => {
        const { dispatch } = this.props
        values.processTime = moment(values.processTime).format('YYYY-MM-DD HH:mm:ss')
        return dispatch(modifyProcess({ ...values, id: record.id })).then(res => {
          if (res.status === 'success') {
            this._getList()
            return res
          }
        })
      }
    })
  }

  // 点击分页获取列表数据
  _handlePageChange = (current) => {
    this._getList(current)
  }

  render() {
    const { list, showListSpin, page, processCustomerInfo } = this.props
    return (
      <div>
        <Form>
          <Row>
            <Col span={8} >
              <h3 className={style['section-tit']}>基本信息</h3>
              <FormItem
                label='客户姓名：'
                {...formItemLayout}
              >
                <span className='ant-form-text'>{processCustomerInfo && processCustomerInfo.name}</span>
              </FormItem>
              <FormItem
                label='跟进状态：'
                {...formItemLayout}
              >
                <span className='ant-form-text'>{this._getProcessName(processCustomerInfo.process)}</span>
              </FormItem>
              <FormItem
                label='客户来源：'
                {...formItemLayout}
              >
                <span className='ant-form-text'>{this._getSourceName(processCustomerInfo.source)}</span>
              </FormItem>
              <FormItem
                label='预产期：'
                {...formItemLayout}
              >
                <span className='ant-form-text'>{(processCustomerInfo && processCustomerInfo.expectedTime) ? moment(processCustomerInfo.expectedTime).format('YYYY-MM-DD') : ''}</span>
              </FormItem>
              <FormItem
                label='已有宝宝数：'
                {...formItemLayout}
              >
                <span className='ant-form-text'>{processCustomerInfo.babyCount}</span>
              </FormItem>
              <FormItem
                label='胎次：'
                {...formItemLayout}
              >
                <span className='ant-form-text'>{processCustomerInfo.pregnantCount}</span>
              </FormItem>
              <FormItem
                label='创建人：'
                {...formItemLayout}
              >
                <span className='ant-form-text'>{processCustomerInfo.createUser}</span>
              </FormItem>
              <FormItem
                label='跟进人：'
                {...formItemLayout}
              >
                <span className='ant-form-text'>{processCustomerInfo.processorName}</span>
              </FormItem>
              <FormItem
                label='创建时间：'
                {...formItemLayout}
              >
                <span className='ant-form-text'>{(processCustomerInfo && processCustomerInfo.createTime) ? moment(processCustomerInfo.createTime).format('YYYY-MM-DD') : ''}</span>
              </FormItem>
            </Col>
            <Col span={6} offset={1}>
              {
                processCustomerInfo.picture &&
                <img src={`https://mallimg.easybao.com/${processCustomerInfo.picture}`} style ={{ width: '100px', height: '100px' }} />
              }
            </Col>
          </Row>
        </Form>
        <div>
          <Button
            href='javascript:;'
            type='primary'
            style={{ marginBottom: '10px' }}
            onClick={this._handleProcessAdd}
          >新增</Button>
          <Table
            className={style['c-table-center']}
            columns={this._columns}
            rowKey='id'
            dataSource={list}
            bordered={true}
            loading={showListSpin}
            pagination={{
              pageSize: page.pageSize,
              total: page.total,
              showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 条`,
              onChange: this._handlePageChange,
              ...page,
            }}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.customerManage.processList,
    page: state.customerManage.processPage,
    processInfo: state.customerManage.processInfo,
    processCustomerInfo: state.customerManage.processCustomerInfo,
    customerTypeList: state.customerManage.processConditions.customerTypeList,
    processStatusList: state.customerManage.processConditions.processStatusList,
    processTypeList: state.customerManage.processConditions.processTypeList,
    sourceList: state.customerManage.processConditions.sourceList,
    showListSpin: state.common.showListSpin,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CustomerProcess))
