import { createAction } from 'redux-actions'
import { message } from 'antd'
import fetchData from 'Utils/fetch'
import apis from '../apis'
import { SHOW_LIST_SPIN, SHOW_BUTTON_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //

const GET_TEXTBOOK_LIST = '/spa/eduModule/textbookManage/GET_TEXTBOOK_LIST' // 菜单树
const GET_COURSE_TYPE = '/spa/eduModule/textbookManage/GET_COURSE_TYPE' // 课程类别
const GET_BOOK_DETAIL = '/spa/eduModule/textbookManage/GET_BOOK_DETAIL' // 教材详情

// ===========================> Actions <=========================== //

const getType = {
  textbook: {
    textBookTitle: '',
    courseType: ''
  },
  currentPage: 1,
  pageSize: 20
}
// 获取列表
export const getBookList = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.textbookManage.queryList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_TEXTBOOK_LIST)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}
// 获取课程
export const getCourseType = () => {
  return dispatch => {
    return fetchData(apis.textbookManage.codeList, {
      'codeType': 'courseType'
    }).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_COURSE_TYPE)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}
// 新增教材
export const addBook = arg => {
  return dispatch => {
    return new Promise(resolve => {
      return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.textbookManage.add, arg).then(res => {
        if (res.code === 0) {
          message.success('新增成功', 1, () => {
            dispatch(getBookList(getType))
          })
          resolve(true)
        } else {
          message.error(res.errmsg)
          resolve(false)
        }
      })
    })
  }
}
// 删除教材
export const delBook = arg => {
  return dispatch => {
    return fetchData(apis.textbookManage.delete, arg).then(res => {
      if (res.code === 0) {
        message.success('删除成功', 1, () => {
          dispatch(getBookList(getType))
        })
      } else {
        message.error(res.errmsg)
      }
    })
  }
}
// 教材详情
export const bookDeatil = arg => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      return fetchData(apis.textbookManage.detail, arg).then(res => {
        if (res.code === 0) {
          dispatch(createAction(GET_BOOK_DETAIL)(res.data))
          resolve(res.data)
        } else {
          message.error(res.errmsg)
          reject()
        }
      })
    })
  }
}
// 教材编辑
export const bookEdit = arg => {
  return dispatch => {
    return new Promise(resolve => {
      return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.textbookManage.modify, arg).then(res => {
        if (res.code === 0) {
          message.success('编辑保存成功', 1, () => {
            dispatch(getBookList(getType))
          })
          resolve(true)
        } else {
          message.error(res.errmsg)
          resolve(false)
        }
      })
    })
  }
}

// ===========================> Reducer <=========================== //

const initialState = {
  bookList: [],
  page: {
    pageNo: 1,
    pageSize: 20,
    records: 0,
  },
  courseType: [],
  bookDetail: {}
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_TEXTBOOK_LIST:
      return { ...state, bookList: action.payload.result, page: {
        pageNo: action.payload.page.currentPage,
        pageSize: action.payload.page.pageSize,
        records: action.payload.page.totalCount
      }}
    case GET_COURSE_TYPE:
      return { ...state, courseType: action.payload }
    case GET_BOOK_DETAIL:
      return { ...state, bookDetail: action.payload }
    default:
      return state
  }
}
