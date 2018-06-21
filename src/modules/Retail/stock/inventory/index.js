import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
// import { Link } from 'react-router-dom'
import { Button, Table, Form, Row, Col, Input, DatePicker, Modal, Select, message } from 'antd' // , Modal, message
import { Link } from 'react-router-dom'
import { showModalForm } from 'Components/modal/ModalForm'

import styles from '../styles.less'
import { genPagination } from 'Utils/helper'
import { RETAIL_STOCK_INVENTORY_DETAIL, RETAIL_STOCK_INVENTORY_RECORD } from 'Global/urls'

import Module from './module'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const { RangePicker } = DatePicker

class StockInventory extends Component {
  state = {
    printIn: {
      countsUuid: '',
      shelfName: '',
      createTime: '',
      countsDate: '',
      countsUser: '',
    }
  }

  // 生命周期， 初始化表格数据
  componentDidMount() {
    this._init()
  }

  _inventoryStatus = [
    { value: 0, name: '待盘点' },
    { value: 1, name: '盘点中' },
    { value: 2, name: '盘点完成' }
  ]
  _printColumns = [
    {
      key: 'skuNo',
      title: 'SKU编码',
      dataIndex: 'skuNo'
    },
    {
      key: 'goodsName',
      title: '商品名称',
      dataIndex: 'goodsName'
    },
    {
      key: 'specName',
      title: '规格',
      dataIndex: 'specName'
    },
    {
      key: 'goodsUnit',
      title: '库存单位',
      dataIndex: 'goodsUnit'
    },
    {
      key: 'salePrice',
      title: '门店零售价',
      dataIndex: 'salePrice'
    },
    {
      key: 'currentCount',
      title: '实际在架库存',
      dataIndex: 'currentCount'
    }
  ]
  getColumns = (page) => {
    // 列表header信息
    return [
      {
        key: 'id',
        title: '序号',
        render: (text, record, index) => {
          return page.pageSize * (page.pageNo - 1) + (index + 1)
        }
      },
      {
        key: 'countsNo',
        title: '盘点单编号',
        dataIndex: 'countsNo',
        render: (text, record, index) => {
          return (
            <Link to={{ pathname: `${RETAIL_STOCK_INVENTORY_DETAIL}`, search: `?countsUuid=${record.countsUuid}` }}>{text}</Link>
          )
        }
      },
      {
        key: 'shelfName',
        title: '库存部门',
        dataIndex: 'shelfName'
      },
      {
        key: 'createTime',
        title: '创建日期',
        dataIndex: 'createTime'
      },
      {
        key: 'createUser',
        title: '创建人',
        dataIndex: 'createUser'
      },
      {
        key: 'status',
        title: '状态',
        render: (text, record, index) => {
          return (
            <span>{this._getInventoryStatusName(record.status)}</span>
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        width: 100,
        render: (text, record, index) => {
          const { auths, match } = this.props
          const btnRole = auths[match.path] ? auths[match.path] : []
          return (
            <div className={styles['table-ope']}>
              {
                record.status !== 2 &&
                <div>
                  {
                    btnRole.includes('stockInventoryRecord') &&
                    <Link to={{ pathname: `${RETAIL_STOCK_INVENTORY_RECORD}`, search: `?countsUuid=${record.countsUuid}` }}>盘点录入</Link>
                  }
                  {
                    btnRole.includes('stockInventoryDel') &&
                    <a
                      href='javascript:;'
                      onClick={(e) => {
                        this._delInventory(e, record, index)
                      }}
                      className={styles['del']}
                    >
                      删除
                    </a>
                  }
                </div>
              }
            </div>
          )
        }
      }
    ]
  }

  _init() {
    this._getShelfList()
    setTimeout(this._getInventoryList, 100)
  }

  _getInventoryStatusName = (status) => {
    let statusName = null
    this._inventoryStatus.forEach((data) => {
      if (data.value === status) {
        statusName = data.name
      }
    })
    return statusName
  }
  /**
   * 执行查询
   */
  _handleQuery = () => {
    this._getInventoryList(1)
  }

  /**
   * 货架列表
   * @private
   */
  _getShelfList = () => {
    const { dispatch } = this.props
    dispatch(Module.actions.getShelfList())
  }
  // 获取列表数据查询参数
  _getQueryParam(current = Module.state.inventoryPage.current, pageSize = Module.state.inventoryPage.pageSize) {
    const { form } = this.props
    let arg = form.getFieldsValue()
    if (arg.countsNo) {
      const reg = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
      arg.countsNo = arg.countsNo ? arg.countsNo.replace(reg, '') : arg.countsNo
    }
    return {
      ...arg,
      currentPage: current,
      pageSize: pageSize,
    }
  }
  // 设置列表数据查询参数
  _setQueryParam = (queryParam) => {
    const { dispatch } = this.props
    dispatch(Module.actions.setQueryParam(queryParam))
  }

  /**
   * 库存盘点列表
   */
  _getInventoryList = (current, pageSize) => {
    const { dispatch } = this.props
    let queryParam = this._getQueryParam(current, pageSize)
    let requestQueryParam = JSON.parse(JSON.stringify(queryParam))
    if (queryParam.time) {
      requestQueryParam.start = queryParam.time[0].format('YYYY-MM-DD')
      requestQueryParam.end = queryParam.time[1].format('YYYY-MM-DD')
      delete requestQueryParam.time
    }
    dispatch(Module.actions.getInventoryList(requestQueryParam))
    this._setQueryParam(queryParam)
  }

  /**
   * 删除积分规则
   * @returns {*}
   */
  _delInventory = (event, record, index) => {
    Modal.confirm({
      title: '删除库存盘点',
      content: '确定要删除此库存盘点吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props
        dispatch(Module.actions.delInventory({ countsUuid: record.countsUuid })).then(status => {
          if (status) {
            const { inventoryPage } = this.props
            this._getInventoryList(inventoryPage.pageNo)
          }
        })
      },
      onCancel() {
      },
    })
  }

  _handlePageChange = (page) => {
    if (this.props.inventoryPage.pageSize === page.pageSize) {
      this._getInventoryList(page.current, page.pageSize)
    } else {
      this._getInventoryList(1, page.pageSize)
    }
  }

  /**
   * 创建盘点单
   * @returns {*}
   */
  _createInventory = (e) => {
    e.preventDefault()
    const { shelfList } = this.props
    showModalForm({
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 }
      },
      title: '创建盘点单',
      fields: [
        {
          id: 'shelfNo',
          props: {
            label: '库存部门'
          },
          options: {
            rules: [{
              required: true,
              message: '请选择库存部门',
            }]
          },
          element: (
            <Select
              notFoundContent='暂无'
              placeholder='请选择'
              allowClear={true}
              style={{ width: '300px' }}
            >
              {shelfList.map((item) => (
                <Select.Option
                  key={item.shelfNo}
                  value={item.shelfNo}
                >{item.shelfName}
                </Select.Option>
              ))}
            </Select>
          )
        }
      ],
      onOk: values => {
        const { dispatch } = this.props
        dispatch(Module.actions.createInventory({
          shelfNo: values.shelfNo
        })).then(res => {
          if (res) {
            // 积分明细
            this._getInventoryList(1)
          }
        })
      }
    })
  }

  /**
   * 打印盘点单
   * @returns {*}
   */
  _printInventoryDetail = () => {
    if (this.state.printIn.shelfName !== '') {
      const { dispatch } = this.props
      dispatch(Module.actions.getInventoryDetailPrintList({
        countsUuid: this.state.printIn.countsUuid
      })).then((status) => {
        if (status) {
          const headstr = `<html><head><style type="text/css">h2 { font-size: 18px; color: #000000; text-align: center;padding: 10px 0; } .item-option { margin: 25px 0; list-style: none; display: flex; flex-flow: row wrap; width:100%; padding: 0;}  .item-option li { padding: 0 3%; flex: 44%; text-align: left; } .item-option li label { color: #000000; } .item-option li.right { text-align: right; } .data-wrap {padding: 0 3%;} .noPrint{display: none}.PageNext{page-break-after:always;}</style></head><body>`
          const footstr = '</body>'
          const newstr = document.getElementById('print-wrap').innerHTML
          document.body.innerHTML = headstr + newstr + footstr
          window.print()
          window.location.reload()
        }
      })
    } else {
      message.error('请选择导入的盘点单')
    }
  }

  /**
   * 选中盘点单
   * @private
   */
  _selectInventory = (key, data) => {
    this.setState({ printIn: data[0] })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { showListSpin, inventoryList, inventoryDetailPrintList, inventoryDetailIn, inventoryQueryParam, inventoryPage, shelfList, auths, match } = this.props
    const pagination = genPagination(inventoryPage)
    const btnRole = auths[match.path] ? auths[match.path] : []
    return (
      <div>
        <Form
          id='filter-form'
          className={styles['parameter-wrap']}
        >
          <Row id='rowArea'>
            <Col span={5}>
              <FormItem
                label='盘点单'
                {...formItemLayout}
              >
                {getFieldDecorator('countsNo', {
                  initialValue: inventoryQueryParam.countsNo
                })(
                  <Input
                    placeholder='请输入盘点单编码'
                    maxLength='50'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label='库存部门'
                {...formItemLayout}
              >
                {getFieldDecorator('shelfNo', {
                  initialValue: inventoryQueryParam.shelfNo
                })(
                  <Select
                    notFoundContent='暂无'
                    placeholder='请选择'
                    allowClear={true}
                  >
                    {shelfList.map((item) => (
                      <Select.Option
                        key={item.shelfNo}
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
                {...formItemLayout}
                label='创建日期'
              >
                <div
                  id='time'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('time', {
                    initialValue: inventoryQueryParam.time,
                    rules: [{
                      required: false,
                    }]
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
            <Col span={2}>
              <FormItem className={styles['operate-btn']}>
                <Button
                  className={styles['search-btn']}
                  type='primary'
                  title='点击查询'
                  onClick={this._handleQuery}
                  style={{ left: '30px' }}
                >
                  查询
                </Button>
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem>
                {
                  btnRole.includes('stockInventoryCreate') &&
                  <Button
                    type='primary'
                    title='创建盘点单'
                    onClick={this._createInventory}
                    className={styles['create-btn']}
                  >
                    创建盘点单
                  </Button>
                }
                {
                  btnRole.includes('stockInventoryPrint') &&
                  <Button
                    type='primary'
                    title='盘点单打印'
                    onClick={this._printInventoryDetail}
                    style={{ left: '10x' }}
                  >
                    打印
                  </Button>
                }
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div className={styles['table-wrapper']}>
          <Table
            locale={{
              emptyText: '暂无数据'
            }}
            rowSelection={{ type: 'radio', onChange: (key, data) => { this._selectInventory(key, data) } }}
            columns={this.getColumns(inventoryPage)}
            rowKey='countsUuid'
            dataSource={inventoryList}
            bordered
            loading={showListSpin}
            onChange={this._handlePageChange}
            pagination={pagination}
          />
        </div>
        <div className={'print-wrap'} id={'print-wrap'} style={{ display: 'none' }}>
          <h2>商品盘点单</h2>
          <ul className={'item-option'}>
            <li><label>盘点单位：</label>{inventoryDetailIn.shelfName}</li>
            <li className={'right'}><label>创建日期：</label>{inventoryDetailIn.createTime}</li>
          </ul>
          <div className={'data-wrap'}>
            <Table
              locale={{
                emptyText: '暂无数据'
              }}
              columns={this._printColumns}
              rowKey='skuNo'
              dataSource={inventoryDetailPrintList}
              bordered
              pagination={false}
            />
          </div>
          <ul className={'item-option'}>
            <li><label>盘点人：</label>{inventoryDetailIn.countsUser}</li>
            <li><label>盘点日期：</label>{inventoryDetailIn.countsDate}</li>
          </ul>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state['common.showListSpin'],
    auths: state['common.auths'],
    ...state['retail.stock.inventory'],
    ...state['retail.stock'],
    ...state['retail']
  }
}
export default connect(['common.showListSpin', 'common.auths', 'retail', 'retail.stock', 'retail.stock.inventory'], mapStateToProps)(Form.create()(StockInventory))
