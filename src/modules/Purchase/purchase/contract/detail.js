import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button, Card, Row, Col, Select, DatePicker, Table, InputNumber } from 'antd'
import moment from 'moment'

import { genPagination } from 'Utils/helper'
import storage from 'Utils/storage'
import ParamsUtil from 'Utils/params'

import { getCodeList, getContractDetail, getProviderList } from './reduck'
import { supplyChainUrl } from '../../../../config'
import styles from './style.less'

const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const TextArea = Input.TextArea

class Detail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reqBean: {
        contractNo: this.props.match.params.id,
        detail: '1',
        currentPage: 1,
        pageSize: 10
      }
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(getContractDetail(this.state.reqBean))
    dispatch(getProviderList())
    dispatch(getCodeList({ 'codeKeys': ['goodsType'] }))
  }

  _columns = [
    {
      key: 'rowNo',
      title: '序号',
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
        return (
          <span>
            {text}
          </span>
        )
      }
    },
  ]

  _handlePageChange = (pages) => {
    const { current, pageSize } = pages
    const { page } = this.props
    this.setState({
      reqBean: Object.assign({}, this.state.reqBean, { currentPage: page.pageSize !== pageSize ? 1 : current, pageSize: pageSize })
    }, () => {
      this.props.dispatch(getContractDetail(this.state.reqBean))
    })
  }

  _handleExport = () => {
    const reqBody = {
      contractNo: this.props.match.params.id,
      ticket: storage.get('userInfo') && storage.get('userInfo').ticket
    }
    const params = ParamsUtil.json2url(reqBody)
    let url = (supplyChainUrl === '/') ? `http://${location.host}` : supplyChainUrl
    let newUrl = `${url}//api/supplychain/contract/exportContractDetail/v1?${params}` // need modify
    location.href = newUrl
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { providerList, contractDetail, list, page } = this.props
    const pages = genPagination({ ...page })
    return (
      <div>
        <Form>
          <FormItem className='operate-btn'>
            <Button
              title='返回'
              type='primary'
              onClick={() => history.go(-1)}
            >
              返回
            </Button>
          </FormItem>
          <Card title='基础信息'>
            <Row>
              <Col>
                <Row
                  id='rowUser'
                  justify='start'
                  type='flex'
                >
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='合同编码：'
                    >
                      {getFieldDecorator('contractNo', {
                        rules: [{
                          required: true,
                          message: '请输入合同编码'
                        }],
                        initialValue: contractDetail && contractDetail.contractNo
                      })(
                        <Input disabled={true} placeholder='请输入合同编码' />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='供应商名称：'
                    >
                      <div
                        id='supplierNo'
                        style={{ position: 'relative', marginBottom: '6px' }}
                      >
                        {getFieldDecorator('supplierNo', {
                          rules: [{
                            required: true,
                            message: '请输入供应商名称',
                          }],
                          initialValue: contractDetail && contractDetail.supplierNo
                        })(
                          <Select
                            disabled={true}
                            placeholder='请选择供应商名称'
                            getPopupContainer={() => document.getElementById('supplierNo')}
                          >
                            {
                              providerList && providerList.map(item => (
                                <Option value={item.supplierNo} key={item.supplierNo}>{item.supplierName}</Option>
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
                      label='开始时间'
                    >
                      <div
                        id='startTime'
                        style={{ position: 'relative' }}
                      >
                        {getFieldDecorator('startTime', {
                          rules: [{
                            required: true,
                            message: '请选择开始时间'
                          }],
                          initialValue: contractDetail && contractDetail.startTime && moment(contractDetail.startTime)
                        })(
                          <DatePicker
                            disabled={true}
                            style={{ width: '100%' }}
                            format='YYYY-MM-DD'
                            getCalendarContainer={() => document.getElementById('startTime')}
                          />
                        )}
                      </div>
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='结束时间'
                    >
                      <div
                        id='endTime'
                        style={{ position: 'relative' }}
                      >
                        {getFieldDecorator('endTime', {
                          rules: [{
                            required: true,
                            message: '请选择结束时间'
                          }],
                          initialValue: contractDetail && contractDetail.endTime && moment(contractDetail.endTime)
                        })(
                          <DatePicker
                            disabled={true}
                            style={{ width: '100%' }}
                            format='YYYY-MM-DD'
                            getCalendarContainer={() => document.getElementById('endTime')}
                          />
                        )}
                      </div>
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='账期：'
                    >
                      {getFieldDecorator('accountPeriod', {
                        rules: [{
                          required: false,
                        }],
                        initialValue: contractDetail && contractDetail.accountPeriod
                      })(
                        <InputNumber
                          disabled={true}
                          style={{ width: '100%' }}
                          min={1}
                          formatter={value => `${value}天`}
                          parser={value => value.replace('天', '')}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='缺品率：'
                    >
                      {getFieldDecorator('defectiveRate', {
                        rules: [{
                          required: false,
                        }],
                        initialValue: contractDetail && contractDetail.defectiveRate
                      })(
                        <InputNumber
                          disabled={true}
                          style={{ width: '100%' }}
                          min={0}
                          max={100}
                          formatter={value => `${value}%`}
                          parser={value => value.replace('%', '')}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='到货率：'
                    >
                      {getFieldDecorator('arrivalRate', {
                        rules: [{
                          required: false,
                        }],
                        initialValue: contractDetail && contractDetail.arrivalRate
                      })(
                        <InputNumber
                          disabled={true}
                          style={{ width: '100%' }}
                          min={0}
                          max={100}
                          formatter={value => `${value}%`}
                          parser={value => value.replace('%', '')}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='备注：'
                    >
                      {getFieldDecorator('remark', {
                        initialValue: contractDetail && contractDetail.remark
                      })(
                        <TextArea
                          disabled={true}
                          placeholder='请输入备注'
                          maxLength={500}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
          <Card title='货物信息'>
            <Row>
              <div className={styles['contract-page']}>
                <div style={{ marginBottom: '12px', textAlign: 'right' }}>
                  <Button
                    type='primary'
                    title='导出'
                    onClick={this._handleExport}
                  >
                    导出
                  </Button>
                </div>
                <Table
                  columns={this._columns}
                  dataSource={list}
                  rowKey='skuNo'
                  pagination={pages}
                  onChange={this._handlePageChange}
                />
              </div>
            </Row>
          </Card>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    providerList: state.purchase.contract.providerList,
    goodsType: state.purchase.contract.codeList.goodsType,
    provideDetail: state.purchase.contract.provideDetail,
    contractDetail: state.purchase.contract.contractDetail,
    list: state.purchase.contract.goodsList,
    page: state.purchase.contract.goodsPage,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Detail))
