import { createAction } from 'redux-actions'
import fetchData from '../../../utils/fetch'
import api from '../apis'
import { message } from 'antd'
import { SHOW_BUTTON_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //

export const BANNER_MANAGE_LIST = '/spa/book/BANNER_MANAGE_LIST'
export const ORG_LIST = '/spa/book/ORG_LIST'
export const BANNER_DETAIL = '/spa/book/BANNER_DETAIL'

// ===========================> Actions <=========================== //

// 获取列表
export const getBannerList = arg => dispatch => {
  fetchData(dispatch)(api.banner.bannerList, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
    } else {
      dispatch(createAction(BANNER_MANAGE_LIST)(res.data))
    }
  })
}

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

// 状态改变
export const changeStatus = arg => dispatch => {
  return fetchData(api.banner.changeStatus, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
      return false
    } else {
      return true
    }
  }).then((res) => {
    return res
  })
}

export const addBanner = (values) => {
  return dispatch => {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(api.banner.addBanner, values).then(res => {
      if (res.code === 0) {
        history.go(-1)
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

export const getBannerDetail = arg => dispatch => {
  fetchData(dispatch)(api.banner.detailBanner, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
    } else {
      dispatch(createAction(BANNER_DETAIL)(res.data))
    }
  })
}

export const editBanner = arg => dispatch => {
  fetchData(dispatch, SHOW_BUTTON_SPIN)(api.banner.editBanner, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
    } else {
      history.go(-1)
    }
  })
}

// ===========================> Reducers <=========================== //

const initialState = {
  bannerList: [],
  page: {},
  orgData: {},
  detailBanner: {},
}

export const banner = function (state = initialState, action) {
  switch (action.type) {
    case BANNER_MANAGE_LIST:
      return {
        ...state,
        bannerList: action.payload.result,
        page: {
          pageNo: action.payload.page.currentPage,
          records: action.payload.page.totalCount,
          pageSize: action.payload.page.pageSize

        }
      }
    case ORG_LIST:
      return { ...state, orgData: action.payload }
    case BANNER_DETAIL:
      return { ...state, detailBanner: action.payload }
    default:
      return state
  }
}
