import React, { Component } from 'react'
import { Table, Form, Row, Col, Button } from 'antd'
import styles from './style.less'
import { genPagination } from 'Utils/helper'
import { connect } from '@dx-groups/arthur'
import Module from './module'
import { isEmpty } from 'Utils/lang'

const stockStatus = {
  '0': '全部',
  '1': '正常',
  '2': '缺货',
}

class ShelfDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shelfDetailList: []
    }
  }

  // 套餐列表
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
      title: 'sku编码',
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
      key: 'frontCategoryName',
      title: '前台分类',
      dataIndex: 'frontCategoryName',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' ? text : '其他' }</span>
        )
      }
    },
    {
      key: 'categoryName',
      title: '系统分类',
      dataIndex: 'categoryName',
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
      key: 'salePrice',
      title: '门店零售价',
      dataIndex: 'salePrice',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'stockCount',
      title: '系统在架库存',
      dataIndex: 'stockCount',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'stockStatus',
      title: '库存状态',
      dataIndex: 'stockStatus',
      width: 80,
      render: (text) => {
        if (text && text !== 'null' && text === '1') {
          return (
            <span>{text && text !== 'null' && stockStatus[text]}</span>
          )
        } else {
          return (
            <span className={styles['c-red']}>{text && text !== 'null' && stockStatus[text]}</span>
          )
        }
      }
    }
  ]

  // 生命周期， 初始化表格数据
  componentDidMount() {
    const { dispatch, match } = this.props
    if (match.params && match.params.shelfNo) {
      dispatch(Module.actions.getShelfDetail({ shelfNo: match.params.shelfNo }))
    }
  }

  componentWillUnmount() {
    this.props.dispatch(Module.actions.emptyList())
  }

  // 点击分页获取列表数据
  _handlePageChange = (page) => {
    if (this.props.page.pageSize === page.pageSize) {
      this._getList(page.current)
    } else {
      this._getList(1, page.pageSize)
    }
  }

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    console.log(this.props.title)
    const arg = this._getParameter(current, pageSize)
    dispatch(Module.actions.getShelfDetail(arg))
  }

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.page.pageNo, pageSize = this.props.page.pageSize) => {
    const { form, match } = this.props
    const arg = form.getFieldsValue()
    return {
      ...arg,
      currentPage: current,
      pageSize: pageSize,
      shelfNo: match.params && match.params.shelfNo
    }
  }

  render() {
    const { showListSpin, shelfDetailList, shelfInfo, page } = this.props
    const pagination = genPagination(page)
    return (
      <div>
        <div className={styles['table-wrapper']} style={{ paddingBottom: 20 }}>
          <Row>
            <Col span={14}>
              货架名称：{shelfInfo && shelfInfo.shelfName}
            </Col>
            <Col span={10}>
              <div style={{ 'float': 'right' }}>
                <Button
                  type='primary'
                  onClick={() => history.go(-1)}
                >返回
                </Button>
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles['table-wrapper']}>
          <Table
            columns={this._columns}
            rowKey='skuNo'
            dataSource={shelfDetailList}
            bordered={true}
            loading={showListSpin}
            onChange={this._handlePageChange}
            pagination={pagination}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state['retail.shelf.list'],
    auths: state['common.auths'],
    showListSpin: state['common.showListSpin'],
  }
}
export default connect(['common.auths', 'common.showListSpin', 'retail.shelf.list'], mapStateToProps)(Form.create()(ShelfDetail))
