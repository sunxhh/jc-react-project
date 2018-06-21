import storage from './storage'
import axios from 'axios'
import { message } from 'antd'
import { baseUrl, memberUrl, maternityUrl, sportUrl, supplyChainUrl, retailUrl, logisticsUrl, reportUrl, memberCenterUrl, memberPointUrl, memberCardUrl, orderCenterUrl, petUrl } from '../config'
import * as urls from 'Global/urls'
import { showSpin, showBtnSpin, showListSpin, SHOW_BUTTON_SPIN, SHOW_LIST_SPIN } from 'Global/action'

let _userTicket = null

export function initUserInfo(ticket) {
  _userTicket = ticket
}

function fetcherCreator(url, userInfo) {
  const fetcher = axios.create({
    method: 'post',
    baseURL: url,
    withCredentials: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'ticket': _userTicket,
    }
  })

  fetcher.interceptors.request.use(function (config) {
    const userInfo = storage.get('userInfo')
    config.headers = {
      ...config.headers,
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'ticket': userInfo && userInfo.ticket
    }
    if (!config.data) { // 解决不传参时，Content-Type 不生效，服务器返回 415 的问题
      config.data = {}
    }
    // if (config.url.startsWith('/api/order')) {
    //   config.headers.ticket = 'db09465875fc459799793531c0018c28'
    // }
    return config
  }, function (error) {
    return Promise.reject(error)
  })

  fetcher.interceptors.response.use(function (response) {
    if (response.data.code === 2 || response.data.code === 3) {
      storage.clear()
      initUserInfo(null)
      location.href = urls.LOGIN
      return
    }
    return response.data
  }, function (error) {
    return Promise.reject(error)
  })

  return fetcher
}

// 根据类型获取loading action
const getLoadingFn = (spinType) => {
  let loadingFn = showSpin
  if (spinType === SHOW_LIST_SPIN) {
    loadingFn = showListSpin
  } else if (spinType === SHOW_BUTTON_SPIN) {
    loadingFn = showBtnSpin
  }
  return loadingFn
}

// 包装fetch
const fetchGenerator = poster => (dispatch, spinType) => {
// 如果dispatch不为函数，则说明不需要loading效果，直接发送请求
  if (typeof dispatch === 'function') {
    const loadingFn = getLoadingFn(spinType)
    return (api, arg, mes = '正在加载数据...', errMes = '请求异常') =>
      new Promise((resolve, reject) => {
        dispatch(loadingFn({ bool: true, content: mes }))
        return poster(api, arg)
          .then(res => {
            dispatch(loadingFn({ bool: false, content: '' }))
            resolve(res)
          }).catch(error => {
            console.error('*** fetch error ***', error)
            dispatch(loadingFn({ bool: false, content: '' }))
            message.error(errMes)
            reject(error)
          })
      })
  } else {
    const api = dispatch
    const arg = spinType
    return new Promise((resolve, reject) => {
      return poster(api, arg)
        .then(res => {
          resolve(res)
        }).catch(error => {
          console.error('*** fetch error ***', error)
          message.error('请求异常')
          reject(error)
        })
    })
  }
}

const userInfo = storage.get('userInfo')
const defaultFetcher = fetcherCreator(baseUrl, userInfo)
const memberFetcher = fetcherCreator(memberUrl, userInfo)
const maternityFetcher = fetcherCreator(maternityUrl, userInfo)
const sportFetcher = fetcherCreator(sportUrl, userInfo)
const supplyChainFetcher = fetcherCreator(supplyChainUrl, userInfo)
const retailFetcher = fetcherCreator(retailUrl, userInfo)
const reportFetcher = fetcherCreator(reportUrl, userInfo)
const logisticsFetcher = fetcherCreator(logisticsUrl, userInfo)
const memberCenterFetcher = fetcherCreator(memberCenterUrl, userInfo)
const memberPointFetcher = fetcherCreator(memberPointUrl, userInfo)
const memberCardFetcher = fetcherCreator(memberCardUrl, userInfo)
const orderCenterFetcher = fetcherCreator(orderCenterUrl, userInfo)
const petFetcher = fetcherCreator(petUrl, userInfo)

export default fetchGenerator(defaultFetcher.post)
export const fetchMember = fetchGenerator(memberFetcher.post)
export const fetchMaternity = fetchGenerator(maternityFetcher.post)
export const fetchSport = fetchGenerator(sportFetcher.post)
export const fetchSupplyChain = fetchGenerator(supplyChainFetcher.post)
export const fetchRetail = fetchGenerator(retailFetcher.post)
export const fetchReport = fetchGenerator(reportFetcher.post)
export const fetchLogistics = fetchGenerator(logisticsFetcher.post)
export const fetchMemberCenter = fetchGenerator(memberCenterFetcher.post)
export const fetchMemberPoint = fetchGenerator(memberPointFetcher.post)
export const fetchMemberCard = fetchGenerator(memberCardFetcher.post)
export const fetchOrderCenter = fetchGenerator(orderCenterFetcher.post)
export const fetchPet = fetchGenerator(petFetcher.post)

