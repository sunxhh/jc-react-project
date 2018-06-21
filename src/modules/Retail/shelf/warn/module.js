import apis from '../../apis'
import { createAction } from 'redux-actions'
import { fetchRetail as fetchData } from 'Utils/fetch'
import { message } from 'antd'

// ===========================> Action Types <=========================== //
export const GET_SHELF_WARN_LIST = 'spa/Retail/shelf/warn/GET_SHELF_WARN_LIST' // 货架查询
export const SET_SHELF_WARN_PARAM = 'spa/Retail/shelf/warn/SET_SHELF_WARN_PARAM' // 货架查询
export const EMPTY_LIST = 'spa/Retail/shelf/list/EMPTY_LIST' // 清空数据

export default {
  namespace: 'warn',

  state: {
    title: 'this is monitor list',
    page: {
      currentPage: 1,
      pageSize: 20
    },
    // 搜索选项
    shelfWarnQueryParam: {
      skuNo: '', //
      goodsName: '', //
      goodsCatgNo: undefined, //
      goodsType: undefined,
      status: '',
    }
  },

  actions: {

    emptyList(arg) {
      return createAction(EMPTY_LIST)(arg)
    },

    setQueryParam: param => {
      return createAction(SET_SHELF_WARN_PARAM)(param)
    },

    getShelfWarnList(arg) {
      return dispatch => {
        fetchData(dispatch)(apis.shelfWarn.list, arg)
          .then(res => {
            if (res.code === 0) {
              dispatch(createAction(GET_SHELF_WARN_LIST)(res))
            } else {
              message.error(res.errmsg)
            }
          })
          .then(res => {
            return res
          })
      }
    },

    saveWarns: arg => dispatch => {
      return fetchData(dispatch)(apis.shelfWarn.save, arg).then(res => {
        if (res.code === 0) {
          message.success('保存成功')
          return ({ status: true })
        } else {
          message.error(res.errmsg)
          return ({ status: false })
        }
      })
    },
  },

  reducers: {

    [SET_SHELF_WARN_PARAM]: (state, action) => ({
      ...state,
      shelfWarnQueryParam: action.payload
    }),

    [EMPTY_LIST]: (state, action) => ({
      ...state,
      list: [],
    }),

    [GET_SHELF_WARN_LIST]: (state, action) => ({
      ...state,
      list: action.payload.data.data,
      page: {
        pageNo: action.payload.data === null ? '' : action.payload.data.pageNo,
        pageSize: action.payload.data === null ? '' : action.payload.data.pageSize,
        records: action.payload.data === null ? '' : action.payload.data.records,
        pages: action.payload.data === null ? '' : action.payload.data.pages,
      }
    }),
  },

  children: [
    // subModule
  ]
}
