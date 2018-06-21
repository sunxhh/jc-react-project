import React, { Component } from 'react'
import { Table, message } from 'antd'

import { genPagination } from 'Utils/helper'
import apis from '../apis'
import { fetchSupplyChain as fetchData } from 'Utils/fetch'

class DetailModal extends Component {
  state = {
    loading: false,
    dataSource: [],
    page: {}
  }

  getDataSource = (param) => {
    this.setState({
      loading: true
    })
    fetchData(apis.import.importDetail, { ...param, importNo: this.props.importNo, status: this.props.type }).then(res => {
      if (res.code === 0) {
        const { data, ...page } = res.data
        this.setState({
          dataSource: data,
          page
        })
      } else {
        message.error(res.errmsg)
      }
      this.setState({
        loading: false
      })
    })
  }

  componentWillMount() {
    this.getDataSource({ currentPage: 1, pageSize: 10 })
  }

  _columns = [
    {
      dataIndex: 'rowNo',
      title: '序号',
      render: (text, record, index) => {
        const { pageSize, pageNo } = this.state.page
        return (
          <span>{
            pageSize *
            pageNo +
            (index + 1) -
            pageSize
          }
          </span>
        )
      }
    },
    {
      dataIndex: 'firstColumn',
      title: '第一列'
    },
    {
      dataIndex: 'status',
      title: '导入状态',
      render: (text) => {
        return (
          <span>{text + '' === '1' ? '导入成功' : '导入失败'}</span>
        )
      }
    },
  ]

  _handleChange = (pagination, filters, sorter) => {
    const { page } = this.state
    const { current, pageSize } = pagination
    const finalFilter = { currentPage: page.pageSize !== pageSize ? 1 : current, pageSize }
    this.getDataSource(finalFilter)
  }

  render() {
    const { type } = this.props
    const { loading, dataSource, page } = this.state
    const pagination = genPagination(page)
    return (
      <Table
        pagination={pagination}
        columns={type === '1' ? this._columns : this._columns.concat([{ title: '失败原因', dataIndex: 'remark' }])}
        onChange={this._handleChange}
        dataSource={dataSource}
        loading={loading}
      />
    )
  }
}

export default DetailModal
