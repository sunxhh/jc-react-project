import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchMaternity as fetchData } from 'Utils/fetch'
import api from '../../apis'
/**
 * author yanchong  Action Types
 */
export const getDetailAction = 'AFTER_RESERVATION_CHECK_IN_GET_APPOINTMENT_DETAIL'
export const getAppointmentListAction = 'AFTER_RESERVATION_CHECK_IN_GET_APPOINTMENT_LIST'
export const switchDetailLoadingAction = 'AFTER_RESERVATION_CHECK_IN_SWITCH_DETAIL_LOADING'
export const switchBtnLoadingAction = 'AFTER_RESERVATION_CHECK_IN_SWITCH_BTN_LOADING'
export const switchShowMotherModalAction = 'AFTER_RESERVATION_CHECK_IN_SWITCH_SHOW_MOTHER_MODAL_LOADING'
export const getMotherList = 'AFTER_RESERVATION_CHECK_IN_GET_MOTHER_LIST'
export const getMotherInfo = 'AFTER_RESERVATION_CHECK_IN_GET_MOTER_INFO'
export const motherLoading = 'AFTER_RESERVATION_CHECK_IN_SWTICH_MOTHER_LOADING'
/**
 * Actions
 */

export const getAppointmentDetail = arg => {
  return dispatch => {
    fetchData(api.roomInfo.roomChangeDetail, arg).then(req => {
      if (req.code === 0) {
        dispatch(createAction(switchDetailLoadingAction)(false))
        dispatch(createAction(getDetailAction)(req.data))
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const getAppointmentList = (dict, detail) => {
  return dispatch => {
    dispatch(createAction(switchDetailLoadingAction)(true))
    fetchData(api.roomInfo.dictionaryList, dict).then(req => {
      if (req.code === 0) {
        dispatch(createAction(getAppointmentListAction)(req.data))
        dispatch(getAppointmentDetail(detail))
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const getOrderList = (dict, detail) => {
  return dispatch => {
    dispatch(createAction(switchDetailLoadingAction)(true))
    fetchData(api.roomInfo.dictionaryList, dict).then(req => {
      if (req.code === 0) {
        dispatch(createAction(getAppointmentListAction)(req.data))
        dispatch(getOrderDetail(detail))
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const getOrderDetail = arg => {
  return dispatch => {
    fetchData(api.roomInfo.roomChangeDetail, arg).then(req => {
      if (req.code === 0) {
        dispatch(createAction(switchDetailLoadingAction)(false))
        dispatch(createAction(getDetailAction)(req.data))
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const getMombabyinfoList = arg => {
  return dispatch => {
    dispatch(createAction(motherLoading)(true))
    fetchData(api.roomInfo.mombabyinfoList, arg).then(req => {
      dispatch(createAction(motherLoading)(false))
      if (req.code === 0) {
        dispatch(
          createAction(getMotherList)({
            motherList: req.data.result,
            motherPagination: {
              current: req.data.page.currentPage,
              pageSize: req.data.page.pageSize,
              total: req.data.page.totalCount
            }
          })
        )
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const addAppointment = arg => {
  return dispatch => {
    dispatch(createAction(switchBtnLoadingAction)(true))
    fetchData(api.roomInfo.addAppointment, arg).then(req => {
      dispatch(createAction(switchBtnLoadingAction)(false))
      if (req.code === 0) {
        history.go('-1')
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const addCheckIn = arg => {
  return dispatch => {
    dispatch(createAction(switchBtnLoadingAction)(true))
    fetchData(api.roomInfo.addCheckIn, arg).then(req => {
      dispatch(createAction(switchBtnLoadingAction)(false))
      if (req.code === 0) {
        history.go('-1')
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const addNowCheckIn = arg => {
  return dispatch => {
    dispatch(createAction(switchBtnLoadingAction)(true))
    fetchData(api.roomInfo.addNowCheckIn, arg).then(req => {
      dispatch(createAction(switchBtnLoadingAction)(false))
      if (req.code === 0) {
        history.go('-1')
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const addCheckCheckOut = arg => {
  return dispatch => {
    dispatch(createAction(switchBtnLoadingAction)(true))
    fetchData(api.roomInfo.addCheckCheckOut, arg).then(req => {
      dispatch(createAction(switchBtnLoadingAction)(false))
      if (req.code === 0) {
        history.go('-1')
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

/**
 * Reducer
 */
const initialState = {
  detail: {},
  roomStatusList: [],
  clearStatusList: [],
  careCenterList: [],
  btnLoading: false,
  detailLoading: false,
  motherList: [],
  motherId: '',
  motherName: '',
  babyIds: [],
  babyNames: [],
  motherLoading: false
}

export const afterReservationCheckIn = function(state = initialState, action) {
  switch (action.type) {
    case getDetailAction:
      return {
        ...state,
        detail: action.payload
      }
    case getAppointmentListAction:
      return {
        ...state,
        roomStatusList: action.payload.roomStatusList,
        clearStatusList: action.payload.clearStatusList,
        careCenterList: action.payload.careCenterList
      }
    case switchDetailLoadingAction:
      return {
        ...state,
        detailLoading: action.payload
      }
    case switchBtnLoadingAction:
      return {
        ...state,
        btnLoading: action.payload
      }
    case switchShowMotherModalAction:
      return {
        ...state,
        showMotherModal: action.payload
      }
    case getMotherList:
      return {
        ...state,
        motherList: action.payload.motherList,
        motherPagination: action.payload.motherPagination
      }
    case getMotherInfo:
      return {
        ...state,
        motherId: action.payload.motherId,
        motherName: action.payload.motherName,
        babyIds: action.payload.babyIds,
        babyNames: action.payload.babyNames
      }
    case motherLoading:
      return {
        ...state,
        motherLoading: action.payload
      }
    default:
      return state
  }
}
