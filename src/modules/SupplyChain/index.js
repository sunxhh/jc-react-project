import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import * as urls from '../../global/urls'
import Report from './report'
import Watch from './depot/qualityWatch'
import Goods from './depot/depotGoods'
import GoodsDetail from './depot/depotGoods/detail'
import LibraryBit from './depot/libraryBit'
import ReservoirArea from './depot/reservoirArea'
import SortList from './depot/sortListManage'
import SortDetail from './depot/sortListManage/detail'
import Sorting from './depot/sortListManage/sorting'
import Continue from './depot/sortListManage/continue'
import OperateRecord from './depot/stockManage/record'
import StockCheck from './depot/stockManage/check'
import StockDifference from './depot/stockManage/difference'
import StockDifferenceInfo from './depot/stockManage/difference/Info'
import StockInventory from './depot/stockManage/inventory'
import StockInventoryEntry from './depot/stockManage/inventory/Entry'
import StockInventoryInfo from './depot/stockManage/inventory/Info'
import StockOperate from './depot/stockManage/operate'
import StockInbound from './depot/stockManage/operate/Inbound'
import StockReturn from './depot/stockManage/operate/Return'
import StockOutbound from './depot/stockManage/operate/Outbound'
import StockThreshold from './depot/stockManage/threshold'
import Eorder from './order/eorder'
import EorderDetail from './order/eorderdetail'
import AllocateOrder from './order/allocateorder'
import AllocateAdd from './order/allocateadd'
import AllocateEdit from './order/allocateedit'
import AllocateDetail from './order/allocateDetail'
import ReportCost from './cost/reportcost'
import SortLogisticsList from './depot/logistics'

import BindShop from './order/bindshop'
import BindCity from './order/bindcity'
import ShopLogistic from './logistics/shoplogistic'
import WaybillDetail from './logistics/detail'
import ImportOperate from './import/operate'

class SupplyChainModule extends Component {
  render() {
    return (
      <Switch>
        <Redirect exact from={urls.SUPPLY_CHAIN_MODULE} to={urls.HOME} />
        <Route exact path={urls.SUPPLY_ORDER_EORDER} component={Eorder} />
        <Route exact path={urls.SUPPLY_ORDER_DETAIL} component={EorderDetail} />
        <Route exact path={urls.SUPPLY_CATE_ORDER} component={AllocateOrder} />
        <Route exact path={urls.SUPPLY_CATE_ORDER_ADD} component={AllocateAdd} />
        <Route exact path={urls.SUPPLY_CATE_ORDER_EDIT} component={AllocateEdit} />
        <Route exact path={urls.SUPPLY_CATE_DETAIL} component={AllocateDetail} />
        <Route exact path={urls.SUPPLY_REPORT_COST} component={ReportCost} />
        <Route exact path={urls.SUPPLY_BIND_SHOP} component={BindShop} />
        <Route exact path={urls.SUPPLY_BIND_CITY} component={BindCity} />

        <Redirect exact from={urls.SUPPLY_REPORT} to={urls.SUPPLY_REPORT_COST} />
        <Route exact path={urls.SUPPLY_REPORT_COST} component={Report} />

        {/* 仓库管理*/}
        <Redirect exact from={urls.SUPPLY_DEPOT} to={urls.SUPPLY_STOCK_CHECK} />
        <Route exact path={urls.SUPPLY_DEPOT_WATCH} component={Watch} />
        <Route exact path={urls.SUPPLY_DEPOT_GOODS} component={Goods} />
        <Route exact path={`${urls.SUPPLY_DEPOT_GOODS_DETAIL}/:id`} component={GoodsDetail} />
        <Route exact path={urls.SUPPLY_DEPOT_LIBRARY} component={LibraryBit} />
        <Route exact path={urls.SUPPLY_DEPOT_RESERVOIR} component={ReservoirArea} />
        <Route exact path={urls.SUPPLY_SORT_MANAGE} component={SortList} />
        <Route exact path={urls.SUPPLY_SORTLOGISTICS_MANAGE} component={SortLogisticsList} />
        <Route exact path={`${urls.SUPPLY_SORT_DETAIL}/:id`} component={SortDetail} />
        <Route exact path={`${urls.SUPPLY_SORT_BEGINORCONTINUE}/:id`} component={Sorting} />
        <Route exact path={`${urls.SUPPLY_SORT_CONTINUE}/:id`} component={Continue} />
        <Route exact path={urls.SUPPLY_STOCK_RECORD} component={OperateRecord} />
        <Route exact path={urls.SUPPLY_STOCK_CHECK} component={StockCheck} />
        <Route exact path={urls.SUPPLY_STOCK_DIFFERENCE} component={StockDifference} />
        <Route exact path={urls.SUPPLY_STOCK_DIFFERENCE_EDIT} component={StockDifferenceInfo} />
        <Route exact path={urls.SUPPLY_STOCK_DIFFERENCE_INFO} component={StockDifferenceInfo} />
        <Route exact path={urls.SUPPLY_STOCK_INVENTORY} component={StockInventory} />
        <Route exact path={urls.SUPPLY_STOCK_INVENTORY_ENTRY} component={StockInventoryEntry} />
        <Route exact path={urls.SUPPLY_STOCK_INVENTORY_INFO} component={StockInventoryInfo} />
        <Route exact path={urls.SUPPLY_STOCK_OPERATE} component={StockOperate} />
        <Route exact path={urls.SUPPLY_STOCK_OPERATE_INBOUND_NEW} component={StockInbound} />
        <Route exact path={urls.SUPPLY_STOCK_OPERATE_INBOUND_EDIT} component={StockInbound} />
        <Route exact path={urls.SUPPLY_STOCK_OPERATE_INBOUND_INFO} component={StockInbound} />
        <Route exact path={urls.SUPPLY_STOCK_OPERATE_RETURN} component={StockReturn} />
        <Route exact path={urls.SUPPLY_STOCK_OPERATE_OUTBOUND_NEW} component={StockOutbound} />
        <Route exact path={urls.SUPPLY_STOCK_OPERATE_OUTBOUND_EDIT} component={StockOutbound} />
        <Route exact path={urls.SUPPLY_STOCK_OPERATE_OUTBOUND_INFO} component={StockOutbound} />
        <Route exact path={urls.SUPPLY_STOCK_THRESHOLD} component={StockThreshold} />
        {/* 物流管理 */}
        <Redirect exact from={urls.SUPPLY_LOGISTICS} to={urls.SUPPLY_LOGISTICS_SHOP} />
        <Route exact path={urls.SUPPLY_LOGISTICS_SHOP} component={ShopLogistic} />
        <Route exact path={urls.SUPPLY_LOGISTICS_WAYBILL_DETAIL} component={WaybillDetail} />
        {/* 导入管理 */}
        <Redirect exact from={urls.SUPPLY_IMPORT} to={urls.SUPPLY_IMPORT_OPERATE} />
        <Route exact path={urls.SUPPLY_IMPORT_OPERATE} component={ImportOperate} />
      </Switch>
    )
  }
}

export default SupplyChainModule
