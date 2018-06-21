import { createAction } from 'redux-actions'
import { fetchMaternity as fetchData } from 'Utils/fetch'
import api from '../../apis.js'
import { message } from 'antd'

export const getDetailAction = 'GET_ROOM_UPD_CHANGE_DETAIL'
export const getRoomSelectListAction = 'GET_ROOM_UPD_CHANGE_LIST'
export const showRoomModalAction = 'SWITCH_SHOW_ROOM_MODAL'
export const getRoomChangeListAction = 'GET_ROOM_CHANGE_MODAL_LIST'
export const getRoomRoomLoadingAction = 'GET_ROOM_CHANGE_LOADING'
export const getRoomModalInfo = 'GET_ROOM_MODAL_INFO_ONCHANGE'
export const switchBtnLoadingAction = 'SWITCH_BTN_LOADING'

export const getDetail = arg => {
  return dispatch => {
    fetchData(dispatch)(api.roomChangeRecord.detail, arg).then(req => {
      if (req.code === 0) {
        dispatch(createAction(getDetailAction)(req.data))
      } else {
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

export const roomUpdChangeSave = values => {
  return dispatch => {
    dispatch(createAction(switchBtnLoadingAction)(true))
    fetchData(api.roomChangeRecord.save, values).then(req => {
      dispatch(createAction(switchBtnLoadingAction)(false))
      if (req.code === 0) {
        message.success('保存成功', 1, () => {
          history.go('-1')
        })
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

export const updRoomChange = function(state = initialState, action) {
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
