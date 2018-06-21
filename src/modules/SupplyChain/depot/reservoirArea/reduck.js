import { createAction } from 'redux-actions'
import { fetchSupplyChain as fetchData } from 'Utils/fetch'
import apis from '../../apis'
import { SHOW_LIST_SPIN } from 'Global/action'
import { message } from 'antd'

// ===========================> Action Types <=========================== //

const GET_AREA_LIST = 'spa/SupplyChain/qualityWatch/GET_AREA_LIST' // 保质期监控
const GET_GOODSCATE_LIST = 'spa/SupplyChain/qualityWatch/GET_GOODSCATE_LIST' // 保质期监控

// ===========================> Actions <=========================== //

export const getAreaList = arg => dispatch =>
  fetchData(dispatch, SHOW_LIST_SPIN)(apis.depot.houseArea.areaList, arg)
    .then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_AREA_LIST)(res.data))
      }
    })

export const handleDelete = arg => dispatch => {
  return fetchData(apis.depot.houseArea.delete, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
      return false
    } else {
      return true
    }
  })
}

export const areaAdd = arg => {
  return dispatch => {
    return fetchData(dispatch)(apis.depot.houseArea.add, arg, '正在保存数据....').then(res => {
      if (parseInt(res.code) === 0) {
        return true
      } else {
        message.warn(`新增失败-${res.errmsg}`)
      }
    })
  }
}

export const getAreaDetail = (arg) => dispatch => {
  return fetchData(apis.depot.houseArea.detail, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
      return false
    } else {
      return res.data
    }
  })
}

export const areaModify = (arg) => dispatch => {
  return fetchData(apis.depot.houseArea.modify, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
      return false
    } else {
      return true
    }
  })
}

export const getGoodsCateList = (arg) => dispatch => {
  fetchData(apis.depot.houseArea.goodscatg, arg).then(res => {
    if (res.code !== 0) {
      message.error(res.errmsg)
    } else {
      dispatch(createAction(GET_GOODSCATE_LIST)(res.data))
    }
  })
}

// ===========================> Reducer <=========================== //

const initialState = {
  areaList: [],
  areaPage: {},
  goodsCateList: []
}

export const reducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_AREA_LIST: {
      return {
        ...state,
        areaList: action.payload.data,
        areaPage: {
          pageNo: action.payload.pageNo,
          pageSize: action.payload.pageSize,
          records: action.payload.records,
          pages: action.payload.pages
        },
      }
    }
    case GET_GOODSCATE_LIST: {
      return {
        ...state,
        goodsCateList: action.payload.map(item => {
          return {
            label: item.goodsCatgName,
            value: item.goodsCatgNo,
            key: item.goodsCatgNo,
            children: item.childGoodsCatgList && item.childGoodsCatgList.map(i => (
              {
                label: i.goodsCatgName,
                value: i.goodsCatgNo,
                key: i.goodsCatgNo,
                children: i.childGoodsCatgList && i.childGoodsCatgList.map(ele => (
                  {
                    label: ele.goodsCatgName,
                    value: ele.goodsCatgNo,
                    key: ele.goodsCatgNo,
                  }
                ))
              }
            ))
          }
        })
      }
    }
    default:
      return state
  }
}
