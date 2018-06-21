// import { fetchSupplyChain as fetchData } from 'Utils/fetch'
// import apis from '../apis'

/**
 * Created with webstorm
 * User: HuangZeXia / huangzexiameishu@163.com
 * Date: 2018/3/1
 * Time: 上午9:56
 */
import { createAction } from 'redux-actions'
import { message } from 'antd'
import { fetchSupplyChain as fetchData } from 'Utils/fetch'
import apis from '../apis'
// import * as urls from 'Global/urls'
import { SHOW_LIST_SPIN, SHOW_SPIN, SHOW_BUTTON_SPIN } from 'Global/action'
import { fetchLogistics as fetchLogisticsData } from 'Utils/fetch'

// ===========================> Action Types <=========================== //
export const GET_ESHOP_LIST = '/spa/order/GET_ESHOP_LIST' // 电商店铺列表
export const GET_ESHOP_WAREHOUSE_LIST = '/spa/order/GET_ESHOP_WAREHOUSE_LIST' // 电商仓库列表
export const GET_EORDER_LIST = '/spa/order/GET_EORDER_LIST' // 电商订单列表
export const GET_EORDER_DEATIL = '/spa/order/GET_EORDER_DEATIL' // 电商订单详情
export const GET_ALLOCATE_ORDER_LIST = '/spa/order/GET_ALLOCATE_ORDER_LIST' // 调拨订单订单列表
export const GET_ALLOCATE_ORDER_DETAIL = '/spa/order/GET_ALLOCATE_ORDER_DETAIL' // 调拨订单订单详情
export const GET_WARE_HOUSE_LIST = '/spa/order/GET_WARE_HOUSE_LIST' // 供应链仓库
export const GET_ADD_WARE_HOUSE_LIST = '/spa/order/GET_ADD_WARE_HOUSE_LIST' // 供应链仓库
export const GET_WARE_HOUSE_CITY_LIST = '/spa/order/GET_WARE_HOUSE_CITY_LIST' // 供应链仓库城市
export const GET_GOODS_LIST = '/spa/order/GET_GOODS_LIST' // 添加货物
export const GET_SUPLLY_SHOP_LIST = '/spa/order/GET_SUPLLY_SHOP_LIST' // 获取供应链店铺仓库绑定店铺列表
export const GET_ALL_SUPLLY_SHOP_LIST = '/spa/order/GET_ALL_SUPLLY_SHOP_LIST' // 获取供应链所有店铺
export const GET_SHOP_WAREHOUSE_LIST = '/spa/order/GET_SHOP_WAREHOUSE_LIST' // 获取店铺仓库
export const GET_GOODS_TYPE_LIST = '/spa/order/GET_GOODS_TYPE_LIST' // 货物类别
export const GET_STOCK_LIST = '/spa/order/GET_STOCK_LIST' // 获取有库存的机构
export const GET_WAYBILL_DETAIL = '/spa/order/GET_WAYBILL_DETAIL' // 获取物流详情

// ===========================> Actions <=========================== //

// const getReq = {
//   allocationOrderId: '',
//   orderStatus: '',
//   outDepartmentName: '',
//   applyDepartmentName: '',
//   sortOrderId: '',
//   userName: '',
//   currentPage: 1,
//   pageSize: 10
// }

// 获取电商列表
export const getShopList = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.order.shopList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_ESHOP_LIST)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取电商仓库列表
export const getWareHouseList = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.order.getWareHouseList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_ESHOP_WAREHOUSE_LIST)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取电商订单列表
export const getEOrderList = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.order.queryEorderList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_EORDER_LIST)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取订单详情
export const getEOrderDetail = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_SPIN)(apis.order.queryEorderDetail, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_EORDER_DEATIL)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 生成分拣单
export const setEOrder = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.order.sortorder, arg).then(res => {
      if (res.code === 0) {
        message.success('操作成功！', 1, () => {
          window.location.reload(true)
        })
        dispatch(getEOrderList({ operatorStatus: 3 }))
        return res.code
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 生成合单
export const concatOrder = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.order.sortorder, arg).then(res => {
      if (res.code === 0) {
        message.success('操作成功！', 1, () => {
          window.location.reload(true)
        })
        dispatch(getEOrderList({ operatorStatus: 3 }))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取调拨订单列表
export const getAllocateOrderList = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.order.allocationList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_ALLOCATE_ORDER_LIST)({ ...res.data, filter: arg }))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 调拨订单删除
export const allocateOrderDel = (arg, filterReq) => {
  return dispatch => {
    return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.order.allocationDel, arg).then(res => {
      if (res.code === 0) {
        message.success('操作成功！')
        dispatch(getAllocateOrderList(filterReq))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取调拨订单详情
export const getAllocateOrderDetail = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_SPIN)(apis.order.allocationDetail, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_ALLOCATE_ORDER_DETAIL)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 添加货物
export const getGoodsList = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.common.goodsList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_GOODS_LIST)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取供应链店铺仓库绑定店铺列表
export const supplyShopList = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.order.supplyShopList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_SUPLLY_SHOP_LIST)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 供应链店铺添加选择
export const supplyCreateShop = arg => {
  return dispatch => {
    return fetchData(dispatch)(apis.order.supplyCreateShop, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_ALL_SUPLLY_SHOP_LIST)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 供应链店铺保存
export const saveShop = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.order.saveShop, arg).then(res => {
      if (res.code === 0) {
        message.success('添加成功！')
        dispatch(supplyShopList({
          shopType: '1'
        }))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 供应链店铺删除
export const delShop = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.order.delShop, arg).then(res => {
      if (res.code === 0) {
        message.success('删除成功！')
        dispatch(supplyShopList({
          shopType: '1'
        }))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取店铺仓库
export const getShopWareHouse = arg => {
  return dispatch => {
    return fetchData(dispatch)(apis.order.getShopWareHouse, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_SHOP_WAREHOUSE_LIST)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 店铺绑定仓库
export const bindShopHouse = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.order.bindShopHouse, arg).then(res => {
      if (res.code === 0) {
        message.success('操作成功!')
        return res.code
      } else {
        message.error(res.errmsg)
      }
    }).then(res => {
      return res
    })
  }
}

// 获取供应链仓库
export const getSupllyWareHouseList = arg => {
  return dispatch => {
    return fetchData(apis.order.getWareHouseList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_WARE_HOUSE_LIST)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 供应链仓库城市
export const wareHouseCity = arg => {
  return dispatch => {
    return fetchData(dispatch)(apis.order.wareHouseCity, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_WARE_HOUSE_CITY_LIST)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 供应链仓库刷新
export const refurbishWareHouseList = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.order.refurbishWareHouseList, arg).then(res => {
      if (res.code === 0) {
        message.success('刷新成功！')
        dispatch(getSupllyWareHouseList())
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 供应链仓库城市绑定
export const wareHouseBindCity = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.order.wareHouseBindCity, arg).then(res => {
      if (res.code === 0) {
        message.success('操作成功！')
        return res.code
      } else {
        message.error(res.errmsg)
      }
    }).then(res => {
      return res
    })
  }
}

// 获取货物类别
export const getGoodsTypeList = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.common.codeList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_GOODS_TYPE_LIST)(res.data))
        return res.data
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 生成调拨单
export const setAllocationOrder = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.order.allocation, arg).then(res => {
      if (res.code === 0) {
        message.success('保存成功', 1, () => {
          // location.href = urls.SUPPLY_CATE_ORDER
          history.go(-1)
          dispatch(getAllocateOrderList({
            applyDepartmentNo: localStorage.getItem('applyDepartmentNo'),
            applyDepartmentName: localStorage.getItem('applyDepartmentName')
          }))
        })
        // dispatch(getAllocateOrderList(getReq))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 调拨单编辑
export const allocationModify = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.order.allocationModify, arg).then(res => {
      if (res.code === 0) {
        message.success('操作成功', 1, () => {
          // location.href = urls.SUPPLY_CATE_ORDER
          history.go(-1)
          dispatch(getAllocateOrderList({
            applyDepartmentNo: localStorage.getItem('applyDepartmentNo'),
            applyDepartmentName: localStorage.getItem('applyDepartmentName')
          }))
        })
        // dispatch(getAllocateOrderList(getReq))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取物流详情
export const getWaybillDetail = arg => {
  return dispatch => {
    return fetchLogisticsData(dispatch, SHOW_SPIN)(apis.logistics.waybill, arg).then(res => {
      if (res.code === 0) {
        return res.data
        // dispatch(createAction(GET_WAYBILL_DETAIL)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

export const getShopListByPage = arg => {
  return fetchData(apis.logistics.waybill, arg).then(res => {
    if (res.code === 0) {
      return res.data
      // dispatch(createAction(GET_WAYBILL_DETAIL)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// ===========================> Reducer <=========================== //

const initialState = {
  loading: false,
  eshopList: [],
  eshopWareHouseList: [],
  eorderList: [],
  page: {
    currentPage: 1,
    pageSize: 10,
    records: 0,
    pages: 0,
  },
  eorderDetailId: '',
  eorderDetailTab: [],
  allocateOrderList: [],
  allocateOrderFilter: {},
  allocatePage: {
    currentPage: 1,
    pageSize: 10,
    records: 0,
    pages: 0,
  },
  allocateOrderDetail: {},
  wareHouseList: [],
  addHouseList: [],
  getWareHouseCityList: [],
  getGoodsList: [],
  getGoodsListPage: {},
  getSupplyShopList: [],
  getAllSupplyShopList: [],
  getShopHouseList: [],
  goodsTypeList: [],
  getStockList: []
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_ESHOP_LIST:
      return {
        ...state,
        eshopList: action.payload,
      }
    case GET_ESHOP_WAREHOUSE_LIST:
      return {
        ...state,
        eshopWareHouseList: action.payload
      }
    case GET_EORDER_LIST:
      return {
        ...state,
        eorderList: action.payload.data,
        page: {
          currentPage: action.payload.pageNo,
          pageSize: action.payload.pageSize,
          records: action.payload.records,
          pages: action.payload.pages,
        }}
    case GET_EORDER_DEATIL:
      return {
        ...state,
        eorderDetailId: action.payload ? action.payload.outerOrderId : '',
        eorderDetailTab: action.payload ? action.payload.orderSkuList : '',
      }
    case GET_ALLOCATE_ORDER_LIST:
      return {
        ...state,
        allocateOrderList: action.payload.data,
        allocatePage: {
          currentPage: action.payload.pageNo,
          pageSize: action.payload.pageSize,
          records: action.payload.records,
          pages: action.payload.pages,
        },
        allocateOrderFilter: action.payload.filter
      }
    case GET_ALLOCATE_ORDER_DETAIL:
      return {
        ...state,
        allocateOrderDetail: action.payload,
      }
    case GET_WARE_HOUSE_LIST:
      return {
        ...state,
        wareHouseList: action.payload,
      }
    case GET_ADD_WARE_HOUSE_LIST:
      return {
        ...state,
        addHouseList: action.payload,
      }
    case GET_WARE_HOUSE_CITY_LIST:
      return {
        ...state,
        getWareHouseCityList: action.payload.provinces,
      }
    case GET_GOODS_LIST:
      return {
        ...state,
        getGoodsList: action.payload.result,
        getGoodsListPage: {
          currentPage: action.payload.pageNo,
          pageSize: action.payload.pageSize,
          records: action.payload.records,
          pages: action.payload.pages,
        }
      }
    case GET_SUPLLY_SHOP_LIST:
      return {
        ...state,
        getSupplyShopList: action.payload,
      }
    case GET_ALL_SUPLLY_SHOP_LIST:
      return {
        ...state,
        getAllSupplyShopList: action.payload,
      }
    case GET_SHOP_WAREHOUSE_LIST:
      return {
        ...state,
        getShopHouseList: action.payload,
      }
    case GET_GOODS_TYPE_LIST:
      return {
        ...state,
        goodsTypeList: action.payload.goodsType,
      }
    case GET_STOCK_LIST:
      return {
        ...state,
        getStockList: action.payload,
      }
    case GET_WAYBILL_DETAIL:
      return {
        ...state,
        waybillDetail: action.payload,
      }
    default:
      return state
  }
}
