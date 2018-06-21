/**
 * Created with webstorm
 * User: HuangZeXia / huangzexiameishu@163.com
 * Date: 2018/3/1
 * Time: 下午1:39
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button, Table } from 'antd'
import * as actions from './reduck'
import styles from './index.less'
import paramsUtil from '../../../utils/params'
import { genEllipsisColumn } from 'Utils/helper'

class EorderDetail extends Component {
  componentDidMount() {
    this.props.dispatch(actions.getEOrderDetail({ orderId: paramsUtil.url2json(location).orderId }))
  }
  // 表格项
  _columns = [
    {
      title: '序号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text, record, index) => {
        return (
          <span>{ index + 1 }</span>
        )
      }
    },
    genEllipsisColumn('skuNo', 'SKU编码', 13, { width: 140 }),
    genEllipsisColumn('goodsName', 'SKU名称', 30),
    {
      title: '所属分类',
      dataIndex: 'goodsCatagory',
      key: 'goodsCatagory'
    },
    {
      title: '库存单位',
      dataIndex: 'goodsUnit',
      key: 'goodsUnit'
    },
    {
      title: '数量',
      dataIndex: 'goodsQuantity',
      key: 'goodsQuantity',
    },
    {
      title: '主商品编码',
      dataIndex: 'mainSkuNo',
      key: 'mainSkuNo',
    }
  ]
  render() {
    const { eorderDetailId, eorderDetailTab } = this.props
    return (
      <div>
        <Row>
          <Col span={5}>订单编号：{ eorderDetailId }</Col>
          <Col
            span={5}
            offset={14}
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
        <Table
          columns={this._columns}
          dataSource={eorderDetailTab}
          rowKey='skuNo'
          pagination={false}
          locale={{
            emptyText: '暂无数据'
          }}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    eorderDetailId: state.supplyChain.supplyOrder.eorderDetailId,
    eorderDetailTab: state.supplyChain.supplyOrder.eorderDetailTab
  }
}
const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)((EorderDetail))

