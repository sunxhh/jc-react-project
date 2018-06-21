import { message } from 'antd'
import fetchData from 'Utils/fetch'
import apis from '../apis'

import { SHOW_LIST_SPIN, SHOW_BUTTON_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //

// ===========================> Actions <=========================== //

export const getListAction = (payload) => ({
  type: 'GET_ROLE_LIST',
  payload,
})

export const switchLoadingAction = (payload) => ({
  type: 'SWITCH_LOADING',
  payload,
})

export const getTreeListAction = (payload) => ({
  type: 'GET_ROLE_TREE_LIST',
  payload,
})

export const showAddModalAction = (payload) => ({
  type: 'SWITCH_ROLE_ADD_MODAL',
  payload,
})

export const showEditModalAction = (payload) => ({
  type: 'SWITCH_ROLE_EDIT_MODAL',
  payload,
})

export const showDetailModalAction = (payload) => ({
  type: 'SWITCH_ROLE_DETAIL_MODAL',
  payload,
})

export const detailAction = (payload) => ({
  type: 'ROLE_DETAIL',
  payload,
})

export const getOrgForRole = (payload) => ({
  type: 'ORG_FOR_ADD_ROLE',
  payload,
})

export const getRoleMenuIds = (payload) => ({
  type: 'GET_ROLE_MENU_IDS',
  payload,
})

export const switchParentNodeIds = (payload) => ({
  type: 'PARENT_ROLE_NODE_IDS',
  payload,
})

export const getList = arg => {
  return dispatch => {
    dispatch(switchLoadingAction({ loading: true }))
    fetchData(apis.roleManage.list, arg).then(req => {
      dispatch(switchLoadingAction({ loading: false }))
      if (req.code === 0) {
        dispatch(getListAction({ list: req.data }))
      } else {
        dispatch(getListAction({
          list: [],
        }))
        message.error(req.errmsg)
      }
    })
  }
}

export const getTreeList = () => {
  return dispatch => {
    fetchData(apis.roleManage.menuTree, { id: '' }).then(req => {
      if (req.code === 0) {
        dispatch(getTreeListAction(req.data.menuTree))
      } else {
        dispatch(getTreeListAction([]))
        message.error(req.errmsg)
      }
    })
  }
}

export const getOrgForAddRole = () => {
  return dispatch => {
    fetchData(apis.roleManage.orgForAddRole).then(req => {
      if (req.code === 0) {
        dispatch(getOrgForRole(req.data))
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const add = (values, defaultValue, callBack) => {
  return dispatch => {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.roleManage.add, values).then(req => {
      if (req.code === 0) {
        dispatch(showAddModalAction(false))
        dispatch(getList(defaultValue))
        callBack && callBack()
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const getTreeIds = (arg) => {
  return dispatch => {
    fetchData(dispatch, SHOW_LIST_SPIN)(apis.roleManage.menuTree, arg).then(req => {
      if (req.code === 0) {
        let menuIds = []
        _loop(req.data.menuTree, menuIds)
        const orgMenuIds = _menuIds(menuIds, req.data.roleMenuIds)
        dispatch(getRoleMenuIds(orgMenuIds))
        const parentNodeIds = _parentNodeIds(req.data.roleMenuIds, orgMenuIds)
        dispatch(switchParentNodeIds(parentNodeIds))
      } else {
        dispatch(getRoleMenuIds([]))
        message.error(req.errmsg)
      }
    })
  }
}

export const edit = (values, defaultValue, callBack) => {
  return dispatch => {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.roleManage.modify, values).then(req => {
      if (req.code === 0) {
        dispatch(getList(defaultValue))
        callBack && callBack()
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const detail = (values) => {
  return dispatch => {
    fetchData(apis.roleManage.detail, values).then(req => {
      if (req.code === 0) {
        dispatch(detailAction(req.data))
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const del = (values, defaultValue) => {
  return dispatch => {
    fetchData(apis.roleManage.del, values).then(req => {
      if (req.code === 0) {
        dispatch(getList(defaultValue))
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

const _loop = (data, _ids) => {
  let ids = _ids
  return data.map((item) => {
    if (item.children && item.children.length > 0) {
      _loop(item.children, ids)
      return '-1'
    } else {
      ids.push(item['id'])
      return item['id']
    }
  })
}

const _menuIds = (allIds, orgMenuIds) => {
  let menuIds = []
  orgMenuIds.forEach((item) => {
    allIds.includes(item) && menuIds.push(item)
  })
  return menuIds
}

const _parentNodeIds = (allIds, childrenIds) => {
  let parentNodeIds = []
  allIds.forEach((item) => {
    !childrenIds.includes(item) && parentNodeIds.push(item)
  })
  return parentNodeIds
}

// ===========================> Reducer <=========================== //

const initialState = {
  list: [],
  loading: false,
  treeList: [],
  showAddModal: false,
  showEditModal: false,
  showDetailModal: false,
  okLoading: false,
  orgForRole: {},
  detail: {},
  roleMenuIds: [],
  parentNodeIds: [],
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case 'GET_ROLE_LIST':
      return {
        ...state,
        list: action.payload.list,
      }
    case 'SWITCH_LOADING':
      return {
        ...state,
        loading: action.payload.loading,
      }
    case 'GET_ROLE_TREE_LIST':
      return {
        ...state,
        treeList: action.payload,
      }
    case 'SWITCH_ROLE_ADD_MODAL':
      return {
        ...state,
        showAddModal: action.payload,
      }
    case 'SWITCH_ROLE_EDIT_MODAL':
      return {
        ...state,
        showEditModal: action.payload,
      }
    case 'ROLE_DETAIL':
      return {
        ...state,
        detail: action.payload,
      }
    case 'ORG_FOR_ADD_ROLE':
      return {
        ...state,
        orgForRole: action.payload,
      }
    case 'GET_ROLE_MENU_IDS':
      return {
        ...state,
        roleMenuIds: action.payload,
      }
    case 'SWITCH_ROLE_DETAIL_MODAL':
      return {
        ...state,
        showDetailModal: action.payload,
      }
    case 'PARENT_ROLE_NODE_IDS':
      return {
        ...state,
        parentNodeIds: action.payload,
      }
    default:
      return state
  }
}
