import { createAction } from 'redux-actions'
import { message } from 'antd'
import { SHOW_LIST_SPIN } from 'Global/action'
import apis from '../apis'
import fetchData, { fetchMemberCard } from 'Utils/fetch'

// ===========================> Action Types <=========================== //
export const GET_CARD_LIST = 'spa/Member/card/GET_CARD_LIST' // 获取列表
export const GET_CARD_MEMBER_LIST = 'spa/Member/card/GET_CARD_MEMBER_LIST' // 获取开卡列表

export default {
  namespace: 'card',

  // initialState
  state: {
    cardList: [],
    cardMemberList: [],
  },

  actions: {
    // 获取列表
    getCardList: (arg) => dispatch => {
      return fetchMemberCard(dispatch, SHOW_LIST_SPIN)(apis.card.list, arg)
        .then(res => {
          if (res.code === 0) {
            dispatch(createAction(GET_CARD_LIST)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
    },
    // 启用
    active: (arg) => dispatch => {
      return fetchMemberCard(dispatch)(apis.card.active, arg).then(res => {
        if (res.code === 0) {
          message.success('操作成功')
          return ({ status: true })
        } else {
          message.error(res.errmsg)
          return ({ status: false })
        }
      })
    },
    // 获取开卡列表
    getCardMemberList: (arg) => dispatch => {
      return fetchMemberCard(dispatch, SHOW_LIST_SPIN)(apis.card.memberList, arg)
        .then(res => {
          if (res.code === 0) {
            dispatch(createAction(GET_CARD_MEMBER_LIST)(res))
          } else {
            message.error(res.errmsg)
          }
        })
    },
    // 获取产业或门店
    getOrgList: (arg) => dispatch => {
      return fetchData(apis.org.list, arg).then(res => {
        if (res.code === 0) {
          return ({ status: true, orgList: res.data })
        } else {
          message.error(res.errmsg)
          return ({ status: false, orgList: [] })
        }
      })
    },
    // 新增会员卡基本信息
    addBasicInfo: (arg) => dispatch => {
      return fetchMemberCard(dispatch)(apis.card.addBasicInfo, arg).then(res => {
        if (res.code === 0) {
          return ({ status: true, result: res.data })
        } else {
          message.error(res.errmsg)
          return ({ status: false })
        }
      })
    },
    // 新增会员卡详细信息
    addDetailInfo: (arg) => dispatch => {
      return fetchMemberCard(dispatch)(apis.card.addDetailInfo, arg).then(res => {
        if (res.code === 0) {
          message.success('保存成功')
          return ({ status: true })
        } else {
          message.error(res.errmsg)
          return ({ status: false })
        }
      })
    },
    // 获取产业字段
    getFieldList: (arg) => dispatch => {
      return fetchMemberCard(dispatch)(apis.card.fieldList, arg).then(res => {
        if (res.code === 0) {
          return ({ status: true, result: res.data })
        } else {
          message.error(res.errmsg)
          return ({ status: false })
        }
      })
    },
    // 获取会员卡信息
    getCardDetail: (arg) => dispatch => {
      return fetchMemberCard(dispatch)(apis.card.detail, arg).then(res => {
        if (res.code === 0) {
          return ({ status: true, result: res.data })
        } else {
          message.error(res.errmsg)
          return ({ status: false })
        }
      })
    },
    updateBasicInfo: (arg) => dispatch => {
      return fetchMemberCard(dispatch)(apis.card.updateBasicInfo, arg).then(res => {
        if (res.code === 0) {
          message.success('修改成功')
          return ({ status: true })
        } else {
          message.error(res.errmsg)
          return ({ status: false })
        }
      })
    },
    updateDetailInfo: (arg) => dispatch => {
      return fetchMemberCard(dispatch)(apis.card.updateDetailInfo, arg).then(res => {
        if (res.code === 0) {
          message.success('修改成功')
          return ({ status: true })
        } else {
          message.error(res.errmsg)
          return ({ status: false })
        }
      })
    },
  },
  reducers: {
    [GET_CARD_LIST]: (state, action) => ({
      ...state,
      cardList: action.payload,
    }),
    [GET_CARD_MEMBER_LIST]: (state, action) => ({
      ...state,
      cardMemberList: action.payload,
      page: {
        pageNo: action.payload.data === null ? '' : action.payload.data.pageNo,
        pageSize: action.payload.data === null ? '' : action.payload.data.pageSize,
        records: action.payload.data === null ? '' : action.payload.data.records,
        pages: action.payload.data === null ? '' : action.payload.data.pages,
      }
    })
  },

  children: [
  ]
}
