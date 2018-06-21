
// import { createAction } from 'redux-actions'
// import { message } from 'antd'
// import { SHOW_LIST_SPIN } from 'Global/action'

import customFieldsModule from './customFields/module'
import integralModule from './integral/module'
import memberModule from './member/module'
import rightModule from './right/module'
import rightLibraryModule from './rightLibrary/module'
import cardModule from './card/module'
import { createAction } from 'redux-actions'
import { message } from 'antd/lib/index'
import apis from './apis'
import fetchData from 'Utils/fetch'

// ===========================> Action Types <=========================== //
export const GET_FIRST_ORG_LIST = 'spa/Member/firstOrgList'

export default {
  namespace: 'memberCenter',

  state: {
    firstOrgList: []
  },

  actions: {
    // 一级产业列表
    getFirstOrgList: arg => dispatch => {
      return fetchData(apis.member.firstOrgList, arg).then(res => {
        if (res.code === 0) {
          dispatch(createAction(GET_FIRST_ORG_LIST)(res.data.myOrgList))
        } else {
          message.error(res.errmsg)
        }
      })
    },
    getIndustryAndOrgList: arg => dispatch =>
      fetchData(apis.customFields.orgList, arg).then(res => {
        if (res.code === 0) {
          return ({ status: 'success', result: res.data })
        } else {
          message.error(res.errmsg)
        }
      })
    ,
  },
  reducers: {
    [GET_FIRST_ORG_LIST]: (state, action) => {
      return {
        ...state,
        firstOrgList: action.payload,
      }
    },
  },

  children: [
    customFieldsModule,
    integralModule,
    memberModule,
    rightModule,
    rightLibraryModule,
    cardModule
  ]
}
