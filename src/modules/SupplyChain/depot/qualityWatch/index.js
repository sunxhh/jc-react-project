import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Table, Input, Select, Form, Row, Col, DatePicker, TreeSelect } from 'antd'
import { getWatchList, getSelectList, getGoodsCateList } from './reduck'
import { queryOrgByLevel } from 'Global/action'
import { isEmpty } from '../../../../utils/lang'
import ParamsUtil from '../../../../utils/params'
import { codeList } from '../../reduck'
import { supplyChainUrl } from '../../../../config'
import storage from '../../../../utils/storage'
import { genPagination, genEllipsisColumn } from 'Utils/helper'

// import { Link } from 'react-router-dom'
// import * as urls from '../../../../global/urls'

const Option = Select.Option
const FormItem = Form.Item
const TreeNode = TreeSelect.TreeNode
const RangePicker = DatePicker.RangePicker
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

class Watch extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reqBean: {
        skuNo: '',
        goodsName: '',
        goodsCatgNo: '',
        goodsType: '',
        warehouseNo: '',
        startDate: '',
        endDate: '',
        outinOrderNo: '',
        expired: '0',
        currentPage: 1,
        pageSize: 10
      },
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(queryOrgByLevel()).then(res => {
      if (res.myOrgLevel !== '2') {
        dispatch(getWatchList(this.state.reqBean))
      } else {
        this.setState({ reqBean: Object.assign({}, this.state.reqBean, { warehouseNo: res.myOrgCode }) }, () => {
          dispatch(getWatchList(this.state.reqBean))
        })
      }
    })
    dispatch(codeList({ 'codeKeys': ['goodsType'] }))
    dispatch(getSelectList({ 'selectKeys': ['goodsCatg'] }))
    dispatch(getGoodsCateList({ parentNo: '', status: '1' }))
    // dispatch(getWareList())
    // dispatch(getWatchList(this.state.reqBean))
  }

  _columns = [
    {
      key: 'rowNo',
      title: '序号',
      dataIndex: 'rowNo',
      width: 60,
      fixed: 'left',
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
      render: (text, record, index) => {
        const date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
        return (Date.parse(new Date(record.expDate)) / 1000 < Date.parse(new Date(date)) / 1000) && (record.stockCount !== 0 ? Boolean(1) : Boolean(0)) ? (<span style={{ color: 'red' }}>{text}</span>) : (<span>{text}</span>)
      }
    },
    genEllipsisColumn('goodsName', 'SKU 名称', 30),
    genEllipsisColumn('goodsCatgName', '所属分类', 10),
    {
      key: 'goodsTypeName',
      title: '货物类型',
      dataIndex: 'goodsTypeName',
    },
    {
      key: 'goodsUnit',
      title: '库存单位',
      dataIndex: 'goodsUnit',
    },
    genEllipsisColumn('warehouseName', '仓库部门', 10),
    {
      key: 'productDate',
      title: '生产日期',
      dataIndex: 'productDate',
      width: 108,
    },
    {
      key: 'purCount',
      title: '采购数量',
      dataIndex: 'purCount',
    },
    {
      key: 'stockCount',
      title: '库存数量',
      dataIndex: 'stockCount',
    },
    {
      key: 'expDate',
      title: '过期日期',
      dataIndex: 'expDate',
      width: 108,
      render: (text, record, index) => {
        const date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
        return (Date.parse(new Date(text)) / 1000 < Date.parse(new Date(date)) / 1000) && (record.stockCount !== 0 ? Boolean(1) : Boolean(0)) ? (<span style={{ color: 'red' }}>{text}</span>) : (<span>{text}</span>)
      }
    },
    genEllipsisColumn('outinOrderNo', '入库单编码', 12),
  ]

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const newReqBean = {
          skuNo: values.skuNo ? values.skuNo.replace(/(^\s+)|(\s+$)/g, '') : '',
          goodsName: values.goodsName ? values.goodsName.replace(/(^\s+)|(\s+$)/g, '') : '',
          goodsCatgNo: values.goodsCateNo,
          goodsType: values.goodsType,
          warehouseNo: values.warehouseName,
          expired: values.expired || '0',
          outinOrderNo: values.outinOrderNo ? values.outinOrderNo.replace(/(^\s+)|(\s+$)/g, '') : '',
          startDate: values.time && !isEmpty(values.time) ? values.time[0].format('YYYY-MM-DD') : '',
          endDate: values.time && !isEmpty(values.time) ? values.time[1].format('YYYY-MM-DD') : '',
          currentPage: 1,
          pageSize: 10
        }
        this.setState({
          reqBean: newReqBean
        }, () => {
          this.props.dispatch(getWatchList(this.state.reqBean))
        })
      }
    })
  }

  _handlePageChange = (pagination) => {
    window.scrollTo(0, 0)
    const { current, pageSize } = pagination
    const { page } = this.props
    this.setState({
      reqBean: Object.assign({}, this.state.reqBean, { currentPage: page.pageSize !== pageSize ? 1 : current, pageSize: pageSize })
    }, () => {
      this.props.dispatch(getWatchList(this.state.reqBean))
    })
  }

  onChange = (e) => {
    this.setState({
      reqBean: Object.assign({}, this.state.reqBean, { expired: e.target.checked === true ? 1 : 0 })
    })
  }

  _handleExport = () => {
    const { reqBean } = this.state
    const reqBody = {
      skuNo: reqBean.skuNo || '',
      goodsName: reqBean.goodsName || '',
      goodsCatgNo: reqBean.goodsCateNo || '',
      goodsType: reqBean.goodsType || '',
      warehouseNo: reqBean.warehouseNo || '',
      expired: reqBean.expired || '0',
      outinOrderNo: reqBean.outinOrderNo || '',
      startDate: reqBean.startDate || '',
      endDate: reqBean.endDate || '',
      ticket: storage.get('userInfo') && storage.get('userInfo').ticket
    }
    const params = ParamsUtil.json2url(reqBody)
    let url = (supplyChainUrl === '/') ? `http://${location.host}` : supplyChainUrl
    let newUrl = `${url}/api/supplychain/warehouse/periodmonitor/exportWhPeriodMonitorList/v1?${params}` // need modify
    location.href = newUrl
  }

  _filterType = (inputValue, childGoodsCatgList) => {
    return (childGoodsCatgList.props.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
  }

  // _selectChange = (rule, value, callback) => {
  //   const { goodsCateList, form } = this.props
  //   const bool = goodsCateList && goodsCateList.some(item => {
  //     return item.goodsCatgNo === value
  //   })
  //   if (bool) {
  //     message.warning('请勿选择一级分类', 2)
  //     form.setFieldsValue({
  //       goodsCateNo: ''
  //     })
  //   } else {
  //     callback()
  //   }
  // }

  render () {
    const { getFieldDecorator } = this.props.form
    const { list, page, showListSpin, goodsType, orgLevel, orgList, goodsCateList, match, auths, orgCode, orgName } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    const pagination = genPagination(page)
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Row className='search-form'>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='SKU编码'
              >
                {getFieldDecorator('skuNo', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: '',
                })(
                  <Input placeholder='请输入SKU编码' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='货物名称'
              >
                {getFieldDecorator('goodsName', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: '',
                })(
                  <Input placeholder='请输入货物名称' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='所属分类'
              >
                <div
                  id='goodsCateNo'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('goodsCateNo', {
                    rules: [{
                      required: false,
                    }],
                  })(
                    <TreeSelect
                      dropdownStyle={{ height: 300, overflow: 'auto' }}
                      placeholder='请选择所属分类'
                      allowClear
                      treeDefaultExpandAll
                      showSearch={true}
                      filterTreeNode={this._filterType}
                      getPopupContainer={() => document.getElementById('goodsCateNo')}
                    >
                      {
                        goodsCateList && goodsCateList.map(item => {
                          if (item.childGoodsCatgList && !isEmpty(item.childGoodsCatgList)) {
                            return (
                              <TreeNode
                                value={item.goodsCatgNo}
                                // disabled={true}
                                title={item.goodsCatgName}
                                key={item.goodsCatgNo}
                              >
                                {
                                  item.childGoodsCatgList.map(i => {
                                    if (i.childGoodsCatgList && !isEmpty(i.childGoodsCatgList)) {
                                      return (
                                        <TreeNode value={i.goodsCatgNo} title={i.goodsCatgName} key={i.goodsCatgNo}>
                                          {
                                            i.childGoodsCatgList.map(ele => {
                                              return (
                                                <TreeNode value={ele.goodsCatgNo} title={ele.goodsCatgName} key={ele.goodsCatgNo} />
                                              )
                                            })
                                          }
                                        </TreeNode>
                                      )
                                    } else {
                                      return (
                                        <TreeNode value={i.goodsCatgNo} title={i.goodsCatgName} key={i.goodsCatgNo} />
                                      )
                                    }
                                  })
                                }
                              </TreeNode>
                            )
                          } else {
                            return (
                              <TreeNode
                                value={item.goodsCatgNo}
                                disabled={true}
                                title={item.goodsCatgName}
                                key={item.goodsCatgNo}
                              />
                            )
                          }
                        })
                      }
                    </TreeSelect>
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='货物类型'
              >
                <div
                  id='goodsType'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('goodsType', {
                    rules: [{
                      required: false,
                    }],
                    initialValue: ''
                  })(
                    <Select
                      allowClear={true}
                      placeholder='请选择货物类型'
                      getPopupContainer={() => document.getElementById('goodsType')}
                    >
                      <Option value=''>全部</Option>
                      {
                        goodsType && goodsType.map(item => (
                          <Option value={item.value} key={item.value}>{item.name}</Option>
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
                label='仓库部门'
              >
                <div
                  id='warehouseName'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('warehouseName', {
                    rules: [{
                      required: false,
                    }],
                    initialValue: orgLevel === '2' ? orgCode : ''
                  })(
                    <Select
                      allowClear={true}
                      disabled={orgLevel === '2' ? Boolean(1) : Boolean(0)}
                      showSearch={false}
                      placeholder='请选择仓库部门'
                      optionFilterProp='children'
                      getPopupContainer={() => document.getElementById('warehouseName')}
                    >
                      <Option key='' value=''>全部</Option>
                      {
                        orgLevel === '2' ? (<Option value={orgCode}>{orgName}</Option>) : (
                          orgList && orgList.map(item => {
                            return (
                              <Option key={item.orgCode} value={item.orgCode}>
                                {item.orgName}
                              </Option>
                            )
                          })
                        )
                      }
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='过期日期'
              >
                <div
                  id='time'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('time', {
                    rules: [{
                      required: false,
                    }],
                  })(
                    <RangePicker
                      format='YYYY-MM-DD'
                      placeholder={['请选择开始日期', '请选择结束日期']}
                      getCalendarContainer={() => document.getElementById('time')}
                    />
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='入库单编码'
              >
                {getFieldDecorator('outinOrderNo', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: '',
                })(
                  <Input placeholder='请输入入库单编码' />
                )}
              </FormItem>
            </Col>
            <Col span={8} id={'expiredBg'}>
              <FormItem
                {...formItemLayout}
                label='是否过期'
              >
                {getFieldDecorator('expired', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: '0'
                })(
                  <Select
                    allowClear={true}
                    showSearch={false}
                    placeholder='请选择是否过期'
                    optionFilterProp='children'
                    getPopupContainer={() => document.getElementById('expiredBg')}
                  >
                    <Option value='0'>全部</Option>
                    <Option value='1'>过期货物</Option>
                  </Select>
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
                  btnRole.includes('export') &&
                  <Button
                    type='primary'
                    title='导出'
                    onClick={this._handleExport}
                  >
                    导出
                  </Button>
                }
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Table
          columns={this._columns}
          dataSource={list}
          onChange={this._handlePageChange}
          rowKey='id'
          pagination={pagination}
          loading={showListSpin}
          scroll = {{ x: 1500 }}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auths: state.common.auths,
    showListSpin: state.common.showListSpin,
    orgCode: state.common.orgCode,
    orgLevel: state.common.orgLevel,
    orgName: state.common.orgName,
    orgList: state.common.orgList,
    list: state.supplyChain.qualityWatch.watchList,
    page: state.supplyChain.qualityWatch.watchPage,
    goodsType: state.supplyChain.commonSupply.goodsType,
    goodsCatg: state.supplyChain.qualityWatch.goodsCatg,
    goodsCateList: state.supplyChain.qualityWatch.goodsCateList
    // wareList: state.supplyChain.qualityWatch.wareList,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Watch))
