import React, { Component } from 'react'
import { Form, Table } from 'antd'
import { connect } from 'react-redux'
import * as actions from '../reduck'
import { Link } from 'react-router-dom'
import styles from './index.less'
import { CUSTOMER_CHECK_DETAIL } from 'Global/urls'
import {
  getListConditions
} from '../../../room/extendRecord/reduck'

// 入住信息列表信息页面
class checkRecord extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.match.params.id,
      isShowType: this.props.match.params.type,
      isSeeInfo: false,
      pagination: {
        currentPage: '1',
        pageSize: '20'
      }
    }
  }

  _isSeeInfo = () => {
    if (this.state.isShowType === 'see') {
      this.setState({
        isSeeInfo: true
      })
    }
  }

  componentWillMount() {
    if (this.state.isShowType === 'see') {
      this._isSeeInfo()
      this.props.dispatch(actions.getCheckInfo({ customerId: this.state.id, ...this.state.pagination }))
      this.props.dispatch(actions.getCenterList())
      this.props.dispatch(getListConditions({ status: '0' }))
    }
  }

  _getStatusValue = (status, arg) => {
    let statusName = ''
    status.map(item => {
      if (item.value === arg) {
        statusName = item.name
      }
    })
    return statusName
  }

  _columns = [
    {
      title: '所在中心',
      dataIndex: 'centerId',
      render: text => {
        return this.props.centerList && this.props.centerList.filter(center => {
          return center.id === text
        }).map(item => {
          return (
            <span key={item.id}>{item.orgName}</span>
          )
        })
      }
    }, {
      title: '会员姓名',
      dataIndex: 'customerName',
    }, {
      title: '房间号',
      dataIndex: 'roomNum',
    }, {
      title: '入住状态',
      dataIndex: 'status',
      render: (text) => {
        return (
          <span>{this._getStatusValue(this.props.AllListCondition.statusList ? this.props.AllListCondition.statusList : [], text)}</span>
        )
      }
    }, {
      title: '入住日期',
      dataIndex: 'startTime',
    }, {
      title: '离店日期',
      dataIndex: 'endTime',
    }, {
      title: '创建人',
      dataIndex: 'createUser',
    }, {
      title: '创建日期',
      dataIndex: 'createTime',
    }, {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => {
        return (
          <div className={styles['table-ope']}>
            <Link
              to={`${CUSTOMER_CHECK_DETAIL}/${record.recordId}`}
            >查看
            </Link>
          </div>
        )
      }
    }
  ]

  render() {
    const { checkInfo } = this.props
    const pagination = checkInfo.page || {}
    const paginationData = {
      current: pagination.currentPage,
      total: pagination.totalCount,
      pageSize: pagination.pageSize,
      onChange: this._handlePagination
    }
    return (
      <div
        style={{ position: 'relative' }}
      >
        <Table
          columns={this._columns}
          dataSource={checkInfo.result}
          rowKey={(item, index) => index}
          bordered={true}
          pagination={paginationData}
        />
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    checkInfo: state.customerManage.getCheckInfo,
    centerList: state.customerManage.centerList,
    AllListCondition: state.extendRecordList.getListConditions,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(checkRecord))
