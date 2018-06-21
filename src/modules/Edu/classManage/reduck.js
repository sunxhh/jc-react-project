import { message } from 'antd'
import { createAction } from 'redux-actions'
import fetchData from 'Utils/fetch'
import apis from '../apis'
import {
  SHOW_BUTTON_SPIN,
  SWITCH_LIST_LOADING,
  SHOW_LIST_SPIN,
} from '../../../global/action'

// ===========================> Action Types <=========================== //

export const CLASS_DETAIL = 'spa/classManage/CLASS_DETAIL'
export const STUDENT_INFO_LIST = 'spa/classManage/STUDENT_INFO_LIST'
export const STUDENT_SCORE_LIST = 'spa/classManage/STUDENT_SCORE_LIST'
export const RECORD_LIST = 'spa/classManage/RECORD_LIST'
export const RECORD_DETAIL = 'spa/classManage/RECORD_DETAIL'
export const STUDENT_INFO_LIST_ALL = 'spa/classManage/STUDENT_INFO_LIST_ALL'
export const CHANGE_STATUS_ALL = 'spa/classManage/CHANGE_STATUS_ALL'
export const CHANGE_VALUE_ALL = 'spa/classManage/CHANGE_VALUE_ALL'

// ===========================> Actions <=========================== //

export const getListAction = (payload) => ({
  type: 'GET_CLASS_LIST',
  payload,
})

export const switchLoadingAction = (payload) => ({
  type: 'SWITCH_CLASS_LOADING',
  payload,
})

export const showAddModalAction = (payload) => ({
  type: 'SWITCH_CLASS_ADD_MODAL',
  payload,
})

export const showEditModalAction = (payload) => ({
  type: 'SWITCH_CLASS_EDIT_MODAL',
  payload,
})

export const okLoadingAction = (payload) => ({
  type: 'OK_CLASS_LOADING',
  payload,
})

export const myOrgListAction = (payload) => ({
  type: 'CLASS_ORG_LIST',
  payload,
})

export const setSelectedRowKeys = (payload) => ({
  type: 'SET_CLASS_SELECTED_ROWKEYS',
  payload,
})

export const getClassroomListAction = (payload) => ({
  type: 'CLASS_ROOM_LIST',
  payload,
})

export const getTeacherList = (payload) => ({
  type: 'CLASS_TEACHER_LIST',
  payload,
})

export const getCourseListAction = (payload) => ({
  type: 'GET_COURSE_LIST',
  payload,
})

export const switchCourseLoadingAction = (payload) => ({
  type: 'SWITCH_CLASS_COURSE_LOADING',
  payload,
})

export const switchShowLessonModal = (payload) => ({
  type: 'SWITCH_SHOW_LESSON_MODAL',
  payload,
})

export const getCourseAndCourseId = (payload) => ({
  type: 'CLASS_COURS_NAME',
  payload,
})

export const setQueryPar = (payload) => ({
  type: 'CLASS_SET_QUERY_PAR',
  payload,
})

export const getList = arg => {
  return dispatch => {
    dispatch(switchLoadingAction({ loading: true }))
    fetchData(apis.class.list, {
      ...arg,
      classTo: {
        ...arg.classTo,
        courseStartDate: arg.classTo.courseStartDate.length > 0 ? arg.classTo.courseStartDate[0].format('YYYY-MM-DD') : '',
        courseEndDate: arg.classTo.courseStartDate.length > 0 ? arg.classTo.courseStartDate[1].format('YYYY-MM-DD') : '',
      }
    }).then(req => {
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

export const add = (values, defaultValue, callBack) => {
  return dispatch => {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.class.add, values).then(req => {
      if (req.code === 0) {
        history.go(-1)
        callBack && callBack()
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const edit = (values, defaultValue, callBack) => {
  return dispatch => {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.class.modify, values).then(req => {
      if (req.code === 0) {
        history.go(-1)
        // dispatch(showEditModalAction(false))
        // dispatch(getList(defaultValue))
        // callBack && callBack()
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const detail = (values) => {
  return dispatch => {
    return new Promise(resolve => {
      return fetchData(apis.class.detail, values).then(res => {
        if (res.code === 0) {
          dispatch(createAction(CLASS_DETAIL)(res.data))
          resolve(res)
        } else {
          message.error(res.errmsg)
          resolve(false)
        }
      })
    })
  }
}
export const del = (values, listArg) => {
  return dispatch => {
    fetchData(apis.class.del, values).then(req => {
      if (req.code === 0) {
        dispatch(setSelectedRowKeys([]))
        dispatch(getList(listArg))
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const addStudentScore = (arg) => {
  return dispatch => {
    return new Promise(resolve => {
      return fetchData(apis.class.addStudentScore, arg).then(res => {
        if (res.code === 0) {
          resolve(true)
        } else {
          message.error(res.errmsg)
          resolve(false)
        }
      })
    })
  }
}

export const queryOrg = (values) => {
  return dispatch => {
    fetchData(apis.class.queryOrg, values).then(req => {
      if (req.code === 0) {
        dispatch(myOrgListAction({ orgList: req.data.myOrgList, orgId: req.data.myOrgId, orgLevel: req.data.myOrgLevel }))
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const classroomList = (values) => {
  return dispatch => {
    fetchData(apis.class.queryClassroom, values).then(req => {
      if (req.code === 0) {
        dispatch(getClassroomListAction(req.data))
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const teacherList = (values) => {
  return dispatch => {
    fetchData(apis.class.queryTeacher, values).then(req => {
      if (req.code === 0) {
        dispatch(getTeacherList(req.data))
      } else {
        message.error(req.errmsg)
      }
    })
  }
}

export const getCourseList = arg => {
  return dispatch => {
    dispatch(switchCourseLoadingAction({ loading: true }))
    fetchData(apis.class.lessonPageList, arg).then(req => {
      if (req.code === 0) {
        dispatch(getCourseListAction({ list: req.data.result, pagination: req.data.page }))
        dispatch(switchCourseLoadingAction({ loading: false }))
      } else {
        dispatch(getCourseListAction({
          list: [],
          pagination: {},
        }))
        message.error(req.errmsg)
      }
    })
  }
}

export const getStudentInfoList = arg => dispatch => {
  return fetchData(dispatch, SHOW_LIST_SPIN)(apis.class.classStudentList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(STUDENT_INFO_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const getStudentScoreList = arg => dispatch => {
  return fetchData(dispatch, SHOW_LIST_SPIN)(apis.class.classStudentScoreList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(STUDENT_SCORE_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const deleteScore = arg => dispatch => {
  return new Promise(resolve => {
    return fetchData(apis.class.classStudentScoreDelete, arg).then(res => {
      if (res.code === 0) {
        message.error('删除成功！')
        resolve(true)
      } else {
        message.error(res.errmsg)
        resolve(false)
      }
    })
  })
}
export const editStudentScore = arg => dispatch => {
  return new Promise(resolve => {
    return fetchData(apis.class.classStudentScoreEdit, arg).then(res => {
      if (res.code === 0) {
        resolve(true)
      } else {
        message.error(res.errmsg)
        resolve(false)
      }
    })
  })
}

export const getStudentList = arg => dispatch => {
  return new Promise(resolve => {
    return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.class.classStudentAllList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(STUDENT_INFO_LIST_ALL)(res.data))
        resolve(res.data)
      } else {
        message.error(res.errmsg)
        resolve(false)
      }
    })
  })
}

export const sendMsg = arg => dispatch => {
  return new Promise(resolve => {
    return fetchData(apis.class.sendMsg, arg).then(res => {
      if (res.code === 0) {
        resolve(true)
        message.success('发送成功！')
      } else {
        message.error(res.errmsg)
        resolve(false)
      }
    })
  })
}

export const deleteRecord = arg => dispatch => {
  return new Promise(resolve => {
    return fetchData(apis.class.deleteRecord, arg).then(res => {
      if (res.code === 0) {
        resolve(true)
      } else {
        message.error(res.errmsg)
        resolve(false)
      }
    })
  })
}

export const addRecord = arg => dispatch => {
  return new Promise(resolve => {
    return fetchData(apis.class.addRecord, arg).then(res => {
      if (res.code === 0) {
        history.go(-1)
        resolve(true)
      } else {
        message.error(res.errmsg)
        resolve(false)
      }
    })
  })
}

export const editRecord = arg => dispatch => {
  return new Promise(resolve => {
    return fetchData(apis.class.editRecord, arg).then(res => {
      if (res.code === 0) {
        history.go(-1)
        resolve(true)
      } else {
        message.error(res.errmsg)
        resolve(false)
      }
    })
  })
}

export const getRecordList = arg => dispatch => {
  dispatch(createAction(SWITCH_LIST_LOADING)(true))
  return new Promise(resolve => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.class.recordList, arg).then(res => {
      dispatch(createAction(SWITCH_LIST_LOADING)(false))
      if (res.code === 0) {
        dispatch(createAction(RECORD_LIST)(res.data))
        resolve(true)
      } else {
        message.error(res.errmsg)
        resolve(false)
      }
    })
  }).catch(() => {
    dispatch(createAction(SWITCH_LIST_LOADING)(false))
  })
}

export const getRecordDetail = arg => dispatch => {
  return new Promise(resolve => {
    return fetchData(apis.class.recordDetail, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(RECORD_DETAIL)(res.data))
        resolve(true)
      } else {
        message.error(res.errmsg)
        resolve(false)
      }
    })
  }).catch(() => {
  })
}

// ===========================> Reducer <=========================== //

const initialState = {
  list: [],
  pagination: {
    pageNo: 1,
    records: 0,
    pageSize: 10,
  },
  detail: {},
  loading: false,
  showAddModal: false,
  showEditModal: false,
  okLoading: false,
  orgId: '',
  orgLevel: '',
  orgList: [],
  selectedRowKeys: [],
  classroomList: [],
  teacherList: [],
  coursePagination: {
    current: 1,
    total: 0,
    pageSize: 10,
  },
  courseLoading: false,
  courseList: [],
  showLessonModal: false,
  courseNames: [],
  courseIds: [],
  initQueryPar: {
    name: '',
    organizationId: '',
    classStatus: '0',
    courseStartDate: [],
  },
  studentInfoList: [],
  studentInfoPage: {},
  studentScoreList: [],
  studentScorePage: {},
  recordList: [],
  recordPage: {},
  recordDetail: {},
  studentInfoAllList: [],
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case 'GET_CLASS_LIST':
      return {
        ...state,
        list: action.payload.list,
        pagination: {
          pageNo: action.payload.pagination.currentPage,
          records: action.payload.pagination.totalCount,
          pageSize: action.payload.pagination.pageSize,
        },
      }
    case 'SWITCH_CLASS_LOADING':
      return {
        ...state,
        loading: action.payload.loading,
      }
    case 'SWITCH_CLASS_ADD_MODAL':
      return {
        ...state,
        showAddModal: action.payload,
      }
    case 'SWITCH_CLASS_EDIT_MODAL':
      return {
        ...state,
        showEditModal: action.payload,
      }
    case CLASS_DETAIL:
      return {
        ...state,
        detail: action.payload,
      }
    case 'OK_CLASS_LOADING':
      return {
        ...state,
        okLoading: action.payload,
      }
    case 'CLASS_ORG_LIST':
      return {
        ...state,
        orgList: action.payload.orgList,
        orgId: action.payload.orgId,
        orgLevel: action.payload.orgLevel,
      }
    case 'SET_CLASS_SELECTED_ROWKEYS':
      return {
        ...state,
        selectedRowKeys: action.payload,
      }
    case 'CLASS_ROOM_LIST':
      return {
        ...state,
        classroomList: action.payload,
      }
    case 'CLASS_TEACHER_LIST':
      return {
        ...state,
        teacherList: action.payload,
      }
    case 'GET_COURSE_LIST':
      return {
        ...state,
        courseList: action.payload.list,
        coursePagination: {
          current: action.payload.pagination.currentPage,
          total: action.payload.pagination.totalCount,
          pageSize: action.payload.pagination.pageSize,
        },
      }
    case 'SWITCH_CLASS_COURSE_LOADING':
      return {
        ...state,
        courseLoading: action.payload.loading,
      }
    case 'SWITCH_SHOW_LESSON_MODAL':
      return {
        ...state,
        showLessonModal: action.payload,
      }
    case 'CLASS_COURS_NAME':
      return {
        ...state,
        courseIds: action.payload.courseIds,
        courseNames: action.payload.courseNames,
      }
    case 'CLASS_SET_QUERY_PAR':
      return {
        ...state,
        initQueryPar: action.payload,
      }
    case STUDENT_INFO_LIST:
      return { ...state, studentInfoList: action.payload.result, studentInfoPage: action.payload.page }
    case STUDENT_SCORE_LIST:
      return { ...state, studentScoreList: action.payload.result, studentScorePage: action.payload.page }
    case RECORD_LIST:
      return { ...state, recordList: action.payload.result, recordPage: action.payload.page }
    case RECORD_DETAIL:
      return { ...state, recordDetail: action.payload, studentInfoAllList: action.payload.classStudentRecord }
    case STUDENT_INFO_LIST_ALL:
      return { ...state, studentInfoAllList: action.payload }
    case CHANGE_STATUS_ALL:
      return { ...state, studentInfoAllList: JSON.parse(JSON.stringify(state.studentInfoAllList)).map(item => {
        item.recordType = action.payload
        return item
      }) }
    case CHANGE_VALUE_ALL:
      return { ...state, studentInfoAllList: JSON.parse(JSON.stringify(state.studentInfoAllList)).map(item => {
        item.recordHour = action.payload
        return item
      }) }
    default:
      return state
  }
}
