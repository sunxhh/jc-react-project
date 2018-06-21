import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchRetail as fetchData } from 'Utils/fetch'
// import { SHOW_LIST_SPIN } from 'Global/action'
import apis from '../apis'

// ===========================> Action Types <=========================== //

export const SET_QUERY_PAR = '/spa/retail/SET_QUERY_PAR' // 设置查询参数
export const SET_SHOP_LIST = '/spa/retail/SET_SHOP_LIST' // 门店列表
export const SET_FILTER_LOADING_LIST = '/spa/retail/SET_FILTER_LOADING_LIST' //

export default {
  namespace: 'goodsCate',

  state: {
    listConditions: {},
    initQueryPar: {
      orgCode: '',
    },
    shopList: [],
    page: {
      currentPage: 1,
      pageSize: 20
    },
  },

  actions: {
    setQueryPar(arg) {
      return createAction(SET_QUERY_PAR)(arg)
    },
    getCateList(arg) {
      return dispatch => {
        return new Promise((resolve) => {
          fetchData(dispatch)(apis.goodsCate.list, arg).then(res => {
            if (res.code === 0) {
              resolve({
                status: 'success',
                goodsCatgOneList: res.data.goodsCatgOneList,
                goodsCatgTwoList: res.data.goodsCatgTwoList,
                type: res.data.type
              })
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
        fetchData(apis.goodsCate.shopList, arg).then(res => {
          dispatch(createAction(SET_FILTER_LOADING_LIST)(false))
          if (res.code === 0) {
            dispatch(createAction(SET_SHOP_LIST)(res.data))
          }
        })
      }
    },
    goodSort(arg) {
      return dispatch => {
        return new Promise((resolve) => {
          fetchData(apis.goodsCate.sort, arg).then(res => {
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
    chooseCate(arg) {
      return dispatch => {
        return new Promise((resolve) => {
          fetchData(apis.goodsCate.choose, arg).then(res => {
            if (res.code === 0) {
              message.success('选择类别成功！')
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
    [SET_QUERY_PAR]: (state, action) => ({
      ...state,
      initQueryPar: action.payload,
    }),
  },

  children: [
  ]
}
