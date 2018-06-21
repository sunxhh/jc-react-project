import { message } from 'antd'
import { createAction } from 'redux-actions'
import fetchData from '../../../utils/fetch'
import apis from '../apis'
import * as urls from 'Global/urls'
import { SHOW_BUTTON_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //
const GET_STUDENT_LIST = '/spa/studentManage/GET_STUDENT_LIST'
// const GET_ORG_GREAD = '/spa/channelSet/GET_ORG_GREAD'
const GET_ORG_LIST = '/spa/studentManage/GET_ORG_LIST' // 机构列表
export const SET_STUDENT_ROWKEYS = '/spa/studentManage/SET_STUDENT_ROWKEYS'
const GET_STUDENT_DETAIL = '/spa/studentManage/GET_STUDENT_DETAIL' // 学员详情
const GET_CHANNEL_LISTALL = '/spa/studentManage/GET_CHANNEL_LISTALL' // 查询所有渠道
const GET_STUDENT_LINKTYPE = '/spa/studentManage/GET_STUDENT_LINKTYPE' // 学员联系人类型
const GET_STUDENT_LEVEL = '/spa/studentManage/GET_STUDENT_TYPE' // 学员类型
const GET_STUDENT_TYPE = '/spa/studentManage/GET_STUDENT_LEVEL' // 学员意向等级
const GET_STUDENT_COURSETYPE = '/spa/studentManage/GET_STUDENT_COURSETYPE' // 意向课程类别
const GET_TOUCH_TYPE = '/spa/studentManage/GET_TOUCH_TYPE' // 沟通类型
const GET_SALENAME_LIST = 'spa/studentManage/GET_SALENAME_LIST' // 机构人员
const GET_COURSE_LIST = '/spa/channelSet/GET_COURSE_LIST' // 课程列表
const EDIT_STUDENT_LIST = '/spa/channelSet/EDIT_STUDENT_LIST' // 学员编辑
const GET_STUDENT_IDS = '/spa/channelSet/GET_STUDENT_IDS' // 删除学员
export const SET_CHANNEL_ROWKEYS = '/spa/channelSet/SET_CHANNEL_ROWKEYS'
const GET_CHANNEL_LIST = '/spa/channelSet/GET_CHANNEL_LIST' // 渠道列表
const GET_CHANNEL_TYPE = '/spa/channelSet/GET_CHANNEL_TYPE' // 渠道列表
// ===========================> Actions <=========================== //
// 获取学员列表
export const getList = arg => {
  return dispatch => {
    fetchData(dispatch)(apis.studentManage.studentCenter, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_STUDENT_LIST)({
          list: res.data.result,
          pagination: {
            current: res.data.page.currentPage,
            total: res.data.page.totalCount,
            pageSize: res.data.page.pageSize,
          }
        }))
      } else {
        dispatch(createAction(GET_STUDENT_LIST)({
          list: [],
          pagination: {},
        }))
        message.error(res.errmsg)
      }
    })
  }
}

// 获取机构等级
export const queryOrg = (values) => {
  return dispatch => {
    fetchData(apis.studentManage.queryOrg, values).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_ORG_LIST)({
          orgList: res.data.myOrgList,
          orgId: res.data.myOrgId,
          orgLevel: res.data.myOrgLevel,
          orgName: res.data.myOrgName,
        }))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 查询所有渠道
export const channelListAll = (arg) => {
  return dispatch => {
    fetchData(apis.studentManage.channelListAll, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_CHANNEL_LISTALL)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 学员新增
export const Add = arg => {
  return dispatch => {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.studentManage.studentAdd, arg).then(res => {
      if (res.code === 0) {
        message.success('新增成功')
        location.href = urls.EDU_STUDENT_MANAGE
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 学员编辑
export const editStudentList = arg => {
  return dispatch => {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.studentManage.StudentEdit, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_STUDENT_IDS)([]))
        message.success('修改成功')
        history.go(-1)
        // location.href = urls.EDU_STUDENT_MANAGE
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 学员明细
export const getStudentDetail = (values) => {
  return dispatch => {
    return new Promise(resolve => {
      return fetchData(dispatch)(apis.studentManage.detail, values).then(res => {
        if (res.code === 0) {
          dispatch(createAction(GET_STUDENT_DETAIL)(res.data))
          resolve(res.data)
        } else {
          message.error(res.errmsg)
          resolve(false)
        }
      })
    })
  }
}

// 删除学员
export const del = (values, arg) => {
  return dispatch => {
    fetchData(apis.studentManage.delete, values).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_STUDENT_IDS)([]))
        dispatch(getList(arg))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取学员联系人类型
export const getStudentLinkType = arg => {
  return dispatch => {
    fetchData(apis.studentManage.stuLinkType, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_STUDENT_LINKTYPE)(res.data))
      } else {
        message.error((res.errmsg))
      }
    })
  }
}

// 获取学员类型
export const getStudentType = arg => {
  return dispatch => {
    fetchData(apis.studentManage.stuLinkType, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_STUDENT_TYPE)(res.data))
      } else {
        message.error((res.errmsg))
      }
    })
  }
}

// 获取学员意向等级
export const getStudentTlevel = arg => {
  return dispatch => {
    fetchData(apis.studentManage.stuLinkType, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_STUDENT_LEVEL)(res.data))
      } else {
        message.error((res.errmsg))
      }
    })
  }
}

// 获取学员意向课程
export const getCourseType = arg => {
  return dispatch => {
    fetchData(apis.studentManage.stuLinkType, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_STUDENT_COURSETYPE)(res.data))
      } else {
        message.error((res.errmsg))
      }
    })
  }
}

// 获取沟通类型
export const getTouchType = arg => {
  return dispatch => {
    fetchData(apis.studentManage.stuLinkType, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_TOUCH_TYPE)(res.data))
      } else {
        message.error((res.errmsg))
      }
    })
  }
}

// 添加沟通
export const addTouch = arg => {
  return dispatch => {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.studentManage.touchAdd, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_STUDENT_IDS)([]))
        message.success('添加成功')
        location.href = urls.EDU_STUDENT_MANAGE
      }
    })
  }
}

// 编辑沟通
export const editTouch = arg => {
  return dispatch => {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.studentManage.touchEdith, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_STUDENT_IDS)([]))
        message.success('修改成功')
        location.href = urls.EDU_STUDENT_MANAGE
      }
    })
  }
}

// 短信通知
export const msgNotice = arg => {
  return dispatch => {
    fetchData(apis.studentManage.msgNotice, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_STUDENT_IDS)([]))
        message.success('发送成功')
      }
    })
  }
}

// 获取当前机构人员
export const saleName = () => {
  return dispatch => {
    fetchData(apis.studentManage.queryAllUser).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_SALENAME_LIST)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 课程列表
export const getCourseList = arg => {
  return dispatch => {
    fetchData(dispatch)(apis.studentManage.courseList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_COURSE_LIST)({ list: res.data.result, pagination: res.data.page }))
      } else {
        dispatch(createAction(GET_COURSE_LIST)({
          list: [],
          pagination: {},
        }))
        message.error(res.errmsg)
      }
    })
  }
}

// 渠道列表
export const getChannelList = arg => {
  return dispatch => {
    fetchData(dispatch)(apis.studentManage.channelList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_CHANNEL_LIST)({ channelList: res.data.result, pagination: res.data.page }))
      } else {
        dispatch(createAction(GET_STUDENT_LIST)({
          channelList: [],
          pagination: {},
        }))
        message.error(res.errmsg)
      }
    })
  }
}

// 获取渠道类别
export const getChannelType = arg => {
  return dispatch => {
    fetchData(apis.studentManage.stuLinkType, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_CHANNEL_TYPE)(res.data))
      } else {
        message.error((res.errmsg))
      }
    })
  }
}

// 新增渠道
export const addChannel = (arg) => {
  return dispatch => {
    return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.studentManage.channelAdd, arg).then(res => {
      if (res.code === 0) {
        message.success('新增成功')
        dispatch(getChannelList({ currentPage: 1, pageSize: 20, studentChannel: {}}))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 编辑渠道
export const editCheannelList = arg => {
  return dispatch => {
    return new Promise(resolve => {
      return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.studentManage.channelEdit, arg).then(res => {
        if (res.code === 0) {
          dispatch(createAction(SET_CHANNEL_ROWKEYS)([]))
          message.success('编辑成功')
          resolve(true)
        } else {
          message.error(res.errmsg)
          resolve(false)
        }
      })
    })
  }
}

// 删除渠道
export const delChannelList = (values, arg) => {
  return dispatch => {
    fetchData(apis.studentManage.channelDel, values).then(res => {
      if (res.code === 0) {
        dispatch(getChannelList({ currentPage: 1, pageSize: 20, studentChannel: {}}))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}
// ===========================> Reducer <=========================== //
const initialState = {
  studentlist: [],
  orgList: [],
  orgId: '',
  orgLevel: '',
  orgName: '',
  pagination: {
    pageNo: 1,
    records: 0,
    pageSize: 10,
  },
  channelListpagination: {
    pageNo: 1,
    records: 0,
    pageSize: 10,
  },
  courseListpagination: {
    current: 1,
    total: 0,
    pageSize: 10,
  },
  loading: false,
  idList: [],
  idListData: [],
  studentDetail: {},
  courselist: [],
  editStudent: {},
  channelList: [],
  channelListAll: [],
  channelId: [],
  getStudentLinkType: [],
  getStudentType: [],
  getCourseType: [],
  getTouchType: [],
  getStudentlevel: [],
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_STUDENT_LIST:
      return {
        ...state,
        studentlist: action.payload.list,
        pagination: {
          pageNo: action.payload.pagination.current,
          records: action.payload.pagination.total,
          pageSize: action.payload.pagination.pageSize,
        },
        selectedRowKeys: [],
      }
    case SET_STUDENT_ROWKEYS:
      return {
        ...state,
        idList: action.payload.ids,
        idListData: action.payload.idsData,
      }
    case GET_ORG_LIST:
      return {
        ...state,
        orgList: action.payload.orgList,
        orgId: action.payload.orgId,
        orgLevel: action.payload.orgLevel,
        orgName: action.payload.orgName,
      }
    case GET_STUDENT_DETAIL:
      return {
        ...state,
        studentDetail: action.payload,
      }
    case GET_SALENAME_LIST:
      return {
        ...state,
        queryAllUser: action.payload,
      }
    case GET_COURSE_LIST:
      return {
        ...state,
        courseList: action.payload.list,
        courseListpagination: {
          current: action.payload.pagination.currentPage,
          total: action.payload.pagination.totalCount,
          pageSize: action.payload.pagination.pageSize,
        },
      }
    case EDIT_STUDENT_LIST:
      return {
        ...state,
        editStudent: action.payload,
      }
    case GET_STUDENT_LINKTYPE:
      return {
        ...state,
        getStudentLinkType: action.payload,
      }
    case GET_STUDENT_TYPE:
      return {
        ...state,
        getStudentType: action.payload,
      }
    case GET_STUDENT_LEVEL:
      return {
        ...state,
        getStudentlevel: action.payload,
      }
    case GET_STUDENT_COURSETYPE:
      return {
        ...state,
        getCourseType: action.payload,
      }
    case GET_TOUCH_TYPE:
      return {
        ...state,
        getTouchType: action.payload,
      }
    case GET_CHANNEL_LISTALL:
      return {
        ...state,
        channelListAll: action.payload,
      }
    case GET_CHANNEL_LIST:
      return {
        ...state,
        channelList: action.payload.channelList,
        channelListpagination: {
          pageNo: action.payload.pagination.currentPage,
          records: action.payload.pagination.totalCount,
          pageSize: action.payload.pagination.pageSize,
        },
      }
    case SET_CHANNEL_ROWKEYS:
      return {
        ...state,
        channelId: action.payload,
      }
    case GET_CHANNEL_TYPE:
      return {
        ...state,
        channelType: action.payload,
      }
    default:
      return state
  }
}

