import { message } from 'antd'
import { createAction } from 'redux-actions'
import { fetchSport as fetchData } from 'Utils/fetch'
import apis from '../apis'
import {
  SHOW_LIST_SPIN,
  // SWITCH_LIST_LOADING,
  // SWITCH_BUTTON_LOADING,
} from '../../../global/action'

// ===========================> Action Types <=========================== //
export const ROOM_LIST = 'spa/room/ROOM_LIST'

// ===========================> Actions <=========================== //
export const getRoomList = arg => dispatch => {
  return fetchData(dispatch, SHOW_LIST_SPIN)(apis.room.roomList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(ROOM_LIST)({ ...res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const getRoomDetail = arg => dispatch => {
  return fetchData(apis.room.roomDetail, arg).then(res => {
    if (res.code === 0) {
      return Promise.resolve(res.data)
    } else {
      message.error(res.errmsg)
      return Promise.resolve(false)
    }
  })
}

export const deleteRoom = arg => dispatch => {
  return fetchData(apis.room.roomDelete, arg).then(res => {
    if (res.code === 0) {
      message.success('删除成功！')
      return Promise.resolve(true)
    } else {
      message.error(res.errmsg)
      return Promise.resolve(false)
    }
  })
}

export const addRoom = arg => dispatch => {
  return new Promise((reslove, reject) => {
    return fetchData(dispatch)(apis.room.roomAdd, arg, '正在保存...').then(res => {
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

export const modifyRoom = arg => dispatch => {
  return new Promise((reslove, reject) => {
    return fetchData(dispatch)(apis.room.roomModify, arg, '正在保存...').then(res => {
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

// ===========================> Reducers <=========================== //
const initialState = {
  roomList: [],
  roomPage: {},
  filter: {},
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case ROOM_LIST:
      return {
        ...state,
        roomList: action.payload.result,
        roomPage: {
          pageNo: action.payload.page.currentPage,
          pageSize: action.payload.page.pageSize,
          records: action.payload.page.totalCount
        },
        filter: action.payload.filter
      }
    default:
      return state
  }
}
