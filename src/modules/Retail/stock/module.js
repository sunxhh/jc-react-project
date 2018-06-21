import { message } from 'antd'
import { SHOW_LIST_SPIN } from 'Global/action'
import apis from '../apis'
import { fetchRetail as fetchData } from 'Utils/fetch'
import { createAction } from 'redux-actions'

import InventoryModule from './inventory/module'
import LossOverflowModule from './lossOverflow/module'

// ===========================> Action Types <=========================== //
export const SET_STOCK_QUERY_PARAM = 'spa/retail/store/SET_STOCK_QUERY_PARAM' // 库存查询参数
export const GET_STOCK_LIST = 'spa/retail/store/GET_STOCK_LIST' // 库存查询
export const GET_STOCK_SHELF_DISTRIBUTE_LIST = 'spa/retail/store/GET_STOCK_SHELF_DISTRIBUTE_LIST' // 库存分布查询
export const GET_GET_STOCK_BY_SKU_NO = 'spa/retail/store/GET_GET_STOCK_BY_SKU_NO' // 根据skuno获取库存信息
export const GET_QUERY_FRONT_CATEGORY = 'spa/retail/category/GET_QUERY_FRONT_CATEGORY' // 前台分类
export const RESET_STOCK_SHELF_DISTRIBUTE_IN = 'spa/retail/store/RESET_STOCK_SHELF_DISTRIBUTE_IN' // 重置分布信息

export default {
  namespace: 'stock',

  state: {
    stockIn: {},
    stockList: [],
    frontCategory: [],
    page: {
      current: 1,
      pageSize: 20,
      records: 0,
      pages: 0,
    },
    // 搜索选项
    stockQueryParam: {
      skuNo: '', //
      goodsName: '', //
      retailCatg: undefined, // 前端分类
      goodsCatgNo: undefined, //
      goodsType: undefined,
      status: undefined,
      orgCode: undefined
    }
  },

  actions: {
    setQueryParam: param => {
      return createAction(SET_STOCK_QUERY_PARAM)(param)
    },
    getStockList: arg => dispatch => {
      let apiUrl = arg.orgLevel === '0' ? apis.stock.chainStockList : apis.stock.list
      delete arg.orgLevel
      return fetchData(dispatch, SHOW_LIST_SPIN)(apiUrl, arg).then(res => {
        if (res.code === 0) {
          dispatch(createAction(GET_STOCK_LIST)(res.data))
        } else {
          message.error(res.errmsg)
        }
      })
    },
    getStockShelfDistribute: arg => dispatch => {
      let apiUrl = arg.orgLevel === '0' ? apis.stock.chainStockShelfDistribute : apis.stock.shelfDistribute
      if (arg.orgLevel !== '0') {
        delete arg.orgCode
      }
      delete arg.orgLevel
      return fetchData(dispatch, SHOW_LIST_SPIN)(apiUrl, arg).then(res => {
        if (res.code === 0) {
          dispatch(createAction(GET_STOCK_SHELF_DISTRIBUTE_LIST)(res.data))
        } else {
          message.error(res.errmsg)
        }
      })
    },
    resetStockShelfDistributeIn: arg => dispatch => {
      dispatch(createAction(RESET_STOCK_SHELF_DISTRIBUTE_IN)())
    },
    getStockBySku: arg => dispatch => {
      if (arg.orgLevel !== '0') {
        delete arg.orgCode
      }
      return fetchData(apis.stock.stockBySku, arg).then(res => {
        if (res.code === 0) {
          dispatch(createAction(GET_GET_STOCK_BY_SKU_NO)(res.data))
        }
      })
    },
    getQueryFrontCategory(arg) {
      return dispatch => {
        return fetchData(dispatch, SHOW_LIST_SPIN)(apis.category.queryFrontCategory, arg).then(res => {
          if (res.code === 0) {
            dispatch(createAction(GET_QUERY_FRONT_CATEGORY)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
      }
    }
  },

  reducers: {
    [SET_STOCK_QUERY_PARAM]: (state, action) => ({
      ...state,
      stockQueryParam: action.payload
    }),
    [GET_STOCK_LIST]: (state, action) => ({
      ...state,
      stockList: action.payload.data,
      page: {
        currentPage: action.payload.pageNo,
        pageSize: action.payload.pageSize,
        records: action.payload.records,
        pages: action.payload.pages,
      }
    }),
    [GET_STOCK_SHELF_DISTRIBUTE_LIST]: (state, action) => ({
      ...state,
      stockShelfDistributeList: action.payload.data
    }),
    [RESET_STOCK_SHELF_DISTRIBUTE_IN]: (state, action) => ({
      ...state,
      stockShelfDistributeList: [],
      stockIn: {}
    }),
    [GET_GET_STOCK_BY_SKU_NO]: (state, action) => ({
      ...state,
      stockIn: action.payload
    }),
    [GET_QUERY_FRONT_CATEGORY]: (state, action) => ({
      ...state,
      frontCategory: action.payload
    })
  },

  children: [
    InventoryModule,
    LossOverflowModule
  ]
}
