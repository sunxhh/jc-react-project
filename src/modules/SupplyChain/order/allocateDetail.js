/**
 * Created with webstorm
 * User: HuangZeXia / huangzexiameishu@163.com
 * Date: 2018/3/2
 * Time: 下午2:55
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button, Table, Card } from 'antd'

import paramsUtil from '../../../utils/params'
import styles from './index.less'
import * as actions from './reduck'

class AllocateDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderId: ''
    }
  }
  componentDidMount() {
    this.setState({
      orderId: paramsUtil.url2json(location).allocationOrderId
    })
    this.props.dispatch(actions.getAllocateOrderDetail({
      allocationOrderId: paramsUtil.url2json(location).allocationOrderId
    }))
  }
  // 表格项
  _columns = [
    {
      title: '序号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text, record, index) => {
        return (
          index + 1
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
      dataIndex: 'goodsName',
      key: 'goodsName',
    },
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
      title: '加权成本（元）',
      dataIndex: 'weightCost',
      key: 'weightCost',
    },
    {
      title: '调拨数量',
      dataIndex: 'goodsQuantity',
      key: 'goodsQuantity',
    },
    {
      title: '合计金额（元）',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
    }
  ]
  render() {
    const { allocateOrderDetail } = this.props
    const { orderId } = this.state
    return (
      <div>
        <Row>
          <Col span={5}>订单编号：{orderId}</Col>
          <Col span={5}>调出部门：{allocateOrderDetail.outDepartmentName}</Col>
          <Col span={5}>申请部门：{allocateOrderDetail.applyDepartmentName}</Col>
          <Col
            span={5}
            offset={4}
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
          <Table
            columns={this._columns}
            dataSource={allocateOrderDetail.orderSkuList}
            rowKey='goodsSkuNo'
            pagination={false}
            locale={{
              emptyText: '暂无数据'
            }}
          />
        </Card>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    allocateOrderDetail: state.supplyChain.supplyOrder.allocateOrderDetail,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)((AllocateDetail))

