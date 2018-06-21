/**
 * Created with webstorm
 * User: HuangZeXia / huangzexiameishu@163.com
 * Date: 2018/3/5
 * Time: 上午11:21
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button, Table, Card } from 'antd'

import paramsUtil from 'Utils/params'
import storage from 'Utils/storage'
import { genPagination } from 'Utils/helper'
import ParamsUtil from 'Utils/params'

import * as actions from './reduck'
import styles from './index.less'
import { supplyChainUrl } from '../../../../config'

class EorderDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  componentDidMount() {
    this.props.dispatch(actions.getOrderDetail({
      purOrderId: paramsUtil.url2json(location).purOrderId,
      currentPage: 1,
      pageSize: 10
    }))
  }

  // 表格项
  _columns = [
    {
      title: '序号',
      width: 120,
      dataIndex: 'orderNo',
      key: 'orderNo',
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
      title: 'SKU编码',
      width: 120,
      dataIndex: 'skuNo',
      key: 'skuNo'
    },
    {
      title: 'SKU名称',
      width: 120,
      dataIndex: 'skuGoodsName',
      key: 'skuGoodsName',
    },
    {
      title: '所属分类',
      width: 120,
      dataIndex: 'goodsCatgName',
      key: 'goodsCatgName'
    },
    {
      title: '库存单位',
      width: 120,
      dataIndex: 'goodsUnit',
      key: 'goodsUnit'
    },
    {
      title: '采购价（元）',
      width: 120,
      dataIndex: 'purchasePrice',
      key: 'purchasePrice'
    },
    {
      title: '采购数量',
      width: 120,
      dataIndex: 'purCount',
      key: 'purCount',
    },
    {
      title: '合计金额（元）',
      width: 120,
      dataIndex: 'totalPrice',
      key: 'totalPrice'
    }
  ]
  // 导出
  _handleExport = () => {
    let ticket = storage.get('userInfo') && storage.get('userInfo').ticket
    const purOrderId = paramsUtil.url2json(location).purOrderId
    const reqBody = {
      purOrderId: purOrderId,
      ticket: ticket
    }
    const state = ParamsUtil.json2url(reqBody)

    let url = (supplyChainUrl === '/') ? `http://${location.host}` : supplyChainUrl
    let href = `${url}/api/supplychain/purOrder/exportOrderInfo/v1?${state}`
    window.open(href)
  }
  // 分页
  _handlePageChange = (pagination) => {
    const { page } = this.props
    const { current, pageSize } = pagination
    this.props.dispatch(actions.getOrderDetail({
      purOrderId: paramsUtil.url2json(location).purOrderId,
      currentPage: page.pageSize !== pageSize ? 1 : current, pageSize,
    }))
  }
  render() {
    const { purhcaseOrderDetailTab, page, purhcaseOrderDetailInfo } = this.props
    const pagination = genPagination({ ...page, pageNo: page.currentPage })
    return (
      <div>
        <Row>
          <Col span={6}>
            订单编号：{purhcaseOrderDetailInfo.purOrderId}
          </Col>
          <Col span={6}>
            供应商：{purhcaseOrderDetailInfo.supplierName}
          </Col>
          <Col span={6}>
            采购部门：{purhcaseOrderDetailInfo.warehouseName}
          </Col>
          <Col
            span={6}
          >
            <Button
              className={styles['backBtn']}
              type='primary'
              onClick={this._handleExport}
            >
              导出
            </Button>
            <Button
              className={styles['backBtn']}
              type='primary'
              onClick={() => history.go(-1)}
            >
              返回
            </Button>
          </Col>
        </Row>
        <Card title='货物信息'>
          <Table
            columns={this._columns}
            dataSource={purhcaseOrderDetailTab}
            rowKey='skuNo'
            locale={{
              emptyText: '暂无数据'
            }}
            onChange={this._handlePageChange}
            pagination={pagination}
          />
        </Card>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    purhcaseOrderDetailTab: state.purchase.purchaseOrder.purhcaseOrderDetailTab,
    page: state.purchase.purchaseOrder.purhcaseOrderDetaiPage,
    purhcaseOrderDetailInfo: state.purchase.purchaseOrder.purhcaseOrderDetailInfo,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)((EorderDetail))

