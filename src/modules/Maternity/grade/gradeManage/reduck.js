import { message } from 'antd'
import { fetchMaternity as fetchData } from 'Utils/fetch'
import apis from '../../apis.js'
import { SHOW_LIST_SPIN, SHOW_BUTTON_SPIN } from '../../../../global/action'
import { createAction } from 'redux-actions'

// ===========================> Action Types <=========================== //

export const MEMBER_GREAD_ORG = '/spa/maternityHotels/grade/MEMBER_GREAD_ORG' // 月子中心/会员管理/会员等级列表
export const MEMBER_GRADE = '/spa/maternityHotels/grade/MEMBER_GRADE' // 月子中心/会员管理/会员等级列表

// ===========================> Actions <=========================== //

// 新增 校验会员名称
export const getCheckRankName = args => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      return fetchData(apis.memberGrade.getCheckRankName, args).then(res => {
        if (res.code === 0) {
          resolve(res)
        } else {
          reject()
        }
      })
    })
  }
}

// 会员等级 下拉框
export const memberGread = args => {
  return dispatch => {
    return fetchData(apis.memberGrade.memberGradeOrg, args).then(res => {
      if (res.code === 0) {
        dispatch(createAction(MEMBER_GREAD_ORG)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 会员等级 列表页
export const getMemberGradeList = args => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.memberGrade.getMemberGradeList, args).then(res => {
      if (res.code === 0) {
        dispatch(createAction(MEMBER_GRADE)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 删除 会员等级
export const deleteMemberGrade = args => {
  return dispatch => {
    return fetchData(apis.memberGrade.deleteMemberGrade, args).then(res => {
      if (res.code === 0) {
        dispatch(getMemberGradeList({ currentPage: args.currentPage, pageSize: args.pageSize }))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 新增会员等级
export const addMemberGrade = (args, initReq) => {
  return dispatch => {
    return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.memberGrade.addMemberGrade, args).then(res => {
      if (res.code === 0) {
        dispatch(getMemberGradeList(initReq))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 编辑 会员等级
export const modifyMemberGrade = (values, id, args) => {
  return dispatch => {
    return new Promise(resolve => {
      return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.memberGrade.modifyMemberGrade, { ...values, ...id }).then(res => {
        if (res.code === 0) {
          dispatch(getMemberGradeList(args))
          resolve(true)
        } else {
          message.error(res.errmsg)
          resolve(false)
        }
      })
    })
  }
}

// ===========================> Reducer <=========================== //

const initialState = {
  gradeManageList: [],
  memberGrade: { result: [], page: {}},
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case MEMBER_GREAD_ORG:
      return { ...state, gradeManageList: action.payload }
    case MEMBER_GRADE:
      return { ...state, memberGrade: action.payload }
    default:
      return state
  }
}
