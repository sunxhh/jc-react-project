
// import { createAction } from 'redux-actions'
// import { message } from 'antd'
import menuTreeList from './menuCodes'
import storage from '../utils/storage'
// import { SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //
// 全局公用常量
export const SHOW_SPIN = 'spa/common/SHOW_SPIN'
export const SHOW_BUTTON_SPIN = 'spa/common/SHOW_BUTTON_SPIN'
export const SHOW_LIST_SPIN = 'spa/common/SHOW_LIST_SPIN'
export const SET_QINIU_TOKEN = 'spa/common/SET_QINIU_TOKEN'
export const SET_ALI_TOKEN = 'spa/common/SET_ALI_TOKEN'
export const UPDATE_LOADING = 'spa/common/UPDATE_LOADING'
export const UPDATE_DISABLED = 'spa/common/UPDATE_DISABLED'
export const UPDATE_VISIBLE = 'spa/common/UPDATE_VISIBLE'
export const LOGIN = 'spa/common/SET_USER_INFO'

export default {
  namespace: 'common',

  state: {
    showSpin: { bool: false, content: '' },
    showButtonSpin: false,
    showListSpin: false,
    qiniuToken: '',
    aliToken: {},
    menuTreeList,
    userLogin: {},
  },

  // init: async (props) => {
  //
  // },

  actions: {

  },

  reducers: {
    [SHOW_SPIN]: (state, { payload }) => ({
      ...state,
      showSpin: payload,
    }),
    [SHOW_BUTTON_SPIN]: (state, { payload }) => ({
      ...state,
      showButtonSpin: payload.bool,
    }),
    [SHOW_LIST_SPIN]: (state, { payload }) => ({
      ...state,
      showListSpin: payload.bool,
    }),

    [SET_QINIU_TOKEN]: (state, { payload }) => ({
      ...state,
      qiniuToken: payload,
    }),
    [SET_ALI_TOKEN]: (state, { payload }) => ({
      ...state,
      aliToken: payload,
    }),

    [LOGIN]: (state, { payload }) => {
      storage.set('userInfo', action.payload)
      return {
        ...state,
        userLogin: payload,
      }
    },
  },

  children: [

  ]
}
