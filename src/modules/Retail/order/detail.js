import React, { Component } from 'react'
import { Table, Form, Row, Col, Button, Popover } from 'antd'
import styles from './styles.less'

import { connect } from '@dx-groups/arthur'
import Module from './module'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20 },
}
const titleLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
}

class OrderDetail extends Component {
  // 默认props
  static defaultProps = {
    orderInfo: {},
    orderSkuInfoVO: [],
  }

  // 套餐列表
  _columns = [
    {
      key: 'index',
      title: '序号',
      dataIndex: 'index',
      width: 50,
      render: (text, record, index) => {
        return (
          <span>{index + 1}</span>
        )
      }
    },
    {
      key: 'sku',
      title: 'sku编码',
      dataIndex: 'sku',
      width: 100,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'goodsName',
      title: '货物名称',
      dataIndex: 'goodsName',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'categoryName',
      title: '所属分类',
      dataIndex: 'categoryName',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'stockUnit',
      title: '库存单位',
      dataIndex: 'stockUnit',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'salePrice',
      title: '销售价',
      dataIndex: 'salePrice',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'saleCount',
      title: '数量',
      dataIndex: 'saleCount',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'receivableAmount',
      title: '应收金额',
      dataIndex: 'receivableAmount',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'receivedAmount',
      title: '实收金额',
      dataIndex: 'receivedAmount',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'remark',
      title: '备注',
      dataIndex: 'remark',
      width: 80,
      render: (text) => {
        return (
          <Popover
            content = {<div>{text}</div>}
            title = '备注'
            placement='topLeft'
          >
            <span>{text && text.length > 5 ? `${text.substring(0, 5)}...` : text}</span>
          </Popover>
        )
      }
    },
  ]

  // 生命周期， 初始化表格数据
  componentDidMount() {
    const { dispatch, match } = this.props
    if (match.params && match.params.orderNo) {
      dispatch(Module.actions.getOrderDetail({ orderNo: match.params.orderNo }))
    }
  }

  // 获取字典类型
  _getDictValue = (dictionary, value) => {
    const filterDic = dictionary.filter(dictionary => dictionary.value === value)
    if (filterDic.length > 0) {
      return filterDic[0].name
    }
    return ''
  }

  render() {
    const { showListSpin, orderInfo, orderSkuInfoVO } = this.props
    return (
      <div>
        <div className={styles['card-wrapper']}>
          <Row
            justify='start'
            type='flex'
          >
            <Col span={10}>
              <FormItem
                {...formItemLayout}
                label='订单号：'
              >
                <span className='ant-form-text'>{orderInfo.orderNo ? orderInfo.orderNo : ''}</span>
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem
                {...titleLayout}
                label='应收金额：'
              >
                <span className='ant-form-text'>{orderInfo.orderAmount ? orderInfo.orderAmount : ''}</span>
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem
                {...titleLayout}
                label='实收金额：'
              >
                <span className='ant-form-text'>{orderInfo.amount ? orderInfo.amount : ''}</span>
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem
                {...titleLayout}
                label='优惠金额：'
              >
                <span className='ant-form-text'>{orderInfo.discountAmount ? orderInfo.discountAmount : ''}</span>
              </FormItem>
            </Col>
            <Col span={2}>
              <Button
                type='primary'
                onClick={() => history.go(-1)}
              >返回
              </Button>
            </Col>
          </Row>
        </div>
        <div className={styles['table-wrapper']}>
          <Table
            className={styles['c-table-center']}
            columns={this._columns}
            rowKey='sku'
            loading={showListSpin}
            dataSource={orderSkuInfoVO}
            pagination={false}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state['retail.order'],
    auths: state['common.auths'],
    showListSpin: state['common.showListSpin'],
  }
}
export default connect(['common.auths', 'common.showListSpin', 'retail.order'], mapStateToProps)(Form.create()(OrderDetail))
