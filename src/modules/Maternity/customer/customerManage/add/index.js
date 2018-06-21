import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tabs } from 'antd'
import { Route, Switch, Link, Redirect } from 'react-router-dom'
import {
  CUSTOMER_ADD_PRE,
  CUSTOMER_SEE_BASIC,
  CUSTOMER_SEE_ACCOUNT,
  CUSTOMER_SEE_PRE,
  CUSTOMER_SEE_CHECK,
  CUSTOMER_SEE_PROCESS,
  CUSTOMER_SEE_CONSUME,
  CUSTOMER_EDIT_BASIC,
  CUSTOMER_EDIT_PRE,
  CUSTOMER_EDIT_ACCOUNT,
  CUSTOMER_EDIT_CHECK,
  CUSTOMER_SEE_CONTRACT
} from 'Global/urls'

import AddBasic from './addBasic'
import AddPre from './addPre'
import seeAccount from './seeAccount'
import seeCheck from './seeCheck'
import SeeProcess from './seeProcess'
import SeeConsume from './seeConsume'
import SeeContract from './seeContract'

const TabPane = Tabs.TabPane

class AddIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showType: props.match.params.showType,
      id: props.match.params.id,
      customerType: props.match.params.customerType,
    }
  }

  _isShowBasic = () => {
    const { showType, customerType, id } = this.state
    if (showType === 'seeBasic' ||
          showType === 'seePre' ||
          showType === 'seeAccount' ||
          showType === 'seeCheck' ||
          showType === 'seeProcess' ||
          showType === 'seeConsume' ||
          showType === 'seeContract') {
      return (
        <TabPane
          tab={<Link to={`/maternity/materCustomerManage/see/seeBasic/${id}/see/${customerType}`}>基本信息</Link>}
          key='seeBasic'
        >
          <Switch>
            <Route
              exact
              path={`/maternity/materCustomerManage/see/:showType/:id/:type/:customerType`}
              component={AddBasic}
            />
          </Switch>
        </TabPane>
      )
    } else if (
      showType === 'editBasic' ||
        showType === 'editPre' ||
        showType === 'editAccount' ||
        showType === 'editCheck') {
      return (
        <TabPane
          tab={<Link to={`/maternity/materCustomerManage/edit/editBasic/${id}/edit`}>基本信息</Link>}
          key='editBasic'
        >
          <Switch>
            <Route
              exact
              path={`/maternity/materCustomerManage/edit/:showType/:id/:type`}
              component={AddBasic}
            />
          </Switch>
        </TabPane>
      )
    } else {
      return (
        <TabPane
          tab={<Link to={`/maternity/materCustomerManage/add/basic`}>基本信息</Link>}
          key='basic'
        >
          <Switch>
            <Redirect
              exact
              from='/maternity/materCustomerManage/add'
              to={`/maternity/materCustomerManage/add/basic`}
            />
            <Route
              exact
              path={`/maternity/materCustomerManage/add/basic`}
              component={AddBasic}
            />
          </Switch>
        </TabPane>
      )
    }
  }

  _isShowPre = () => {
    const { showType, customerType } = this.state
    if ((showType === 'seeBasic' ||
    showType === 'seePre' ||
    showType === 'seeAccount' ||
    showType === 'seeCheck' ||
    showType === 'seeProcess' ||
    showType === 'seeConsume' ||
    showType === 'seeContract') && customerType === '1') {
      return (
        <TabPane
          tab={<Link to={`/maternity/materCustomerManage/see/seePre/${this.state.id}/see/${customerType}`}>预产期信息</Link>}
          key='seePre'
        >
          <Switch>
            <Route
              exact
              path={`/maternity/materCustomerManage/see/:showType/:id/:type/:customerType`}
              component={AddPre}
            />
          </Switch>
        </TabPane>
      )
    }
  }

  _isShowSee = () => {
    const { showType, customerType } = this.state
    if ((showType === 'seeAccount' ||
    showType === 'seeBasic' ||
    showType === 'seePre' ||
    showType === 'seeCheck' ||
    showType === 'seeProcess' ||
    showType === 'seeConsume' ||
    showType === 'seeContract') && customerType === '1') {
      return (
        <TabPane
          tab={<Link to={`/maternity/materCustomerManage/see/seeAccount/${this.state.id}/see/${customerType}`}>账户信息</Link>}
          key='seeAccount'
        >
          <Switch>
            <Route
              exact
              path={`/maternity/materCustomerManage/see/:showType/:id/:type/:customerType`}
              component={seeAccount}
            />
          </Switch>
        </TabPane>
      )
    }
  }

  _isShowCheck = () => {
    const { showType, customerType } = this.state
    if ((showType === 'seeAccount' ||
    showType === 'seeBasic' ||
    showType === 'seePre' ||
    showType === 'seeCheck' ||
    showType === 'seeProcess' ||
    showType === 'seeConsume' ||
    showType === 'seeContract') && customerType === '1') {
      return (
        <TabPane
          tab={<Link to={`/maternity/materCustomerManage/see/seeCheck/${this.state.id}/see/${customerType}`}>入住信息</Link>}
          key='seeCheck'
        >
          <Switch>
            <Route
              exact
              path={`/maternity/materCustomerManage/see/:showType/:id/:type/:customerType`}
              component={seeCheck}
            />
          </Switch>
        </TabPane>
      )
    }
  }

  _isShowProcess = () => {
    const { showType, customerType, id } = this.state
    if ((showType === 'seeAccount' ||
    showType === 'seeBasic' ||
    showType === 'seePre' ||
    showType === 'seeCheck' ||
    showType === 'seeProcess' ||
    showType === 'seeConsume' ||
    showType === 'seeContract') && customerType === '1') {
      return (
        <TabPane
          tab={<Link to={`/maternity/materCustomerManage/see/seeProcess/${id}/see/${customerType}`}>跟进信息</Link>}
          key='seeProcess'
        >
          <Switch>
            <Route
              exact
              path={`/maternity/materCustomerManage/see/:showType/:id/:type/:customerType`}
              component={SeeProcess}
            />
          </Switch>
        </TabPane>
      )
    }
  }

  _isShowConsume = () => {
    const { showType, customerType, id } = this.state
    if ((showType === 'seeAccount' ||
    showType === 'seeBasic' ||
    showType === 'seePre' ||
    showType === 'seeCheck' ||
    showType === 'seeProcess' ||
    showType === 'seeConsume' ||
    showType === 'seeContract') && customerType !== '2') {
      return (
        <TabPane
          tab={<Link to={`/maternity/materCustomerManage/see/seeConsume/${id}/see/${customerType}`}>消费情况</Link>}
          key='seeConsume'
        >
          <Switch>
            <Route
              exact
              path={`/maternity/materCustomerManage/see/:showType/:id/:type/:customerType`}
              component={SeeConsume}
            />
          </Switch>
        </TabPane>
      )
    }
  }

  _isShowContract = () => {
    const { showType, customerType, id } = this.state
    if ((showType === 'seeAccount' ||
        showType === 'seeBasic' ||
        showType === 'seePre' ||
        showType === 'seeCheck' ||
        showType === 'seeProcess' ||
        showType === 'seeConsume' ||
        showType === 'seeContract') && customerType === '1') {
      return (
        <TabPane
          tab={<Link to={`/maternity/materCustomerManage/see/seeContract/${id}/see/${customerType}`}>合同信息</Link>}
          key='seeContract'
        >
          <Switch>
            <Route
              exact
              path={`/maternity/materCustomerManage/see/:showType/:id/:type/:customerType`}
              component={SeeContract}
            />
          </Switch>
        </TabPane>
      )
    }
  }
  render() {
    let activeKey = 'basic'
    if (location.pathname.startsWith(CUSTOMER_ADD_PRE)) {
      activeKey = 'pre'
    } else if (location.pathname.startsWith(CUSTOMER_SEE_BASIC)) {
      activeKey = 'seeBasic'
    } else if (location.pathname.startsWith(CUSTOMER_SEE_PRE)) {
      activeKey = 'seePre'
    } else if (location.pathname.startsWith(CUSTOMER_SEE_ACCOUNT)) {
      activeKey = 'seeAccount'
    } else if (location.pathname.startsWith(CUSTOMER_SEE_CONTRACT)) {
      activeKey = 'seeContract'
    } else if (location.pathname.startsWith(CUSTOMER_SEE_CHECK)) {
      activeKey = 'seeCheck'
    } else if (location.pathname.startsWith(CUSTOMER_SEE_PROCESS)) {
      activeKey = 'seeProcess'
    } else if (location.pathname.startsWith(CUSTOMER_SEE_CONSUME)) {
      activeKey = 'seeConsume'
    } else if (location.pathname.startsWith(CUSTOMER_EDIT_BASIC)) {
      activeKey = 'editBasic'
    } else if (location.pathname.startsWith(CUSTOMER_EDIT_PRE)) {
      activeKey = 'editPre'
    } else if (location.pathname.startsWith(CUSTOMER_EDIT_ACCOUNT)) {
      activeKey = 'editAccount'
    } else if (location.pathname.startsWith(CUSTOMER_EDIT_CHECK)) {
      activeKey = 'editCheck'
    }
    return (
      <Tabs
        style={{ overflow: 'visible' }}
        activeKey={activeKey}
      >
        {this._isShowBasic()}
        {this._isShowPre()}
        {this._isShowSee()}
        {this._isShowContract()}
        {this._isShowCheck()}
        {this._isShowProcess()}
        {this._isShowConsume()}
      </Tabs>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(AddIndex)
