import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchRetail as fetchData } from 'Utils/fetch'
import { SHOW_LIST_SPIN } from 'Global/action'
import apis from '../apis'

// ===========================> Action Types <=========================== //

export const SET_GOODS_PRICE_QUERY_PAR = '/spa/retail/SET_GOODS_PRICE_QUERY_PAR' // 品牌价格 设置查询参数
export const RESET_GOODS_PRICE_QUERY_PAR = '/spa/retail/RESET_GOODS_PRICE_QUERY_PAR' // 品牌价格 重置查询参数
export const SET_GOODS_PRICE_LIST = '/spa/retail/SET_GOODS_PRICE_LIST' // 商品价格列表
export const CATEGORY_LIST = '/spa/retail/CATEGORY_LIST' // 系统分类列表
export const GOODS_TYPE_LIST = '/spa/retail/GOODS_TYPE_LIST' // 商品类型

export default {
  namespace: 'goodsPrice',

  state: {
    goodPriceList: [],
    listConditions: {},
    initQueryPar: {
      goodsNo: '',
      sku: '',
      goodsName: '',
    },
    page: {
      currentPage: 1,
      pageSize: 20
    },
    categoryList: [],
    goodsTypeList: [],
  },

  actions: {
    setQueryPar(arg) {
      return createAction(SET_GOODS_PRICE_QUERY_PAR)(arg)
    },
    resetQueryPar() {
      return createAction(RESET_GOODS_PRICE_QUERY_PAR)()
    },
    getGoodPriceList(arg) {
      return dispatch => {
        return new Promise((resolve) => {
          fetchData(dispatch, SHOW_LIST_SPIN)(apis.goodsPrice.list, arg).then(res => {
            if (res.code === 0) {
              // dispatch(createAction(SET_GOODS_PRICE_LIST)(res.data))
              resolve({ status: 'success', result: res.data })
            } else {
              resolve({ status: 'error' })
              // message.error(res.errmsg)
            }
          })
        })
      }
    },
    updateGood(arg) {
      return dispatch => {
        return new Promise((resolve) => {
          fetchData(apis.goodsPrice.modify, arg).then(res => {
            if (res.code === 0) {
              resolve({ status: 'success' })
              message.success('保存成功！')
            } else {
              resolve({ status: 'error' })
              message.error(res.errmsg)
            }
          })
        })
      }
    },
    getCategoryList(arg) {
      return dispatch => {
        return fetchData(dispatch, SHOW_LIST_SPIN)(apis.goods.categoryList, arg).then(res => {
          if (res.code === 0) {
            dispatch(createAction(CATEGORY_LIST)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },
    getGoodsTypeList(arg) {
      return dispatch => {
        return fetchData(dispatch, SHOW_LIST_SPIN)(apis.goods.goodsTypeList, arg).then(res => {
          if (res.code === 0) {
            dispatch(createAction(GOODS_TYPE_LIST)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },
  },

  reducers: {
    [SET_GOODS_PRICE_LIST]: (state, action) => ({
      ...state,
      goodPriceList: action.payload.data,
      page: {
        pageNo: action.payload === null ? '' : action.payload.pageNo,
        currentPage: action.payload === null ? '' : action.payload.pageNo,
        pageSize: action.payload === null ? '' : action.payload.pageSize,
        records: action.payload === null ? '' : action.payload.records,
        pages: action.payload === null ? '' : action.payload.pages,
      }
    }),
    [SET_GOODS_PRICE_QUERY_PAR]: (state, action) => ({
      ...state,
      initQueryPar: action.payload,
    }),
    [RESET_GOODS_PRICE_QUERY_PAR]: (state, action) => ({
      ...state,
      initQueryPar: {
        goodsNo: '',
        sku: '',
        goodsName: '',
      },
    }),
    [CATEGORY_LIST]: (state, action) => ({
      ...state,
      categoryList: action.payload,
    }),
    [GOODS_TYPE_LIST]: (state, action) => ({
      ...state,
      goodsTypeList: action.payload,
    }),
  },

  children: [
  ]
}
