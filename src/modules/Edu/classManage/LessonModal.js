import React, { Component } from 'react'
import { Modal, Table, Form, Popover, Input, Select, Button } from 'antd'
import * as actions from './reduck'
import { PAG_CONFIG } from '../pagination'
import styles from './style.less'

const FormItem = Form.Item
const courseModel = {
  '1': '授课',
  '2': '一对一',
}

const courseType = {
  '1': '舞蹈',
  '2': '美术',
  '3': '音乐',
  '4': '口才',
}

const payModel = {
  '1': '按课时',
  '2': '按学期',
}

class LessonModal extends Component {
  _columnsLesson = [{
    title: '序号',
    dataIndex: 'rowNo',
    key: 'rowNo',
    width: 80,
    render: (text, record, index) => {
      const { pageSize, current } = this.props.coursePagination
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
  }, {
    title: '课程名称',
    dataIndex: 'courseName',
    key: 'courseName',
    width: 100,
    render: (text) => {
      return (
        <Popover
          content = {text}
          title = '课程名称'
        >
          <span>{text && text.length > 6 ? `${text.substring(0, 6)}...` : text}</span>
        </Popover>)
    }
  }, {
    title: '课程模式',
    dataIndex: 'courseModel',
    key: 'courseModel',
    width: 100,
    render: (text) => {
      return (
        <span>{courseModel[text]}</span>)
    }
  }, {
    title: '课程类别',
    dataIndex: 'courseType',
    key: 'courseType',
    width: 100,
    render: (text) => {
      return (
        <span>{courseType[text]}</span>)
    }
  }, {
    title: '收费模式',
    dataIndex: 'payModel',
    key: 'payModel',
    width: 100,
    render: (text) => {
      return (
        <span>{payModel[text]}</span>)
    }
  }, {
    title: '单位',
    dataIndex: 'unit',
    key: 'unit',
    width: 100,
  }, {
    title: '学费标准',
    dataIndex: 'standardFees',
    key: 'standardFees',
    width: 100,
    render: (text) => {
      return (
        <Popover
          content = {text}
          title = '学费标准'
        >
          <span>{text && text.length > 8 ? `${text.substring(0, 8)}...` : text}</span>
        </Popover>)
    }
  }, {
    title: '教材',
    dataIndex: 'textbookPrice',
    key: 'textbookPrice',
    width: 100,
    render: (text) => {
      return (
        <Popover
          content = {text}
          title = '教材'
        >
          <span>{text && text.length > 6 ? `${text.substring(0, 6)}...` : text}</span>
        </Popover>)
    }
  }]
  // 获取查询条件里面的 value 值
  _getQueryParameter = (current = this.props.coursePagination.current, pageSize = this.props.coursePagination.pageSize) => {
    return { course: { ...this.props.form.getFieldsValue() }, currentPage: current, pageSize: pageSize }
  }

  // 发起列表查询的 ACTION
  _handleAction = (page, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getQueryParameter(page, pageSize)
    dispatch(actions.getCourseList(arg))
  }

  // 点击查询按钮时，根据参数获取表格数据
  _handleSubmit = (e) => {
    this._handleAction()
  }

  // 点击分页时获取表格数据
  _handlePagination = (page) => {
    this._handleAction(page.current, page.pageSize)
  }

  _onSelectChange = (selectedRowKeys, selectedRows) => {
    const { dispatch } = this.props
    dispatch(actions.getCourseAndCourseId({
      courseIds: selectedRowKeys,
    }))
    // const courseNames = this._getSelectCourseNames(selectedRows)
    this.props.addForm.setFieldsValue({
      'courseIds': selectedRows[0].courseName
    })
    this._onCancel()
  }

  _getSelectCourseNames = (arr) => {
    return arr.map((item) => {
      return item.courseName
    })
  }

  _onCancel = () => {
    const { dispatch } = this.props
    dispatch(actions.switchShowLessonModal(false))
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const _rowSelection = {
      type: 'radio',
      // selectedRowKeys: this.props.selectedRowKeys,
      onChange: this._onSelectChange,
    }
    return (
      <Modal
        title='选择课程'
        visible={this.props.showLessonModal}
        width={900}
        bodyStyle={{ width: '900px' }}
        footer={false}
        onCancel = {this._onCancel}
      >
        <Form
          layout='inline'
        >
          <FormItem
            label='课程名称：'
            className={styles['search-form-item']}
          >
            {getFieldDecorator('courseName')(
              <Input placeholder='请输入课程名称' />
            )}
          </FormItem>
          <FormItem
            label='课程类型：'
          >
            {getFieldDecorator('courseType', {
              initialValue: '',
            })(
              <Select
                placeholder='请选择课程类型'
                style={{ width: '150px' }}
              >
                <Select.Option
                  key='-1'
                  value=''
                >全部
                </Select.Option>
                {
                  Object.keys(courseType).map((key) => {
                    return (
                      <Select.Option
                        key={key}
                        value={key}
                      >
                        {courseType[key]}
                      </Select.Option>
                    )
                  })
                }
              </Select>
            )}
          </FormItem>
          <FormItem
            className={styles['search-form-item']}
          >
            <Button
              type='primary'
              onClick={this._handleSubmit}
              icon='search'
              style={{ marginBottom: '20px' }}
            >
            查询
            </Button>
          </FormItem>
        </Form>
        <Table
          columns = {this._columnsLesson}
          rowKey = 'id'
          loading = {this.props.courseLoading}
          dataSource = {this.props.courseList}
          onChange = {this._handlePagination}
          rowSelection = {_rowSelection}
          scroll={{
            x: 820,
            y: 300,
          }}
          pagination = {{ ...this.props.coursePagination, ...PAG_CONFIG }}
        />
      </Modal>)
  }
}

export default Form.create()(LessonModal)
