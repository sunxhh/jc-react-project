import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchSupplyChain as fetchData } from 'Utils/fetch'
import { isEmpty } from 'Utils/lang'
import apis from '../../apis'
import { SHOW_LIST_SPIN } from '../../../../global/action'

// ===========================> Action Types <=========================== //
const GET_TREE_LIST = '/spa/SupplyChainModule/goods/classify/GET_TREE_LIST' // 货物分类菜单树
const GET_TREE_DETAIL = '/spa/SupplyChainModule/goods/classify/detail/GET_TREE_DETAIL' // 货物详情
const DELETE_MENU = '/spa/SupplyChainModule/goods/classify/DELETE_MENU' // 删除货物分类
// const MENU_MODIFY = '/spa/baseModule/menuManage/MENU_MODIFY' // 菜单编辑
// const MENU_DELETE = '/spa/baseModule/menuManage/MENU_DELETE' // 菜单删除

// ===========================> Actions <=========================== //

// 获取分类列表
export const getTreeList = (arg) => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.goods.classify.list, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_TREE_LIST)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取分类详情
export const getTreeDetail = (arg) => {
  return dispatch => {
    return fetchData(apis.goods.classify.detail, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_TREE_DETAIL)(res.data))
        dispatch(createAction('SWITCH_EDIT_BTN')(false))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 添加树分类
export const addMenu = arg => dispatch =>
  fetchData(apis.goods.classify.add, arg).then(res => {
    if (res.code === 0) {
      dispatch(getTreeList({ parentNo: '' }))
      return res
    } else {
      message.error(res.errmsg)
    }
  })

// 删除树分类
export const deleteMenu = (arg, callBack) => {
  return dispatch => {
    return fetchData(apis.goods.classify.delete, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(DELETE_MENU)(res.data))
        dispatch(createAction('SWITCH_EDIT_BTN')(false))
        dispatch(getTreeList({ parentNo: '' }))
        callBack && callBack()
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 编辑并提交
export const modifyMenu = (arg) => {
  return dispatch => {
    return fetchData(apis.goods.classify.update, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction('SWITCH_EDIT_BTN')(false))
        dispatch(getTreeList({ parentNo: '' }))
        return res.data
      } else {
        message.error(res.errmsg)
      }
      return res
    })
  }
}

// ===========================> Reducer <=========================== //

const initialState = {
  treeList: [],
  treeListArray: [],
  treeDetail: {},
  goodsNo: '',
  goodsCatgNo: '',
  goodsCatgName: '',
  goodsType: '',
  goodsName: '',
  shortName: '',
  goodsUnit: '',
  goodsDesc: '',
  goodsCatgStep: '',
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_TREE_LIST: {
      const treeList = action.payload
      const treeListArray = []
      function generateTreeListArray(data) { // eslint-disable-line
        data.forEach(item => {
          treeListArray.push({ key: item.goodsCatgNo, menuName: item.goodsCatgName })
          if (!isEmpty(item.childGoodsCatgList)) {
            generateTreeListArray(item.childGoodsCatgList)
          }
        })
      }
      generateTreeListArray(treeList)
      return {
        ...state,
        treeList,
        treeListArray
      }
    }
    case GET_TREE_DETAIL:
      return {
        ...state,
        goodsCategoryDetail: action.payload,
      }
    case 'SWITCH_EDIT_BTN':
      return {
        ...state,
        editBtn: action.payload,
      }
    default:
      return state
  }
}
