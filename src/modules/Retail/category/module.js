import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchRetail as fetchData } from 'Utils/fetch'
import { SHOW_LIST_SPIN } from 'Global/action'
import apis from '../apis'

// ===========================> Action Types <=========================== //

export const CHAIN_CATEGORY_LIST = '/spa/retail/CHAIN_CATEGORY_LIST' // 分类列表（连锁）
export const STORE_CATEGORY_LIST = '/spa/retail/STORE_CATEGORY_LIST' // 分类列表（门店）
export const NO_ADD_CATEGORY = '/spa/retail/NO_ADD_CATEGORY' // 分类列表（门店添加分类）

export default {
  namespace: 'category',

  state: {
    chainList: [],
    chainPage: {
      currentPage: 1,
      pageSize: 20
    },
    storeList: [],
    storePage: {
      currentPage: 1,
      pageSize: 20
    },
    noAddCategoryList: [],
  },

  actions: {
    getChainCategoryList: arg => dispatch => {
      return fetchData(dispatch, SHOW_LIST_SPIN)(apis.category.chainList, arg).then(res => {
        if (res.code === 0) {
          dispatch(createAction(CHAIN_CATEGORY_LIST)(res.data))
          return ({ status: true })
        } else {
          message.error(res.errmsg)
        }
      })
    },
    getStoreCategoryList(arg) {
      return dispatch => {
        fetchData(dispatch, SHOW_LIST_SPIN)(apis.category.storeList, arg).then(res => {
          if (res.code === 0) {
            dispatch(createAction(STORE_CATEGORY_LIST)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },
    chainAdd: arg => dispatch => {
      return fetchData(apis.category.chainAdd, arg).then(res => {
        if (res.code === 0) {
          message.success('新增成功')
          return ({ status: true })
        } else {
          message.error(res.errmsg)
        }
      })
    },
    chainEdit: arg => dispatch => {
      return fetchData(apis.category.chainEdit, arg).then(res => {
        if (res.code === 0) {
          message.success('编辑成功')
          return ({ status: true })
        } else {
          message.error(res.errmsg)
        }
      })
    },
    getNoAddCategory: arg => dispatch => {
      return fetchData(dispatch, SHOW_LIST_SPIN)(apis.category.queryNoAddCategory, arg).then(res => {
        if (res.code === 0) {
          dispatch(createAction(NO_ADD_CATEGORY)(res.data))
          return ({ status: true })
        } else {
          message.error(res.errmsg)
        }
      })
    },
    getStoreCategoryAdd: arg => dispatch => {
      return fetchData(apis.category.modify, arg).then(res => {
        if (res.code === 0) {
          message.success('新增成功')
          return ({ status: true })
        } else {
          message.error(res.errmsg)
        }
      })
    },
    getStoreCategorySort: arg => dispatch => {
      return fetchData(apis.category.sort, arg).then(res => {
        if (res.code === 0) {
          message.success('排序成功')
          return ({ status: true })
        } else {
          message.error(res.errmsg)
        }
      })
    },
  },

  reducers: {
    [CHAIN_CATEGORY_LIST]: (state, action) => ({
      ...state,
      chainList: action.payload.data,
      chainPage: {
        pageNo: action.payload === null ? '' : action.payload.pageNo,
        pageSize: action.payload === null ? '' : action.payload.pageSize,
        records: action.payload === null ? '' : action.payload.records,
        pages: action.payload === null ? '' : action.payload.pages,
      }
    }),
    [STORE_CATEGORY_LIST]: (state, action) => ({
      ...state,
      storeList: action.payload.data,
      storePage: {
        pageNo: action.payload === null ? '' : action.payload.pageNo,
        pageSize: action.payload === null ? '' : action.payload.pageSize,
        records: action.payload === null ? '' : action.payload.records,
        pages: action.payload === null ? '' : action.payload.pages,
      }
    }),
    [NO_ADD_CATEGORY]: (state, action) => ({
      ...state,
      noAddCategoryList: action.payload,
    }),
  },

  children: [
  ]
}
