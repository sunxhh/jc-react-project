import { createAction } from 'redux-actions'
import { message } from 'antd'
import apis from '../../apis'
import fetchData from 'Utils/fetch'

// ===========================> Action Types <=========================== //

export const SET_RECOMMEND_DONE_LIST = '/spa/library/SET_RECOMMEND_DONE_LIST' // 荐购列表
export const SET_RECOMMEND_DONE_FILTER = '/spa/library/SET_RECOMMEND_DONE_FILTER' // 设置查询条件
export const RESET_RECOMMEND_DONE_FILTER = '/spa/library/RESET_RECOMMEND_DONE_FILTER' // 重置查询条件

export default {
  namespace: 'done',

  state: {
    list: [],
    filter: {
      status: 2
    },
    page: {
      pageNo: 1,
      pageSize: 20,
    },
    detail: {},
  },

  actions: {
    setRecommendFilter: arg => {
      return createAction(SET_RECOMMEND_DONE_FILTER)(arg)
    },
    resetRecommendFilter: arg => {
      return createAction(RESET_RECOMMEND_DONE_FILTER)(arg)
    },
    getRecommendList: arg => dispatch => {
      return fetchData(dispatch)(apis.recommend.list, arg)
        .then(res => {
          if (res.code === 0) {
            dispatch(createAction(SET_RECOMMEND_DONE_LIST)(res.data))
            return ({ status: 0 })
          } else {
            message.error(res.errmsg)
            return ({ status: 1 })
          }
        })
    },
    setBorrowable: arg => dispatch => {
      return fetchData(dispatch)(apis.recommend.borrowable, arg)
        .then(res => {
          if (res.code === 0) {
            return ({ status: 0 })
          } else {
            message.error(res.errmsg)
            return ({ status: 1 })
          }
        })
    },
  },
  reducers: {
    [SET_RECOMMEND_DONE_LIST]: (state, action) => ({
      ...state,
      list: action.payload.data,
      page: {
        pageNo: action.payload.pageNo,
        pageSize: action.payload.pageSize,
        records: action.payload.records
      }
    }),
    [SET_RECOMMEND_DONE_FILTER]: (state, action) => ({
      ...state,
      filter: action.payload
    }),
    [RESET_RECOMMEND_DONE_FILTER]: (state, action) => ({
      ...state,
      filter: {
        status: 2
      }
    })
  },

  children: [
  ]
}
