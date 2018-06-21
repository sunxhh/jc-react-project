import { createAction } from 'redux-actions'
import fetchData from 'Utils/fetch'
import { isEmpty } from 'Utils/lang'
import apis from '../apis'
import { message } from 'antd'
import { SHOW_LIST_SPIN, SHOW_BUTTON_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //

const GET_COURSE_LIST = '/spa/course/GET_COURSE_LIST' // 课程管理
const GET_COURSE_DETAIL = '/spa/course/GET_COURSE_DETAIL' // 课程详情
const RESET_COURSE_DETAIL = '/spa/course/RESET_COURSE_DETAIL' // 重置课程详情
const UPD_COURSE_IDS = '/spa/course/UPD_COURSE_IDS' // 课程列表选择 编辑/删除
const EDIT_DISABLED = '/spa/course/EDIT_DISABLED' // 编辑按钮状态
const UPD_COURSE_INFO = '/spa/course/UPD_COURSE_INFO' // 更新课程
const SET_COURSE_TYPE_LIST = 'spa/course/SET_COURSE_TYPE_LIST'// 课程类别集合
const SET_COURSE_MODE_LIST = 'spa/course/SET_COURSE_MODE_LIST'// 课程模式集合
const SET_PAY_MODEL_LIST = 'spa/course/SET_PAY_MODEL_LIST'// 收费模式集合
const SET_COURSE_UNIT_LIST = 'spa/course/SET_COURSE_UNIT_LIST'// 收费单位集合
const SET_BOOK_LIST = 'spa/course/SET_BOOK_LIST' // 教材集合
const SET_BOOK_LIST_LOADING = 'spa/course/SET_BOOK_LIST_LOADING' // 教材集合

// ===========================> Actions <=========================== //

// 更新课程选择Id
export const updateSelectedCourseIds = arg => {
  return createAction(UPD_COURSE_IDS)(arg)
}
// 编辑按钮是否可编辑状态位
export const updateDisabledFlag = arg => {
  return createAction(EDIT_DISABLED)(arg)
}

export const setCourseDetail = arg => {
  return createAction(GET_COURSE_DETAIL)(arg)
}
export const resetCourseDetail = () => {
  return createAction(RESET_COURSE_DETAIL)()
}
export const updateCourseInfo = arg => {
  return createAction(UPD_COURSE_INFO)(arg)
}
// 更新待选教材
export const setBookList = arg => {
  return createAction(SET_BOOK_LIST)(arg)
}

// 更新待选教材加载状态
export const setBookListLoading = arg => {
  return createAction(SET_BOOK_LIST_LOADING)(arg)
}

// 获取列表
export const getCourseList = arg => dispatch => {
  dispatch(updateSelectedCourseIds([]))
  return fetchData(dispatch, SHOW_LIST_SPIN)(apis.eduCourse.courseList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_COURSE_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}
// 课程删除
export const deleteList = (arg, listArg) => dispatch => {
  fetchData(apis.eduCourse.courseDelete, arg).then(res => {
    if (res.code === 0) {
      dispatch(getCourseList(listArg))
      dispatch(updateSelectedCourseIds([]))
    } else {
      message.error(res.errmsg)
    }
  })
}
// 新增课程
export const addCourse = arg => dispatch => {
  fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.eduCourse.courseAdd, arg, '正在保存...').then(res => {
    if (res.code === 0) {
      message.success('保存成功', 1, () => {
        history.go(-1)
      })
    } else {
      message.error(res.errmsg)
    }
  })
}
// 编辑课程
export const editCourse = arg => dispatch => {
  fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.eduCourse.courseModify, arg, '正在保存...').then(res => {
    if (res.code === 0) {
      dispatch(updateSelectedCourseIds([]))
      message.success('修改成功', 1, () => {
        history.go(-1)
      })
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取课程详情
export const getCourseDetail = arg => dispatch => {
  fetchData(dispatch)(apis.eduCourse.courseDetail, arg).then(res => {
    if (res.code === 0) {
      dispatch(setCourseDetail(res.data))
      dispatch(getBookList({ textbook: { courseType: res.data.courseType }}, res.data.courseTextbook)
      )
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取待选教材集合
export const getBookList = (arg, courseTextbook) => dispatch => {
  dispatch(setBookListLoading(true))
  fetchData(apis.eduCourse.bookList, arg).then(res => {
    dispatch(setBookListLoading(false))
    if (res.code === 0) {
      if (isEmpty(courseTextbook)) {
        dispatch(setBookList(res.data))
      } else {
        const textbookIds = courseTextbook.map((value) => {
          return value.textbookId
        })
        const filterData = res.data.filter((value) => {
          return textbookIds.indexOf(value.id) === -1
        })
        dispatch(setBookList(filterData))
      }
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取课程类别集合
export const getCourseTypeList = arg => dispatch => {
  const codeType = 'courseType'
  fetchData(apis.eduCourse.codeList, { codeType }).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_COURSE_TYPE_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取课程模式集合
export const getCourseModelList = arg => dispatch => {
  const codeType = 'courseModel'
  fetchData(apis.eduCourse.codeList, { codeType }).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_COURSE_MODE_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取收费模式集合
export const getPayModelList = arg => dispatch => {
  const codeType = 'payModel'
  fetchData(apis.eduCourse.codeList, { codeType }).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_PAY_MODEL_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取收费单位集合
export const getUnitList = arg => dispatch => {
  const codeType = 'unit'
  fetchData(apis.eduCourse.codeList, { codeType }).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_COURSE_UNIT_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// ===========================> Reducer <=========================== //

const initialState = {
  idList: [],
  bookList: [],
  selectedBookList: [],
  courseTypeList: [],
  courseModelList: [],
  payModelList: [],
  unitList: [],
  courseInfo: {},
  bookListLoading: false,
  editDisabled: false,
  page: {
    pageNo: 1,
    pageSize: 20,
    records: 0,
  }
}
export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_COURSE_LIST:
      return {
        ...state, courseList: action.payload.result, page: {
          pageNo: action.payload.page.currentPage,
          pageSize: action.payload.page.pageSize,
          records: action.payload.page.totalCount
        }
      }
    case GET_COURSE_DETAIL:
      return { ...state, courseInfo: action.payload }
    case RESET_COURSE_DETAIL:
      return initialState
    case UPD_COURSE_INFO:
      const newCourseInfo = { ...state.courseInfo, ...action.payload }
      return { ...state, courseInfo: newCourseInfo }
    case UPD_COURSE_IDS:
      return {
        ...state,
        idList: action.payload
      }
    case EDIT_DISABLED:
      return { ...state, editDisabled: action.payload }
    case SET_COURSE_TYPE_LIST:
      return { ...state, courseTypeList: action.payload }
    case SET_COURSE_MODE_LIST:
      return { ...state, courseModelList: action.payload }
    case SET_PAY_MODEL_LIST:
      return { ...state, payModelList: action.payload }
    case SET_COURSE_UNIT_LIST:
      return { ...state, unitList: action.payload }
    case SET_BOOK_LIST:
      return { ...state, bookList: action.payload }
    case SET_BOOK_LIST_LOADING:
      return { ...state, bookListLoading: action.payload }
    default:
      return state
  }
}

