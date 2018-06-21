import { createAction } from 'redux-actions'
import { message } from 'antd'

import { fetchSupplyChain as fetchData } from 'Utils/fetch'
import { SHOW_LIST_SPIN } from 'Global/action'
import { isEmpty } from 'Utils/lang'

import apis from '../../apis'

// ===========================> Action Types <=========================== //
export const GET_PLAN_LIST = '/spa/order/GET_PLAN_LIST' // 采购计划列表
export const GET_SUPPLY_LIST = '/spa/order/GET_SUPPLY_LIST' // 获取供应商
export const GET_GOODS_CATG = '/spa/order/GET_GOODS_CATG' // 货物所属分类
// ===========================> Actions <=========================== //
const getListType = {
  skuNo: '',
  skuGoodsName: '',
  goodsCatgNo: '',
  supplierNo: '',
  warehouseNo: '',
  startTime: '',
  endTime: '',
  pageNo: 1,
  pageSize: 10,
  hasOrder: 2
}
// 获取采购计划列表
export const getPlanList = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.purchase.plan.planList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_PLAN_LIST)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取供应商
export const getSupplyList = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.purchase.plan.supplyList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_SUPPLY_LIST)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 删除采购计划
export const deletePurchasePlan = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.purchase.plan.deletePurchasePlan, arg).then(res => {
      if (res.code === 0) {
        message.success('操作成功!')
        dispatch(getPlanList(getListType))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 生成订单
export const placePurOrder = arg => {
  return dispatch => {
    return fetchData(dispatch)(apis.purchase.plan.placePurOrder, arg).then(res => {
      dispatch(getPlanList(getListType))
      if (res.code === 0) {
        message.success('操作成功!')
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 添加采购计划
export const addPurchasePlan = arg => {
  return dispatch => {
    return fetchData(dispatch)(apis.purchase.plan.addPurchasePlan, arg).then(res => {
      if (res.code === 0) {
        message.success('添加成功!')
        dispatch(getPlanList(getListType))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取货物所属类别
export const getGoodsCatg = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.common.goodscatg, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_GOODS_CATG)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}
// ===========================> Reducer <=========================== //

const initialState = {
  planList: [],
  page: {
    currentPage: 1,
    pageSize: 10,
    records: 0,
    pages: 0,
  },
  supplyList: [],
  getGoodsCatg: []
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_PLAN_LIST: {
      if (action.payload && isEmpty(action.payload.data)) {
        return {
          ...state,
          planList: [],
          page: {
            currentPage: 1,
            pageSize: 10,
            records: 0,
            pages: 0,
          },
        }
      }
      return {
        ...state,
        planList: action.payload === null ? [] : action.payload.data,
        page: {
          currentPage: action.payload === null ? '' : action.payload.pageNo,
          pageSize: action.payload === null ? '' : action.payload.pageSize,
          records: action.payload === null ? '' : action.payload.records,
          pages: action.payload === null ? '' : action.payload.pages,
        }
      }
    }
    case GET_SUPPLY_LIST:
      return {
        ...state,
        supplyList: action.payload,
      }
    case GET_GOODS_CATG:
      return {
        ...state,
        getGoodsCatg: action.payload,
      }
    default:
      return state
  }
}

