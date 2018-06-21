import closeBillModule from './closeBill/module'
import goodsModule from './goods/module'
import goodsCateModule from './goodsCate/module'
import goodsPriceModule from './goodsPrice/module'
import orderModule from './order/module'
import reportModule from './report/module'
import sellingPriceModule from './sellingPrice/module'
import storeGoodsModule from './storeGoods/module'
import shelfModule from './shelf/module'
import stockModule from './stock/module'
import categoryModule from './category/module'

import { message } from 'antd'
import apis from './apis'
import { fetchRetail as fetchData } from 'Utils/fetch'
import { createAction } from 'redux-actions'

// ===========================> Action Types <=========================== //
export const GET_CATEGORY_LIST = 'spa/retail/GET_CATEGORY_LIST'
export const GET_GOODS_TYPE_LIST = 'spa/retail/store/GET_GOODS_TYPE_LIST'

export default {
  namespace: 'retail',

  state: {
    categoryList: [], // 系统分类
    goodsTypeList: [] // 商品分类
  },

  actions: {
    // 系统分类
    getCategoryList: arg => dispatch => {
      return fetchData(dispatch)(apis.categoryList, arg).then(res => {
        if (res.code === 0) {
          dispatch(createAction(GET_CATEGORY_LIST)(res.data))
        } else {
          message.error(res.errmsg)
        }
      })
    },
    // 商品分类
    getGoodsTypeList: arg => dispatch => {
      return fetchData(dispatch)(apis.goodsTypeList).then(res => {
        if (res.code === 0) {
          dispatch(createAction(GET_GOODS_TYPE_LIST, arg)(res.data))
        } else {
          message.error(res.errmsg)
        }
      })
    }
  },

  reducers: {
    [GET_CATEGORY_LIST]: (state, action) => ({
      ...state,
      categoryList: action.payload
    }),
    [GET_GOODS_TYPE_LIST]: (state, action) => ({
      ...state,
      goodsTypeList: action.payload
    })
  },

  children: [
    closeBillModule,
    goodsModule,
    goodsCateModule,
    goodsPriceModule,
    orderModule,
    reportModule,
    sellingPriceModule,
    storeGoodsModule,
    shelfModule,
    stockModule,
    categoryModule,
  ]
}
