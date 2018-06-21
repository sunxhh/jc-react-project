import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Table, Input, Select, Form, Row, Col, DatePicker, Tabs, InputNumber, Popconfirm, Divider } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'

import * as urls from 'Global/urls'
import { isEmpty } from 'Utils/lang'
import { genPagination } from 'Utils/helper'
import storage from 'Utils/storage'
import ParamsUtil from 'Utils/params'

import { getContractList, getCodeList, getContractDetailList, handleContractDelete, updateContract } from './reduck'
import { supplyChainUrl } from '../../../../config'

const Option = Select.Option
const TabPane = Tabs.TabPane
const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

const contractStatus = {
  '1': '生效',
  '2': '失效',
  '3': '未生效'
}

class Contract extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: []
    }
  }

  componentWillMount() {
    const { dispatch, list, preRouter } = this.props
    if ((isEmpty(list) || !(preRouter && preRouter.startsWith(urls && urls.SUPPLY_PURCHASE_CONTRACT)))) {
      dispatch(getContractList({ currentPage: 1, pageSize: 10 }))
      dispatch(getContractDetailList({ currentPage: 1, pageSize: 10 }))
    }
    dispatch(getCodeList({ 'codeKeys': ['supplierType'] }))
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.detailList !== nextProps.detailList) {
      this.setState({
        dataSource: nextProps.detailList
      })
    }
  }

  _genFilterFields = () => {
    const { supplierType } = this.props
    const _columns = [
      {
        key: 'rowNo',
        title: '序号',
        dataIndex: 'rowNo',
        width: '6%',
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
        key: 'contractNo',
        title: '合同编码',
        dataIndex: 'contractNo',
        render: (text, record, index) => {
          return (
            <Link
              to={`${urls.SUPPLY_PURCHASE_CONTRACT_DETAIL}/${record.contractNo}`}
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
        key: 'accountPeriod',
        title: '账期（天）',
        dataIndex: 'accountPeriod',
      },
      {
        key: 'defectiveRate',
        title: '缺品率（%）',
        dataIndex: 'defectiveRate',
      },
      {
        key: 'arrivalRate',
        title: '到货率（%）',
        dataIndex: 'arrivalRate',
      },
      {
        key: 'contractStatus',
        title: '合同状态',
        dataIndex: 'contractStatus',
        render: (text, record, index) => {
          return (
            <span>{contractStatus[text]}</span>
          )
        }
      },
      {
        key: 'startTime',
        title: '开始时间',
        dataIndex: 'startTime',
      },
      {
        key: 'endTime',
        title: '结束时间',
        dataIndex: 'endTime',
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
      },
      {
        key: 'operate',
        title: '操作',
        dataIndex: 'operate',
        width: 70,
        render: (text, record, index) => {
          const { auths, match } = this.props
          const btnRole = auths[match.path] ? auths[match.path] : []
          return (
            <span>
              {btnRole.includes('edit') &&
              (
                <Link to={`${urls.SUPPLY_PURCHASE_CONTRACT_EDIT}/${record.contractNo}`}>
                  编辑&nbsp;&nbsp;
                </Link>
              )}
            </span>
          )
        }
      }
    ]
    return _columns
  }

  // 合同明细列表

  _detailColumns = [
    {
      key: 'rowNo',
      title: '序号',
      dataIndex: 'rowNo',
      // width: '6%',
      render: (text, record, index) => {
        const { pageSize, pageNo } = this.props.detailPage
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
      key: 'skuNo',
      title: 'SKU编码',
      dataIndex: 'skuNo',
    },
    {
      key: 'skuGoodsName',
      title: 'SKU名称',
      dataIndex: 'skuGoodsName',
    },
    {
      key: 'goodsCatgName',
      title: '所属分类',
      dataIndex: 'goodsCatgName',
    },
    {
      key: 'goodsUnit',
      title: '库存单位',
      dataIndex: 'goodsUnit',
    },
    {
      key: 'supplierRate',
      title: '税率（%）',
      dataIndex: 'supplierRate',
      render: (text, record, index) => {
        return (
          text ? <span>
            {text}
          </span> : ''
        )
      }
    },
    {
      key: 'purchasePrice',
      title: '采购价（元）',
      dataIndex: 'purchasePrice',
      render: (text, record, index) => {
        return !record.editable ? text : (
          <InputNumber
            min={0}
            // max={record.thresholdUp}
            precision={2}
            max={99999999999.999}
            value={text}
            onChange={value => this._handleCellChange(value, record.id, 'purchasePrice')}
          />
        )
      }
    },
    {
      key: 'contractNo',
      title: '合同编码',
      dataIndex: 'contractNo',
    },
    {
      key: 'supplierName',
      title: '供应商名称',
      dataIndex: 'supplierName',
    },
    {
      key: 'operate',
      title: '操作',
      dataIndex: 'operate',
      render: (text, record, index) => {
        const { editable } = record
        return (
          <span>
            {
              editable ? (
                <span>
                  <a onClick={e => this._priceSave(record)}>保存&nbsp;&nbsp;</a>
                </span>
              ) : (
                <span>
                  <a onClick={e => this._toggleEditable(e, record.id)}>价格编辑&nbsp;&nbsp;</a>
                </span>
              )
            }
            <Divider type='vertical' />
            <span>
              <Popconfirm
                title='确定要删除该明细吗？'
                onConfirm={() => this._handleDelete(record)}
                okText='确定'
                cancelText='取消'
              >
                <a href='javascript:void(0);'>删除</a>
              </Popconfirm>
            </span>
          </span>
        )
      }
    }
  ]

  _cacheOriginData = {} // 缓存待编辑数据

  _getRowByKey(key, newData) {
    return (newData || this.state.dataSource).filter(item => item.id === key)[0]
  }

  _toggleEditable = (e, key) => {
    e.preventDefault()
    const newData = [...this.state.dataSource]
    const target = this._getRowByKey(key, newData)
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this._cacheOriginData[key] = { ...target }
      }
      target.editable = true
      this.setState({ dataSource: newData })
    }
  }

  _handleCellChange = (value, key, column) => {
    const newData = [...this.state.dataSource]
    let target = newData.filter(item => key === item.id)[0]
    if (target) {
      target[column] = value
      this.setState({ dataSource: newData })
    }
  }

  _priceSave = (record) => {
    const { detailFilter, dispatch } = this.props
    const { contractNo, skuNo, purchasePrice } = record
    dispatch(updateContract({ contractNo: contractNo, skuNo: skuNo, purchasePrice: purchasePrice })).then(res => {
      if (res) {
        const newData = [...this.state.dataSource]
        const target = this._getRowByKey(record.id, newData)
        if (target) {
          delete target.editable
          this.setState({ dataSource: newData })
          delete this._cacheOriginData[record.id]
        }
        dispatch(getContractDetailList({ ...detailFilter }))
      }
    })
  }

  _handleDelete = (record) => {
    const { dispatch, detailFilter, detailList, detailPage } = this.props
    const length = detailList.length
    dispatch(handleContractDelete({ contractNo: record.contractNo, skuNo: record.skuNo })).then(res => {
      if (res) {
        if (length > 1) {
          dispatch(getContractDetailList(detailFilter))
        } else if (length === 1) {
          dispatch(getContractDetailList({ ...detailFilter, currentPage: detailPage.pageNo > 1 ? Number(detailFilter.currentPage) - 1 : 1 }))
        }
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { dispatch, form, filter } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        const searchBody = {
          currentPage: 1,
          contractNo: values.contractNo ? values.contractNo.replace(/(^\s+)|(\s+$)/g, '') : '',
          supplierName: values.supplierName ? values.supplierName.replace(/(^\s+)|(\s+$)/g, '') : '',
          supplierType: values.supplierType,
          contractStatus: values.contractStatus,
          operatorName: values.modifyUser ? values.modifyUser.replace(/(^\s+)|(\s+$)/g, '') : '',
          startTime: values.time && !isEmpty(values.time) && values.time[0] !== '' ? values.time[0].format('YYYY-MM-DD') : '',
          endTime: values.time && !isEmpty(values.time) && values.time[1] !== '' ? values.time[1].format('YYYY-MM-DD') : '',
          pageSize: filter.pageSize
        }
        dispatch(getContractList(searchBody))
      }
    })
  }

  _detailHandleSubmit = (e) => {
    e.preventDefault()
    const { dispatch, form, detailFilter } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        const searchBody = {
          currentPage: 1,
          contractNo: values.contractDetailNo ? values.contractDetailNo.replace(/(^\s+)|(\s+$)/g, '') : '',
          supplierName: values.supplierDetailName ? values.supplierDetailName.replace(/(^\s+)|(\s+$)/g, '') : '',
          skuNo: values.skuNo ? values.skuNo.replace(/(^\s+)|(\s+$)/g, '') : '',
          skuGoodsName: values.skuGoodsName ? values.skuGoodsName.replace(/(^\s+)|(\s+$)/g, '') : '',
          pageSize: detailFilter.pageSize
        }
        dispatch(getContractDetailList(searchBody))
      }
    })
  }

  _handlePageChange = (pagination) => {
    window.scrollTo(0, 0)
    const { filter, page } = this.props
    const { current, pageSize } = pagination
    this.props.dispatch(getContractList({ ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize: pageSize }))
  }

  _handleDetailPageChange = (pagination) => {
    window.scrollTo(0, 0)
    const { detailFilter, detailPage } = this.props
    const { current, pageSize } = pagination
    this.props.dispatch(getContractDetailList({ ...detailFilter, currentPage: detailPage.pageSize !== pageSize ? 1 : current, pageSize: pageSize }))
  }

  _tabStatus = (key) => {
    const { filter, detailFilter, dispatch } = this.props
    if (key && key === 'all') {
      dispatch(getContractList({ ...filter }))
    } else if (key && key === 'detail') {
      dispatch(getContractDetailList({ ...detailFilter }))
    }
  }

  _handleExport = () => {
    const { detailFilter } = this.props
    const reqBody = {
      contractNo: detailFilter.contractNo,
      supplierName: detailFilter.supplierName,
      skuNo: detailFilter.skuNo,
      skuGoodsName: detailFilter.skuGoodsName,
      ticket: storage.get('userInfo') && storage.get('userInfo').ticket
    }
    const params = ParamsUtil.json2url(reqBody)
    let url = (supplyChainUrl === '/') ? `http://${location.host}` : supplyChainUrl
    let newUrl = `${url}/api/supplychain/contract/contractDetailList/export/v1?${params}`
    location.href = newUrl
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { list, page, supplierType, showListSpin, auths, match, detailList, detailPage, filter, detailFilter } = this.props

    const btnRole = auths[match.path] ? auths[match.path] : []
    const _columns = this._genFilterFields()
    const pagination = genPagination(page)
    const detailPagination = genPagination(detailPage)
    return (
      <div>
        <Tabs defaultActiveKey='all' onChange={this._tabStatus}>
          <TabPane tab='合同汇总' key='all'>
            <Form onSubmit={this.handleSubmit}>
              <Row>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label='合同编码'
                  >
                    {getFieldDecorator('contractNo', {
                      rules: [{
                        required: false,
                      }],
                      initialValue: filter && filter.contractNo,
                    })(
                      <Input placeholder='合同编码' />
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
                      initialValue: filter && filter.supplierName,
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
                        initialValue: filter && filter.supplierType || '',
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
                    label='合同状态'
                  >
                    <div
                      id='contractStatus'
                      style={{ position: 'relative' }}
                    >
                      {getFieldDecorator('contractStatus', {
                        rules: [{
                          required: false,
                        }],
                        initialValue: filter && filter.contractStatus || '',
                      })(
                        <Select
                          allowClear={true}
                          placeholder='请选择合同状态'
                          getPopupContainer={() => document.getElementById('contractStatus')}
                        >
                          <Option value=''>全部</Option>
                          <Option value='1'>生效</Option>
                          <Option value='2'>失效</Option>
                          <Option value='3'>未生效</Option>
                        </Select>
                      )}
                    </div>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label='操作人'
                  >
                    {getFieldDecorator('modifyUser', {
                      rules: [{
                        required: false,
                      }],
                      initialValue: filter && filter.operatorName,
                    })(
                      <Input placeholder='操作人' />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label='合同时间'
                  >
                    <div
                      id='time'
                      style={{ position: 'relative' }}
                    >
                      {getFieldDecorator('time', {
                        rules: [{
                          required: false,
                        }],
                        initialValue: [
                          filter && filter.startTime ? moment(filter.startTime) : '',
                          filter && filter.endTime ? moment(filter.endTime) : ''
                        ],
                      })(
                        <RangePicker
                          format='YYYY-MM-DD'
                          placeholder={['开始日期', '结束日期']}
                          getCalendarContainer={() => document.getElementById('time')}
                        />
                      )}
                    </div>
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
                    <Link to={urls.SUPPLY_PURCHASE_CONTRACT_ADD}>
                      <Button
                        type='primary'
                        title='新增'
                      >
                        新增
                      </Button>
                    </Link>
                  )
                }
              </div>
            </Form>
            <Table
              columns={_columns}
              dataSource={list}
              rowKey='contractNo'
              onChange={this._handlePageChange}
              pagination={pagination}
              loading={showListSpin}
            />
          </TabPane>
          <TabPane tab='合同明细' key='detail'>
            <Form onSubmit={this._detailHandleSubmit}>
              <Row className='search-form'>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label='合同编码'
                  >
                    {getFieldDecorator('contractDetailNo', {
                      rules: [{
                        required: false,
                      }],
                      initialValue: detailFilter && detailFilter.contractNo,
                    })(
                      <Input placeholder='合同编码' />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label='供应商名称'
                  >
                    {getFieldDecorator('supplierDetailName', {
                      rules: [{
                        required: false,
                      }],
                      initialValue: detailFilter && detailFilter.supplierName,
                    })(
                      <Input placeholder='供应商名称' />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label='SKU编码'
                  >
                    {getFieldDecorator('skuNo', {
                      rules: [{
                        required: false,
                      }],
                      initialValue: detailFilter && detailFilter.skuNo,
                    })(
                      <Input placeholder='请输入SKU编码' />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label='SKU名称'
                  >
                    {getFieldDecorator('skuGoodsName', {
                      rules: [{
                        required: false,
                      }],
                      initialValue: detailFilter && detailFilter.skuGoodsName,
                    })(
                      <Input placeholder='请输入SKU名称' />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                  >
                    <Button
                      type='primary'
                      htmlType='submit'
                    >查询
                    </Button>
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
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <Table
              columns={this._detailColumns}
              dataSource={detailList}
              rowKey='id'
              onChange={this._handleDetailPageChange}
              pagination={detailPagination}
              loading={showListSpin}
            />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auths: state.common.auths,
    showListSpin: state.common.showListSpin,
    list: state.purchase.contract.contractList,
    page: state.purchase.contract.contractPage,
    filter: state.purchase.contract.filter,
    preRouter: state.router.pre,
    supplierType: state.purchase.contract.codeList.supplierType,
    detailList: state.purchase.contract.detailList,
    detailPage: state.purchase.contract.detailPage,
    detailFilter: state.purchase.contract.detailFilter
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Contract))
