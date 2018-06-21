import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchMaternity as fetchData } from 'Utils/fetch'
import apis from '../../apis'
import { SHOW_LIST_SPIN } from '../../../../global/action'

// ===========================> Action Types <=========================== //

const SET_MATER_BATCH_LIST = '/spa/mater/SET_MATER_BATCH_LIST' // 班次管理
const SET_MATER_BATCH_TYPE_LIST = '/spa/mater/SET_MATER_BATCH_TYPE_LIST' // 班次类型
const SET_MATER_BATCH_STATUS_LIST = '/spa/mater/SET_MATER_BATCH_STATUS_LIST' // 班次状态类型
const SET_MATER_BATCH_DETAIL = '/spa/mater/MATER_BATCH_DETAIL' // 班次管理 班次详情设置
const SET_MATER_BATCH_QUERY_PAR = '/spa/mater/SET_MATER_BATCH_QUERY_PAR' // 班次管理 查询参数
const RESET_MATER_BATCH_QUERY_PAR = '/spa/mater/RESET_MATER_BATCH_QUERY_PAR' // 班次管理 查询参数

// ===========================> Actions <=========================== //
// 设置班次详情
export const setBatchDetail = arg => {
  return createAction(SET_MATER_BATCH_DETAIL)(arg)
}

// 设置查询参数
export const setQueryPar = arg => {
  return createAction(SET_MATER_BATCH_QUERY_PAR)(arg)
}

// 重置查询参数
export const resetQueryPar = arg => {
  return createAction(RESET_MATER_BATCH_QUERY_PAR)(arg)
}

// 获取班次列表
export const getBatchList = arg => dispatch => {
  return fetchData(dispatch, SHOW_LIST_SPIN)(apis.materNurse.batchManage.batchList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_MATER_BATCH_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 班次置位无效
export const batchInvalid = (arg, listArg) => dispatch => {
  return new Promise(function (resolve, reject) {
    fetchData(apis.materNurse.batchManage.batchInvalid, arg).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success' })
      } else {
        reject({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 新增班次
export const addBatch = arg => dispatch => {
  return new Promise(function (resolve, reject) {
    fetchData(apis.materNurse.batchManage.batchAdd, arg).then(res => {
      if (res.code === 0) {
        message.success('提交成功')
        resolve({ status: 'success', result: res.data })
      } else {
        reject({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 编辑班次
export const editBatch = arg => dispatch => {
  return new Promise(function (resolve, reject) {
    fetchData(apis.materNurse.batchManage.batchModify, arg).then(res => {
      if (res.code === 0) {
        message.success('提交成功')
        resolve({ status: 'success' })
      } else {
        reject({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 获取班次详情
export const getBatchDetail = arg => dispatch => {
  return new Promise(function (resolve, reject) {
    fetchData(apis.materNurse.dutyManage.dutyAndBatchDetail, arg).then(res => {
      if (res.code === 0) {
        dispatch(setBatchDetail(res.data))
        resolve({ status: 'success', result: res.data })
      } else {
        reject({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 获取班次类型集合
export const getBatchTypeList = arg => dispatch => {
  const dicType = 'planType'
  fetchData(apis.materNurse.codeList, { dicType }).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_MATER_BATCH_TYPE_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取班次状态集合
export const getBatchStatusList = arg => dispatch => {
  const dicType = 'planStatus'
  fetchData(apis.materNurse.codeList, { dicType }).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_MATER_BATCH_STATUS_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// ===========================> Reducer <=========================== //

const initialState = {
  batchList: [],
  batchTypeList: [],
  batchStatusList: [],
  initQueryPar: {
    startTime: undefined,
    endTime: undefined,
    isValid: '',
    planType: '',
  },
  page: {
    current: 1,
    pageSize: 20,
    total: 0,
  }
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case SET_MATER_BATCH_LIST:
      return {
        ...state,
        batchList: action.payload.result,
        page: {
          current: action.payload.page.currentPage,
          pageSize: action.payload.page.pageSize,
          total: action.payload.page.totalCount
        }
      }
    case SET_MATER_BATCH_TYPE_LIST:
      return {
        ...state,
        batchTypeList: action.payload
      }
    case SET_MATER_BATCH_STATUS_LIST:
      return {
        ...state,
        batchStatusList: action.payload
      }
    case SET_MATER_BATCH_QUERY_PAR:
      return {
        ...state,
        initQueryPar: action.payload,
      }
    case RESET_MATER_BATCH_QUERY_PAR:
      return {
        ...state,
        initQueryPar: initialState.initQueryPar,
        page: initialState.page
      }
    default:
      return state
  }
}
