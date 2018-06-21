import { createAction } from 'redux-actions'
import { fetchSupplyChain as fetchData } from 'Utils/fetch'
import { message } from 'antd'

import { SHOW_LIST_SPIN, SHOW_BUTTON_SPIN, SHOW_SPIN } from 'Global/action'

import apis from '../../apis'

// ===========================> Action Types <=========================== //

const GET_CONTRACT_LIST = 'spa/SupplyChain/contract/GET_AREA_LIST'
const GET_CONTRACTDETAIL_LIST = 'spa/SupplyChain/contract/GET_CONTRACTDETAIL_LIST'
const SUPPLYCHAIN_CODELIST = 'spa/SupplyChain/SUPPLYCHAIN_CODELIST'
const GET_PROVIDER_DETAIL = 'spa/SupplyChain/contract/GET_PROVIDER_DETAIL'
const GET_CONTRACT_DETAIL = 'spa/SupplyChain/contract/GET_CONTRACT_DETAIL'
const SUPPLYCHAIN_PROVIDE_LIST = 'spa/SupplyChain/contract/SUPPLYCHAIN_PROVIDE_LIST'

// ===========================> Actions <=========================== //

export const getContractList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.purchase.contract.contractList, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_CONTRACT_LIST)({ ...res.data, filter: arg }))
      }
    })

export const getContractDetailList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.purchase.contract.contractDetail, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_CONTRACTDETAIL_LIST)({ ...res.data, detailFilter: arg }))
      }
    })

export const getCodeList = arg => dispatch => {
  fetchData(apis.common.codeList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SUPPLYCHAIN_CODELIST)(res.data))
    }
  })
}

export const contractAdd = arg => {
  return dispatch => {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.purchase.contract.add, arg, '正在保存数据....').then(res => {
      if (res.code === 0) {
        history.go(-1)
        dispatch(getContractList({ currentPage: 1, pageSize: 10 }))
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

export const getContractDetail = arg => dispatch => {
  return fetchData(dispatch, SHOW_SPIN)(apis.purchase.contract.detail, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_CONTRACT_DETAIL)(res.data))
      return res
    }
  })
}

export const contractModify = arg => {
  return dispatch => {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.purchase.contract.edit, arg).then(res => {
      if (res.code !== 0) {
        message.error(res.errmsg)
      } else {
        history.go(-1)
        dispatch(getContractList({ currentPage: 1, pageSize: 10 }))
      }
    })
  }
}

export const getProviderList = arg => dispatch => {
  fetchData(apis.purchase.contract.providerList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SUPPLYCHAIN_PROVIDE_LIST)(res.data))
    }
  })
}

export const handleContractDelete = arg => dispatch => {
  return fetchData(apis.purchase.contract.delete, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
      return false
    } else {
      return true
    }
  })
}

export const updateContract = arg => dispatch =>
  fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.purchase.contract.update, arg)
    .then(res => {
      if (res.code !== 0) {
        message.error(res.errmsg)
        return false
      } else {
        return true
      }
    })

// ===========================> Reducer <=========================== //

const initialState = {
  contractList: [],
  contractPage: {},
  codeList: {},
  provideDetail: {},
  filter: {},
  contractDetail: {},
  goodsList: [],
  goodsPage: {},
  initGoodsList: [],
  providerList: [],
  detailList: [],
  detailPage: {},
  detailFilter: {}
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_CONTRACT_LIST: {
      return {
        ...state,
        contractList: action.payload.data,
        contractPage: {
          pageNo: action.payload.pageNo,
          pageSize: action.payload.pageSize,
          records: action.payload.records,
          pages: action.payload.pages
        },
        filter: action.payload.filter
      }
    }
    case GET_CONTRACTDETAIL_LIST: {
      return {
        ...state,
        detailList: action.payload.data.map((item, index) => {
          return { ...item, id: action.payload.pageSize *
          action.payload.pageNo +
          (index + 1) -
          action.payload.pageSize }
        }),
        detailPage: {
          pageNo: action.payload.pageNo,
          pageSize: action.payload.pageSize,
          records: action.payload.records,
          pages: action.payload.pages
        },
        detailFilter: action.payload.detailFilter
      }
    }
    case GET_PROVIDER_DETAIL: {
      return {
        ...state,
        provideDetail: action.payload
      }
    }
    case GET_CONTRACT_DETAIL: {
      return {
        ...state,
        contractDetail: action.payload,
        goodsList: action.payload.pagerVo.data,
        goodsPage: {
          pageNo: action.payload.pagerVo.pageNo,
          pageSize: action.payload.pagerVo.pageSize,
          records: action.payload.pagerVo.records,
          pages: action.payload.pagerVo.pages
        },
        initGoodsList: action.payload.pagerVo.data.map(item => {
          return {
            skuNo: item.skuNo,
            supplierRate: item.supplierRate,
            purchasePrice: item.purchasePrice
          }
        })
      }
    }
    case SUPPLYCHAIN_CODELIST: {
      return {
        ...state,
        codeList: action.payload
      }
    }
    case SUPPLYCHAIN_PROVIDE_LIST: {
      return {
        ...state,
        providerList: action.payload
      }
    }
    default:
      return state
  }
}

