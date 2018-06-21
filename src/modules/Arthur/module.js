
// import { createAction } from 'redux-actions'
// import { message } from 'antd'
// import { SHOW_LIST_SPIN } from 'Global/action'

import pageModule from './page/module'

// ===========================> Action Types <=========================== //
const GET_FIRST_LIST = 'spa/Arthur/GET_FIRST_LIST' // 库存查询

export default {
  namespace: 'arthur',

  state: {
    first: ''
  },

  actions: {
    // getFirstList(arg) {
    //   return dispatch => {
    //     // const filter = objectHandler(arg, trim)
    //     dispatch(createAction(GET_FIRST_LIST)('first'))
    //   }
    // }
    getFirstList(arg) {
      return dispatch => {
        // const filter = objectHandler(arg, trim)
        // const filter = arg
        // dispatch(createAction(GET_PAGE_LIST)({ dd: 'new' }))
        dispatch({
          type: GET_FIRST_LIST,
          payload: {
            name: 'first'
          },
        })
        // return fetch(dispatch, SHOW_LIST_SPIN)(url, filter)
        //   .then(res => {
        //     if (res.code === 0) {
        //       dispatch(createAction(GET_CHECK_LIST)({ ...res.data, filter }))
        //     } else {
        //       message.error(res.errmsg)
        //     }
        //   })
      }
    }
  },

  reducers: {
    [GET_FIRST_LIST]: (state, action) => ({
      ...state,
      first: action.payload,
    })
  },

  children: [
    pageModule
  ]
}
