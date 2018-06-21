import { createAction } from 'redux-actions'
import { fetchSupplyChain as fetchData } from 'Utils/fetch'
import { fetchLogistics } from 'Utils/fetch'
import apis from '../../apis'
import { SHOW_LIST_SPIN } from 'Global/action'
import { message } from 'antd'
import * as urls from 'Global/urls'

// ===========================> Action Types <=========================== //

const GET_SORT_LIST = 'spa/SupplyChain/sort/GET_SORT_LIST' // 分拣单监控
const GET_SORT_DETAIL = 'spa/SupplyChain/sort/GET_SORT_DETAIL' // 分拣单详情
const GET_PRINT_IP = 'spa/SupplyChain/depotGoods/GET_PRINT_IP'
const GET_LOG_LIST = 'spa/SupplyChain/depotGoods/GET_LOG_LIST'

export const setSelectedRowKeys = (payload) => ({
  type: 'SET_CLASSROOM_SELECTED_ROWKEYS',
  payload,
})

// ===========================> Actions <=========================== //

export const getSortList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.depot.sort.sortList, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_SORT_LIST)({ ...res.data, filter: arg }))
      }
    })

export const orderNumAdd = arg => {
  return dispatch => {
    return fetchData(apis.depot.sort.add, arg).then(res => {
      if (parseInt(res.code) === 0) {
        return true
      } else {
        message.warn(`新增失败-${res.errmsg}`)
        return false
      }
    })
  }
}

export const orderNumModify = (arg) => dispatch => {
  return fetchData(apis.depot.sort.add, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
      return false
    } else {
      return true
    }
  })
}

export const getSortDetail = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.depot.sort.detail, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_SORT_DETAIL)(res.data))
      }
    })

export const pickGoods = arg => {
  return dispatch => {
    fetchData(dispatch)(apis.depot.sort.pick, arg, '...正在上传数据').then(res => {
      if (parseInt(res.code) === 0) {
        location.href = urls.SUPPLY_SORT_MANAGE
      } else {
        message.error(res.errmsg)
        return false
      }
    })
  }
}

export const getPrintIp = arg => dispatch =>
  fetchData(dispatch)(apis.common.printIp, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_PRINT_IP)(res.data))
      }
    })

export const sortPrintList = (arg) => dispatch => {
  return fetchData(apis.depot.sort.printList, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
      return false
    } else {
      return res.data
    }
  })
}

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

export const getLogList = arg => dispatch =>
  fetchLogistics(dispatch)(apis.depot.sort.logisticsCorps, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_LOG_LIST)(res.data))
      }
    })

export const handleWaybillPrint = (arg) => dispatch => {
  return fetchData(apis.depot.sort.waybill, arg).then(res => {
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
  sortList: [],
  sortPage: {},
  detail: [],
  detailList: [],
  continueList: [],
  detailPage: {},
  sortDetail: {},
  filter: {},
  selectedRowKeys: [],
  printIp: null,
  logistics: []
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_SORT_LIST: {
      return {
        ...state,
        sortList: action.payload.data,
        filter: action.payload.filter,
        sortPage: {
          pageNo: action.payload.pageNo,
          pageSize: action.payload.pageSize,
          records: action.payload.records,
          pages: action.payload.pages
        },
      }
    }
    case GET_SORT_DETAIL: {
      return {
        ...state,
        sortDetail: action.payload,
        detail: action.payload.detailList.data,
        detailPage: {
          pageNo: action.payload.detailList.pageNo,
          pageSize: action.payload.detailList.pageSize,
          records: action.payload.detailList.records,
          pages: action.payload.detailList.pages
        },
        detailList: action.payload.detailList.data.map((item, index) => {
          return {
            skuNo: item.skuNo,
            outerOrderId: item.outerOrderId,
            sortQuantity: item.goodsQuantity
          }
        }),
        continueList: action.payload.detailList.data.map((item, index) => {
          return {
            skuNo: item.skuNo,
            outerOrderId: item.outerOrderId,
            sortQuantity: item.sortQuantity
          }
        }),
      }
    }
    case 'SET_CLASSROOM_SELECTED_ROWKEYS':
      return {
        ...state,
        selectedRowKeys: action.payload,
      }
    case GET_PRINT_IP: {
      return {
        ...state,
        printIp: action.payload.label_printing
      }
    }
    case GET_LOG_LIST: {
      return {
        ...state,
        logistics: action.payload
      }
    }
    default:
      return state
  }
}
