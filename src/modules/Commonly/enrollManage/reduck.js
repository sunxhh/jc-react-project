import { createAction } from 'redux-actions'
import fetchData from '../../../utils/fetch'
import api from '../apis'
import { message } from 'antd'

// ===========================> Action Types <=========================== //
export const ACTIVITY_ENROLL_LIST = '/spa/activity/ACTIVITY_ENROLL_LIST'
export const ACTIVITY_LIST = '/spa/activity/ACTIVITY_LIST' // 留言名称列表
export const DEPARTMENT_LIST = '/spa/activity/DEPARTMENT_LIST'

// ===========================> Actions <=========================== //

// 获取报名列表
export const getEnrollList = arg => dispatch => {
  fetchData(dispatch)(api.enroll.enrollList, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
    } else {
      dispatch(createAction(ACTIVITY_ENROLL_LIST)(res.data))
    }
  })
}

// 报名审核
export const enrollReview = arg => dispatch => {
  return fetchData(dispatch)(api.enroll.enrollReview, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
      return false
    } else {
      return true
    }
  }).then((res) => {
    return res
  })
}

// 报名审核
export const getEnrollDetail = arg => dispatch => {
  return fetchData(dispatch)(api.enroll.enrollDetail, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
      return false
    } else {
      return res.data
    }
  }).then((res) => {
    return res
  })
}

// 活动列表
export const getActivityList = arg => dispatch => {
  return fetchData(api.enroll.activityList, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
    } else {
      dispatch(createAction(ACTIVITY_LIST)(res.data))
    }
  })
}

// 部门列表
export const getDepartmentList = arg => dispatch => {
  return fetchData(api.enroll.departmentList, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
    } else {
      dispatch(createAction(DEPARTMENT_LIST)(res.data))
    }
  })
}

export const signIntergrate = arg => dispatch => {
  return fetchData(api.enroll.giveIntergrate, arg).then(res => {
    if (parseInt(res.code) !== 0) {
      message.warn(`操作失败-${res.errmsg}`)
      return false
    } else {
      return true
    }
  }).then((res) => {
    return res
  })
}

// ===========================> Reducers <=========================== //
const initialState = {
  enrollList: [],
  enrollPage: {},
  activityList: [],
  departmentList: [],
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case ACTIVITY_ENROLL_LIST:
      return {
        ...state,
        enrollList: action.payload.result,
        enrollPage: {
          pageNo: action.payload.page.currentPage,
          pageSize: action.payload.page.pageSize,
          records: action.payload.page.totalCount
        }
      }
    case ACTIVITY_LIST:
      return { ...state, activityList: action.payload }
    case DEPARTMENT_LIST:
      return { ...state, departmentList: action.payload }
    default:
      return state
  }
}
