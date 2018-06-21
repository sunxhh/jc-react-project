import * as urls from 'Global/urls'
import { RouteHelper } from 'Utils/helper'
import OrderCenterModule from 'bundle-loader?lazy!../OrderCenter'

const genRoute = (path, breadcrumbName, parentPath = urls.HOME) =>
  RouteHelper.genRoute(path, breadcrumbName, OrderCenterModule, parentPath)

export default [
  genRoute(urls.ORDER_CENTER, '订单中心'),
  genRoute(urls.ORDER_CENTER_TEMPLATE, '模板管理'),
  genRoute(urls.ORDER_CENTER_TEMPLATE_ADD, '新增模板', urls.ORDER_CENTER_TEMPLATE),
  genRoute(`${urls.ORDER_CENTER_TEMPLATE_ADD}/:id`, '编辑模板', urls.ORDER_CENTER_TEMPLATE),
  genRoute(`${urls.ORDER_CENTER_TEMPLATE_DETAIL}/:id`, '模板详情', urls.ORDER_CENTER_TEMPLATE),

  genRoute(urls.ORDER_CENTER_ORDER, '订单管理'),
  genRoute(`${urls.ORDER_CENTER_ORDER_DETAIL}/:id`, '订单详情', urls.ORDER_CENTER_ORDER),

  genRoute(urls.ORDER_CENTER_REFUND, '退款管理'),
  genRoute(`${urls.ORDER_CENTER_REFUND_DETAIL}/:id`, '退款详情', urls.ORDER_CENTER_REFUND),
  genRoute(`${urls.ORDER_CENTER_REFUND_ADD}/:id`, '退款申请', urls.ORDER_CENTER_ORDER),

]
