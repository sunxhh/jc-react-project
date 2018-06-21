import { createAction } from 'redux-actions'
import fetchData from '../../../utils/fetch'
import api from '../apis'
import { message } from 'antd'
import { SHOW_LIST_SPIN, SHOW_BUTTON_SPIN } from '../../../global/action'

// ===========================> Action Types <=========================== //

export const ACTIVITY_MANAGE_LIST = '/spa/activity/ACTIVITY_MANAGE_LIST'
export const ACTIVITY_MANAGE_DETAIL = '/spa/activity/ACTIVITY_MANAGE_DETAIL'

// ===========================> Actions <=========================== //
// 获取列表

export const getActivityList = arg => dispatch => {
  fetchData(dispatch, SHOW_LIST_SPIN)(api.activity.list, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(ACTIVITY_MANAGE_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 状态改变
export const changeStatus = arg => dispatch => {
  return fetchData(api.activity.changeStatus, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
      return false
    } else {
      return true
    }
  })
}

export const addActivity = (values) => {
  return dispatch => {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(api.activity.add, values).then(res => {
      if (res.code === 0) {
        history.go(-1)
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

export const getActivityDetail = arg => dispatch => {
  return fetchData(dispatch)(api.activity.detail, arg).then(res => {
    dispatch(createAction(ACTIVITY_MANAGE_DETAIL)(res.data))
    return res.data
  })
}

export const editActivity = (values) => {
  return dispatch => {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(api.activity.edit, values).then(res => {
      if (res.code === 0) {
        history.go(-1)
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// ===========================> Reducers <=========================== //

const initialState = {
  activityList: [],
  page: {},
  activityDetail: {}
}

export const activity = function (state = initialState, action) {
  switch (action.type) {
    case ACTIVITY_MANAGE_LIST:
      return {
        ...state,
        activityList: action.payload.result,
        page: {
          pageNo: action.payload.page.currentPage,
          pageSize: action.payload.page.pageSize,
          records: action.payload.page.totalCount
        }
      }
    case ACTIVITY_MANAGE_DETAIL:
      return { ...state, activityDetail: action.payload }
    default:
      return state
  }
}

