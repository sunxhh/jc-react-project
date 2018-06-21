import { createAction } from 'redux-actions'
import { message } from 'antd'

import { fetchSupplyChain as fetchData } from 'Utils/fetch'
import { SHOW_LIST_SPIN, SHOW_SPIN, SHOW_BUTTON_SPIN } from 'Global/action'

import apis from '../../apis'
// ===========================> Action Types <=========================== //
export const GET_ORDER_LIST = '/spa/order/GET_ORDER_LIST' // 采购订单列表
export const GET_ORDER_DETAIL = '/spa/order/GET_ORDER_DETAIL' // 采购订单详情
export const GET_ORDER_WAREHOUSE_DETAIL = '/spa/order/GET_ORDER_WAREHOUSE_DETAIL' // 入库单详情
export const GET_SUPPLY_LIST = '/spa/order/GET_SUPPLY_LIST' // 获取供应商
// ===========================> Actions <=========================== //
const getOrderReq = {
  purOrderId: '',
  supplierNo: '',
  status: '',
  warehouseNo: '',
  operator: '',
  currentPage: 1,
  pageSize: 10
}

// 获取采购订单列表
export const getOrderList = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.purchase.order.purhcaseOrderQueryList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_ORDER_LIST)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 采购订单详情
export const getOrderDetail = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_SPIN)(apis.purchase.order.purhcaseOrderDetail, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_ORDER_DETAIL)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 入库单详情
export const getOrderWareHouseDetail = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_SPIN)(apis.purchase.order.inboundInfo, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_ORDER_WAREHOUSE_DETAIL)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 删除采购单
export const deletePurchaseOrder = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_SPIN)(apis.purchase.order.deletePurchaseOrder, arg).then(res => {
      if (res.code === 0) {
        message.success('删除成功！')
        dispatch(getOrderList(getOrderReq))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 确认采购
export const confirmPurchase = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_SPIN)(apis.purchase.order.confirmPurchase, arg).then(res => {
      if (res.code === 0) {
        message.success('操作成功！')
        dispatch(getOrderList(getOrderReq))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 确认结算
export const confirmSettlement = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_SPIN)(apis.purchase.order.confirmSettlement, arg).then(res => {
      if (res.code === 0) {
        message.success('操作成功！')
        dispatch(getOrderList(getOrderReq))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 更新订单
export const updatePurchaseOrder = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.purchase.order.updatePurchaseOrder, arg).then(res => {
      if (res.code === 0) {
        message.success('操作成功！')
        return res.code
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
// ===========================> Reducer <=========================== //

const initialState = {
  loading: false,
  orderList: [],
  page: {
    currentPage: 1,
    pageSize: 10,
    records: 0,
    pages: 0,
  },
  purhcaseOrderDetailTab: [],
  purhcaseOrderDetaiPage: {
    currentPage: 1,
    pageSize: 10,
    records: 0,
    pages: 0,
  },
  purhcaseOrderDetailInfo: {},
  purhcaseOrderWareHouseDetailTab: [],
  purhcaseOrderWareHouseDetaiPage: {
    currentPage: 1,
    pageSize: 10,
    records: 0,
    pages: 0,
  },
  purhcaseOrderWareHouseDetailInfo: {},
  supplyList: [],
}
export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_ORDER_LIST:
      return {
        ...state,
        orderList: action.payload === null ? [] : action.payload.data,
        page: {
          currentPage: action.payload === null ? '' : action.payload.pageNo,
          pageSize: action.payload === null ? '' : action.payload.pageSize,
          records: action.payload === null ? '' : action.payload.records,
          pages: action.payload === null ? '' : action.payload.pages,
        }
      }
    case GET_ORDER_DETAIL:
      return {
        ...state,
        purhcaseOrderDetailTab: action.payload === null ? [] : action.payload.pagerVo.data,
        purhcaseOrderDetaiPage: {
          currentPage: action.payload === null ? '' : action.payload.pagerVo.pageNo,
          pageSize: action.payload === null ? '' : action.payload.pagerVo.pageSize,
          records: action.payload === null ? '' : action.payload.pagerVo.records,
          pages: action.payload === null ? '' : action.payload.pagerVo.pages,
        },
        purhcaseOrderDetailInfo: {
          purOrderId: action.payload === null ? '' : action.payload.purOrderId,
          supplierName: action.payload === null ? '' : action.payload.supplierName,
          warehouseName: action.payload === null ? '' : action.payload.warehouseName,
        }
      }
    case GET_ORDER_WAREHOUSE_DETAIL:
      return {
        ...state,
        purhcaseOrderWareHouseDetailTab: action.payload.result.data,
        purhcaseOrderWareHouseDetaiPage: {
          currentPage: action.payload.result.pageNo,
          pageSize: action.payload.result.pageSize,
          records: action.payload.result.records,
          pages: action.payload.result.pages,
        },
        purhcaseOrderWareHouseDetailInfo: {
          dataSource: action.payload.dataSource,
          warehouseName: action.payload.warehouseName,
          totalAmount: action.payload.totalAmount,
        }
      }
    case GET_SUPPLY_LIST:
      return {
        ...state,
        supplyList: action.payload,
      }
    default:
      return state
  }
}

