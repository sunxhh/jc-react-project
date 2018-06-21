import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import * as urls from 'Global/urls'

// 子模块引入
import OrderList from './order'
import OrderDetail from './order/detail'
import TemplateList from './template'
import TemplateDetail from './template/detail'
import AddTemplete from './template/edit'
import RefundOrderList from './refund'
import RefundOrderDetail from './refund/detail'
import RefundOrderAdd from './refund/add'

class OrderCenterModule extends Component {
  render() {
    return (
      <Switch>
        <Redirect exact from={urls.ORDER_CENTER} to={urls.ORDER_CENTER_ORDER} />
        <Route exact path={urls.ORDER_CENTER_ORDER} component={OrderList} />
        <Route exact path={`${urls.ORDER_CENTER_ORDER_DETAIL}/:id`} component={OrderDetail} />
        <Route exact path={urls.ORDER_CENTER_TEMPLATE} component={TemplateList} />
        <Route exact path={`${urls.ORDER_CENTER_TEMPLATE_DETAIL}/:id`} component={TemplateDetail} />
        <Route exact path={urls.ORDER_CENTER_TEMPLATE_ADD} component={AddTemplete} />
        <Route exact path={`${urls.ORDER_CENTER_TEMPLATE_ADD}/:id`} component={AddTemplete} />
        <Route exact path={urls.ORDER_CENTER_REFUND} component={RefundOrderList} />
        <Route exact path={`${urls.ORDER_CENTER_REFUND_DETAIL}/:id`} component={RefundOrderDetail} />
        <Route exact path={`${urls.ORDER_CENTER_REFUND_ADD}/:id`} component={RefundOrderAdd} />
      </Switch>
    )
  }
}

export default OrderCenterModule
