import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchSupplyChain as fetchData } from 'Utils/fetch'
import apis from '../apis'
import { ReduckHelper } from 'Utils/helper'
import {
  SHOW_LIST_SPIN,
  // SHOW_BUTTON_SPIN,
  // SHOW_SPIN
} from 'Global/action'

// ===========================> Action Types <=========================== //

export const GET_IMPORT_LIST = '/spa/supply/import/GET_IMPORT_LIST' // 获取导入列表

// ===========================> Actions <=========================== //

// 获取导入列表
export const getImportList = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.import.importList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_IMPORT_LIST)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

export const getImportProcessList = arg => {
  return dispatch => {
    return fetchData(apis.import.importProcess, arg).then(res => {
      if (res.code === 0) {
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}
// ===========================> Reducer <=========================== //

const initialState = {
  ...ReduckHelper.genListState('import'),
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_IMPORT_LIST:
      return ReduckHelper.resolveListState('import', state, action.payload)
    default:
      return state
  }
}
