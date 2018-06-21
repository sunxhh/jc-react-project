import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
import { Table, Form, Row, Col, Input, Button } from 'antd'
import { Link } from 'react-router-dom'
import { MEMBER_DETAIL } from 'Global/urls'
import Module from './module'
import styles from './styles.less'
import { genPagination } from 'Utils/helper'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
}
const CardMemberStatus = [
  { status: 0, name: '过期' },
  { status: 1, name: '正常' }
]

class MemberList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cardId: '',
      reqBean: {
        currentPage: 1,
        pageSize: 20,
        keywords: ''
      }
    }
  }

  componentDidMount() {
    const { dispatch, match } = this.props
    const cardId = match.params.cardId
    this.setState({
      cardId: cardId
    })
    dispatch(Module.actions.getCardMemberList({ cardId: cardId, ...this.state.reqBean }))
  }

  // 列表Table Columns信息
  _columns = [
    {
      key: 'userId',
      title: '用户ID',
      dataIndex: 'userId'
    },
    {
      key: 'userName',
      title: '会员姓名',
      dataIndex: 'userName'
    },
    {
      key: 'mobileNo',
      title: '联系方式',
      dataIndex: 'mobileNo'
    },
    {
      key: 'spec',
      title: '规格',
      dataIndex: 'spec'
    },
    {
      key: 'amount',
      title: '会员卡金额',
      dataIndex: 'amount'
    },
    {
      key: 'created',
      title: '开卡时间',
      dataIndex: 'created'
    },
    {
      key: 'endTime',
      title: '有效期至',
      dataIndex: 'endTime'
    },
    {
      key: 'status',
      title: '状态',
      width: 80,
      dataIndex: 'status',
      render: (text, record) => {
        let statusArr = CardMemberStatus.filter(item => item.status === record.status)
        return statusArr[0].name
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      width: 80,
      fixed: 'right',
      key: 'option',
      render: (text, record) => {
        return (
          <Link to={`${MEMBER_DETAIL}/${record.userId}`}>
            查看
          </Link>
        )
      }
    }
  ]

  _handleQuery = () => {
    const { getFieldValue } = this.props.form
    const keywords = getFieldValue('keywords')
    this.setState({
      reqBean: {
        currentPage: 1,
        pageSize: 20,
        keywords: keywords
      }
    }, () => {
      this.props.dispatch(Module.actions.getCardMemberList({ cardId: this.state.cardId, ...this.state.reqBean }))
    })
  }

  _handlePageChange = (pagination) => {
    const { current, pageSize } = pagination
    const { page, dispatch } = this.props
    const { cardId } = this.state
    this.setState({
      reqBean: Object.assign({}, this.state.reqBean, { currentPage: page.pageSize !== pageSize ? 1 : current, pageSize: pageSize })
    }, () => {
      dispatch(Module.actions.getCardMemberList({ cardId: cardId, ...this.state.reqBean }))
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { cardMemberList, showListSpin, page } = this.props
    const pagination = genPagination(page)
    return (
      <div>
        <div>
          <Form>
            <Row gutter={20}>
              <Col span={10}>
                <FormItem
                  {...formItemLayout}
                  label='会员信息'
                >
                  {getFieldDecorator('keywords')(
                    <Input placeholder='输入手机号码进行搜索' />
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <Button
                  type='primary'
                  onClick={this._handleQuery}
                  style={{ marginTop: 3 }}
                >
                  搜索
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        <Table
          className={styles['c-table-center']}
          locale={{
            emptyText: '暂无数据'
          }}
          pagination={pagination}
          loading={showListSpin}
          columns={this._columns}
          rowKey='userId'
          dataSource={ cardMemberList && cardMemberList.data ? cardMemberList.data.data : [] }
          onChange={this._handlePageChange}
          scroll={{ x: 1200 }}
          bordered
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state['memberCenter.card'],
    showListSpin: state['common.showListSpin'],
    auths: state['common.auths'],
    userInfo: state['common.userInfo'],
  }
}

export default connect(['common.userInfo', 'common.auths', 'common.showListSpin', 'memberCenter.card'], mapStateToProps)(Form.create()(MemberList))
