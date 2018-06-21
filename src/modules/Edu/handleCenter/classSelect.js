import React from 'react'
import { Input, Row, Col, Table, Button, Popover } from 'antd'

import * as actions from './reduck'
import styles from './index.less'

class ClassSelect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      className: '',
      dataSource: [],
      page: {}
    }
  }

  _columns = [
    {
      title: '班级名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => {
        return (
          <Popover
            content = {<div className={styles['pop']}>{text}</div>}
            title = '班级名称'
          >
            <span>{text && text.length > 15 ? `${text.substring(0, 15)}...` : text}</span>
          </Popover>)
      },
    },
    {
      title: '报名人数',
      dataIndex: 'inCount',
      key: 'inCount',
    },
    {
      title: '预招人数',
      dataIndex: 'planStudentCount',
      key: 'planStudentCount',
    },
    {
      title: '课程',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: '教师',
      dataIndex: 'teacherName',
      key: 'teacherName',
    }
  ]

  // 班级选择
  rowSelectionClass = {
    type: 'radio',
    onChange: (selectedRowKeys, selectedRows) => this.props.onSelectChangeClass(selectedRowKeys, selectedRows, this.props.onCancel),
  }

  _getQueryParameter = (currentPage, pageSize) => {
    return {
      currentPage: currentPage,
      pageSize: pageSize,
      className: this.state.className
    }
  }

  _setDataSource = (arg) => {
    this.props.dispatch(actions.getClassroomList(arg)).then(res => {
      res && this.setState({
        dataSource: res.result,
        page: res.page,
      })
    })
  }

  componentWillMount() {
    const arg = this._getQueryParameter(1, 10)
    this._setDataSource(arg)
  }

  _handleClassAction = () => {
    const arg = this._getQueryParameter(1, 10)
    this._setDataSource(arg)
  }

  _handlePagination = (page) => {
    const arg = this._getQueryParameter(page, 10)
    this._setDataSource(arg)
  }

  render() {
    // const cancelClassModal = this.props.onCancel
    const { dataSource, page } = this.state
    return (
      <div>
        <Row style={{ marginBottom: 20 }}>
          <Col span={8}>
            <Input
              placeholder='请输入班级名称'
              onChange={(e) => {
                this.setState({
                  className: e.target.value
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
          columns={this._columns}
          rowSelection={this.rowSelectionClass}
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

export default ClassSelect
