import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from './reduck'
import { Form, Input, Select, Row, Col, Button, Table, Popover } from 'antd'
import styles from './index.less'
import * as urls from 'Global/urls'
import { isEmpty } from '../../../utils/lang'
import { genPagination } from 'Utils/helper'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

// 订单类型
const orderType = {
  '1': '报班',
  '2': '退班',
  '3': '购教材',
  '4': '退教材'
}

// 支付方式
const payStyle = {
  '1': '金诚币',
  '2': '银行卡'
}

class handleList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRowKeys: [],
      loading: false,
      orderType: '',
      orderStatus: '',
    }
  }

  // 生命周期， 初始化表格数据
  componentDidMount() {
    this.props.dispatch(actions.sellUser())
    this.props.dispatch(actions.getOrgList())
    this._handleAction(1)
  }

  // 获取查询条件里面的 value 值
  _getQueryParameter = (currentPage = this.props.page.paegNo, pageSize = this.props.page.pageSize) => {
    const { form } = this.props
    const formData = form.getFieldsValue()
    return {
      currentPage: currentPage,
      pageSize: pageSize,
      orgId: formData.orgId ? formData.orgId : '',
      studentName: formData.studentName ? formData.studentName : '',
      linkPhone: formData.linkPhone ? formData.linkPhone : '',
      order: {
        orderNo: formData.orderNo ? formData.orderNo : '',
        orderType: formData.orderType ? formData.orderType : '',
        orderSalerId: formData.orderSalerId ? formData.orderSalerId : '',
        orderHandleId: formData.orderHandleId ? formData.orderHandleId : '',
        orderChargeType: formData.orderChargeType ? formData.orderChargeType : '',
      }
    }
  }
  // 列表查询ACTION
  _handleAction = (currentPage, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getQueryParameter(currentPage, pageSize)
    dispatch(actions.getOrderList(arg))
  }

  // 点击查询按钮时，根据参数获取表格数据
  _handleSubmit = (e) => {
    this._handleAction(1)
  }

  // 点击分页时获取表格数据
  _handlePageChange = (page) => {
    this._handleAction(page.current, page.pageSize)
  }

  // 表格项
  _columns = [
    {
      title: '订单号',
      width: 150,
      dataIndex: 'orderNo',
      key: 'orderNo',
      fixed: 'left',
    },
    {
      title: '编号',
      width: 100,
      dataIndex: 'studentNo',
      key: 'studentNo'
    },
    {
      title: '姓名',
      width: 120,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '性别',
      width: 80,
      dataIndex: 'sex',
      key: 'sex',
      render: (text) => {
        return (
          <span>
            {
              text && text === '1' ? '女' : '男'
            }
          </span>
        )
      }
    },
    {
      title: '联系电话',
      width: 130,
      dataIndex: 'linkPhone',
      key: 'linkPhone'
    },
    {
      title: '班级名称',
      width: 160,
      dataIndex: 'orderClassName',
      key: 'orderClassName',
      render: (text) => {
        return (
          <Popover
            content = {<div className={styles['pop']}>{text}</div>}
            title = '班级名称'
          >
            <span>{text && text.length > 15 ? `${text.substring(0, 15)}...` : text}</span>
          </Popover>)
      },
    },
    {
      title: '订单类型',
      width: 100,
      dataIndex: 'orderType',
      key: 'orderType',
      render: (text) => {
        return (
          text ? orderType[text] : ''
        )
      }
    },
    {
      title: '交易内容',
      dataIndex: 'orderDesc',
      width: 250,
      key: 'orderDesc',
      render: (text) => {
        return (
          <Popover
            content = {<div className={styles['pop']}>{text}</div>}
            title = '交易内容'
          >
            <span>{text && text.length > 18 ? `${text.substring(0, 18)}...` : text}</span>
          </Popover>)
      },
    },
    {
      title: '学费',
      width: 100,
      dataIndex: 'detailMoney',
      key: 'detailMoney',
    },
    {
      title: '优惠',
      width: 100,
      dataIndex: 'detailDiscount',
      key: 'detailDiscount',
    },
    {
      title: '教材费',
      width: 100,
      dataIndex: 'orderBookMoney',
      key: 'orderBookMoney'
    },
    {
      title: '总计',
      width: 100,
      dataIndex: 'orderMoney',
      key: 'orderMoney'
    },
    {
      title: '支付方式',
      width: 100,
      dataIndex: 'orderChargeType',
      key: 'orderChargeType',
      render: (text) => {
        return (
          text ? payStyle[text] : ''
        )
      }
    },
    {
      title: '剩余课时',
      width: 100,
      dataIndex: 'resHour',
      key: 'resHour'
    },
    {
      title: '剩余学费',
      width: 100,
      dataIndex: 'resMoney',
      key: 'resMoney'
    },
    {
      title: '销售员',
      width: 170,
      dataIndex: 'salerName',
      key: 'salerName',
      render: (text) => {
        return (
          <Popover
            content = {<div className={styles['pop']}>{text}</div>}
            title = '销售员'
          >
            <span>{text && text.length > 8 ? `${text.substring(0, 8)}...` : text}</span>
          </Popover>)
      },
    },
    {
      title: '经办人',
      width: 170,
      dataIndex: 'handleName',
      key: 'handleName',
      render: (text) => {
        return (
          <Popover
            content = {<div className={styles['pop']}>{text}</div>}
            title = '经办人'
          >
            <span>{text && text.length > 8 ? `${text.substring(0, 8)}...` : text}</span>
          </Popover>)
      },
    },
    {
      title: '所属机构',
      width: 170,
      dataIndex: 'orgName',
      key: 'orgName',
      render: (text) => {
        return (
          <Popover
            content = {<div className={styles['pop']}>{text}</div>}
            title = '所属机构'
          >
            <span>{text && text.length > 8 ? `${text.substring(0, 8)}...` : text}</span>
          </Popover>)
      },
    },
    {
      title: '办理时间',
      key: 'createTime',
      dataIndex: 'createTime',
      width: 170,
    },
  ]

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      orderStatus: selectedRows[0] && selectedRows[0].orderStatus ? selectedRows[0].orderStatus + '' : '',
      orderType: selectedRows[0] && selectedRows[0].orderType ? selectedRows[0].orderType + '' : ''
    })
  }
  // 跳转
  _goLink = (type, hasSelected) => {
    switch (type) {
      case '1':
        return (
          <Button
            type='primary'
            disabled={!hasSelected}
          >
            <Link to={`${urls.HANDLE_CENTER_BACKOUT_CLASSROOM}/${this.state.selectedRowKeys[0]}`}>
              退班
            </Link>
          </Button>
        )
      case '2':
        return (
          <Button
            type='primary'
            disabled={!hasSelected}
          >
            <Link to={`${urls.HANDLE_CENTER_CHANGE_CLASSROOM}/${this.state.selectedRowKeys[0]}`}>转班</Link>
          </Button>
        )
      case '3':
        return (
          <Button
            type='primary'
            disabled={!hasSelected}
          >
            <Link to={`${urls.HANDLE_CENTER_BACK_TEXTBOOK}/${this.state.selectedRowKeys[0]}`}>退教材</Link>
          </Button>
        )
    }
  }
  render() {
    const { selectedRowKeys } = this.state
    const rowSelection = {
      type: 'radio',
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const hasSelected = selectedRowKeys.length > 0 && this.state.orderType === '1' && this.state.orderStatus === '1'
    const hasSelected1 = selectedRowKeys.length > 0 && this.state.orderType === '3' && this.state.orderStatus === '1'
    const { getFieldDecorator } = this.props.form
    const {
      sellUser,
      orgList,
      orderList,
      page,
      showListSpin,
      auths,
      match,
      orgLevel,
      orgId
    } = this.props
    const authState = (isEmpty(auths) || isEmpty(auths[match.path])) ? [] : auths[match.path]
    const pagination = genPagination(page)
    return (
      <div>
        <div className={styles['search-container']}>
          <Form>
            <Row>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='订单号'
                >
                  {getFieldDecorator('orderNo')(
                    <Input
                      placeholder='请输入编号'
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='姓名'
                >
                  {getFieldDecorator('studentName')(
                    <Input
                      placeholder='请输入姓名'
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='联系电话'
                >
                  {getFieldDecorator('linkPhone')(
                    <Input
                      placeholder='请输入联系电话'
                    />
                  )}
                </FormItem>
              </Col>
              <Col
                span={6}
                id='orgId'
              >
                <FormItem
                  {...formItemLayout}
                  label='所属机构'
                >
                  {getFieldDecorator('orgId', {
                    initialValue: orgLevel === '2' ? orgId : '',
                  })(
                    <Select
                      getPopupContainer={() => document.getElementById('orgId')}
                      placeholder='请选择所属机构'
                      howSearch={true}
                      disabled = {orgLevel === '2'}
                    >
                      <Option
                        key='-1'
                        value=''
                      >全部
                      </Option>
                      {
                        orgList && orgList.map((item) => {
                          return (
                            <Option
                              key={item.id}
                              value={item.id}
                            >
                              {item.orgName}
                            </Option>
                          )
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col
                span={6}
                id='orderType'
              >
                <FormItem
                  {...formItemLayout}
                  label='订单类型'
                >
                  {getFieldDecorator('orderType')(
                    <Select
                      allowClear
                      placeholder='请选择订单类型'
                      getPopupContainer={() => document.getElementById('orderType')}
                    >
                      {
                        Object.keys(orderType).map((key) => {
                          return (
                            <Option
                              key={key}
                              value={key}
                            >
                              {orderType[key]}
                            </Option>
                          )
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col
                span={6}
                id='orderSalerId'
              >
                <FormItem
                  {...formItemLayout}
                  label='销售员'
                >
                  {getFieldDecorator('orderSalerId')(
                    <Select
                      allowClear
                      placeholder='请选择销售员'
                      getPopupContainer={() => document.getElementById('orderSalerId')}
                    >
                      {
                        sellUser && sellUser.map((item) => {
                          return (
                            <Option
                              key={item.uuid}
                              value={item.uuid}
                            >
                              {item.fullName}
                            </Option>
                          )
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col
                span={6}
                id='orderHandleId'
              >
                <FormItem
                  {...formItemLayout}
                  allowClear
                  label='经办人'
                >
                  {getFieldDecorator('orderHandleId')(
                    <Select
                      placeholder='请选择经办人'
                      getPopupContainer={() => document.getElementById('orderHandleId')}
                    >
                      {
                        sellUser && sellUser.map((item) => {
                          return (
                            <Option
                              key={item.uuid}
                              value={item.uuid}
                            >
                              {item.fullName}
                            </Option>
                          )
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col
                span={6}
                id='orderChargeType'
              >
                <FormItem
                  {...formItemLayout}
                  allowClear
                  label='支付方式'
                >
                  {getFieldDecorator('orderChargeType')(
                    <Select
                      placeholder='请选择支付方式'
                      getPopupContainer={() => document.getElementById('orderChargeType')}
                    >
                      {
                        Object.keys(payStyle).map((key) => {
                          return (
                            <Option
                              key={key}
                              value={key}
                            >
                              {payStyle[key]}
                            </Option>
                          )
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row className='operate-btn'>
              <Col
                className={styles['btn-style']}
                span={24}
              >
                <Button
                  onClick={this._handleSubmit}
                  type='primary'
                >
                  查询
                </Button>
                {
                  authState.indexOf('add') !== -1 && (
                    <Link to={`${urls.HANDLE_CENTER_ADD_CLASSROOM}`}>
                      <Button
                        type='primary'
                      >
                        报班
                      </Button>
                    </Link>
                  )
                }
                {
                  authState.indexOf('buyBook') !== -1 && (
                    <Link to={`${urls.HANDLE_CENTER_BUY_TEXTBOOK}`}>
                      <Button
                        type='primary'
                      >
                        购教材
                      </Button>
                    </Link>
                  )
                }
                {authState.indexOf('backClass') !== -1 && this._goLink('1', hasSelected)}
                {authState.indexOf('changeClass') !== -1 && this._goLink('2', hasSelected)}
                {authState.indexOf('backBook') !== -1 && this._goLink('3', hasSelected1)}
              </Col>
            </Row>
          </Form>
        </div>
        <Table
          rowSelection={rowSelection}
          columns={this._columns}
          scroll = {{ x: 2550 }}
          loading={showListSpin}
          onChange = {this._handlePageChange}
          dataSource={orderList ? orderList.map(item => {
            if (item.orderDetail && !isEmpty(item.orderDetail)) {
              const orderDetail = item.orderDetail.filter(item => item.detailObjType + '' === '1')
              if (orderDetail.length > 0) {
                item.detailMoney = orderDetail[0].detailMoney
                item.detailDiscount = orderDetail[0].detailDiscount
              }
            }
            return item
          }) : ''}
          rowKey='id'
          locale={{
            emptyText: '暂无数据'
          }}
          pagination={pagination}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state.common.showListSpin,
    handleLoading: state.handleCenter.handleLoading,
    sellUser: state.handleCenter.sellUser,
    orgList: state.handleCenter.orgList,
    orgId: state.handleCenter.orgId,
    orgLevel: state.handleCenter.orgLevel,
    orderList: state.handleCenter.orderList,
    page: state.handleCenter.page,
    auths: state.common.auths,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(handleList))
