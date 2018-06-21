import { message } from 'antd'
import { fetchMaternity as fetchData } from 'Utils/fetch'
import apis from '../../apis.js'
import { SHOW_LIST_SPIN, SHOW_SPIN } from '../../../../global/action'
import { createAction } from 'redux-actions'
import { PAGE_SIZE } from '../../pagination'

// ===========================> Action Types <=========================== //

export const SET_QUERY_DATA = '/spa/roomRecord/SET_QUERY_DATA' // 设置查询数据

export const CHECK_RECORD = '/spa/roomRecord/CHECK_RECORD' // 入住记录
export const ALL_NURSE_CENTER = '/spa/roomRecord/ALL_NURSE_CENTER' // 所有月子中心
export const GET_ROOM_LIST = '/spa/roomRecord/GET_ROOM_LIST' // 获取所有房间列表
export const DETAIL_RECORD = '/spa/roomRecord/DETAIL_RECORD' // 转房 续房 详情页
export const GET_MOM_INFO = '/spa/roomRecord/GET_MOM_INFO' // 获取妈妈信息
export const GET_BABY_INFO = '/spa/roomRecord/GET_BABY_INFO' // 获取妈妈信息

// ===========================> Actions <=========================== //

// 获取全部月子中心
export const getListConditions = args => {
  return dispatch => {
    return fetchData(apis.roomRecord.getListConditions, args).then(res => {
      if (res.code === 0) {
        dispatch(createAction(ALL_NURSE_CENTER)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取房间列表
export const getRoomList = args => {
  return dispatch => {
    return fetchData(dispatch)(apis.roomRecord.getRoomList, args).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_ROOM_LIST)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 设置查询数据 setQueryData
export const setQueryData = (payload) => ({
  type: SET_QUERY_DATA,
  payload,
})

// 入住记录 列表页
export const getCheckRecordList = args => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.roomRecord.checkinRecordList, args).then(res => {
      if (res.code === 0) {
        dispatch(createAction(CHECK_RECORD)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 确认入住
export const confirmCheck = args => {
  return dispatch => {
    return fetchData(dispatch)(apis.roomRecord.confirmCheck, args, '').then(res => {
      if (res.code === 0) {
        history.go(-1)
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 退房
export const deleteRoom = args => {
  return dispatch => {
    return fetchData(apis.roomRecord.deleteRoom, args).then(res => {
      if (res.code === 0) {
        history.go(-1)
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取换房/续房详情
export const getDetailRecord = args => {
  return dispatch => {
    return fetchData(dispatch, SHOW_SPIN)(apis.roomRecord.getDetailRecord, args).then(res => {
      if (res.code === 0) {
        dispatch(createAction(DETAIL_RECORD)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 保存续房信息
export const saveExtendRoom = args => {
  return dispatch => {
    return fetchData(dispatch)(apis.roomRecord.saveExtendRoom, args, '正在保存数据...').then(res => {
      if (res.code === 0) {
        history.go(-1)
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 保存换房信息
export const saveChangeRoom = args => {
  return dispatch => {
    return fetchData(dispatch)(apis.roomRecord.saveChangeRoom, args, '正在保存数据...').then(res => {
      if (res.code === 0) {
        history.go(-1)
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取妈妈信息
export const getMomInfo = args => {
  return dispatch => {
    return new Promise(resolve => {
      return fetchData(dispatch)(apis.roomRecord.getMomInfo, args).then(res => {
        if (res.code === 0) {
          dispatch(createAction(GET_MOM_INFO)(res.data))
          resolve(true)
        } else {
          message.error(res.errmsg)
          resolve(true)
        }
      })
    })
  }
}

// 获取宝宝信息
export const getBabyInfo = args => {
  return dispatch => {
    return new Promise(resolve => {
      return fetchData(dispatch)(apis.roomRecord.getBabyInfo, args).then(res => {
        if (res.code === 0) {
          dispatch(createAction(GET_BABY_INFO)(res.data))
          resolve(true)
        } else {
          message.error(res.errmsg)
          resolve(true)
        }
      })
    })
  }
}

// ===========================> Reducer <=========================== //

const initialState = {
  queryData: {
    centerId: '',
    currentPage: 1,
    customerName: '',
    pageSize: PAGE_SIZE,
    roomStatus: '',
  },
  checkRecordList: { result: [], page: {}},
  getListConditions: { statusDTO: { careCenterList: [], roomStatusList: [] }},
  detailRecord: { recordCustomerList: [] },
  momInfo: {},
  babyInfo: {},
  getRoomList: { result: [] }
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHECK_RECORD:
      return { ...state, checkRecordList: action.payload }
    case GET_ROOM_LIST:
      return { ...state, getRoomList: action.payload }
    case ALL_NURSE_CENTER:
      return { ...state, getListConditions: action.payload }
    case DETAIL_RECORD:
      return { ...state, detailRecord: action.payload }
    case GET_MOM_INFO:
      return { ...state, momInfo: action.payload }
    case GET_BABY_INFO:
      return { ...state, babyInfo: action.payload }
    case SET_QUERY_DATA:
      return { ...state, queryData: action.payload }
    default:
      return state
  }
}
