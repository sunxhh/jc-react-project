import { createAction } from 'redux-actions'
import { message } from 'antd'
import baseFetchData, { fetchOrderCenter as fetchData } from 'Utils/fetch'
import apis from '../apis'
import { SHOW_SPIN } from 'Global/action'
import { ReduckHelper } from 'Utils/helper'

// ===========================> Action Types <=========================== //

export const GET_ORDER_LIST = '/spa/orderCenter/order/GET_ORDER_LIST' // 订单列表分页查询
export const GET_ORDER_DETAIL = '/spa/orderCenter/order/GET_ORDER_DETAIL' // 订单详情查询
export const SET_REFUND_FILTER = '/spa/orderCenter/order/GET_ORDER_DETAIL' // 设置退款订单查询参数
export const GET_ORDER_DICT = '/spa/orderCenter/order/GET_ORDER_DICT' // 获取订单类型字典
export const GET_SUB_ORG_LIST = '/spa/orderCenter/order/GET_SUB_ORG_LIST' // 获取订单类型字典
export const GET_BUSINESS_TYPE_LIST = '/spa/orderCenter/order/GET_BUSINESS_TYPE_LIST' // 获取商品类型字典
// ===========================> Actions <=========================== //

// 关帐单据列表页
export const getOrderList = arg => dispatch => {
  return fetchData(dispatch, SHOW_SPIN)(apis.order.list, arg).then(res => {
    if (res.code === 0) {
      res.data && res.data.data && res.data.data.map(order => {
        order.goodsRes && order.goodsRes.map((goods, index) => {
          try {
            goods.scale = JSON.parse(goods.scale)
            // 手动分配一个唯一键值
            goods._rowKey = `${order.orderRes.orderNo}-${index}`
          } catch (error) {
            console.log(`scale of ${goods.name} is empty or not formated`)
          }
        })
      })
      dispatch(createAction(GET_ORDER_LIST)({
        ...res.data,
        filter: arg
      }))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const getOrderDetail = arg => dispatch => {
  return fetchData(dispatch, SHOW_SPIN)(apis.order.detail, arg).then(res => {
    if (res.code === 0) {
      res.data && res.data.goodsRes && res.data.goodsRes.map(goods => {
        try {
          goods.scale = JSON.parse(goods.scale)
        } catch (error) {
          console.log(`scale of ${goods.name} is empty or not formated`)
        }
      })
      dispatch(createAction(GET_ORDER_DETAIL)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取订单相关枚举数据
export const getDictionary = arg => dispatch => {
  return fetchData(dispatch)(apis.dictionary.dictionary, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_ORDER_DICT)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const getSubOrgList = arg => dispatch => {
  return baseFetchData(dispatch)(apis.dictionary.myOrgList, arg).then(res => {
    if (res.code === 0) {
      // 过滤二级机构，只显示有关联shopId的数据
      const orgList = res.data.myOrgList.filter(org => {
        return org.shopId
      })
      dispatch(createAction(GET_SUB_ORG_LIST)(orgList))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const getBusinessTypeList = arg => dispatch => {
  return fetchData(dispatch)(apis.dictionary.productTypeList, arg).then(res => {
    if (res.code === 0) {
      res.data && res.data.map(item => {
        item.value = item.code
        item.label = item.name
        item.children && item.children.map(item => {
          item.value = item.code
          item.label = item.name
          return item
        })
        return item
      })
      dispatch(createAction(GET_BUSINESS_TYPE_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const clearFilter = () => dispatch => {
  dispatch(createAction(GET_ORDER_LIST)({ ...initialState.orderPage }))
}
// ===========================> Reducer <=========================== //

const initialState = {
  orderList: [],
  orderPage: {
    pageSize: 10,
    current: 1
  },
  orderFilter: {},

  orderDetail: null,
  businessTypeList: [],
  dictionary: null,
  subOrgList: null
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_ORDER_LIST:
      return ReduckHelper.resolveListState('order', state, action.payload)
    case GET_ORDER_DETAIL:
      return {
        ...state,
        orderDetail: action.payload
      }
    case GET_ORDER_DICT:
      return {
        ...state,
        dictionary: action.payload
      }
    case GET_SUB_ORG_LIST:
      return {
        ...state,
        subOrgList: action.payload
      }
    case GET_BUSINESS_TYPE_LIST:
      return {
        ...state,
        businessTypeList: action.payload
      }
    default:
      return state
  }
}
