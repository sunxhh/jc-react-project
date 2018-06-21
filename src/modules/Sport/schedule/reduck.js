import { message } from 'antd'
import { createAction } from 'redux-actions'
import { fetchSport as fetchData } from 'Utils/fetch'
import { SPORT_SCHEDULE_LIST } from 'Global/urls'
import apis from '../apis'
import {
  SHOW_BUTTON_SPIN,
  SHOW_LIST_SPIN, SHOW_SPIN,
  SWITCH_BUTTON_LOADING,
} from '../../../global/action'

// ===========================> Action Types <=========================== //
export const SCHEDULE_LIST = 'spa/schedule/SCHEDULE_LIST'
export const SCHEDULE_DETAIL = 'spa/schedule/SCHEDULE_DETAIL'
export const SCHEDULE_REPEAT_DETAIL = 'spa/schedule/SCHEDULE_REPEAT_DETAIL'
export const SUBSCRIBE_LIST = 'spa/schedule/SUBSCRIBE_LIST'
export const RESERVATION_INFO = 'spa/schedule/RESERVATION_INFO'
export const MEMBER_INFO = 'spa/schedule/MEMBER_INFO'
export const SYLLABUS_LIST = 'spa/schedule/SYLLABUS_LIST'

// ===========================> Actions <=========================== //
export const getScheduleList = arg => dispatch => {
  return fetchData(dispatch, SHOW_LIST_SPIN)(apis.schedule.scheduleList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SCHEDULE_LIST)({ ...res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const getScheduleDetail = arg => dispatch => {
  return fetchData(dispatch)(apis.schedule.scheduleDetail, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SCHEDULE_DETAIL)(res.data))
      return Promise.resolve(res.data)
    } else {
      message.error(res.errmsg)
      return Promise.resolve(false)
    }
  })
}

export const getScheduleRepeatDetail = arg => dispatch => {
  return fetchData(dispatch)(apis.schedule.scheduleRepeatDetail, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SCHEDULE_REPEAT_DETAIL)(res.data))
      return Promise.resolve(res.data)
    } else {
      message.error(res.errmsg)
      return Promise.resolve(false)
    }
  })
}

export const deleteSchedule = arg => dispatch => {
  return fetchData(apis.schedule.scheduleDelete, arg).then(res => {
    if (res.code === 0) {
      return Promise.resolve(true)
    } else {
      message.error(res.errmsg)
      return Promise.resolve(false)
    }
  })
}

export const deleteRepeatSchedule = arg => dispatch => {
  return fetchData(apis.schedule.scheduleRepeatDelete, arg).then(res => {
    if (res.code === 0) {
      return Promise.resolve(true)
    } else {
      message.error(res.errmsg)
      return Promise.resolve(false)
    }
  })
}

export const addSchedule = arg => dispatch => {
  dispatch(createAction(SWITCH_BUTTON_LOADING)(true))
  return new Promise((reslove, reject) => {
    return fetchData(dispatch)(apis.schedule.scheduleAdd, arg, '正在保存...').then(res => {
      dispatch(createAction(SWITCH_BUTTON_LOADING)(false))
      if (res.code === 0) {
        message.success('新增成功')
        reslove(true)
      } else {
        message.error(res.errmsg)
        reject(false)
      }
    })
  }).catch(() => {
    dispatch(createAction(SWITCH_BUTTON_LOADING)(false))
  })
}

export const modifySchedule = arg => dispatch => {
  dispatch(createAction(SWITCH_BUTTON_LOADING)(true))
  return new Promise((reslove, reject) => {
    return fetchData(dispatch)(apis.schedule.scheduleModify, arg, '正在保存...').then(res => {
      dispatch(createAction(SWITCH_BUTTON_LOADING)(false))
      if (res.code === 0) {
        message.success('修改成功')
        reslove(true)
      } else {
        message.error(res.errmsg)
        reject(false)
      }
    })
  }).catch(() => {
    dispatch(createAction(SWITCH_BUTTON_LOADING)(false))
  })
}

export const modifyRepeatSchedule = arg => dispatch => {
  dispatch(createAction(SWITCH_BUTTON_LOADING)(true))
  return new Promise((reslove, reject) => {
    return fetchData(dispatch)(apis.schedule.scheduleRepeatModify, arg, '正在保存...').then(res => {
      dispatch(createAction(SWITCH_BUTTON_LOADING)(false))
      if (res.code === 0) {
        message.success('修改成功')
        reslove(true)
      } else {
        message.error(res.errmsg)
        reject(false)
      }
    })
  }).catch(() => {
    dispatch(createAction(SWITCH_BUTTON_LOADING)(false))
  })
}

export const deleteRoom = arg => dispatch => {
  return new Promise((reslove, reject) => {
    return fetchData(apis.schedule.scheduleDelete, arg).then(res => {
      if (res.code === 0) {
        message.success('删除成功')
        reslove(true)
      } else {
        message.error(res.errmsg)
        reject(false)
      }
    })
  })
}

// export const scheduleModeList = arg => dispatch => {
//   dispatch(showSpin({ bool: true, content: '' }))
//   return new Promise((reslove, reject) => {
//     return fetchData(apis.schedule.scheduleModeList, arg).then(res => {
//       dispatch(showSpin({ bool: false, content: '' }))
//       if (res.code === 0) {
//         dispatch(createAction(SCHEDULE_MODAL_LIST)(res.data))
//       } else {
//         message.error(res.errmsg)
//       }
//     })
//   }).catch(() => {
//     dispatch(showSpin({ bool: false, content: '' }))
//   })
// }

export const getSubscribeList = arg => dispatch => {
  return fetchData(dispatch, SHOW_LIST_SPIN)(apis.schedule.subscribeList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SUBSCRIBE_LIST)({ ...res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const cancelSub = arg => dispatch => {
  return fetchData(apis.schedule.cancelSub, arg).then(res => {
    if (res.code === 0) {
      return Promise.resolve(true)
    } else {
      message.error(res.errmsg)
      return Promise.resolve(false)
    }
  })
}

export const reservationRedirect = arg => dispatch => {
  return fetchData(dispatch, SHOW_SPIN)(apis.schedule.reservationRedirect, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(RESERVATION_INFO)({ ...res.data }))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const memberInfoByIdOrPhone = arg => dispatch => {
  return fetchData(dispatch, SHOW_SPIN)(apis.schedule.memberInfoByIdOrPhone, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(MEMBER_INFO)({ ...res.data }))
      return true
    } else {
      message.error(res.errmsg)
      return false
    }
  })
}

export const getSyllabusList = arg => dispatch => {
  return fetchData(dispatch, SHOW_SPIN)(apis.schedule.syllabusList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SYLLABUS_LIST)({ data: res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const reservation = (arg, callback) => dispatch => {
  return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.schedule.reservation, arg).then(res => {
    if (res.code === 0) {
      message.success('预约成功', 1, () => {
        location.href = SPORT_SCHEDULE_LIST
      })
    } else if (res.code === 960020) {
      callback(res.errmsg)
    } else {
      message.error(res.errmsg)
    }
  })
}

export const getReservationListByScheduleNo = arg => dispatch => {
  return fetchData(dispatch)(apis.schedule.reservationListByScheduleNo, arg).then(res => {
    if (res.code === 0) {
      return res.data
    } else {
      message.error(res.errmsg)
      return false
    }
  })
}

// ===========================> Reducers <=========================== //
const initialState = {
  scheduleList: [],
  schedulePage: {},
  filter: {},
  scheduleDetail: {},
  scheduleRepeatDetail: {},
  scheduleModal: [],
  subscribeList: [],
  subscribePage: {},
  subscribeFilter: {},
  reservationInfo: {},
  reservationMemberInfo: {},
  syllabusList: [],
  syllabusFilter: {},
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case SCHEDULE_LIST:
      return {
        ...state,
        scheduleList: action.payload.result,
        schedulePage: {
          pageNo: action.payload.page.currentPage,
          pageSize: action.payload.page.pageSize,
          records: action.payload.page.totalCount
        },
        filter: action.payload.filter
      }
    case SUBSCRIBE_LIST:
      return {
        ...state,
        subscribeList: action.payload.result,
        subscribePage: {
          pageNo: action.payload.page.currentPage,
          pageSize: action.payload.page.pageSize,
          records: action.payload.page.totalCount
        },
        subscribeFilter: action.payload.filter
      }
    case SCHEDULE_DETAIL:
      return { ...state, scheduleDetail: action.payload }
    case SCHEDULE_REPEAT_DETAIL:
      return { ...state, scheduleRepeatDetail: action.payload }
    case RESERVATION_INFO:
      return { ...state, reservationInfo: action.payload }
    case MEMBER_INFO:
      return { ...state, reservationMemberInfo: action.payload }
    case SYLLABUS_LIST:
      return { ...state, syllabusList: action.payload.data || [], syllabusFilter: action.payload.filter }
    default:
      return state
  }
}
