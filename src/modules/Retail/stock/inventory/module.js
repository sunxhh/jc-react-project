import { message } from 'antd'
import { SHOW_LIST_SPIN } from 'Global/action'
import apis from '../../apis'
import { fetchRetail as fetchData } from 'Utils/fetch'
import { createAction } from 'redux-actions'

// ===========================> Action Types <=========================== //
export const GET_SHELF_LIST = 'spa/retail/stock/GET_SHELF_LIST' // 库存货架列表
export const SET_INVENTORY_QUERY_PARAM = 'spa/retail/stock/SET_INVENTORY_QUERY_PARAM' // 库存盘点查询条件
export const SET_INVENTORY_RECORD_QUERY_PARAM = 'spa/retail/stock/SET_INVENTORY_RECORD_QUERY_PARAM' // 库存执行盘点查询条件
export const GET_INVENTORY_LIST = 'spa/retail/stock/GET_INVENTORY_LIST' // 库存盘点查询

export const GET_INVENTORY_DETAIL_LIST = 'spa/retail/stock/GET_INVENTORY_DETAIL_LIST' // 库存盘点查询
export const GET_INVENTORY_RECORD_LIST = 'spa/retail/stock/GET_INVENTORY_RECORD_LIST' // 库存盘点录入
export const SET_INVENTORY_RECORD_LIST = 'spa/retail/stock/SET_INVENTORY_RECORD_LIST'
export const RESET_INVENTORY_RECORD = 'spa/retail/stock/RESET_INVENTORY_RECORD'
export const RESET_INVENTORY_DETAIL = 'spa/retail/stock/RESET_INVENTORY_DETAIL'

export const GET_INVENTORY_DETAIL_PRINT_LIST = 'spa/retail/stock/GET_INVENTORY_DETAIL_PRINT_LIST' // 库存盘点打印列表

export default {
  namespace: 'inventory',

  state: {
    inventoryDetailIn: {},
    inventoryRecordIn: {},
    inventoryList: [],
    shelfList: [],
    inventoryDetailPrintList: [],
    inventoryPage: {
      current: 1,
      pageSize: 20,
      records: 0,
      pages: 0,
    },
    inventoryDetailPage: {
      current: 1,
      pageSize: 20,
      records: 0,
      pages: 0,
    },
    inventoryRecordPage: {
      current: 1,
      pageSize: 20,
      records: 0,
      pages: 0,
    },
    // 搜索选项
    inventoryQueryParam: {
      countsNo: '', // 盘点单编号
      shelfNo: undefined, // 货架编号
      start: undefined, //
      end: undefined,
      time: undefined
    },
    // 搜索选项
    inventoryRecordQueryParam: {
      goodsNo: '', // 商品编号
      skuNo: '', // sku编号
      goodsName: '' // 商品名称
    }
  },

  actions: {
    setQueryParam: param => {
      return createAction(SET_INVENTORY_QUERY_PARAM)(param)
    },
    setRecordQueryParam: param => {
      return createAction(SET_INVENTORY_RECORD_QUERY_PARAM)(param)
    },
    getShelfList: arg => dispatch => {
      return fetchData(dispatch)(apis.stock.shelfList, arg).then(res => {
        if (res.code === 0) {
          dispatch(createAction(GET_SHELF_LIST)(res.data))
        } else {
          message.error(res.errmsg)
        }
      })
    },
    getInventoryList: arg => dispatch => {
      return fetchData(dispatch, SHOW_LIST_SPIN)(apis.stock.inventoryList, arg).then(res => {
        if (res.code === 0) {
          dispatch(createAction(GET_INVENTORY_LIST)(res.data))
        } else {
          message.error(res.errmsg)
        }
      })
    },
    delInventory: arg => dispatch => {
      return new Promise((resolve) => {
        return fetchData(apis.stock.inventoryDelete, arg).then(res => {
          if (res.code === 0) {
            message.success('删除成功')
            resolve(true)
          } else {
            message.error(res.errmsg)
            resolve(false)
          }
        })
      })
    },
    createInventory: arg => dispatch => {
      return new Promise((reslove) => {
        return fetchData(dispatch)(apis.stock.inventoryCreate, arg, '正在保存...').then(res => {
          if (res.code === 0) {
            message.success('添加成功')
            reslove(true)
          } else {
            message.error(res.errmsg)
            reslove(false)
          }
        })
      })
    },
    getInventoryDetailList: arg => dispatch => {
      return fetchData(dispatch, SHOW_LIST_SPIN)(apis.stock.inventoryDetail, arg).then(res => {
        if (res.code === 0) {
          dispatch(createAction(GET_INVENTORY_DETAIL_LIST)(res.data))
        } else {
          message.error(res.errmsg)
        }
      })
    },
    getInventoryDetailPrintList: arg => dispatch => {
      arg.currentPage = 1
      arg.pageSize = 1000
      return fetchData(dispatch)(apis.stock.inventoryDetail, arg).then(res => {
        if (res.code === 0) {
          dispatch(createAction(GET_INVENTORY_DETAIL_PRINT_LIST)(res.data))
          return true
        } else {
          message.error(res.errmsg)
          return false
        }
      })
    },
    getInventoryRecordList: arg => dispatch => {
      return fetchData(dispatch, SHOW_LIST_SPIN)(apis.stock.inventoryIn, arg).then(res => {
        if (res.code === 0) {
          dispatch(createAction(GET_INVENTORY_RECORD_LIST)(res.data))
        } else {
          message.error(res.errmsg)
        }
      })
    },
    setInventoryRecordList: arg => dispatch => {
      dispatch(createAction(SET_INVENTORY_RECORD_LIST)(arg))
    },
    resetInventoryRecord: arg => dispatch => {
      dispatch(createAction(RESET_INVENTORY_RECORD)())
    },
    resetInventoryDetail: arg => dispatch => {
      dispatch(createAction(RESET_INVENTORY_DETAIL)())
    },
    saveInventoryData: arg => dispatch => {
      return new Promise((reslove) => {
        return fetchData(dispatch)(apis.stock.inventorySave, arg, '正在保存...').then(res => {
          if (res.code === 0) {
            message.success('保存库存盘点成功')
            reslove(true)
          } else {
            message.error(res.errmsg)
            reslove(false)
          }
        })
      })
    },
    checkInventoryData: arg => dispatch => {
      return new Promise((reslove) => {
        return fetchData(dispatch)(apis.stock.inventoryCheck, arg, '正在检查...').then(res => {
          if (res.code === 0 || res.code === 30007) {
            reslove(res)
          } else {
            message.error(res.errmsg)
            reslove(false)
          }
        })
      })
    },
    finishInventoryData: arg => dispatch => {
      return new Promise((reslove) => {
        return fetchData(dispatch)(apis.stock.inventoryFinish, arg, '正在完成...').then(res => {
          if (res.code === 0) {
            message.success('库存盘点录入成功')
            reslove(true)
          } else {
            message.error(res.errmsg)
            reslove(false)
          }
        })
      })
    }
  },

  reducers: {
    [GET_SHELF_LIST]: (state, action) => ({
      ...state,
      shelfList: action.payload
    }),
    [GET_INVENTORY_LIST]: (state, action) => ({
      ...state,
      inventoryList: action.payload.data,
      inventoryPage: {
        pageNo: action.payload.pageNo,
        pageSize: action.payload.pageSize,
        records: action.payload.records,
        pages: action.payload.pages,
      }
    }),
    [GET_INVENTORY_RECORD_LIST]: (state, action) => ({
      ...state,
      inventoryRecordIn: {
        shelfName: action.payload.shelfName,
        createTime: action.payload.createTime,
        createUser: action.payload.createUser
      },
      inventoryRecordList: action.payload.result.data,
      inventoryRecordPage: {
        pageNo: action.payload.result.pageNo,
        pageSize: action.payload.result.pageSize,
        records: action.payload.result.records,
        pages: action.payload.result.pages,
      }
    }),
    [SET_INVENTORY_RECORD_LIST]: (state, action) => ({
      ...state,
      inventoryRecordList: action.payload
    }),
    [SET_INVENTORY_QUERY_PARAM]: (state, action) => ({
      ...state,
      inventoryQueryParam: action.payload
    }),
    [SET_INVENTORY_RECORD_QUERY_PARAM]: (state, action) => ({
      ...state,
      inventoryRecordQueryParam: action.payload
    }),
    [GET_INVENTORY_DETAIL_LIST]: (state, action) => ({
      ...state,
      inventoryDetailIn: {
        countsDate: action.payload.countsDate,
        countsUser: action.payload.countsUser,
        shelfName: action.payload.shelfName,
        status: action.payload.status,
        createTime: action.payload.createTime
      },
      inventoryDetailList: action.payload.result.data,
      inventoryDetailPage: {
        pageNo: action.payload.result.pageNo,
        pageSize: action.payload.result.pageSize,
        records: action.payload.result.records,
        pages: action.payload.result.pages,
      }
    }),
    [RESET_INVENTORY_RECORD]: (state, action) => ({
      ...state,
      inventoryRecordIn: {
        shelfName: '',
        createTime: '',
        createUser: ''
      },
      inventoryRecordList: [],
      inventoryRecordPage: {
        current: 1,
        pageSize: 20,
        records: 0,
        pages: 0,
      }
    }),
    [RESET_INVENTORY_DETAIL]: (state, action) => ({
      ...state,
      inventoryDetailIn: {
        shelfName: '',
        status: '',
        createTime: ''
      },
      inventoryDetailList: [],
      inventoryDetailPage: {
        current: 1,
        pageSize: 20,
        records: 0,
        pages: 0,
      }
    }),
    [GET_INVENTORY_DETAIL_PRINT_LIST]: (state, action) => ({
      ...state,
      inventoryDetailIn: {
        countsDate: action.payload.countsDate,
        countsUser: action.payload.countsUser,
        shelfName: action.payload.shelfName,
        status: action.payload.status,
        createTime: action.payload.createTime
      },
      inventoryDetailPrintList: action.payload.result.data
    })
  },

  children: [
    // subModule
  ]
}
