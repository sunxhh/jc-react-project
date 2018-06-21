import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
import { Form, Tabs } from 'antd'
import RecommendTodoList from './todo'
import RecommendDoneList from './done'
// import styles from './recommend.less'

const TabPane = Tabs.TabPane

class RecommendList extends Component {
  componentWillMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div>
        <Tabs defaultActiveKey='1'>
          <TabPane tab='待处理' key='1'>
            <RecommendTodoList />
          </TabPane>
          <TabPane tab='已处理' key='2'>
            <RecommendDoneList />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state['library.recommend'],
    showListSpin: state['common.showListSpin'],
  }
}
export default connect(['common.showListSpin', 'library.recommend'], mapStateToProps)(Form.create()(RecommendList))
