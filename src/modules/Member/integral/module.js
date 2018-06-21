// import { createAction } from 'redux-actions'
import { message } from 'antd'
import { SHOW_LIST_SPIN } from 'Global/action'
import apis from '../apis'
import { fetchMemberPoint as fetchData } from 'Utils/fetch'
import { ReduckHelper } from 'Utils/helper'
import { createAction } from 'redux-actions'

export const SET_MEMBER_POINT_QUERY_PARAM = 'spa/Member/integral/SET_MEMBER_POINT_QUERY_PARAM'
export const RESET_MEMBER_POINT_QUERY_PARAM = 'spa/Member/integral/RESET_MEMBER_POINT_QUERY_PARAM'
export const GET_MEMBER_POINT_LIST = 'spa/Member/integral/GET_MEMBER_POINT_LIST'
export const GET_INTEGRAL_RULE_TEMPLET_LIST = 'spa/Member/integral/GET_INTEGRAL_RULE_TEMPLET_LIST'
export const GET_INTEGRAL_CURRENCY_RULE_DETAIL = 'spa/Member/integral/GET_INTEGRAL_CURRENCY_RULE_DETAIL'
export const GET_INTEGRAL_RULE_LIST = 'spa/Member/integral/GET_INTEGRAL_RULE_LIST'

export const GET_INTEGRAL_INFO = 'spa/Member/integral/GET_INTEGRAL_INFO' // 获取积分概况
export const GET_INTEGRAL_DETAIL = 'spa/Member/integral/GET_INTEGRAL_DETAIL' // 获取积分详情列表

export default {
  namespace: 'integral',

  // initialState
  state: {
    memberPointList: [],
    ruleList: [],
    ruleTempletList: [],
    currencyRuleDetail: null,
    page: {
      pageNo: 1,
      pageSize: 20,
      records: 0,
      pages: 0,
    },
    // 搜索选项
    queryParam: {
      orgIndex: '',
      queryParam: '', // 会员姓名或者手机号码
      sort: 'DESC', // 积分排序（DESC.由多到少，ASC.由少到多）
      orgCode: '' // 产业code
    },
    getIntegraInfo: [],
    getIntegraList: [],
    getIntegraPage: {
      currentPage: 1,
      pageSize: 10,
      records: 0,
      pages: 0,
    },
    getMyListByLevel: {}
  },

  actions: {
    setQueryParam: param => {
      return createAction(SET_MEMBER_POINT_QUERY_PARAM)(param)
    },
    resetQueryParam: param => {
      return createAction(RESET_MEMBER_POINT_QUERY_PARAM)(param)
    },
    getMemberPointList: arg => dispatch => {
      return fetchData(dispatch, SHOW_LIST_SPIN)(apis.integral.pointList, arg).then(res => {
        if (res.code === 0) {
          dispatch(createAction(GET_MEMBER_POINT_LIST)(res.data))
        } else {
          message.error(res.errmsg)
        }
      })
    },
    // 积分规则配置
    getRuleTempletList: arg => dispatch => {
      return fetchData(dispatch, SHOW_LIST_SPIN)(apis.integral.ruleTempletList, arg).then(res => {
        if (res.code === 0) {
          dispatch(createAction(GET_INTEGRAL_RULE_TEMPLET_LIST)(res.data))
        } else {
          message.error(res.errmsg)
        }
      })
    },
    // 通用积分规则
    getCurrencyRuleDetail: arg => dispatch => {
      return fetchData(dispatch, SHOW_LIST_SPIN)(apis.integral.currencyRuleDetail, arg).then(res => {
        if (res.code === 0) {
          dispatch(createAction(GET_INTEGRAL_CURRENCY_RULE_DETAIL)(res.data))
        } else {
          message.error(res.errmsg)
        }
      })
    },
    // 添加通用积分规则
    addCurrencyRule: arg => dispatch => {
      return new Promise((reslove) => {
        return fetchData(dispatch)(apis.integral.currencyRuleAdd, arg, '正在保存...').then(res => {
          if (res.code === 0) {
            message.success('设置成功')
            reslove(true)
          } else {
            message.error(res.errmsg)
            reslove(false)
          }
        })
      })
    },
    // 积分规则列表
    getRuleList: arg => dispatch => {
      return fetchData(dispatch, SHOW_LIST_SPIN)(apis.integral.ruleList, arg).then(res => {
        if (res.code === 0) {
          dispatch(createAction(GET_INTEGRAL_RULE_LIST)(res.data))
        } else {
          message.error(res.errmsg)
        }
      })
    },
    // 添加积分规则
    addRule: arg => dispatch => {
      return new Promise((reslove) => {
        return fetchData(dispatch)(apis.integral.ruleAdd, arg, '正在保存...').then(res => {
          if (res.code === 0) {
            message.success('新增成功')
            reslove(true)
          } else {
            message.error(res.errmsg)
            reslove(false)
          }
        })
      })
    },
    // 删除积分规则
    delRule: arg => dispatch => {
      return new Promise((resolve) => {
        return fetchData(apis.integral.ruleDel, arg).then(res => {
          if (res.code === 0) {
            message.success('删除成功')
            resolve(true)
          } else {
            message.error(res.errmsg)
            reslove(false)
          }
        })
      })
    },

    // 获取一级机构
    getMyListByLevel(arg) {
      return dispatch => {
        return new Promise(resolve => {
          return fetchData(apis.org.list, arg).then(res => {
            if (res.code === 0) {
              resolve(res.data)
            } else {
              message.error(res.errmsg)
              resolve(false)
            }
          })
        })
      }
    },

    // 获取会员积分概况
    getIntegraInfo(arg) {
      return dispatch => {
        return fetchData(dispatch, SHOW_LIST_SPIN)(apis.integral.pointSurvey, arg).then(res => {
          if (res.code === 0) {
            dispatch(createAction(GET_INTEGRAL_INFO)(res.data))
            return res.code
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },

    // 获取会员积分列表
    getIntegraDetail(arg) {
      return dispatch => {
        return fetchData(dispatch, SHOW_LIST_SPIN)(apis.integral.pointFlowList, arg).then(res => {
          if (res.code === 0) {
            dispatch(createAction(GET_INTEGRAL_DETAIL)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },

    // 积分新增
    addIntegra(arg) {
      return dispatch => {
        return fetchData(dispatch, SHOW_LIST_SPIN)(apis.integral.pointFlowAdd, arg).then(res => {
          if (res.code === 0) {
            message.success('积分新增成功!')
            return res.code
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },

    // 积分扣除
    cutIntegra(arg) {
      return dispatch => {
        return fetchData(dispatch, SHOW_LIST_SPIN)(apis.integral.pointFlowDeduction, arg).then(res => {
          if (res.code === 0) {
            message.success('积分扣除成功!')
            return res.code
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },

    // 判断是否过期
    isMember(arg) {
      return dispatch => {
        return fetchData(dispatch, SHOW_LIST_SPIN)(apis.integral.isMember, arg).then(res => {
          if (res.code === 0) {
            return res.data
          } else {
            message.error(res.errmsg)
          }
        })
      }
    }
  },

  reducers: {
    [GET_MEMBER_POINT_LIST]: (state, action) => {
      return {
        ...state,
        memberPointList: action.payload ? action.payload.data : [],
        page: {
          pageNo: action.payload === null ? '' : action.payload.pageNo,
          pageSize: action.payload === null ? '' : action.payload.pageSize,
          records: action.payload === null ? '' : action.payload.records,
          pages: action.payload === null ? '' : action.payload.pages,
        }
      }
    },
    [GET_INTEGRAL_RULE_TEMPLET_LIST]: (state, action) => {
      return {
        ...state,
        ruleTempletList: action.payload,
      }
    },
    [GET_INTEGRAL_RULE_LIST]: (state, action) => {
      return {
        ...state,
        ruleList: action.payload,
      }
    },
    [GET_INTEGRAL_CURRENCY_RULE_DETAIL]: (state, action) => {
      return {
        ...state,
        currencyRuleDetail: action.payload,
      }
    },
    [SET_MEMBER_POINT_QUERY_PARAM]: (state, action) => {
      return {
        ...state,
        queryParam: {
          orgIndex: action.payload.orgIndex,
          queryParam: action.payload.queryParam, // 会员姓名或者手机号码
          sort: action.payload.sort, // 积分排序（DESC.由多到少，ASC.由少到多）
          orgCode: action.payload.orgCode, // 产业code
        },
      }
    },
    [RESET_MEMBER_POINT_QUERY_PARAM]: (state, action) => {
      return {
        ...state,
        page: {
          pageNo: 1,
          pageSize: 20,
          records: 0,
          pages: 0,
        },
        // 搜索选项
        queryParam: {
          orgIndex: '',
          queryParam: '', // 会员姓名或者手机号码
          sort: 'DESC', // 积分排序（DESC.由多到少，ASC.由少到多）
          orgCode: '' // 产业code
        },
      }
    },
    [GET_INTEGRAL_INFO]: (state, action) => ({
      ...state,
      getIntegraInfo: action.payload
    }),
    [GET_INTEGRAL_DETAIL]: (state, action) => {
      return ReduckHelper.resolveListState('getIntegra', state, action.payload)
    }
  },

  children: [
  ]
}
