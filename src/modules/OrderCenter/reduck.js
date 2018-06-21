import { reducer as order } from './order/reduck'
import { reducer as refund } from './refund/reduck'
import { reducer as template } from './template/reduck'

export const reducers = {
  order,
  refund,
  template
}
