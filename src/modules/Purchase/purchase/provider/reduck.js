import { createAction } from 'redux-actions'
import { message } from 'antd'

import { fetchSupplyChain as fetchData } from 'Utils/fetch'
import { SHOW_LIST_SPIN, SHOW_SPIN, SHOW_BUTTON_SPIN } from 'Global/action'

import apis from '../../apis'

// ===========================> Action Types <=========================== //

const GET_PROVIDER_LIST = 'spa/SupplyChain/qualityWatch/GET_AREA_LIST'
const SUPPLYCHAIN_CODELIST = 'spa/SupplyChain/SUPPLYCHAIN_CODELIST'
const GET_PROVIDER_DETAIL = 'spa/SupplyChain/qualityWatch/GET_PROVIDER_DETAIL'

// ===========================> Actions <=========================== //

export const getProviderList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.purchase.provider.supplyQueryList, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_PROVIDER_LIST)({ ...res.data, filter: arg }))
      }
    })

export const getCodeList = arg => dispatch => {
  fetchData(apis.common.codeList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SUPPLYCHAIN_CODELIST)(res.data))
    }
  })
}

export const handleProviderDelete = arg => dispatch => {
  return fetchData(apis.purchase.provider.delete, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
      return false
    } else {
      return true
    }
  })
}

export const providerAdd = arg => {
  return dispatch => {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.purchase.provider.add, arg, '正在保存数据....').then(res => {
      if (parseInt(res.code) === 0) {
        history.go(-1)
        dispatch(getProviderList({ currentPage: 1, pageSize: 10 }))
      } else {
        message.warn(`新增失败-${res.errmsg}`)
      }
    })
  }
}

export const getProviderDetail = arg => dispatch =>
  fetchData(dispatch, SHOW_SPIN)(apis.purchase.provider.detail, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_PROVIDER_DETAIL)(res.data))
      }
    })

export const providerModify = (arg) => dispatch => {
  return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.purchase.provider.edit, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
      return false
    } else {
      return true
    }
  })
}

// ===========================> Reducer <=========================== //

const initialState = {
  providerList: [],
  providerPage: {},
  codeList: {},
  provideDetail: {},
  filter: {},
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_PROVIDER_LIST: {
      return {
        ...state,
        providerList: action.payload.data,
        providerPage: {
          pageNo: action.payload.pageNo,
          pageSize: action.payload.pageSize,
          records: action.payload.records,
          pages: action.payload.pages
        },
        filter: action.payload.filter
      }
    }
    case GET_PROVIDER_DETAIL: {
      return {
        ...state,
        provideDetail: action.payload
      }
    }
    case SUPPLYCHAIN_CODELIST: {
      return {
        ...state,
        codeList: action.payload
      }
    }
    default:
      return state
  }
}
