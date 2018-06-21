import { message } from 'antd'
import { fetchMaternity as fetchData } from 'Utils/fetch'

import apis from '../apis.js'
import { SHOW_LIST_SPIN } from '../../../global/action'
import { createAction } from 'redux-actions'
import { PAGE_SIZE } from '../pagination'

// ===========================> Action Types <=========================== //

export const SET_QUERY_PAR = '/spa/mater/SET_QUERY_PAR' // 月子中心/存储查询参数
export const PACKAGE_LIST = '/spa/mater/PACKAGE_LIST' // 月子中心/套餐管理
export const LIST_CONDITIONS = '/spa/mater/LIST_CONDITIONS' // 月子中心/套餐和服务模块涉及字典
export const PACKAGE_DETAIL = '/spa/mater/PACKAGE_DETAIL' // 月子中心/套餐详情
export const LOADING_BTN = '/spa/mater/LOADING_BTN'

// ===========================> Actions <=========================== //

// 设置查询参数
export const setQueryPar = arg => {
  return createAction(SET_QUERY_PAR)(arg)
}

export const getPackageListAction = (payload) => {
  return createAction(PACKAGE_LIST)(payload)
}

// 套餐管理 列表页
export const getPackageList = arg => dispatch => {
  return fetchData(dispatch, SHOW_LIST_SPIN)(apis.packages.list, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(PACKAGE_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 套餐类型
export const listConditions = arg => dispatch => {
  return fetchData(apis.packages.listConditions, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(LIST_CONDITIONS)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 置为有效/无效
export const changeStatus = (values, arg) => {
  return dispatch => {
    return fetchData(apis.packages.status, values).then(res => {
      if (res.code === 0) {
        dispatch(getPackageList(arg))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 套餐详情
export const detail = arg => dispatch => {
  return new Promise(function (resolve, reject) {
    fetchData(apis.packages.detail, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(PACKAGE_DETAIL)(res.data))
        resolve({ status: 'success', result: res.data })
      } else {
        resolve({ status: 'error' })
        message.error(res.errmsg)
      }
    })
  })
}

// 套餐添加
export const add = (arg) => {
  return dispatch => {
    dispatch(createAction(LOADING_BTN)(true))
    return fetchData(apis.packages.add, arg).then(res => {
      dispatch(createAction(LOADING_BTN)(false))
      if (res.code === 0) {
        message.success('新增成功')
        dispatch(getPackageList({ currentPage: 1 }))
        return res.code
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 套餐编辑
export const edit = (arg) => {
  return dispatch => {
    dispatch(createAction(LOADING_BTN)(true))
    fetchData(apis.packages.modify, arg).then(res => {
      dispatch(createAction(LOADING_BTN)(false))
      if (res.code === 0) {
        history.go(-1)
      } else {
        message.error(res.errmsg)
      }
    })
  }
}
// ===========================> Reducer <=========================== //

const initialState = {
  list: [],
  initQueryPar: {
    comboType: '',
    status: '',
    createTimeStart: '',
    createTimeEnd: '',
    keyWords: '',
  },
  page: {
    current: 1,
    pageSize: PAGE_SIZE,
    total: 0,
  },
  comboTypeList: [],
  serviceClassList: [],
  serviceTypeList: [],
  detail: {},
  loadingBtn: false,
}

export const packages = function (state = initialState, action) {
  switch (action.type) {
    case LIST_CONDITIONS:
      return {
        ...state,
        comboTypeList: action.payload.comboTypeList,
        serviceClassList: action.payload.serviceClassList,
        serviceTypeList: action.payload.serviceTypeList,
      }
    case PACKAGE_LIST:
      return {
        ...state,
        list: action.payload.result,
        page: {
          current: action.payload.page.currentPage,
          pageSize: action.payload.page.pageSize,
          total: action.payload.page.totalCount
        }
      }
    case PACKAGE_DETAIL:
      return {
        ...state,
        detail: action.payload,
      }
    case LOADING_BTN:
      return {
        ...state,
        loadingBtn: action.payload
      }
    default:
      return state
  }
}
