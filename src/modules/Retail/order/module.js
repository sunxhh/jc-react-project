import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchRetail as fetchData } from 'Utils/fetch'
import { SHOW_LIST_SPIN } from 'Global/action'
import apis from '../apis'

// ===========================> Action Types <=========================== //

export const SET_QUERY_PAR = '/spa/retail/SET_QUERY_PAR' // 设置查询参数
export const ORDER_LIST = '/spa/retail/ORDER_LIST' // 零售订单列表
export const ORDER_DETAIL = '/spa/retail/ORDER_DETAIL'// 零售订单详情
export const SET_SHOP_LIST = '/spa/retail/SET_SHOP_LIST' // 门店列表
export const SET_FILTER_LOADING_LIST = '/spa/retail/SET_FILTER_LOADING_LIST' //

export default {
  namespace: 'order',

  state: {
    orderList: [],
    initQueryPar: {},
    page: {
      currentPage: 1,
      pageSize: 20
    },
    orderInfo: {},
    orderSkuInfoVO: [],
    shopList: [],
  },

  actions: {
    setQueryPar(arg) {
      return createAction(SET_QUERY_PAR)(arg)
    },
    getOrderListAction(payload) {
      return createAction(ORDER_LIST)(payload)
    },
    getOrderList(arg) {
      return dispatch => {
        return fetchData(dispatch, SHOW_LIST_SPIN)(apis.orderList.list, arg).then(res => {
          if (res.code === 0) {
            dispatch(createAction(ORDER_LIST)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },
    getOrderDetail(values) {
      return dispatch => {
        fetchData(dispatch, SHOW_LIST_SPIN)(apis.orderList.detail, values).then(req => {
          if (req.code === 0) {
            dispatch(createAction(ORDER_DETAIL)(req.data))
          } else {
            message.error(req.errmsg)
          }
        })
      }
    },
    getShopList(arg) {
      return dispatch => {
        dispatch(createAction(SET_FILTER_LOADING_LIST)(true))
        fetchData(apis.orderList.shopList, arg).then(res => {
          dispatch(createAction(SET_FILTER_LOADING_LIST)(false))
          if (res.code === 0) {
            dispatch(createAction(SET_SHOP_LIST)(res.data))
          }
        })
      }
    },
    getRefund(arg) {
      return dispatch => {
        return new Promise((resolve) => {
          fetchData(apis.orderList.refund, arg).then(res => {
            if (res.code === 0) {
              message.success('申请退款成功！')
              resolve({ status: 'success' })
            } else {
              message.error(res.errmsg)
              resolve({ status: 'error' })
            }
          })
        })
      }
    }
  },

  reducers: {
    [SET_SHOP_LIST]: (state, action) => ({
      ...state,
      shopList: action.payload,
    }),
    [SET_FILTER_LOADING_LIST]: (state, action) => ({
      ...state,
      selectFetchingFlag: action.payload,
    }),
    [ORDER_LIST]: (state, action) => ({
      ...state,
      orderList: action.payload.data,
      page: {
        pageNo: action.payload === null ? '' : action.payload.pageNo,
        currentPage: action.payload === null ? '' : action.payload.pageNo,
        pageSize: action.payload === null ? '' : action.payload.pageSize,
        records: action.payload === null ? '' : action.payload.records,
        pages: action.payload === null ? '' : action.payload.pages,
      }
    }),
    [ORDER_DETAIL]: (state, action) => ({
      ...state,
      orderInfo: action.payload,
      orderSkuInfoVO: action.payload.orderSkuInfoVO,
    }),
    [SET_QUERY_PAR]: (state, action) => ({
      ...state,
      initQueryPar: action.payload,
    })
  },

  children: [
  ]
}
