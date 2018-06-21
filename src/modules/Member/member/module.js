
// import { createAction } from 'redux-actions'
import apis from '../apis'
import { message } from 'antd'
import fetchData, { fetchMemberCenter, fetchMemberPoint, fetchPet } from 'Utils/fetch'
import { replace } from 'react-router-redux'
import { createAction } from 'redux-actions'
import globalApis from 'Global/apis'
import { isEmpty } from 'Utils/lang'
import { MEMBER_LIST } from 'Global/urls'

// ===========================> Action Types <=========================== //
export const GET_MEMBER_LIST = 'spa/Member/member/GET_MEMBER_LIST'
export const SET_MEMBER_QUERY_PAR = 'spa/Member/member/SET_MEMBER_QUERY_PAR'
export const RESET_MEMBER_QUERY_PAR = 'spa/Member/member/RESET_MEMBER_QUERY_PAR'
export const ORG_LIST = 'spa/Member/member/ORG_LIST'
export const SUB_ORG_LIST = 'spa/Member/member/SUB_ORG_LIST'
export const GET_MEMBER_QUERY = 'spa/Member/member/GET_MEMBER_QUERY'
export const REGION_LIST = 'spa/common/REGION_LIST'
export const GET_INTEGRAL_DETAIL = 'spa/Member/integral/GET_INTEGRAL_DETAIL' // 获取积分详情列表

export default {
  namespace: 'member',

  state: {
    title: 'this is member list',
    // memberDetail: {},
    regionList: [],
    initQueryPar: {
      keywords: '',
      orgCode: '',
    },
    orgList: {},
    orgId: '',
    page: {
      currentPage: 1,
      pageSize: 20
    },
    selectFetchingFlag: false,
  },

  actions: {
    getRegionList(arg) {
      return dispatch => {
        fetchData(dispatch)(globalApis.regionv2, arg).then(res => {
          if (res.code === 0) {
            dispatch(createAction(REGION_LIST)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },
    getMemberQuery: arg => dispatch => {
      let url = apis.member.query
      return new Promise(resolve => {
        fetchMemberCenter(url, arg)
          .then(res => {
            if (res.code === 0) {
              resolve({ status: 'success', result: res.data })
            } else {
              message.error(res.errmsg)
              resolve({ status: 'error' })
            }
          })
      })
    },
    getMemberList(arg) {
      return dispatch => {
        fetchMemberCenter(dispatch)(apis.member.list, arg)
          .then(res => {
            if (res.code === 0) {
              dispatch(createAction(GET_MEMBER_LIST)(res))
            } else {
              message.error(res.errmsg)
            }
          })
          .then(res => {
            return res
          })
      }
    },
    getMemberListLv1(arg) {
      return dispatch => {
        fetchMemberCenter(dispatch)(apis.member.orgMemberList, arg)
          .then(res => {
            if (res.code === 0) {
              dispatch(createAction(GET_MEMBER_LIST)(res))
            } else {
              message.error(res.errmsg)
            }
          })
          .then(res => {
            return res
          })
      }
    },
    // 设置查询参数
    setQueryPar(arg) {
      return createAction(SET_MEMBER_QUERY_PAR)(arg)
    },
    // 重置查询条件
    resetQueryPar(arg) {
      return createAction(RESET_MEMBER_QUERY_PAR)(arg)
    },
    getOrgList(arg) {
      return dispatch => {
        return fetchData(apis.org.list, arg).then(res => {
          if (res.code === 0) {
            dispatch(createAction(ORG_LIST)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },
    getBasicDetail: arg => dispatch => {
      let url = apis.member.basicDetail
      return new Promise(resolve => {
        fetchMemberCenter(url, arg)
          .then(res => {
            if (res.code === 0) {
              resolve({ status: 'success', result: res.data })
            } else {
              message.error(res.errmsg)
              resolve({ status: 'error' })
            }
          })
      })
    },
    getOrgMemberDetail: arg => dispatch => {
      let url = apis.member.orgMemberDetail
      return new Promise(resolve => {
        fetchMemberCenter(url, arg)
          .then(res => {
            if (res.code === 0) {
              resolve({ status: 'success', result: res.data })
            } else {
              message.error(res.errmsg)
              resolve({ status: 'error' })
            }
          })
      })
    },
    getSubOrgList(arg) {
      return dispatch => {
        fetchData(dispatch)(apis.org.subOrgList, arg).then(res => {
          if (res.code === 0) {
            dispatch(createAction(SUB_ORG_LIST)(res.data))
            return res.data
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },
    addMember(arg, isEdit) {
      const url = isEdit ? apis.member.update : apis.member.add
      return dispatch => {
        fetchMemberCenter(url, arg).then(res => {
          if (res.code === 0) {
            message.success('保存成功', 1, () => {
              dispatch(replace(MEMBER_LIST))
            })
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },
    getIntegraDetail: arg => dispatch => {
      let url = apis.integral.pointFlowList
      return new Promise(resolve => {
        fetchMemberPoint(dispatch)(url, arg)
          .then(res => {
            if (res.code === 0) {
              resolve({ status: 'success', result: res.data })
            } else {
              message.error(res.errmsg)
              resolve({ status: 'error' })
            }
          })
      })
    },
    getPetInfo: arg => dispatch => {
      return new Promise(resolve => {
        fetchPet(dispatch)(apis.pet.detail, arg)
          .then(res => {
            if (res.code === 0) {
              resolve({ status: 'success', result: res.data })
            } else {
              message.error(res.errmsg)
              resolve({ status: 'error' })
            }
          })
      })
    },
    unBindOpenId: arg => dispatch => {
      return new Promise(resolve => {
        fetchPet(dispatch)(apis.pet.unbindOpenId, arg)
          .then(res => {
            if (res.code === 0) {
              resolve({ status: 'success' })
              message.success('解绑成功！')
            } else {
              message.error(res.errmsg)
              resolve({ status: 'error' })
            }
          })
      })
    },
    bindOpenId: arg => dispatch => {
      return new Promise(resolve => {
        fetchPet(dispatch)(apis.pet.bindOpenId, arg)
          .then(res => {
            if (res.code === 0) {
              resolve({ status: 'success', result: res.data })
              message.success('绑定成功！')
            } else {
              message.error(res.errmsg)
              resolve({ status: 'error' })
            }
          })
      })
    }
  },

  reducers: {
    [GET_MEMBER_LIST]: (state, action) => ({
      ...state,
      list: action.payload.data.data,
      page: {
        pageNo: action.payload.data === null ? '' : action.payload.data.pageNo,
        pageSize: action.payload.data === null ? '' : action.payload.data.pageSize,
        records: action.payload.data === null ? '' : action.payload.data.records,
        pages: action.payload.data === null ? '' : action.payload.data.pages,
      }
    }),

    [SET_MEMBER_QUERY_PAR]: (state, action) => ({
      ...state,
      initQueryPar: action.payload,
    }),

    [RESET_MEMBER_QUERY_PAR]: (state, action) => ({
      ...state,
      initQueryPar: {
        keywords: '',
        orgCode: '',
      },
      page: {
        currentPage: 1,
        pageSize: 20
      },
    }),

    [ORG_LIST]: (state, action) => ({
      ...state,
      orgList: action.payload,
      orgId: !isEmpty(action.payload.myOrgList) ? action.payload.myOrgList[0].id : ''
    }),
    [SUB_ORG_LIST]: (state, action) => ({
      ...state,
      subOrgList: action.payload,
    }),
    // [GET_MEMBER_QUERY]: (state, action) => ({
    //   ...state,
    //   memberDetail: action.payload
    // }),
    [REGION_LIST]: (state, action) => ({
      ...state,
      regionList: action.payload,
    }),
    [GET_INTEGRAL_DETAIL]: (state, action) => ({
      ...state,
      integralDetail: action.payload.data,
      page: {
        currentPage: action.payload.data === null ? '' : action.payload.data.pageNo,
        pageSize: action.payload.data === null ? '' : action.payload.data.pageSize,
        records: action.payload.data === null ? '' : action.payload.data.records,
        pages: action.payload.data === null ? '' : action.payload.data.pages,
      }
    })
  },

  children: [
  ]
}
