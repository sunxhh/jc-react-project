import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
import { Link } from 'react-router-dom'
import * as urls from 'Global/urls'
import { Button, Table, Form, Row, Col, Input, Select, Modal, message } from 'antd'

import styles from './styles.less'
import { isEmpty } from 'Utils/lang'
import { genPagination } from 'Utils/helper'
import storage from 'Utils/storage'
import { MEMBER_INTEGRAL_RULE } from 'Global/urls'

import MemberModule from '../module'
import Module from './module'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

class Integral extends Component {
  state = {
    orgLevel: '',
    setCurrencyRuleVisible: false,
    confirmLoading: false
  }

  // 排序
  _sortArr = [
    { value: 'DESC', name: '积分由多到少' },
    { value: 'ASC', name: '积分由少到多' }
  ]
  // 列表header信息
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
      key: 'userPhone',
      title: '联系方式',
      dataIndex: 'userPhone'
    },
    {
      key: 'totalPoint',
      title: '会员积分',
      dataIndex: 'totalPoint',
      render: (text, record, index) => {
        return this.getShowBlockElement(text.split(','))
      }
    },
    {
      key: 'effectivePoint',
      title: '可用积分',
      dataIndex: 'effectivePoint',
      render: (text, record, index) => {
        return this.getShowBlockElement(text.split(','))
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 80,
      render: (text, record, index) => {
        return (
          <div className={styles['table-ope']}>
            <Link to={`${urls.MEMBER_INTEGRAL_DETAIL}/?userId=${record.userId}&userName=${record.userName}&userPhone=${record.userPhone}`}>查看</Link>
          </div>
        )
      }
    }
  ]

  // 生命周期， 初始化表格数据
  componentDidMount() {
    this._init()
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    if (!location.pathname.startsWith(urls.MEMBER_INTEGRAL)) {
      dispatch(Module.actions.resetQueryParam())
    }
  }

  _init() {
    let userIn = storage.get('userInfo')
    if (userIn) {
      if (userIn.orgLevel === '0') {
        this._getFirstOrgList()
      }
      this.setState({
        orgLevel: userIn.orgLevel
      })
      setTimeout(this._getMemberPointList, 100)
    }
  }
  // 获取列表数据查询参数
  _getQueryParam(current = this.props.page.pageNo, pageSize = this.props.page.pageSize) {
    const { form, firstOrgList } = this.props
    const reg = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
    const userIn = storage.get('userInfo')
    const arg = form.getFieldsValue()
    if (arg) {
      arg.queryParam = arg.queryParam ? arg.queryParam.replace(reg, '') : arg.queryParam
      if (userIn.orgLevel === '0') {
        arg.sort = ''
        arg.orgCode = (!isEmpty(arg.orgIndex) && arg.orgIndex !== '' && !isEmpty(firstOrgList)) ? firstOrgList[arg.orgIndex]['orgCode'] : ''
      } else {
        arg.orgCode = userIn.orgCode
      }
      delete arg.orgCodeIndex
    }
    return {
      ...arg,
      currentPage: current,
      pageSize: pageSize,
    }
  }
  // 设置列表数据查询参数
  _setQueryParam = (queryParam) => {
    const { dispatch } = this.props
    dispatch(Module.actions.setQueryParam(queryParam))
  }

  /**
   * 显示快级元素
   */
  getShowBlockElement(data) {
    let elementStr = ''
    if (data) {
      elementStr = data.map((item, index) => {
        return (<div key={index}>{item}</div>)
      })
    }
    return elementStr
  }

  /**
   * 获取一级产业列表
   */
  _getFirstOrgList = () => {
    const { dispatch } = this.props
    dispatch(MemberModule.actions.getFirstOrgList({
      org: {
        orgMod: '1',
        orgLevel: '1'
      }
    }))
  }

  /**
   * 获取会员积分列表
   */
  _getMemberPointList = (current, pageSize) => {
    const { dispatch } = this.props
    let queryParam = this._getQueryParam(current, pageSize)
    dispatch(Module.actions.getMemberPointList(queryParam))

    this._setQueryParam(queryParam)
  }

  /**
   * 执行查询
   */
  _handleQuery = () => {
    this._getMemberPointList(1)
  }
  /**
   * 设置积分
   */
  _handleSetCurrencyRule = () => {
    const { orgLevel } = this.state
    // 如果是管理员，选择产业
    if (orgLevel === '0') {
      this.setState({
        setCurrencyRuleVisible: true
      })
    } else {
      const { history } = this.props
      history.push(`${MEMBER_INTEGRAL_RULE}`)
    }
  }

  _handleSetRuleCancel = () => {
    this.setState({
      setCurrencyRuleVisible: false
    })
  }

  _handlePageChange = (page) => {
    if (this.props.page.pageSize === page.pageSize) {
      this._getMemberPointList(page.current, page.pageSize)
    } else {
      this._getMemberPointList(1, page.pageSize)
    }
  }

  // 选择产业 跳转积分规则页面
  _toRuleList = () => {
    const { form, firstOrgList } = this.props
    const arg = form.getFieldsValue()

    if (typeof arg.orgCodeIndex !== 'undefined') {
      const { history } = this.props
      history.push({
        pathname: `${MEMBER_INTEGRAL_RULE}`,
        search: `orgCode=${firstOrgList[arg.orgCodeIndex].orgCode}&orgName=${escape(firstOrgList[arg.orgCodeIndex].orgName)}`
      })
    } else {
      message.error('请选择产业')
    }
  }

  _handleSelectChange = (type, value) => {
    const { form } = this.props
    form.setFieldsValue({ [type]: value })
    this._handleQuery()
  }

  render() {
    const { setCurrencyRuleVisible, confirmLoading, orgLevel } = this.state

    const { getFieldDecorator } = this.props.form
    const { showListSpin, firstOrgList, memberPointList, queryParam, page, auths, match } = this.props
    page.pageNo = page.pageNo
    const pagination = genPagination(page)
    const btnRole = auths[match.path] ? auths[match.path] : []
    return (
      <div>
        <Form
          id='filter-form'
        >
          <Row id='rowArea'>
            {orgLevel === '0' &&
              <Col span={7}>
                <FormItem
                  label='筛选'
                  {...formItemLayout}
                  style={{ marginRight: '30px' }}
                >
                  {getFieldDecorator('orgIndex', {
                    initialValue: queryParam.orgIndex
                  })(
                    <Select
                      placeholder='全部'
                      allowClear={true}
                      style={{ width: '200px' }}
                      getPopupContainer={() => document.getElementById('filter-form')}
                      onChange={(value) => this._handleSelectChange('orgIndex', value)}
                    >
                      <Select.Option
                        key='-1'
                        value=''
                      >全部
                      </Select.Option>
                      {firstOrgList.map((item, index) => (
                        <Select.Option
                          key={item.orgName}
                          value={index}
                        >{item.orgName}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            }
            {orgLevel !== '0' &&
              <Col span={7}>
                <FormItem
                  label='排序'
                  {...formItemLayout}
                >
                  {getFieldDecorator('sort', {
                    initialValue: queryParam.sort
                  })(
                    <Select
                      placeholder='默认'
                      allowClear={false}
                      onChange={(value) => this._handleSelectChange('sort', value)}
                    >
                      {this._sortArr.map(item => (
                        <Select.Option
                          key={item.name}
                          value={item.value}
                        >{item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            }
            <Col span={9}>
              <FormItem
                {...formItemLayout}
                label='会员信息'
              >
                {getFieldDecorator('queryParam', {
                  initialValue: queryParam.queryParam,
                })(
                  <Input
                    placeholder='输入会员姓名或者手机号码进行搜索'
                    maxLength='50'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem className={styles['operate-btn']}>
                <Button
                  className={styles['search-btn']}
                  type='primary'
                  title='点击查询'
                  onClick={this._handleQuery}
                >
                  查询
                </Button>
                {
                  btnRole.includes('add') &&
                  <Button
                    type='primary'
                    title='设置积分规则'
                    onClick={this._handleSetCurrencyRule}
                  >
                    设置积分规则
                  </Button>
                }
              </FormItem>
            </Col>
          </Row>
        </Form>

        <div className={styles['table-wrapper']}>
          <Table
            locale={{
              emptyText: '暂无数据'
            }}
            className={styles['c-table-center']}
            columns={this._columns}
            rowKey='userId'
            dataSource={memberPointList}
            bordered
            loading={showListSpin}
            onChange={this._handlePageChange}
            pagination={pagination}
          />
        </div>
        <Modal
          title='请先选择所属产业'
          okText='确定'
          cancelText='取消'
          maskClosable={false}
          visible={setCurrencyRuleVisible}
          onOk={this._toRuleList}
          confirmLoading={confirmLoading}
          onCancel={this._handleSetRuleCancel}
        >
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('orgCodeIndex', {
              initialValue: undefined
            })(
              <Select
                placeholder='请选择产业'
                allowClear={true}
                style={{ width: '290px', marginLeft: '90px' }}
              >
                {firstOrgList.map((item, index) => (
                  <Select.Option
                    key={item.orgName}
                    value={index}
                  >{item.orgName}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state['common.showListSpin'],
    ...state['memberCenter.integral'],
    auths: state['common.auths'],
    ...state['memberCenter']
  }
}
export default connect(['common.showListSpin', 'common.auths', 'memberCenter', 'memberCenter.integral'], mapStateToProps)(Form.create()(Integral))
