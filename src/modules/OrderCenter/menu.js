import * as urls from 'Global/urls'
import { MenuHelper } from 'Utils/helper'

const { genMenu, Buttons, CRUDButtons } = MenuHelper

export default genMenu('订单中心', urls.ORDER_CENTER, null, 'database', [
  genMenu('模板管理', urls.ORDER_CENTER_TEMPLATE, [
    ...CRUDButtons,
    Buttons.DEFINE('enable', '启用')
  ], 'schedule'),

  genMenu('订单管理', urls.ORDER_CENTER_ORDER, [
    ...CRUDButtons,
    Buttons.DEFINE('apply', '申请退款')
  ], 'inbox'),

  genMenu('退款管理', urls.ORDER_CENTER_REFUND, [
    ...CRUDButtons,
    Buttons.DEFINE('audit', '审核')
  ], 'pay-circle-o')
])
