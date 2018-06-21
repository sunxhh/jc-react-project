import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
import Module from './module'
import BaseModule from '../module'

class Page extends Component {
  _handleClick = () => {
    this.props.dispatch(Module.actions.getCheckList())
    this.props.dispatch(BaseModule.actions.getFirstList())
  }

  render() {
    return (
      <div onClick={this._handleClick}>{this.props.data.name}</div>
    )
  }
}

const mapStateToProps = (state) => {
  console.log(state)
  return {
    ...state['arthur.page']
  }
  // return {
  //   showListSpin: state.common.showListSpin,
  //
  //   list: state.supplyChain.depotStock.checkList,
  //   filter: state.supplyChain.depotStock.checkFilter,
  //   page: state.supplyChain.depotStock.checkPage,
  // }
}
export default connect(['common.showListSpin', 'arthur.page'], mapStateToProps)(Page)
