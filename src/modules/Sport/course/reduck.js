import { message } from 'antd'
import { createAction } from 'redux-actions'
import { fetchSport as fetchData } from 'Utils/fetch'
import apis from '../apis'
import {
  SHOW_BUTTON_SPIN,
  SHOW_LIST_SPIN,
} from '../../../global/action'

// ===========================> Action Types <=========================== //
export const COURSE_LIST = 'spa/course/COURSE_LIST'
export const COURSE_DETAIL = 'spa/course/COURSE_DETAIL'

// ===========================> Actions <=========================== //
export const getCourseList = arg => dispatch => {
  return fetchData(dispatch, SHOW_LIST_SPIN)(apis.course.courseList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(COURSE_LIST)({ ...res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const getCourseDetail = arg => dispatch => {
  return fetchData(dispatch)(apis.course.courseDetail, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(COURSE_DETAIL)(res.data))
      return res.data
    } else {
      message.error(res.errmsg)
      return false
    }
  })
}

export const addCourse = arg => dispatch => {
  return new Promise((reslove, reject) => {
    return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.course.courseAdd, arg, '正在保存...').then(res => {
      if (res.code === 0) {
        message.success('新增成功')
        reslove(true)
      } else {
        message.error(res.errmsg)
        reject(false)
      }
    })
  })
}

export const modifyCourse = arg => dispatch => {
  return new Promise((reslove, reject) => {
    return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.course.courseModify, arg, '正在保存...').then(res => {
      if (res.code === 0) {
        message.success('修改成功')
        reslove(true)
      } else {
        message.error(res.errmsg)
        reject(false)
      }
    })
  })
}

export const deleteCourse = arg => dispatch => {
  return new Promise((resolve, reject) => {
    return fetchData(apis.course.courseDelete, arg).then(res => {
      if (res.code === 0) {
        message.success('删除成功')
        resolve(true)
      } else {
        message.error(res.errmsg)
        reject(false)
      }
    })
  })
}

// ===========================> Reducers <=========================== //
const initialState = {
  courseList: [],
  coursePage: {},
  filter: {},
  courseDetail: {},
  courseModal: [],
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case COURSE_LIST:
      return {
        ...state,
        courseList: action.payload.result,
        coursePage: {
          pageNo: action.payload.page.currentPage,
          pageSize: action.payload.page.pageSize,
          records: action.payload.page.totalCount
        },
        filter: action.payload.filter
      }
    case COURSE_DETAIL:
      return { ...state, courseDetail: action.payload }
    default:
      return state
  }
}
