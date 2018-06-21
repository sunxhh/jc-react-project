import { createAction } from 'redux-actions'
import { fetchSupplyChain as fetchData } from 'Utils/fetch'
import apis from '../../apis'
import { SHOW_SPIN, SHOW_LIST_SPIN, SHOW_BUTTON_SPIN } from 'Global/action'
import {
  SUPPLY_STOCK_OPERATE,
  SUPPLY_STOCK_INVENTORY,
  SUPPLY_STOCK_DIFFERENCE
} from 'Global/urls'
import { ReduckHelper } from 'Utils/helper'
import { message } from 'antd'
import { isEmpty } from '../../../../utils/lang'
import storage from '../../../../utils/storage'

const orgCode = storage.get('userInfo') && storage.get('userInfo').orgCode

// ===========================> Action Types <=========================== //

const GET_CHECK_LIST = 'spa/SupplyChain/depotStock/GET_CHECK_LIST' // 库存查询
const GET_OPERATE_LIST = 'spa/SupplyChain/depotStock/GET_OPERATE_LIST' // 库存操作
const GET_INBOUND_INFO = 'spa/SupplyChain/depotStock/GET_INBOUND_INFO' // 库存操作 / 入库单详情
const GET_OUTBOUND_INFO = 'spa/SupplyChain/depotStock/GET_OUTBOUND_INFO' // 库存操作 / 出库单详情
const GET_RECORD_LIST = 'spa/SupplyChain/depotStock/GET_RECORD_LIST' // 操作记录
const GET_GOODS_LIST = 'spa/SupplyChain/depotStock/GET_GOODS_LIST' // 仓库货物查询
const GET_INVENTORY_LIST = 'spa/SupplyChain/depotStock/GET_INVENTORY_LIST' // 库存盘点
const GET_INVENTORY_INFO = 'spa/SupplyChain/depotStock/GET_INVENTORY_INFO' // 库存盘点 / 盘点详情
const GET_DIFFERENCE_LIST = 'spa/SupplyChain/depotStock/GET_DIFFERENCE_LIST' // 盘点少货差异
const GET_DIFFERENCE_INFO = 'spa/SupplyChain/depotStock/GET_DIFFERENCE_INFO' // 盘点少货差异 / 差异详情
const GET_THRESHOLD_LIST = 'spa/SupplyChain/depotStock/GET_THRESHOLD_LIST' // 库存预警
const GET_THRESHOLD_DEFAULT = 'spa/SupplyChain/depotStock/GET_THRESHOLD_DEFAULT' // 库存预警 / 默认设置
const GET_PRINT_IP = 'spa/SupplyChain/depotGoods/GET_PRINT_IP'
const GET_INVENTORY_PRINT_INFO = 'spa/SupplyChain/depotStock/GET_INVENTORY_PRINT_INFO' // 库存盘点 / 盘点答应详情

// ===========================> Actions <=========================== //

export const getCheckList = arg => ReduckHelper.genListAction(arg, fetchData, apis.depot.stock.check, GET_CHECK_LIST)

export const getRecordList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.depot.stock.record, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_RECORD_LIST)({ ...res.data, filter: arg }))
      } else {
        message.error(res.errmsg)
      }
    })

export const getOperateList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.depot.stock.operate, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_OPERATE_LIST)({ ...res.data, filter: arg }))
      } else {
        message.error(res.errmsg)
      }
    })

export const confirmBound = (arg, filter) => dispatch =>
  fetchData(apis.depot.stock.operateConfirm, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(getOperateList(filter))
      } else {
        message.error(res.errmsg)
      }
    })

export const deleteBound = (arg, filter) => dispatch =>
  fetchData(apis.depot.stock.operateDelete, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(getOperateList(filter))
      } else {
        message.error(res.errmsg)
      }
    })

export const createInbound = arg => dispatch =>
  fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.depot.stock.createInbound, arg)
    .then(res => {
      if (res.code === 0) {
        location.href = SUPPLY_STOCK_OPERATE
      } else {
        message.error(res.errmsg)
      }
    })

export const editInbound = arg => dispatch =>
  fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.depot.stock.editInbound, arg)
    .then(res => {
      if (res.code === 0) {
        location.href = SUPPLY_STOCK_OPERATE
      } else {
        message.error(res.errmsg)
      }
    })

export const getInboundInfo = arg => dispatch =>
  fetchData(dispatch, SHOW_SPIN)(apis.depot.stock.inboundInfo, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_INBOUND_INFO)({ ...res.data }))
      } else {
        message.error(res.errmsg)
      }
    })

export const returnInbound = arg => dispatch =>
  fetchData(apis.depot.stock.returnBound, arg)
    .then(res => {
      if (res.code === 0) {
        location.href = SUPPLY_STOCK_OPERATE
      } else {
        message.error(res.errmsg)
      }
    })

export const createOutbound = arg => dispatch =>
  fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.depot.stock.createOutbound, arg)
    .then(res => {
      if (res.code === 0) {
        location.href = SUPPLY_STOCK_OPERATE
      } else {
        message.error(res.errmsg)
      }
    })

export const editOutbound = arg => dispatch =>
  fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.depot.stock.editOutbound, arg)
    .then(res => {
      if (res.code === 0) {
        location.href = SUPPLY_STOCK_OPERATE
      } else {
        message.error(res.errmsg)
      }
    })

export const getOutboundInfo = arg => dispatch =>
  fetchData(dispatch, SHOW_SPIN)(apis.depot.stock.outbountInfo, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_OUTBOUND_INFO)({ ...res.data }))
      } else {
        message.error(res.errmsg)
      }
    })

export const getStockGoods = arg => dispatch =>
  fetchData(apis.depot.stock.goods, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_GOODS_LIST)({ ...res.data, filter: arg }))
      } else {
        message.error(res.errmsg)
      }
    })

export const getInventoryList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.depot.stock.inventory, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_INVENTORY_LIST)({ ...res.data, filter: arg }))
      } else {
        message.error(res.errmsg)
      }
    })

export const getInventoryInfo = arg => dispatch =>
  fetchData(dispatch, SHOW_SPIN)(apis.depot.stock.inventoryDetail, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_INVENTORY_INFO)({ ...res.data }))
      } else {
        message.error(res.errmsg)
      }
    })

export const getInventoryPrintInfo = arg => dispatch =>
  fetchData(dispatch)(apis.depot.stock.inventoryList, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_INVENTORY_PRINT_INFO)({ ...res.data }))
      } else {
        message.error(res.errmsg)
      }
    })

export const doInventory = (arg, filter) => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.depot.stock.inventoryDone, arg)
    .then(res => {
      if (res.code === 0) {
        if (arg.operateStatus === 2) {
          message.success('保存成功', () => {
            dispatch(getInventoryList({ ...filter, currentPage: 1 }))
          })
          location.reload
        } else if (arg.operateStatus === 3) {
          location.href = SUPPLY_STOCK_INVENTORY
        }
      } else {
        message.error(res.errmsg)
      }
    })

export const createInventory = (arg, filter) => dispatch =>
  fetchData(apis.depot.stock.createInventory, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(getInventoryList(filter))
        return true
      } else {
        message.error(res.errmsg)
        return false
      }
    })

export const deleteInventory = (arg, filter) => dispatch =>
  fetchData(apis.depot.stock.inventoryDelete, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(getInventoryList(filter))
      } else {
        message.error(res.errmsg)
      }
    })

export const getDifferenceList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.depot.stock.difference, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_DIFFERENCE_LIST)({ ...res.data, filter: arg }))
      } else {
        message.error(res.errmsg)
      }
    })

export const doDifference = (arg, filter) => dispatch =>
  fetchData(apis.depot.stock.differenceDone, arg)
    .then(res => {
      if (res.code === 0) {
        if (arg.status === 1) {
          message.success('保存成功', () => {
            dispatch(getDifferenceList({ ...filter, currentPage: 1 }))
          })
          location.reload
        } else if (arg.status === 2) {
          location.href = SUPPLY_STOCK_DIFFERENCE
        }
      } else {
        message.error(res.errmsg)
      }
    })

export const getDifferenceInfo = arg => dispatch =>
  fetchData(dispatch, SHOW_SPIN)(apis.depot.stock.differenceInfo, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_DIFFERENCE_INFO)({ ...res.data }))
      } else {
        message.error(res.errmsg)
      }
    })

export const getThresholdList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.depot.stock.threshold, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_THRESHOLD_LIST)({ ...res.data, filter: arg }))
      } else {
        message.error(res.errmsg)
      }
    })

export const updateThreshold = arg => dispatch =>
  fetchData(apis.depot.stock.thresholdUpdate, arg)
    .then(res => {
      if (res.code !== 0) {
        message.error(res.errmsg)
        return false
      } else {
        return true
      }
    })

export const setDefaultThreshold = arg => dispatch =>
  fetchData(apis.depot.stock.thresholdUpdateDefault, arg)
    .then(res => {
      if (res.code !== 0) {
        message.error(res.errmsg)
        return false
      } else {
        return true
      }
    })

export const getThresholdDefault = arg => dispatch =>
  fetchData(apis.depot.stock.thresholdDefault, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_THRESHOLD_DEFAULT)({ ...res.data }))
      } else {
        message.error(res.errmsg)
      }
    })

export const updateThresholdDefault = arg => dispatch =>
  fetchData(dispatch)(apis.depot.stock.thresholdDefaultSet, arg)
    .then(res => {
      if (res.code !== 0) {
        message.error(res.errmsg)
        return false
      }
      return true
    })

export const getPrintIp = arg => dispatch =>
  fetchData(dispatch)(apis.common.printIp, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_PRINT_IP)(res.data))
      }
    })

export const handlePrint = (api, arg) => dispatch => {
  return fetchData(dispatch)(api, arg, '', '打印服务连接异常').then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
      return false
    } else {
      return true
    }
  })
}

export const handleInboundPrint = (arg) => dispatch => {
  return fetchData(apis.depot.stock.inboundPrintInfo, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
      return false
    } else {
      return res.data
    }
  })
}

// ===========================> Reducer <=========================== //

const initialState = {
  ...ReduckHelper.genListState('check', { // check page
    skuNo: '',
    goodsName: '',
    status: '',
    deptNo: '',
  }),
  ...ReduckHelper.genListState('operate', { // operate page
    startTime: '',
    endTime: '',
  }),
  inbound: {},
  outbound: {},
  ...ReduckHelper.genListState('record', { // record page
    skuNo: '',
    goodsName: '',
    operateType: '',
    orderType: '',
    outWarehouseNo: '',
    inWarehouseNo: '',
    operator: '',
    startTime: '',
    endTime: '',
  }),
  ...ReduckHelper.genListState('inventoy', { // inventory page
    inventoryNo: '',
    areaOrCatgName: '',
    warehouseName: '',
    operateStatus: '',
    operatorName: '',
    startTime: '',
    endTime: '',
  }),
  inventory: {},
  inventoryPage: {},
  ...ReduckHelper.genListState('difference', { // difference page
    differenceNo: '',
    areaOrCatgName: '',
    warehouseName: '',
    status: '',
    handler: '',
    startTime: '',
    endTime: '',
  }),
  difference: {},
  ...ReduckHelper.genListState('threshold', { // threshold page
    skuNo: '',
    goodsName: '',
    goodsCatgName: undefined,
    goodsType: undefined,
    warehouseNo: undefined,
  }),
  threshold: {},
  inventoryNo: '',
  warehouseName: '',
  houseareaName: '',
  goodsCatgName: '',
  detailList: [],
  printIp: null
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    // ...
    case GET_CHECK_LIST:
      return ReduckHelper.resolveListState('check', state, action.payload)
    case GET_OPERATE_LIST:
      return ReduckHelper.resolveListState('operate', state, action.payload)
    case GET_RECORD_LIST:
      return ReduckHelper.resolveListState('record', state, action.payload)
    case GET_INBOUND_INFO:
      return {
        ...state,
        inbound: action.payload
      }
    case GET_OUTBOUND_INFO:
      return {
        ...state,
        outbound: action.payload
      }
    case GET_INVENTORY_LIST:
      return ReduckHelper.resolveListState('inventoy', state, action.payload)
    case GET_INVENTORY_INFO:
      return {
        ...state,
        inventory: action.payload,
        inventoryPage: {
          pageNo: action.payload.detailList.pageNo,
          pageSize: action.payload.detailList.pageSize,
          records: action.payload.detailList.records,
          pages: action.payload.detailList.pages
        }
      }
    case GET_INVENTORY_PRINT_INFO:
      return {
        ...state,
        inventoryNo: action.payload.inventoryNo,
        warehouseName: action.payload.warehouseName,
        houseareaName: action.payload.houseareaName,
        goodsCatgName: action.payload.goodsCatgName,
        detailList: action.payload.detailList
      }
    case GET_DIFFERENCE_LIST:
      return ReduckHelper.resolveListState('difference', state, action.payload)
    case GET_DIFFERENCE_INFO:
      return {
        ...state,
        difference: action.payload
      }
    case GET_THRESHOLD_LIST:
      return ReduckHelper.resolveListState('threshold', state, action.payload)
    case GET_THRESHOLD_DEFAULT:
      return {
        ...state,
        threshold: action.payload
      }
    case GET_PRINT_IP: {
      return {
        ...state,
        printIp: isEmpty(action.payload[`${orgCode}_label_printing`]) ? action.payload.label_printing : action.payload[`${orgCode}_label_printing`]
      }
    }
    default:
      return state
  }
}
