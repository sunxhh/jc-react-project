import { createAction } from 'redux-actions'
import fetchData from '../../../../utils/fetch'
import api from '../../apis'
import { message } from 'antd'
import { SHOW_BUTTON_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //

export const ORG_LIST = '/spa/book/ORG_LIST'
export const CHANNEL_LIST = '/spa/book/CHANNEL_LIST'
export const CONSULT_LIST = '/spa/book/CONSULT_LIST'
export const CONSULT_MANAGE_DETAIL = '/spa/book/CONSULT_MANAGE_DETAIL'

// ===========================> Actions <=========================== //

export const getOrg = (values) => {
  return dispatch => {
    return fetchData(api.banner.orgList, values).then(res => {
      if (res.code === 0) {
        dispatch(createAction(ORG_LIST)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

export const getChannelList = (values) => {
  return dispatch => {
    fetchData(api.consult.consult.channelList, values).then(res => {
      if (res.code === 0) {
        dispatch(createAction(CHANNEL_LIST)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

export const getConsultList = arg => dispatch => {
  fetchData(dispatch)(api.consult.consult.list, arg).then(res => {
    dispatch(createAction(CONSULT_LIST)(res.data))
  })
}

export const changeStatus = (api, arg) => dispatch => {
  return fetchData(api, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
      return false
    } else {
      return true
    }
  })
}

export const addConsult = (arg) => {
  return dispatch => {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(api.consult.consult.add, arg).then(res => {
      if (res.code === 0) {
        history.go(-1)
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

export const getConsultDetail = arg => dispatch => {
  return fetchData(dispatch)(api.consult.consult.detail, arg).then(res => {
    dispatch(createAction(CONSULT_MANAGE_DETAIL)(res.data))
    return res.data
  })
}

export const editConsult = (arg) => {
  return dispatch => {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(api.consult.consult.edit, arg).then(res => {
      if (res.code === 0) {
        history.go(-1)
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// ===========================> Reducers <=========================== //

const initialState = {
  orgData: {},
  channelList: [],
  list: [],
  page: {},
  detailConsult: {}
}

export const consult = function (state = initialState, action) {
  switch (action.type) {
    case CHANNEL_LIST:
      return { ...state, channelList: action.payload }
    case ORG_LIST:
      return { ...state, orgData: action.payload }
    case CONSULT_LIST:
      return {
        ...state,
        list: action.payload.result,
        page: {
          pageNo: action.payload.page.currentPage,
          pageSize: action.payload.page.pageSize,
          records: action.payload.page.totalCount
        }
      }
    case CONSULT_MANAGE_DETAIL:
      return { ...state, detailConsult: action.payload }
    default:
      return state
  }
}
