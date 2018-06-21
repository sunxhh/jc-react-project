import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import moment from 'moment'
import { Button, Popconfirm, Table, Form, Input, Select, message, Popover, Row, Col } from 'antd'

import { getMemberList, deleteList } from './reduck'
import * as actionTypes from './reduck'
import styles from './styles.less'
import * as urls from '../../../global/urls'
import Ellipsis from 'Components/Ellipsis'

const MEMBER = {
  '0': '全部',
  '1': '是',
  '2': '否'
}

const sex = {
  '1': '女',
  '0': '男'
}

class MemberList extends Component {
  static defaultProps = {
    list: [],
    memberIds: [],
    orgList: [],
    page: {
      current: 1,
      pageSize: 20,
      total: 0,
      isLoading: false,
    }
  }

  _columns = [
    {
      key: 'rowNo',
      title: '序号',
      dataIndex: 'rowNo',
      render: (text, record, index) => {
        const { pageSize, current } = this.props.page
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
      key: 'memberId',
      title: '会员ID',
      dataIndex: 'memberId',
      render: (text, record) => (
        <Link to={`${urls.MEMBERDETAIL}/${record.memberId}`} title='点击查看详情'>
          {text}
        </Link>
      )
    },
    {
      key: 'name',
      title: '姓名',
      dataIndex: 'name',
      render: text => <span>{text && text !== 'null' && text}</span>
    },
    {
      key: 'phoneNumber',
      title: '电话号码',
      dataIndex: 'phoneNumber',
      render: text => <span>{text && text !== 'null' && text}</span>
    },
    {
      key: 'sex',
      title: '性别',
      dataIndex: 'sex',
      render: text => <span>{sex[text]}</span>
    },
    {
      key: 'birthDate',
      title: '出生日期',
      dataIndex: 'birthDate',
      width: 100,
      render: text => <span>{text && text !== 'null' && moment(text).format('YYYY-MM-DD')}</span>
    },
    {
      key: 'address',
      title: '住址',
      dataIndex: 'address',
      render: text => {
        return (
          <Popover content={text} title='住址'>
            <span>{text && text.length > 5 ? `${text.substring(0, 5)}...` : text}</span>
          </Popover>
        )
      }
    },
    {
      key: 'shopNames',
      title: '所属会籍',
      dataIndex: 'shopNames',
      render: text => <span>{text && text !== 'null' && text}</span>
    },
    {
      key: 'titleCode',
      title: '职级',
      dataIndex: 'titleCode'
    },
    {
      key: 'isMember',
      title: '内部会员',
      dataIndex: 'isMember',
      render: text => <span>{MEMBER[text]}</span>
    },
    {
      key: 'identificationNo',
      title: '身份证号',
      dataIndex: 'identificationNo',
      width: 150,
      render: text => <span>{text && text !== 'null' && text}</span>
    },
    {
      key: 'updateTime',
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 100,
      render: text => <span>{moment(text).format('YYYY-MM-DD')}</span>
    },
    {
      key: 'remark',
      title: '备注',
      dataIndex: 'remark',
      width: 200,
      render: text => {
        return (
          <Ellipsis
            length={10}
            tooltip={true}
          >
            {text || ''}
          </Ellipsis>
        )
      }
    }
  ]

  // 生命周期， 初始化表格数据
  componentDidMount() {
    this._getList()
    // this.props.dispatch(getOrgList({ isMember: '' }))
  }

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.page.current, pageSize = this.props.page.pageSize) => {
    const arg = this.props.form.getFieldsValue()
    return {
      ...arg,
      isMember: arg.isMember !== '0' ? arg.isMember : '',
      shopId: arg.shopId !== '-1' ? arg.shopId : '',
      currentPage: current,
      pageSize: pageSize
    }
  }

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getParameter(current, pageSize)
    dispatch(getMemberList(arg))
  }

  // 点击分页获取列表数据
  _handlePageChange = current => {
    this._getList(current)
  }

  // 点击查询
  _handleQuery = () => {
    this._getList(1)
  }

  // 点击删除
  _handleDelete = () => {
    const memberIds = this.props.memberIds
    this.props.dispatch(deleteList({ memberIds: memberIds }, this._getParameter(1)))
  }

  // 编辑时必须要选一个会员
  _handleEdit = () => {
    const { memberIds, history } = this.props
    if (memberIds.length === 1) {
      history.push(`${urls.MEMBEREDIT}/${this.props.memberIds}`)
    } else {
      message.error('只能选择一个会员', 1)
    }
  }

  _onSelectChange = selectedRowKeys => {
    this.props.dispatch(createAction(actionTypes.UPD_MEMBER_IDS)(selectedRowKeys))
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { list, auths, match } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    const rowSelection = {
      selectedRowKeys: this.props.memberIds,
      onChange: this._onSelectChange
    }
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    }
    return (
      <div>
        <Form>
          <Row>
            <Col span={6}>
              <Form.Item
                {...formItemLayout}
                label='会员：'
              >
                {getFieldDecorator('memberId')(<Input type='text' placeholder='请输入会员ID' />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                {...formItemLayout}
                label='电话号码：'
              >
                {getFieldDecorator('phoneNumber')(<Input type='text' placeholder='请输入电话号码' />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                {...formItemLayout}
                label='姓名：'
              >
                {getFieldDecorator('name')(<Input type='text' placeholder='请输入姓名' />)}
              </Form.Item>
            </Col>
            <Col id='isMember' span={6}>
              <Form.Item
                {...formItemLayout}
                label='内部会员：'
              >
                {getFieldDecorator('isMember', {
                  initialValue: '0'
                })(
                  <Select
                    placeholder='请选择内部会员'
                    getPopupContainer={() => document.getElementById('isMember')}
                  >
                    {Object.keys(MEMBER).map(key => {
                      return (
                        <Select.Option key={key} value={key.toString()}>
                          {MEMBER[key]}
                        </Select.Option>
                      )
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <div className={styles['operate-btn']}>
            <Button
              type='primary' title='点击查询'
              onClick={this._handleQuery}
            >
              查询
            </Button>
            {/* {btnRole.includes('add') && (
              <Link to={urls.MEMBERADD}>
                <Button type='primary' title='点击新增'>
                  新增
                </Button>
              </Link>
            )}
            {btnRole.includes('edit') && (
              <Button
                type='primary'
                title='点击编辑'
                disabled={this.props.memberIds.length !== 1}
                onClick={this._handleEdit}
              >
                编辑
              </Button>
            )} */}
            {btnRole.includes('delete') && (
              <Popconfirm title='确定要删除吗？' onConfirm={() => this._handleDelete()}>
                <Button
                  disabled={this.props.memberIds.length > 0 ? 0 : 1}
                  className={styles['f-right']}
                  type='danger'
                  title='点击删除'
                >
                  删除
                </Button>
              </Popconfirm>
            )}
          </div>
        </Form>

        <Table
          className={styles['c-table-center']}
          columns={this._columns}
          rowKey='memberId'
          scroll={{ x: 1400 }}
          dataSource={list}
          rowSelection={rowSelection}
          loading={this.props.isLoading}
          pagination={{
            pageSize: this.props.page.pageSize,
            total: this.props.page.total,
            showQuickJumper: true,
            showTotal: (total, range) => `共 ${total} 条`,
            onChange: this._handlePageChange,
            ...this.props.page
          }}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    list: state.member.memberList,
    page: state.member.page,
    memberIds: state.member.memberIds,
    isLoading: state.member.isLoading,
    orgList: state.member.orgList,
    auths: state.common.auths,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(MemberList))
