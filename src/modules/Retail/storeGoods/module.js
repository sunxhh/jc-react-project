import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchRetail as fetchData } from 'Utils/fetch'
import { SHOW_LIST_SPIN } from 'Global/action'
import apis from '../apis'

// ===========================> Action Types <=========================== //

export const SET_SHOP_LIST = '/spa/retail/SET_SHOP_LIST' // 商品中心
export const QUERY_SHOP_GOODS_INFO = '/spa/retail/QUERY_SHOP_GOODS_INFO' // 查询门店商品信息
export const CATEGORY_LIST = '/spa/retail/CATEGORY_LIST' // 系统分类列表
export const GOODS_TYPE_LIST = '/spa/retail/GOODS_TYPE_LIST' // 商品类型
export const QUERY_NO_ADD_CATEGORY = '/spa/retail/QUERY_NO_ADD_CATEGORY' // 前台分类
export const QUERY_SALE_UNIT_LIST = '/spa/retail/QUERY_SALE_UNIT_LIST' // 计量单位列表
export const CHANNELS_LIST = '/spa/retail/CHANNELS_LIST' // 上架渠道列表
export const QUERY_NO_ADD_CATEGORY_EDIT = '/spa/retail/QUERY_NO_ADD_CATEGORY_EDIT' // 前台分类編輯
export const SET_FILTER_LOADING_LIST = '/spa/retail/SET_FILTER_LOADING_LIST' // 商品中心
export const SET_STORE_GOODS_QUERY_PAR = '/spa/retail/SET_STORE_GOODS_QUERY_PAR' // 商品中心 设置查询参数
export const RESET_STORE_GOODS_QUERY_PAR = '/spa/retail/RESET_STORE_GOODS_QUERY_PAR' // 商品中心 重置查询参数

export default {
  namespace: 'storeGoods',

  state: {
    shopList: [],
    initQueryPar: {
      goodsNo: '',
      sku: '',
      goodsName: '',
      orgCode: '',
    },
    selectFetchingFlag: false,
    list: [],
    page: {
      currentPage: 1,
      pageSize: 20
    },
    categoryList: [],
    goodsTypeList: [],
    queryNoAddCategory: [],
    queryNoAddCategoryEdit: [],
    querySaleUnitList: [],
    queryShopGoodsInfo: {},
  },

  actions: {
    setQueryPar(arg) {
      return createAction(SET_STORE_GOODS_QUERY_PAR)(arg)
    },
    resetQueryPar(arg) {
      return createAction(RESET_STORE_GOODS_QUERY_PAR)(arg)
    },
    getStoreGoodList(arg) {
      return dispatch => {
        return new Promise((resolve) => {
          fetchData(dispatch, SHOW_LIST_SPIN)(apis.storeGoods.list, arg).then(res => {
            if (res.code === 0) {
              resolve({ status: 'success', result: res.data })
            } else {
              resolve({ status: 'error' })
              message.error(res.errmsg)
            }
          })
        })
      }
    },
    getCategoryList(arg) {
      return dispatch => {
        return fetchData(dispatch, SHOW_LIST_SPIN)(apis.storeGoods.category, arg).then(res => {
          if (res.code === 0) {
            dispatch(createAction(CATEGORY_LIST)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },
    getGoodsTypeList(arg) {
      return dispatch => {
        return fetchData(dispatch, SHOW_LIST_SPIN)(apis.goods.goodsTypeList, arg).then(res => {
          if (res.code === 0) {
            dispatch(createAction(GOODS_TYPE_LIST)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },
    getCategory(arg) {
      return dispatch => {
        return fetchData(dispatch, SHOW_LIST_SPIN)(apis.category.queryFrontCategory, arg).then(res => {
          if (res.code === 0) {
            dispatch(createAction(QUERY_NO_ADD_CATEGORY)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },
    getCategoryEdit(arg) {
      return dispatch => {
        return fetchData(dispatch, SHOW_LIST_SPIN)(apis.category.queryFrontCategory, arg).then(res => {
          if (res.code === 0) {
            dispatch(createAction(QUERY_NO_ADD_CATEGORY_EDIT)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },
    addStoreGood(arg) {
      return dispatch => {
        let url = apis.storeGoods.add
        return new Promise(function (resolve, reject) {
          fetchData(url, arg).then(res => {
            if (res.code === 0) {
              message.success('添加成功！')
              resolve({ status: 'success' })
            } else {
              resolve({ status: 'error' })
              message.error(res.errmsg)
            }
          })
        })
      }
    },
    deleteStoreGood(arg) {
      return dispatch => {
        return new Promise((resolve) => {
          fetchData(apis.storeGoods.del, arg).then(res => {
            if (res.code === 0) {
              message.success('删除成功！')
              resolve({ status: 'success' })
            } else {
              resolve({ status: 'error' })
              message.error(res.errmsg)
            }
          })
        })
      }
    },
    editStoreGood: arg => dispatch => {
      return fetchData(apis.storeGoods.edit, arg).then(res => {
        if (res.code === 0) {
          message.success('编辑成功！')
          return true
        } else {
          message.error(res.errmsg)
          return false
        }
      })
    },
    channelsList(arg) {
      return dispatch => {
        return fetchData(dispatch, SHOW_LIST_SPIN)(apis.storeGoods.channelsList, arg).then(res => {
          if (res.code === 0) {
            dispatch(createAction(CHANNELS_LIST)(res.data))
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },
    channelsStoreGood(arg) {
      return dispatch => {
        return new Promise((resolve) => {
          fetchData(apis.storeGoods.channels, arg).then(res => {
            if (res.code === 0) {
              resolve({ status: 'success' })
            } else {
              resolve({ status: 'error' })
              message.error(res.errmsg)
            }
          })
        })
      }
    },
    onAndOffGood(arg) {
      return dispatch => {
        return new Promise((resolve) => {
          fetchData(apis.storeGoods.shelves, arg).then(res => {
            if (res.code === 0) {
              if (arg.status === '2') {
                message.success('下架成功！')
              } else if (arg.status === '1') {
                message.success('上架成功！')
              }
              resolve({ status: 'success' })
            } else {
              message.error(res.errmsg)
              resolve({ status: 'error' })
            }
          })
        })
      }
    },
    getShopList(arg) {
      return dispatch => {
        dispatch(createAction(SET_FILTER_LOADING_LIST)(true))
        fetchData(apis.storeGoods.shopList, arg).then(res => {
          dispatch(createAction(SET_FILTER_LOADING_LIST)(false))
          if (res.code === 0) {
            dispatch(createAction(SET_SHOP_LIST)(res.data))
          }
        })
      }
    },
    getQuerySaleUnitList: arg => dispatch => {
      return fetchData(dispatch, SHOW_LIST_SPIN)(apis.storeGoods.querySaleUnitList, arg).then(res => {
        if (res.code === 0) {
          dispatch(createAction(QUERY_SALE_UNIT_LIST)(res.data))
          return ({ status: true })
        } else {
          message.error(res.errmsg)
        }
      })
    },
    getQueryShopGoodsInfo: (arg) => dispatch =>
      fetchData(dispatch, SHOW_LIST_SPIN)(apis.storeGoods.queryShopGoodsInfo, arg).then(res => {
        if (res.code === 0) {
          dispatch(createAction(QUERY_SHOP_GOODS_INFO)(res.data))
          return ({ status: true })
        } else {
          message.error(res.errmsg)
        }
      }),
  },

  reducers: {
    [SET_STORE_GOODS_QUERY_PAR]: (state, action) => ({
      ...state,
      initQueryPar: action.payload,
    }),
    [CATEGORY_LIST]: (state, action) => ({
      ...state,
      categoryList: action.payload,
    }),
    [GOODS_TYPE_LIST]: (state, action) => ({
      ...state,
      goodsTypeList: action.payload,
    }),
    [SET_SHOP_LIST]: (state, action) => ({
      ...state,
      shopList: action.payload,
    }),
    [CHANNELS_LIST]: (state, action) => ({
      ...state,
      channelsList: action.payload,
    }),
    [QUERY_NO_ADD_CATEGORY]: (state, action) => ({
      ...state,
      queryNoAddCategory: action.payload,
    }),
    [QUERY_NO_ADD_CATEGORY_EDIT]: (state, action) => ({
      ...state,
      queryNoAddCategoryEdit: action.payload,
    }),
    [SET_FILTER_LOADING_LIST]: (state, action) => ({
      ...state,
      selectFetchingFlag: action.payload,
    }),
    [RESET_STORE_GOODS_QUERY_PAR]: (state, action) => ({
      ...state,
      initQueryPar: {
        goodsNo: '',
        sku: '',
        goodsName: '',
        orgCode: '',
      },
    }),
    [QUERY_SALE_UNIT_LIST]: (state, action) => ({
      ...state,
      querySaleUnitList: action.payload,
    }),
    [QUERY_SHOP_GOODS_INFO]: (state, action) => ({
      ...state,
      queryShopGoodsInfo: action.payload,
    }),
  },

  children: [
  ]
}
