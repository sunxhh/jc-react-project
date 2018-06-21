import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getBookList, getBookDetail, bookHandle } from './reduck'
import { Link } from 'react-router-dom'
import { Select, Table, Input, Form, Row, Col, Button, DatePicker, Divider } from 'antd'
import ParamsUtil from 'Utils/params'
import { baseUrl } from '../../../../config'
import { showModalWrapper } from 'Components/modal/ModalWrapper'
import BookDetail from './bookDetail'
import { genPagination } from 'Utils/helper'

const Option = Select.Option
const { RangePicker } = DatePicker
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

const processResult = {
  '0': '待处理',
  '1': '已安排',
  '2': '无人接听',
  '3': '号码错误',
  '4': '关闭'
}

class Book extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reqBean: {
        name: '',
        phone: '',
        processResult: '',
        startReservedDate: '',
        endReservedDate: '',
        currentPage: 1
      },
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(getBookList(this.state.reqBean))
  }

  columns = [
    {
      key: 'rowNo',
      title: '序号',
      dataIndex: 'rowNo',
      render: (text, record, index) => {
        const { pageSize, currentPage } = this.props.page
        return (
          <span>{
            pageSize *
            currentPage +
            (index + 1) -
            pageSize
          }
          </span>
        )
      }
    },
    {
      key: 'name',
      title: '姓名',
      dataIndex: 'name',
    },
    {
      key: 'phone',
      title: '电话',
      dataIndex: 'phone',
    },
    {
      key: 'courseName',
      title: '预约课程',
      dataIndex: 'courseName'
    },
    {
      key: 'reservedTime',
      title: '预约时间',
      dataIndex: 'reservedTime'
    },
    {
      key: 'processResult',
      title: '状态',
      dataIndex: 'processResult',
      render: (text, record, index) => (
        <span>{processResult[text]}</span>
      )
    },
    {
      key: 'remark',
      title: '备注',
      dataIndex: 'remark',
      width: '20%'
    },
    {
      key: 'operate',
      title: '操作',
      dataIndex: 'operate',
      render: (text, record, index) => {
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        return (
          <span>
            {
              btnRole.includes('check') &&
                <Link
                  to='#'
                  onClick={() => this._handleDetail(record, '0')}
                >查看
                </Link>
            }
            {
              btnRole.includes('check') &&
              ((btnRole.includes('handle') && record.processResult === '0') || (btnRole.includes('handle') && record.processResult === '2')) &&
              <Divider type='vertical' />
            }
            {((btnRole.includes('handle') && record.processResult === '0') || (btnRole.includes('handle') && record.processResult === '2')) && (
              <a size='small'><span onClick={() => this._handleDetail(record, '1')}>立即处理</span></a>
            )}
          </span>
        )
      }
    }
  ]

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const newReqBean = {
          name: values.name,
          phone: values.phone,
          processResult: values.processResult,
          startReservedDate: !values.reservedDate && values.reservedDate !== '' ? values.reservedDate[0].format('YYYY-MM-DD') : '',
          endReservedDate: !values.reservedDate && values.reservedDate !== '' ? values.reservedDate[1].format('YYYY-MM-DD') : '',
          currentPage: 1
        }
        this.setState({
          reqBean: newReqBean
        }, () => {
          this.props.dispatch(getBookList(this.state.reqBean))
        })
      }
    })
  }

  _handlePageChange = (pages) => {
    const { reqBean } = this.state
    this.setState({
      reqBean: Object.assign({}, this.state.reqBean, { currentPage: (reqBean.pageSize !== pages.pageSize) ? 1 : pages.current, pageSize: pages.pageSize })
    }, () => {
      this.props.dispatch(getBookList(this.state.reqBean))
    })
  }

  _handleExport = () => {
    const { reqBean } = this.state
    const reqBody = {
      name: reqBean.name || '',
      phone: reqBean.phone || '',
      processResult: reqBean.processResult || '',
      startReservedDate: reqBean.startReservedDate || '',
      endReservedDate: reqBean.endReservedDate || '',
    }
    const params = ParamsUtil.json2url(reqBody)
    let url = (baseUrl === '/') ? `http://${location.host}` : baseUrl
    let newUrl = `${url}/api/prime/reserved/export?${params}`
    location.href = newUrl
  }

  _handleDetail = (record = {}, isHandle) => {
    this.props.dispatch(getBookDetail({ id: record.id })).then(res => {
      if (res) {
        showModalWrapper(
          <BookDetail
            dataSource={res}
            tableSource={res.processRecord}
            isHandle={isHandle}
            onSubmit={(values) => {
              const reqBean = {
                id: record.id,
                processResult: values.processResult,
                remark: values.remark
              }
              return this.props.dispatch(bookHandle({ primeReserved: reqBean })).then(res => {
                this.props.dispatch(getBookList(this.state.reqBean))
                return res
              })
            }}
          />,
          {
            title: '预约管理'
          }
        )
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { list, page } = this.props
    const { auths, match } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    const pagination = genPagination({ ...page, pageNo: page.currentPage, records: page.totalCount })
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='姓名'
              >
                {getFieldDecorator('name', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: '',
                })(
                  <Input placeholder='姓名' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='电话'
              >
                {getFieldDecorator('phone', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: '',
                })(
                  <Input placeholder='电话' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='状态'
              >
                <div
                  id='processResult'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('processResult', {
                    rules: [{
                      required: false,
                    }],
                    initialValue: '',
                  })(
                    <Select
                      getPopupContainer={() => document.getElementById('processResult')}
                    >
                      <Option value=''>全部</Option>
                      <Option value='0'>待处理</Option>
                      <Option value='1'>已安排</Option>
                      <Option value='2'>无人接听</Option>
                      <Option value='3'>号码错误</Option>
                      <Option value='4'>关闭</Option>
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
          </Row>
          <Row className='search-form'>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label = '预约时间'
              >
                <div
                  id='reservedDate'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('reservedDate', {
                    rules: [{
                      required: false,
                    }],
                    initialValue: '',
                  })(
                    <RangePicker
                      style={{ width: '100%' }}
                      format='YYYY-MM-DD'
                      // showTime={{ format: 'HH:mm:ss' }}
                      getCalendarContainer={() => document.getElementById('reservedDate')}
                    />)}
                </div>
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem>
                <Button
                  type='primary'
                  htmlType='submit'
                >查询
                </Button>
                {
                  btnRole.includes('export') &&
                  <Button
                    type='primary'
                    onClick={this._handleExport}
                  >
                    导出
                  </Button>
                }
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Table
          columns={this.columns}
          dataSource={list}
          rowKey='id'
          pagination= {pagination}
          onChange={this._handlePageChange}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.book.bookList,
    page: state.book.page,
    auths: state.common.auths,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Book))
