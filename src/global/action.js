import { message } from 'antd'
import { createAction } from 'redux-actions'
import { replace } from 'react-router-redux'

import fetchData, { fetchSupplyChain } from '../utils/fetch'
import storage from '../utils/storage'
import apis from '../global/apis'
import * as urls from '../global/urls'

// 全局公用常量
export const SHOW_SPIN = 'spa/common/SHOW_SPIN'
export const SHOW_BUTTON_SPIN = 'spa/common/SHOW_BUTTON_SPIN'
export const SHOW_LIST_SPIN = 'spa/common/SHOW_LIST_SPIN'
export const MENU_TREE_LIST = 'spa/common/MENU_TREE_LIST'
export const SET_QINIU_TOKEN = 'spa/common/SET_QINIU_TOKEN'
export const SWITCH_LIST_LOADING = 'spa/common/SWITCH_LIST_LOADING'
export const SWITCH_BUTTON_LOADING = 'spa/common/SWITCH_BUTTON_LOADING'
export const ORG_LIST = 'spa/common/ORG_LIST'
export const SWITCH_DISABLED = 'spa/common/SWITCH_DISABLED'
export const SET_ALI_TOKEN = 'spa/common/SET_ALI_TOKEN'
export const ORG_LIST_LEVEL = 'spa/common/ORG_LIST_LEVEL'
export const UPDATE_LOADING = 'UPDATE_LOADING'
export const UPDATE_DISABLED = 'UPDATE_DISABLED'
export const UPDATE_VISIBLE = 'UPDATE_VISIBLE'
export const SET_USER_INFO = 'spa/common/SET_USER_INFO'
export const COMMON_ORG_LIST = 'spa/common/COMMON_ORG_LIST'

// ===========================> common Action <=========================== //

export const showSpin = createAction(SHOW_SPIN)

export const showBtnSpin = createAction(SHOW_BUTTON_SPIN)

export const showListSpin = createAction(SHOW_LIST_SPIN)

export const switchDisabledAction = createAction(SWITCH_DISABLED)

export const readMenuTreeList = () => dispatch =>
  fetchData(dispatch, SHOW_SPIN)(apis.readMenuTree)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(MENU_TREE_LIST)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })

export const updLoading = createAction(UPDATE_LOADING)

export const updDisabled = createAction(UPDATE_DISABLED)

export const updVisible = createAction(UPDATE_VISIBLE)

// ===========================> login Action <=========================== //

export const setUserInfo = createAction(SET_USER_INFO)

export const userLogin = arg => dispatch =>
  fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.login, arg)
    .then(res => {
      if (res.code !== 0) {
        message.error(res.errmsg)
      } else {
        storage.set('userInfo', res.data)
        dispatch(setUserInfo(res.data))
        dispatch(readMenuTreeList())
        dispatch(replace(urls.HOME))
        dispatch(queryOrgByLevel())
        // location.href = urls.HOME
      }
    })

export const userLogout = arg => {
  return dispatch => {
    storage.clear()
    // dispatch(setUserInfo({}))
    // dispatch(replace(urls.LOGIN))
    location.href = urls.LOGIN
  }
}

export const modifyPassword = arg => dispatch =>
  fetchData(dispatch, SHOW_SPIN)(apis.modifyPass, arg)
    .then(res => {
      if (res.code === 0) {
        message.info('密码修改成功', 3)
        return Promise.resolve(true)
      } else {
        message.error(res.errmsg)
        return Promise.resolve(false)
      }
    })

// 获取七牛token
export const getQiniuToken = key => dispatch =>
  fetchData(apis.qiniuToken, { key })
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(SET_QINIU_TOKEN)(res.data.token))
      } else {
        message.error(res.errmsg)
      }
    })

// 获取 ALIYUN token
export const getAliToken = key => dispatch =>
  fetchSupplyChain(dispatch, SHOW_SPIN)(apis.aliToken, {})
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(SET_ALI_TOKEN)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })

export const queryOrg = arg => dispatch =>
  fetchData(apis.queryOrg, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(ORG_LIST)(res.data))
        return Promise.resolve(res.data)
      } else {
        message.error(res.errmsg)
        return Promise.resolve(false)
      }
    })

export const queryOrgByLevel = () => dispatch =>
  fetchSupplyChain(apis.queryOrgByLevel, { orgLevel: '2' })
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(ORG_LIST_LEVEL)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
        return false
      }
    })

export const getShopInfoList = arg => {
  return fetchData(apis.shopInfoList, arg).then(res => {
    if (res.code === 0) {
      return res.data
    } else {
      message.error(res.errmsg)
    }
  })
}

// 一级产业列表
export const getCommonOrgList = arg => dispatch => {
  return fetchData(apis.firstOrgList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(COMMON_ORG_LIST)(res.data.myOrgList))
    } else {
      message.error(res.errmsg)
    }
  })
}
