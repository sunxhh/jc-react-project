import { message } from 'antd'
import { SHOW_LIST_SPIN } from 'Global/action'
import apis from '../../apis'
import { fetchRetail as fetchData } from 'Utils/fetch'
import { createAction } from 'redux-actions'
// ===========================> Action Types <=========================== //
export const SET_LOSS_OVERFLOW_QUERY_PARAM = 'spa/retail/stock/SET_LOSS_OVERFLOW_QUERY_PARAM' // 报损报溢单查询条件
export const GET_LOSS_OVERFLOW_LIST = 'spa/retail/stock/GET_LOSS_OVERFLOW_LIST' // 报损报溢单列表
export const GET_LOSS_OVERFLOW_DETAIL_LIST = 'spa/retail/stock/GET_LOSS_OVERFLOW_DETAIL_LIST' // 报损报溢单详情列表
export const GET_LOSS_OVERFLOW_DETAIL_PRINT_LIST = 'spa/retail/stock/GET_LOSS_OVERFLOW_DETAIL_PRINT_LIST' // 报损报溢单详情打印列表
export const RESET_LOSS_OVERFLOW_DETAIL_IN = 'spa/retail/stock/RESET_LOSS_OVERFLOW_DETAIL_IN' // 重置报损报溢单详情
export default {
  namespace: 'lossOverflow',

  state: {
    lossOverflowList: [],
    lossOverflowDetailList: [],
    lossOverflowDetailIn: {
      lossAmount: '',
      spillAmount: '',
    },
    lossOverflowDetailPrintIn: {
      result: {}
    },
    lossOverflowDetailPrintList: [],
    lossOverflowPage: {
      current: 1,
      pageSize: 20,
      records: 0,
      pages: 0,
    },
    lossOverflowDetailPage: {
      current: 1,
      pageSize: 20,
      records: 0,
      pages: 0,
    },
    // 搜索选项
    lossOverflowQueryParam: {
      time: undefined,
      lossNo: '', // 报损报溢单号
    }
  },

  actions: {
    setQueryParam: param => {
      return createAction(SET_LOSS_OVERFLOW_QUERY_PARAM)(param)
    },
    getLossOverflowList: arg => dispatch => {
      return fetchData(dispatch)(apis.stock.inventoryLossOverflowSearch, arg).then(res => {
        if (res.code === 0) {
          dispatch(createAction(GET_LOSS_OVERFLOW_LIST)(res.data))
        } else {
          message.error(res.errmsg)
        }
      })
    },
    getLossOverflowDetailList: arg => dispatch => {
      return fetchData(dispatch, SHOW_LIST_SPIN)(apis.stock.inventoryLossOverflowIn, arg).then(res => {
        if (res.code === 0) {
          dispatch(createAction(GET_LOSS_OVERFLOW_DETAIL_LIST)(res.data))
        } else {
          message.error(res.errmsg)
        }
      })
    },
    getLossOverflowDetailPrintList: arg => dispatch => {
      arg.currentPage = 1
      arg.pageSize = 1000
      return fetchData(dispatch, SHOW_LIST_SPIN)(apis.stock.inventoryLossOverflowIn, arg).then(res => {
        if (res.code === 0) {
          dispatch(createAction(GET_LOSS_OVERFLOW_DETAIL_PRINT_LIST)(res.data))
          return true
        } else {
          message.error(res.errmsg)
          return false
        }
      })
    },
    resetLossOverflowDetailIn: arg => dispatch => {
      dispatch(createAction(RESET_LOSS_OVERFLOW_DETAIL_IN)())
    }
  },

  reducers: {
    [SET_LOSS_OVERFLOW_QUERY_PARAM]: (state, action) => ({
      ...state,
      lossOverflowQueryParam: action.payload
    }),
    [GET_LOSS_OVERFLOW_LIST]: (state, action) => ({
      ...state,
      lossOverflowList: action.payload.data,
      lossOverflowPage: {
        pageNo: action.payload.pageNo,
        pageSize: action.payload.pageSize,
        records: action.payload.records,
        pages: action.payload.pages,
      }
    }),
    [GET_LOSS_OVERFLOW_DETAIL_LIST]: (state, action) => ({
      ...state,
      lossOverflowDetailIn: {
        lossNo: action.payload.lossNo,
        lossCount: action.payload.lossCount,
        lossAmount: action.payload.lossAmount,
        spillCount: action.payload.spillCount,
        spillAmount: action.payload.spillAmount,
        operator: action.payload.operator,
        countsDate: action.payload.countsDate
      },
      lossOverflowDetailList: action.payload.result.data,
      lossOverflowDetailPage: {
        pageNo: action.payload.result.pageNo,
        pageSize: action.payload.result.pageSize,
        records: action.payload.result.records,
        pages: action.payload.result.pages,
      }
    }),
    [RESET_LOSS_OVERFLOW_DETAIL_IN]: (state, action) => ({
      ...state,
      lossOverflowDetailIn: {
        lossNo: '',
        lossCount: '',
        lossAmount: '',
        spillCount: '',
        spillAmount: '',
        operator: '',
        countsDate: ''
      },
      lossOverflowDetailList: [],
      lossOverflowDetailPage: {
        current: 1,
        pageSize: 20,
        records: 0,
        pages: 0,
      }
    }),
    [GET_LOSS_OVERFLOW_DETAIL_PRINT_LIST]: (state, action) => ({
      ...state,
      lossOverflowDetailPrintIn: {
        ...action.payload,
        diffCount: parseFloat(action.payload.lossCount) + parseFloat(action.payload.spillCount),
        diffAmount: (parseFloat(action.payload.lossAmount) + parseFloat(action.payload.spillAmount)).toFixed(2)
      }
    })
  },

  children: [
    // subModule
  ]
}
