import { createAction } from 'redux-actions'
import { fetchSupplyChain as fetchData } from 'Utils/fetch'
import apis from './apis'
import { SHOW_SPIN, SHOW_LIST_SPIN, SHOW_BUTTON_SPIN } from 'Global/action'
import { message } from 'antd'
import { SUPPLY_GOODS_FORMULA } from 'Global/urls'

// ===========================> Action Types <=========================== //

const GET_FORMULA_LIST = 'spa/SupplyChain/goods/GET_FORMULA_LIST' // 配方列表
const GET_FORMULA_INFO = 'spa/SupplyChain/goods/GET_FORMULA_INFO' // 详情
const GET_COMMON_LIST = 'spa/SupplyChain/goods/GET_COMMON_LIST' // 详情

// ===========================> Actions <=========================== //

export const getFormulaInfo = arg => dispatch =>
  fetchData(dispatch, SHOW_SPIN)(apis.goods.formula.info, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_FORMULA_INFO)({ ...res.data }))
      } else {
        message.error(res.errmsg)
      }
    })
export const getFormulaList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.goods.formula.list, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_FORMULA_LIST)({ ...res.data, filter: arg }))
      } else {
        message.error(res.errmsg)
      }
    })
export const boundFormula = arg => dispatch =>
  fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.goods.formula.bound, arg).then(
    res => {
      if (res.code === 0) {
        message.success('操作成功', 1, () => {
          location.href = SUPPLY_GOODS_FORMULA
        })
        return true
      } else {
        message.error(res.errmsg)
      }
    }
  )

// ===========================> Reducer <=========================== //

function genListState(key, filter) {
  return {
    [`${key}Filter`]: { ...filter },
    [`${key}List`]: [],
    [`${key}Page`]: {},
  }
}

function resolveListState(key, state, payload) {
  const { filter, data, ...page } = payload
  return {
    ...state,
    [`${key}Filter`]: filter,
    [`${key}List`]: data || page['data'],
    [`${key}Page`]: page,
  }
}

const initialState = {
  ...genListState('formula', { currentPage: 1, pageSize: 10 })
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    // ...
    case GET_FORMULA_LIST:
      return resolveListState('formula', state, action.payload)
    case GET_FORMULA_INFO:
      return {
        ...state,
        info: action.payload
      }
    case GET_COMMON_LIST:
      return {
        ...state,
        commonSelectList: action.payload
      }
    default:
      return state
  }
}
