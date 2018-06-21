import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import * as urls from '../../global/urls'
import Center from './goods/center'
import CenterAdd from './goods/center/add'
import CenterSpecEdit from './goods/center/specEdit'
import CenterDetail from './goods/center/detail'
import Classify from './goods/classify'
import Formula from './goods/formula'
import FormulaBound from './goods/formula/bound'
import Spec from './goods/spec'
import Contract from './purchase/contract'
import ContractAdd from './purchase/contract/add'
import ContractDetail from './purchase/contract/detail'
import ContractEdit from './purchase/contract/edit'
import Order from './purchase/order'
import EditOrder from './purchase/order/editorder'
import OrderDetail from './purchase/order/orderdetail'
import WarehouseDetail from './purchase/order/warehousedetail'
import Plan from './purchase/plan'
import Provider from './purchase/provider'
import ProviderAdd from './purchase/provider/add'
import ProviderEdit from './purchase/provider/edit'
import ProviderDetail from './purchase/provider/detail'

class SupplyChainModule extends Component {
  render() {
    return (
      <Switch>
        <Redirect exact from={urls.SUPPLY_CHAIN_PURCHASE_MODULE} to={urls.HOME} />
        <Redirect exact from={urls.SUPPLY_GOODS} to={urls.SUPPLY_GOODS_CLASSIFY} />
        <Route exact path={urls.SUPPLY_GOODS_CLASSIFY} component={Classify} />
        <Route exact path={urls.SUPPLY_GOODS_CENTER} component={Center} />
        <Route exact path={urls.SUPPLY_GOODS_CENTER_ADD} component={CenterAdd} />
        <Route exact path={urls.SUPPLY_GOODS_CENTER_SPEC_EDIT + '/:id'} component={CenterSpecEdit} />
        <Route exact path={`${urls.SUPPLY_GOODS_CENTER_EDIT}/:id`} component={CenterDetail} />
        <Route exact path={`${urls.SUPPLY_GOODS_CENTER_DETAIL}/:id`} component={CenterDetail} />
        <Route exact path={urls.SUPPLY_GOODS_FORMULA} component={Formula} />
        <Route exact path={`${urls.SUPPLY_GOODS_FORMULA_BOUND}/:skuNo`} component={FormulaBound} />
        <Route exact path={`${urls.SUPPLY_GOODS_FORMULA_EDIT}/:skuNo`} component={FormulaBound} />
        <Route exact path={`${urls.SUPPLY_GOODS_FORMULA_INFO}/:skuNo`} component={FormulaBound} />
        <Route exact path={urls.SUPPLY_GOODS_SPEC} component={Spec} />

        <Redirect exact from={urls.SUPPLY_PURCHASE} to={urls.SUPPLY_PURCHASE_PROVIDER} />
        <Route exact path={urls.SUPPLY_PURCHASE_CONTRACT} component={Contract} />
        <Route exact path={urls.SUPPLY_PURCHASE_CONTRACT_ADD} component={ContractAdd} />
        <Route exact path={`${urls.SUPPLY_PURCHASE_CONTRACT_DETAIL}/:id`} component={ContractDetail} />
        <Route exact path={`${urls.SUPPLY_PURCHASE_CONTRACT_EDIT}/:id`} component={ContractEdit} />
        <Route exact path={urls.SUPPLY_PURCHASE_ORDER} component={Order} />
        <Route exact path={urls.SUPPLY_PURCHASE_EDITORDER} component={EditOrder} />
        <Route exact path={urls.SUPPLY_PURCHASE_ORDERDETAIL} component={OrderDetail} />
        <Route exact path={urls.SUPPLY_PURCHASE_WAREHOUSEDETAIL} component={WarehouseDetail} />
        <Route exact path={urls.SUPPLY_PURCHASE_PLAN} component={Plan} />
        <Route exact path={urls.SUPPLY_PURCHASE_PROVIDER} component={Provider} />
        <Route exact path={urls.SUPPLY_PURCHASE_PROVIDER_ADD} component={ProviderAdd} />
        <Route exact path={`${urls.SUPPLY_PURCHASE_PROVIDER_EDIT}/:id`} component={ProviderEdit} />
        <Route exact path={`${urls.SUPPLY_PURCHASE_PROVIDER_DETAIL}/:id`} component={ProviderDetail} />
      </Switch>
    )
  }
}

export default SupplyChainModule
