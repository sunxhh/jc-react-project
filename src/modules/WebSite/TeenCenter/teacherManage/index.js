import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isEmpty } from 'Utils/lang'
import style from './style.less'
import { Button, Table, Input, Popconfirm, Select, Form, Row, Col, Divider } from 'antd'
import { Link } from 'react-router-dom'
import * as actions from './reduck'
import { TEACHER_MANAGE_ADD } from 'Global/urls'
import { genPagination } from 'Utils/helper'

const Option = Select.Option
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

class Teacher extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reqBean: {
        name: '',
        courseId: '',
        currentPage: '1',
        pageSize: '20'
      }
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(actions.getTeacherList(this.state.reqBean))
    dispatch(actions.getClassAll())
  }

  handleChangeStatus = (id) => {
    this.props.dispatch(actions.changeStatus({ idList: [id] })).then(res => {
      if (res) {
        this.props.dispatch(actions.getTeacherList(this.state.reqBean))
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const newReqBean = {
          courseId: values.courseId,
          name: values.name,
          currentPage: '1',
          pageSize: '20'
        }
        this.setState({
          reqBean: newReqBean
        }, () => {
          this.props.dispatch(actions.getTeacherList(this.state.reqBean))
        })
      }
    })
  }

  _handlePageChange = (page) => {
    const { reqBean } = this.state
    this.setState({
      reqBean: Object.assign({}, this.state.reqBean, { currentPage: reqBean.pageSize !== page.pageSize ? 1 : page.current, pageSize: page.pageSize })
    }, () => {
      this.props.dispatch(actions.getTeacherList(this.state.reqBean))
    })
  }

  columns = [
    {
      key: 'rowNo',
      title: '序号',
      dataIndex: 'rowNo',
      render: (text, record, index) => {
        const { pageSize, currentPage } = this.props.page
        return (
          <span>{
            pageSize *
            currentPage +
            (index + 1) -
            pageSize
          }
          </span>
        )
      }
    },
    {
      key: 'name',
      title: '名称',
      dataIndex: 'name',
    },
    {
      key: 'image',
      title: '图片',
      dataIndex: 'image',
      width: 75,
      render: (text, record, index) => {
        return (
          isEmpty(record.image) ? '' : (
            <div className={style['img-wrapper']}>
              <img
                src={record.image}
                alt='图片'
              />
            </div>
          )
        )
      }
    },
    {
      key: 'courseName',
      title: '所教课程',
      dataIndex: 'courseName'
    },
    {
      key: 'sort',
      title: '排序',
      dataIndex: 'sort'
    },
    {
      key: 'createTime',
      title: '创建时间',
      dataIndex: 'createTime'
    },
    {
      key: 'operate',
      title: '操作',
      dataIndex: 'operate',
      render: (text, record, index) => {
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        return (
          <span>
            {
              btnRole.includes('delete') && <Popconfirm
                title='删除后教师信息将无法追回，确认删除？'
                onConfirm={() => this.handleChangeStatus(record.id)}
              >
                <a size='small'>删除</a>
              </Popconfirm>
            }
            {
              btnRole.includes('delete') &&
              btnRole.includes('edit') &&
              <Divider type='vertical' />
            }
            {
              btnRole.includes('edit') && <Link
                to={`/teen/teacher/edit/${record.id}`}
              >修改
              </Link>
            }
          </span>
        )
      }
    }
  ]

  render() {
    const { getFieldDecorator } = this.props.form
    const { list, page, classAll, auths, match } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    const pagination = genPagination({ ...page, records: page.totalCount, pageNo: page.currentPage })
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Row className='search-form'>
            <Col span={5}>
              <FormItem
                {...formItemLayout}
                label='名称'
              >
                {getFieldDecorator('name', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: '',
                })(
                  <Input placeholder='名称' />
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem
                {...formItemLayout}
                label='课程'
              >
                <div
                  id='courseId'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('courseId', {
                    rules: [{
                      required: false,
                    }],
                  })(
                    <Select
                      placeholder='请选择课程'
                      getPopupContainer={() => document.getElementById('courseId')}
                    >
                      <Option value=''>
                        全部
                      </Option>
                      {
                        classAll && classAll.map((item, index) => (
                          <Option
                            key={item.id}
                            value={item.id}
                          >
                            {item.name}
                          </Option>
                        ))
                      }
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={9}>
              <FormItem>
                <Button
                  type='primary'
                  htmlType='submit'
                >查询
                </Button>
                {
                  btnRole.includes('add') && (
                    <Link to={TEACHER_MANAGE_ADD}>
                      <Button
                        type='primary'
                        title='新增'
                      >
                        新增
                      </Button>
                    </Link>
                  )
                }
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Table
          columns={this.columns}
          dataSource={list}
          rowKey='id'
          pagination= {pagination}
          onChange={this._handlePageChange}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.teacher.teacherList,
    page: state.teacher.page,
    classAll: state.teacher.classAll,
    auths: state.common.auths
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Teacher))

