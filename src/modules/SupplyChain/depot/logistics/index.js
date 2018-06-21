import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Table, Input, Select, Form, Row, Col, DatePicker, message, Alert } from 'antd'
import { getSortList, orderNumAdd, orderNumModify, getPrintIp, sortPrintList, handlePrint, getLogList, handleWaybillPrint } from '../sortListManage/reduck'
import { Link } from 'react-router-dom'
import { isEmpty } from '../../../../utils/lang'
import { queryOrgByLevel } from 'Global/action'
import { showModalForm } from '../../../../components/modal/ModalForm'
import { genPagination } from 'Utils/helper'
import * as urls from 'Global/urls'
import moment from 'moment'

const Option = Select.Option
const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}
const orderType = {
  '1': '电商分拣单',
  '2': '调拨分拣单',
}

const operatorStatus = {
  '1': '待分拣',
  '2': '分拣中',
  '3': '分拣完成'
}

class SortList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      selectedRowKeys: [],
    }
  }

  getSortListReq = (orgCode) => {
    const { dispatch, list, preRouter, orgLevel } = this.props
    if ((isEmpty(list) || !(preRouter && preRouter.startsWith(urls.SUPPLY_SORT_MANAGE)))) {
      dispatch(getSortList({ currentPage: 1, pageSize: 10, warehouseNo: orgLevel === '2' ? orgCode : '' }))
    }
  }

  componentWillMount() {
    const { dispatch, orgLevel, orgCode } = this.props
    if (orgLevel === '') {
      dispatch(queryOrgByLevel()).then(res => {
        res && this.getSortListReq(res.myOrgCode)
      })
    } else {
      this.getSortListReq(orgCode)
    }
    dispatch(getPrintIp())
    dispatch(getLogList())
    // dispatch(queryOrgByLevel()).then(res => {
    //   if (res.myOrgLevel !== '2') {
    //     dispatch(getSortList(this.state.reqBean))
    //   } else {
    //     this.setState({ reqBean: Object.assign({}, this.state.reqBean, { warehouseNo: res.myOrgCode }) }, () => {
    //       dispatch(getSortList(this.state.reqBean))
    //     })
    //   }
    // })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.list !== nextProps.list) {
      this.setState({
        dataSource: nextProps.list
      })
    }
  }

  _genFilterFields = () => {
    const { orgLevel } = this.props
    const _columns = [
      {
        key: 'rowNo',
        title: '编号',
        dataIndex: 'rowNo',
        render: (text, record, index) => {
          const { pageSize, pageNo } = this.props.page
          return (
            <span>{
              pageSize *
              pageNo +
              (index + 1) -
              pageSize
            }
            </span>
          )
        }
      },
      {
        key: 'sortOrderId',
        title: '单据编号',
        dataIndex: 'sortOrderId',
        render: (text, record, index) => {
          return (
            <Link
              to={`/supplyChain/depot/sort/detail/${record.sortOrderId}`}
            >{text}
            </Link>
          )
        }
      },
      {
        key: 'sortOrderType',
        title: '单据类型',
        dataIndex: 'sortOrderType',
        render: (text, record, index) => (
          <span>{orderType[text]}</span>
        )
      },
      {
        key: 'operateStatus',
        title: '操作状态',
        dataIndex: 'operateStatus',
        render: (text, record, index) => (
          <span>{operatorStatus[text]}</span>
        )
      },
      {
        key: 'receiveUserName',
        title: '收件人',
        dataIndex: 'receiveUserName',
      },
      {
        key: 'receiveUserTelephone',
        title: '收件人电话',
        dataIndex: 'receiveUserTelephone',
      },
      {
        key: 'receiveUserAddress',
        title: '收件人地址',
        dataIndex: 'receiveUserAddress',
        render: (text, record, index) => {
          return (
            <span>
              {record.receiveUserProvince}
              {record.receiveUserCity}
              {text}
            </span>
          )
        }
      },
      {
        key: 'outOrderIdList',
        title: '订单编号',
        dataIndex: 'outOrderIdList',
        render: (text, record, index) => {
          const length = text && text.length
          return text && text.map((item, index) => {
            if (index === length - 1) {
              return <span key={index}>{item}</span>
            } else {
              return <span key={index}>{item} / </span>
            }
          })
        }
      },
      {
        key: 'logisOrderId',
        title: '物流单号',
        dataIndex: 'logisOrderId',
      },
      {
        key: 'logisticsId',
        title: '物流公司',
        dataIndex: 'logisticsId',
        render: (text, record, index) => {
          const { logistics } = this.props
          return (
            <div id='logisticsId' style={{ position: 'relative' }}>
              <Select
                placeholder='请选择物流公司'
                value={text}
                style={{ width: 150 }}
                getPopupContainer={() => document.getElementById('logisticsId')}
                onChange={value => this._handleCellChange(value, record.sortOrderId, 'logisticsId')}
              >
                {
                  logistics && logistics.map(item => (
                    <Option value={item.value} key={item.value}>{item.name}</Option>
                  ))
                }
              </Select>
            </div>
          )
        }
      },
      {
        key: 'warehouseName',
        title: '仓库部门',
        dataIndex: 'warehouseName',
      },
      {
        key: 'sorterName',
        title: '分拣人',
        dataIndex: 'sorterName',
        render: (text, record, index) => {
          return record && record.operateStatus !== '1' && (
            <span>
              {text}
            </span>
          )
        }
      },
      {
        key: 'operateTime',
        title: '操作时间',
        dataIndex: 'operateTime',
      },
    ]
    if (orgLevel === '2') { // 二级机构
      _columns.push({
        key: 'operate',
        title: '操作',
        dataIndex: 'operate',
        render: (text, record, index) => {
          const { auths, match } = this.props
          const btnRole = auths[match.path] ? auths[match.path] : []
          if (record.operateStatus === '1') {
            return btnRole.includes('begin') ? <Link to={`/supplyChain/depot/sort/pick/${record.sortOrderId}`}>开始分拣</Link> : ''
          } else if (record.operateStatus === '2') {
            return btnRole.includes('continue') ? <Link to={`/supplyChain/depot/sort/continue/${record.sortOrderId}`}>继续分拣</Link> : ''
          } else if (record.operateStatus === '3' && isEmpty(record.logisOrderId)) {
            return btnRole.includes('add') ? <a onClick={() => this._handleAddOrder(record.sortOrderId)}>添加运单号</a> : ''
          } else if (record.operateStatus === '3' && !isEmpty(record.logisOrderId)) {
            return btnRole.includes('edit') ? <a onClick={() => this._handleModifyOrder(record.sortOrderId, record.logisOrderId)}>修改运单号</a> : ''
          }
        }
      })
    }
    return _columns
  }

  _handleModifyOrder = (sortOrderId, logisOrderId) => {
    showModalForm({
      title: '修改运单号',
      fields: [
        {
          id: 'logisOrderId',
          placeHolder: '请输入物流单号',
          props: {
            label: '物流单号'
          },
          options: {
            rules: [{
              required: true,
              message: '请输入物流单号',
            }],
            initialValue: logisOrderId
          },
        }
      ],
      onOk: values => {
        this.props.dispatch(orderNumModify({ sortOrderId: sortOrderId, logisOrderId: values.logisOrderId })).then(res => {
          if (res) {
            this.props.dispatch(getSortList(this.state.reqBean))
          }
        })
      }
    })
  }

  _handleAddOrder = (sortOrderId) => {
    showModalForm({
      title: '添加运单号',
      fields: [
        {
          id: 'logisOrderId',
          placeHolder: '请输入物流单号',
          props: {
            label: '物流单号'
          },
          options: {
            rules: [{
              required: true,
              message: '请输入物流单号',
            }]
          },
        }
      ],
      onOk: values => {
        this.props.dispatch(orderNumAdd({ sortOrderId: sortOrderId, logisOrderId: values.logisOrderId })).then(res => {
          if (res) {
            this.props.dispatch(getSortList(this.state.reqBean))
          }
        })
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { filter } = this.props
        const newReqBean = {
          sortOrderId: values.sortOrderId ? values.sortOrderId.replace(/(^\s+)|(\s+$)/g, '') : '',
          sortOrderType: values.sortOrderType,
          operateStatus: values.operateStatus,
          warehouseNo: values.warehouseNo,
          outerOrderId: values.outerOrderId ? values.outerOrderId.replace(/(^\s+)|(\s+$)/g, '') : '',
          logisOrderId: values.logisOrderId ? values.logisOrderId.replace(/(^\s+)|(\s+$)/g, '') : '',
          sorterName: values.sorterName ? values.sorterName.replace(/(^\s+)|(\s+$)/g, '') : '',
          startTime: values.time && !isEmpty(values.time) && values.time[0] !== '' ? values.time[0].format('YYYY-MM-DD') : '',
          endTime: values.time && !isEmpty(values.time) && values.time[1] !== '' ? values.time[1].format('YYYY-MM-DD') : '',
          currentPage: 1,
          pageSize: filter.pageSize
        }
        this.props.dispatch(getSortList({ ...newReqBean }))
      }
    })
  }

  _handlePageChange = (pagination) => {
    window.scrollTo(0, 0)
    const { current, pageSize } = pagination
    const { page, filter } = this.props
    this.setState({
      selectedRowKeys: []
    })
    this.props.dispatch(getSortList({ ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize: pageSize }))
  }

  // _handleDelete = (skuNo, warehouseNo) => {
  //   const { dispatch } = this.props
  //   dispatch(handleDelete({ skuNo: skuNo, warehouseNo: warehouseNo })).then(res => {
  //     if (res) {
  //       dispatch(getSortList(this.state.reqBean))
  //     }
  //   })
  // }

  _onSelectChange = (sortOrderIds) => {
    this.setState({
      selectedRowKeys: sortOrderIds
    })
  }

  _handleA4Print = () => {
    const { selectedRowKeys, dispatch, printIp } = this.props
    dispatch(sortPrintList({ sortOrderIdList: selectedRowKeys })).then(res => {
      if (!isEmpty(res)) {
        message.success('正在打印...', 2, () => {
          res.map(item => {
            dispatch(handlePrint(`${printIp}api/printer/sorting`, { title: item.warehouseName + '分拣单', docNum: item.sortOrderId, sortOrderId: !isEmpty(item.detailList) && item.detailList[0].outerOrderId, receiverUserName: item.receiveUserName, receiverUserTelephone: item.receiveUserTelephone, receiverUserAddress: item.receiveUserAddress, sorting: item.detailList }))
          })
        })
      }
    })
  }

  _handleCellChange = (value, key, column) => {
    const finalDataSource = [...this.state.dataSource]
    let target = finalDataSource.filter(item => key === item.sortOrderId)[0]
    if (target) {
      target[column] = value
      this.setState({ dataSource: finalDataSource })
    }
  }

  _handleWaybillPrint = () => {
    const { dataSource, selectedRowKeys } = this.state
    const { dispatch, filter, printIp } = this.props
    const finalReq = []
    selectedRowKeys && selectedRowKeys.map(item => {
      dataSource && dataSource.map(ele => {
        if (item === ele.sortOrderId) {
          finalReq.push({
            sortOrderId: ele.sortOrderId,
            logisticsId: ele.logisticsId
          })
        }
      })
    })
    dispatch(handleWaybillPrint({ sortOrderList: finalReq })).then(res => {
      if (res) {
        message.success('正在打印...', 2, () => {
          dispatch(handlePrint(`${printIp}api/printer/wayBill`, { wayBills: res })).then(data => {
            if (data) {
              this.props.dispatch(getSortList({ ...filter }))
            }
          })
        })
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { page, showListSpin, orgLevel, orgList, orgCode, orgName, filter } = this.props
    const { dataSource, selectedRowKeys } = this.state
    const pagination = genPagination(page)
    const _columns = this._genFilterFields()
    const _rowSelection = {
      selectedRowKeys,
      onChange: this._onSelectChange,
    }
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='单据编号'
              >
                {getFieldDecorator('sortOrderId', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: filter && filter.sortOrderId,
                })(
                  <Input placeholder='单据编号' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='单据类型'
              >
                <div
                  id='sortOrderType'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('sortOrderType', {
                    rules: [{
                      required: false,
                    }],
                    initialValue: filter && filter.sortOrderType,
                  })(
                    <Select
                      placeholder='请选择单据类型'
                      getPopupContainer={() => document.getElementById('sortOrderType')}
                    >
                      <Option value=''>全部</Option>
                      <Option value='1'>电商分拣单</Option>
                      <Option value='2'>调拨分拣单</Option>
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='操作状态'
              >
                <div
                  id='operateStatus'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('operateStatus', {
                    rules: [{
                      required: false,
                    }],
                    initialValue: filter && filter.operateStatus,
                  })(
                    <Select
                      placeholder='请选择操作状态'
                      getPopupContainer={() => document.getElementById('operateStatus')}
                    >
                      <Option value=''>全部</Option>
                      <Option value='1'>待分拣</Option>
                      <Option value='2'>分拣中</Option>
                      <Option value='3'>分拣完成</Option>
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='仓库部门'
              >
                <div
                  id='warehouseNo'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('warehouseNo', {
                    rules: [{
                      required: false,
                    }],
                    initialValue: orgLevel === '2' ? orgCode : (filter && filter.warehouseNo)
                  })(
                    <Select
                      disabled={orgLevel === '2' ? Boolean(1) : Boolean(0)}
                      showSearch={false}
                      optionFilterProp='children'
                      placeholder='请选择仓库部门'
                      getPopupContainer={() => document.getElementById('warehouseNo')}
                    >
                      <Option key='' value=''>全部</Option>
                      {
                        orgLevel && orgLevel === '2' ? (<Option value={orgCode}>{orgName}</Option>) : (
                          orgList && orgList.map(item => {
                            return (
                              <Option key={item.orgCode} value={item.orgCode}>
                                {item.orgName}
                              </Option>
                            )
                          })
                        )
                      }
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='订单编号'
              >
                {getFieldDecorator('outerOrderId', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: filter && filter.outerOrderId,
                })(
                  <Input placeholder='订单编号' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='物流单号'
              >
                {getFieldDecorator('logisOrderId', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: filter && filter.logisOrderId,
                })(
                  <Input placeholder='物流单号' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='分拣人'
              >
                {getFieldDecorator('sorterName', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: filter && filter.sorterName,
                })(
                  <Input placeholder='分拣人' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='操作时间'
              >
                <div
                  id='time'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('time', {
                    rules: [{
                      required: false,
                    }],
                    initialValue: [
                      filter && filter.startTime ? moment(filter.startTime) : '',
                      filter && filter.endTime ? moment(filter.endTime) : ''
                    ],
                  })(
                    <RangePicker
                      style={{ width: '100%' }}
                      format='YYYY-MM-DD'
                      placeholder={['开始日期', '结束日期']}
                      showTime={{ hideDisabledOptions: true }}
                      getCalendarContainer={() => document.getElementById('time')}
                    />
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                style={{ marginLeft: '30px' }}
              >
                <Button
                  type='primary'
                  htmlType='submit'
                >查询
                </Button>
                <Button
                  title='A4打印'
                  type='primary'
                  disabled = {selectedRowKeys.length !== 0 ? 0 : 1}
                  onClick={this._handleA4Print}
                >
                  A4打印
                </Button>
                <Button
                  title='运单打印'
                  type='primary'
                  disabled = {selectedRowKeys.length !== 0 ? 0 : 1}
                  onClick={this._handleWaybillPrint}
                >
                  运单打印
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div style={{ marginBottom: '10px', width: '25%' }}>
          <Alert message='打印须在当前页操作' type='warning' />
        </div>
        <Table
          columns={_columns}
          dataSource={dataSource}
          onChange={this._handlePageChange}
          rowSelection= {_rowSelection}
          rowKey='sortOrderId'
          scroll = {{ x: 2000 }}
          pagination={pagination}
          loading={showListSpin}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auths: state.common.auths,
    showListSpin: state.common.showListSpin,
    orgCode: state.common.orgCode,
    orgLevel: state.common.orgLevel,
    orgName: state.common.orgName,
    orgList: state.common.orgList,
    list: state.supplyChain.sortList.sortList,
    page: state.supplyChain.sortList.sortPage,
    filter: state.supplyChain.sortList.filter,
    preRouter: state.router.pre,
    printIp: state.supplyChain.sortList.printIp,
    logistics: state.supplyChain.sortList.logistics,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(SortList))
