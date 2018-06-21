import { createAction } from 'redux-actions'
import { message } from 'antd'
import fetchData from 'Utils/fetch'
import { isEmpty } from 'Utils/lang'
import apis from '../apis'

import { SHOW_LIST_SPIN, SHOW_BUTTON_SPIN } from '../../../global/action'

// ===========================> Action Types <=========================== //

const GET_TREE_LIST = '/spa/baseModule/menuManage/GET_TREE_LIST' // 菜单树
const GET_TREE_DETAIL = '/spa/baseModule/menuManage/GET_TREE_DETAIL' // 菜单详情
const ADD_MENU = '/spa/baseModule/menuManage/ADD_MENU' // 菜单新增
const MENU_MODIFY = '/spa/baseModule/menuManage/MENU_MODIFY' // 菜单编辑
const MENU_DELETE = '/spa/baseModule/menuManage/MENU_DELETE' // 菜单删除

// ===========================> Actions <=========================== //

// 获取树
export const getTreeList = () => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.menu.menuList, {
      'menu': {
        'menuMod': '1',
        'menuLevel': '0'
      }
    }).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_TREE_LIST)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取树详情
export const getTreeDetail = (arg) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      return fetchData(apis.menu.menuDetail, arg).then(res => {
        if (res.code === 0) {
          // dispatch(createAction(GET_TREE_DETAIL)(res.data))
          // return res.data
          resolve(res.data)
        } else {
          message.error(res.errmsg)
          reject()
        }
      })
    })
  }
}

// 添加树
export const addMenu = (arg) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.menu.menuAdd, arg).then(res => {
        if (res.code === 0) {
          dispatch(createAction(ADD_MENU)(res.data))
          dispatch(getTreeList())
          resolve(res.data)
        } else {
          message.error(res.errmsg)
          reject()
        }
      })
    })
  }
}

// 编辑树
export const menuModify = (arg) => {
  return dispatch => {
    return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.menu.menuModify, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(MENU_MODIFY)(res.data))
        dispatch(getTreeList())
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 删除树
export const menuDel = (arg, callBack) => {
  return dispatch => {
    return fetchData(apis.menu.menuDelete, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(MENU_DELETE)(res.data))
        dispatch(getTreeList())
        callBack && callBack()
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// ===========================> Reducer <=========================== //

const initialState = {
  treeList: [],
  treeListArray: [],
  treeDetail: {},
  parentMenuName: '',
  menuLevelId: '',
  menuPid: '',
  treeId: ''
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_TREE_LIST: {
      const treeList = action.payload
      const treeListArray = []

      function generateTreeListArray(data) { // eslint-disable-line
        data.forEach(item => {
          treeListArray.push({ key: item.id, menuName: item.menuName })
          if (!isEmpty(item.children)) {
            generateTreeListArray(item.children)
          }
        })
      }
      generateTreeListArray(treeList)

      return {
        ...state,
        treeList,
        treeListArray,
        menuLevelId: action.payload[0].id,
        menuPid: action.payload[0].menuPid
      }
    }
    case GET_TREE_DETAIL:
      return {
        ...state,
        treeDetail: action.payload.menu,
        parentMenuName: action.payload.parentMenuName
      }
    case 'GET_TREE_ID':
      return {
        ...state,
        treeId: action.payload.treeId
      }
    default:
      return state
  }
}
