import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchMaternity as fetchData } from 'Utils/fetch'
import api from '../../apis.js'

export const getDetailAction = 'CHECK_GET_ROOM_CHANGE_DETAIL'
export const getRoomSelectListAction = 'CHECK_GET_ROOM_CHANGE_LIST'
export const showRoomModalAction = 'CHECK_SWITCH_SHOW_ROOM_MODAL'
export const getRoomChangeListAction = 'CHECK_GET_ROOM_CHANGE_MODAL_LIST'
export const getRoomRoomLoadingAction = 'CHECK_GET_ROOM_CHANGE_LOADING'
export const getRoomModalInfo = 'CHECK_GET_ROOM_MODAL_INFO_ONCHANGE'
export const switchBtnLoadingAction = 'CHECK_SWITCH_BTN_LOADING'

export const getDetail = arg => {
  return dispatch => {
    fetchData(dispatch)(api.roomInfo.roomChangeDetail, arg).then(req => {
      if (req.code === 0) {
        dispatch(createAction(getDetailAction)(req.data))
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const getRoomSelectList = (dict, detail) => {
  return dispatch => {
    fetchData(api.roomInfo.dictionaryList, dict).then(req => {
      if (req.code === 0) {
        dispatch(createAction(getRoomSelectListAction)(req.data))
        dispatch(getDetail(detail))
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const roomContinuedSave = values => {
  return dispatch => {
    dispatch(createAction(switchBtnLoadingAction)(true))
    fetchData(api.roomInfo.roomContinuedSave, values).then(req => {
      dispatch(createAction(switchBtnLoadingAction)(false))
      if (req.code === 0) {
        history.go('-1')
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const getRoomModal = values => {
  return dispatch => {
    fetchData(api.roomChangeRecord.getRoomNum, values).then(req => {
      if (req.code === 0) {
        dispatch(
          createAction(getRoomChangeListAction)({
            roomList: req.data.result,
            roomPagination: {
              current: req.data.page.currentPage,
              total: req.data.page.totalCount,
              pageSize: req.data.page.pageSize
            }
          })
        )
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

const initialState = {
  detail: {},
  roomStatusList: [],
  clearStatusList: [],
  careCenterList: [],
  btnLoading: false,
  motherList: [],
  motherId: '',
  motherName: '',
  babyIds: [],
  babyNames: [],
  motherLoading: false
}

export const roomChange = function(state = initialState, action) {
  switch (action.type) {
    case getDetailAction:
      return {
        ...state,
        detail: action.payload
      }
    case getRoomSelectListAction:
      return {
        ...state,
        roomStatusList: action.payload.roomStatusList,
        clearStatusList: action.payload.clearStatusList,
        careCenterList: action.payload.careCenterList
      }
    case getRoomChangeListAction:
      return {
        ...state,
        roomList: action.payload.roomList,
        roomPagination: {
          current: action.payload.roomPagination.current,
          total: action.payload.roomPagination.total,
          pageSize: action.payload.roomPagination.pageSize
        }
      }
    case getRoomRoomLoadingAction:
      return {
        ...state,
        roomLoading: action.payload
      }
    case showRoomModalAction:
      return {
        ...state,
        showRoomModal: action.payload
      }
    case getRoomModalInfo:
      return {
        ...state,
        detail: {
          ...state.detail,
          centerIdChange: action.payload.centerIdChange,
          centerNameChange: action.payload.centerNameChange,
          roomIdChange: action.payload.roomIdChange,
          roomNumChange: action.payload.roomNumChange,
          clearStatusChange: action.payload.clearStatusChange,
          roomStatusChange: action.payload.roomStatusChange
        }
      }
    case switchBtnLoadingAction:
      return {
        ...state,
        btnLoading: action.payload
      }
    default:
      return state
  }
}
