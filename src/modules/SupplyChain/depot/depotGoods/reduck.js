import { createAction } from 'redux-actions'
import { fetchSupplyChain as fetchData } from 'Utils/fetch'
import apis from '../../apis'
import { SHOW_LIST_SPIN } from 'Global/action'
import { message } from 'antd'

// ===========================> Action Types <=========================== //

const GET_DEPOT_GOODS_LIST = 'spa/SupplyChain/depotGoods/GET_DEPOT_GOODS_LIST'
const GET_GOODS_DETAIL = 'spa/SupplyChain/depotGoods/GET_GOODS_DETAIL'
const GET_PRINT_IP = 'spa/SupplyChain/depotGoods/GET_PRINT_IP'

// ===========================> Actions <=========================== //

export const getDepotGoodsList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.depot.depotGoods.goodsList, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_DEPOT_GOODS_LIST)(res.data))
      }
    })

// 获取打印机ip acgtion
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

export const handleDelete = arg => dispatch => {
  return fetchData(apis.depot.depotGoods.delete, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
      return false
    } else {
      return true
    }
  })
}

export const depotGoodsAdd = arg => {
  return dispatch => {
    return fetchData(dispatch)(apis.depot.depotGoods.add, arg, '正在保存数据....').then(res => {
      if (parseInt(res.code) === 0) {
        return true
      } else {
        message.warn(`新增失败-${res.errmsg}`)
      }
    })
  }
}

export const getDepotGoodsDetail = arg => dispatch => {
  fetchData(dispatch)(apis.depot.depotGoods.detail, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_GOODS_DETAIL)(res.data))
    }
  })
}

// ===========================> Reducer <=========================== //

const initialState = {
  depotGoodsList: [],
  depotGoodsPage: {},
  goodsDetail: {},
  goodsAttrSpecList: [],
  goodsImgInfo: {},
  printIp: null
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_DEPOT_GOODS_LIST: {
      return {
        ...state,
        depotGoodsList: action.payload.data,
        depotGoodsPage: {
          pageNo: action.payload.pageNo,
          pageSize: action.payload.pageSize,
          records: action.payload.records,
          pages: action.payload.pages
        },
      }
    }
    case GET_GOODS_DETAIL: {
      return {
        ...state,
        goodsDetail: action.payload,
        goodsAttrSpecList: action.payload.goodsAttrSpecList,
        goodsSkuList: action.payload.goodsSkuList,
        goodsImgInfo: action.payload.goodsImgInfo
      }
    }
    case GET_PRINT_IP: {
      return {
        ...state,
        printIp: action.payload.label_printing
      }
    }
    default:
      return state
  }
}
