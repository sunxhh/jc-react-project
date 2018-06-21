import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
import { debounce } from 'Utils/function'
import { Button, Table, Form, Row, Col, Select, Input } from 'antd'
import * as urls from 'Global/urls'
import { showModalForm } from '../../../components/modal/ModalForm'
import { Link } from 'react-router-dom'
import Module from './module'
import style from './style.less'
import { genPagination } from 'Utils/helper'
import storage from 'Utils/storage'
import { isEmpty } from 'Utils/lang'
import ParentModule from '../module'
import { statusType } from './dict'

const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

class MemberList extends Component {
  constructor(props) {
    super(props)
    const userInfo = storage.get('userInfo')
    this.state = {
      hasInitParam: false,
      list: [],
      levelOneOrgCode: '',
      userInfo: userInfo,
      orgLevel: userInfo.orgLevel
    }
    this._handleQuery = debounce(this._handleQuery, 100)
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    const pathname = location.pathname
    if (!pathname.startsWith(urls.MEMBER_MANAGE) || pathname.indexOf(urls.MEMBER_CUSTOM_FIELDS) !== -1) {
      dispatch(Module.actions.resetQueryPar())
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    const { orgLevel, userInfo } = this.state
    let org = {}
    // 只有一级机构和二级机构才可以查看机构搜索项
    if (orgLevel === '0') {
      org = {
        orgMod: '1',
        orgLevel: '1'
      }
      dispatch(Module.actions.getOrgList({ org: org }))
    } else if (orgLevel === '1') {
      org = {
        orgMod: '1',
        orgLevel: '2'
      }
      dispatch(Module.actions.getOrgList({ org: org }))
    }
    // 一级、二级机构需要获取对应一级机构的 orgCode
    if (orgLevel === '1') {
      this.setState({ levelOneOrgCode: userInfo.orgCode })
    } else if (orgLevel === '2') {
      dispatch(ParentModule.actions.getIndustryAndOrgList({ org: { orgCode: userInfo.orgCode }})).then(res => {
        if (res.status === 'success') {
          if (!isEmpty(res.result)) {
            this.setState({ levelOneOrgCode: res.result[0].orgs[0].orgCode })
          }
        }
      })
    }
    this._getList()
  }

  _columns = [
    {
      key: 'rowNo',
      title: '序号',
      dataIndex: 'rowNo',
      width: 80,
      render: (text, record, index) => {
        const { pageSize, pageNo } = this.props.page
        if (!isEmpty(pageSize) && !isEmpty(pageNo)) {
          return (
            <span>{(pageNo - 1) * pageSize + index + 1}</span>
          )
        }
      }
    },
    {
      key: 'userId',
      title: '用户ID',
      dataIndex: 'userId',
      width: 100,
      render: (text, record) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'userName',
      title: '会员姓名',
      dataIndex: 'userName',
      width: 150,
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'mobileNo',
      title: '联系方式',
      dataIndex: 'mobileNo',
      width: 130,
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'orgList',
      title: '所属产业',
      dataIndex: 'orgList',
      render(text) {
        if (isEmpty(text)) {
          return <span>''</span>
        } else {
          const specs = text.map((item) => {
            return item
          })
          const specsString = specs.join(',')
          return <span>{specsString}</span>
        }
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 120,
      render: (text, record, index) => {
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        return (
          <div className={style['table-ope']}>
            {
              btnRole.includes('edit') &&

              <Link
                to={{
                  pathname: `${urls.MEMBER_EDIT}/${record.userId}`,
                }}
                style={{ marginRight: '5px' }}
              >
                编辑
              </Link>
            }
            {
              btnRole.includes('check') && !record.isEdit &&
              <Link
                to={{
                  pathname: `${urls.MEMBER_DETAIL}/${record.userId}`,
                }}
                style={{ marginRight: '5px' }}
              >
              查看
              </Link>
            }
          </div>
        )
      }
    }
  ]

  _columnsLv1 = [
    {
      key: 'key',
      title: '序号',
      dataIndex: 'key',
      render: (text, record, index) => {
        const { pageSize, pageNo } = this.props.page
        if (!isEmpty(pageSize) && !isEmpty(pageNo)) {
          return (
            <span>{(pageNo - 1) * pageSize + index + 1}</span>
          )
        }
      }
    },
    {
      key: 'userId',
      title: '用户ID',
      dataIndex: 'userId',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'userName',
      title: '会员姓名',
      dataIndex: 'userName',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'memberLevel',
      title: '会员等级',
      dataIndex: 'memberLevel',
    },
    {
      key: 'mobileNo',
      title: '联系方式',
      dataIndex: 'mobileNo',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'status',
      title: '会员状态',
      dataIndex: 'status',
      render: (text) => (
        <span>{statusType[text]}</span>
      )
    },
    {
      key: 'joinTime',
      title: '加入时间',
      dataIndex: 'joinTime',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },

    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      render: (text, record) => {
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        return (
          <div className={style['table-ope']}>
            {
              btnRole.includes('edit') &&
              <Link
                to={{
                  pathname: `${urls.MEMBER_EDIT}/${record.userId}`,
                }}
                style={{ marginRight: '5px' }}
              >
                编辑
              </Link>
            }
            {
              btnRole.includes('check') && !record.isEdit &&
              <Link
                to={{
                  pathname: `${urls.MEMBER_DETAIL}/${record.userId}`,
                }}
                style={{ marginRight: '5px' }}
              >
                查看
              </Link>
            }
          </div>
        )
      }
    }
  ]

  // 点击查询
  _handleQuery = () => {
    this._getList(1)
  }

  // 点击分页获取列表数据
  _handlePageChange = (page) => {
    this._getList(page.current, page.pageSize)
  }

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const { orgLevel, userInfo } = this.state
    const arg = this._getParameter(current, pageSize)
    if (orgLevel === '0') {
      dispatch(Module.actions.getMemberList(arg))
    } else if (orgLevel === '2') {
      dispatch(Module.actions.getMemberListLv1(Object.assign(arg, { shopCode: userInfo.orgCode })))
    } else {
      dispatch(Module.actions.getMemberListLv1(arg))
    }
  }

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.page.pageNo, pageSize = this.props.page.pageSize) => {
    const { dispatch, form } = this.props
    const arg = form.getFieldsValue()
    dispatch(Module.actions.setQueryPar(arg))
    return {
      ...arg,
      keywords: arg.keywords && arg.keywords.trim(),
      currentPage: current,
      pageSize: pageSize,
    }
  }

  // 会员录入
  _addShowModal = () => {
    const { orgLevel } = this.state
    const orgArry = orgLevel === '0' ? [
      {
        id: 'orgList',
        props: {
          label: '所在产业'
        },
        options: {
          rules: [{
            required: true,
            message: '请选择所在产业!'
          }]
        },
        element: (
          <Select
            placeholder='请选择产业'
          >
            {
              this.props.orgList.myOrgList && this.props.orgList.myOrgList.map(item => (
                <Option
                  key={item.orgCode}
                  value={item.orgCode}
                >{item.orgName}
                </Option>
              ))
            }
          </Select>
        )
      }
    ] : []
    showModalForm({
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 }
      },
      title: `会员录入`,
      fields: [
        {
          id: 'mobileNo',
          props: {
            label: `手机号码`,
          },
          options: {
            rules: [{
              required: true,
              whitespace: true,
              // 产品要求只校验1开头的11位数
              pattern: /^1\d{10}$/,
              message: '请输入正确的手机号！'
            }]
          },
          element: (
            <Input
              placeholder='请输入手机号码'
              maxLength='11'
            />
          )
        },
        ...orgArry,
      ],
      onOk: (values) => {
        const { history, dispatch } = this.props
        const { levelOneOrgCode } = this.state
        const orgCode = values.orgList || levelOneOrgCode
        return new Promise(resolve => {
          dispatch(Module.actions.getMemberQuery({ mobileNo: values.mobileNo, orgCode })).then(res => {
            if (res.status === 'success') {
              history.push({
                pathname: urls.MEMBER_ADD,
                search: `?mobileNo=${values.mobileNo}&orgCode=${orgCode}`,
              })
              resolve(true)
            } else {
              resolve(false)
            }
          })
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { showListSpin, list, initQueryPar, orgList, page, auths, match } = this.props
    const { orgLevel } = this.state
    const btnRole = auths[match.path] ? auths[match.path] : []
    const pagination = genPagination(page)
    return (
      <div>
        <Form>
          <Row id='rowArea'>
            {
              (orgLevel === '0' || orgLevel === '1') &&
              <Col span={7}>
                <FormItem
                  {...formItemLayout}
                  label='筛选'
                >
                  <div
                    id='orgCode'
                    style={{ position: 'relative' }}
                  >
                    {getFieldDecorator((orgLevel === '0') ? 'orgCode' : 'shopCode', {
                      initialValue: '',
                    })(
                      <Select
                        getPopupContainer={() => document.getElementById('orgCode')}
                        onChange={(value) => this._handleQuery(value)}
                        allowClear
                      >
                        <Option value=''>全部</Option>
                        {
                          (orgList.myOrgLevel === '0' || orgList.myOrgLevel === '1') ? (
                            orgList.myOrgList.map(item => {
                              return (
                                <Option key={item.orgCode} value={item.orgCode}>
                                  {item.orgName}
                                </Option>
                              )
                            })
                          ) : (<Option value={orgList.myOrgId}>{orgList.myOrgName}</Option>)
                        }
                      </Select>
                    )}
                  </div>
                </FormItem>
              </Col>
            }

            <Col span={9}>
              <FormItem
                {...formItemLayout}
                label='会员信息'
              >
                {getFieldDecorator('keywords', {
                  initialValue: !isEmpty(initQueryPar) && initQueryPar.keywords ? initQueryPar.keywords : '',
                })(
                  <Input placeholder = '输入会员姓名或者手机号码进行搜索' />
                )}
              </FormItem>
            </Col>
            <Col span={(orgLevel === '0' || orgLevel === '1') ? 6 : 12}>
              <FormItem style={{ 'float': 'right' }}>
                <Button
                  type='primary'
                  onClick={this._handleQuery}
                  style={{ marginRight: 10 }}
                >
                  查询
                </Button>
                {
                  btnRole.includes('add') &&
                  <Button
                    style={{ marginRight: 10 }}
                    type='primary'
                    title='会员录入'
                    onClick={() => {
                      this._addShowModal()
                    }}
                  >
                    会员录入
                  </Button>
                }
              </FormItem>
            </Col>

          </Row>
        </Form>
        <div>
          <Table
            className={style['c-table-center']}
            columns={orgLevel === '0' ? this._columns : this._columnsLv1}
            rowKey='userId'
            dataSource={list}
            bordered={true}
            loading={showListSpin}
            onChange={this._handlePageChange}
            pagination={pagination}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state['memberCenter.member'],
    auths: state['common.auths'],
    showListSpin: state['common.showListSpin'],
  }
}
export default connect(['common.showListSpin', 'common.auths', 'memberCenter.member'], mapStateToProps)(Form.create()(MemberList))
