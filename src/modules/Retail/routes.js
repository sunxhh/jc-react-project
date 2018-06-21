import * as urls from 'Global/urls'
import { RouteHelper } from 'Utils/helper'
import RetailModule from 'bundle-loader?lazy!./'

const genRoute = (path, breadcrumbName, parentPath = urls.HOME) =>
  RouteHelper.genRoute(path, breadcrumbName, RetailModule, parentPath)

export default [
  genRoute(urls.RETAIL, '零售模块'),
  genRoute(urls.RETAIL_GOODS, '商品中心', urls.RETAIL),
  genRoute(urls.RETAIL_GOODS_ADD, '新增商品', urls.RETAIL_GOODS),
  genRoute(`${urls.RETAIL_GOODS_DETAIL}/:goodsNo`, '商品详情', urls.RETAIL_GOODS),
  genRoute(`${urls.RETAIL_GOODS_EDIT}/:goodsNo`, '编辑商品', urls.RETAIL_GOODS),
  genRoute(urls.RETAIL_CATEGORY, '分类管理', urls.RETAIL_GOODS),
  genRoute(urls.RETAIL_STORE_GOODS, '门店商品', urls.RETAIL_GOODS),
  genRoute(`${urls.RETAIL_STORE_GOODS_DETAIL}/:goodsNo`, '商品详情', urls.RETAIL_STORE_GOODS),
  genRoute(urls.RETAIL_BRAND_PRICE, '品牌价格', urls.RETAIL_GOODS),
  genRoute(urls.RETAIL_SELLING_PRICE, '差异价格', urls.RETAIL_GOODS),
  genRoute(urls.RETAIL_GOODS_CATE, '类别显示', urls.RETAIL_GOODS),
  genRoute(urls.RETAIL_ORDER, '零售订单', urls.RETAIL),
  genRoute(`${urls.RETAIL_ORDER_DETAIL}/:orderNo`, '零售订单详情', urls.RETAIL_ORDER),
  genRoute(urls.RETAIL_BILL, '关账单据', urls.RETAIL),
  genRoute(`${urls.RETAIL_BILL_ORDER}/:accountNo`, '关账单据订单', urls.RETAIL_BILL),
  genRoute(`${urls.RETAIL_BILL_ORDER_DETAIL}/:orderNo`, '关账单据订单详情', urls.RETAIL_BILL),
  genRoute(urls.RETAIL_REPORT, '报表管理', urls.RETAIL),
  genRoute(urls.RETAIL_REPORT_TIME, '销售时间带分析', urls.RETAIL_REPORT),
  genRoute(urls.RETAIL_SALE_DETAIL, '销售明细表', urls.RETAIL_REPORT),
  genRoute(urls.RETAIL_SALE_RANK, '销量排行表', urls.RETAIL_REPORT),
  genRoute(urls.RETAIL_SHELF, '货架管理', urls.RETAIL),
  genRoute(urls.RETAIL_SHELF_LIST, '货架列表', urls.RETAIL_SHELF),
  genRoute(`${urls.RETAIL_SHELF_LIST_DETAIL}/:shelfNo`, '查看库存', urls.RETAIL_SHELF_LIST),
  genRoute(`${urls.RETAIL_SHELF_LIST_ADD}/:shelfNo`, '商品配置', urls.RETAIL_SHELF_LIST),
  genRoute(urls.RETAIL_SHELF_MONITOR, '货架监控', urls.RETAIL_SHELF),
  genRoute(urls.RETAIL_SHELF_WARN, '预警设置', urls.RETAIL_SHELF),
  genRoute(urls.RETAIL_SHELF_REPLE, '补货单', urls.RETAIL_SHELF),
  genRoute(`${urls.RETAIL_SHELF_REPLE_ADD}/:shelfNo`, '补货录入', urls.RETAIL_SHELF_REPLE),
  genRoute(`${urls.RETAIL_SHELF_REPLE_DETAIL}/:shelfNo`, '补货单详情', urls.RETAIL_SHELF_REPLE),
  genRoute(urls.RETAIL_STOCK, '库存管理', urls.RETAIL),
  genRoute(urls.RETAIL_STOCK_LIST, '库存查询', urls.RETAIL_STOCK),
  genRoute(urls.RETAIL_STOCK_DISTRIBUTE, '库存分布', urls.RETAIL_STOCK_LIST),
  genRoute(urls.RETAIL_STOCK_INVENTORY, '库存盘点', urls.RETAIL_STOCK),
  genRoute(urls.RETAIL_STOCK_INVENTORY_DETAIL, '库存盘点详情', urls.RETAIL_STOCK_INVENTORY),
  genRoute(urls.RETAIL_STOCK_INVENTORY_RECORD, '库存盘点录入', urls.RETAIL_STOCK_INVENTORY),
  genRoute(urls.RETAIL_STOCK_LOSS_OVERFLOW, '报损报溢', urls.RETAIL_STOCK),
  genRoute(urls.RETAIL_STOCK_LOSS_OVERFLOW_DETAIL, '报损报溢详情', urls.RETAIL_STOCK_LOSS_OVERFLOW)
]
