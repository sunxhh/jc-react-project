import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
import { Table, Form, Input, Radio } from 'antd'
import { showModalForm } from 'Components/modal/ModalForm'
import { genPlanColumn, genPagination } from 'Utils/helper'
import moment from 'moment'
import { LIBRARY_RECOMMEND } from 'Global/urls'
import Module from './module'

const { TextArea } = Input
const RadioGroup = Radio.Group

class RecommendTodoList extends Component {
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
    genPlanColumn('createTime', '推荐时间', { render: text => (<span>{moment(text).format('YYYY-MM-DD HH:mm')}</span>) }),
    genPlanColumn('operate', '操作', { width: '80px', render: (text, record) => (<a href='javascript:;' onClick={() => this._handleRecord(record)}>处理</a>) }),
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
    const finalFilter = this._genFilter(1, page.pageSize)
    dispatch(Module.actions.getRecommendList(finalFilter))
  }
  
  _handleRecord = record => {
    showModalForm({
      title: '处理结果',
      fields: [
        {
          id: 'status',
          props: {
            label: '请选择'
          },
          options: {
            initialValue: 2,
            rules: [{
              required: true,
              message: '请选择处理结果',
            }]
          },
          element: (
            <RadioGroup onChange={this.onChange}>
              <Radio value={3}>推荐有效</Radio>
              <Radio value={2}>推荐无效</Radio>
            </RadioGroup>
          )
        },
        {
          id: 'processingOpinion',
          props: {
            label: '处理意见'
          },
          options: {
            initialValue: '',
            rules: [{
              required: true,
              message: '请输入处理意见',
            }]
          },
          element: (
            <TextArea
              maxLength={50}
              rows={2}
              placeholder='请输入处理意见，50个字以内均可。'
            />
          )
        },
      ],
      onOk: values => {
        const arg = Object.assign({}, values, { id: record.id })
        return this.props.dispatch(Module.actions.updateRecommendStatus(arg)).then(res => {
          if (res.status !== 0) {
            return false
          }
          this._handleSearch()
          return res
        })
      }
    })
  }

  render() {
    const { list, page, showListSpin } = this.props
    const pagination = genPagination(page) // 获取分页配置

    return (
      <div>
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
    ...state['library.recommend.todo'],
    showListSpin: state['common.showListSpin'],
  }
}
export default connect(['common.showListSpin', 'library.recommend.todo'], mapStateToProps)(Form.create()(RecommendTodoList))
