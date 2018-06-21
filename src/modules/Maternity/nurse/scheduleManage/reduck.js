import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchMaternity as fetchData } from 'Utils/fetch'
import apis from '../../apis'
import { SHOW_LIST_SPIN, SHOW_BUTTON_SPIN } from '../../../../global/action'

// ===========================> Action Types <=========================== //

const SET_NURSE_GRID = '/spa/mater/SET_NURSE_GRID' // 首页排班计划表
const SET_CENTER_LIST = '/spa/mater/SET_CENTER_LIST' // 首页排班计划表

// ===========================> Actions <=========================== //

export const setScheduleGrid = arg => {
  return createAction(SET_NURSE_GRID)(arg)
}

// 首页排班计划表
export const getScheduleGrid = arg => dispatch => {
  return fetchData(dispatch, SHOW_LIST_SPIN)(apis.materNurse.scheduleManage.scheduleGrid, arg).then(res => {
    if (res.code === 0) {
      dispatch(setScheduleGrid(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 排班
export const scheduleAdd = (arg) => dispatch => {
  return new Promise(function (resolve, reject) {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.materNurse.scheduleManage.scheduleAdd, arg).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success' })
      } else {
        reject({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 取消排班
export const scheduleCancel = (arg) => dispatch => {
  return new Promise(function (resolve, reject) {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.materNurse.scheduleManage.scheduleCancel, arg).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success' })
      } else {
        reject({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 月子中心列表
export const getCenterList = (arg) => dispatch => {
  return new Promise(function (resolve, reject) {
    fetchData(apis.materNurse.scheduleManage.nurseCenter, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(SET_CENTER_LIST)(res.data))
        resolve({ status: 'success', result: res.data })
      } else {
        reject({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// ===========================> Reducer <=========================== //

const initialState = {
  centerList: [],
  nurseGrid: [],
  page: {
    current: 1,
    pageSize: 20,
    total: 0,
  }
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case SET_NURSE_GRID:
      return {
        ...state,
        nurseGrid: action.payload && action.payload.result,
        page: {
          current: action.payload.page.currentPage,
          pageSize: action.payload.page.pageSize,
          total: action.payload.page.totalCount
        }
      }
    case SET_CENTER_LIST:
      return {
        ...state, centerList: action.payload
      }
    default:
      return state
  }
}
