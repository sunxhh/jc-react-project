import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchMaternity as fetchData } from 'Utils/fetch'
import fileFetch from 'Utils/fetch'
import apis from '../apis'
import { SHOW_LIST_SPIN, SHOW_SPIN, SHOW_BUTTON_SPIN } from '../../../global/action'

// ===========================> Action Types <=========================== //

const SET_CONTRACT_LIST = '/spa/mater/SET_CONTRACT_LIST' // 合同管理
const SET_CONTRACT_LIST_CONDITIONS = '/spa/mater/SET_CONTRACT_LIST_CONDITIONS' // 合同管理 下拉菜单列表
const SET_CONTRACT_DETAIL = '/spa/mater/CONTRACT_DETAIL' // 合同管理 合同详情设置
const RESET_CONTRACT_DETAIL = '/spa/mater/RESET_CONTRACT_DETAIL' // 合同管理 合同详情重置
const SET_ROOM_LIST = '/spa/mater/SET_ROOM_LIST' // 合同管理 设置房间列表
const SET_CONTRACT_QUERY_PAR = '/spa/mater/SET_CONTRACT_QUERY_PAR' // 合同管理 设置查询参数
const RESET_CONTRACT_QUERY_PAR = '/spa/mater/RESET_CONTRACT_QUERY_PAR' // 合同管理 重置查询参数
const SET_QINIU_TOKEN = '/spa/mater/SET_QINIU_TOKEN' // 合同管理 获取七牛token

// ===========================> Actions <=========================== //

// 设置合同详情
export const setContractDetail = arg => {
  return createAction(SET_CONTRACT_DETAIL)(arg)
}

// 重置合同详情
export const resetContractDetail = arg => {
  return createAction(RESET_CONTRACT_DETAIL)(arg)
}

// 设置查询参数
export const setQueryPar = arg => {
  return createAction(SET_CONTRACT_QUERY_PAR)(arg)
}

// 重置查询参数
export const resetQueryPar = arg => {
  return createAction(RESET_CONTRACT_QUERY_PAR)(arg)
}

// 获取合同列表
export const getContractList = arg => dispatch => {
  return fetchData(dispatch, SHOW_LIST_SPIN)(apis.contract.list, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_CONTRACT_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 新增/修改合同
export const addContract = arg => dispatch => {
  let url = apis.contract.add
  if (arg.contractId) {
    url = apis.contract.update
  }
  return new Promise(function (resolve, reject) {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(url, arg).then(res => {
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

// 获取合同
export const getContractDetail = arg => dispatch => {
  return new Promise(function (resolve, reject) {
    fetchData(dispatch, SHOW_SPIN)(apis.contract.detail, arg).then(res => {
      if (res.code === 0) {
        dispatch(setContractDetail(res.data))
        resolve({ status: 'success', result: res.data })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 获取下拉菜单展示集合
export const getListConditions = arg => dispatch => {
  return new Promise(function (resolve, reject) {
    fetchData(apis.contract.listConditions, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(SET_CONTRACT_LIST_CONDITIONS)(res.data))
        resolve({ status: 'success' })
      } else {
        message.error(res.errmsg)
        resolve({ status: 'success' })
      }
    })
  })
}

// 获取合同编号
export const createContractNum = arg => dispatch => {
  return new Promise(function (resolve, reject) {
    fetchData(apis.contract.createContractNum, arg).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success', result: res.data })
      } else {
        message.error(res.errmsg)
        resolve({ status: 'error' })
      }
    })
  })
}

// 获取房间
export const getRoomList = arg => dispatch => {
  fetchData(apis.contract.roomList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_ROOM_LIST)(res.data.result))
    }
  })
}

// 修改合同状态
export const changeStatus = arg => dispatch => {
  return new Promise(function (resolve, reject) {
    fetchData(dispatch, SHOW_SPIN)(apis.contract.changeStatus, arg).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success', result: res.data })
      } else {
        message.error(res.errmsg)
        resolve({ status: 'error' })
      }
    })
  })
}

// 获取七牛token
export const getQiniuToken = key => {
  return dispatch => {
    fileFetch(dispatch)(apis.qiniuToken, { key }).then(res => {
      if (res.code === 0) {
        dispatch(createAction(SET_QINIU_TOKEN)(res.data.token))
      }
    })
  }
}

// ===========================> Reducer <=========================== //

const initialState = {
  contractList: [],
  listConditions: {},
  contractInfo: {},
  roomList: [],
  initQueryPar: {
    centerId: undefined,
    contractStatus: undefined,
    keyword: '',
  },
  page: {
    current: 1,
    pageSize: 20,
    total: 0,
  }
}

export const contract = function (state = initialState, action) {
  switch (action.type) {
    case SET_CONTRACT_LIST:
      return {
        ...state,
        contractList: action.payload.result,
        page: {
          current: action.payload.page.currentPage,
          pageSize: action.payload.page.pageSize,
          total: action.payload.page.totalCount
        }
      }
    case SET_CONTRACT_LIST_CONDITIONS:
      return {
        ...state,
        listConditions: action.payload
      }
    case SET_ROOM_LIST:
      return {
        ...state,
        roomList: action.payload
      }
    case SET_CONTRACT_DETAIL:
      return {
        ...state,
        contractInfo: action.payload
      }
    case RESET_CONTRACT_DETAIL:
      return {
        ...state,
        contractInfo: {}
      }
    case SET_QINIU_TOKEN:
      return { ...state, qiniuToken: action.payload }
    case SET_CONTRACT_QUERY_PAR:
      return {
        ...state,
        initQueryPar: action.payload,
      }
    case RESET_CONTRACT_QUERY_PAR:
      return {
        ...state,
        initQueryPar: initialState.initQueryPar,
        page: initialState.page
      }
    default:
      return state
  }
}
