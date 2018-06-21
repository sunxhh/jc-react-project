import { message } from 'antd'
import { fetchMaternity as fetchData } from 'Utils/fetch'
import apis from '../../apis.js'
import { SHOW_LIST_SPIN } from '../../../../global/action'
import { createAction } from 'redux-actions'
import { PAGE_SIZE } from '../../pagination'

// ===========================> Action Types <=========================== //

export const EXTEND_RECORD = '/spa/roomRecord/EXTEND_RECORD' // 续房记录
export const EXTEND_DETAIL = '/spa/roomRecord/EXTEND_DETAIL' // 续房记录
export const ALL_NURSE_CENTER = '/spa/roomRecord/ALL_NURSE_CENTER' // 所有月子中心
export const GET_MOM_INFO = '/spa/roomRecord/GET_MOM_INFO' // 所有月子中心
export const GET_BABY_INFO = '/spa/roomRecord/GET_BABY_INFO' // 所有月子中心

export const SAVE_QUERY_DATA = '/spa/roomRecord/SAVE_QUERY_DATA' // 设置查询数据

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

// 续房记录 列表页
export const getExtendRecordList = args => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.roomRecord.extendRecordList, args).then(res => {
      if (res.code === 0) {
        dispatch(createAction(EXTEND_RECORD)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 保存 查询条件
export const saveQueryData = (payload) => ({
  type: SAVE_QUERY_DATA,
  payload,
})

// 获取 续房 详情
export const getExtendDetail = args => {
  return dispatch => {
    return fetchData(dispatch)(apis.roomRecord.extendDetail, args).then(res => {
      if (res.code === 0) {
        dispatch(createAction(EXTEND_DETAIL)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 编辑续房详情
export const modifyExtendRoom = args => {
  return dispatch => {
    return fetchData(dispatch)(apis.roomRecord.modifyExtendRoom, args, '正在保存数据...').then(res => {
      if (res.code === 0) {
        message.success('保存成功', 0.5, () => {
          history.go(-1)
        })
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 确认审核
export const auditExtendRoom = (values, reqBean) => {
  return dispatch => {
    return fetchData(dispatch)(apis.roomRecord.auditExtendRoom, values, '正在保存数据...').then(res => {
      if (res.code === 0) {
        dispatch(getExtendRecordList(reqBean))
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
  getSaveData: {
    centerId: '',
    currentPage: 1,
    customerName: '',
    pageSize: PAGE_SIZE,
    roomStatus: '',
  },
  extendRecordList: { result: [], page: {}},
  getListConditions: { statusDTO: { careCenterList: [], roomStatusList: [] }},
  getExtendDetail: { recordCustomerList: [] },
  momInfo: {},
  babyInfo: {},
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case EXTEND_RECORD:
      return { ...state, extendRecordList: action.payload }
    case ALL_NURSE_CENTER:
      return { ...state, getListConditions: action.payload }
    case SAVE_QUERY_DATA:
      return { ...state, getSaveData: action.payload }
    case GET_MOM_INFO:
      return { ...state, momInfo: action.payload }
    case GET_BABY_INFO:
      return { ...state, babyInfo: action.payload }
    case EXTEND_DETAIL:
      return { ...state, getExtendDetail: action.payload }
    default:
      return state
  }
}
