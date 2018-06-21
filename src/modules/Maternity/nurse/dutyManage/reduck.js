import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchMaternity as fetchData } from 'Utils/fetch'
import apis from '../../apis'
import { SHOW_LIST_SPIN, SHOW_BUTTON_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //

const SET_MATER_DUTY_LIST = '/spa/mater/SET_MATER_DUTY_LIST' // 当值人员管理
const SET_MATER_DUTY_STATUS_LIST = '/spa/mater/SET_MATER_DUTY_STATUS_LIST' // 值班状态
const SET_MATER_DUTY_SEX_LIST = '/spa/mater/SET_MATER_SEX_STATUS_LIST' // 性别
const SET_MATER_DUTY_DETAIL = '/spa/mater/SET_MATER_DUTY_DETAIL' // 班次管理 班次详情设置
const SET_MATER_BATCH_NAME_LIST = '/spa/mater/SET_MATER_BATCH_NAME_LIST' // 班次管理 班次名称列表
const SET_MATER_NURSE_LIST = '/spa/mater/SET_MATER_NURSE_LIST' // 班次管理 班次名称列表
const SET_MATER_DUTY_QUERY_PAR = '/spa/mater/SET_MATER_DUTY_QUERY_PAR' // 当值人员 查询参数
const RESET_MATER_DUTY_QUERY_PAR = '/spa/mater/RESET_MATER_DUTY_QUERY_PAR' // 当值人员 查询参数

// ===========================> Actions <=========================== //

// 设置当值详情
export const setDutyDetail = arg => {
  return createAction(SET_MATER_DUTY_DETAIL)(arg)
}

// 重置查询参数
export const resetQueryPar = arg => {
  return createAction(RESET_MATER_DUTY_QUERY_PAR)(arg)
}

// 设置查询参数
export const setQueryPar = arg => {
  return createAction(SET_MATER_DUTY_QUERY_PAR)(arg)
}

// 获取当值列表
export const getDutyList = arg => dispatch => {
  return fetchData(dispatch, SHOW_LIST_SPIN)(apis.materNurse.dutyManage.dutyList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_MATER_DUTY_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 当值置位无效
export const dutyDelete = (arg, listArg) => dispatch => {
  return new Promise(function (resolve, reject) {
    fetchData(apis.materNurse.dutyManage.dutyDelete, arg).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success' })
      } else {
        reject({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 新增当值
export const addDuty = arg => dispatch => {
  return new Promise(function (resolve, reject) {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.materNurse.dutyManage.dutyAdd, arg).then(res => {
      if (res.code === 0) {
        message.success('提交成功')
        resolve({ status: 'success', result: res.data })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 编辑当值
export const editDuty = arg => dispatch => {
  return new Promise(function (resolve, reject) {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.materNurse.dutyManage.dutyModify, arg).then(res => {
      if (res.code === 0) {
        message.success('提交成功')
        resolve({ status: 'success' })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 获取当值详情
export const getDutyDetail = arg => dispatch => {
  return new Promise(function (resolve, reject) {
    fetchData(apis.materNurse.dutyManage.dutyAndBatchDetail, arg).then(res => {
      if (res.code === 0) {
        dispatch(setDutyDetail(res.data))
        resolve({ status: 'success', result: res.data })
      } else {
        reject({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 获取值班状态集合
export const getDutyStatusList = arg => dispatch => {
  const dicType = 'dutyType'
  fetchData(apis.materNurse.codeList, { dicType }).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_MATER_DUTY_STATUS_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取性别集合
export const getSexList = arg => dispatch => {
  const dicType = 'sex'
  fetchData(apis.materNurse.codeList, { dicType }).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_MATER_DUTY_SEX_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取班次名称集合
export const getBatchNameList = arg => dispatch => {
  fetchData(apis.materNurse.batchManage.batchNameList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_MATER_BATCH_NAME_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取班次名称集合
export const getNurseList = arg => dispatch => {
  fetchData(apis.materNurse.dutyManage.nurseList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_MATER_NURSE_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取待选服务
export const getRoomAndService = arg => dispatch => {
  return new Promise(function (resolve, reject) {
    fetchData(apis.materNurse.dutyManage.serviceList, arg).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success', result: res.data })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 获取已选服务
export const getSelectedService = arg => dispatch => {
  return new Promise(function (resolve, reject) {
    fetchData(apis.materNurse.dutyManage.serviceSelected, arg).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success', result: res.data })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

export const serviceArrange = arg => dispatch => {
  return new Promise(function (resolve, reject) {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.materNurse.dutyManage.serviceArrange, arg).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success' })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// ===========================> Reducer <=========================== //

const initialState = {
  dutyList: [],
  dutyStatusList: [],
  batchNameList: [],
  nurseList: [],
  sex: [],
  initQueryPar: {
    arrStartTime: undefined,
    arrEndTime: undefined,
    onDutyType: '',
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
    case SET_MATER_DUTY_LIST:
      const data = action.payload.result
      return {
        ...state,
        dutyList: data,
        page: {
          current: action.payload.page.currentPage,
          pageSize: action.payload.page.pageSize,
          total: action.payload.page.totalCount
        }
      }
    case SET_MATER_DUTY_STATUS_LIST:
      return {
        ...state,
        dutyStatusList: action.payload
      }
    case SET_MATER_DUTY_SEX_LIST:
      return {
        ...state,
        sex: action.payload
      }
    case SET_MATER_BATCH_NAME_LIST:
      return {
        ...state,
        batchNameList: action.payload
      }
    case SET_MATER_NURSE_LIST:
      return {
        ...state,
        nurseList: action.payload
      }
    case SET_MATER_DUTY_QUERY_PAR:
      return {
        ...state,
        initQueryPar: action.payload,
      }
    case RESET_MATER_DUTY_QUERY_PAR:
      return {
        ...state,
        initQueryPar: initialState.initQueryPar,
        page: initialState.page
      }
    default:
      return state
  }
}
