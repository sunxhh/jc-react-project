import { reducer as sportRoom } from './room/reduck'
import { createAction } from 'redux-actions'
import { message } from 'antd'

import { reducer as sportCourse } from './course/reduck'
import { reducer as sportSchedule } from './schedule/reduck'
import apis from './apis'
import { fetchSport as fetchData } from 'Utils/fetch'

// ===========================> Action Types <=========================== //
export const COURSE_MODAL_LIST = 'spa/sportCommon/COURSE_MODAL_LIST'
export const JOB_LIST = 'spa/sportCommon/JOB_LIST'
export const CLASS_ROOM_ALL_LIST = 'spa/sportCommon/CLASS_ROOM_ALL_LIST'
export const COURSE_ALL_LIST = 'spa/sportCommon/COURSE_ALL_LIST'

// ===========================> Actions <=========================== //
export const courseModalList = arg => dispatch => {
  return new Promise((reslove, reject) => {
    return fetchData(apis.common.dictionaryList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(COURSE_MODAL_LIST)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  })
}

export const jobList = arg => dispatch => {
  return new Promise((resolve, reject) => {
    return fetchData(apis.common.joblList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(JOB_LIST)(res.data))
        resolve(res.data)
      } else {
        message.error(res.errmsg)
        resolve(false)
      }
    })
  })
}

export const classRoomList = arg => dispatch => {
  return new Promise((reslove, reject) => {
    return fetchData(apis.common.classRoomList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(CLASS_ROOM_ALL_LIST)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  })
}

export const courseList = arg => dispatch => {
  return new Promise((reslove, reject) => {
    return fetchData(apis.common.courseList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(COURSE_ALL_LIST)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  })
}

const initialState = {
  courseModal: [],
  jobList: [],
  classRoomAllList: [],
  courseAllList: [],
}

// ===========================> Reducers <=========================== //
const sportCommon = function (state = initialState, action) {
  switch (action.type) {
    case COURSE_MODAL_LIST:
      return { ...state, courseModal: action.payload }
    case JOB_LIST:
      return { ...state, jobList: action.payload }
    case CLASS_ROOM_ALL_LIST:
      return { ...state, classRoomAllList: action.payload }
    case COURSE_ALL_LIST:
      return { ...state, courseAllList: action.payload }
    default:
      return state
  }
}

export const reducers = {
  sportRoom,
  sportCourse,
  sportSchedule,
  sportCommon
}
