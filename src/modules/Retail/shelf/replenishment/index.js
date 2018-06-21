import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
import { Button, Table, Form, Row, Col, Input, Select, DatePicker, Modal, message } from 'antd'
import Module from './module'
import { RETAIL_SHELF_REPLE_ADD, RETAIL_SHELF_REPLE_DETAIL } from 'Global/urls'
import { Link } from 'react-router-dom'
import { genPagination } from 'Utils/helper'
import styles from './style.less'
import { isEmpty } from 'Utils/lang'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  },
}

const repleStatus = {
  '1': '待补货',
  '2': '已完成',
}

const replePrintStatus = {
  '1': '正常',
  '2': '缺货',
}
const { RangePicker } = DatePicker

class ShelfRepleList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      page: {
        currentPage: 1,
        pageSize: 20
      },
      dataSource: [],
      printIn: {
        shelfName: '',
        createTime: '',
        replenishmentNo: ''
      }
    }
  }

  // 生命周期， 初始化表格数据
  componentWillMount() {
    const { dispatch } = this.props
    this._getList()
    dispatch(Module.actions.getShelfList())
  }

  componentWillUnmount() {
    this.props.dispatch(Module.actions.emptyList())
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.list !== nextProps.list) {
      this.setState({
        dataSource: nextProps.list && nextProps.list.map(item => ({
          ...item,
        }))
      })
    }
  }

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getParameter(current, pageSize)
    dispatch(Module.actions.getShelfRepleList(arg))
    this._setQueryParam(arg)
  }

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.page.pageNo, pageSize = this.props.page.pageSize) => {
    const { form, dispatch } = this.props
    const arg = form.getFieldsValue()
    dispatch(Module.actions.setQueryPar(arg))
    return {
      ...arg,
      startDate: arg.orderTime && arg.orderTime.length > 0 ? arg.orderTime[0].format('YYYY-MM-DD') : '',
      endDate: arg.orderTime && arg.orderTime.length > 0 ? arg.orderTime[1].format('YYYY-MM-DD') : '',
      currentPage: current,
      pageSize: pageSize,
    }
  }

  // 设置列表数据查询参数
  _setQueryParam = (queryParam) => {
    const { dispatch } = this.props
    dispatch(Module.actions.setQueryPar(queryParam))
  }

  // 删除
  _handleDelete = (event, record) => {
    if (record.status === '0') {
      const { dispatch } = this.props
      dispatch(Module.actions.deleteReple({ replenishmentUuid: record.replenishmentUuid })).then(status => {
        if (status) {
          this._getList()
        }
      })
    } else {
      Modal.confirm({
        title: '删除',
        content: '该补货单还未补货录入，是否继续删除操作?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          const { dispatch } = this.props
          dispatch(Module.actions.deleteReple({ replenishmentUuid: record.replenishmentUuid })).then(status => {
            if (status) {
              this._getList()
            }
          })
        },
        onCancel() {
        },
      })
    }
  }

  // 选中补货单
  _selectRepleDetail = (key, data) => {
    this.setState({ printIn: data[0] })
  }

  // 打印补货单
  _printRepleDetail = () => {
    if (this.state.printIn.shelfName !== '') {
      const { dispatch } = this.props
      dispatch(Module.actions.getShelfRepleDetailPrintList({
        replenishmentUuid: this.state.printIn.replenishmentUuid,
        currentPage: 1,
        pageSize: 1000,
      })).then((status) => {
        if (status) {
          const headstr = `<html><head><style type="text/css">h2 { font-size: 18px; color: #000000; text-align: center;padding: 10px 0; } .item-option { margin: 25px 0; list-style: none; display: flex;}  .item-option li { padding: 0 1%; display: block; width: 48%; text-align: left; } .item-option li label { color: #000000; } .item-option li.right { text-align: right; } .data-wrap {padding: 0 3%;} .noPrint{display: none}.PageNext{page-break-after:always;}</style></head><body>`
          const footstr = '</body>'
          const newstr = document.getElementById('print-wrap').innerHTML
          document.body.innerHTML = headstr + newstr + footstr
          window.print()
          window.location.reload()
        }
      })
    } else {
      message.error('请选择补货单')
    }
  }
  // 处理查询
  _handleQuery = () => {
    this._getList(1)
  }

  // 点击分页获取列表数据
  _handlePageChange = (page) => {
    if (this.props.page.pageSize === page.pageSize) {
      this._getList(page.current)
    } else {
      this._getList(1, page.pageSize)
    }
  }

  _columns = [
    {
      key: 'index',
      title: '序号',
      dataIndex: 'index',
      width: 50,
      render: (text, record, index) => {
        const { pageSize, pageNo } = this.props.page
        if (!isEmpty(pageSize) && !isEmpty(pageNo)) {
          return (
            <span>{(pageNo - 1) * pageSize + index + 1}</span>
          )
        }
      }
    },
    {
      key: 'replenishmentNo',
      title: '补货单编号',
      dataIndex: 'replenishmentNo',
      width: 100,
      render: (text, record) => {
        return (
          <Link to={`${RETAIL_SHELF_REPLE_DETAIL}/${record.replenishmentUuid}`}>
            {text}
          </Link>
        )
      }
    },
    {
      key: 'shelfName',
      title: '库存单位',
      dataIndex: 'shelfName',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'createTime',
      title: '生成日期',
      dataIndex: 'createTime',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'status',
      title: '补货状态',
      dataIndex: 'status',
      width: 80,
      render: (text) => {
        if (text && text !== 'null' && text === '1') {
          return (
            <span className={styles['c-red']}>{text && text !== 'null' && repleStatus[text]}</span>
          )
        } else {
          return (
            <span>{text && text !== 'null' && repleStatus[text]}</span>
          )
        }
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 80,
      render: (text, record, index) => {
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        return (
          <div className={styles['table-ope']}>
            {
              btnRole.includes('add') && record.status !== '2' &&
              <Link to={`${RETAIL_SHELF_REPLE_ADD}/${record.replenishmentUuid}`}>
                补货录入
              </Link>
            }
            {
              btnRole.includes('delete') && record.status !== '2' &&
              <a
                href='javascript:;'
                onClick={(e) => { this._handleDelete(e, record, index) }}
              >删除
              </a>

            }
          </div>
        )
      }
    }
  ]

  _printColumns = [
    {
      key: 'skuNo',
      title: 'SKU编码',
      dataIndex: 'skuNo'
    },
    {
      key: 'goodsName',
      title: '品名',
      dataIndex: 'goodsName'
    },
    {
      key: 'salePrice',
      title: '门店零售价',
      dataIndex: 'salePrice'
    },
    {
      key: 'stockStatus',
      title: '状态',
      dataIndex: 'stockStatus',
      width: 80,
      render: (text) => {
        if (text && text !== 'null' && text === '1') {
          return (
            <span>{text && text !== 'null' && replePrintStatus[text]}</span>
          )
        } else {
          return (
            <span>{text && text !== 'null' && replePrintStatus[text]}</span>
          )
        }
      }
    },
    {
      key: 'availableCount',
      title: '可用库存',
      dataIndex: 'availableCount'
    },
    {
      key: 'replenishmentCount',
      title: '建议补货数',
      dataIndex: 'replenishmentCount'
    },
    {
      key: 'realCount',
      title: '实际补货数',
      dataIndex: 'realCount'
    }
  ]

  render() {
    const { printIn } = this.state
    const { showListSpin, auths, page, match, initQueryPar, list, shelfList, printDetailList } = this.props
    console.log(this.props)
    const { getFieldDecorator } = this.props.form
    const btnRole = auths[match.path] ? auths[match.path] : []
    const pagination = genPagination(page)
    return (
      <div>
        <Form
          className={styles['parameter-wrap']}
        >
          <Row id='rowArea'>
            <Col span={5}>
              <FormItem
                label='补货单：'
                {...formItemLayout}
              >
                {getFieldDecorator('replenishmentNo', {
                  initialValue: initQueryPar.replenishmentNo
                })(
                  <Input
                    placeholder='请输入补货单编号'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label='库存单位：'
                {...formItemLayout}
              >
                {getFieldDecorator('shelfNo', {
                  initialValue: initQueryPar.shelfNo,
                })(
                  <Select
                    placeholder='请选择'
                    allowClear={true}
                  >
                    {shelfList.map((item, index) => (
                      <Select.Option
                        key={item.shelfName}
                        value={item.shelfNo}
                      >{item.shelfName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label='补货状态：'
                {...formItemLayout}
              >
                {getFieldDecorator('status', {
                  initialValue: initQueryPar.repleStatus
                })(
                  <Select
                    placeholder='请选择'
                    getPopupContainer={() => document.getElementById('rowArea')}
                  >
                    <Select.Option key='' value=''>全部</Select.Option>
                    {
                      Object.keys(repleStatus).map((key) => {
                        return (
                          <Select.Option
                            key={key}
                            value={key}
                          >
                            {repleStatus[key]}
                          </Select.Option>
                        )
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label='生成日期：'
                {...formItemLayout}
              >
                {getFieldDecorator('orderTime', {
                  initialValue: this.props.initQueryPar.orderTime
                })(
                  <RangePicker
                    style={{ width: '100%' }}
                    format='YYYY-MM-DD'
                    // showTime={{ format: 'HH:mm:ss' }}
                    getCalendarContainer={() => document.getElementById('rowArea')}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <div style={{ 'float': 'right' }}>
                <Button
                  type='primary'
                  title='点击查询'
                  onClick={this._handleQuery}
                >
                  查询
                </Button>
                {
                  btnRole.indexOf('print') !== -1 &&
                  <Button
                    type='primary'
                    className={styles['button-spacing']}
                    onClick={this._printRepleDetail}
                  >
                    打印
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
            rowSelection={{ type: 'radio', onChange: (key, data) => { this._selectRepleDetail(key, data) } }}
            rowKey='replenishmentUuid'
            bordered={true}
            loading={showListSpin}
            dataSource={list}
            onChange={this._handlePageChange}
            pagination={pagination}
          />
        </div>
        <div className={'print-wrap'} id={'print-wrap'} style={{ display: 'none' }}>
          <h2>补货单</h2>
          <ul className={'item-option'}>
            <li><label>补货对象：</label>{printIn.shelfName}</li>
            <li className={'right'}><label>创建日期：</label>{printIn.createTime}</li>
          </ul>
          <div className={'data-wrap'}>
            <Table
              locale={{
                emptyText: '暂无数据'
              }}
              columns={this._printColumns}
              rowKey='replenishmentUuid'
              dataSource={printDetailList}
              bordered
              onChange={this._handlePageChange}
              pagination={false}
            />
          </div>
          <ul className={'item-option'}>
            <li><label>补货人：</label></li>
            <li><label>补货日期：</label></li>
          </ul>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state['retail.shelf.reple'],
    auths: state['common.auths'],
  }
}
export default connect(['common.auths', 'common.showListSpin', 'retail.shelf.reple'], mapStateToProps)(Form.create()(ShelfRepleList))
