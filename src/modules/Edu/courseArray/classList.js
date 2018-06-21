import React from 'react'
import { Table } from 'antd'
import { getClassList } from './reduck'

class ClassList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      page: {}
    }
  }

  getClassList = (page) => {
    const { dispatch } = this.props
    return dispatch(getClassList({
      classTo: {
        name: '',
        organizationId: '',
        classStatus: '',
        courseStartDate: '',
        courseEndDate: ''
      },
      currentPage: page || 1,
      pageSize: 10
    })).then(res => {
      res && this.setState({
        dataSource: res.result,
        page: res.page
      })
    })
  }

  componentWillMount() {
    this.getClassList()
  }

  rowSelect = (selectedRowKeys, selectedRows) => {
    const { onCancel, selectRow } = this.props
    selectRow(selectedRows)
    onCancel && onCancel()
  }

  pageChange = (page) => {
    this.getClassList(page)
  }

  render() {
    // const {} = this.props
    const { dataSource, page } = this.state
    const columns = [
      {
        title: '班级名称',
        dataIndex: 'name',
        key: 'name',
        width: 150
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
        width: 100,
      }
    ]
    const rowSelection = {
      onChange: this.rowSelect,
      type: 'radio',
    }
    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        rowSelection={rowSelection}
        pagination = {{
          current: page.currentPage,
          onChange: this.pageChange,
          pageSize: page.pageSize,
          total: page.totalCount,
          showTotal: (total) => (<span>共{total}条</span>)
        }}
        rowKey='id'
      />
    )
  }
}

export default ClassList
