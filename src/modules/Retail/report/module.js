import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchRetail as fetchShopList, fetchReport as fetchData } from 'Utils/fetch'
import { SHOW_LIST_SPIN } from 'Global/action'
import apis from '../apis'

// ===========================> Action Types <=========================== //

export const SET_QUERY_PAR = '/spa/retail/SET_QUERY_PAR' // 设置查询参数
export const SET_DETAIL_QUERY_PAR = '/spa/retail/SET_DETAIL_QUERY_PAR' // 设置明细查询参数
export const SET_GOODS_QUERY_PAR = '/spa/retail/SET_GOODS_QUERY_PAR' // 设置销售排行参数 按商品
export const SET_CATEGORY_ONE_QUERY_PAR = '/spa/retail/SET_CATEGORY_ONE_QUERY_PAR' // 设置销售排行参数 按分类1
export const SET_CATEGORY_TWO_QUERY_PAR = '/spa/retail/SET_CATEGORY_TWO_QUERY_PAR' // 设置销售排行参数 按分类1

export const SALE_TIME_LINE = '/spa/retail/SALE_TIME_LINE' // 销售时间带分析列表
export const SALE_DETAIL = '/spa/retail/SALE_DETAIL' // 销售明细表
export const RANK_GOODS_LIST = '/spa/retail/RANK_GOODS_LIST' // 销售排行分页查询 按商品
export const RANK_CATEGORY_LIST = '/spa/retail/RANK_CATEGORY_LIST' // 销售排行分页查询 按分类

export const SET_SHOP_LIST = '/spa/retail/SET_SHOP_LIST' // 门店列表
export const SET_FILTER_LOADING_LIST = '/spa/retail/SET_FILTER_LOADING_LIST' //

export default {
  namespace: 'report',

  state: {
    saleTimeLine: [],
    page: {
      currentPage: 1,
      pageSize: 20
    },
    saleDetail: [],
    gatherMap: {},
    detailPage: {
      currentPage: 1,
      pageSize: 20
    },
    rankGoodsList: [],
    rankGoodsPage: {
      currentPage: 1,
      pageSize: 20
    },
    rankCategoryList: [],
    rankCategoryPage: {
      currentPage: 1,
      pageSize: 20
    },
    initQueryPar: {},
    initDetailQueryPar: {},
    initGoodsQueryPar: {},
    initCategorysOneQueryPar: {},
    initCategorysTwoQueryPar: {},
    shopList: [],
  },

  actions: {
    setQueryPar(arg) {
      return createAction(SET_QUERY_PAR)(arg)
    },
    getOrderListAction(payload) {
      return createAction(SALE_TIME_LINE)(payload)
    },
    setDetailQueryPar(arg) {
      return createAction(SET_DETAIL_QUERY_PAR)(arg)
    },
    getSaleDetailAction(payload) {
      return createAction(SALE_DETAIL)(payload)
    },
    setGoodsQueryPar(arg) {
      return createAction(SET_GOODS_QUERY_PAR)(arg)
    },
    getGoodsAction(payload) {
      return createAction(RANK_GOODS_LIST)(payload)
    },
    setCategoryOneQueryPar(arg) {
      return createAction(SET_CATEGORY_ONE_QUERY_PAR)(arg)
    },
    setCategoryTwoQueryPar(arg) {
      return createAction(SET_CATEGORY_TWO_QUERY_PAR)(arg)
    },
    getCategoryAction(payload) {
      return createAction(RANK_CATEGORY_LIST)(payload)
    },
    getSaleTimeLine(arg) {
      return dispatch => {
        return fetchData(dispatch, SHOW_LIST_SPIN)(apis.report.saleTimeLine, arg).then(res => {
          if (res.code === 0) {
            dispatch(createAction(SALE_TIME_LINE)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },
    getSaleDetail(arg) {
      return dispatch => {
        return fetchData(dispatch, SHOW_LIST_SPIN)(apis.report.saleDetail, arg).then(res => {
          if (res.code === 0) {
            dispatch(createAction(SALE_DETAIL)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },
    getRankGoodsList(arg) {
      return dispatch => {
        return fetchData(dispatch, SHOW_LIST_SPIN)(apis.report.goods, arg).then(res => {
          if (res.code === 0) {
            dispatch(createAction(RANK_GOODS_LIST)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },
    getRankCategoryList(arg) {
      return dispatch => {
        return fetchData(dispatch, SHOW_LIST_SPIN)(apis.report.category, arg).then(res => {
          if (res.code === 0) {
            dispatch(createAction(RANK_CATEGORY_LIST)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },
    getShopList(arg) {
      return dispatch => {
        dispatch(createAction(SET_FILTER_LOADING_LIST)(true))
        fetchShopList(apis.report.shopList, arg).then(res => {
          dispatch(createAction(SET_FILTER_LOADING_LIST)(false))
          if (res.code === 0) {
            dispatch(createAction(SET_SHOP_LIST)(res.data))
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
    [SET_FILTER_LOADING_LIST]: (state, action) => ({
      ...state,
      selectFetchingFlag: action.payload,
    }),
    [SALE_TIME_LINE]: (state, action) => ({
      ...state,
      saleTimeLine: action.payload,
      page: {
        pageNo: action.payload === null ? '' : action.payload.pageNo,
        currentPage: action.payload === null ? '' : action.payload.pageNo,
        pageSize: action.payload === null ? '' : action.payload.pageSize,
        records: action.payload === null ? '' : action.payload.records,
        pages: action.payload === null ? '' : action.payload.pages,
      }
    }),
    [SALE_DETAIL]: (state, action) => ({
      ...state,
      saleDetail: action.payload.data,
      gatherMap: action.payload.gatherMap,
      detailPage: {
        pageNo: action.payload === null ? '' : action.payload.pageNo,
        currentPage: action.payload === null ? '' : action.payload.pageNo,
        pageSize: action.payload === null ? '' : action.payload.pageSize,
        records: action.payload === null ? '' : action.payload.records,
        pages: action.payload === null ? '' : action.payload.pages,
      }
    }),
    [RANK_GOODS_LIST]: (state, action) => ({
      ...state,
      rankGoodsList: action.payload ? action.payload.data : [],
      rankGoodsPage: {
        pageNo: action.payload === null ? '' : action.payload.pageNo,
        currentPage: action.payload === null ? '' : action.payload.pageNo,
        pageSize: action.payload === null ? '' : action.payload.pageSize,
        records: action.payload === null ? '' : action.payload.records,
        pages: action.payload === null ? '' : action.payload.pages,
      }
    }),
    [RANK_CATEGORY_LIST]: (state, action) => ({
      ...state,
      rankCategoryList: action.payload ? action.payload.data : [],
      rankCategoryPage: {
        pageNo: action.payload === null ? '' : action.payload.pageNo,
        currentPage: action.payload === null ? '' : action.payload.pageNo,
        pageSize: action.payload === null ? '' : action.payload.pageSize,
        records: action.payload === null ? '' : action.payload.records,
        pages: action.payload === null ? '' : action.payload.pages,
      }
    }),
    [SET_QUERY_PAR]: (state, action) => ({
      ...state,
      initQueryPar: action.payload,
    }),
    [SET_DETAIL_QUERY_PAR]: (state, action) => ({
      ...state,
      initDetailQueryPar: action.payload,
    }),
    [SET_GOODS_QUERY_PAR]: (state, action) => ({
      ...state,
      initGoodsQueryPar: action.payload,
    }),
    [SET_CATEGORY_ONE_QUERY_PAR]: (state, action) => ({
      ...state,
      initCategorysOneQueryPar: action.payload,
    }),
    [SET_CATEGORY_TWO_QUERY_PAR]: (state, action) => ({
      ...state,
      initCategorysTwoQueryPar: action.payload,
    })
  },

  children: [
  ]
}
