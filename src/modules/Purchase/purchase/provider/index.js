import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Table, Input, Select, Form, Row, Col, Popconfirm, Divider } from 'antd'

import * as urls from 'Global/urls'
import { isEmpty } from 'Utils/lang'
import { genPagination } from 'Utils/helper'
import storage from 'Utils/storage'
import ParamsUtil from 'Utils/params'

import { getProviderList, getCodeList, handleProviderDelete } from './reduck'
import { supplyChainUrl } from '../../../../config'

const Option = Select.Option
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

class Provider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // reqBean: {
      //   supplierNo: '',
      //   supplierName: '',
      //   supplierType: '',
      //   currentPage: 1,
      //   pageSize: 10
      // }
    }
  }

  componentWillMount() {
    const { dispatch, list, preRouter } = this.props
    if ((isEmpty(list) || !(preRouter && preRouter.startsWith(urls && urls.SUPPLY_PURCHASE_PROVIDER)))) {
      dispatch(getProviderList({ currentPage: 1, pageSize: 10 }))
    }
    dispatch(getCodeList({ 'codeKeys': ['supplierType'] }))
  }

  _genFilterFields = () => {
    const { supplierType } = this.props
    const _columns = [
      {
        key: 'rowNo',
        title: '编号',
        dataIndex: 'rowNo',
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
        key: 'supplierNo',
        title: '供应商编码',
        dataIndex: 'supplierNo',
        render: (text, record, index) => {
          return (
            <Link
              to={`${urls.SUPPLY_PURCHASE_PROVIDER_DETAIL}/${record.supplierNo}`}
            >{text}
            </Link>
          )
        }
      },
      {
        key: 'supplierName',
        title: '供应商名称',
        dataIndex: 'supplierName',
      },
      {
        key: 'supplierType',
        title: '供应商类别',
        dataIndex: 'supplierType',
        render: (text, record, index) => {
          const supplierName = supplierType && supplierType.filter(item => {
            return item.value === text
          })
          return (
            <span>{!isEmpty(supplierName) && supplierName[0].name}</span>
          )
        }
      },
      {
        key: 'linkMan',
        title: '联系人',
        dataIndex: 'linkMan',
      },
      {
        key: 'telephone',
        title: '联系电话',
        dataIndex: 'telephone',
      },
      {
        key: 'supplyScopes',
        title: '供货范围',
        dataIndex: 'supplyScopes',
      },
      {
        key: 'supplierRate',
        title: '税率（%）',
        dataIndex: 'supplierRate',
        render: (text, record, index) => {
          return (
            <span>
              {
                text
              }
            </span>
          )
        }
      },
      {
        key: 'operatorName',
        title: '操作人',
        dataIndex: 'operatorName',
      },
      {
        key: 'modifyTime',
        title: '更新时间',
        dataIndex: 'modifyTime',
        width: 108
      },
      {
        key: 'operate',
        title: '操作',
        dataIndex: 'operate',
        width: 108,
        render: (text, record, index) => {
          const { auths, match } = this.props
          const btnRole = auths[match.path] ? auths[match.path] : []
          return (
            <span>
              {btnRole.includes('edit') &&
              (
                <Link to={`${urls.SUPPLY_PURCHASE_PROVIDER_EDIT}/${record.supplierNo}`}>
                  编辑
                </Link>
              )}
              {
                btnRole.includes('edit') &&
                btnRole.includes('delete') &&
                <Divider type='vertical' />
              }
              {btnRole.includes('delete') &&
              (
                <span>
                  <Popconfirm
                    title='确定要删除该供应商吗？'
                    onConfirm={() => this._handleDelete(record.supplierNo)}
                    okText='确定'
                    cancelText='取消'
                  >
                    <a href='javascript:void(0);'>删除</a>
                  </Popconfirm>
                </span>
              )}
            </span>
          )
        }
      }
    ]
    return _columns
  }

  _handleDelete = (supplierNo) => {
    const { dispatch, filter } = this.props
    dispatch(handleProviderDelete({ supplierNo: supplierNo })).then(res => {
      if (res) {
        dispatch(getProviderList(filter))
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { dispatch, form } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        const searchBody = {
          currentPage: 1,
          supplierNo: values.supplierNo ? values.supplierNo.replace(/(^\s+)|(\s+$)/g, '') : '',
          supplierName: values.supplierName ? values.supplierName.replace(/(^\s+)|(\s+$)/g, '') : '',
          supplierType: values.supplierType,
          linkMan: values.linkMan ? values.linkMan.replace(/(^\s+)|(\s+$)/g, '') : '',
          telephone: values.telephone ? values.telephone.replace(/(^\s+)|(\s+$)/g, '') : '',
          supplyScope: values.supplyScope ? values.supplyScope.replace(/(^\s+)|(\s+$)/g, '') : '',
          pageSize: 10
        }
        dispatch(getProviderList(searchBody))
      }
    })
  }

  // _filterType = (inputValue, childGoodsCatgList) => {
  //   return (childGoodsCatgList.props.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
  // }

  _handlePageChange = (pagination) => {
    window.scrollTo(0, 0)
    const { filter, page } = this.props
    const { current, pageSize } = pagination
    this.props.dispatch(getProviderList({ ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize: pageSize }))
  }

  _handleExport = () => {
    const { filter } = this.props
    const reqBody = {
      supplierNo: filter.supplierNo && filter.supplierNo,
      supplierName: filter.supplierName && filter.supplierName,
      supplierType: filter.supplierType && filter.supplierType,
      linkMan: filter.linkMan && filter.linkMan,
      telephone: filter.telephone && filter.telephone,
      supplyScope: filter.supplyScope && filter.supplyScope,
      ticket: storage.get('userInfo') && storage.get('userInfo').ticket
    }
    const params = ParamsUtil.json2url(reqBody)
    let url = (supplyChainUrl === '/') ? `http://${location.host}` : supplyChainUrl
    let newUrl = `${url}/api/supplychain/supply/supplyExport/v1?${params}`
    location.href = newUrl
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { list, page, supplierType, showListSpin, auths, match, filter } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    const _columns = this._genFilterFields()
    const pagination = genPagination(page)
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='供应商编号'
              >
                {getFieldDecorator('supplierNo', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: filter && filter.supplierNo
                })(
                  <Input placeholder='供应商编号' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='供应商名称'
              >
                {getFieldDecorator('supplierName', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: filter && filter.supplierName
                })(
                  <Input placeholder='供应商名称' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='供应商类别'
              >
                <div
                  id='supplierType'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('supplierType', {
                    rules: [{
                      required: false,
                    }],
                    initialValue: filter && filter.supplierType || ''
                  })(
                    <Select
                      allowClear={true}
                      placeholder='请选择供应商类别'
                      getPopupContainer={() => document.getElementById('supplierType')}
                    >
                      <Option value=''>全部</Option>
                      {
                        supplierType && supplierType.map(item => (
                          <Option key={item.value} value={item.value}>{item.name}</Option>
                        ))
                      }
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='联系人'
              >
                {getFieldDecorator('linkMan', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: filter && filter.linkMan
                })(
                  <Input placeholder='联系人' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='联系人电话'
              >
                {getFieldDecorator('telephone', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: filter && filter.telephone
                })(
                  <Input placeholder='联系人电话' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='供货范围'
              >
                {getFieldDecorator('supplyScope', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: filter && filter.supplyScope
                })(
                  <Input placeholder='供货范围' />
                )}
              </FormItem>
            </Col>
          </Row>
          <div className='operate-btn'>
            <Button
              type='primary'
              htmlType='submit'
            >查询
            </Button>
            {
              btnRole.includes('add') && (
                <Link to={urls.SUPPLY_PURCHASE_PROVIDER_ADD}>
                  <Button
                    type='primary'
                    title='新增'
                  >
                    新增
                  </Button>
                </Link>
              )
            }
            {
              btnRole.includes('add') && (
                <Button
                  type='primary'
                  title='导出'
                  onClick={this._handleExport}
                >
                  导出
                </Button>
              )
            }
          </div>
        </Form>
        <Table
          columns={_columns}
          dataSource={list}
          rowKey='supplierNo'
          pagination={pagination}
          onChange={this._handlePageChange}
          loading={showListSpin}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auths: state.common.auths,
    showListSpin: state.common.showListSpin,
    list: state.purchase.provider.providerList,
    page: state.purchase.provider.providerPage,
    filter: state.purchase.provider.filter,
    preRouter: state.router.pre,
    supplierType: state.purchase.provider.codeList.supplierType,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Provider))
