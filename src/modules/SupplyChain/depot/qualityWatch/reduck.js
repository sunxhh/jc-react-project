import { createAction } from 'redux-actions'
import { fetchSupplyChain as fetchData } from 'Utils/fetch'
import apis from '../../apis'
import { message } from 'antd'
import { SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //

const GET_WATCH_LIST = 'spa/SupplyChain/qualityWatch/GET_WATCH_LIST' // 保质期监控
const GET_SELECT_LIST = 'spa/SupplyChain/common/GET_SELECT_LIST'
const GET_WAREHOUSE_LIST = 'spa/SupplyChain/common/GET_WAREHOUSE_LIST'
const GET_GOODSCATE_LIST = 'spa/SupplyChain/qualityWatch/GET_GOODSCATE_LIST'

// ===========================> Actions <=========================== //

export const myOrgListAction = (payload) => ({
  type: 'CLASS_ORG_LIST',
  payload,
})

export const getWatchList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.depot.watch.watchList, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_WATCH_LIST)(res.data))
      }
    })

export const getSelectList = arg => dispatch =>
  fetchData(apis.common.selectList, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_SELECT_LIST)(res.data))
      }
    })

export const getWareList = arg => dispatch =>
  fetchData(apis.common.warehouseList, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_WAREHOUSE_LIST)(res.data))
      }
    })

export const getGoodsCateList = (arg) => dispatch => {
  fetchData(apis.depot.houseArea.goodscatg, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
    } else {
      dispatch(createAction(GET_GOODSCATE_LIST)(res.data))
    }
  })
}

// ===========================> Reducer <=========================== //

const initialState = {
  watchList: [],
  watchPage: {}
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_WATCH_LIST: {
      return {
        ...state,
        watchList: action.payload.data,
        watchPage: {
          pageNo: action.payload.pageNo,
          pageSize: action.payload.pageSize,
          records: action.payload.records,
          pages: action.payload.pages
        },
      }
    }
    case GET_SELECT_LIST: {
      return {
        ...state,
        goodsCatg: action.payload.goodsCatg
      }
    }
    case GET_WAREHOUSE_LIST: {
      return {
        ...state,
        wareList: action.payload
      }
    }
    case GET_GOODSCATE_LIST: {
      return {
        ...state,
        goodsCateList: action.payload
      }
    }
    case 'CLASS_ORG_LIST':
      return {
        ...state,
        orgList: action.payload.orgList,
        orgName: action.payload.orgName,
        orgLevel: action.payload.orgLevel,
        orgCode: action.payload.orgCode
      }
    default:
      return state
  }
}
