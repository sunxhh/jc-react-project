/**
 * Created with webstorm
 * User: HuangZeXia / huangzexiameishu@163.com
 * Date: 2018/3/13
 * Time: 上午11:01
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button, Table, Card, Popconfirm } from 'antd'

import paramsUtil from 'Utils/params'

import styles from './index.less'
import * as actions from './reduck'

class EditOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      purOrderId: ''
    }
  }
  componentDidMount() {
    this.setState({
      purOrderId: paramsUtil.url2json(location).purOrderId,
    })
    this.props.dispatch(actions.getOrderDetail({
      purOrderId: paramsUtil.url2json(location).purOrderId,
      currentPage: 1,
      pageSize: 10
    }))
  }

  // 删除货物
  _confirm = (skuNo) => {
    const { dispatch } = this.props
    const { purOrderId } = this.state
    dispatch(actions.updatePurchaseOrder({
      purOrderId: purOrderId,
      skuNo: skuNo
    })).then(res => {
      if (res === 0) {
        dispatch(actions.getOrderDetail({
          purOrderId: paramsUtil.url2json(location).purOrderId,
          currentPage: 1,
          pageSize: 10
        }))
      }
    })
  }
  // 表格项
  _columns = [
    {
      title: '序号',
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
      dataIndex: 'skuNo',
      key: 'skuNo'
    },
    {
      title: '货物名称',
      dataIndex: 'skuGoodsName',
      key: 'skuGoodsName',
    },
    {
      title: '所属分类',
      dataIndex: 'goodsCatgName',
      key: 'goodsCatgName'
    },
    {
      title: '库存单位',
      dataIndex: 'goodsUnit',
      key: 'goodsUnit'
    },
    {
      title: '采购价（元）',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice'
    },
    {
      title: '采购数量',
      dataIndex: 'purCount',
      key: 'purCount',
    },
    {
      title: '合计金额（元）',
      dataIndex: 'totalPrice',
      key: 'totalPrice'
    },
    {
      title: '操作',
      dataIndex: 'handle',
      key: 'handle',
      render: (text, record) => {
        return (
          <Popconfirm
            title='你确定要删除该条货物么？'
            onConfirm={() => {
              this._confirm(record.skuNo)
            }}
            okText='确定'
            cancelText='取消'
          >
            { this.props.purhcaseOrderDetailTab.length === 1 ? '' : <a href='javascript:;'>删除</a>}
          </Popconfirm>

        )
      }
    }
  ]

  // 分页
  _handlePageChange = (current) => {
    console.log(current)
  }
  render() {
    const { purhcaseOrderDetailTab, page, purhcaseOrderDetailInfo } = this.props
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
              onClick={() => history.go(-1)}
            >
                取消
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
            pagination={{
              total: parseInt(page.records),
              pageSize: parseInt(page.pageSize),
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: total => `共 ${page.records} 项`,
              pageSizeOptions: ['5', '10', '20', '50'],
              onChange: this._handlePageChange,
              ...page,
            }}
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

export default connect(mapStateToProps, mapDispatchToProps)((EditOrder))

