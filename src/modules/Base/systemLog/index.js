import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Button, Input, DatePicker } from 'antd'
import styles from './index.less'
import { isEmpty } from '../../../utils/lang'
import { getLogList } from './reduck'
import { genPagination } from 'Utils/helper'

class LogList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1,
      operator: '',
      dateStart: null,
      dateEnd: null,
      endOpen: false,
    }
  }

  componentWillMount() {
    this.props.dispatch(getLogList({ currentPage: 1 }))
  }

  _handleSearch = () => {
    const { operator, dateStart, dateEnd } = this.state
    const formatDateStart = !dateStart ? '' : dateStart.format('YYYY-MM-DD')
    const formatDateEnd = !dateEnd ? '' : dateEnd.format('YYYY-MM-DD')
    this.setState({ currentPage: 1 }, () => {
      this.props.dispatch(getLogList({
        currentPage: 1,
        operator: operator,
        dateStart: formatDateStart,
        dateEnd: formatDateEnd
      }))
    })
  }

  _handleOperator = (value) => {
    this.setState({
      operator: value.target.value
    })
  }

  _handlePageChange = (page) => {
    const { dateStart, dateEnd, operator } = this.state
    this.setState({ currentPage: page.current }, () => {
      this.props.dispatch(getLogList({
        currentPage: page.current,
        dateStart: !dateStart ? '' : dateStart.format('YYYY-MM-DD'),
        dateEnd: !dateEnd ? '' : dateEnd.format('YYYY-MM-DD'),
        operator: operator,
      }))
    })
  }

  _disabledStartDate = (dateStart) => {
    const dateEnd = this.state.dateEnd
    if (!dateStart || !dateEnd) {
      return false
    }
    return dateStart.valueOf() > dateEnd.valueOf()
  }

  _disabledEndDate = (dateEnd) => {
    const dateStart = this.state.dateStart
    if (!dateEnd || !dateStart) {
      return false
    }
    return dateEnd.valueOf() <= dateStart.valueOf()
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    })
  }

  _onStartChange = (value) => {
    this.onChange('dateStart', value)
  }

  _onEndChange = (value) => {
    this.onChange('dateEnd', value)
  }

  _handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true })
    }
  }

  _handleEndOpenChange = (open) => {
    this.setState({ endOpen: open })
  }

  _columns = [
    {
      key: 'id',
      title: '编号',
      dataIndex: 'id'
    },
    {
      key: 'operator',
      title: '操作人',
      dataIndex: 'operator'
    },
    {
      key: 'opContent',
      title: '操作日志',
      dataIndex: 'opContent'
    },
    {
      key: 'ip',
      title: 'IP',
      dataIndex: 'ip'
    },
    {
      key: 'opDate',
      title: '操作时间',
      dataIndex: 'opDate'
    }
  ]

  _renderDateStart = () => {
    const { dateStart } = this.state
    return (
      <DatePicker
        disabledDate={this._disabledStartDate}
        showTime
        value={dateStart}
        getCalendarContainer={() => document.getElementById('sys-form')}
        placeholder='开始时间'
        onChange={this._onStartChange}
        onOpenChange={this._handleStartOpenChange}
      />
    )
  }

  _renderDateEnd = () => {
    const { dateEnd, endOpen } = this.state
    return (
      <DatePicker
        disabledDate={this._disabledEndDate}
        showTime
        value={dateEnd}
        getCalendarContainer={() => document.getElementById('sys-form')}
        placeholder='结束时间'
        onChange={this._onEndChange}
        open={endOpen}
        onOpenChange={this._handleEndOpenChange}
      />
    )
  }

  _renderInputKey = () => {
    return (
      <Input
        onChange={(value) => this._handleOperator(value)}
        className={styles['txt-input']}
        placeholder='操作人'
      />
    )
  }

  _renderTable = () => {
    const { list, page } = this.props
    const pagination = genPagination(page, false)
    return (
      <Table
        className={styles['c-table-center']}
        pagination={pagination}
        columns={this._columns}
        onChange={this._handlePageChange}
        rowKey='id'
        dataSource={list}
        loading={this.props.showListSpin}
      />
    )
  }

  render() {
    const { list } = this.props
    return (
      <div>
        <div id='sys-form' className={styles['top-search-wrap']}>
          <span>操作时间：</span>
          {this._renderDateStart()}
          <span className={styles['for-margin']}>-</span>
          {this._renderDateEnd()}
          {this._renderInputKey()}
          <Button
            onClick={this._handleSearch}
            type='primary'
            icon='search'
            title='点击查询'
          >
            查询
          </Button>
        </div>
        { isEmpty(list)
          ? <div>暂无数据</div>
          : this._renderTable()
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.sysLog.logList,
    page: state.sysLog.page,
    showListSpin: state.common.showListSpin
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(LogList)
