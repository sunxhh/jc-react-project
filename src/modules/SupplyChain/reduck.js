import { createAction } from 'redux-actions'
import fetchData, { fetchSupplyChain } from 'Utils/fetch'
import { message } from 'antd'
import apis from './apis'
import { SHOW_SPIN } from 'Global/action'

import { reducer as depot } from './depot/reduck'
import { reducer as depotStock } from './depot/stockManage/reduck'
import { reducer as qualityWatch } from './depot/qualityWatch/reduck'
import { reducer as houseArea } from './depot/reservoirArea/reduck'
import { reducer as depotGoods } from './depot/depotGoods/reduck'
import { reducer as sortList } from './depot/sortListManage/reduck'
import { reducer as reportCost } from './cost/reduck'
import { reducer as supplyOrder } from './order/reduck'
import { reducer as libraryBit } from './depot/libraryBit/reduck'
import { reducer as logistics } from './logistics/reduck'
import { reducer as importTep } from './import/reduck'
// ===========================> Action Types <=========================== //
const WAREHOUSE_LIST = 'spa/SupplyChain/common/WAREHOUSE_LIST'
export const RESERVOIR_ALL_LIST = 'spa/SupplyChain/common/RESERVOIR_ALL_LIST'
export const SELECT_LIST = 'spa/SupplyChain/common/SELECT_LIST'
export const GOODS_CATG_LIST = 'spa/SupplyChain/common/GOODS_CATG_LIST'
export const STOCK_ORG_LIST = 'spa/SupplyChain/common/STOCK_ORG_LIST'
export const CODE_LIST = 'spa/SupplyChain/common/CODE_LIST'
export const LIST_BY_WAREHOUSE = 'spa/SupplyChain/common/LIST_BY_WAREHOUSE'
export const LIST_GOODS_CATG = 'spa/SupplyChain/common/LIST_GOODS_CATG'
// ===========================> Actions <=========================== //

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

export const listByWarehouse = arg => dispatch => {
  return fetchSupplyChain(apis.depot.houseArea.listByWarehouse, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(LIST_BY_WAREHOUSE)(res.data))
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

export const listGoodsCatg = arg => dispatch => {
  return fetchSupplyChain(dispatch, SHOW_SPIN)(apis.depot.depotGoods.listGoodsCatg, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(LIST_GOODS_CATG)(res.data))
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
  listGoodsCatgData: [],
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
    case LIST_GOODS_CATG:
      return {
        ...state,
        listGoodsCatgData: action.payload,
      }
    default:
      return state
  }
}

export const reducers = {
  commonSupply: reducer,
  depot,
  depotStock,
  qualityWatch,
  houseArea,
  supplyOrder,
  libraryBit,
  depotGoods,
  sortList,
  reportCost,
  logistics,
  importTep,
}
