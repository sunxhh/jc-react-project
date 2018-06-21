import apis from '../../apis'
import { createAction } from 'redux-actions'
import { fetchRetail as fetchData } from 'Utils/fetch'
import { message } from 'antd'

// ===========================> Action Types <=========================== //
export const GET_SHELF_LIST = 'spa/Retail/shelf/list/GET_SHELF_LIST' // 货架查询
export const GET_SHELF_LIST_DETAIL = 'spa/Retail/shelf/list/GET_SHELF_LIST_DETAIL' // 在架库存
export const GET_SHELF_LIST_ADD = 'spa/Retail/shelf/list/GET_SHELF_LIST_ADD' // 配置商品
export const EMPTY_LIST = 'spa/Retail/shelf/list/EMPTY_LIST' // 清空数据

export default {
  namespace: 'list',

  state: {
    title: 'this is shelf list',
    page: {
      currentPage: 1,
      pageSize: 20
    },
  },

  actions: {
    emptyList(arg) {
      return createAction(EMPTY_LIST)(arg)
    },

    getShelfList(arg) {
      return dispatch => {
        fetchData(dispatch)(apis.shelfList.list, arg)
          .then(res => {
            if (res.code === 0) {
              dispatch(createAction(GET_SHELF_LIST)(res))
            } else {
              message.error(res.errmsg)
            }
          })
          .then(res => {
            return res
          })
      }
    },

    // 配置商品
    getShelfAddList(arg) {
      return dispatch => {
        fetchData(dispatch)(apis.shelfList.setGoods, arg)
          .then(res => {
            if (res.code === 0) {
              dispatch(createAction(GET_SHELF_LIST_ADD)(res))
            } else {
              message.error(res.errmsg)
            }
          })
          .then(res => {
            return res
          })
      }
    },

    getShelfDetail(values) {
      return dispatch => {
        fetchData(dispatch)(apis.shelfList.detail, values).then(res => {
          if (res.code === 0) {
            dispatch(createAction(GET_SHELF_LIST_DETAIL)(res))
          } else {
            message.error(res.errmsg)
          }
        })
      }
    },

    // 删除货架
    shelfListDelete: arg => dispatch => {
      return fetchData(dispatch)(apis.shelfList.shelfDelete, arg).then(res => {
        if (res.code === 0) {
          message.success('删除成功')
          return (true)
        } else {
          return (false)
        }
      })
    },

    // 删除货架商品
    shelfGoodsDelete: arg => dispatch => {
      return fetchData(dispatch)(apis.shelfList.shelfGoodsDelete, arg).then(res => {
        if (res.code === 0) {
          message.success('删除成功')
          return (true)
        } else {
          message.error(res.errmsg)
          return (false)
        }
      })
    },

    // 新增货架
    addShelf: value => dispatch => {
      return fetchData(dispatch)(apis.shelfList.addShelf, value, '正在保存...').then(res => {
        if (res.code === 0) {
          message.success('新增成功')
          return (true)
        } else {
          message.error(res.errmsg)
          return (false)
        }
      })
    },

    // 编辑货架
    modifyShelf: (value, shelfNo) => dispatch => {
      return fetchData(dispatch)(apis.shelfList.modifyShelf, { ...value, ...shelfNo }, '正在保存...').then(res => {
        if (res.code === 0) {
          message.success('新增成功')
          return (true)
        } else {
          message.error(res.errmsg)
          return (false)
        }
      })
    },

    addStoreGood: arg => dispatch => {
      return fetchData(dispatch)(apis.shelfList.addeGoods, arg).then(res => {
        if (res.code === 0) {
          message.success('新增成功')
          return ({ status: true })
        } else {
          message.error(res.errmsg)
        }
      })
    },
  },

  reducers: {
    [GET_SHELF_LIST]: (state, action) => ({
      ...state,
      list: action.payload.data.data,
      page: {
        pageNo: action.payload.data === null ? '' : action.payload.data.pageNo,
        pageSize: action.payload.data === null ? '' : action.payload.data.pageSize,
        records: action.payload.data === null ? '' : action.payload.data.records,
        pages: action.payload.data === null ? '' : action.payload.data.pages,
      }
    }),
    [GET_SHELF_LIST_ADD]: (state, action) => ({
      ...state,
      list: action.payload.data.data,
      shelfObj: action.payload.data,
      page: {
        pageNo: action.payload.data === null ? '' : action.payload.data.pageNo,
        pageSize: action.payload.data === null ? '' : action.payload.data.pageSize,
        records: action.payload.data === null ? '' : action.payload.data.records,
        pages: action.payload.data === null ? '' : action.payload.data.pages,
      }
    }),
    [EMPTY_LIST]: (state, action) => ({
      ...state,
      list: [],
      page: {
        pageSize: 20,
        pageNo: 1,
      },
    }),
    [GET_SHELF_LIST_DETAIL]: (state, action) => ({
      ...state,
      shelfDetailList: action.payload.data.data,
      shelfInfo: action.payload.data,
      page: {
        pageNo: action.payload.data === null ? '' : action.payload.data.pageNo,
        pageSize: action.payload.data === null ? '' : action.payload.data.pageSize,
        records: action.payload.data === null ? '' : action.payload.data.records,
        pages: action.payload.data === null ? '' : action.payload.data.pages,
      }
    })
  },

  children: [
    // subModule
  ]
}
