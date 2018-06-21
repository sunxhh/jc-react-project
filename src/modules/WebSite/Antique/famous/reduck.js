import { createAction } from 'redux-actions'
import fetchData from 'Utils/fetch'
import api from '../apis'
import { message } from 'antd'
import { SHOW_SPIN, SHOW_BUTTON_SPIN, SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //

export const GET_FAMOUS_LIST = '/spa/antique/GET_FAMOUS_LIST'
export const GET_FAMOUS_DETAIL = '/spa/book/GET_FAMOUS_DETAIL'
export const GET_ALI_TOKEN = '/spa/book/GET_ALI_TOKEN'

// ===========================> Actions <=========================== //
// 获取列表

export const getFamousList = arg => dispatch => {
  return fetchData(dispatch, SHOW_LIST_SPIN)(api.famous.getList, arg).then(res => {
    dispatch(createAction(GET_FAMOUS_LIST)(res.data))
  })
}

export const changeStatus = arg => dispatch => {
  return fetchData(api.famous.del, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
      return false
    } else {
      return true
    }
  })
}

export const addFamous = (values) => {
  return dispatch => {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(api.famous.add, values).then(res => {
      if (res.code === 0) {
        history.go(-1)
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

export const getFamousDetail = arg => dispatch => {
  return fetchData(dispatch, SHOW_SPIN)(api.famous.getDetail, arg).then(res => {
    dispatch(createAction(GET_FAMOUS_DETAIL)(res.data))
    return res.data
  })
}

export const editFamous = (values) => {
  return dispatch => {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(api.famous.modify, values).then(res => {
      if (res.code === 0) {
        history.go(-1)
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

export const clearFamousDetail = () => dispatch => {
  dispatch(createAction(GET_FAMOUS_DETAIL)({ ...initialState.templatePage }))
}
// 获取七牛token
export const getAliToken = () => dispatch =>
  fetchData(api.getAliToken, {}).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_ALI_TOKEN)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
// ===========================> Reducers <=========================== //

const initialState = {
  famousList: [],
  page: {

  },
  classAll: [],
  famousDetail: {
    image: '',
    name: '',
    pics: [],
    remark: '',
    sort: '',
    summary: '',
  },
  aliToken: {}
}
export const famous = function(state = initialState, action) {
  switch (action.type) {
    case GET_FAMOUS_LIST:
      return {
        ...state,
        famousList: action.payload.result,
        page: action.payload.page
      }
    case GET_FAMOUS_DETAIL:
      return {
        ...state,
        famousDetail: action.payload
      }
    case GET_ALI_TOKEN:
      return {
        ...state,
        aliToken: action.payload
      }
    default:
      return state
  }
}
