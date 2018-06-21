import { createAction } from 'redux-actions'
import { fetchSupplyChain as fetchData } from 'Utils/fetch'
import { message } from 'antd'
import apis from '../../apis'
import { SHOW_LIST_SPIN, SHOW_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //

export const GET_LIBRARY_LIST = 'spa/SupplyChain/libraryBit/GET_LIBRARY_LIST'
export const LIBRARY_BIT_DETAIL = 'spa/SupplyChain/libraryBit/LIBRARY_BIT_DETAIL'
export const LIBRARY_GOODS_LIST = 'spa/SupplyChain/libraryBit/LIBRARY_GOODS_LIST'

// ===========================> Actions <=========================== //

export const getLibraryList = arg => dispatch => {
  return fetchData(dispatch, SHOW_LIST_SPIN)(apis.depot.library.libraryList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_LIBRARY_LIST)({ ...res.data, filter: arg }))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const libraryGoodsList = arg => dispatch => {
  return fetchData(dispatch, SHOW_LIST_SPIN)(apis.depot.library.libraryGoodsList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(LIBRARY_GOODS_LIST)(res.data))
      if (res.errmsg) {
        message.warning(res.errmsg)
      }
      return res.data
    } else {
      message.error(res.errmsg)
      return false
    }
  })
}

export const libraryBitDetail = arg => dispatch => {
  return fetchData(dispatch, SHOW_SPIN)(apis.depot.library.libraryBitDetail, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(LIBRARY_BIT_DETAIL)(res.data))
      return res.data
    } else {
      message.error(res.errmsg)
      return false
    }
  })
}

export const libraryBitAdd = (arg, libraryFilter) => dispatch => {
  return fetchData(dispatch, SHOW_SPIN)(apis.depot.library.libraryAdd, arg).then(res => {
    if (res.code === 0) {
      dispatch(getLibraryList(libraryFilter))
      return true
    } else {
      message.error(res.errmsg)
      return false
    }
  })
}

export const libraryBitEdit = (arg, libraryFilter) => dispatch => {
  return fetchData(dispatch, SHOW_SPIN)(apis.depot.library.libraryEdit, arg).then(res => {
    if (res.code === 0) {
      dispatch(getLibraryList(libraryFilter))
      return true
    } else {
      message.error(res.errmsg)
      return false
    }
  })
}

export const libraryDelete = arg => dispatch => {
  return fetchData(dispatch, SHOW_SPIN)(apis.depot.library.libraryDelete, arg).then(res => {
    if (res.code === 0) {
      return res.data
    } else {
      message.error(res.errmsg)
      return false
    }
  })
}

// ===========================> Reducer <=========================== //

const initialState = {
  libraryList: [],
  libraryFilter: {},
  libraryBitDetail: {},
  libraryGoodsList: [],
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_LIBRARY_LIST:
      return { ...state, libraryList: action.payload, libraryFilter: action.payload.filter }
    case LIBRARY_BIT_DETAIL:
      return { ...state, libraryBitDetail: action.payload }
    case LIBRARY_GOODS_LIST:
      return { ...state, libraryGoodsList: action.payload }
    default:
      return state
  }
}
