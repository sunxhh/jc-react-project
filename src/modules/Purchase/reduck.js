import { createAction } from 'redux-actions'
import fetchData, { fetchSupplyChain } from 'Utils/fetch'
import { message } from 'antd'
import apis from './apis'
import { SHOW_SPIN } from 'Global/action'

import { reducer as goods } from './goods/reduck'
import { reducer as purchase } from './purchase/reduck'
import { reducer as provider } from './purchase/provider/reduck'
import { reducer as contract } from './purchase/contract/reduck'
import { reducer as purchaseOrder } from './purchase/order/reduck'
import { reducer as purchasePlan } from './purchase/plan/reduck'
// ===========================> Action Types <=========================== //
const WAREHOUSE_LIST = 'spa/Purchase/common/WAREHOUSE_LIST'
export const RESERVOIR_ALL_LIST = 'spa/Purchase/common/RESERVOIR_ALL_LIST'
export const SELECT_LIST = 'spa/Purchase/common/SELECT_LIST'
export const GOODS_CATG_LIST = 'spa/Purchase/common/GOODS_CATG_LIST'
export const STOCK_ORG_LIST = 'spa/Purchase/common/STOCK_ORG_LIST'
export const CODE_LIST = 'spa/Purchase/common/CODE_LIST'
export const LIST_BY_WAREHOUSE = 'spa/Purchase/common/LIST_BY_WAREHOUSE'
export const GET_GOODSCATE_LIST = 'spa/Purchase/common/LIST_GOODS_CATG'
// ===========================> Actions <=========================== //

export const getGoodsCateList = (arg) => dispatch => {
  fetchSupplyChain(apis.common.goodscatg, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
    } else {
      dispatch(createAction(GET_GOODSCATE_LIST)(res.data))
    }
  })
}

export const warehouseList = arg => dispatch => {
  return fetchSupplyChain(dispatch, SHOW_SPIN)(apis.common.warehouseList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(WAREHOUSE_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const selectList = arg => dispatch => {
  return fetchSupplyChain(dispatch, SHOW_SPIN)(apis.common.selectList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SELECT_LIST)(res.data))
      return res.data
    } else {
      message.error(res.errmsg)
      return false
    }
  })
}

export const codeList = arg => dispatch => {
  return fetchSupplyChain(apis.common.codeList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(CODE_LIST)(res.data))
      return res.data
    } else {
      message.error(res.errmsg)
      return false
    }
  })
}

export const goodscatgList = arg => dispatch => {
  return fetchSupplyChain(apis.common.goodscatgList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GOODS_CATG_LIST)(res.data))
      return res.data
    } else {
      message.error(res.errmsg)
      return false
    }
  })
}

export const reservoirAllList = arg => dispatch => {
  return fetchSupplyChain(dispatch, SHOW_SPIN)(apis.common.reservoirAllList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(RESERVOIR_ALL_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const stockOrgList = arg => dispatch => {
  return fetchData(apis.common.stockOrgList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(STOCK_ORG_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// ===========================> Reducer <=========================== //

const initialState = {
  warehouseList: [],
  reservoirAllList: [],
  goodsCatg: [],
  wareHouseLib: [],
  housearea: [],
  goodscatgListData: [],
  stockOrgList: [],
  goodsType: [],
  stockUnit: [],
  supplierType: [],
  invoiceType: [],
  inOutBillType: [],
  listByWarehouseData: [],
  goodsCateList: []
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    // ...
    case WAREHOUSE_LIST:
      return { ...state, warehouseList: action.payload }
    case RESERVOIR_ALL_LIST:
      return { ...state, reservoirAllList: action.payload }
    case GOODS_CATG_LIST:
      return { ...state, goodscatgListData: action.payload }
    case STOCK_ORG_LIST:
      return { ...state, stockOrgList: action.payload }
    case SELECT_LIST:
      return {
        ...state,
        ...action.payload,
      }
    case CODE_LIST:
      return {
        ...state,
        ...action.payload,
      }
    case LIST_BY_WAREHOUSE:
      return {
        ...state,
        listByWarehouseData: action.payload,
      }
    case GET_GOODSCATE_LIST: {
      return {
        ...state,
        goodsCateList: action.payload
      }
    }
    default:
      return state
  }
}

export const reducers = {
  commonPurc: reducer,
  goods,
  purchase,
  purchaseOrder,
  provider,
  contract,
  purchasePlan,
}
