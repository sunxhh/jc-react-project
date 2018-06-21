import { createAction } from 'redux-actions'
import { message } from 'antd'

import { fetchMaternity as fetchData } from 'Utils/fetch'
import apis from '../apis.js'
import { SHOW_LIST_SPIN, SHOW_SPIN } from '../../../global/action'
import { PAGE_SIZE } from '../pagination'

// ===========================> Action Types <=========================== //

export const SET_QUERY_PAR = '/spa/mater/SET_QUERY_PAR' // 月子中心/设置查询参数
export const SERVICE_LIST = '/spa/mater/SERVICE_LIST' // 月子中心/套餐管理
export const LIST_CONDITIONS = '/spa/mater/LIST_CONDITIONS' // 月子中心/套餐和服务模块涉及字典
export const SERVICE_DETAIL = '/spa/mater/SERVICE_DETAIL'// 月子中心/服务明细
export const LOADING_BTN = '/spa/mater/LOADING_BTN'
export const EDIT_INFO = '/spa/mater/EDIT_INFO'

// ===========================> Actions <=========================== //

// 设置查询参数
export const setQueryPar = arg => {
  return createAction(SET_QUERY_PAR)(arg)
}

export const getServiceListAction = (payload) => {
  return createAction(SERVICE_LIST)(payload)
}

// 服务管理 列表页
export const getServiceList = arg => dispatch => {
  return fetchData(dispatch, SHOW_LIST_SPIN)(apis.service.list, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SERVICE_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 服务类型
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
    return fetchData(apis.service.status, values).then(res => {
      if (res.code === 0) {
        dispatch(getServiceList(arg))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 服务详情
export const detail = values => {
  return dispatch => {
    fetchData(dispatch, SHOW_SPIN)(apis.service.detail, values).then(req => {
      if (req.code === 0) {
        dispatch(createAction(SERVICE_DETAIL)(req.data))
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

// 服务添加
export const add = (arg) => {
  return dispatch => {
    dispatch(createAction(LOADING_BTN)(true))
    return fetchData(apis.service.add, arg).then(res => {
      dispatch(createAction(LOADING_BTN)(false))
      if (res.code === 0) {
        message.success('新增成功')
        history.go(-1)
        dispatch(getServiceList({ currentPage: 1 }))
        return res.code
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 服务编辑
export const edit = (arg) => {
  return dispatch => {
    dispatch(createAction(LOADING_BTN)(true))
    fetchData(apis.service.modify, arg).then(res => {
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
    serviceClass: '',
    serviceType: '',
    createTimeStart: '',
    createTimeEnd: '',
    status: '',
    keyWords: '',
  },
  page: {
    current: 1,
    pageSize: PAGE_SIZE,
    total: 0,
  },
  serviceClassList: [],
  serviceTypeList: [],
  detail: {},
  loadingBtn: false,
}

export const service = function (state = initialState, action) {
  switch (action.type) {
    case LIST_CONDITIONS:
      return {
        ...state,
        serviceClassList: action.payload.serviceClassList,
        serviceTypeList: action.payload.serviceTypeList,
      }
    case SERVICE_LIST:
      return {
        ...state,
        list: action.payload.result,
        page: {
          current: action.payload.page.currentPage,
          pageSize: action.payload.page.pageSize,
          total: action.payload.page.totalCount
        }
      }
    case SERVICE_DETAIL:
      return {
        ...state,
        detail: action.payload,
      }
    case LOADING_BTN:
      return {
        ...state,
        loadingBtn: action.payload
      }
    case SET_QUERY_PAR:
      return {
        ...state,
        initQueryPar: action.payload,
      }
    default:
      return state
  }
}
