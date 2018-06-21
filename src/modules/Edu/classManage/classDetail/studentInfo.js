import React, { Component } from 'react'
import { Table, Button, Input } from 'antd'
import { connect } from 'react-redux'
import {
  getStudentInfoList,
  sendMsg
} from '../reduck'
import styles from '../style.less'
// import { isEmpty } from '../../../../utils/lang'
import paramsUtil from '../../../../utils/params'
import { showModalForm } from '../../../../components/modal/ModalForm'

const TextArea = Input.TextArea

class StudentInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRows: [],
      classId: paramsUtil.url2json(location).classId
    }
  }

  _handleMessage = (selectedRows) => {
    showModalForm({
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 }
      },
      title: '发送短信',
      fields: [
        {
          id: 'msg',
          props: {
          },
          options: {
            rules: [{
              required: true,
              message: '请输入短信内容!'
            }]
          },
          element: (
            <TextArea
              maxLength='200'
              placeholder='请输入短信内容'
            />
          )
        },
      ],
      onOk: values => {
        return this.props.dispatch(sendMsg({
          message: selectedRows.map(item => ({
            msg: values.msg,
            phone: item.linkPhone
          }))
        }))
      }
    })
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
      key: 'studentNo',
      title: '学员编号',
      dataIndex: 'studentNo'
    },
    {
      key: 'name',
      title: '学员姓名',
      dataIndex: 'name',
    },
    {
      key: 'linkPhone',
      title: '联系方式',
      dataIndex: 'linkPhone'
    },
    {
      key: 'userdHour',
      title: '已用课时',
      dataIndex: 'userdHour'
    },
    {
      key: 'resHour',
      title: '剩余课时',
      dataIndex: 'resHour',
    },
    {
      key: 'orderTime',
      title: '报班时间',
      dataIndex: 'orderTime',
    },
  ]

  rowSelect = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRows
    })
  }

  rowSelection = {
    onChange: this.rowSelect,
    type: 'checkbox',
  }

  // componentWillMount() {
  //   const { dispatch } = this.props
  //   dispatch(getStudentInfoList({ classId: this.state.classId, currentPage: 1 }))
  // }

  _onPaginationChange = page => {
    this.setState({
      currentPage: page
    }, () => {
      this.props.dispatch(getStudentInfoList({ classId: this.state.classId, currentPage: page }))
    })
  }

  render() {
    const { page, list, showListSpin } = this.props
    const { selectedRows } = this.state
    return (
      <div>
        <div className={styles['operate-btn']}>
          <Button type='primary' disabled={selectedRows.length < 1} onClick={() => this._handleMessage(selectedRows)}>短信通知</Button>
        </div>
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
    list: state.classManage.studentInfoList,
    page: state.classManage.studentInfoPage,
    showListSpin: state.common.showListSpin
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(StudentInfo)
