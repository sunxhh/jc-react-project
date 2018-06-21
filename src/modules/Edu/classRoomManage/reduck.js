import { message } from 'antd'
import fetchData from 'Utils/fetch'
import apis from '../apis'

// ===========================> Action Types <=========================== //

// ===========================> Actions <=========================== //

export const getListAction = (payload) => ({
  type: 'GET_CLASS_ROOM_LIST',
  payload,
})

export const switchLoadingAction = (payload) => ({
  type: 'SWITCH_CLASSROOM_LOADING',
  payload,
})

export const getTreeListAction = (payload) => ({
  type: 'GET_TREE_LIST',
  payload,
})

export const showAddModalAction = (payload) => ({
  type: 'SWITCH_CLASSROOM_ADD_MODAL',
  payload,
})

export const showEditModalAction = (payload) => ({
  type: 'SWITCH_CLASSROOM_EDIT_MODAL',
  payload,
})

export const detailAction = (payload) => ({
  type: 'CLASSROOM_DETAIL',
  payload,
})

export const okLoadingAction = (payload) => ({
  type: 'OK_CLASSROOM_LOADING',
  payload,
})

export const myOrgListAction = (payload) => ({
  type: 'CLASSROOM_ORG_LIST',
  payload,
})

export const setSelectedRowKeys = (payload) => ({
  type: 'SET_CLASSROOM_SELECTED_ROWKEYS',
  payload,
})

export const getList = arg => {
  return dispatch => {
    dispatch(switchLoadingAction({ loading: true }))
    fetchData(apis.classRomm.list, arg).then(req => {
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

export const queryOrg = (values) => {
  return dispatch => {
    fetchData(apis.classRomm.queryOrg, values).then(req => {
      if (req.code === 0) {
        dispatch(myOrgListAction({ orgList: req.data.myOrgList, orgId: req.data.myOrgId, orgLevel: req.data.myOrgLevel }))
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const add = (values, defaultValue, callBack) => {
  return dispatch => {
    dispatch(okLoadingAction(true))
    fetchData(apis.classRomm.add, values).then(req => {
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
    fetchData(apis.classRomm.modify, values).then(req => {
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
    fetchData(apis.classRomm.detail, values).then(req => {
      if (req.code === 0) {
        dispatch(detailAction(req.data))
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const del = (values, listArg) => {
  return dispatch => {
    fetchData(apis.classRomm.del, values).then(req => {
      if (req.code === 0) {
        dispatch(setSelectedRowKeys([]))
        dispatch(getList(listArg))
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

// ===========================> Reducer <=========================== //

const initialState = {
  list: [],
  pagination: {
    pageNo: 1,
    records: 0,
    pageSize: 10,
  },
  detail: {
    classRoomName: undefined,
    orgId: undefined,
    orgLevel: '',
    memo: undefined,
  },
  loading: false,
  showAddModal: false,
  showEditModal: false,
  okLoading: false,
  orgId: undefined,
  orgList: [],
  selectedRowKeys: [],
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case 'GET_CLASS_ROOM_LIST':
      return {
        ...state,
        list: action.payload.list,
        pagination: {
          pageNo: action.payload.pagination.currentPage,
          records: action.payload.pagination.totalCount,
          pageSize: action.payload.pagination.pageSize,
        },
      }
    case 'SWITCH_CLASSROOM_LOADING':
      return {
        ...state,
        loading: action.payload.loading,
      }
    case 'SWITCH_CLASSROOM_ADD_MODAL':
      return {
        ...state,
        showAddModal: action.payload,
      }
    case 'SWITCH_CLASSROOM_EDIT_MODAL':
      return {
        ...state,
        showEditModal: action.payload,
      }
    case 'CLASSROOM_DETAIL':
      return {
        ...state,
        detail: action.payload,
      }
    case 'OK_CLASSROOM_LOADING':
      return {
        ...state,
        okLoading: action.payload,
      }
    case 'CLASSROOM_ORG_LIST':
      return {
        ...state,
        orgList: action.payload.orgList,
        orgId: action.payload.orgId,
        orgLevel: action.payload.orgLevel,
      }
    case 'SET_CLASSROOM_SELECTED_ROWKEYS':
      return {
        ...state,
        selectedRowKeys: action.payload,
      }
    default:
      return state
  }
}
