import * as urls from 'Global/urls'
import { RouteHelper } from 'Utils/helper'
import SupplyChainModule from 'bundle-loader?lazy!./index'

const genRoute = (path, breadcrumbName, parentPath = urls.HOME) =>
  RouteHelper.genRoute(path, breadcrumbName, SupplyChainModule, parentPath)

export default [
  genRoute(urls.SUPPLY_CHAIN_PURCHASE_MODULE, '供应链'),
  genRoute(urls.SUPPLY_GOODS, '货物管理'),
  genRoute(urls.SUPPLY_GOODS_CLASSIFY, '货物分类'),
  genRoute(urls.SUPPLY_GOODS_SPEC, '货物规格'),
  genRoute(urls.SUPPLY_GOODS_CENTER, '货物中心'),
  genRoute(urls.SUPPLY_GOODS_CENTER_ADD, '新增货物', urls.SUPPLY_GOODS_CENTER),
  genRoute(`${urls.SUPPLY_GOODS_CENTER_SPEC_EDIT}/:id`, '规格编辑', urls.SUPPLY_GOODS_CENTER),
  genRoute(`${urls.SUPPLY_GOODS_CENTER_EDIT}/:id`, '货物编辑', urls.SUPPLY_GOODS_CENTER),
  genRoute(`${urls.SUPPLY_GOODS_CENTER_DETAIL}/:id`, '货物详情', urls.SUPPLY_GOODS_CENTER),
  genRoute(urls.SUPPLY_GOODS_FORMULA, '配方设置'),
  genRoute(`${urls.SUPPLY_GOODS_FORMULA_BOUND}/:skuNo`, '配方绑定', urls.SUPPLY_GOODS_FORMULA),
  genRoute(`${urls.SUPPLY_GOODS_FORMULA_EDIT}/:skuNo`, '配方编辑', urls.SUPPLY_GOODS_FORMULA),
  genRoute(`${urls.SUPPLY_GOODS_FORMULA_INFO}/:skuNo`, '配方详情', urls.SUPPLY_GOODS_FORMULA),
  genRoute(urls.SUPPLY_PURCHASE, '采购管理'),
  genRoute(urls.SUPPLY_PURCHASE_PROVIDER, '供应商管理'),
  genRoute(urls.SUPPLY_PURCHASE_PROVIDER_ADD, '新增', urls.SUPPLY_PURCHASE_PROVIDER),
  genRoute(`${urls.SUPPLY_PURCHASE_PROVIDER_EDIT}/:id`, '编辑', urls.SUPPLY_PURCHASE_PROVIDER),
  genRoute(`${urls.SUPPLY_PURCHASE_PROVIDER_DETAIL}/:id`, '详情', urls.SUPPLY_PURCHASE_PROVIDER),
  genRoute(urls.SUPPLY_PURCHASE_CONTRACT, '采购合同'),
  genRoute(urls.SUPPLY_PURCHASE_CONTRACT_ADD, '新增', urls.SUPPLY_PURCHASE_CONTRACT),
  genRoute(`${urls.SUPPLY_PURCHASE_CONTRACT_DETAIL}/:id`, '详情', urls.SUPPLY_PURCHASE_CONTRACT),
  genRoute(`${urls.SUPPLY_PURCHASE_CONTRACT_EDIT}/:id`, '编辑', urls.SUPPLY_PURCHASE_CONTRACT),
  genRoute(urls.SUPPLY_PURCHASE_PLAN, '采购计划'),
  genRoute(urls.SUPPLY_PURCHASE_ORDER, '采购订单'),
  genRoute(urls.SUPPLY_PURCHASE_EDITORDER, '编辑订单', urls.SUPPLY_PURCHASE_ORDER),
  genRoute(urls.SUPPLY_PURCHASE_ORDERDETAIL, '订单详情', urls.SUPPLY_PURCHASE_ORDER),
  genRoute(urls.SUPPLY_PURCHASE_WAREHOUSEDETAIL, '入库单详情', urls.SUPPLY_PURCHASE_ORDER),
]
