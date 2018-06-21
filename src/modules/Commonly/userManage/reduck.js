import { createAction } from 'redux-actions'
import { message } from 'antd'
import fetchData from 'Utils/fetch'
import { isEmpty } from 'Utils/lang'
import apis from '../apis'

import { SHOW_LIST_SPIN, SHOW_BUTTON_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //

const GET_USER_LIST = '/spa/user/GET_USER_LIST' // 用户管理
const GET_USER_DETAIL = '/spa/user/GET_USER_DETAIL' // 用户详情
const RESET_USER_DETAIL = '/spa/user/RESET_USER_DETAIL' // 重置用户详情
const UPD_USER_IDS = '/spa/user/UPD_USER_IDS' // 用户列表选择 编辑/删除
const SET_QINIU_TOKEN = 'spa/user/SET_QINIU_TOKEN' // 七牛token
const SET_ROLE_LIST = 'spa/user/SET_ROLE_LIST'// 角色集合
const SET_ORG_LIST = 'spa/user/SET_ORG_LIST' // 机构集合
const SET_POS_LIST = 'spa/user/SET_POS_LIST' // 岗位集合
const SET_SELECT_FETCH_FLAG = 'spa/user/SET_SELECT_FETCH_FLAG' // 岗位集合
const UPD_USER_INFO = '/spa/user/UPD_USER_INFO' // 更新用户

// ===========================> Actions <=========================== //

// 更新用户选择Id
export const updateSelectedUserIds = arg => {
  return createAction(UPD_USER_IDS)(arg)
}

// 下拉模糊搜索标志位
export const updateSelectFetchingFlag = arg => {
  return createAction(SET_SELECT_FETCH_FLAG)(arg)
}

export const setUserDetail = arg => {
  return createAction(GET_USER_DETAIL)(arg)
}

export const resetUserDetail = () => {
  return createAction(RESET_USER_DETAIL)()
}

export const updateUserInfo = arg => {
  return createAction(UPD_USER_INFO)(arg)
}

// 获取列表
export const getUserList = arg => dispatch => {
  dispatch(updateSelectedUserIds([]))
  return fetchData(dispatch, SHOW_LIST_SPIN)(apis.baseUser.queryUser, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_USER_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 用户删除
export const deleteList = (arg, listArg) => dispatch => {
  fetchData(apis.baseUser.delUser, arg).then(res => {
    if (res.code === 0) {
      dispatch(getUserList(listArg))
      dispatch(updateSelectedUserIds([]))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 新增用户
export const addUser = arg => dispatch => {
  fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.baseUser.addUser, arg, '正在保存数据....').then(res => {
    if (res.code === 0) {
      message.success('保存成功', 1, () => {
        history.go(-1)
      })
    } else {
      message.error(res.errmsg)
    }
  })
}

// 编辑用户
export const editUser = arg => dispatch => {
  fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.baseUser.modifyUser, arg).then(res => {
    if (res.code === 0) {
      dispatch(updateSelectedUserIds([]))
      message.success('修改成功', 1, () => {
        history.go(-1)
      })
    } else {
      message.error(res.errmsg)
    }
  })
}

/**
 * 获取用户详情
 * 所属机构联动角色
 * 编辑页面 初始页面的角色信息根据用户所属机构获取
 * @param arg
 */
export const getUserDetail = arg => dispatch => {
  fetchData(dispatch)(apis.baseUser.searchUserById, arg).then(res => {
    if (res.code === 0) {
      dispatch(setUserDetail(res.data))
      dispatch(getOrgList({}, res.data.organizationId))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取七牛token
export const getQiniuToken = key => {
  return dispatch => {
    fetchData(apis.qiniuToken, { key }).then(res => {
      if (res.code === 0) {
        dispatch(createAction(SET_QINIU_TOKEN)(res.data.token))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 根据机构Id获取角色信息
export const getRoleList = (arg) => dispatch => {
  fetchData(apis.baseUser.roleList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_ROLE_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

/**
 * 获取机构 新增、编辑所传参数不同
 * @param arg
 * @param userOrgId 修改页面 当前用户的orgId
 */
export const getOrgList = (arg, userOrgId) => dispatch => {
  const param = { org: { ...arg, orgMod: 1 }}
  dispatch(updateSelectFetchingFlag(true))
  fetchData(apis.baseUser.orgList, param).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_ORG_LIST)(res.data.myOrgList))
      if (!isEmpty(userOrgId)) {
        // dispatch(getRoleList({ roleOrgId: userOrgId }))
      } else {
        // dispatch(getRoleList({ roleOrgId: res.data.myOrgId }))
        dispatch(updateUserInfo({ organizationId: res.data.myOrgId }))
      }
      dispatch(updateSelectFetchingFlag(false))
    } else {
      message.error(res.errmsg)
      dispatch(updateSelectFetchingFlag(false))
    }
  })
}

// 获取岗位集合
export const getPosList = arg => dispatch => {
  const codeType = 'post'
  fetchData(apis.baseUser.codeList, { codeType }).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_POS_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const getInnerUserInfo = (arg) => {
  return new Promise(function (resolve, reject) {
    fetchData(apis.baseUser.innerUserInfo, arg).then(res => {
      if (res.code === 0) {
        if (res.data.data.length > 0) {
          const data = res.data.data[0]
          resolve({
            fullName: data.name,
            sex: data.sex.toString(),
            telPhone: data.mobile
          })
        } else {
          reject({ error: true, code: res.code })
        }
      } else {
        reject({ error: true, code: res.code })
        message.error(res.errmsg)
      }
    })
  })
}

// 获取当前唯一的外部员工工号
export const getOuterUserNum = (arg) => {
  return new Promise(function (resolve, reject) {
    fetchData(apis.baseUser.outerUserNum, arg).then(res => {
      if (res.code === 0) {
        resolve({ number: res.data })
      } else {
        reject({ error: true })
        message.error(res.errmsg)
      }
    })
  })
}

// ===========================> Reducer <=========================== //

const initialState = {
  uuids: [],
  userInfo: { userPwd: '000000' },
  roleList: [],
  orgList: [],
  posList: [],
  selectFetchingFlag: false,
  page: {
    pageNo: 1,
    pageSize: 20,
    records: 0,
  }
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_USER_LIST:
      return {
        ...state, userList: action.payload.result, page: {
          pageNo: action.payload.page.currentPage,
          pageSize: action.payload.page.pageSize,
          records: action.payload.page.totalCount
        }
      }
    case GET_USER_DETAIL:
      return { ...state, userInfo: action.payload }
    case RESET_USER_DETAIL:
      return initialState
    case UPD_USER_INFO:
      const newUserInfo = { ...state.userInfo, ...action.payload }
      return { ...state, userInfo: newUserInfo }
    case UPD_USER_IDS:
      return {
        ...state,
        uuids: action.payload
      }
    case SET_QINIU_TOKEN:
      return { ...state, qiniuToken: action.payload }
    case SET_ORG_LIST:
      return { ...state, orgList: action.payload }
    case SET_ROLE_LIST:
      return { ...state, roleList: action.payload }
    case SET_POS_LIST:
      return { ...state, posList: action.payload }
    case SET_SELECT_FETCH_FLAG:
      return { ...state, selectFetchingFlag: action.payload }
    default:
      return state
  }
}
