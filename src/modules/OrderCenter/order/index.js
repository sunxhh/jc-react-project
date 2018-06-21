import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import List from './list'
import {
  getOrderList,
  getDictionary,
  getSubOrgList,
  getBusinessTypeList,
  clearFilter
} from './reduck'
import { isEmpty } from 'Utils/lang'
import OrderFilter from './filter'
import * as urls from 'Global/urls'
// import { arrayToMap } from 'Utils/helper'

class OrderManager extends Component {
  state = {}

  componentWillMount() {
    const { dispatch, filter, page, dictionary, orgList, productTypeList } = this.props
    dispatch(getOrderList({ ...filter, ...page }))
    // 获取相关字段数据
    isEmpty(dictionary) && dispatch(getDictionary({ codeKeys: ['orderStatus'] }))
    // 获取二级机构=店铺列表
    isEmpty(orgList) && dispatch(getSubOrgList({ org: { orgMod: '1', orgLevel: '2' }}))
    // 获取商品类型字典
    isEmpty(productTypeList) && dispatch(getBusinessTypeList())
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    if (!location.pathname.startsWith(urls.ORDER_CENTER_ORDER)) {
      dispatch(clearFilter())
    }
  }

  // 点击查询
  _handleSearch = searchData => {
    const { dispatch, filter, page } = this.props
    // const orgListMap = arrayToMap(orgList, 'id')
    searchData = searchData || {}
    if (!isEmpty(searchData) && !isEmpty(searchData.orderTime)) {
      searchData.startDate = moment(searchData.orderTime[0]).format(
        'YYYY-MM-DD HH:mm:ss'
      )
      searchData.endDate = moment(searchData.orderTime[1]).format(
        'YYYY-MM-DD HH:mm:ss'
      )
    } else {
      searchData.startDate = null
      searchData.endDate = null
    }

    // 默认传null
    if (!searchData.merchantUserNo) {
      searchData.merchantUserNo = null
    }

    if (!isEmpty(searchData) && !isEmpty(searchData.businessType)) {
      searchData.parentBusinessType = searchData.businessType[0]
      searchData.businessType = searchData.businessType[1]
    } else {
      searchData.parentBusinessType = null
      searchData.businessType = null
    }

    const finalFilter = Object.assign({}, filter, searchData, {
      currentPage: 1,
      pageSize: page.pageSize
    })
    dispatch(getOrderList(finalFilter))
  }

  // 点击分页获取列表数据
  _pageChange = (current, pageSize) => {
    const { filter, dispatch, page } = this.props
    const finalFilter = {
      ...filter,
      currentPage: page.pageSize !== pageSize ? 1 : current,
      pageSize
    }
    dispatch(getOrderList(finalFilter))
  }

  render() {
    return (
      <div>
        <OrderFilter handleChange={this._handleSearch} />
        <List path={this.props.match.path} pageChange={this._pageChange} />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    list: state.orderCenter.order.orderList,
    filter: state.orderCenter.order.orderFilter,
    page: state.orderCenter.order.orderPage,
    dictionary: state.orderCenter.order.dictionary,
    orgList: state.orderCenter.order.subOrgList,
    businessTypeList: state.orderCenter.order.businessTypeList
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderManager)
