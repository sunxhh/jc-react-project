/**
 * Created with webstorm
 * User: HuangZeXia / huangzexiameishu@163.com
 * Date: 2018/3/13
 * Time: 下午2:42
 */
import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchSupplyChain as fetchData } from 'Utils/fetch'
import apis from '../apis'
import { SHOW_LIST_SPIN } from 'Global/action'
// ===========================> Action Types <=========================== //
export const GET_REPORT_LIST = '/spa/cost/GET_REPORT_LIST' // 报表列表
export const GET_GOODS_TYPE_LIST = '/spa/cost/GET_GOODS_TYPE_LIST' // 货物类别
export const GET_GOODS_CATG = '/spa/cost/GET_GOODS_CATG' // 货物所属分类
// ===========================> Actions <=========================== //

// 获取报表列表
export const getReportList = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.reportCost.skuWeight, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_REPORT_LIST)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取货物类别
export const getGoodsTypeList = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.common.codeList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_GOODS_TYPE_LIST)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取货物所属类别
export const getGoodsCatg = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.reportCost.goodscatg, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_GOODS_CATG)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}
// ===========================> Reducer <=========================== //

const initialState = {
  loading: false,
  reportList: [],
  page: {
    pageNo: 1,
    pageSize: 10,
    records: 0,
    pages: 0,
  },
  goodsTypeList: [],
  getGoodsCatg: []
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_REPORT_LIST:
      return {
        ...state,
        reportList: action.payload.data,
        page: {
          currentPage: action.payload.pageNo,
          pageSize: action.payload.pageSize,
          records: action.payload.records,
          pages: action.payload.pages,
        }
      }
    case GET_GOODS_TYPE_LIST:
      return {
        ...state,
        goodsTypeList: action.payload.goodsType,
      }
    case GET_GOODS_CATG:
      return {
        ...state,
        getGoodsCatg: action.payload,
      }
    default:
      return state
  }
}
