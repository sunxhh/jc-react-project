import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import * as urls from 'Global/urls'

import GoodsList from './goods'
import GoodAdd from './goods/add'
import GoodDetail from './goods/detail'
import CategoryList from './category'
import StoreGoodsList from './storeGoods'
import GoodsPriceList from './goodsPrice'
import SellingPrice from './sellingPrice'
import OrderList from './order'
import OrderDetail from './order/detail'
import BillList from './closeBill'
import BillOrderList from './closeBill/order'
import BillOrderDetail from './closeBill/detail'
import GoodsCate from './goodsCate'
import SaleTimeLine from './report'
import SaleDetail from './report/detail'
import SaleRank from './report/rank'
import ShelfList from './shelf/list/index'
import ShelfDetail from './shelf/list/detail'
import ShelfListAdd from './shelf/list/add'
import ShelfMonitorList from './shelf/monitor/index'
import ShelfWarnList from './shelf/warn/index'
import ShelfRepleList from './shelf/replenishment/index'
import ShelfRepleAddList from './shelf/replenishment/add'
import ShelfRepleDetail from './shelf/replenishment/detail'
// 零售库存
import Stock from './stock/index'
import StockDistribute from './stock/distribute'
import StockInventory from './stock/inventory/index'
import StockInventoryDetail from './stock/inventory/detail'
import StockInventoryRecord from './stock/inventory/record'

import StockLossOverflow from './stock/lossOverflow/index'
import StockLossOverflowDetail from './stock/lossOverflow/detail'

class RetailModule extends Component {
  render() {
    return (
      <Switch>
        <Redirect exact from={urls.RETAIL} to={urls.RETAIL_ORDER} />
        <Route exact path={urls.RETAIL_GOODS} component={GoodsList} />
        <Route exact path={`${urls.RETAIL_GOODS_ADD}`} component={GoodAdd} />
        <Route exact path={`${urls.RETAIL_GOODS_EDIT}/:goodsNo`} component={GoodAdd} />
        <Route exact path={`${urls.RETAIL_GOODS_DETAIL}/:goodsNo`} component={GoodDetail} />
        <Route exact path={urls.RETAIL_STORE_GOODS} component={StoreGoodsList} />
        <Route exact path={urls.RETAIL_CATEGORY} component={CategoryList} />
        <Route exact path={`${urls.RETAIL_STORE_GOODS_DETAIL}/:goodsNo`} component={GoodDetail} />
        <Route exact path={urls.RETAIL_BRAND_PRICE} component={GoodsPriceList} />
        <Route exact path={urls.RETAIL_SELLING_PRICE} component={SellingPrice} />
        <Route exact path={urls.RETAIL_ORDER} component={OrderList} />
        <Route exact path={`${urls.RETAIL_ORDER_DETAIL}/:orderNo`} component={OrderDetail} />
        <Route exact path={urls.RETAIL_BILL} component={BillList} />
        <Route exact path={`${urls.RETAIL_BILL_ORDER}/:accountNo`} component={BillOrderList} />
        <Route exact path={`${urls.RETAIL_BILL_ORDER_DETAIL}/:orderNo`} component={BillOrderDetail} />
        <Route exact path={urls.RETAIL_GOODS_CATE} component={GoodsCate} />
        <Route exact path={urls.RETAIL_REPORT_TIME} component={SaleTimeLine} />
        <Route exact path={urls.RETAIL_SALE_DETAIL} component={SaleDetail} />
        <Route exact path={urls.RETAIL_SALE_RANK} component={SaleRank} />
        <Route exact path={urls.RETAIL_SHELF_LIST} component={ShelfList} />
        <Route exact path={`${urls.RETAIL_SHELF_LIST_ADD}/:shelfNo`} component={ShelfListAdd} />
        <Route exact path={`${urls.RETAIL_SHELF_LIST_DETAIL}/:shelfNo`} component={ShelfDetail} />
        <Route exact path={urls.RETAIL_SHELF_MONITOR} component={ShelfMonitorList} />
        <Route exact path={urls.RETAIL_SHELF_WARN} component={ShelfWarnList} />
        <Route exact path={urls.RETAIL_SHELF_REPLE} component={ShelfRepleList} />
        <Route exact path={`${urls.RETAIL_SHELF_REPLE_ADD}/:replenishmentUuid`} component={ShelfRepleAddList} />
        <Route exact path={`${urls.RETAIL_SHELF_REPLE_DETAIL}/:replenishmentUuid`} component={ShelfRepleDetail} />
        <Redirect exact from={urls.RETAIL_STOCK} to={urls.RETAIL_STOCK_LIST} />
        <Route exact path={urls.RETAIL_STOCK_LIST} component={Stock} />
        <Route exact path={urls.RETAIL_STOCK_DISTRIBUTE} component={StockDistribute} />
        <Route exact path={urls.RETAIL_STOCK_INVENTORY} component={StockInventory} />
        <Route exact path={urls.RETAIL_STOCK_INVENTORY_DETAIL} component={StockInventoryDetail} />
        <Route exact path={urls.RETAIL_STOCK_INVENTORY_RECORD} component={StockInventoryRecord} />
        <Route exact path={urls.RETAIL_STOCK_LOSS_OVERFLOW} component={StockLossOverflow} />
        <Route exact path={urls.RETAIL_STOCK_LOSS_OVERFLOW_DETAIL} component={StockLossOverflowDetail} />
      </Switch>
    )
  }
}

export default RetailModule
