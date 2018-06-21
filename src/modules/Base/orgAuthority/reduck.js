import { message } from 'antd'
import fetchData from 'Utils/fetch'
import apis from '../apis'
import { SHOW_LIST_SPIN, SHOW_BUTTON_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //

// ===========================> Actions <=========================== //

export const getListAction = (payload) => ({
  type: 'GET_LEFT_LIST',
  payload,
})

export const switchLoadingAction = (payload) => ({
  type: 'SWITCH_LOADING',
  payload,
})

export const getTreeListAction = (payload) => ({
  type: 'GET_ORG_TREE',
  payload,
})

export const setOrgMenuIds = (payload) => ({
  type: 'SET_ORG_MENU_IDS',
  payload,
})

export const setChooseOrgId = (payload) => ({
  type: 'SET_CHOOSE_ORG_ID',
  payload,
})

export const switchParentNodeIds = (payload) => ({
  type: 'PARENT_NODE_IDS',
  payload,
})

export const getList = arg => {
  return dispatch => {
    dispatch(switchLoadingAction({ loading: true }))
    fetchData(apis.orgAuthority.list, arg).then(req => {
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

export const getTreeList = (arg) => {
  return dispatch => {
    fetchData(dispatch, SHOW_LIST_SPIN)(apis.orgAuthority.menuTree, arg).then(req => {
      if (req.code === 0) {
        let menuIds = []
        _loop(req.data.menuTree, menuIds)
        const orgMenuIds = _menuIds(menuIds, req.data.orgMenuIds)
        const parentNodeIds = _parentNodeIds(req.data.orgMenuIds, orgMenuIds)
        dispatch(switchParentNodeIds(parentNodeIds))
        dispatch(getTreeListAction({
          treeList: req.data.menuTree,
          orgMenuIds: orgMenuIds,
        }))
      } else {
        dispatch(getTreeListAction([]))
        message.error(req.errmsg)
      }
    })
  }
}

export const save = (values) => {
  return dispatch => {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.orgAuthority.save, values).then(req => {
      if (req.code === 0) {
        message.success('保存成功')
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
  chooseOrgId: '',
  loading: false,
  treeList: [],
  orgMenuIds: [],
  parentNodeIds: [],
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case 'GET_LEFT_LIST':
      return {
        ...state,
        list: action.payload.list,
      }
    case 'SWITCH_LOADING':
      return {
        ...state,
        loading: action.payload.loading,
      }
    case 'GET_ORG_TREE':
      return {
        ...state,
        treeList: action.payload.treeList,
        orgMenuIds: action.payload.orgMenuIds,
      }
    case 'SET_ORG_MENU_IDS':
      return {
        ...state,
        orgMenuIds: action.payload,
      }
    case 'SET_CHOOSE_ORG_ID':
      return {
        ...state,
        chooseOrgId: action.payload,
      }
    case 'PARENT_NODE_IDS':
      return {
        ...state,
        parentNodeIds: action.payload,
      }
    default:
      return state
  }
}
