
import subModule from './sub/module'

// import { createAction } from 'redux-actions'
// import { message } from 'antd'
// import { SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //
export const GET_PAGE_LIST = 'spa/SupplyChain/depotStock/GET_PAGE_LIST' // 库存查询

export default {
  namespace: 'page',

  state: {
    data: {
      name: 'old'
    }
  },

  actions: {
    getCheckList(arg) {
      return dispatch => {
        // const filter = objectHandler(arg, trim)
        // const filter = arg
        // dispatch(createAction(GET_PAGE_LIST)({ dd: 'new' }))
        dispatch({
          type: GET_PAGE_LIST,
          payload: {
            name: 'new'
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
    [GET_PAGE_LIST]: (state, action) => ({
      ...state,
      data: action.payload,
    })
  },

  children: [
    subModule
  ]
}
