import { createAction } from 'redux-actions'
import fetchData from 'Utils/fetch'
import api from '../apis'
import { message } from 'antd'
import { SHOW_SPIN, SHOW_BUTTON_SPIN, SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //

export const TEACHER_MANAGE_LIST = '/spa/book/TEACHER_MANAGE_LIST'
export const CLASS_ALL = '/spa/book/CLASS_ALL'
export const TEACHER_MANAGE_DETAIL = '/spa/book/TEACHER_MANAGE_DETAIL'

// ===========================> Actions <=========================== //
// 获取列表

export const getTeacherList = arg => dispatch => {
  fetchData(dispatch, SHOW_LIST_SPIN)(api.teacherManage.list, arg).then(res => {
    dispatch(createAction(TEACHER_MANAGE_LIST)(res.data))
  })
}

export const getClassAll = arg => dispatch => {
  fetchData(api.classManage.classify.classAll, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(CLASS_ALL)(res))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const changeStatus = arg => dispatch => {
  return fetchData(api.teacherManage.del, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
      return false
    } else {
      return true
    }
  })
}

export const addTeacher = (values) => {
  return dispatch => {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(api.teacherManage.add, values).then(res => {
      if (res.code === 0) {
        history.go(-1)
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

export const getTeacherDetail = arg => dispatch => {
  return fetchData(dispatch, SHOW_SPIN)(api.teacherManage.detail, arg).then(res => {
    dispatch(createAction(TEACHER_MANAGE_DETAIL)(res.data))
    return res.data
  })
}

export const editTeacher = (values) => {
  return dispatch => {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(api.teacherManage.modify, values).then(res => {
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
  teacherList: [],
  page: {},
  classAll: [],
  teacherDetail: {}
}

export const teacher = function (state = initialState, action) {
  switch (action.type) {
    case TEACHER_MANAGE_LIST:
      return { ...state, teacherList: action.payload.result, page: action.payload.page }
    case CLASS_ALL:
      return { ...state, classAll: action.payload.data }
    case TEACHER_MANAGE_DETAIL:
      return { ...state, teacherDetail: action.payload }
    default:
      return state
  }
}
