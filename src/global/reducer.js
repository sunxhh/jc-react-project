import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
// import storage from 'Utils/storage'
import { reducers as baseReducers } from '../modules/Base/reduck'
import { reducers as commonlyReducers } from '../modules/Commonly/reduck'
import { reducers as eduReducers } from '../modules/Edu/reduck'
import { reducers as maternityReducers } from '../modules/Maternity/reduck'
import { reducers as teenReducers } from '../modules/WebSite/TeenCenter/reduck'
import { reducers as sportReducers } from '../modules/Sport/reduck'
// import { reducers as reatilReducers } from '../modules/Retail/reduck'
import { reducers as supplyChainReducers } from '../modules/SupplyChain/reduck'
import { reducers as purchaseReducers } from '../modules/Purchase/reduck'
import { reducers as orderCenterReducers } from '../modules/OrderCenter/reduck'
import { reducers as antiqueReducers } from '../modules/WebSite/Antique/reduck'

import {
  MENU_TREE_LIST,
  SHOW_SPIN,
  SHOW_BUTTON_SPIN,
  SHOW_LIST_SPIN,
  SET_QINIU_TOKEN,
  SWITCH_LIST_LOADING,
  SWITCH_BUTTON_LOADING,
  ORG_LIST,
  SWITCH_DISABLED,
  SET_ALI_TOKEN,
  ORG_LIST_LEVEL,
  SET_USER_INFO,
  COMMON_ORG_LIST
} from './action'
import { isEmpty } from '../utils/lang'

// ===========================> router Reducer <=========================== //

const LOCATION_CHANGE = '@@router/LOCATION_CHANGE'

const routerInitialState = {
  pre: '',
  location: null
}

const router = function (state = routerInitialState, action) {
  switch (action.type) {
    case LOCATION_CHANGE:
      // window.scrollTo(0, 0)
      const selector = document.querySelector('#jc-sub-menu')
      const maskDivs = document.querySelectorAll('.mask-div')
      for (let i = 0, length = maskDivs.length; i < length; i++) {
        const maskDiv = maskDivs[i]
        if (maskDiv) {
          const unmountResult = ReactDOM.unmountComponentAtNode(maskDiv)
          if (unmountResult) {
            maskDiv.parentNode.removeChild(maskDiv)
          }
        }
      }
      return {
        pre: state.location && state.location.pathname,
        location: routerReducer(action).payload,
        menuScrollTop: selector && selector.scrollTop
      }
    default:
      return { ...state }
  }
}

// ===========================> common Reducer <=========================== //

const commonInitialState = {
  comDisabled: false,
  showSpin: { bool: false, content: '' },
  showButtonSpin: false,
  showListSpin: false,
  menuTreeList: [],
  auths: {},
  qiniuToken: '',
  switchListLoading: false,
  switchButtonLoading: false,
  orgList: [],
  orgId: '',
  orgLevel: '',
  orgCode: '',
  orgName: '',
  aliToken: {},
  userInfo: {},
  commonOrgList: []
}

const getRoutes = (menuTreeList, res) => {
  const result = [].concat(res)
  if (isEmpty(menuTreeList)) {
    return res
  } else {
    let children = []
    menuTreeList.forEach(item => {
      result.push(item)
      children = children.concat(item.children || [])
    })
    return getRoutes(children, result)
  }
}

const parseToObject = (data) => {
  const menusAndBtns = getRoutes(data)
  const result = {}
  const menus = menusAndBtns && menusAndBtns.filter(item => item && item.menuType === '1')
  menus && menus.forEach(item => {
    if (item.children && !isEmpty(item.children) && item.children[0].menuType === '2') {
      const btns = item.children.map(btn => btn.menuUrl.split('/').reverse()[0])
      result[item.menuUrl] = btns
    } else if (item.menuUrl.startsWith('/')) {
      result[item.menuUrl] = []
    }
  })
  return result
}

export const common = (state = commonInitialState, action) => {
  switch (action.type) {
    case SHOW_SPIN:
      return { ...state, showSpin: action.payload }
    case SHOW_BUTTON_SPIN:
      return { ...state, showButtonSpin: action.payload.bool }
    case SHOW_LIST_SPIN:
      return { ...state, showListSpin: action.payload.bool }
    case SWITCH_DISABLED: {
      return { ...state, comDisabled: action.payload }
    }
    case MENU_TREE_LIST:
      return { ...state, auths: parseToObject(action.payload), menuTreeList: action.payload }
    case SET_QINIU_TOKEN:
      return { ...state, qiniuToken: action.payload }
    case SWITCH_LIST_LOADING:
      return { ...state, switchListLoading: action.payload }
    case SWITCH_BUTTON_LOADING:
      return { ...state, switchButtonLoading: action.payload }
    case ORG_LIST:
      return {
        ...state,
        orgList: action.payload.myOrgList,
        orgId: action.payload.myOrgId,
        orgLevel: action.payload.myOrgLevel,
      }
    case ORG_LIST_LEVEL:
      return {
        ...state,
        orgList: action.payload.myOrgList,
        orgId: action.payload.myOrgId,
        orgLevel: action.payload.myOrgLevel,
        orgCode: action.payload.myOrgCode,
        orgName: action.payload.myOrgName
      }
    case SET_ALI_TOKEN:
      return { ...state, aliToken: action.payload }
    case SET_USER_INFO:
      // storage.set('userInfo', action.payload)
      return { ...state, userInfo: action.payload }
    case COMMON_ORG_LIST:
      return {
        ...state,
        commonOrgList: action.payload
      }
    default:
      return state
  }
}

// const rootReducer = combineReducers({
//   router,
//   common,
//   ...baseReducers,
//   ...commonlyReducers,
//   ...eduReducers,
//   ...maternityReducers,
//   ...sportReducers,
//   ...teenReducers,
//   retail: combineReducers(reatilReducers),
//   supplyChain: combineReducers(supplyChainReducers),
// })
const rootReducer = {
  router,
  common,
  ...baseReducers,
  ...commonlyReducers,
  ...eduReducers,
  ...maternityReducers,
  ...sportReducers,
  ...teenReducers,
  // retail: combineReducers(reatilReducers),
  supplyChain: combineReducers(supplyChainReducers),
  purchase: combineReducers(purchaseReducers),
  orderCenter: combineReducers(orderCenterReducers),
  antique: combineReducers(antiqueReducers),
}

export default rootReducer
