import React, { Component } from 'react'
import { Form, Tabs } from 'antd'
import Goods from './goods'
import CategoryOne from './one'
import CategoryTwo from './two'

import styles from './styles.less'

import { connect } from '@dx-groups/arthur'
import Module from './module'

const TabPane = Tabs.TabPane

class SaleRank extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeKey: '1'
    }
  }

  // 切换面板的回调
  _handleCallback = (key) => {
    this.setState({
      activeKey: key
    })
    const { dispatch } = this.props
    const arge = {
      orgCode: '',
      orderStartTime: '',
      orderEndTime: '',
      currentPage: 1,
      pageSize: 20
    }
    if (key === '1') {
      dispatch(Module.actions.getRankGoodsList(arge))
    } else if (key === '2') {
      dispatch(Module.actions.getRankCategoryList({ ...arge, categoryType: '1' }))
    } else if (key === '3') {
      dispatch(Module.actions.getRankCategoryList({ ...arge, categoryType: '2' }))
    }
  }

  render() {
    const { activeKey } = this.state
    return (
      <div>
        <div className={styles['table-wrapper']}>
          <Tabs activeKey={activeKey} onChange={this._handleCallback} style={{ overflow: 'visible' }}>
            <TabPane tab='按商品' key='1'>
              {activeKey === '1' && <Goods />}
            </TabPane>
            <TabPane tab='按一级分类' key='2'>
              {activeKey === '2' && <CategoryOne />}
            </TabPane>
            <TabPane tab='按二级分类' key='3'>
              {activeKey === '3' && <CategoryTwo />}
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state['retail.report'],
    auths: state['common.auths'],
    showListSpin: state['common.showListSpin'],
  }
}
export default connect(['common.auths', 'common.showListSpin', 'retail.report'], mapStateToProps)(Form.create()(SaleRank))
