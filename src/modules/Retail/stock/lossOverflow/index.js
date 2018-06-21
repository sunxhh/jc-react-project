import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
// import { Link } from 'react-router-dom'
import { Button, Table, Form, Row, Col, Input, DatePicker, message } from 'antd' // , Modal, message
import { Link } from 'react-router-dom'

import styles from '../styles.less'
import { genPagination } from 'Utils/helper'
import { RETAIL_STOCK_LOSS_OVERFLOW_DETAIL, RETAIL_STOCK_INVENTORY_DETAIL } from 'Global/urls'

import Module from './module'
import { retailUrl } from '../../../../config'
import parmasUtil from 'Utils/params'
import storage from 'Utils/storage'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const { RangePicker } = DatePicker

class StockLossOverflow extends Component {
  state = {
    printIn: {
      lossUuid: '',
      countsNo: ''
    }
  }
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
      key: 'diffCount',
      title: '差异数量',
      dataIndex: 'diffCount'
    },
    {
      key: 'diffAmount',
      title: '差异金额',
      dataIndex: 'diffAmount'
    }
  ]
  // 生命周期， 初始化表格数据
  componentDidMount() {
    this._init()
  }

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
        key: 'lossNo',
        title: '报损报溢单',
        dataIndex: 'lossNo',
        render: (text, record, index) => {
          return (
            <Link to={{ pathname: `${RETAIL_STOCK_LOSS_OVERFLOW_DETAIL}`, search: `?lossUuid=${record.lossUuid}` }}>{text}</Link>
          )
        }
      },
      {
        key: 'countsNo',
        title: '关联盘点单',
        dataIndex: 'countsNo',
        render: (text, record, index) => {
          return (
            <Link to={{ pathname: `${RETAIL_STOCK_INVENTORY_DETAIL}`, search: `?countsUuid=${record.countsUuid}` }}>{text}</Link>
          )
        }
      },
      {
        key: 'lossCount',
        title: '报损数量',
        dataIndex: 'lossCount'
      },
      {
        key: 'spillCount',
        title: '报溢数量',
        dataIndex: 'spillCount'
      },
      {
        key: 'createUser',
        title: '盘点人',
        dataIndex: 'createUser'
      },
      {
        key: 'createTime',
        title: '生成日期',
        dataIndex: 'createTime'
      }
    ]
  }

  _init() {
    setTimeout(this._getLossOverflowList, 100)
  }

  // 获取列表数据查询参数
  _getQueryParam(current = Module.state.lossOverflowPage.current, pageSize = Module.state.lossOverflowPage.pageSize) {
    const { form } = this.props
    const arg = form.getFieldsValue()
    if (arg.lossNo) {
      const reg = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
      arg.lossNo = arg.lossNo ? arg.lossNo.replace(reg, '') : arg.lossNo
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
   * 执行查询
   */
  _handleQuery = () => {
    this._getLossOverflowList(1)
  }

  /**
   * 报损报溢单列表
   */
  _getLossOverflowList = (current, pageSize) => {
    const { dispatch } = this.props
    let queryParam = this._getQueryParam(current, pageSize)
    let requestQueryParam = JSON.parse(JSON.stringify(queryParam))
    if (queryParam.time) {
      requestQueryParam.start = queryParam.time[0].format('YYYY-MM-DD')
      requestQueryParam.end = queryParam.time[1].format('YYYY-MM-DD')
      delete requestQueryParam.time
    }
    dispatch(Module.actions.getLossOverflowList(requestQueryParam))
    this._setQueryParam(queryParam)
  }

  _handlePageChange = (page) => {
    if (this.props.lossOverflowPage.pageSize === page.pageSize) {
      this._getLossOverflowList(page.current, page.pageSize)
    } else {
      this._getLossOverflowList(1, page.pageSize)
    }
  }

  /**
   * 导出报损报溢单
   * @returns {*}
   */
  _exportLossOverflow = () => {
    const { lossOverflowQueryParam } = this.props
    const exportParam = {
      lossNo: lossOverflowQueryParam.lossNo,
      start: lossOverflowQueryParam.time && lossOverflowQueryParam.time[0] ? lossOverflowQueryParam.time[0].format('YYYY-MM-DD') : '',
      end: lossOverflowQueryParam.time && lossOverflowQueryParam.time[1] ? lossOverflowQueryParam.time[1].format('YYYY-MM-DD') : '',
    }
    const params = parmasUtil.json2url(exportParam)
    const ticket = storage.get('userInfo').ticket
    const url = (retailUrl === '/') ? `http://${location.host}` : retailUrl
    let href = `${url}/api/retail/store/inventory/lossOverflow/exportList?${params}&ticket=${ticket}`
    window.open(href)
  }

  /**
   * 打印报损报溢单
   * @returns {*}
   */
  _printLossOverflow = () => {
    if (this.state.printIn.lossUuid !== '') {
      const { dispatch } = this.props
      dispatch(Module.actions.getLossOverflowDetailPrintList({
        lossUuid: this.state.printIn.lossUuid
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
      message.error('请选择导出的报损报溢单')
    }
  }

  /**
   * 选中报损报溢单
   * @private
   */
  _selectLossOverflow = (key, data) => {
    this.setState({
      printIn: {
        lossUuid: data[0].lossUuid,
        countsNo: data[0].countsNo
      }
    })
  }

  render() {
    const { printIn } = this.state
    const { getFieldDecorator } = this.props.form
    const { showListSpin, lossOverflowList, lossOverflowQueryParam, lossOverflowDetailPrintIn, lossOverflowPage, auths, match } = this.props
    const pagination = genPagination(lossOverflowPage)
    const btnRole = auths[match.path] ? auths[match.path] : []
    return (
      <div>
        <Form
          id='filter-form'
          className={styles['parameter-wrap']}
        >
          <Row id='rowArea'>
            <Col span={8}>
              <FormItem
                label='报损报溢单'
                {...formItemLayout}
              >
                {getFieldDecorator('lossNo', {
                  initialValue: lossOverflowQueryParam.lossNo
                })(
                  <Input
                    placeholder='请输入报损报溢单号'
                    maxLength='50'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={9}>
              <FormItem
                {...formItemLayout}
                label='创建日期'
              >
                <div>
                  {getFieldDecorator('time', {
                    initialValue: lossOverflowQueryParam.time,
                    rules: [{
                      required: false,
                    }],
                  })(
                    <RangePicker
                      style={{ width: '100%' }}
                      format='YYYY-MM-DD'
                      placeholder={['开始日期', '结束日期']}
                      showTime={{ hideDisabledOptions: true }}
                    />
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={3}>
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
            <Col span={4}>
              <FormItem className={styles['operate-btn']}>
                {
                  btnRole.includes('stockLossOverflowPrint') &&
                  <Button
                    type='primary'
                    title='报损报溢单打印'
                    onClick={this._printLossOverflow}
                  >
                    打印
                  </Button>
                }
                {
                  btnRole.includes('stockLossOverflowExport') &&
                  <Button
                    type='primary'
                    title='报损报溢单导出'
                    onClick={this._exportLossOverflow}
                    style={{ left: '10px' }}
                  >
                    导出
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
            columns={this.getColumns(lossOverflowPage)}
            rowKey='countsNo'
            rowSelection={{ type: 'radio', onChange: (key, data) => { this._selectLossOverflow(key, data) } }}
            dataSource={lossOverflowList}
            bordered
            loading={showListSpin}
            onChange={this._handlePageChange}
            pagination={pagination}
          />
        </div>
        <div className={'print-wrap'} id={'print-wrap'} style={{ display: 'none' }}>
          <h2>报损报溢单</h2>
          <ul className={'item-option'}>
            <li><label>盘点单位：</label>{lossOverflowDetailPrintIn.shelfName}</li>
            <li className={'right'}><label>关联盘点单：</label>{printIn.countsNo}</li>
            <li><label>差异数量：</label>{lossOverflowDetailPrintIn.diffCount}</li>
            <li className={'right'}><label>差异金额：</label>{lossOverflowDetailPrintIn.diffAmount}</li>
          </ul>
          <div className={'data-wrap'}>
            <Table
              locale={{
                emptyText: '暂无数据'
              }}
              columns={this._printColumns}
              rowKey='skuNo'
              dataSource={lossOverflowDetailPrintIn.result.data}
              bordered
              pagination={false}
            />
          </div>
          <ul className={'item-option'}>
            <li><label>盘点人：</label>{lossOverflowDetailPrintIn.operator}</li>
            <li><label>盘点日期：</label>{lossOverflowDetailPrintIn.countsDate}</li>
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
    ...state['retail.stock.lossOverflow'],
    ...state['retail.stock'],
    ...state['retail']
  }
}
export default connect(['common.showListSpin', 'common.auths', 'retail', 'retail.stock', 'retail.stock.lossOverflow'], mapStateToProps)(Form.create()(StockLossOverflow))
