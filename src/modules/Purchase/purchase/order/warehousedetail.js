/**
 * Created with webstorm
 * User: HuangZeXia / huangzexiameishu@163.com
 * Date: 2018/3/5
 * Time: 下午2:42
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button, Table, Card } from 'antd'

import paramsUtil from 'Utils/params'
import { genPagination } from 'Utils/helper'

import * as actions from './reduck'
import styles from './index.less'

class WarehouseDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      outinOrderNo: ''
    }
  }
  componentDidMount() {
    this.setState({
      outinOrderNo: paramsUtil.url2json(location).outinOrderNo
    })
    this.props.dispatch(actions.getOrderWareHouseDetail({
      outinOrderNo: paramsUtil.url2json(location).outinOrderNo,
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
      dataIndex: 'goodsName',
      key: 'goodsName',
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
      title: '采购价/成本（元）',
      width: 120,
      dataIndex: 'purAmount',
      key: 'purAmount'
    },
    {
      title: '税率（%）',
      width: 120,
      dataIndex: 'rate',
      key: 'rate',
    },
    {
      title: '入库数量',
      width: 120,
      dataIndex: 'count',
      key: 'count'
    },
    {
      title: '合计金额（元）',
      width: 120,
      dataIndex: 'amount',
      key: 'amount'
    }
  ]
  // 分页
  _handlePageChange = (pagination) => {
    const { page } = this.props
    const { current, pageSize } = pagination
    this.props.dispatch(actions.getOrderWareHouseDetail({
      outinOrderNo: paramsUtil.url2json(location).outinOrderNo,
      currentPage: page.pageSize !== pageSize ? 1 : current, pageSize,
    }))
  }
  render() {
    const { purhcaseOrderWareHouseDetailTab, page, purhcaseOrderWareHouseDetailInfo } = this.props
    const pagination = genPagination({ ...page, pageNo: page.currentPage })
    const { outinOrderNo } = this.state
    return (
      <div>
        <Row>
          <Col span={5}>
            单据编号：{outinOrderNo}
          </Col>
          <Col span={5}>
            单据类型：{purhcaseOrderWareHouseDetailInfo.dataSource}
          </Col>
          <Col span={5}>
            入库部门：{purhcaseOrderWareHouseDetailInfo.warehouseName}
          </Col>
          <Col
            span={4}
            offset={5}
          >
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
          <p style={{ textAlign: 'right' }}>总金额（元）: {purhcaseOrderWareHouseDetailInfo.totalAmount}</p>
          <Table
            columns={this._columns}
            dataSource={purhcaseOrderWareHouseDetailTab}
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
    purhcaseOrderWareHouseDetailTab: state.purchase.purchaseOrder.purhcaseOrderWareHouseDetailTab,
    page: state.purchase.purchaseOrder.purhcaseOrderWareHouseDetaiPage,
    purhcaseOrderWareHouseDetailInfo: state.purchase.purchaseOrder.purhcaseOrderWareHouseDetailInfo,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)((WarehouseDetail))

