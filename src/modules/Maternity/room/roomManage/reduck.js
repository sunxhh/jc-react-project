import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchMaternity as fetchData } from 'Utils/fetch'
import api from '../../apis'

export const getListAction = 'GET_ROOM_MANAGE_LIST'
export const switchLoadingAction = 'SWITCH_ROOM_MANAGE_LOADING'
export const showAddModalAction = 'SWITCH_ROOM_MANAGE_ADD_MODAL'
export const showEditModalAction = 'SWITCH_ROOM_MANAGE_EDIT_MODAL'
export const detailAction = 'ROOM_MANAGE_DETAIL'
export const okLoadingAction = 'OK_ROOM_MANAGE_LOADING'
export const selectListAction = 'ROOM_MANAGE_SELECT_LIST'

// 用了列表查询
export const getList = arg => {
  return dispatch => {
    dispatch(createAction(switchLoadingAction)({ loading: true }))
    fetchData(api.roomManage.list, arg).then(req => {
      if (req.code === 0) {
        dispatch(createAction(getListAction)({ list: req.data.result, pagination: req.data.page }))
        dispatch(createAction(switchLoadingAction)({ loading: false }))
      } else {
        dispatch(
          createAction(getListAction)({
            list: [],
            pagination: {}
          })
        )
        message.error(req.errmsg)
      }
    })
  }
}

export const listConditions = values => {
  return dispatch => {
    fetchData(api.roomManage.listConditions, values).then(req => {
      if (req.code === 0) {
        dispatch(
          createAction(selectListAction)({
            roomStatusList: req.data.roomStatusList,
            clearStatusList: req.data.clearStatusList,
            careCenterList: req.data.careCenterList
          })
        )
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const add = (values, callBack) => {
  return dispatch => {
    dispatch(createAction(okLoadingAction)(true))
    fetchData(api.roomManage.add, values).then(req => {
      dispatch(createAction(okLoadingAction)(false))
      if (req.code === 0) {
        // dispatch(createAction(showAddModalAction)(false))
        callBack && callBack()
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const edit = (values, defaultValue, callBack) => {
  return dispatch => {
    dispatch(createAction(okLoadingAction)(true))
    fetchData(api.roomManage.modify, values).then(req => {
      dispatch(createAction(okLoadingAction)(false))
      if (req.code === 0) {
        dispatch(createAction(showEditModalAction)(false))
        dispatch(getList(defaultValue))
        callBack && callBack()
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const detail = values => {
  return dispatch => {
    fetchData(dispatch)(api.roomManage.detail, values).then(req => {
      if (req.code === 0) {
        dispatch(createAction(detailAction)(req.data))
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const offAndOnLine = (values, listArg) => {
  return dispatch => {
    fetchData(api.roomManage.offAndOnLine, values).then(req => {
      if (req.code === 0) {
        dispatch(getList(listArg))
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

const initialState = {
  list: [],
  pagination: {
    current: 1,
    total: 0,
    pageSize: 10
  },
  detail: {},
  loading: false,
  showAddModal: false,
  showEditModal: false,
  okLoading: false,
  clearStatusList: [],
  roomStatusList: [],
  careCenterList: []
}

export const materClassRoom = function(state = initialState, action) {
  switch (action.type) {
    case getListAction:
      return {
        ...state,
        list: action.payload.list,
        pagination: {
          current: action.payload.pagination.currentPage,
          total: action.payload.pagination.totalCount,
          pageSize: action.payload.pagination.pageSize
        }
      }
    case switchLoadingAction:
      return {
        ...state,
        loading: action.payload.loading
      }
    case showAddModalAction:
      return {
        ...state,
        showAddModal: action.payload
      }
    case showEditModalAction:
      return {
        ...state,
        showEditModal: action.payload
      }
    case detailAction:
      return {
        ...state,
        detail: action.payload
      }
    case okLoadingAction:
      return {
        ...state,
        okLoading: action.payload
      }
    case selectListAction:
      return {
        ...state,
        clearStatusList: action.payload.clearStatusList,
        roomStatusList: action.payload.roomStatusList,
        careCenterList: action.payload.careCenterList
      }
    default:
      return state
  }
}
