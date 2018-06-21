import React, { Component } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button, Popconfirm, Table, Form, Input, message, Row, Col, Select, Spin } from 'antd'
import {
  getUserList,
  deleteList,
  updateSelectedUserIds,
  getOrgList
} from './reduck'
import styles from './userManage.less'
import { debounce } from '../../../utils/function'
import { isEmpty } from '../../../utils/lang'
import * as urls from '../../../global/urls'
import Ellipsis from 'Components/Ellipsis'
import { genPagination } from 'Utils/helper'

const FormItem = Form.Item
const SelectOption = Select.Option

const sex = {
  '1': '女',
  '0': '男'
}
const userType = {
  '1': '内部用户',
  '9': '内部用户',
  '2': '外部用户'
}
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

class UserList extends Component {
  constructor(props) {
    super(props)
    this._handleOrgSearch = debounce(this._handleOrgSearch, 800)
    this.state = {
      selectedRows: []
    }
  }

  static defaultProps = {
    list: [],
    uuids: [],
    page: {
      current: 1,
      pageSize: 20,
      total: 0,
      isLoading: false,
    },
  }

  _columns = [
    {
      key: 'key',
      title: '序号',
      dataIndex: 'key',
      width: 80,
      render: (text, record, index) => (
        <span>{(this.props.page.pageNo - 1) * this.props.page.pageSize + (index + 1)}</span>
      )

    },
    {
      key: 'userName',
      title: '账号',
      dataIndex: 'userName',
      width: 140,
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'fullName',
      title: '姓名',
      dataIndex: 'fullName',
      render: (text) => {
        return (
          <Ellipsis
            length={10}
            tooltip={true}
          >
            {text || ''}
          </Ellipsis>)
      }
    },
    {
      key: 'telPhone',
      title: '电话号码',
      dataIndex: 'telPhone',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'sex',
      title: '性别',
      dataIndex: 'sex',
      render: (text) => (
        <span>{sex[text]}</span>
      )
    },
    {
      key: 'jobTitleName',
      title: '岗位名称',
      dataIndex: 'jobTitleName',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'orgName',
      title: '所属机构',
      width: 150,
      dataIndex: 'orgName',
      render: (text) => {
        return (
          <Ellipsis
            length={20}
            tooltip={true}
          >
            {text || ''}
          </Ellipsis>)
      }
    },
    {
      key: 'userType',
      title: '用户类型',
      dataIndex: 'userType',
      render: (text) => (
        <span>{userType[text]}</span>
      )
    },
    {
      key: 'email',
      title: '电子邮箱',
      width: 150,
      dataIndex: 'email',
      render: (text) => (
        <Ellipsis
          length={15}
          tooltip={true}
        >
          {text || ''}
        </Ellipsis>
      )
    },
    {
      key: 'updateTime',
      title: '更新时间',
      dataIndex: 'updateTime',
      render: (text) => (
        <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
      )
    },
    {
      key: 'remark',
      title: '备注',
      dataIndex: 'remark',
      width: 150,
      render: (text) => {
        return (
          <Ellipsis
            length={30}
            tooltip={true}
          >
            {text || ''}
          </Ellipsis>)
      }
    }
  ]

  _handleOrgSearch = (orgName) => {
    const { dispatch } = this.props
    dispatch(getOrgList({ orgName }))
  }

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getParameter(current, pageSize)
    dispatch(getUserList(arg))
  }

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.page.pageNo, pageSize = this.props.page.pageSize) => {
    const arg = this.props.form.getFieldsValue()
    return {
      ...arg,
      currentPage: current,
      pageSize: pageSize,
    }
  }

  // 点击分页获取列表数据
  _handlePageChange = (page) => {
    this._getList(page.current, page.pageSize)
  }

  // 点击查询
  _handleQuery = () => {
    this._getList(1)
  }

  // 点击删除
  _handleDelete = () => {
    const { uuids, dispatch } = this.props
    const { selectedRows } = this.state
    let hasAdminUser = selectedRows.some((val) => val.userType.toString() === '9')
    if (hasAdminUser) {
      message.error('管理员用户不可以删除！')
    } else {
      dispatch(deleteList({ uuids }, this._getParameter(1)))
    }
  }

  // 编辑时必须要选一个用户
  _handleEdit = () => {
    const { uuids, history } = this.props
    if (uuids.length === 1) {
      history.push(`${urls.USER_EDIT}/${uuids[0]}`)
    } else {
      message.error('只能选择一个用户', 2)
    }
  }

  // 列表复选框事件
  _onSelectChange = (selectedRowKeys, selectedRows) => {
    const { dispatch } = this.props
    this.setState({ selectedRows })
    dispatch(updateSelectedUserIds(selectedRowKeys))
  }

  // 生命周期， 初始化表格数据
  componentDidMount() {
    const { dispatch } = this.props
    this._getList()
    dispatch(getOrgList())
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { list, uuids, showListSpin, page, selectFetchingFlag, orgList, match, auths } = this.props
    const authState = (isEmpty(auths) || isEmpty(auths[match.path])) ? [] : auths[match.path]
    const rowSelection = {
      selectedRowKeys: uuids,
      onChange: this._onSelectChange,
      getCheckboxProps: record => ({
        disabled: authState.indexOf('edit') === -1 && authState.indexOf('delete') === -1
      })
    }
    const pagination = genPagination(page)
    return (
      <div>
        <Form>
          <Row className='operate-btn'>
            <Col span={8}>
              <FormItem
                label='账号：'
                className={styles['form-item']}
                {...formItemLayout}
              >
                {getFieldDecorator('userName')(
                  <Input
                    type='text'
                    placeholder='请输入账号'
                    maxLength='50'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label='姓名：'
                className={styles['form-item']}
                {...formItemLayout}
              >
                {getFieldDecorator('fullName')(
                  <Input
                    type='text'
                    placeholder='请输入姓名'
                    maxLength='50'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label='所属机构：'
                className={styles['form-item']}
                {...formItemLayout}
              >
                <div>
                  {getFieldDecorator('organizationId')(
                    <Select
                      allowClear
                      showSearch
                      optionLabelProp='title'
                      placeholder='请选择所属机构'
                      filterOption={false}
                      onSearch={this._handleOrgSearch}
                      notFoundContent={selectFetchingFlag ? <Spin size='small' /> : null}
                    >
                      {orgList.map(d => (
                        <SelectOption
                          key={d.id}
                          value={d.id}
                          title={d.orgName}
                        >
                          {d.orgName}
                        </SelectOption>
                      ))}
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={24}>
              <div className={styles['operate-btn']} style={{ textAlign: 'right' }}>
                <Button
                  type='primary'
                  title='点击查询'
                  onClick={this._handleQuery}
                >
                  查询
                </Button>

                {
                  authState.indexOf('add') !== -1 &&
                  <Link to={urls.USER_ADD}>
                    <Button
                      type='primary'
                      title='点击新增'
                    >
                      新增
                    </Button>
                  </Link>
                }
                {
                  authState.indexOf('edit') !== -1 &&
                  <Button
                    type='primary'
                    title='点击编辑'
                    disabled={uuids.length !== 1}
                    onClick={this._handleEdit}
                  >
                    编辑
                  </Button>
                }
                {
                  authState.indexOf('delete') !== -1 &&
                  <Popconfirm
                    title='确定要删除吗？'
                    onConfirm={() => this._handleDelete()}
                  >
                    <Button
                      disabled={uuids.length > 0 ? 0 : 1}
                      className={styles['f-right']}
                      type='danger'
                      title='点击删除'
                    >删除
                    </Button>
                  </Popconfirm>
                }
              </div>
            </Col>
          </Row>
        </Form>

        <Table
          className={styles['c-table-center']}
          columns={this._columns}
          rowKey='uuid'
          dataSource={list}
          rowSelection={rowSelection}
          loading={showListSpin}
          pagination={pagination}
          onChange={this._handlePageChange}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.baseUser.userList,
    page: state.baseUser.page,
    uuids: state.baseUser.uuids,
    showListSpin: state.common.showListSpin,
    selectFetchingFlag: state.baseUser.selectFetchingFlag,
    orgList: state.baseUser.orgList,
    auths: state.common.auths

  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(UserList))

