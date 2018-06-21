import { combineReducers } from 'redux'
// import { fetchSupplyChain as fetchData } from 'Utils/fetch'
// import apis from '../apis'

// ===========================> Action Types <=========================== //

// ===========================> Actions <=========================== //

// ===========================> Reducer <=========================== //
import { reducer as classify } from './classify/reduck'
import { reducer as spec } from './spec/reduck'
import { reducer as center } from './center/reduck'
import { reducer as formula } from './formula/reduck'

export const reducer = combineReducers({
  classify,
  center,
  formula,
  spec
})
