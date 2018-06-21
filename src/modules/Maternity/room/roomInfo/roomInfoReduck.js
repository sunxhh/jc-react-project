import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchMaternity as fetchData } from 'Utils/fetch'
import api from '../../apis'
/**
 * author yanchong  Action Types
 */
export const getListAction = 'GET_ROOM_INFO_LIST'
export const getStatusNumAction = 'GET_STATUS_NUM'
export const getCareCenterListAction = 'GET_CARE_CENTER_LIST'

export const getList = arg => {
  return dispatch => {
    fetchData(dispatch)(api.roomInfo.listInfo, arg).then(req => {
      if (req.code === 0) {
        dispatch(createAction(getListAction)({ list: req.data.result, pagination: req.data.page }))
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

export const queryStatusNum = arg => {
  return dispatch => {
    fetchData(api.roomInfo.queryStatusNum, arg).then(req => {
      if (req.code === 0) {
        dispatch(
          createAction(getStatusNumAction)({
            hjStatusNum: req.data.hjStatusNum,
            idleStatusNum: req.data.idleStatusNum,
            yyStatusNum: req.data.yyStatusNum,
            zzStatusNum: req.data.zzStatusNum,
            xzStatusNum: req.data.xzStatusNum
          })
        )
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const getQueryList = arg => {
  return dispatch => {
    fetchData(api.roomInfo.getQueryList, arg).then(req => {
      if (req.code === 0) {
        dispatch(
          createAction(getCareCenterListAction)({
            careCenterList: req.data.careCenterList,
            roomStatusList: req.data.roomStatusList,
            clearStatusList: req.data.clearStatusList
          })
        )
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
  list: [],
  pagination: {
    current: 1,
    total: 0,
    pageSize: 10
  },
  initQueryPar: {},
  hjStatusNum: '',
  idleStatusNum: '',
  yyStatusNum: '',
  zzStatusNum: '',
  xzStatusNum: '',
  careCenterList: [],
  roomStatusList: [],
  clearStatusList: []
}

export const roomInfo = function(state = initialState, action) {
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
    case getStatusNumAction:
      return {
        ...state,
        hjStatusNum: action.payload.hjStatusNum,
        idleStatusNum: action.payload.idleStatusNum,
        yyStatusNum: action.payload.yyStatusNum,
        zzStatusNum: action.payload.zzStatusNum,
        xzStatusNum: action.payload.xzStatusNum
      }
    case getCareCenterListAction:
      return {
        ...state,
        careCenterList: action.payload.careCenterList,
        roomStatusList: action.payload.roomStatusList,
        clearStatusList: action.payload.clearStatusList
      }
    default:
      return state
  }
}
