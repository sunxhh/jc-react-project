import { createAction } from 'redux-actions'
import { message } from 'antd'
import baseFetchData, { fetchOrderCenter as fetchData } from 'Utils/fetch'
import apis from '../apis'
import { SHOW_LIST_SPIN, SHOW_BUTTON_SPIN, SHOW_SPIN } from 'Global/action'
import { ReduckHelper } from 'Utils/helper'

// ===========================> Action Types <=========================== //

export const GET_TEMPLATE_LIST = '/spa/orderCenter/template/GET_TEMPLATE_LIST' // 模板分页查询
export const GET_TEMPLATE_DETAIL = '/spa/orderCenter/template/GET_TEMPLATE_DETAIL' // 模板详情查询
export const GET_ORG_LIST = '/spa/orderCenter/template/GET_ORG_LIST' // 组织机构查询
export const GET_TEMPLATE_DCTIONARY = '/spa/orderCenter/order/GET_TEMPLATE_DCTIONARY' // 新增模板
export const GET_BUSINESS_TYPE_LIST = '/spa/orderCenter/template/GET_BUSINESS_TYPE_LIST' // 获取商品类型字典

// ===========================> Actions <=========================== //

// 关帐单据列表页
export const getTemplateList = arg => dispatch => {
  return fetchData(dispatch, SHOW_LIST_SPIN)(apis.template.list, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_TEMPLATE_LIST)({
        ...res.data,
        filter: arg
      }))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const getTemplateDetail = arg => dispatch => {
  return fetchData(dispatch, SHOW_SPIN)(apis.template.detail, arg).then(res => {
    if (res.code === 0) {
      if (!res.data) {
        message.error('查询订单模板失败！')
        return {}
      }
      dispatch(createAction(GET_TEMPLATE_DETAIL)(res.data))
      return res.data
    } else {
      message.error(res.errmsg)
      return {}
    }
  })
}

export const deleteTemplateDetailCache = () => dispatch => {
  dispatch(createAction(GET_TEMPLATE_DETAIL)({}))
}

export const getOrgList = arg => dispatch => {
  return baseFetchData(dispatch, SHOW_SPIN)(apis.dictionary.orgList, arg).then(res => {
    if (res.code === 0) {
      res.data = res.data.map((item) => {
        item.value = item.id
        item.name = item.orgName
        return item
      })
      dispatch(createAction(GET_ORG_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const delTemplateList = arg => dispatch => {
  return fetchData(dispatch, SHOW_SPIN)(apis.template.delete, arg).then(res => {
    if (res.code === 0) {
      message.info('删除成功')
      return true
    } else {
      message.error(res.errmsg)
      return false
    }
  })
}

export const doneTemplate = arg => dispatch => {
  return fetchData(dispatch, SHOW_SPIN)(apis.template.activate, arg).then(res => {
    if (res.code === 0) {
      message.info('设置成功')
      return Promise.resolve(true)
    } else {
      message.error(res.errmsg)
      return Promise.resolve(false)
    }
  })
}

// 新增表单
export const addTemplate = arg => dispatch => {
  return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.template.add, arg).then(res => {
    if (res.code === 0) {
      message.info('新增模板成功')
      history.go(-1)
    } else {
      message.error(res.errmsg)
    }
  })
}

// 编辑表单
export const updateTemplate = arg => dispatch => {
  return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.template.update, arg).then(res => {
    if (res.code === 0) {
      message.info('编辑模板成功')
      history.go(-1)
    } else {
      message.error(res.errmsg)
    }
  })
}

//  获取模板所需的下拉
export const getDictionary = arg => dispatch => {
  return fetchData(dispatch, SHOW_SPIN)(apis.dictionary.dictionary, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_TEMPLATE_DCTIONARY)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const getBusinessTypeList = arg => dispatch => {
  return fetchData(dispatch)(apis.dictionary.productTypeList, arg).then(res => {
    if (res.code === 0) {
      res.data && res.data.map(item => {
        item.value = item.code
        item.label = item.name
        item.children && item.children.map(item => {
          item.value = item.code
          item.label = item.name
          return item
        })
        return item
      })
      dispatch(createAction(GET_BUSINESS_TYPE_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

export const clearFilter = () => dispatch => {
  dispatch(createAction(GET_TEMPLATE_LIST)({ ...initialState.templatePage }))
}

// ===========================> Reducer <=========================== //

const initialState = {
  templateList: [],
  templatePage: {
    pageSize: 10,
    current: 1
  },
  templateFilter: {},

  templateDetail: {},
  dictionary: {},
  businessTypeList: [],
}

export const reducer = function(state = initialState, action) {
  switch (action.type) {
    case GET_TEMPLATE_LIST:
      return ReduckHelper.resolveListState('template', state, action.payload)
    case GET_ORG_LIST:
      return {
        ...state,
        orgList: action.payload
      }
    case GET_TEMPLATE_DETAIL:
      return {
        ...state,
        templateDetail: action.payload
      }
    case GET_TEMPLATE_DCTIONARY:
      return {
        ...state,
        dictionary: action.payload
      }
    case GET_BUSINESS_TYPE_LIST:
      return {
        ...state,
        businessTypeList: action.payload
      }
    default:
      return state
  }
}
