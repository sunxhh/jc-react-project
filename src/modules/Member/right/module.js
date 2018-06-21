import { createAction } from 'redux-actions'
import { message } from 'antd'
import { SHOW_LIST_SPIN } from 'Global/action'
import apis from '../apis'
import { fetchMemberCenter } from 'Utils/fetch'

// ===========================> Action Types <=========================== //
export const GET_RIGHT_LIST = 'spa/Member/right/GET_RIGHT_LIST' // 获取列表
export const RESET_RIGHT_LIST = 'spa/Member/right/RESET_RIGHT_LIST'
export const GET_RIGHT = 'spa/Member/right/GET_RIGHT'
export const RESET_RIGHT = 'spa/Member/right/RESET_RIGHT'

export default {
  namespace: 'right',

  // initialState
  state: {
    rightList: [],
    info: {},
  },

  actions: {
    // 获取左侧树
    getIndustryAndOrgList: arg => dispatch =>
      fetchData(apis.customFields.orgList, arg).then(res => {
        if (res.code === 0) {
          return ({ status: 'success', result: res.data })
        } else {
          message.error(res.errmsg)
        }
      }),
    // 获取列表
    getRightList: (arg) => dispatch => {
      return fetchMemberCenter(dispatch, SHOW_LIST_SPIN)(apis.right.list, arg)
        .then(res => {
          if (res.code === 0) {
            dispatch(createAction(GET_RIGHT_LIST)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
    },
    // 重置
    resetRightList: () => dispatch => {
      dispatch(createAction(RESET_RIGHT_LIST)())
    },
    // 新增
    add: arg => dispatch =>
      fetchMemberCenter(apis.right.add, arg).then(res => {
        if (res.code === 0) {
          return res.code
        } else {
          message.error(res.errmsg)
        }
      }),
    // 删除
    delRight: arg => dispatch =>
      fetchMemberCenter(apis.right.delete, arg).then(res => {
        if (res.code === 0) {
          return res.code
        } else {
          message.error(res.errmsg)
        }
      }),
    // 是否启用
    isActive: arg => dispatch =>
      fetchMemberCenter(apis.right.active, arg).then(res => {
        if (res.code === 0) {
          return res.code
        } else {
          message.error(res.errmsg)
        }
      }),
    resetFieldList: () => dispatch => {
      dispatch(createAction(RESET_RIGHT_LIST)())
    },
    //  编辑
    edit: arg => dispatch =>
      fetchMemberCenter(apis.right.detail, arg).then(res => {
        if (res.code === 0) {
          return ({ status: 'success', result: res.data })
        } else {
          message.error(res.errmsg)
        }
      }),
    //  编辑保存
    sava: arg => dispatch =>
      fetchMemberCenter(apis.right.update, arg).then(res => {
        if (res.code === 0) {
          return res.code
        } else {
          message.error(res.errmsg)
        }
      }),
    // 获取权益
    getRightListInfo: arg => dispatch =>
      fetchMemberCenter(apis.rightLibrary.list, arg).then(res => {
        if (res.code === 0) {
          return ({ status: 'success', result: res.data })
        } else {
          message.error(res.errmsg)
        }
      })
  },
  reducers: {
    [GET_RIGHT_LIST]: (state, action) => ({
      ...state,
      rightList: action.payload,
    }),
    [RESET_RIGHT_LIST]: (state, action) => ({
      ...state,
      rightList: [],
    }),
    [GET_RIGHT]: (state, action) => ({
      ...state,
      info: action.payload,
    }),
    [RESET_RIGHT]: (state, action) => ({
      ...state,
      info: {},
    })
  },

  children: [
  ]
}
