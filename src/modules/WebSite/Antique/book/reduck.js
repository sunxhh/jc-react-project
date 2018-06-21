import { createAction } from 'redux-actions'
import fetchData from 'Utils/fetch'
import api from '../apis'
import { message } from 'antd'
import { SHOW_LIST_SPIN, SHOW_BUTTON_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //
export const GET_BOOK_LIST = '/spa/WebSite/Antique/GET_BOOK_LIST'
export const GET_BOOK_DETAIL = '/spa/WebSite/Antique/GET_BOOK_DETAIL'
// ===========================> Actions <=========================== //
// 获取列表
export const getBookList = arg => dispatch => {
  return fetchData(dispatch, SHOW_LIST_SPIN)(api.book.getList, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
    } else {
      dispatch(createAction(GET_BOOK_LIST)(res.data))
    }
  })
}

// 获取详情
export const getBookDetail = arg => dispatch => {
  return fetchData(dispatch)(api.book.getDetail, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
    } else {
      return res.data
    }
  })
}

// 预约处理
export const bookHandle = arg => dispatch => {
  return fetchData(dispatch, SHOW_BUTTON_SPIN)(api.book.bookHandle, arg).then(res => {
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
  page: {

  },
}

export const book = function(state = initialState, action) {
  switch (action.type) {
    case GET_BOOK_LIST:
      console.log(action.payload)
      return {
        ...state,
        bookList: action.payload.result,
        page: action.payload.page
      }
    default:
      return state
  }
}
