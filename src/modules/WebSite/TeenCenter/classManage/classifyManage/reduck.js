import { createAction } from 'redux-actions'
import fetchData from 'Utils/fetch'
import api from '../../apis'
import { message } from 'antd'

// ===========================> Action Types <=========================== //

export const CLASSIFY_MANAGE_LIST = '/spa/classify/CLASSIFY_MANAGE_LIST'

// ===========================> Actions <=========================== //

// 获取列表
export const getClassifyList = arg => dispatch => {
  fetchData(dispatch)(api.classManage.classify.list, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
    } else {
      dispatch(createAction(CLASSIFY_MANAGE_LIST)(res))
    }
  })
}

export const handleDelete = arg => dispatch => {
  return fetchData(api.classManage.classify.delete, arg).then(res => {
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

export const classifyAdd = arg => {
  return dispatch => {
    fetchData(dispatch)(api.classManage.classify.add, arg, '正在保存数据....').then(res => {
      if (parseInt(res.code) === 0) {
        dispatch(getClassifyList())
      } else {
        message.warn(`新增失败-${res.errmsg}`)
      }
    })
  }
}

export const getClassifyDetail = (arg) => dispatch => {
  return fetchData(api.classManage.classify.detail, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
      return false
    } else {
      return res
    }
  })
}

export const classifyEdit = arg => {
  return dispatch => {
    fetchData(api.classManage.classify.modify, arg, '正在保存数据....').then(res => {
      if (parseInt(res.code) === 0) {
        dispatch(getClassifyList())
      } else {
        message.warn(`新增失败-${res.errmsg}`)
      }
    })
  }
}

// ===========================> Reducers <=========================== //

const initialState = {
  classifyList: [],
}

export const classify = function (state = initialState, action) {
  switch (action.type) {
    case CLASSIFY_MANAGE_LIST:
      return { ...state, classifyList: action.payload.data }
    default:
      return state
  }
}
