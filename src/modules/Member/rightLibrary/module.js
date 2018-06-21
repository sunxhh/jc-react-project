import { createAction } from 'redux-actions'
import { message } from 'antd'
import { SHOW_LIST_SPIN } from 'Global/action'
import apis from '../apis'
import { fetchMemberCenter } from 'Utils/fetch'

// ===========================> Action Types <=========================== //
export const GET_RIGHT_LIBRARY_LIST = 'spa/Member/integral/GET_RIGHT_LIBRARY_LIST'
export const RESET_RIGHT_LIBRARY_LIST = 'spa/Member/integral/RESET_RIGHT_LIBRARY_LIST'
export const GET_RIGHT_LIBRARY = 'spa/Member/integral/GET_RIGHT_LIBRARY'
export const RESET_RIGHT_LIBRARY = 'spa/Member/integral/RESET_RIGHT_LIBRARY'
export const SHOW_ADD_MODAL = 'spa/Member/rightLibrary/SHOW_ADD_MODAL'

export default {
  namespace: 'rightLibrary',

  // initialState
  state: {
    rightLibraryList: [],
    info: {},
    showAddModal: false
  },

  actions: {
    getRightLibraryList: (arg) => dispatch => {
      return fetchMemberCenter(dispatch, SHOW_LIST_SPIN)(apis.rightLibrary.list, arg)
        .then(res => {
          if (res.code === 0) {
            dispatch(createAction(GET_RIGHT_LIBRARY_LIST)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
    },
    resetRightLibraryList: () => dispatch => {
      dispatch(createAction(RESET_RIGHT_LIBRARY_LIST)())
    },
    getRightLibrary: (arg) => dispatch => {
      dispatch(createAction(RESET_RIGHT_LIBRARY)())
      return fetchMemberCenter(dispatch)(apis.rightLibrary.detail, arg)
        .then(res => {
          if (res.code === 0) {
            dispatch(createAction(GET_RIGHT_LIBRARY)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
    },
    resetRightLibrary: () => dispatch => {
      dispatch(createAction(RESET_RIGHT_LIBRARY)())
    },
    addRightLibrary: (arg, isEdit) => dispatch => {
      let url = isEdit ? apis.rightLibrary.update : apis.rightLibrary.add
      return new Promise(resolve => {
        fetchMemberCenter(dispatch)(url, arg, '正在保存...')
          .then(res => {
            if (res.code === 0) {
              resolve({ status: 'success' })
            } else {
              message.error(res.errmsg)
              resolve({ status: 'error' })
            }
          })
      })
    },
    delRightLibrary: (arg) => dispatch => {
      return new Promise(resolve => {
        fetchMemberCenter(apis.rightLibrary.delete, arg).then(res => {
          if (res.code === 0) {
            resolve({ status: 'success' })
          } else {
            message.error(res.errmsg)
            resolve({ status: 'error' })
          }
        })
      })
    },
    activated: (arg) => dispatch => {
      return new Promise(resolve => {
        fetchMemberCenter(apis.rightLibrary.active, arg).then(res => {
          if (res.code === 0) {
            resolve({ status: 'success', result: res.data })
          } else {
            message.error(res.errmsg)
            resolve({ status: 'error' })
          }
        })
      })
    },
    showAddModalAction: (arg) => dispatch => {
      dispatch(createAction(SHOW_ADD_MODAL)(arg))
    }
  },
  reducers: {
    [GET_RIGHT_LIBRARY_LIST]: (state, action) => ({
      ...state,
      rightList: action.payload,
    }),
    [RESET_RIGHT_LIBRARY_LIST]: (state) => ({
      ...state,
      rightList: [],
      showAddModal: false,
    }),
    [GET_RIGHT_LIBRARY]: (state, action) => ({
      ...state,
      info: action.payload,
    }),
    [RESET_RIGHT_LIBRARY]: (state, action) => ({
      ...state,
      info: {},
    }),
    [SHOW_ADD_MODAL]: (state, action) => ({
      ...state,
      showAddModal: action.payload,
    }),
  },

  children: [
  ]
}
