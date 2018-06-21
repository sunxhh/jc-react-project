import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table } from 'antd'
import { Link } from 'react-router-dom'
import { AlignCenter } from '../dict'
import { genLangColumn, genSelectColumn, genPagination } from 'Utils/helper'
import { ORDER_CENTER_REFUND_DETAIL } from 'Global/urls'
import moment from 'moment'
import { isEmpty } from 'Utils/lang'
import styles from './style.less'
import RefundFilter from './filter'
import * as urls from 'Global/urls'
import storage from 'Utils/storage'

import { getRefundOrderList, getDictionary, clearFilter } from './reduck'

class RefundManager extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderNo: this.props.location.state && this.props.location.state.orderNo
    }
  }
  componentDidMount() {
    const orderNo = this.state.orderNo
    const { dispatch, filter, page, dictionary } = this.props
    dispatch(getRefundOrderList({ ...filter, ...page, orderNo }))
    // 获取相关字段数据
    isEmpty(dictionary) &&
      dispatch(getDictionary({ codeKeys: ['refundStatus'] }))
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    if (!location.pathname.startsWith(urls.ORDER_CENTER_REFUND)) {
      dispatch(clearFilter())
    }
  }

  // 查询
  _handleSearch = searchData => {
    const { dispatch, filter, page } = this.props
    const finalFilter = Object.assign({}, filter, searchData, {
      currentPage: 1,
      pageSize: page.pageSize
    })
    dispatch(getRefundOrderList(finalFilter))
  }

  // 分页控件change事件
  _handleChange = pagination => {
    const { filter, dispatch, page } = this.props
    const { current, pageSize } = pagination
    const finalFilter = {
      ...filter,
      currentPage: page.pageSize !== pageSize ? 1 : current,
      pageSize
    }
    dispatch(getRefundOrderList(finalFilter))
  }

  render() {
    const { page, list, auths, match, dictionary, loading } = this.props
    // 权限
    const btnRole = auths[match.path] ? auths[match.path] : []
    const pagination = genPagination(page)
    const _columns = [
      genLangColumn('refundNo', '退款订单编号', AlignCenter, 15),
      genLangColumn('orderNo', '商品订单编号', AlignCenter, 15),
      {
        key: 'userName',
        title: '买家',
        ...AlignCenter,
        render: (text, record, index) =>
          (<div>
            <div>
              {record.userName}
            </div>
            {record.userMobile &&
              <div>
                ({record.userMobile})
              </div>}
          </div>)
      },
      {
        key: 'applyTime',
        title: '创建时间',
        ...AlignCenter,
        render: (text, record, index) =>
          (<div>
            {moment(record.applyTime).format('YYYY-MM-DD HH:mm:ss')}
          </div>),
        width: 180
      },
      {
        key: 'refundAmount',
        title: '退款金额',
        ...AlignCenter,
        dataIndex: 'refundAmount',
        render: (text, record, index) => (record.refundAmount || 0).toFixed(2),
        width: 120
      },
      genSelectColumn(
        'status',
        '状态',
        (dictionary && dictionary.refundStatus) || [],
        { ...AlignCenter, width: 120 }
      ),
      {
        key: 'operation',
        title: '操作',
        ...AlignCenter,
        render: (text, record, index) => {
          return (
            <div>
              {btnRole.includes('audit') &&
                userInfo.orgCode !== 'jccy' &&
                record.status + '' === '4' &&
                <Link
                  to={{
                    pathname: `${ORDER_CENTER_REFUND_DETAIL}/${record.refundNo}`,
                    state: { isAudit: true }
                  }}
                  className={styles['margin-right']}
                >
                  审核
                </Link>}
              {btnRole.includes('check') &&
                <Link to={`${ORDER_CENTER_REFUND_DETAIL}/${record.refundNo}`}>
                  查看
                </Link>}
            </div>
          )
        },
        width: 120,
        fixed: 'right',
      }
    ]

    const userInfo = storage.get('userInfo')
    return (
      <div>
        {/* 搜索form */}
        <RefundFilter handleChange={this._handleSearch} />

        {/* 搜索结果 */}
        <Table
          dataSource={list}
          columns={_columns}
          bordered
          onChange={this._handleChange}
          rowKey='refundNo'
          loading={loading}
          pagination={pagination}
          scroll={{ x: 1300 }}
          // className={styles['fixed-table']}
        />
        {/* 分页 */}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    filter: state.orderCenter.refund.refundFilter,
    page: state.orderCenter.refund.refundPage,
    list: state.orderCenter.refund.refundList,
    loading: state.common.switchListLoading,
    auths: state.common.auths,
    dictionary: state.orderCenter.refund.dictionary
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(RefundManager)
