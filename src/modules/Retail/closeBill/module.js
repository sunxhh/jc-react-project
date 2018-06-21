import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchRetail as fetchData } from 'Utils/fetch'
import { SHOW_LIST_SPIN } from 'Global/action'
import apis from '../apis'

// ===========================> Action Types <=========================== //

export const SET_QUERY_PAR = '/spa/retail/SET_QUERY_PAR' // 设置查询参数
export const BILL_LIST = '/spa/retail/BILL_LIST' // 单据列表
export const BILL_ORDER_LIST = '/spa/retail/BILL_ORDER_LIST' // 单据订单列表
export const BILL_ORDER_DETAIL = '/spa/retail/BILL_ORDER_DETAIL'// 单据订单详情
export const SET_SHOP_LIST = '/spa/retail/SET_SHOP_LIST' // 门店列表
export const SET_FILTER_LOADING_LIST = '/spa/retail/SET_FILTER_LOADING_LIST' //
export const SET_QUERY_PAR_ORDER = '/spa/retail/SET_QUERY_PAR_ORDER' //

export default {
  namespace: 'closeBill',

  state: {
    billList: [],
    initQueryPar: {
      accountNo: '',
      createUser: '',
      startTime: '',
      endTime: '',
      orgCode: '',
    },
    initQueryParOrder: {
      orderNo: ''
    },
    page: {
      currentPage: 1,
      pageSize: 20
    },
    orderList: [],
    orderInfo: {},
    orderSkuInfoVO: [],
    loadingBtn: false,
  },

  actions: {
    setQueryPar(arg) {
      return createAction(SET_QUERY_PAR)(arg)
    },
    setQueryParOrder(arg) {
      return createAction(SET_QUERY_PAR_ORDER)(arg)
    },
    getBillListAction(payload) {
      return createAction(BILL_LIST)(payload)
    },
    getBillOrderListAction(payload) {
      return createAction(BILL_LIST)(payload)
    },
    getBillList(arg) {
      return dispatch => {
        return fetchData(dispatch, SHOW_LIST_SPIN)(apis.closeBill.list, arg).then(res => {
          if (res.code === 0) {
            dispatch(createAction(BILL_LIST)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },
    getShopList(arg) {
      return dispatch => {
        dispatch(createAction(SET_FILTER_LOADING_LIST)(true))
        fetchData(apis.closeBill.shopList, arg).then(res => {
          dispatch(createAction(SET_FILTER_LOADING_LIST)(false))
          if (res.code === 0) {
            dispatch(createAction(SET_SHOP_LIST)(res.data))
          }
        })
      }
    },
    getBillOrderList(arg) {
      return dispatch => {
        return fetchData(dispatch, SHOW_LIST_SPIN)(apis.closeBill.orderList, arg).then(res => {
          if (res.code === 0) {
            dispatch(createAction(BILL_ORDER_LIST)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },
    getBillOrderDetail(values) {
      return dispatch => {
        fetchData(dispatch, SHOW_LIST_SPIN)(apis.closeBill.orderDetail, values).then(req => {
          if (req.code === 0) {
            dispatch(createAction(BILL_ORDER_DETAIL)(req.data))
          } else {
            message.error(req.errmsg)
          }
        })
      }
    }
  },

  reducers: {
    [SET_SHOP_LIST]: (state, action) => ({
      ...state,
      shopList: action.payload,
    }),
    [BILL_LIST]: (state, action) => ({
      ...state,
      billList: action.payload.data,
      page: {
        pageNo: action.payload === null ? '' : action.payload.pageNo,
        currentPage: action.payload === null ? '' : action.payload.pageNo,
        pageSize: action.payload === null ? '' : action.payload.pageSize,
        records: action.payload === null ? '' : action.payload.records,
        pages: action.payload === null ? '' : action.payload.pages,
      }
    }),
    [BILL_ORDER_LIST]: (state, action) => ({
      ...state,
      orderList: action.payload.data,
      orderPage: {
        pageNo: action.payload === null ? '' : action.payload.pageNo,
        currentPage: action.payload === null ? '' : action.payload.pageNo,
        pageSize: action.payload === null ? '' : action.payload.pageSize,
        records: action.payload === null ? '' : action.payload.records,
        pages: action.payload === null ? '' : action.payload.pages,
      }
    }),
    [BILL_ORDER_DETAIL]: (state, action) => ({
      ...state,
      orderInfo: action.payload,
      orderSkuInfoVO: action.payload.orderSkuInfoVO,
    }),
    [SET_QUERY_PAR]: (state, action) => ({
      ...state,
      initQueryPar: action.payload,
    }),
    [SET_QUERY_PAR_ORDER]: (state, action) => ({
      ...state,
      initQueryParOrder: action.payload,
    })
  },

  children: [
  ]
}
