import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchOrderCenter as fetchData } from 'Utils/fetch'
import apis from '../apis'
import { SHOW_LIST_SPIN, SHOW_SPIN, SHOW_BUTTON_SPIN } from 'Global/action'
import { ReduckHelper } from 'Utils/helper'

// ===========================> Action Types <=========================== //

export const GET_REFUND_ORDER_LIST = '/spa/orderCenter/order/GET_REFUND_ORDER_LIST' // 获取退款订单列表
export const GET_REFUND_ORDER_DETAIL = '/spa/orderCenter/order/GET_REFUND_ORDER_DETAIL' // 获取退款订单详情
export const GET_ORDER_REFUND_DICT = '/spa/orderCenter/order/GET_ORDER_REFUND_DICT' // 获取退款相关枚举

// ===========================> Actions <=========================== //
export const getRefundOrderList = arg => dispatch => {
  return fetchData(dispatch, SHOW_LIST_SPIN)(apis.refund.list, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_REFUND_ORDER_LIST)({
        ...res.data,
        filter: arg
      }))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const getRefundOrderDetail = arg => dispatch => {
  return fetchData(dispatch, SHOW_SPIN)(apis.refund.detail, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_REFUND_ORDER_DETAIL)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const postRefundAudit = arg => dispatch => {
  return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.refund.updateStatus, arg).then(res => {
    if (res.code === 0) {
      message.info('提交成功')
      history.go(-1)
    } else {
      message.error(res.errmsg)
    }
  })
}

export const applyRefund = arg => dispatch => {
  return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.refund.add, arg).then(res => {
    if (res.code === 0) {
      message.info('申请成功')
      history.go(-1)
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取订单相关枚举数据
export const getDictionary = arg => dispatch => {
  return fetchData(dispatch)(apis.dictionary.dictionary, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_ORDER_REFUND_DICT)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const clearFilter = () => dispatch => {
  dispatch(createAction(GET_REFUND_ORDER_LIST)({ ...initialState.refundPage }))
}

// ===========================> Reducer <=========================== //

const initialState = {
  refundFilter: {},
  refundPage: {
    pageSize: 10,
    current: 1
  },

  refundOrderDetail: null
}

export const reducer = function(state = initialState, action) {
  switch (action.type) {
    case GET_REFUND_ORDER_LIST:
      return ReduckHelper.resolveListState('refund', state, action.payload)
    case GET_REFUND_ORDER_DETAIL:
      return {
        ...state,
        refundOrderDetail: action.payload
      }
    case GET_ORDER_REFUND_DICT:
      return {
        ...state,
        dictionary: action.payload
      }
    default:
      return state
  }
}
