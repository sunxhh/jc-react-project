import apis from '../../apis'
import { createAction } from 'redux-actions'
import { fetchRetail as fetchData } from 'Utils/fetch'
import { message } from 'antd'

// ===========================> Action Types <=========================== //
export const GET_SHELF_REPLE_LIST = 'spa/Retail/shelf/replenishment/GET_SHELF_REPLE_LIST' // 货架查询
export const GET_SHELF_REPLE_ADD_LIST = 'spa/Retail/shelf/replenishment/GET_SHELF_REPLE_ADD_LIST' // 补货录入列表
export const GET_SHELF_REPLE_DETAIL_LIST = 'spa/Retail/shelf/replenishment/GET_SHELF_REPLE_DETAIL_LIST' // 补货录入列表
export const SET_SHELF_REPLE_PARAM = 'spa/Retail/shelf/replenishment/SET_SHELF_REPLE_PARAM' // 查询参数设置
export const GET_SHELF_LIST = 'spa/Retail/shelf/replenishment/GET_SHELF_LIST' // 查询库存单位
export const GET_SHELF_REPLE_DETAIL_PRINT_LIST = 'spa/Retail/shelf/replenishment/GET_SHELF_REPLE_DETAIL_PRINT_LIST' // 获取打印数据
export const EMPTY_LIST = 'spa/Retail/shelf/list/EMPTY_LIST' // 清空数据

export default {
  namespace: 'reple',

  state: {
    title: 'this is reple list',
    page: {
      pageNo: 1,
      pageSize: 20
    },
    repleInfo: {
      replenishmentNo: '',
    },
    // 搜索选项
    initQueryPar: {
      replenishmentNo: '',
      createTime: '',
      endTime: '',
      repleStatus: '',
      shelfNo: ''
    },
    shelfList: []
  },

  actions: {
    setQueryPar(arg) {
      return createAction(SET_SHELF_REPLE_PARAM)(arg)
    },

    emptyList(arg) {
      return createAction(EMPTY_LIST)(arg)
    },

    getShelfRepleList(arg) {
      return dispatch => {
        fetchData(dispatch)(apis.replenishment.list, arg)
          .then(res => {
            if (res.code === 0) {
              dispatch(createAction(GET_SHELF_REPLE_LIST)(res))
            } else {
              message.error(res.errmsg)
            }
          })
          .then(res => {
            return res
          })
      }
    },

    getShelfRepleAddList(arg) {
      return dispatch => {
        return fetchData(dispatch)(apis.replenishment.add, arg).then(res => {
          if (res.code === 0) {
            dispatch(createAction(GET_SHELF_REPLE_ADD_LIST)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },

    getShelfRepleDetailList(arg) {
      return dispatch => {
        return fetchData(dispatch)(apis.replenishment.detail, arg).then(res => {
          if (res.code === 0) {
            dispatch(createAction(GET_SHELF_REPLE_DETAIL_LIST)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },

    // 打印请求接口
    getShelfRepleDetailPrintList(arg) {
      return dispatch => {
        return fetchData(dispatch)(apis.replenishment.print, arg).then(res => {
          if (res.code === 0) {
            dispatch(createAction(GET_SHELF_REPLE_DETAIL_PRINT_LIST)(res.data))
            return true
          } else {
            message.error(res.errmsg)
            return false
          }
        })
      }
    },

    deleteReple: arg => dispatch => {
      return fetchData(dispatch)(apis.replenishment.delete, arg).then(res => {
        if (res.code === 0) {
          message.success('删除成功')
          return ({ status: true })
        } else {
          message.error(res.errmsg)
          return ({ status: false })
        }
      })
    },

    saveReple: arg => dispatch => {
      return fetchData(dispatch)(apis.replenishment.save, arg).then(res => {
        if (res.code === 0) {
          message.success('提交成功')
          return ({ status: true })
        } else {
          message.error(res.errmsg)
          return ({ status: false })
        }
      })
    },

    getShelfList: arg => dispatch => {
      return fetchData(dispatch)(apis.shelfList.listAll).then(res => {
        if (res.code === 0) {
          dispatch(createAction(GET_SHELF_LIST, arg)(res.data))
        } else {
          message.error(res.errmsg)
        }
      })
    }
  },

  reducers: {
    [GET_SHELF_REPLE_LIST]: (state, action) => ({
      ...state,
      list: action.payload.data.data,
      page: {
        pageNo: action.payload.data === null ? '' : action.payload.data.pageNo,
        pageSize: action.payload.data === null ? '' : action.payload.data.pageSize,
        records: action.payload.data === null ? '' : action.payload.data.records,
        pages: action.payload.data === null ? '' : action.payload.data.pages,
      }
    }),
    [EMPTY_LIST]: (state, action) => ({
      ...state,
      list: [],
      page: {
        pageSize: 20,
        pageNo: 1,
      },
    }),
    [GET_SHELF_REPLE_ADD_LIST]: (state, action) => ({
      ...state,
      list: action.payload.data,
      page: {
        pageNo: action.payload === null ? '' : action.payload.pageNo,
        pageSize: action.payload === null ? '' : action.payload.pageSize,
        records: action.payload === null ? '' : action.payload.records,
        pages: action.payload === null ? '' : action.payload.pages,
      }
    }),
    [GET_SHELF_REPLE_DETAIL_LIST]: (state, action) => ({
      ...state,
      list: action.payload.data,
      repleInfo: action.payload,
      page: {
        pageNo: action.payload === null ? '' : action.payload.pageNo,
        pageSize: action.payload === null ? '' : action.payload.pageSize,
        records: action.payload === null ? '' : action.payload.records,
        pages: action.payload === null ? '' : action.payload.pages,
      }
    }),
    [GET_SHELF_REPLE_DETAIL_PRINT_LIST]: (state, action) => ({
      ...state,
      shelfInfo: action.payload.data,
      printDetailList: action.payload.shelfReplenishmentDetailList,
    }),
    [SET_SHELF_REPLE_PARAM]: (state, action) => ({
      ...state,
      initQueryPar: action.payload,
    }),
    [GET_SHELF_LIST]: (state, action) => ({
      ...state,
      shelfList: action.payload
    })
  },

  children: [
    // subModule
  ]
}
