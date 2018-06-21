import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Tabs, Table } from 'antd'
import styles from './styles.less'
import { getMemberDetail } from './reduck'
import moment from 'moment'
import { createAction } from 'redux-actions'

const rank = {
  '1': '内部会员',
  '2': '外部会员'
}

const cardStatus = {
  '0': '未开卡',
  '1': '已开卡',
  '2': '已失效'
}
const TabPane = Tabs.TabPane
class Detail extends Component {
  static defaultProps = {
    detail: {},
    cardList: []
  }
  componentWillMount() {
    const memberId = this.props.match.params.memberId
    this.props.dispatch(getMemberDetail({ memberId: memberId }))
  }
  componentWillUnmount() {
    this.props.dispatch(createAction('ACTIVE_SHOP')({ shopName: '', shopId: '' }))
    this.props.dispatch(createAction('ACTIVE_KEY')(''))
    this.props.dispatch(
      createAction('TABS_EDIT_ITEM')({
        activeKey: '',
        cardList: []
      })
    )
  }
  _getBaseInfo = detail => {
    return (
      <Row className={styles['txt-row']}>
        <Col span={8}>
          <span>会员ID：</span>
          <span>{detail.memberId}</span>
        </Col>
        <Col span={8}>
          <span>姓名：</span>
          <span>{detail.name}</span>
        </Col>
        <Col span={8}>
          <span>电话号码：</span>
          <span>{detail.phoneNumber}</span>
        </Col>
      </Row>
    )
  }

  _getTabs = detail => {
    return (
      <Tabs type='card' className={styles['detail-tab']}>
        {this.props.cardList.map((item, index) => (
          <TabPane tab={item.shopName} key={index}>
            <Table
              className={styles['c-table-center']}
              columns={this._columns}
              dataSource={[item]}
              rowKey='memberNo'
              pagination={false}
            />
          </TabPane>
        ))}
      </Tabs>
    )
  }

  _columns = [
    {
      key: 'memberNo',
      title: '会员编号',
      dataIndex: 'memberNo'
    },
    {
      key: 'rank',
      title: '等级',
      dataIndex: 'rank',
      render: text => {
        return rank[text]
      }
    },
    {
      key: 'memRight',
      title: '权利',
      dataIndex: 'memRight'
    },
    {
      key: 'cardTime',
      title: '办卡日期',
      dataIndex: 'cardTime',
      render: text => <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
    },
    {
      key: 'orgSnapshot',
      title: '其他',
      dataIndex: 'orgSnapshot'
    },
    {
      key: 'deadline',
      title: '失效日期',
      dataIndex: 'deadline',
      render: text => <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
    },
    {
      key: 'cardStatus',
      title: '失效状态',
      dataIndex: 'cardStatus',
      render: text => {
        return cardStatus[text]
      }
    },
    {
      key: 'memNote',
      title: '会员须知',
      dataIndex: 'memNote'
    },
    {
      key: 'remark',
      title: '备注',
      dataIndex: 'remark'
    }
  ]

  render() {
    const { detail } = this.props
    return (
      <div>
        {this._getBaseInfo(detail)}
        {this._getTabs(detail.cardList)}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    detail: state.member.memberDetail,
    cardList: state.member.cardList
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Detail)
