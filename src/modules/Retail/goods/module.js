import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchRetail as fetchData, fetchSupplyChain as fileFetch } from 'Utils/fetch'
import { SHOW_LIST_SPIN } from 'Global/action'
import apis from '../apis'

// ===========================> Action Types <=========================== //

export const SET_GOODS_LIST = '/spa/retail/SET_GOODS_LIST' // 商品中心
export const CATEGORY_LIST = '/spa/retail/CATEGORY_LIST' // 系统分类列表
export const GOODS_TYPE_LIST = '/spa/retail/GOODS_TYPE_LIST' // 商品类型
export const SET_GOODS_DETAIL = '/spa/retail/SET_GOODS_DETAIL' // 商品中心 商品详情
export const RESET_GOODS_DETAIL = '/spa/retail/RESET_GOODS_DETAIL' // 商品中心 商品详情重置
export const SET_GOODS_QUERY_PAR = '/spa/retail/SET_GOODS_QUERY_PAR' // 商品中心 设置查询参数
export const RESET_GOODS_QUERY_PAR = '/spa/retail/RESET_GOODS_QUERY_PAR' // 商品中心 重置查询参数
export const SET_QINIU_TOKEN = '/spa/retail/SET_QINIU_TOKEN' // 商品中心 获取七牛token
export const SET_FILTER_LOADING_LIST = '/spa/retail/SET_FILTER_LOADING_LIST' // 列表

export default {
  namespace: 'goods',

  state: {
    goodList: [],
    categoryList: [],
    goodsTypeList: [],
    info: {},
    initQueryPar: {
      goodsNo: '',
      sku: '',
      goodsName: '',
      categoryNo: '',
      goodsType: '',
    },
    qiniuToken: '',
    page: {
      currentPage: 1,
      pageSize: 20
    },
    selectFetchingFlag: false,
  },

  actions: {
    setGoodDetail(arg) {
      return createAction(SET_GOODS_DETAIL)(arg)
    },
    resetGoodDetail() {
      return createAction(RESET_GOODS_DETAIL)()
    },
    setQueryPar(arg) {
      return createAction(SET_GOODS_QUERY_PAR)(arg)
    },
    resetQueryPar() {
      return createAction(RESET_GOODS_QUERY_PAR)()
    },
    getGoodList(arg) {
      return dispatch => {
        return fetchData(dispatch, SHOW_LIST_SPIN)(apis.goods.list, arg).then(res => {
          if (res.code === 0) {
            dispatch(createAction(SET_GOODS_LIST)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },
    getCategoryList(arg) {
      return dispatch => {
        dispatch(createAction(SET_FILTER_LOADING_LIST)(true))
        return fetchData(dispatch, SHOW_LIST_SPIN)(apis.goods.categoryList, arg).then(res => {
          dispatch(createAction(SET_FILTER_LOADING_LIST)(false))
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
    addGood(arg, isEdit) {
      return dispatch => {
        let url = apis.goods.add
        if (isEdit) {
          url = apis.goods.modify
        }
        return new Promise(function (resolve, reject) {
          fetchData(dispatch)(url, arg, '正在保存...').then(res => {
            if (res.code === 0) {
              message.success('提交成功')
              resolve({ status: 'success' })
            } else {
              resolve({ status: 'error' })
              message.error(res.errmsg)
            }
          })
        })
      }
    },
    getGoodDetail(arg) {
      return dispatch => {
        const that = this
        dispatch(that.resetGoodDetail())
        return new Promise(function (resolve, reject) {
          fetchData(dispatch)(apis.goods.detail, arg).then(res => {
            if (res.code === 0) {
              dispatch(that.setGoodDetail(res.data))
              resolve({ status: 'success', result: res.data })
            } else {
              reject({ status: 'error' })
              message.error(res.errmsg)
            }
          })
        })
      }
    },
    getQiniuToken(key) {
      return dispatch => {
        fileFetch(apis.qiniuToken, { key }).then(res => {
          if (res.code === 0) {
            dispatch(createAction(SET_QINIU_TOKEN)(res.data.token))
          }
        })
      }
    }
  },

  reducers: {
    [SET_GOODS_LIST]: (state, action) => ({
      ...state,
      goodList: action.payload.data,
      page: {
        pageNo: action.payload === null ? '' : action.payload.pageNo,
        currentPage: action.payload === null ? '' : action.payload.pageNo,
        pageSize: action.payload === null ? '' : action.payload.pageSize,
        records: action.payload === null ? '' : action.payload.records,
        pages: action.payload === null ? '' : action.payload.pages,
      }
    }),
    [CATEGORY_LIST]: (state, action) => ({
      ...state,
      categoryList: action.payload,
    }),
    [GOODS_TYPE_LIST]: (state, action) => ({
      ...state,
      goodsTypeList: action.payload,
    }),
    [SET_GOODS_DETAIL]: (state, action) => ({
      ...state,
      info: action.payload
    }),
    [RESET_GOODS_DETAIL]: (state, action) => ({
      ...state,
      info: {}
    }),
    [SET_FILTER_LOADING_LIST]: (state, action) => ({
      ...state,
      selectFetchingFlag: action.payload,
    }),
    [SET_QINIU_TOKEN]: (state, action) => ({
      ...state, qiniuToken: action.payload
    }),
    [SET_GOODS_QUERY_PAR]: (state, action) => ({
      ...state,
      initQueryPar: action.payload,
    }),
    [RESET_GOODS_QUERY_PAR]: (state, action) => ({
      ...state,
      initQueryPar: {
        goodsNo: '',
        sku: '',
        goodsName: '',
        categoryNo: '',
        goodsType: '',
      }
    }),
  },

  children: [
  ]
}
