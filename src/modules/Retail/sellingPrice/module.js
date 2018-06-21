import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchRetail as fetchData } from 'Utils/fetch'
import { SHOW_LIST_SPIN } from 'Global/action'
import apis from '../apis'

// ===========================> Action Types <=========================== //

export const SET_QUERY_PAR = '/spa/retail/SET_QUERY_PAR' // 设置查询参数
export const GOODS_LIST = '/spa/retail/GOODS_LIST' // 差异价格列表
export const SET_SHOP_LIST = '/spa/retail/SET_SHOP_LIST' // 门店列表
export const SET_FILTER_LOADING_LIST = '/spa/retail/SET_FILTER_LOADING_LIST'
export const CATEGORY_LIST = '/spa/retail/CATEGORY_LIST' // 系统分类列表
export const GOODS_TYPE_LIST = '/spa/retail/GOODS_TYPE_LIST' // 商品类型
export const QUERY_NO_ADD_CATEGORY = '/spa/retail/QUERY_NO_ADD_CATEGORY' // 前台分类

export default {
  namespace: 'sellingPrice',

  state: {
    initQueryPar: {
      goodsNo: '',
      sku: '',
      goodsName: '',
      orgCode: '',
    },
    orderInfo: {},
    shopList: [],
    page: {
      currentPage: 1,
      pageSize: 20
    },
    selectFetchingFlag: false,
    goodsTypeList: [],
    queryNoAddCategory: [],
  },

  actions: {
    setQueryPar(arg) {
      return createAction(SET_QUERY_PAR)(arg)
    },
    getSellingPriceListAction(payload) {
      return createAction(GOODS_LIST)(payload)
    },
    getSellingPriceList(arg) {
      return dispatch => {
        return new Promise((resolve) => {
          fetchData(dispatch, SHOW_LIST_SPIN)(apis.sellingPrice.list, arg).then(res => {
            if (res.code === 0) {
              resolve({ status: 'success', result: res.data })
            } else {
              resolve({ status: 'error' })
              message.error(res.errmsg)
            }
          })
        })
      }
    },
    getShopList(arg) {
      return dispatch => {
        dispatch(createAction(SET_FILTER_LOADING_LIST)(true))
        fetchData(apis.sellingPrice.shopList, arg).then(res => {
          dispatch(createAction(SET_FILTER_LOADING_LIST)(false))
          if (res.code === 0) {
            dispatch(createAction(SET_SHOP_LIST)(res.data))
          }
        })
      }
    },
    modifySalePrice(arg) {
      return dispatch => {
        return new Promise((resolve) => {
          fetchData(apis.sellingPrice.modify, arg).then(res => {
            if (res.code === 0) {
              message.success('保存成功！')
              resolve({ status: 'success' })
            } else {
              message.error(res.errmsg)
              resolve({ status: 'error' })
            }
          })
        })
      }
    },
    addSellingGood(arg) {
      return dispatch => {
        let url = apis.sellingPrice.add
        return new Promise(function (resolve, reject) {
          fetchData(url, arg).then(res => {
            if (res.code === 0) {
              message.success('添加成功！')
              resolve({ status: 'success' })
            } else {
              resolve({ status: 'error' })
              message.error(res.errmsg)
            }
          })
        })
      }
    },
    deleteSalePrice(arg) {
      return dispatch => {
        return new Promise((resolve) => {
          fetchData(apis.sellingPrice.delete, arg).then(res => {
            if (res.code === 0) {
              dispatch(getSellingPriceList(arg))
              message.success('删除成功！')
              resolve({ status: 'success' })
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
        return fetchData(dispatch, SHOW_LIST_SPIN)(apis.storeGoods.category, arg).then(res => {
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
        dispatch(createAction(SET_FILTER_LOADING_LIST)(true))
        return fetchData(dispatch, SHOW_LIST_SPIN)(apis.goods.goodsTypeList, arg).then(res => {
          dispatch(createAction(SET_FILTER_LOADING_LIST)(false))
          if (res.code === 0) {
            dispatch(createAction(GOODS_TYPE_LIST)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },
    getCategory(arg) {
      return dispatch => {
        dispatch(createAction(SET_FILTER_LOADING_LIST)(true))
        return fetchData(dispatch, SHOW_LIST_SPIN)(apis.category.queryFrontCategory, arg).then(res => {
          dispatch(createAction(SET_FILTER_LOADING_LIST)(false))
          if (res.code === 0) {
            dispatch(createAction(QUERY_NO_ADD_CATEGORY)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },
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
    [SET_QUERY_PAR]: (state, action) => ({
      ...state,
      initQueryPar: action.payload,
    }),
    [GOODS_TYPE_LIST]: (state, action) => ({
      ...state,
      goodsTypeList: action.payload,
    }),
    [QUERY_NO_ADD_CATEGORY]: (state, action) => ({
      ...state,
      queryNoAddCategory: action.payload,
    }),
    [CATEGORY_LIST]: (state, action) => ({
      ...state,
      categoryList: action.payload,
    }),
  },

  children: [
  ]
}
