import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
import { Table, Form, Modal } from 'antd'
import { genPlanColumn, genPagination } from 'Utils/helper'
import moment from 'moment'
import { LIBRARY_RECOMMEND } from 'Global/urls'
import Filter from 'Components/Filter'
import Module from './module'
import styles from '../recommend.less'

const ModalConfirm = Modal.confirm

class RecommendDoneList extends Component {
  componentWillMount() {
    const { dispatch } = this.props
    const finalFilter = this._genFilter()
    dispatch(Module.actions.getRecommendList(finalFilter))
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    if (!location.pathname.startsWith(LIBRARY_RECOMMEND)) {
      dispatch(Module.actions.resetRecommendFilter()) // 非列表页下级页面则清空查询参数
    }
  }

  formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }

  _columns = [
    genPlanColumn('userName', '推荐人', { width: '80px' }),
    genPlanColumn('userPhone', '手机号码', { width: '120px' }),
    genPlanColumn('bookName', '推荐图书', { width: '100px' }),
    genPlanColumn('authorName', '作者', { width: '80px' }),
    genPlanColumn('ibsn', 'isbn'),
    genPlanColumn('recommendMessage', '推荐理由'),
    genPlanColumn('updateTime', '处理时间', { width: '110px', render: text => (<span>{moment(text).format('YYYY-MM-DD HH:mm')}</span>) }),
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      width: '100px',
      render: (text, record) => (
        <div>
          {
            record.status === '2' && <span className={styles['color-red']}>推荐无效</span>
          }
          {
            record.status === '3' && <span className={styles['color-orange']}>推荐有效</span>
          }
          {
            record.status !== '2' && record.status !== '3' && <span className={styles['color-green']}>图书可借</span>
          }
        </div>
      )
    },
    genPlanColumn('processingOpinion', '处理意见'),
    {
      key: 'operate',
      title: '操作',
      width: '100px',
      render: (text, record) => (record.status === '3' && <a href='javascript:;' onClick={() => this._confirmBorrowable(record)}>设为可借</a>)
    }
  ]

  // 处理分页
  _handlePageChange = (pagination) => {
    window.scrollTo(0, 0)
    const { page } = this.props
    const { current, pageSize } = pagination
    this.props.dispatch(Module.actions.getRecommendList(this._genFilter(page.pageSize !== pageSize ? 1 : current, pageSize)))
  }
  
  _genFilter = (current = this.props.page.pageNo, pageSize = this.props.page.pageSize, params = {}) => {
    const { filter, dispatch } = this.props
    const finalFilter = { ...filter, ...params, currentPage: current, pageSize }
    dispatch(Module.actions.setRecommendFilter(finalFilter)) // 存储查询条件
    return finalFilter
  }

  _handleSearch = searchData => {
    const { page, dispatch } = this.props
    const finalFilter = this._genFilter(1, page.pageSize, searchData)
    dispatch(Module.actions.getRecommendList(finalFilter))
  }

  _setBorrowable = arg => {
    const { dispatch } = this.props
    dispatch(Module.actions.setBorrowable(arg)).then(res => {
      if (res.status !== 0) {
        return false
      }
      this._handleSearch()
      return res
    })
  }

  _confirmBorrowable = record => {
    ModalConfirm({
      title: '将该本图书设为可借？',
      content: '设置后用户可在书虫页面可见',
      okText: '继续',
      cancelText: '取消',
      onOk: () => this._setBorrowable({ id: record.id })
    })
  }

  _genFilterFields = () => {
    const { filter } = this.props
    const fields = [
      {
        key: 'bookName',
        label: '图书信息',
        initialValue: filter.bookName,
        type: 'Input',
      }
    ]

    return fields
  }

  render() {
    const { list, page, showListSpin } = this.props
    const pagination = genPagination(page) // 获取分页配置
    const fields = this._genFilterFields() // 获取筛选项

    return (
      <div>
        <Filter fields={fields} onSearch={this._handleSearch} />
        <Table
          rowKey={record => record.id}
          columns={this._columns}
          dataSource={list}
          bordered={true}
          loading={showListSpin}
          onChange={this._handlePageChange}
          pagination={pagination}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state['library.recommend.done'],
    showListSpin: state['common.showListSpin'],
  }
}
export default connect(['common.showListSpin', 'library.recommend.done'], mapStateToProps)(Form.create()(RecommendDoneList))
