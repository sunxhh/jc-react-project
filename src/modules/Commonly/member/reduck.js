import { createAction } from 'redux-actions'
import { fetchMember as fetchData } from 'Utils/fetch'
import apis from '../apis'
import { message } from 'antd'
import { SHOW_BUTTON_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //

const GET_MEMBER_LIST = '/spa/member/GET_MEMBER_LIST' // 会员管理
const GET_MEMBER_DETAIL = '/spa/member/GET_MEMBER_DETAIL' // 会员管理 / 明细详情
const GET_MEMBER_INFO = '/spa/member/GET_MEMBER_INFO' // 会员管理 / 根据电话号码做查询
const GET_ORG_LIST = '/spa/member/GET_ORG_LIST' // 会员管理 / ORG
export const UPD_MEMBER_IDS = '/spa/member/UPD_MEMBER_IDS' // 会员管理 / 删除列表
const ADD_MEMBER = '/spa/member/ADD_MEMBER' // 会员管理 / 新增

// ===========================> Actions <=========================== //

// 获取列表
export const getMemberList = arg => dispatch => {
  dispatch(createAction('IS_LOADING')(true))
  return fetchData(apis.member.memberList, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_MEMBER_LIST)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
    .then(res => {
      dispatch(createAction('IS_LOADING')(false))
      return res
    })
}

// 会员详情
export const getMemberDetail = arg => dispatch => {
  fetchData(apis.member.memberDetail, arg).then(res => {
    if (res.code === 0) {
      const cardList = res.data.cardList
      const memberDetail = {
        phoneNumber: res.data.phoneNumber,
        memberId: res.data.memberId,
        name: res.data.name,
        isMember: res.data.isMember,
        sex: res.data.sex,
        birthDate: res.data.birthDate,
        identificationNo: res.data.identificationNo,
        address: res.data.address,
        remark: res.data.remark,
        titleCode: res.data.titleCode,
      }
      dispatch(
        createAction(GET_MEMBER_DETAIL)({
          memberDetail: memberDetail,
          cardList: cardList
        })
      )
      dispatch(createAction('ACTIVE_KEY')(cardList[0] && cardList[0].shopId))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const saveMemberInfo = data => dispatch => {
  dispatch(createAction(GET_MEMBER_INFO)(data))
}

// 会员删除
export const deleteList = (arg, listArg) => dispatch => {
  fetchData(apis.member.memberDel, arg).then(res => {
    if (res.code === 0) {
      dispatch(getMemberList(listArg))
      dispatch(createAction(UPD_MEMBER_IDS)([]))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 根据手机号码获取会员数据
export const phoneNumberSearch = arg => dispatch => {
  fetchData(apis.member.phoneNumberSearch, arg).then(res => {
    if (res.code === 0) {
      dispatch(saveMemberInfo(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取会籍
export const getOrgList = arg => dispatch => {
  fetchData(apis.member.orgList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_ORG_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 新增会员
export const addMember = arg => dispatch => {
  fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.member.add, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(ADD_MEMBER)(res.data))
      history.go(-1)
    } else {
      message.error(res.errmsg)
    }
  })
}

// 编辑会员
export const editMember = arg => dispatch => {
  fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.member.modify, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(UPD_MEMBER_IDS)([]))
      dispatch(createAction('DEAL_PANES')([]))
      history.go(-1)
    } else {
      message.error(res.errmsg)
    }
  })
}

// ===========================> Reducer <=========================== //

const initialState = {
  memberList: [],
  page: {
    current: 1,
    pageSize: 20,
    total: 0
  },
  memberDetail: {},
  cardList: [],
  memberInfo: {},
  orgList: [],
  memberIds: [],
  isLoading: false,
  editDisabled: false,
  shopName: '',
  shopId: '',
  activeKey: '',
  panes: [],
  dealPanes: []
}

export const reducer = function(state = initialState, action) {
  switch (action.type) {
    case GET_MEMBER_LIST:
      return {
        ...state,
        memberList: action.payload.result,
        page: {
          current: action.payload.page.currentPage,
          pageSize: action.payload.page.pageSize,
          total: action.payload.page.totalCount
        }
      }
    case GET_MEMBER_DETAIL:
      return { ...state, cardList: action.payload.cardList, memberDetail: action.payload.memberDetail }
    case GET_MEMBER_INFO:
      return { ...state, memberInfo: action.payload }
    case GET_ORG_LIST:
      return { ...state, orgList: action.payload }
    case UPD_MEMBER_IDS:
      return {
        ...state,
        memberIds: action.payload
      }
    case 'IS_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    case 'ACTIVE_KEY':
      return {
        ...state,
        activeKey: action.payload
      }
    case 'ACTIVE_SHOP':
      return {
        ...state,
        shopName: action.payload.shopName,
        shopId: action.payload.shopId
      }
    case 'TABS_EDIT_ITEM':
      return {
        ...state,
        activeKey: action.payload.activeKey,
        cardList: action.payload.cardList
      }
    case 'DEAL_PANES':
      return {
        ...state,
        dealPanes: [...state.dealPanes, ...action.payload]
      }
    default:
      return state
  }
}
