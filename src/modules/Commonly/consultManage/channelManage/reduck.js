import { createAction } from 'redux-actions'
import fetchData from '../../../../utils/fetch'
import api from '../../apis'
import { message } from 'antd'

// ===========================> Action Types <=========================== //

export const CHANNEL_MANAGE_LIST = '/spa/book/CHANNEL_MANAGE_LIST'
export const ORG_LIST = '/spa/book/ORG_LIST'

// ===========================> Actions <=========================== //

// 获取列表
export const getChannelList = arg => dispatch => {
  fetchData(dispatch)(api.consult.channel.list, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
    } else {
      dispatch(createAction(CHANNEL_MANAGE_LIST)(res.data))
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
  return fetchData(api.consult.channel.delete, arg).then(res => {
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

export const channelAdd = arg => {
  return dispatch => {
    return fetchData(dispatch)(api.consult.channel.add, arg, '正在保存数据....').then(res => {
      if (parseInt(res.code) === 0) {
        return true
      } else {
        message.warn(`新增失败-${res.errmsg}`)
        return false
      }
    })
  }
}

export const getChannelDetail = (arg) => dispatch => {
  return fetchData(api.consult.channel.detail, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
      return false
    } else {
      return res
    }
  })
}

export const channelEdit = arg => {
  return dispatch => {
    return fetchData(dispatch)(api.consult.channel.modify, arg, '正在保存数据....').then(res => {
      if (parseInt(res.code) === 0) {
        return true
      } else {
        message.warn(`修改失败-${res.errmsg}`)
        return false
      }
    })
  }
}

// ===========================> Reducers <=========================== //

const initialState = {
  channelList: [],
  page: {},
  orgData: {},
}

export const channel = function (state = initialState, action) {
  switch (action.type) {
    case CHANNEL_MANAGE_LIST:
      return {
        ...state,
        channelList: action.payload.result,
        page: {
          pageNo: action.payload.page.currentPage,
          pageSize: action.payload.page.pageSize,
          records: action.payload.page.totalCount
        }
      }
    case ORG_LIST:
      return { ...state, orgData: action.payload }
    default:
      return state
  }
}
