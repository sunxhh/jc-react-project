import React, { Component } from 'react'
import { Form, Table, Popover } from 'antd'
import { connect } from 'react-redux'
import * as actions from '../reduck'
import styles from './index.less'

// 跟进信息列表信息页面
class SeeProcess extends Component {
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
      this.props.dispatch(actions.getProcess({ customerId: this.state.id, ...this.state.pagination }))
      this.props.dispatch(actions.getProcessConditions())
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

  _columns = [{
    key: 'id',
    title: '编号',
    dataIndex: 'id',
    render: (text, record, index) => {
      const { pageSize, currentPage } = this.props.getProcess.page
      return (
        <span>{(currentPage - 1) * pageSize + index + 1}</span>
      )
    }
  }, {
    title: '跟进方式',
    dataIndex: 'processType',
    render: (text, record) => {
      return (
        <div>
          {this._getDictValue(this.props.processTypeList, record.processType)}
        </div>
      )
    }
  }, {
    title: '跟进时间',
    dataIndex: 'processTime',
    render: (text, record) => {
      return (
        <div>{moment(record.processTime).format('YYYY-MM-DD HH:mm:ss')}</div>
      )
    }
  }, {
    title: '跟进人员',
    dataIndex: 'processorName',
  }, {
    title: '标题',
    dataIndex: 'title',
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
    title: '跟进内容',
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
  }]

  render() {
    const { getProcess } = this.props
    const pagination = getProcess.page || {}
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
          dataSource={getProcess.result}
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
    getProcess: state.customerManage.getProcess,
    processTypeList: state.customerManage.processConditions.processTypeList,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(SeeProcess))
