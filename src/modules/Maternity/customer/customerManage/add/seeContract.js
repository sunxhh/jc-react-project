import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Table, Popover } from 'antd'
import { connect } from 'react-redux'
import * as actions from '../reduck'
import styles from './index.less'
import { CUSTOMER_CONTRACT_INFO } from 'Global/urls'

// 消费情况列表页面
class SeeContract extends Component {
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
    contractStatusList: [],
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
      this.props.dispatch(actions.getContract({ customerId: this.state.id, ...this.state.pagination }))
      this.props.dispatch(actions.getContractStatusList({ status: '0' }))
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
      key: 'contractNum',
      title: '合同编号',
      dataIndex: 'contractNum',
    }, {
      key: 'firstParty.firstPartyName',
      title: '甲方',
      dataIndex: 'firstParty.firstPartyName',
    }, {
      key: 'contractStatus',
      title: '合同状态',
      dataIndex: 'contractStatus',
      render: (text, record) => {
        return (
          <div>
            {this._getDictValue(this.props.contractStatusList, record.contractStatus)}
          </div>
        )
      }
    }, {
      key: 'customerName',
      title: '当事人姓名',
      dataIndex: 'customerName',
    }, {
      key: 'stayDays',
      title: '入住天数',
      dataIndex: 'stayDays',
    }, {
      key: 'amount',
      title: '总费用',
      dataIndex: 'amount',
    }, {
      key: 'remark',
      title: '合同说明',
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
              to={`${CUSTOMER_CONTRACT_INFO}/${record.contractId}`}
            >查看详情
            </Link>
          </div>
        )
      }
    }
  ]

  render() {
    const { getContract } = this.props
    const pagination = getContract.page || {}
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
          dataSource={getContract.result}
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
    getContract: state.customerManage.getContract,
    contractStatusList: state.customerManage.contractCodeDTO.contractStatusList,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(SeeContract))
