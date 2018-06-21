import { createAction } from 'redux-actions'
import fetchData from 'Utils/fetch'
import api from '../apis'
import { message } from 'antd'
import { SHOW_BUTTON_SPIN, SHOW_SPIN, SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //

export const BOOK_MANAGE_LIST = '/spa/book/BOOK_MANAGE_LIST'

// ===========================> Actions <=========================== //

// 获取列表
export const getBookList = arg => dispatch => {
  fetchData(dispatch, SHOW_LIST_SPIN)(api.bookManage.bookList, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
    } else {
      dispatch(createAction(BOOK_MANAGE_LIST)(res.data))
    }
  })
}

export const getBookDetail = arg => dispatch => {
  return fetchData(dispatch, SHOW_SPIN)(api.bookManage.bookDetail, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
      return false
    } else {
      return res.data
    }
  })
}

// 报名审核
export const bookHandle = arg => dispatch => {
  return fetchData(dispatch, SHOW_BUTTON_SPIN)(api.bookManage.bookHandle, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
      return false
    } else {
      return true
    }
  })
}

// ===========================> Reducers <=========================== //

const initialState = {
  bookList: [],
  page: {},
}

export const book = function (state = initialState, action) {
  switch (action.type) {
    case BOOK_MANAGE_LIST:
      return { ...state, bookList: action.payload.result, page: action.payload.page }
    default:
      return state
  }
}

