/**
 * Created with webstorm
 * User: HuangZeXia / huangzexiameishu@163.com
 * Date: 2018/4/14
 * Time: 上午10:22
 */

import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchSupplyChain as fetchData, fetchLogistics as fetchLogisticsData } from 'Utils/fetch'
import apis from '../apis'
import { SHOW_LIST_SPIN, SHOW_BUTTON_SPIN, SHOW_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //

export const GET_SUPLLY_SHOP_LIST = '/spa/order/GET_SUPLLY_SHOP_LIST' // 获取店铺列表
export const GET_LOGISTIC_LIST = '/spa/order/GET_LOGISTIC_LIST' // 获取店铺和物流公司关系
export const GET_WAYBILL_DETAIL = '/spa/order/GET_WAYBILL_DETAIL' // 获取物流详情

// ===========================> Actions <=========================== //

// 获取店铺列表
export const supplyShopList = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.order.supplyShopList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_SUPLLY_SHOP_LIST)(res.data))
        return res.code
      } else {
        message.error(res.errmsg)
      }
    }).then(res => {
      return res
    })
  }
}

// 获取店铺与物流公司绑定关系
export const getBindLogisticsList = arg => {
  return dispatch => {
    return fetchLogisticsData(dispatch, SHOW_LIST_SPIN)(apis.logistics.getShopLogistics, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_LOGISTIC_LIST)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    }).then(res => {
      return res
    })
  }
}

// 店铺物流公司绑定
export const bindShopLogistics = arg => {
  return dispatch => {
    return fetchLogisticsData(dispatch, SHOW_BUTTON_SPIN)(apis.logistics.bindShopLogistics, arg).then(res => {
      if (res.code === 0) {
        message.success('保存成功！')
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取物流详情
export const getWaybillDetail = arg => {
  return dispatch => {
    return fetchLogisticsData(dispatch, SHOW_SPIN)(apis.logistics.waybill, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_WAYBILL_DETAIL)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}
// ===========================> Reducer <=========================== //

const initialState = {
  getSupplyShopList: [],
  getLogisticsList: [],
  waybillDetail: []
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_SUPLLY_SHOP_LIST:
      return {
        ...state,
        getSupplyShopList: action.payload,
      }
    case GET_LOGISTIC_LIST:
      return {
        ...state,
        getLogisticsList: action.payload,
      }
    case GET_WAYBILL_DETAIL:
      return {
        ...state,
        waybillDetail: action.payload,
      }
    default:
      return state
  }
}
