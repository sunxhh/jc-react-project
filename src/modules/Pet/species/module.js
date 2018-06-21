import apis from '../apis'
import { message } from 'antd'
import { fetchPet as fetchData } from 'Utils/fetch'
// import { replace } from 'react-router-redux'
import { createAction } from 'redux-actions'
import { SHOW_LIST_SPIN } from 'Global/action'
// import globalApis from 'Global/apis'
// import { isEmpty } from 'Utils/lang'
// import { MEMBER_LIST } from 'Global/urls'

// ===========================> Action Types <=========================== //
// export const TREE_LIST = 'spa/Pet/species/TREE_LIST'
export const LEVEL_LIST = 'spa/Pet/species/LEVEL_LIST'
export const TREE_DETAIL = 'spa/Pet/species/TREE_DETAIL'

export default {
  namespace: 'species',

  state: {
    treeList: [],
    levelList: [],
    treeDetail: {}
  },

  actions: {
    getLevelList(arg) {
      return dispatch => {
        return fetchData(dispatch, arg.petCatgNo === '0' && SHOW_LIST_SPIN)(apis.species.levelList, arg).then(res => {
          if (res.code === 0) {
            if (arg.petCatgNo === '0') {
              dispatch(createAction(LEVEL_LIST)(res.data))
            }
            return res.data
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },
    getTreeList(arg) {
      return dispatch => {
        return fetchData(dispatch, SHOW_LIST_SPIN)(apis.species.treeList, arg).then(res => {
          if (res.code === 0) {
            return res.data
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },
    getTreeDetail(arg) {
      return dispatch => {
        return fetchData(dispatch)(apis.species.treeDetail, arg).then(res => {
          if (res.code === 0) {
            dispatch(createAction(TREE_DETAIL)(res.data))
            return res.data
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },
    modifyCate(arg) {
      return dispatch => {
        return fetchData(dispatch)(apis.species.modifyCate, arg).then(res => {
          if (res.code !== 0) {
            message.error(res.errmsg)
          } else {
            message.success('修改成功')
            return true
          }
        })
      }
    },
    addCate(arg) {
      return dispatch => {
        return fetchData(dispatch)(apis.species.addCate, arg).then(res => {
          if (res.code !== 0) {
            message.error(res.errmsg)
            return false
          } else {
            dispatch(this.getLevelList({ petCatgNo: '0' }))
            message.success('新增成功')
            return true
          }
        })
      }
    },
  },

  reducers: {
    [LEVEL_LIST]: (state, action) => ({
      ...state,
      levelList: action.payload,
    }),
    [TREE_DETAIL]: (state, action) => ({
      ...state,
      treeDetail: action.payload,
    }),
  },

  children: [
  ]
}
