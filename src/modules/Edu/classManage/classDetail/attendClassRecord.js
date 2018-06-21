import React, { Component } from 'react'
import { Table, Button, Popconfirm } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  getRecordList,
  deleteRecord,
} from '../reduck'
import styles from '../style.less'
import {
  EDU_CLASS_MANAGE_DETAIL_RECORD_ADD,
  EDU_CLASS_MANAGE_DETAIL_RECORD_EDIT,
} from 'Global/urls'
import { isEmpty } from '../../../../utils/lang'
import paramsUtil from '../../../../utils/params'

class AttendClassRecord extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRows: [],
      currentPage: 1,
      classId: paramsUtil.url2json(location).classId,
    }
  }

  columns = [
    {
      key: 'orgIndex',
      title: '序号',
      dataIndex: 'orgIndex',
      render: (text, record, index) => {
        const { pageSize, currentPage } = this.props.page
        return (
          <span>{pageSize * currentPage + (index + 1) - pageSize}</span>
        )
      }
    },
    {
      key: 'recoreDate',
      title: '上课日期',
      dataIndex: 'recoreDate'
    },
    {
      key: 'teacherName',
      title: '教师',
      dataIndex: 'teacherName',
    },
    {
      key: 'attend',
      title: '上课',
      dataIndex: 'attend'
    },
    {
      key: 'leav',
      title: '请假',
      dataIndex: 'leav'
    },
    {
      key: 'cut',
      title: '旷课',
      dataIndex: 'cut',
    },
    {
      key: 'remedial',
      title: '补课',
      dataIndex: 'remedial',
    },
    {
      key: 'content',
      title: '上课内容',
      dataIndex: 'content',
    },
    {
      key: 'updateTime',
      title: '更新时间',
      dataIndex: 'updateTime',
    },
  ]

  componentWillMount() {
    const { dispatch } = this.props
    this.state.classId && dispatch(getRecordList({ classId: this.state.classId, currentPage: 1 }))
  }

  _onPaginationChange = page => {
    this.setState({
      currentPage: page
    }, () => {
      this.props.dispatch(getRecordList({ classId: this.state.classId, currentPage: page }))
    })
  }

  _handleDelete = (selectedRows) => {
    const { dispatch } = this.props
    dispatch(deleteRecord({ idList: selectedRows.map(item => item.id) })).then(res => {
      res && dispatch(getRecordList({ classId: this.state.classId, currentPage: this.state.currentPage }))
    })
  }

  rowSelect = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRows
    })
  }

  rowSelection = {
    onChange: this.rowSelect,
    type: 'checkbox',
  }

  render() {
    const { page, list, studentInfoList, showListSpin } = this.props
    const { selectedRows, classId } = this.state
    return (
      <div>
        {studentInfoList && !isEmpty(studentInfoList) && (
          <div className={styles['operate-btn']}>
            <Link to={`${EDU_CLASS_MANAGE_DETAIL_RECORD_ADD}?classId=${classId}`}><Button type='primary'>新增</Button></Link>
            <Link to={`${EDU_CLASS_MANAGE_DETAIL_RECORD_EDIT}?recordId=${isEmpty(selectedRows) ? '' : '' + selectedRows[0].id}&classId=${classId}`}>
              <Button type='primary' disabled={selectedRows.length !== 1}>编辑</Button>
            </Link>
            <Popconfirm
              title={`确定要删除吗？`}
              onConfirm={() => this._handleDelete(selectedRows)}
            >
              <Button type='danger' disabled={selectedRows.length < 1}>删除</Button>
            </Popconfirm>
          </div>
        )}
        <Table
          className={styles['c-table-center']}
          columns={this.columns}
          dataSource={list}
          loading={showListSpin}
          rowKey='id'
          rowSelection={this.rowSelection}
          pagination={{
            current: parseInt(page.currentPage),
            onChange: this._onPaginationChange,
            pageSize: parseInt(page.pageSize),
            total: parseInt(page.totalCount),
            showTotal: (total) => (<span>共{total}条</span>)
          }}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    list: state.classManage.recordList,
    studentInfoList: state.classManage.studentInfoList,
    page: state.classManage.recordPage,
    showListSpin: state.common.showListSpin
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(AttendClassRecord)
