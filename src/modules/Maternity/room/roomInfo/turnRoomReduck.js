import { fetchMaternity as fetchData } from 'Utils/fetch'
import api from '../../apis'
/**
 * author yanchong  Action Types
 */

/**
 * Actions
 */
export const getDetailAction = payload => ({
  type: 'GET_TURN_ROOM_DETAIL',
  payload
})

export const getRoomSelectListAction = payload => ({
  type: 'GET_TURN_ROOM_LIST',
  payload
})

export const showRoomModalAction = payload => ({
  type: 'SWITCH_SHOW_TURN_ROOM_MODAL',
  payload
})

export const getRoomChangeListAction = payload => ({
  type: 'GET_TURN_ROOM_MODAL_LIST',
  payload
})

export const getRoomRoomLoadingAction = payload => ({
  type: 'GET_TURN_ROOM_LOADING',
  payload
})

export const getRoomModalInfo = payload => ({
  type: 'GET_ROOM_MODAL_INFO_TURN_ROOM',
  payload
})

export const switchBtnLoadingAction = payload => ({
  type: 'SWITCH_TURN_ROOM_BTN_LOADING',
  payload
})

export const getDetail = arg => {
  return dispatch => {
    fetchData(dispatch)(api.turnRoom.turnRoomDetail, arg).then(req => {
      if (req.code === 0) {
        dispatch(getDetailAction(req.data))
      } else {
      }
    })
  }
}

export const getRoomSelectList = (dict, detail) => {
  return dispatch => {
    fetchData(api.roomInfo.dictionaryList, dict).then(req => {
      if (req.code === 0) {
        dispatch(getRoomSelectListAction(req.data))
        dispatch(getDetail(detail))
      } else {
      }
    })
  }
}

export const turnRoomSave = values => {
  return dispatch => {
    dispatch(switchBtnLoadingAction(true))
    fetchData(api.turnRoom.save, values).then(req => {
      dispatch(switchBtnLoadingAction(false))
      if (req.code === 0) {
        history.go('-1')
      } else {
      }
    })
  }
}

export const getRoomModal = values => {
  return dispatch => {
    fetchData(api.roomChangeRecord.getRoomNum, values).then(req => {
      if (req.code === 0) {
        dispatch(
          getRoomChangeListAction({
            roomList: req.data.result,
            roomPagination: {
              current: req.data.page.currentPage,
              total: req.data.page.totalCount,
              pageSize: req.data.page.pageSize
            }
          })
        )
      } else {
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

export const turnRoom = function(state = initialState, action) {
  switch (action.type) {
    case 'GET_TURN_ROOM_DETAIL':
      return {
        ...state,
        detail: action.payload
      }
    case 'GET_TURN_ROOM_LIST':
      return {
        ...state,
        roomStatusList: action.payload.roomStatusList,
        clearStatusList: action.payload.clearStatusList,
        careCenterList: action.payload.careCenterList
      }
    case 'GET_TURN_ROOM_MODAL_LIST':
      return {
        ...state,
        roomList: action.payload.roomList,
        roomPagination: {
          current: action.payload.roomPagination.current,
          total: action.payload.roomPagination.total,
          pageSize: action.payload.roomPagination.pageSize
        }
      }
    case 'GET_TURN_ROOM_LOADING':
      return {
        ...state,
        roomLoading: action.payload
      }
    case 'SWITCH_SHOW_TURN_ROOM_MODAL':
      return {
        ...state,
        showRoomModal: action.payload
      }
    case 'GET_ROOM_MODAL_INFO_TURN_ROOM':
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
    case 'SWITCH_TURN_ROOM_BTN_LOADING':
      return {
        ...state,
        btnLoading: action.payload
      }
    default:
      return state
  }
}
