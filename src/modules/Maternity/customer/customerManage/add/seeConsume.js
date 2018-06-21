import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Table, Popover } from 'antd'
import { connect } from 'react-redux'
import * as actions from '../reduck'
import styles from './index.less'
import { CUSTOMER_CONSUME_DETAIL } from 'Global/urls'

// 消费情况列表页面
class SeeConsume extends Component {
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

  static defaultProps = {
    getConsume: [],
    consumeStatusList: [],
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
      this.props.dispatch(actions.getConsume({ customerId: this.state.id, ...this.state.pagination }))
      this.props.dispatch(actions.consumeListConditions({ status: 0 }))
    }
  }

  // 获取套餐类型
  _getDictValue = (dictionary, value) => {
    const filterDic = dictionary.filter(dictionary => dictionary.value === value)
    if (filterDic.length > 0) {
      return filterDic[0].name
    }
    return ''
  }

  _columns = [
    {
      title: '消费时间',
      dataIndex: 'consumeTime',
    }, {
      key: 'serialNo',
      title: '流水编号',
      dataIndex: 'serialNo',
    }, {
      title: '消费状态',
      dataIndex: 'status',
      render: (text, record) => {
        return (
          <p className={styles['item-content']}>
            {this._getDictValue(this.props.consumeStatusList, record.status)}
          </p>
        )
      }
    }, {
      title: '消费金额',
      dataIndex: 'amount',
    }, {
      title: '消费内容',
      dataIndex: 'content',
    }, {
      title: '备注',
      dataIndex: 'remark',
      render: (text) => {
        return (
          <Popover
            placement='topRight'
            content={<div className={styles['pop']}>{text && text !== 'null' && text}</div>}
            title='服务名称'
          >
            <span>{text && text.length > 15 ? `${text.substring(0, 15)}...` : text}</span>
          </Popover>
        )
      }
    }, {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 150,
      render: (text, record) => {
        return (
          <div className={styles['table-ope']}>
            <Link
              to={`${CUSTOMER_CONSUME_DETAIL}/${record.consumeId}`}
            >查看
            </Link>
          </div>
        )
      }
    }
  ]

  // 消费选择
  _rowSelection = {
    type: 'checkbox',
  }

  render() {
    const { getConsume } = this.props
    const pagination = getConsume.page || {}
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
          rowSelection={this._rowSelection}
          dataSource={getConsume.result}
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
    getConsume: state.customerManage.getConsume,
    consumeStatusList: state.customerManage.consumeConditions.consumeStatusList,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(SeeConsume))
