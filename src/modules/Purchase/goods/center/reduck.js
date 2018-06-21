import { createAction } from 'redux-actions'
import { fetchSupplyChain as fetchData } from 'Utils/fetch'
import { message } from 'antd'
import apis from '../../apis'
import { SHOW_BUTTON_SPIN, SHOW_LIST_SPIN, SHOW_SPIN } from 'Global/action'
// import { isEmpty } from 'Utils/lang'

// ===========================> Action Types <=========================== //

export const GET_CENTER_LIST = '/spa/SupplyChainModule/goods/center/GET_CENTER_LIST' // 货物中心列表数据
const GET_GOODS_CATEGORY_LIST = '/spa/SupplyChainModule/goods/classify/GET_GOODS_CATEGORY_LIST' // 货物分类菜单树
const GET_CATEGORY_LIST = '/spa/SupplyChainModule/goods/classify/GET_CATEGORY_LIST' // 货物分类菜单树
const GET_CODELIST = '/spa/SupplyChainModule/goods/common/GET_CODELIST' // 货物分类菜单树
const GET_SPEC_CATG_LIST = 'spa/SupplyChain/goods/GET_SPEC_CATG_LIST' // 规格类别
const GET_SPEC_DETAIL_LIST = 'spa/SupplyChain/goods/GET_SPEC_DETAIL_LIST' // 规格列表
const SET_SPEC_SELECTOR_DATA = 'spa/SupplyChain/goods/center/SET_SPEC_SELECTOR_DATA'
const DELETE_PROPERTY_SELECTORS = 'spa/SupplyChain/goods/center/DELETE_PROPERTY_SELECTORS'
const GET_CENTER_DETAIL = 'spa/SupplyChain/depotGoods/GET_GOODS_DETAIL'
export const SET_GOOD_SKU_LIST = 'spa/SupplyChain/depotGoods/SET_GOOD_SKU_LIST'
// ===========================> Actions <=========================== //

export const getGoodsCenterList = arg => dispatch => {
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.goods.center.list, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
    } else {
      dispatch(createAction(GET_CENTER_LIST)({ ...res.data, filter: arg }))
    }
  })
}

// 获取所有分类
export const getCategoryList = arg => dispatch => {
  return fetchData(apis.goods.classify.list, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_CATEGORY_LIST)(res.data))
      return res.data
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取下拉框码表值
export const getCodeList = arg => dispatch => {
  fetchData(apis.common.codeList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_CODELIST)(res.data))
      return res.data
    } else {
      message.error(res.errmsg)
    }
  })
}

// 获取规格子类
export const getSpecDetailList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.goods.spec.detail, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_SPEC_DETAIL_LIST)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })

// 添加货物
export const addGoods = (arg) => {
  return (dispatch) => {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.goods.center.goodsAdd, arg).then(res => {
      if (res.code === 0) {
        message.success('保存成功', 1, () => {
          history.go(-1)
        })
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 添加货物
export const editGoods = (arg) => {
  return (dispatch) => {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.goods.center.goodsEdit, arg).then(res => {
      if (res.code === 0) {
        message.success('保存成功', 1, () => {
          history.go(-1)
        })
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 规格修改
export const saveGoodsSpec = (arg) => {
  return (dispatch) => {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.goods.center.goodsSpecEdit, arg).then(res => {
      if (res.code === 0) {
        message.success('保存成功', 1, () => {
          history.go(-1)
        })
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 添加规则选择器
export const setSpecSelectorData = arg => dispatch =>
  fetchData(dispatch)(apis.goods.spec.catg, arg)
    .then(res => {
      dispatch(createAction(SET_SPEC_SELECTOR_DATA)())

      if (res.code === 0) {
        dispatch(createAction(GET_SPEC_CATG_LIST)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })

export const deletePropertySelectors = data => createAction(DELETE_PROPERTY_SELECTORS)(data)

export const deleteSelector = index => {
  return dispatch => {
    // 删除视图中对应一栏
    dispatch(deletePropertySelectors(index))
  }
}

export const getCenterDetail = arg => dispatch => {
  fetchData(dispatch, SHOW_SPIN)(apis.goods.center.detail, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(GET_CENTER_DETAIL)(res.data))
    }
  })
}

// ===========================> Reducers <=========================== //
const initialState = {
  goodsCenterList: [],
  codeList: [],
  specSelectorData: [],
  specSelectorProperty: [],
  goodsDetail: {},
  goodsAttrSpecList: [],
  goodsSkuList: [],
  goodsImgInfo: {},
  skuSpecModelList: [],
  filter: {},
  centerList: [],
  centerPage: {}
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_CENTER_LIST:
      return {
        ...state,
        goodsCenterList: action.payload,
        centerList: action.payload.data,
        centerPage: {
          pageNo: action.payload.pageNo,
          pageSize: action.payload.pageSize,
          records: action.payload.records,
          pages: action.payload.pages
        },
        filter: action.payload.filter
      }
    case GET_CODELIST:
      return {
        ...state,
        codeList: action.payload
      }
    case GET_CATEGORY_LIST: {
      return {
        ...state,
        goodsCategoryList: action.payload
      }
    }
    case GET_GOODS_CATEGORY_LIST: {
      return {
        ...state,
        goodsCategoryList: action.payload
      }
    }
    case GET_SPEC_CATG_LIST:
      return {
        ...state,
        specCategoryList: action.payload
      }
    case GET_SPEC_DETAIL_LIST:
      return {
        ...state,
        specChildList: action.payload
      }
    case SET_SPEC_SELECTOR_DATA:
      const addSpecSelectorData = {
        specCategoryNo: '',
        specCategoryName: '',
        specChildList: []
      }
      const specSelectorData = state.specSelectorData || []
      specSelectorData.push(addSpecSelectorData)
      return Object.assign({}, state, { specSelectorData: specSelectorData })
    case DELETE_PROPERTY_SELECTORS:
      const afterDelete = state.specSelectorData.filter((m, i) => {
        return i !== action.payload
      })
      return Object.assign({}, state, { specSelectorData: afterDelete })
    case GET_CENTER_DETAIL: {
      return {
        ...state,
        goodsDetail: action.payload,
        goodsAttrSpecList: action.payload.goodsAttrSpecList,
        goodsSkuList: action.payload.goodsSkuList,
        skuSpecModelList: action.payload.skuSpecModelList,
        goodsImgInfo: action.payload.goodsImgInfo,
      }
    }
    case SET_GOOD_SKU_LIST:
      return { ...state, goodsSkuList: action.payload }
    default:
      return state
  }
}
