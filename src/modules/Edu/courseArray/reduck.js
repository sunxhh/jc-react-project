import { message } from 'antd'
import { createAction } from 'redux-actions'
import fetchData from 'Utils/fetch'
import apis from '../apis'
import {
  SWITCH_LIST_LOADING,
  SHOW_BUTTON_SPIN,
} from '../../../global/action'

// ===========================> Action Types <=========================== //
export const SCHEDULE_LIST = 'spa/courseArray/SCHEDULE_LIST'
export const ORG_LIST = 'spa/courseArray/ORG_LIST'
export const COURSE_LIST = 'spa/courseArray/COURSE_LIST'
export const COURSE_ARRAY_DETAIL = 'spa/courseArray/RECORD_DETAIL'
export const TEACHER_LIST = 'spa/courseArray/TEACHER_LIST'
export const CLASS_ROOM_LIST = 'spa/courseArray/CLASS_ROOM_LIST'
export const EDIT_REPEAT_SCHEDULE = 'spa/courseArray/EDIT_REPEAT_SCHEDULE'
export const ADD_REPEAT_SCHEDULE = 'spa/courseArray/ADD_REPEAT_SCHEDULE'
export const DELETE_REPEAT_SCHEDULE = 'spa/courseArray/DELETE_REPEAT_SCHEDULE'
// ===========================> Actions <=========================== //
export const getScheduleList = arg => dispatch => {
  return fetchData(dispatch)(apis.courseArray.getScheduleList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SCHEDULE_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const getCourseList = arg => dispatch => {
  dispatch(createAction(SWITCH_LIST_LOADING)(true))
  return fetchData(apis.courseArray.getCourseList, arg).then(res => {
    dispatch(createAction(SWITCH_LIST_LOADING)(false))
    if (res.code === 0) {
      dispatch(createAction(COURSE_LIST)({ ...res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  }).catch(() => {
    dispatch(createAction(SWITCH_LIST_LOADING)(false))
  })
}

export const queryOrg = (values) => {
  return dispatch => {
    fetchData(apis.courseArray.queryOrg, values).then(res => {
      if (res.code === 0) {
        dispatch(createAction(ORG_LIST)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

export const getCourseArrayDetail = arg => dispatch => {
  return new Promise(resolve => {
    return fetchData(dispatch)(apis.courseArray.getCourseArrayDetail, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(COURSE_ARRAY_DETAIL)(res.data))
        resolve(res.data)
      } else {
        message.error(res.errmsg)
        resolve(false)
      }
    })
  })
}

export const getCourseArrayDayDetail = arg => dispatch => {
  return new Promise(resolve => {
    return fetchData(dispatch)(apis.courseArray.getCourseArrayDayDetail, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(COURSE_ARRAY_DETAIL)(res.data))
        resolve(res.data)
      } else {
        message.error(res.errmsg)
        resolve(false)
      }
    })
  })
}

export const deleteRepeatDelete = (values) => {
  return dispatch => {
    return new Promise(resolve => {
      return fetchData(apis.courseArray.deleteRepeatDelete, values).then(res => {
        if (res.code === 0) {
          resolve(true)
        } else {
          message.error(res.errmsg)
          resolve(false)
        }
      })
    })
  }
}

export const deleteSingleDelete = (values) => {
  return dispatch => {
    return new Promise(resolve => {
      return fetchData(apis.courseArray.deleteSingleDelete, values).then(res => {
        if (res.code === 0) {
          resolve(true)
        } else {
          message.error(res.errmsg)
          resolve(false)
        }
      })
    })
  }
}

export const teacherList = (values) => {
  return dispatch => {
    fetchData(apis.courseArray.queryTeacher, values).then(res => {
      if (res.code === 0) {
        dispatch(createAction(TEACHER_LIST)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

export const classroomList = (values) => {
  return dispatch => {
    fetchData(apis.courseArray.queryClassroom, values).then(req => {
      if (req.code === 0) {
        dispatch(createAction(CLASS_ROOM_LIST)(req.data))
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const getClassList = arg => {
  return dispatch => {
    return new Promise(resolve => {
      return fetchData(dispatch)(apis.class.list, arg).then(res => {
        if (res.code === 0) {
          resolve(res.data)
        } else {
          resolve(false)
        }
      })
    })
  }
}

export const addCourseArray = arg => {
  return dispatch => {
    return new Promise(resolve => {
      return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.courseArray.addCourseArray, arg).then(res => {
        if (res.code === 0) {
          history.go(-1)
          resolve(res.data)
        } else {
          message.error(res.errmsg)
          resolve(false)
        }
      })
    })
  }
}

export const editSingleCourseArray = arg => {
  return dispatch => {
    return new Promise(resolve => {
      return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.courseArray.editSingleCourseArray, arg).then(res => {
        if (res.code === 0) {
          history.go(-1)
          resolve(res.data)
        } else {
          message.error(res.errmsg)
          resolve(false)
        }
      })
    })
  }
}

export const editRepeatCourseArray = arg => {
  return dispatch => {
    return new Promise(resolve => {
      return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.courseArray.editRepeatCourseArray, arg).then(res => {
        if (res.code === 0) {
          history.go(-1)
          resolve(res.data)
        } else {
          message.error(res.errmsg)
          resolve(false)
        }
      })
    })
  }
}

// ===========================> Reducers <=========================== //
const initialState = {
  scheduleList: [],
  orgList: [],
  orgId: '',
  orgLevel: '',
  courseList: [],
  coursePage: {},
  filter: {},
  courseArrayDetail: {},
  teacherList: [],
  classroomList: [],
  scheduleDetail: []
}

const editScheduleDetail = (scheduleDetail, payload) => {
  if (scheduleDetail[payload.index]) {
    scheduleDetail[payload.index] = payload.schedule
  }
  return scheduleDetail
}

const deleteScheduleDetail = (scheduleDetail, payload) => {
  scheduleDetail.splice(payload, 1)
  return scheduleDetail
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case SCHEDULE_LIST:
      return { ...state, scheduleList: action.payload }
    case ORG_LIST:
      return { ...state, orgList: action.payload.myOrgList, orgId: action.payload.myOrgId, orgLevel: action.payload.myOrgLevel }
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
    case COURSE_ARRAY_DETAIL:
      return { ...state, courseArrayDetail: action.payload, scheduleDetail: action.payload.scheduleDetail || [{}] }
    case TEACHER_LIST:
      return { ...state, teacherList: action.payload }
    case CLASS_ROOM_LIST:
      return { ...state, classroomList: action.payload }
    case EDIT_REPEAT_SCHEDULE:
      return { ...state, scheduleDetail: editScheduleDetail(JSON.parse(JSON.stringify(state.scheduleDetail)), action.payload) }
    case ADD_REPEAT_SCHEDULE:
      return { ...state, scheduleDetail: JSON.parse(JSON.stringify(state.scheduleDetail)).concat([action.payload]) }
    case DELETE_REPEAT_SCHEDULE:
      return { ...state, scheduleDetail: deleteScheduleDetail(JSON.parse(JSON.stringify(state.scheduleDetail)), action.payload) }
    default:
      return state
  }
}
