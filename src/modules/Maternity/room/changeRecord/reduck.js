import { message } from 'antd'
import { createAction } from 'redux-actions'
import { fetchMaternity as fetchData } from 'Utils/fetch'
import api from '../../apis.js'

export const getListAction = 'GET_ROOM_CHANGE_LIST'
export const switchLoadingAction = 'SWITCH_ROOM_CHANGE_LOADING'
export const selectListAction = 'ROOM_CHANGE_SELECT_LIST'
export const swtichShowAuditModal = 'ROOM_CHANGE_SWTICH_SHOW_AUDIT_MODAL'
export const okLoadingAction = 'CHANGE_RECORD_OK_ROOM_MANAGE_LOADING'
export const auditPropsAction = 'CHANGE_RECORD_AUDIT_PROPS'
export const getList = arg => {
  return dispatch => {
    dispatch(createAction(switchLoadingAction)({ loading: true }))
    fetchData(api.roomChangeRecord.list, arg).then(req => {
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
            careCenterList: req.data.careCenterList,
            auditStatusList: req.data.auditStatusList
          })
        )
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const saveAudit = (values, defaultValue, callBack) => {
  return dispatch => {
    dispatch(createAction(okLoadingAction)(true))
    fetchData(api.roomChangeRecord.saveAudit, values).then(req => {
      dispatch(createAction(okLoadingAction)(false))
      if (req.code === 0) {
        dispatch(createAction(swtichShowAuditModal)(false))
        dispatch(getList(defaultValue))
        callBack && callBack()
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
  loading: false,
  clearStatusList: [],
  roomStatusList: [],
  careCenterList: [],
  showAuditModal: false,
  okLoading: false,
  auditProps: {}
}

export const materChangeRoom = function(state = initialState, action) {
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
    case selectListAction:
      return {
        ...state,
        clearStatusList: action.payload.clearStatusList,
        roomStatusList: action.payload.roomStatusList,
        careCenterList: action.payload.careCenterList,
        auditStatusList: action.payload.auditStatusList,
      }
    case swtichShowAuditModal:
      return {
        ...state,
        showAuditModal: action.payload
      }
    case okLoadingAction:
      return {
        ...state,
        okLoading: action.payload
      }
    case auditPropsAction:
      return {
        ...state,
        auditProps: action.payload
      }
    default:
      return state
  }
}
