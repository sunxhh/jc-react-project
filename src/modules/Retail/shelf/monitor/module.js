import apis from '../../apis'
import { createAction } from 'redux-actions'
import { fetchRetail as fetchData } from 'Utils/fetch'
import { message } from 'antd'

// ===========================> Action Types <=========================== //
export const GET_SHELF_MONITOR_LIST = 'spa/Retail/shelf/monitor/GET_SHELF_MONITOR_LIST' // 货架查询
export const UPD_SELECTED_SHELFNOS = 'spa/Retail/shelf/monitor/UPD_SELECTED_SHELFNOS' // 更新选中货架号
export const EMPTY_LIST = 'spa/Retail/shelf/list/EMPTY_LIST' // 清空数据

export default {
  namespace: 'monitor',

  state: {
    title: 'this is monitor list',
    page: {
      currentPage: 1,
      pageSize: 20
    },
    shelfNos: [],
  },

  actions: {

    emptyList(arg) {
      return createAction(EMPTY_LIST)(arg)
    },

    getShelfMonitorList(arg) {
      return dispatch => {
        fetchData(dispatch)(apis.shelfMonitor.list, arg)
          .then(res => {
            if (res.code === 0) {
              dispatch(createAction(GET_SHELF_MONITOR_LIST)(res))
            } else {
              message.error(res.errmsg)
            }
          })
          .then(res => {
            return res
          })
      }
    },

    addReples: arg => dispatch => {
      return fetchData(dispatch)(apis.shelfMonitor.addReples, arg).then(res => {
        if (res.code === 0) {
          message.success('提交成功')
          return ({ status: true })
        } else {
          message.error(res.errmsg)
        }
      })
    },

    updateSelectedShelfNos: arg => {
      return createAction(UPD_SELECTED_SHELFNOS)(arg)
    },
  },

  reducers: {
    [GET_SHELF_MONITOR_LIST]: (state, action) => ({
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
      shelfNos: []
    }),
    [UPD_SELECTED_SHELFNOS]: (state, action) => ({
      ...state,
      shelfNos: action.payload
    }),
  },

  children: [
    // subModule
  ]
}
