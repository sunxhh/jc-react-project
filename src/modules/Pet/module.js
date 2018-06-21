import speciesModule from './species/module'
// import { createAction } from 'redux-actions'
// import { message } from 'antd'
// import apis from './apis'
// import fetchData from 'Utils/fetch'

// ===========================> Action Types <=========================== //
export const GET_FIRST_ORG_LIST = 'spa/Member/firstOrgList'

export default {
  namespace: 'petModule',

  state: {
  },

  actions: {
    // 一级产业列表
  //   getFirstOrgList: arg => dispatch => {
  //     return fetchData(apis.member.firstOrgList, arg).then(res => {
  //       if (res.code === 0) {
  //         dispatch(createAction(GET_FIRST_ORG_LIST)(res.data.myOrgList))
  //       } else {
  //         message.error(res.errmsg)
  //       }
  //     })
  //   },
  },
  reducers: {
    // [GET_FIRST_ORG_LIST]: (state, action) => {
    //   return {
    //     ...state,
    //     firstOrgList: action.payload,
    //   }
    // },
  },

  children: [
    speciesModule,
  ]
}
