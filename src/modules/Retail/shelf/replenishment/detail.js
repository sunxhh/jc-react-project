import React, { Component } from 'react'
import { Table, Form, Row, Col, Button } from 'antd'
import styles from './style.less'
import { genPagination } from 'Utils/helper'
import { connect } from '@dx-groups/arthur'
import Module from './module'
import { isEmpty } from 'Utils/lang'

const repleStatus = {
  '1': '待补货',
  '2': '已完成',
}

const replePrintStatus = {
  '1': '正常',
  '2': '缺货',
}

class ShelfRepleDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: {
        currentPage: 1,
        pageSize: 20
      },
    }
  }

  // 生命周期， 初始化表格数据
  componentWillMount() {
    this._getList()
  }

  componentWillUnmount() {
    this.props.dispatch(Module.actions.emptyList())
  }

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getParameter(current, pageSize)
    dispatch(Module.actions.getShelfRepleDetailList(arg))
  }

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.page.pageNo, pageSize = this.props.page.pageSize) => {
    const { form, match } = this.props
    const arg = form.getFieldsValue()
    return {
      ...arg,
      currentPage: current,
      pageSize: pageSize,
      replenishmentUuid: match.params && match.params.replenishmentUuid
    }
  }

  // 点击分页获取列表数据
  _handlePageChange = (page) => {
    if (this.props.page.pageSize === page.pageSize) {
      this._getList(page.current)
    } else {
      this._getList(1, page.pageSize)
    }
  }

  // 打印补货单
  _printRepleDetail = () => {
    const { dispatch } = this.props
    dispatch(Module.actions.getShelfRepleDetailPrintList({
      replenishmentUuid: this.props.repleInfo.replenishmentUuid,
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
  }
  // 列表
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
      key: 'skuNo',
      title: 'SKU编码',
      dataIndex: 'skuNo',
      width: 100,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'goodsName',
      title: '商品名称',
      dataIndex: 'goodsName',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'goodsCatgName',
      title: '所属分类',
      dataIndex: 'goodsCatgName',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'goodsTypeName',
      title: '商品类型',
      dataIndex: 'goodsTypeName',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'replenishmentCount',
      title: '建议补货数',
      dataIndex: 'replenishmentCount',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'realCount',
      title: '实际补货数',
      dataIndex: 'realCount',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
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
    const { showListSpin, repleInfo, list, page, printDetailList } = this.props
    const pagination = genPagination(page)
    return (
      <div>
        <div className={styles['table-wrapper']} style={{ paddingBottom: 20 }}>
          <Row>
            <Col span={14}>
              补货单编号：{repleInfo && repleInfo.replenishmentNo}；库存单位：{repleInfo && repleInfo.shelfName}；生成日期：{repleInfo && repleInfo.createTime}；状态：{repleInfo && repleStatus[repleInfo.status]}
            </Col>
            <Col span={10}>
              <div style={{ 'float': 'right' }}>
                <Button
                  type='primary'
                  className={styles['button-spacing']}
                  onClick={this._printRepleDetail}
                >
                  打印
                </Button>
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles['table-wrapper']}>
          <Table
            className={styles['c-table-center']}
            columns={this._columns}
            rowKey='skuNo'
            bordered={true}
            loading={showListSpin}
            dataSource={list}
            pagination={pagination}
            onChange={this._handlePageChange}
          />
        </div>
        <div className={'print-wrap'} id={'print-wrap'} style={{ display: 'none' }}>
          <h2>补货单</h2>
          <ul className={'item-option'}>
            <li><label>补货对象：</label>{this.props.repleInfo.shelfName}</li>
            <li className={'right'}><label>创建日期：</label>{this.props.repleInfo.createTime}</li>
          </ul>
          <div className={'data-wrap'}>
            <Table
              locale={{
                emptyText: '暂无数据'
              }}
              columns={this._printColumns}
              rowKey='skuNo'
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
    showListSpin: state['common.showListSpin'],
  }
}
export default connect(['common.auths', 'common.showListSpin', 'retail.shelf.reple'], mapStateToProps)(Form.create()(ShelfRepleDetail))
