import { message } from 'antd'
import { fetchMaternity as fetchData } from 'Utils/fetch'
import apis from '../../apis.js'
import { SHOW_LIST_SPIN, SHOW_SPIN, SHOW_BUTTON_SPIN } from '../../../../global/action'
import { createAction } from 'redux-actions'

// ===========================> Action Types <=========================== //

export const CUSTOMER_LIST = 'spa/customer/CUSTOMER_LIST'
export const GET_CITY_LIST = 'spa/customer/GET_CITY_LIST' // 获取省市区信息
export const CENTER_POSITION = 'spa/customer/CENTER_POSITION' // 所有月子中心
export const GET_BASIC_INFO = 'spa/customer/GET_BASIC_INFO' // 获取基本信息
export const GET_PRE_INFO = 'spa/customer/GET_PRE_INFO' // 获取 预产信息
export const GET_ACCOUNT_INFO = 'spa/customer/GET_ACCOUNT_INFO' // 获取 账户信息
export const GET_CHECK_INFO = 'spa/customer/GET_CHECK_INFO' // 获取 入住信息
export const GET_PROCESS = 'spa/customer/GET_PROCESS' // 获取 跟进信息
export const GET_CONSUME = 'spa/customer/GET_CONSUME' // 获取 消费情况
export const GET_NURSE_LIST = 'spa/customer/GET_NURSE_LIST' // 获取跟进人员列表
export const SET_SAVE_DATA = 'spa/customer/SET_QUERY_DATA' // 新增保存数据
export const SAVE_INDEX_QUERY_DATA = 'spa/customer/SAVE_INDEX_QUERY_DATA' // 保存 客户管理 首页查询数据
export const SET_PROCESS_LIST = 'spa/customer/SET_PROCESS_LIST' // 设置跟进信息列表
export const RESET_PROCESS_LIST = 'spa/customer/RESET_PROCESS_LIST' // 重置跟进信息列表
export const SET_PROCESS_CONDITIONS = 'spa/customer/SET_PROCESS_CONDITIONS' // 设置跟进信息数据字典
export const SET_PROCESS_CUSTOMER_INFO = 'spa/customer/SET_PROCESS_CUSTOMER_INFO' // 设置跟进客户信息
export const RESET_PROCESS_CUSTOMER_INFO = 'spa/customer/RESET_PROCESS_CUSTOMER_INFO' // 重置跟进客户信息
export const SET_BABY_INFO = 'spa/customer/SET_BABY_INFO' // 设置宝宝信息
export const RESET_BABY_INFO = 'spa/customer/RESET_BABY_INFO' // 设置宝宝信息
export const CONSUME_CONDITIONS = 'spa/customer/CONSUME_CONDITIONS' // 获取消费数据字典
export const CONSUME_DETAIL = 'spa/customer/CONSUME_DETAIL' // 获取消费详情
export const CHECK_DETAIL = 'spa/customer/CHECK_DETAIL' // 获取入住详情
export const GET_CONTRACT = 'spa/customer/GET_CONTRACT' // 获取合同记录
export const CONTRACT_INFO = 'spa/customer/CONTRACT_INFO' // 获取合同详情
export const CONTRACT_STATUS_LIST = 'spa/customer/CONTRACT_STATUS_LIST' // 获取合同状态
export const DICTIONARY_LIST = 'spa/customer/DICTIONARY_LIST' // 获取合同状态

// ===========================> Actions <=========================== //

// 获取省市区信息
export const getCityList = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.customerManage.getCityList, arg, '').then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_CITY_LIST)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 新增客户信息 addCoustomerInfo
export const addCoustomerInfo = arg => dispatch => {
  return new Promise(function (resolve, reject) {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.customerManage.addCoustomerInfo, arg).then(res => {
      if (res.code === 0) {
        message.success('保存成功')
        dispatch(getBasicAndPreInfo(res.data))
        resolve({ status: 'success' })
      } else {
        message.error(res.errmsg)
        resolve({ status: 'error' })
      }
    })
  })
}

// 修改用户信息
export const modifyCoustomerInfo = arg => dispatch => {
  return new Promise(function (resolve, reject) {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.customerManage.modifyCoustomerInfo, arg).then(res => {
      if (res.code === 0) {
        message.success('修改成功')
        dispatch(getBasicAndPreInfo({ id: arg.id }))
        resolve({ status: 'success' })
      } else {
        message.error(res.errmsg)
        resolve({ status: 'error' })
      }
    })
  })
}

// 新增保存数据
export const setQueryData = (payload) => ({
  type: SET_SAVE_DATA,
  payload,
})

// 保存首页查询数据 saveIndexQueryData
export const saveIndexQueryData = (payload) => ({
  type: SAVE_INDEX_QUERY_DATA,
  payload,
})

// 获取跟进人员
export const getNurseList = arg => {
  return dispatch => {
    return fetchData(apis.customerManage.getNurseList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_NURSE_LIST)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取客户基本信息
export const getBasicInfo = arg => {
  return dispatch => {
    return fetchData(dispatch)(apis.customerManage.getBasicInfo, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_BASIC_INFO)(res.data))
        dispatch(setQueryData(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取客户基本信息（包含预产信息）
export const getBasicAndPreInfo = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_SPIN)(apis.customerManage.getBasicAndPreInfo, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_BASIC_INFO)(res.data))
        dispatch(setQueryData(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取预产信息
export const getPreInfo = arg => {
  return dispatch => {
    return fetchData(dispatch)(apis.customerManage.getPreInfo, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_PRE_INFO)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取账户信息
export const getAccountInfo = arg => {
  return dispatch => {
    return fetchData(dispatch)(apis.customerManage.getAccountInfo, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_ACCOUNT_INFO)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取入住信息
export const getCheckInfo = arg => {
  return dispatch => {
    return fetchData(dispatch)(apis.customerManage.getCheckInfo, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_CHECK_INFO)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取跟进信息
export const getProcess = arg => {
  return dispatch => {
    return fetchData(dispatch)(apis.customerManage.processList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_PROCESS)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取消费情况
export const getConsume = arg => {
  return dispatch => {
    return fetchData(dispatch)(apis.customerManage.consumeList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_CONSUME)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取合同情况
export const getContract = arg => {
  return dispatch => {
    return fetchData(dispatch)(apis.customerManage.contractList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(GET_CONTRACT)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取消费详情
export const getConsumeDetail = arg => {
  return dispatch => {
    return fetchData(dispatch)(apis.customerManage.consumeDetail, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(CONSUME_DETAIL)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取入住详情
export const getCheckDetail = arg => {
  return dispatch => {
    return fetchData(dispatch)(apis.customerManage.checkDetail, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(CHECK_DETAIL)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取合同详情
export const getContractInfo = arg => {
  return dispatch => {
    return fetchData(dispatch)(apis.customerManage.contractInfo, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(CONTRACT_INFO)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 新增/编辑 预产信息 addPreInfo
export const addPreInfo = (values) => {
  return dispatch => {
    return fetchData(dispatch, SHOW_SPIN)(apis.customerManage.addPreInfo, values).then(res => {
      if (res.code === 0) {
        message.success('保存成功', 1, () => {
          location.href = '/maternity/materCustomerManage'
        })
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取消费数据字典
export const consumeListConditions = arg => {
  return dispatch => {
    return fetchData(apis.customerManage.consumeConditions, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(CONSUME_CONDITIONS)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取入住状态据字典
export const checkStatusList = arg => {
  return dispatch => {
    return fetchData(apis.roomInfo.dictionaryList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(DICTIONARY_LIST)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取合同状态数据字典
export const getContractStatusList = arg => {
  return dispatch => {
    return fetchData(apis.contract.listConditions, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(CONTRACT_STATUS_LIST)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}
// 客户列表
export const getCustomerList = arg => {
  return dispatch => {
    return fetchData(dispatch, SHOW_LIST_SPIN)(apis.customerManage.customerList, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(CUSTOMER_LIST)(res.data))
        dispatch(setQueryData({}))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 获取所有月子中心
export const getCenterList = arg => {
  return dispatch => {
    return fetchData(apis.customerManage.nurseCenter, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(CENTER_POSITION)(res.data))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 置为有效 无效
export const changeStatus = (values, arg) => {
  return dispatch => {
    return fetchData(apis.customerManage.changeStatus, values).then(res => {
      if (res.code === 0) {
        dispatch(getCustomerList(arg))
      } else {
        message.error(res.errmsg)
      }
    })
  }
}

// 查询跟进列表
export const getProcessList = arg => dispatch => {
  return fetchData(dispatch)(apis.customerManage.processList, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_PROCESS_LIST)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 查询跟进详情
export const resetProcessList = arg => dispatch => {
  return createAction(RESET_PROCESS_LIST)
}

// 查询跟进客户信息
export const getProcessCustomer = arg => dispatch => {
  return fetchData(apis.customerManage.processCustomerInfo, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_PROCESS_CUSTOMER_INFO)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 重置跟进客户信息
export const resetProcessCustomer = arg => dispatch => {
  return createAction(RESET_PROCESS_CUSTOMER_INFO)
}

// 查询跟进字典集合
export const getProcessConditions = arg => dispatch => {
  return new Promise(function (resolve, reject) {
    fetchData(dispatch, SHOW_SPIN)(apis.customerManage.processConditons, arg).then(res => {
      if (res.code === 0) {
        dispatch(createAction(SET_PROCESS_CONDITIONS)(res.data))
        resolve({ status: 'success' })
      } else {
        message.error(res.errmsg)
        resolve({ status: 'error' })
      }
    })
  })
}

// 查询跟进详情
export const getProcessDetail = arg => dispatch => {
  return new Promise(function (resolve, reject) {
    fetchData(apis.customerManage.processDetail, arg).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success', result: res.data })
      } else {
        message.error(res.errmsg)
        resolve({ status: 'error' })
      }
    })
  })
}

// 添加跟进信息
export const addProcess = arg => dispatch => {
  return new Promise(function (resolve, reject) {
    fetchData(apis.customerManage.processAdd, arg).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success', result: res.data })
      } else {
        message.error(res.errmsg)
        resolve({ status: 'error' })
      }
    })
  })
}

// 修改跟进信息
export const modifyProcess = arg => dispatch => {
  return new Promise(function (resolve, reject) {
    fetchData(apis.customerManage.processModify, arg).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success', result: res.data })
      } else {
        message.error(res.errmsg)
        resolve({ status: 'error' })
      }
    })
  })
}

// 查询宝宝客户信息
export const getBabyCustomer = arg => dispatch => {
  return fetchData(apis.customerManage.babyDetail, arg).then(res => {
    if (res.code === 0) {
      dispatch(createAction(SET_BABY_INFO)(res.data))
    } else {
      message.error(res.errmsg)
    }
  })
}

// 重置宝宝客户信息
export const resetBabyCustomer = arg => dispatch => {
  return createAction(RESET_BABY_INFO)
}

// 修改宝宝客户信息
export const modifyBabyCustomer = arg => dispatch => {
  return new Promise(function (resolve, reject) {
    fetchData(dispatch, SHOW_BUTTON_SPIN)(apis.customerManage.babyModify, arg).then(res => {
      if (res.code === 0) {
        resolve({ status: 'success' })
      } else {
        message.error(res.errmsg)
        resolve({ status: 'error' })
      }
    })
  })
}

// ===========================> Reducer <=========================== //

const initialState = {
  result: [],
  page: {},
  centerList: [],
  getBasicInfo: {},
  getPreInfo: {},
  getAccountInfo: {},
  getCheckInfo: {
    result: [],
    page: {}
  },
  getProcess: {
    result: [],
    page: {}
  },
  processTypeList: [],
  getConsume: {
    result: [],
    page: {}
  },
  getContract: {
    result: [],
    page: {}
  },
  contractInfo: {},
  getNurseList: [],
  getSaveData: {},
  saveIndexQueryData: {
    currentPage: 1,
    pageSize: 20,
  },
  processConditions: {
    customerTypeList: [],
    processStatusList: [],
    sourceList: [],
    processTypeList: [],
  },
  consumeConditions: {
    consumeStatusList: [],
    customertypeList: [],
  },
  processList: [],
  processCustomerInfo: {},
  processPage: {
    current: 1,
    pageSize: 20,
    total: 0,
  },
  consumeDetail: {},
  checkDetail: {},
  babyInfo: {},
  contractCodeDTO: {},
  statusList: []
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CUSTOMER_LIST:
      return { ...state, result: action.payload.result, page: action.payload.page }
    case CENTER_POSITION:
      return { ...state, centerList: action.payload }
    case GET_BASIC_INFO:
      return { ...state, getBasicInfo: action.payload }
    case GET_PRE_INFO:
      return { ...state, getPreInfo: action.payload }
    case GET_ACCOUNT_INFO:
      return { ...state, getAccountInfo: action.payload }
    case GET_CHECK_INFO:
      return { ...state, getCheckInfo: action.payload }
    case GET_NURSE_LIST:
      return { ...state, getNurseList: action.payload }
    case SET_SAVE_DATA:
      return { ...state, getSaveData: action.payload }
    case SAVE_INDEX_QUERY_DATA:
      return { ...state, saveIndexQueryData: action.payload }
    case SET_PROCESS_CONDITIONS:
      return {
        ...state,
        processConditions: action.payload
      }
    case SET_PROCESS_LIST:
      return { ...state,
        processList: action.payload.result,
        processPage: {
          current: action.payload.page.currentPage,
          pageSize: action.payload.page.pageSize,
          total: action.payload.page.totalCount
        }}
    case RESET_PROCESS_LIST:
      return { ...state, processList: [], processPage: initialState.processPage }
    case SET_PROCESS_CUSTOMER_INFO:
      return { ...state, processCustomerInfo: action.payload }
    case RESET_PROCESS_CUSTOMER_INFO:
      return { ...state, processCustomerInfo: {}}
    case GET_CITY_LIST:
      return { ...state, getCityList: action.payload }
    case CONSUME_CONDITIONS:
      return {
        ...state,
        consumeConditions: action.payload
      }
    case GET_PROCESS:
      return {
        ...state,
        getProcess: action.payload
      }
    case GET_CONSUME:
      return {
        ...state,
        getConsume: action.payload
      }
    case CONSUME_DETAIL:
      return {
        ...state,
        consumeDetail: action.payload
      }
    case CHECK_DETAIL:
      return {
        ...state,
        checkDetail: action.payload
      }
    case CONTRACT_INFO:
      return {
        ...state,
        contractInfo: action.payload
      }
    case GET_CONTRACT:
      return {
        ...state,
        getContract: action.payload
      }
    case CONTRACT_STATUS_LIST:
      return {
        ...state,
        contractCodeDTO: action.payload
      }
    case DICTIONARY_LIST:
      return {
        ...state,
        statusList: action.payload.statusList
      }
    default:
      return state
  }
}
