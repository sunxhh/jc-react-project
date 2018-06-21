import { createAction } from 'redux-actions'
import { message } from 'antd'
import { SHOW_LIST_SPIN } from 'Global/action'
import apis from '../apis'
import { fetchMemberCenter } from 'Utils/fetch'

// ===========================> Action Types <=========================== //
export const GET_CUSTOM_FIELDS_LIST = 'spa/Member/integral/GET_CUSTOM_FIELDS_LIST'
export const RESET_CUSTOM_FIELDS_LIST = 'spa/Member/integral/RESET_CUSTOM_FIELDS_LIST'
export const GET_CUSTOM_FIELDS = 'spa/Member/integral/GET_CUSTOM_FIELDS'
export const RESET_CUSTOM_FIELDS = 'spa/Member/integral/RESET_CUSTOM_FIELDS'

export default {
  namespace: 'customFields',

  // initialState
  state: {
    extfieldList: [],
    info: {},
  },

  actions: {
    getFieldList: (arg) => dispatch => {
      return fetchMemberCenter(dispatch, SHOW_LIST_SPIN)(apis.customFields.extfieldList, arg)
        .then(res => {
          if (res.code === 0) {
            dispatch(createAction(GET_CUSTOM_FIELDS_LIST)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
    },
    resetFieldList: () => dispatch => {
      dispatch(createAction(RESET_CUSTOM_FIELDS_LIST)())
    },
    getField: (arg) => dispatch => {
      dispatch(createAction(RESET_CUSTOM_FIELDS)())
      return fetchMemberCenter(dispatch)(apis.customFields.extfieldDetail, arg)
        .then(res => {
          if (res.code === 0) {
            dispatch(createAction(GET_CUSTOM_FIELDS)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
    },
    resetField: () => dispatch => {
      dispatch(createAction(RESET_CUSTOM_FIELDS)())
    },
    addField: (arg) => dispatch => {
      let url = apis.customFields.extfieldAdd
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
    delField: (arg) => dispatch => {
      return new Promise(resolve => {
        fetchMemberCenter(apis.customFields.extfieldDel, arg).then(res => {
          if (res.code === 0) {
            resolve({ status: 'success' })
          } else {
            resolve({ status: 'error' })
          }
        })
      })
    },
    publishField: (arg) => dispatch => {
      return new Promise(resolve => {
        fetchMemberCenter(apis.customFields.publish, arg).then(res => {
          if (res.code === 0) {
            resolve({ status: 'success' })
          } else {
            resolve({ status: 'error' })
          }
        })
      })
    },
  },
  reducers: {
    [GET_CUSTOM_FIELDS_LIST]: (state, action) => ({
      ...state,
      extfieldList: action.payload,
    }),
    [RESET_CUSTOM_FIELDS_LIST]: (state, action) => ({
      ...state,
      extfieldList: [],
    }),
    [GET_CUSTOM_FIELDS]: (state, action) => ({
      ...state,
      info: action.payload,
    }),
    [RESET_CUSTOM_FIELDS]: (state, action) => ({
      ...state,
      info: {},
    })
  },

  children: [
  ]
}
