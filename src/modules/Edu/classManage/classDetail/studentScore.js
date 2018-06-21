import React, { Component } from 'react'
import { Table, Button, Form, Input, DatePicker, Row, Col, Popconfirm } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'
import {
  getStudentScoreList,
  deleteScore,
  editStudentScore,
  getStudentList,
  addStudentScore,
} from '../reduck'
import styles from '../style.less'
import StudentList from './studentList'
import { isEmpty } from '../../../../utils/lang'
import paramsUtil from '../../../../utils/params'
import { showModalWrapper } from '../../../../components/modal/ModalWrapper'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}

class StudentScore extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRows: [],
      currentPage: 1,
      classId: paramsUtil.url2json(location).classId
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
      title: '联系电话',
      dataIndex: 'linkPhone'
    },
    {
      key: 'examDate',
      title: '考试日期',
      dataIndex: 'examDate'
    },
    {
      key: 'examName',
      title: '考试名称',
      dataIndex: 'examName',
    },
    {
      key: 'examScore',
      title: '成绩',
      dataIndex: 'examScore',
    },
    {
      key: 'examRemark',
      title: '备注',
      dataIndex: 'examRemark',
    },
    {
      key: 'updateTime',
      title: ' 更新时间',
      dataIndex: 'updateTime',
    },
  ]

  confirm = (arg, callback) => {
    const { dispatch } = this.props
    const { classId } = this.state
    this.props.dispatch(addStudentScore({ ...arg, classId })).then(res => {
      if (res) {
        callback()
        dispatch(getStudentScoreList({ classId: this.state.classId, currentPage: 1 }))
      }
    })
  }

  StudentScoreEdit = (props) => {
    const { form, dataSource } = props
    const { getFieldDecorator } = form
    return (
      <Form>
        <Row>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label='编号'
            >
              {getFieldDecorator('studentNo', {})(
                <span>{dataSource.studentNo}</span>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label='姓名'
            >
              {getFieldDecorator('name', {})(
                <span>{dataSource.name}</span>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label='考试名称'
            >
              {getFieldDecorator('examName',
                {
                  initialValue: dataSource.examName
                }
              )(
                <Input placeholder='请输入考试名称' />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label='考试时间'
            >
              {getFieldDecorator('examDate',
                {
                  initialValue: dataSource.examDate ? moment(new Date(dataSource.examDate)) : ''
                }
              )(
                <DatePicker placeholder='请选择考试时间' />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label='考试成绩'
            >
              {getFieldDecorator('examScore',
                {
                  initialValue: dataSource.examScore
                }
              )(
                <Input placeholder='请输入考试成绩' />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label='备注'
            >
              {getFieldDecorator('examRemark',
                {
                  initialValue: dataSource.examRemark
                }
              )(
                <Input placeholder='请输入备注' />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem className={styles['handle-box']}>
              <Button onClick={props.onCancel}>取消</Button>
              <Button
                type='primary'
                onClick={() => {
                  form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                      const { dispatch } = this.props
                      dispatch(editStudentScore({
                        classExam: {
                          id: dataSource.id,
                          examName: values.examName,
                          examDate: values.examDate.format('YYYY-MM-DD'),
                          examScore: values.examScore,
                          examRemark: values.examRemark,
                        }
                      })).then(res => {
                        props.onCancel()
                        res && dispatch(getStudentScoreList({ classId: this.state.classId, currentPage: this.state.currentPage }))
                      })
                    }
                  })
                }}
                loading={this.props.showBtnSpin}
              >保存
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
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

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(getStudentScoreList({ classId: this.state.classId, currentPage: 1 }))
  }

  _onPaginationChange = page => {
    this.setState({
      currentPage: page
    }, () => {
      this.props.dispatch(getStudentScoreList({ classId: this.state.classId, currentPage: page }))
    })
  }

  _handleEntering = () => {
    this.props.dispatch(getStudentList({ classId: this.state.classId })).then(res => {
      res && showModalWrapper(
        <StudentList
          dataSource={res}
          confirm={this.confirm}
          dispatch={this.props.dispatch}
        />,
        {
          title: '录入成绩',
          width: 700
        }
      )
    })
  }

  _handleEdit = (selectedRows) => {
    const StudentScoreEdit = Form.create()(this.StudentScoreEdit)
    showModalWrapper(
      <StudentScoreEdit
        dataSource={selectedRows[0]}
      />,
      {
        title: '编辑成绩',
      }
    )
  }

  _handleDelete = (selectedRows) => {
    const { dispatch } = this.props
    dispatch(deleteScore({ idList: selectedRows.map(item => item.id) })).then(res => {
      res && dispatch(getStudentScoreList({ classId: this.state.classId, currentPage: this.state.currentPage }))
    })
  }

  render() {
    const { page, list, switchListLoading, studentInfoList } = this.props
    const { selectedRows } = this.state
    return (
      <div>
        {studentInfoList && !isEmpty(studentInfoList) && (
          <div className={styles['operate-btn']}>
            <Button type='primary' onClick={() => this._handleEntering()} loading={this.props.showBtnSpin}>录入</Button>
            <Button type='primary' disabled={selectedRows.length !== 1} onClick={() => this._handleEdit(selectedRows)}>编辑</Button>
            <Popconfirm
              title='确定要删除吗？'
              onConfirm={() => this._handleDelete(selectedRows)}
            >
              <Button
                disabled={selectedRows.length < 1}
                type='danger'
                title='点击删除'
              >删除
              </Button>
            </Popconfirm>
          </div>
        )}
        <Table
          className={styles['c-table-center']}
          columns={this.columns}
          dataSource={list}
          rowKey='id'
          rowSelection={this.rowSelection}
          loading={switchListLoading}
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
    list: state.classManage.studentScoreList,
    page: state.classManage.studentScorePage,
    switchListLoading: state.common.showListSpin,
    studentInfoList: state.classManage.studentInfoList,
    showBtnSpin: state.common.showButtonSpin,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(StudentScore)
