import { message } from 'antd'
import fetchData from 'Utils/fetch'
import apis from '../apis'
import { SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //

// ===========================> Actions <=========================== //

export const getListAction = (payload) => ({
  type: 'GET_LIST',
  payload,
})

export const switchLoadingAction = (payload) => ({
  type: 'SWITCH_LOADING',
  payload,
})

export const getTreeListAction = (payload) => ({
  type: 'GET_TREE_LIST',
  payload,
})

export const showAddModalAction = (payload) => ({
  type: 'SWITCH_ADD_MODAL',
  payload,
})

export const showEditModalAction = (payload) => ({
  type: 'SWITCH_EDIT_MODAL',
  payload,
})

export const showDetailModalAction = (payload) => ({
  type: 'SWITCH_DETAIL_MODAL',
  payload,
})

export const showAddTypeModalAction = (payload) => ({
  type: 'SWITCH_ADD_TYPE_MODAL',
  payload,
})

export const showEditTypeModalAction = (payload) => ({
  type: 'SWITCH_EDIT_TYPE_MODAL',
  payload,
})

export const switchTypeNoAction = (payload) => ({
  type: 'SWITCH_TYPENO',
  payload,
})

export const detailAction = (payload) => ({
  type: 'DETAIL',
  payload,
})

export const okLoadingAction = (payload) => ({
  type: 'OK_LOADING',
  payload,
})

export const getList = arg => {
  return dispatch => {
    dispatch(switchLoadingAction({ loading: true }))
    fetchData(apis.dictionary.dictionary, arg).then(req => {
      if (req.code === 0) {
        dispatch(getListAction({ list: req.data.result, pagination: req.data.page }))
        dispatch(switchLoadingAction({ loading: false }))
      } else {
        dispatch(getListAction({
          list: [],
          pagination: {},
        }))
        message.error(req.errmsg)
      }
    })
  }
}

export const getTreeList = () => {
  return dispatch => {
    fetchData(dispatch, SHOW_LIST_SPIN)(apis.dictionary.treeData, { 'parentTypeNo': '' }).then(req => {
      if (req.code === 0) {
        dispatch(getTreeListAction(req.data))
      } else {
        dispatch(getTreeListAction([]))
        message.error(req.errmsg)
      }
    })
  }
}

export const add = (values, defaultValue, callBack) => {
  return dispatch => {
    dispatch(okLoadingAction(true))
    fetchData(apis.dictionary.add, values).then(req => {
      dispatch(okLoadingAction(false))
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

export const edit = (values, defaultValue, callBack) => {
  return dispatch => {
    dispatch(okLoadingAction(true))
    fetchData(apis.dictionary.edit, values).then(req => {
      dispatch(okLoadingAction(false))
      if (req.code === 0) {
        dispatch(showEditModalAction(false))
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
    fetchData(apis.dictionary.detail, values).then(req => {
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
    fetchData(apis.dictionary.del, values).then(req => {
      if (req.code === 0) {
        dispatch(getList(defaultValue))
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const updAvailable = (values, defaultValue) => {
  return dispatch => {
    fetchData(apis.dictionary.updAvailable, values).then(req => {
      if (req.code === 0) {
        dispatch(getList(defaultValue))
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const delType = (values) => {
  return dispatch => {
    fetchData(apis.dictionary.delType, values).then(req => {
      if (req.code === 0) {
        dispatch(getTreeList({ 'parentTypeNo': '' }))
        dispatch(switchTypeNoAction({
          typeNo: '',
          uuid: '',
          typeName: '',
        }))
        dispatch(getListAction({
          list: [],
          pagination: {},
        }))
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const addType = (values, callBack) => {
  return dispatch => {
    dispatch(okLoadingAction(true))
    fetchData(apis.dictionary.addType, values).then(req => {
      dispatch(okLoadingAction(false))
      if (req.code === 0) {
        dispatch(showAddTypeModalAction(false))
        dispatch(getTreeList({ 'parentTypeNo': '' }))
        callBack && callBack()
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const updType = (values, callBack) => {
  return dispatch => {
    dispatch(okLoadingAction(true))
    fetchData(apis.dictionary.updType, values).then(req => {
      dispatch(okLoadingAction(false))
      if (req.code === 0) {
        dispatch(showEditTypeModalAction(false))
        dispatch(getTreeList({ 'parentTypeNo': '' }))
        dispatch(switchTypeNoAction({
          typeNo: values.typeNo,
          uuid: values.uuid,
          typeName: values.typeName,
        }))
        callBack && callBack()
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

// ===========================> Reducer <=========================== //

const initialState = {
  list: [],
  typeNo: '',
  pagination: {
    current: 1,
    total: 0,
    pageSize: 20,
  },
  loading: false,
  treeList: [],
  showAddModal: false,
  showEditModal: false,
  showDetailModal: false,
  okLoading: false,
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case 'GET_LIST':
      return {
        ...state,
        list: action.payload.list,
        pagination: {
          current: action.payload.pagination.currentPage,
          total: action.payload.pagination.totalCount,
          pageSize: action.payload.pagination.pageSize,
        },
      }
    case '':
      return {
        ...state,
        loading: action.payload.loading,
      }
    case 'GET_TREE_LIST':
      return {
        ...state,
        treeList: action.payload,
      }
    case 'SWITCH_ADD_MODAL':
      return {
        ...state,
        showAddModal: action.payload,
      }
    case 'SWITCH_EDIT_MODAL':
      return {
        ...state,
        showEditModal: action.payload,
      }
    case 'SWITCH_DETAIL_MODAL':
      return {
        ...state,
        showDetailModal: action.payload,
      }
    case 'SWITCH_ADD_TYPE_MODAL':
      return {
        ...state,
        showAddTypeModal: action.payload,
      }
    case 'SWITCH_EDIT_TYPE_MODAL':
      return {
        ...state,
        showEditTypeModal: action.payload,
      }
    case 'SWITCH_TYPENO':
      return {
        ...state,
        typeNo: action.payload.typeNo,
        uuid: action.payload.uuid,
        typeName: action.payload.typeName,
      }
    case 'DETAIL':
      return {
        ...state,
        detail: action.payload,
      }
    case 'OK_LOADING':
      return {
        ...state,
        okLoading: action.payload,
      }
    default:
      return state
  }
}
