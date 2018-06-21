import { createAction } from 'redux-actions'
import fetchData from 'Utils/fetch'
import api from '../../apis'
import { message } from 'antd'
import { SHOW_SPIN, SHOW_BUTTON_SPIN, SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //

export const CLASS_MANAGE_LIST = '/spa/book/CLASS_MANAGE_LIST'
export const CLASS_MANAGE_DETAIL = '/spa/book/CLASS_MANAGE_DETAIL'

// ===========================> Actions <=========================== //
// 获取列表

export const getClassList = arg => dispatch => {
  fetchData(dispatch, SHOW_LIST_SPIN)(api.classManage.class.list, arg).then(res => {
    dispatch(createAction(CLASS_MANAGE_LIST)(res.data))
  })
}

export const handleDelete = arg => dispatch => {
  return fetchData(api.classManage.class.del, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
      return false
    } else {
      return true
    }
  })
}

export const handleRecommand = arg => dispatch => {
  return fetchData(dispatch)(api.classManage.class.recommand, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
      return false
    } else {
      return true
    }
  })
}
export const addClass = (arg) => {
  return dispatch => {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(api.classManage.class.add, arg).then(res => {
      if (res.code === 0) {
        history.go(-1)
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

export const getClassDetail = arg => dispatch => {
  return fetchData(dispatch, SHOW_SPIN)(api.classManage.class.detail, arg).then(res => {
    dispatch(createAction(CLASS_MANAGE_DETAIL)(res.data))
    return res.data
  })
}

export const editConsult = (arg) => {
  return dispatch => {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(api.classManage.class.edit, arg).then(res => {
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
  classList: [],
  page: {},
  classDetail: {}
}

export const classDetail = function (state = initialState, action) {
  switch (action.type) {
    case CLASS_MANAGE_LIST:
      return { ...state, classList: action.payload.result, page: action.payload.page }
    case CLASS_MANAGE_DETAIL:
      return { ...state, classDetail: action.payload }
    default:
      return state
  }
}
