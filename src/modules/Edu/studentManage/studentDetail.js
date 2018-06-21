import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Card, Popover } from 'antd'
import {
  getStudentDetail,
  getChannelList,
} from '../studentManage/reduck'
import { PAGE_SIZE } from '../pagination'
import BaseInform from './baseInform'
import { Table } from 'antd'
import moment from 'moment'
import styles from './index.less'

const touchType = {
  '1': '咨询沟通',
  '2': '售前沟通',
  '3': '活动通知',
  '4': '电话服务',
  '5': '电话家访',
  '6': '其他',
}
class StudentDetail extends Component {
  static defaultProps = {
    list: [],
    studentDetail: {},
    pagination: {
      current: 1,
      total: 0,
      pageSize: PAGE_SIZE,
    },
  }
  componentWillMount() {
    const { dispatch, pagination } = this.props
    const studentId = this.props.match.params.id
    dispatch(getStudentDetail({ id: studentId }))
    dispatch(getChannelList({ currentPage: pagination.current, pageSize: pagination.pageSize, studentChannel: {}}))
  }

  _columns = [
    {
      title: '序号',
      dataIndex: 'rowNo',
      key: 'rowNo',
      width: 100,
      render: (text, record, index) => {
        const { pageSize, current } = this.props.pagination
        return (
          <span>{
            pageSize *
            current +
            (index + 1) -
            pageSize
          }
          </span>
        )
      }
    },
    {
      key: 'touchType',
      title: '沟通类型',
      dataIndex: 'touchType',
      width: 110,
      render: (text) => touchType[text]
    },
    {
      key: 'touchContent',
      title: '沟通内容',
      dataIndex: 'touchContent',
      width: 200,
      render: (text) => {
        return (
          <Popover
            placement='topLeft'
            content={<div className={styles['pop']}>{text}</div>}
            title='沟通内容'
          >
            <span>{text && text.length > 15 ? `${text.substring(0, 20)}...` : text}</span>
          </Popover>
        )
      }
    },
    {
      key: 'touchNextTime',
      title: '回访时间',
      dataIndex: 'touchNextTime',
      width: 110,
      render: (text, record) => (
        <span>{record.touchNextTime ? moment(record.touchNextTime).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
      )
    },
    {
      key: 'touchTime',
      title: '沟通时间',
      dataIndex: 'touchTime',
      width: 110,
      render: (text, record) => (
        <span>{record.touchTime ? moment(record.touchTime).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
      )
    }
  ]
  render() {
    const { studentDetail } = this.props
    return (
      <div>
        <BaseInform
          studentDetail={studentDetail}
        />
        <Card
          title = '沟通信息'
          style= {{ marginBottom: '20px' }}
        >
          <Table
            className={styles['table-center']}
            columns={this._columns}
            rowKey='id'
            dataSource={studentDetail.touch}
            scroll={{ y: 600 }}
            pagination={false}
            loading={this.props.isLoading}
          />
        </Card>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    token: state.common.qiniuToken || '',
    studentDetail: state.eduStudents.studentDetail
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StudentDetail))

