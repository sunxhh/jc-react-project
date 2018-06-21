import { createAction } from 'redux-actions'
import { message } from 'antd'
import fetchData from 'Utils/fetch'
import apis from '../apis'
import { SHOW_LIST_SPIN, SHOW_BUTTON_SPIN } from 'Global/action'
// ===========================> Action Types <=========================== //

export const GET_ORDER_LIST = '/spa/handleCenter/GET_ORDER_LIST' // 订单列表
export const GET_SELL_USER = '/spa/handleCenter/GET_SELL_USER' // 获取销售人员
export const GET_CLASSROOM_LIST = '/spa/handleCenter/GET_CLASSROOM_LIST' // 获取班级名称
export const GET_CLASSBOOK_LIST = '/spa/handleCenter/GET_CLASSBOOK_LIST' // 获取课程名称
export const GET_ORG_LIST = '/spa/handleCenter/GET_ORG_LIST'// 获取机构列表
export const HANDLE_CENTER_LOADING = '/spa/handleCenter/HANDLE_CENTER_LOADING' // 加载动画
export const GET_STUDENT_LIST = '/spa/handleCenter/GET_STUDENT_LIST'// 获取机构列表
export const PUSH_TEXT_BOOK = '/spa/handleCenter/PUSH_TEXT_BOOK' // 更新数据
export const DEL_TEXT_BOOK = '/spa/handleCenter/DEL_TEXT_BOOK'
export const GET_ORDER_DETAIL = '/spa/handleCenter/GET_ORDER_DETAIL' // 查看详情
export const EMPTY_TEXT_BOOK = '/spa/handleCenter/EMPTY_TEXT_BOOK'
export const REMOVE_CLASS = '/spa/handleCenter/REMOVE_CLASS'
// ===========================> Actions <=========================== //
const getListType = {
  currentPage: 1,
  pageSize: 10,
  orgId: '',
  studentName: '',
  linkPhone: '',
  order: {
    orderNo: '',
    orderType: '',
    orderSalerId: '',
    orderHandleId: '',
    orderChargeType: '',
  }
}
// 获取订单列表
export const getOrderList = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.handleCenter.queryList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_ORDER_LIST)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}
// 获取销售人员和经办人
export const sellUser = arg => {
  return dispatch => {
    return fetchData(apis.handleCenter.queryUserByOrg, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_SELL_USER)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}
// 获取当前用户所属机构
export const getOrgList = arg => {
  return dispatch => {
    return fetchData(apis.handleCenter.getOrgList, {
      org: {
        orgMod: '1',
        orgName: '',
        orgLevel: '2'
      }
    }).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_ORG_LIST)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}
// 获取学生姓名

export const getStudentName = arg => {
  return dispatch => {
    return fetchData(apis.handleCenter.getStudentName, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_STUDENT_LIST)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取班级列表
export const getClassroomList = arg => dispatch => {
  return new Promise(resolve => {
    return fetchData(apis.handleCenter.queryClass, arg).then(res => {
      if (res.code === 0) {
        resolve(res.data)
      } else {
        message.error(res.errmsg)
        resolve(false)
      }
    })
  })
}

// 退班
export const backOutClassroom = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.handleCenter.refFund, arg).then(res => {
      if (res.code === 0) {
        dispatch(getOrderList(getListType))
        history.go(-1)
      } else {
        message.error(res.errmsg)
      }
    })
  }
}
// 获取课程教材
export const getClassBook = (arg, index) => {
  return dispatch => {
    return fetchData(apis.handleCenter.priceBy, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_CLASSBOOK_LIST)({ index, data: res.data }))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 根据教材获取其信息
export const getBookList = (arg) => dispatch => {
  return new Promise(resolve => {
    return fetchData(apis.handleCenter.getBookList, arg).then(res => {
      if (res.code === 0) {
        resolve(res.data)
      } else {
        message.error(res.errmsg)
        resolve(false)
      }
    })
  })
}
// 报班
export const addClassroom = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.handleCenter.add, arg).then(res => {
      if (res.code === 0) {
        dispatch(getOrderList(getListType))
        history.go(-1)
      } else {
        message.error(res.errmsg)
      }
    })
  }
}
// 转班
export const changesClassroom = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.handleCenter.changeClassroom, arg).then(res => {
      if (res.code === 0) {
        dispatch(getOrderList(getListType))
        history.go(-1)
      } else {
        message.error(res.errmsg)
      }
    })
  }
}
// 购教材
export const buyClassBook = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.handleCenter.buyBook, arg).then(res => {
      if (res.code === 0) {
        dispatch(getOrderList(getListType))
        history.go(-1)
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 退教材
export const backClassBook = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.handleCenter.refundBook, arg, ' 正在保存...').then(res => {
      if (res.code === 0) {
        dispatch(getOrderList(getListType))
        history.go(-1)
      } else {
        message.error(res.errmsg)
      }
    })
  }
}
// 获取订单详情
export const getOrderDetail = arg => {
  return dispatch => {
    return fetchData(apis.handleCenter.orderDetail, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_ORDER_DETAIL)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}
// ===========================> Reducer <=========================== //

const initialState = {
  loading: false,
  orderList: [],
  page: {
    pageNo: 1,
    pageSize: 10,
    records: 0
  },
  sellUser: [],
  orgList: [],
  orgId: '',
  orgLevel: '',
  studentList: [],
  studentListPage: {
    currentPage: 1,
    pageSize: 10,
    total: 0,
  },
  classroomPagination: {
    currentPage: 1,
    total: 0,
    pageSize: 10,
  },
  coursePriceList: [],
  getClassBook: [],
  coursePrices: [], // 学费
  textbookPrices: [], // 教材费
  orderDetail: []
}

// 将选完班级后获取的结果拆分成学费和教材费
const dealCoursePriceList = (coursePrices, textbookPrices, coursePriceList, index) => {
  coursePrices[index] = coursePriceList.filter(item => item.type === '1')
  textbookPrices[index] = coursePriceList.filter(item => item.type === '2')
  return {
    coursePrices,
    textbookPrices,
  }
}

// 增加教材处理
const dealTextBookPrices = (payload, textbookPrices) => {
  if (textbookPrices.length >= payload.index) {
    const textbookPricesArr = textbookPrices[payload.index]
    if (textbookPricesArr) {
      textbookPricesArr.push(payload.value)
      textbookPrices[payload.index] = textbookPricesArr
    }
  } else {
    textbookPrices.push([payload.value])
  }
  return textbookPrices
}

// 删除教材处理
const delTextBookPrices = (payload, textbookPrices) => {
  const textbookPricesArr = textbookPrices[payload.index]
  if (textbookPricesArr) {
    textbookPricesArr.splice(payload.key, 1)
    textbookPrices[payload.index] = textbookPricesArr
  }
  return textbookPrices
}

const removeClass = (coursePrice, index) => {
  coursePrice.splice(index, 1)
  return coursePrice
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case HANDLE_CENTER_LOADING:
      return {
        ...state,
        handleLoading: action.payload.loading,
      }
    case GET_ORDER_LIST:
      return {
        ...state,
        orderList: action.payload.result,
        coursePrices: [],
        textBookPrices: [],
        page: {
          pageNo: action.payload.page.currentPage,
          pageSize: action.payload.page.pageSize,
          records: action.payload.page.totalCount
        }}

    case GET_SELL_USER:
      return {
        ...state,
        sellUser: action.payload,
      }
    case GET_ORG_LIST:
      return {
        ...state,
        orgList: action.payload.myOrgList,
        orgId: action.payload.myOrgId,
        orgLevel: action.payload.myOrgLevel,
      }
    case GET_STUDENT_LIST:
      return {
        ...state,
        studentList: action.payload.result,
        studentListPage: {
          currentPage: action.payload.page.currentPage,
          pageSize: action.payload.page.pageSize,
          total: action.payload.page.totalCount,
          totalPage: action.payload.page.totalPage
        }}
    case GET_CLASSBOOK_LIST:
      return {
        ...state,
        ...dealCoursePriceList(JSON.parse(JSON.stringify(state.coursePrices)), JSON.parse(JSON.stringify(state.textbookPrices)), action.payload.data, action.payload.index),
      }
    case PUSH_TEXT_BOOK:
      return {
        ...state,
        textbookPrices: dealTextBookPrices(action.payload, JSON.parse(JSON.stringify(state.textbookPrices)))
      }
    case DEL_TEXT_BOOK:
      return {
        ...state,
        textbookPrices: delTextBookPrices(action.payload, JSON.parse(JSON.stringify(state.textbookPrices)))
      }
    case EMPTY_TEXT_BOOK:
      return {
        ...state,
        textbookPrices: []
      }
    case GET_ORDER_DETAIL:
      return {
        ...state,
        orderDetail: action.payload,
      }
    case REMOVE_CLASS:
      return {
        ...state,
        coursePrices: removeClass(JSON.parse(JSON.stringify(state.coursePrices)), action.payload)
      }
    default:
      return state
  }
}
