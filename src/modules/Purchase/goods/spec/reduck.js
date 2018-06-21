import { createAction } from 'redux-actions'
import { fetchSupplyChain as fetchData } from 'Utils/fetch'
import apis from '../../apis'
import { SHOW_LIST_SPIN } from 'Global/action'
import { message } from 'antd'

// ===========================> Action Types <=========================== //
export const GET_SPEC_CATG_LIST = 'spa/SupplyChain/goods/GET_SPEC_CATG_LIST' // 规格类别
const GET_SPEC_DETAIL_LIST = 'spa/SupplyChain/goods/GET_SPEC_DETAIL_LIST' // 规格列表

// ===========================> Actions <=========================== //

export const getSpecCatgList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.goods.spec.catg, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_SPEC_CATG_LIST)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
        return false
      }
    })

export const addSpecCatg = (arg, callback) => dispatch =>
  fetchData(apis.goods.spec.catgAdd, arg).then(res => {
    if (res.code === 0) {
      callback && callback()
      return res
    } else {
      message.error(res.errmsg)
    }
  })

export const updateSpecCatg = (arg, callback) => dispatch =>
  fetchData(apis.goods.spec.catgUpdate, arg).then(res => {
    if (res.code === 0) {
      callback && callback()
      return res
    } else {
      message.error(res.errmsg)
    }
  })

export const deleteSpecCatg = arg => dispatch =>
  fetchData(apis.goods.spec.catgDelete, arg).then(res => {
    if (res.code === 0) {
      dispatch(getSpecCatgList())
      return res
    } else {
      message.error(res.errmsg)
    }
  })

export const getSpecDetailList = arg => dispatch =>
  fetchData(dispatch)(apis.goods.spec.detail, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_SPEC_DETAIL_LIST)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })

export const addSpecDetail = (arg, specCatgNo) => dispatch =>
  fetchData(dispatch)(apis.goods.spec.detailAdd, { ...arg, specCatgNo }).then(res => {
    if (res.code === 0) {
      dispatch(getSpecDetailList({ specCatgNo }))
      return res
    } else {
      message.error(res.errmsg)
    }
  })

export const updateSpecDetail = (arg, specCatgNo) => dispatch =>
  fetchData(dispatch)(apis.goods.spec.detailUpdate, arg).then(res => {
    if (res.code === 0) {
      dispatch(getSpecDetailList({ specCatgNo }))
      return res
    } else {
      message.error(res.errmsg)
    }
  })

export const deleteSpecDetail = (arg, specCatgNo) => dispatch =>
  fetchData(dispatch)(apis.goods.spec.detailDelete, arg).then(res => {
    if (res.code === 0) {
      dispatch(getSpecDetailList({ specCatgNo }))
    } else {
      message.error(res.errmsg)
    }
  })

// ===========================> Reducer <=========================== //

const initialState = {
  catg: [],
  detail: [],
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_SPEC_CATG_LIST:
      return {
        ...state,
        catg: action.payload
      }
    case GET_SPEC_DETAIL_LIST:
      return {
        ...state,
        detail: action.payload
      }
    default:
      return state
  }
}
