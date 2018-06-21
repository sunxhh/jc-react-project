import { createAction } from 'redux-actions'
import fetchData from 'Utils/fetch'
import apis from '../apis'
import { message } from 'antd'
import { SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //

const GET_SYSTEM_LOG = '/spa/system/GET_SYSTEM_LOG' // 系统日志列表

// ===========================> Actions <=========================== //

export const getLogList = arg => dispatch => {
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.systemLog.logList, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
    } else {
      dispatch(createAction(GET_SYSTEM_LOG)(res.data))
    }
  })
}

// ===========================> Reducer <=========================== //

const initialState = {
  logList: [],
  page: {}
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_SYSTEM_LOG:
      return {
        ...state,
        logList: action.payload.result,
        page: {
          pageNo: action.payload.page.currentPage,
          records: action.payload.page.totalCount,
          pageSize: action.payload.page.pageSize
        }
      }
    default:
      return state
  }
}
