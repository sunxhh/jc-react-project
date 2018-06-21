import { createAction } from 'redux-actions'
import { message } from 'antd'
import fetchData from 'Utils/fetch'
import { isEmpty } from 'Utils/lang'
import apis from '../apis'
import globalApis from 'Global/apis'
import { SHOW_BUTTON_SPIN, SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //

const ORG_TREE_LIST = '/spa/baseModule/orgManage/ORG_TREE_LIST' // 组织树列表
const GET_ORG_DETAIL = '/spa/baseModule/orgManage/GET_ORG_DETAIL' // 组织树详情
export const EMPTY_CRR_TREE_ID = '/spa/baseModule/orgManage/EMPTY_CRR_TREE_ID' // 组织树详情
export const BELONG_INDUSTRY_LIST = '/spa/baseModule/orgManage/BELONG_INDUSTRY_LIST' // 所属产业列表
export const REGION_LIST = 'spa/common/REGION_LIST'
// const ADD_ORG = '/spa/baseModule/orgManage/ADD_ORG' // 添加组织树
// const ORG_MODIFY = '/spa/baseModule/orgManage/ORG_MODIFY' // 编辑组织树
// const ORG_DELETE = '/spa/baseModule/orgManage/ORG_DELETE' // 删除组织树

// ===========================> Actions <=========================== //

// 获取列表
export const getOrgTreeList = () => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.org.orgList, {
      'org': {
        'orgMod': '1',
        'orgLevel': '0'
      }
    }).then(res => {
      if (res.code === 0) {
        dispatch(createAction(ORG_TREE_LIST)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

export const getBelongIndustryList = arg => dispatch => {
  return fetchData(apis.codeList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(BELONG_INDUSTRY_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取树详情getOrgDetail
export const getOrgDetail = (arg) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      return fetchData(dispatch)(apis.org.orgDetail, arg).then(res => {
        if (res.code === 0) {
          resolve(res.data)
          dispatch(createAction(GET_ORG_DETAIL)(res.data))
        } else {
          reject()
          message.error(res.errmsg)
        }
      })
    })
  }
}

// 添加树
export const addOrg = (arg) => {
  return dispatch => {
    return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.org.orgAdd, arg).then(res => {
      if (res.code === 0) {
        dispatch(getOrgTreeList())
        return true
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 编辑树
export const orgModify = (arg) => dispatch => {
  return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.org.orgModify, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction('SWITCH_EDIT_BTN')(false))
      dispatch(getOrgTreeList())
    } else {
      message.error(res.errmsg)
    }
  })
}

// 删除树
export const orgDel = (arg, callBack) => {
  return dispatch => {
    fetchData(apis.org.orgDelete, { id: arg.id }).then(res => {
      if (res.code === 0) {
        dispatch(getOrgDetail({ id: arg.topTreeNode.orgId }))
        dispatch(createAction('CRR_TREE_ID')({
          crrTreeId: arg.topTreeNode.orgId,
          orgLevel: arg.topTreeNode.levelId,
          orgName: arg.topTreeNode.nodeName,
        }))
        dispatch(getOrgTreeList())
        callBack && callBack()
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

export const getRegionList = arg => dispatch => {
  return fetchData(dispatch)(globalApis.regionv2, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(REGION_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// ===========================> Reducer <=========================== //

const initialState = {
  topTreeNode: {
    orgId: '',
    levelId: '',
    nodeName: '',
  },
  orgList: [],
  orgDetail: {},
  parentOrgName: '',
  crrTreeId: '',
  orgLevel: '0',
  orgName: '',
  editBtn: false,
  orgListArray: [],
  belongIndustry: [],
  regionList: [],
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case ORG_TREE_LIST: {
      const orgList = action.payload
      const orgListArray = []

      function generateTreeListArray(data) { // eslint-disable-line
        data.forEach(item => {
          orgListArray.push({ key: item.id, orgName: item.orgName })
          if (!isEmpty(item.children)) {
            generateTreeListArray(item.children)
          }
        })
      }
      generateTreeListArray(orgList)

      return {
        ...state,
        orgList,
        orgListArray,
        topTreeNode: {
          orgId: action.payload[0].id,
          levelId: action.payload[0].orgLevel,
          nodeName: action.payload[0].orgName,
        }
      }
    }
    case GET_ORG_DETAIL:
      return {
        ...state,
        orgDetail: action.payload.org,
        parentOrgName: action.payload.parentOrgName
      }
    case 'CRR_TREE_ID':
      return {
        ...state,
        crrTreeId: action.payload.crrTreeId,
        orgLevel: action.payload.orgLevel,
        orgName: action.payload.orgName,
      }
    case EMPTY_CRR_TREE_ID:
      return {
        ...state,
        crrTreeId: '',
      }
    case 'SWITCH_EDIT_BTN':
      return {
        ...state,
        editBtn: action.payload,
      }
    case BELONG_INDUSTRY_LIST:
      return { ...state, belongIndustry: action.payload }

    case REGION_LIST:
      return { ...state, regionList: action.payload }
    default:
      return state
  }
}
