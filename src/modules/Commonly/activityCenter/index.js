import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isEmpty } from 'Utils/lang'
import style from './style.less'
import { Button, Table, Input, Popconfirm, Select, Form, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import * as actions from './reduck'
import { ACTIVITY_CENTER_ADD, ACTIVITY_CENTER_EDIT } from 'Global/urls'
import { genPagination } from 'Utils/helper'

const Option = Select.Option
const status = {
  '0': '未开始',
  '1': '进行中',
  '3': '已结束',
}
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

class Activity extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reqBean: {
        name: '',
        status: '',
        currentPage: '1',
        pageSize: '20'
      }
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(actions.getActivityList(this.state.reqBean))
  }

  handleChangeStatus = (id, status) => {
    const req = {
      id: id,
      status: status
    }
    this.props.dispatch(actions.changeStatus(req)).then(res => {
      if (res) {
        this.props.dispatch(actions.getActivityList(this.state.reqBean))
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const newReqBean = {
          status: values.status,
          name: values.name,
          currentPage: '1',
          pageSize: '20'
        }
        this.setState({
          reqBean: newReqBean
        }, () => {
          this.props.dispatch(actions.getActivityList(this.state.reqBean))
        })
      }
    })
  }

  _handlePageChange = (page) => {
    this.setState({
      reqBean: Object.assign({}, this.state.reqBean, { currentPage: page.current })
    }, () => {
      this.props.dispatch(actions.getActivityList(this.state.reqBean))
    })
  }

  columns = [
    {
      key: 'rowNo',
      title: '序号',
      dataIndex: 'rowNo',
      width: 70,
      render: (text, record, index) => {
        const { pageSize, pageNo } = this.props.page
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
      key: 'name',
      title: '名称',
      dataIndex: 'name'
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
      key: 'startTime',
      title: '开始时间',
      dataIndex: 'startTime',
      width: 108
    },
    {
      key: 'endTime',
      title: '结束时间',
      dataIndex: 'endTime',
      width: 108
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (text, record, index) => (
        <span>{status[text]}</span>
      )
    },
    {
      key: 'sort',
      title: '排序',
      dataIndex: 'sort',
      width: 80
    },
    {
      key: 'updateTime',
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 108
    },
    {
      key: 'operate',
      title: '操作',
      dataIndex: 'operate',
      width: 80,
      render: (text, record, index) => {
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        return (
          <span>
            {btnRole.includes('down') && (
              <Popconfirm
                title={`确定要${record.status === '0' || record.status === '1' ? '下架' : ''}吗？`}
                onConfirm={() => this.handleChangeStatus(record.id, '2')}
              >
                <a size='small'>{record.status === '0' || record.status === '1' ? (<span>下架&nbsp;&nbsp;</span>) : ''}</a>
              </Popconfirm>
            )}
            {btnRole.includes('edit') && (
              <Link
                to={`${ACTIVITY_CENTER_EDIT}/${record.id}`}
              >修改
              </Link>
            )}
          </span>
        )
      }
    }
  ]

  render() {
    const { getFieldDecorator } = this.props.form
    const { list, page, auths, match } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    const pagination = genPagination(page, false)
    return (
      <div>
        <Form onSubmit={this.handleSubmit} className={style['search-form']}>
          <Row>
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
                label='状态'
              >
                <div
                  id='status'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('status', {
                    rules: [{
                      required: false,
                    }],
                    initialValue: '',
                  })(
                    <Select
                      getPopupContainer={() => document.getElementById('status')}
                    >
                      <Option value=''>全部</Option>
                      <Option value='0'>未开始</Option>
                      <Option value='1'>进行中</Option>
                      <Option value='2'>已结束</Option>
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
                {btnRole.includes('add') && (
                  <Link to={ACTIVITY_CENTER_ADD}>
                    <Button
                      type='primary'
                      title='新增'
                    >
                      新增
                    </Button>
                  </Link>
                )}
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
    list: state.activity.activityList,
    page: state.activity.page,
    auths: state.common.auths,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Activity))

