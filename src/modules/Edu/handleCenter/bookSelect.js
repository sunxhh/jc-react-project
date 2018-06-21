import React from 'react'
import { Input, Row, Col, Table, Button, Popover } from 'antd'

import * as actions from './reduck'
import styles from './index.less'

class BookSelect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      textBookTitle: '',
      dataSource: [],
      page: {}
    }
  }

  _bookColumns = [
    {
      title: '教材名称',
      dataIndex: 'textBookTitle',
      key: 'textBookTitle',
      render: (text) => {
        return (
          <Popover
            content = {<div className={styles['pop']}>{text}</div>}
            title = '教材名称'
          >
            <span>{text && text.length > 15 ? `${text.substring(0, 15)}...` : text}</span>
          </Popover>)
      },
    },
    {
      title: '价格',
      dataIndex: 'salePrice',
      key: 'salePrice'
    },
    {
      title: '成本',
      dataIndex: 'buyPrice',
      key: 'buyPrice'
    }
  ]

  // 班级选择
  onSelectChangeBook = {
    type: 'radio',
    onChange: (selectedRowKeys, selectedRows) => this.props.onSelectChangeBook(selectedRowKeys, selectedRows, this.props.onCancel),
  }

  // 获取教材查询条件
  _getQueryClassParameter = (currentPage, pageSize) => {
    return {
      currentPage: currentPage,
      pageSize: pageSize,
      textbook: {
        textBookTitle: this.state.textBookTitle
      }
    }
  }

  _setDataSource = (arg) => {
    this.props.dispatch(actions.getBookList(arg)).then(res => {
      res && this.setState({
        dataSource: res.result,
        page: res.page,
      })
    })
  }

  componentWillMount() {
    const arg = this._getQueryClassParameter(1, 10)
    this._setDataSource(arg)
  }

  _handleClassAction = () => {
    const arg = this._getQueryClassParameter(1, 10)
    this._setDataSource(arg)
  }

  _handlePagination = (page) => {
    const arg = this._getQueryClassParameter(page, 10)
    this._setDataSource(arg)
  }

  render() {
    const { dataSource, page } = this.state
    return (
      <div>
        <Row style={{ marginBottom: 20 }}>
          <Col span={8}>
            <Input
              placeholder='请输入教材名称'
              onChange={(e) => {
                this.setState({
                  textBookTitle: e.target.value
                })
              }}
            />
          </Col>
          <Col span={8}>
            <Button
              className={styles['btn-search']}
              type='primary'
              onClick={this._handleClassAction}
            >
              查询
            </Button>
          </Col>
        </Row>
        <Table
          key='id'
          columns={this._bookColumns}
          rowSelection={this.onSelectChangeBook}
          dataSource={dataSource}
          locale={{
            emptyText: '暂无数据'
          }}
          pagination={{
            pageSize: page.pageSize,
            total: page.totalCount,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 条`,
            onChange: this._handlePagination,
            currentPage: page.currentPage,
          }
          }
        />
      </div>
    )
  }
}

export default BookSelect
