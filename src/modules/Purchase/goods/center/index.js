import React, { Component } from 'react'
// import { createAction } from 'redux-actions'
import { Form, Table, TreeSelect, Select, Input, Row, Col, Button, DatePicker, message, Divider } from 'antd'
import { connect } from 'react-redux'
import * as actions from './reduck'
import styles from './style.less'
import { Link } from 'react-router-dom'
import { isEmpty } from 'Utils/lang'
import { SeasonFactor } from '../dict'
import * as urls from 'Global/urls'
import storage from 'Utils/storage'
import { supplyChainUrl } from '../../../../config'
import parmasUtil from 'Utils/params'
import { genPagination } from 'Utils/helper'
import { createAction } from 'redux-actions'

const FormItem = Form.Item
const Option = Select.Option
const TreeNode = TreeSelect.TreeNode
const RangePicker = DatePicker.RangePicker

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
}

const SeasonFactorChildren = []
SeasonFactor.forEach(item => (
  SeasonFactorChildren.push(<Option key={item}>{item}</Option>)
))

const goodsStatus = {
  '1': '正常',
  '2': '淘汰',
  '3': '缺失'
}

const goodsSpeciality = {
  '0': '非买断',
  '1': '买断'
}

class Center extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount() {
    const { dispatch, centerList, preRouter } = this.props
    if ((isEmpty(centerList) || !(preRouter && preRouter.startsWith(urls.SUPPLY_GOODS_CENTER)))) {
      dispatch(actions.getCategoryList({ parentNo: '', status: 1 }))
      dispatch(actions.getCodeList({ 'codeKeys': ['goodsType'] }))
    }
    dispatch(createAction(actions.GET_CENTER_LIST)({ filter: {}}))
    dispatch(actions.getGoodsCenterList({ currentPage: 1, pageSize: 10 }))
  }

  // 点击分页获取列表数据
  _handlePageChange = (pagination) => {
    const { dispatch, centerPage, filter } = this.props
    const { current, pageSize } = pagination
    dispatch(actions.getGoodsCenterList({ ...filter, currentPage: centerPage.pageSize !== pageSize ? 1 : current, pageSize: pageSize }))
  }

  // 模糊搜索
  handleSubmit = (e) => {
    e.preventDefault()
    const { filter } = this.props
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const newReqBean = {
          goodsNo: values.goodsNo && values.goodsNo.trim(),
          skuNo: values.skuNo && values.skuNo.trim(),
          goodsName: values.goodsName && values.goodsName.trim(),
          goodsCatgNo: values.goodsCatgNo,
          goodsType: values.goodsType,
          seasonFactorList: values.seasonFactorList,
          brandName: values.brandName,
          goodsStatus: values.goodsStatus,
          goodsSpeciality: values.goodsSpeciality,
          currentPage: 1,
          pageSize: filter.pageSize,
          startTime: values.time && !isEmpty(values.time) ? values.time[0].format('YYYY-MM-DD') : '',
          endTime: values.time && !isEmpty(values.time) ? values.time[1].format('YYYY-MM-DD') : '',
        }
        this.props.dispatch(actions.getGoodsCenterList(newReqBean))
      }
    })
  }

  _selectChange = (rule, value, callback) => {
    const { goodsCategoryList, form } = this.props
    const bool = goodsCategoryList && goodsCategoryList.some(item => { return item.goodsCatgNo === value })
    if (bool) {
      message.warning('请勿选择一级分类', 2)
      form.setFieldsValue({
        goodsCatgNo: ''
      })
    } else {
      callback()
    }
  }

  _selectAll = () => {
    this.props.form.resetFields(['seasonFactorList'])
    this.props.form.setFieldsValue({
      seasonFactorList: SeasonFactor
    })
  }

  columns = [
    {
      title: '序号',
      dataIndex: 'rowNo',
      width: 80,
      fixed: 'left',
      render: (text, record, index) => {
        const { pageSize, pageNo } = this.props.centerPage
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
      title: '货物编码',
      dataIndex: 'goodsNo',
      width: 100,
      fixed: 'left',
      render: (text, record, index) => {
        return (
          <Link
            to={`${urls.SUPPLY_GOODS_CENTER_DETAIL}/${record.goodsNo}`}
          >{text}
          </Link>
        )
      }
    },
    {
      title: 'SKU编码',
      dataIndex: 'skuNo',
    },
    {
      title: '货物名称',
      dataIndex: 'goodsName'
    },
    {
      title: '规格',
      dataIndex: 'skuSpecName',
    },
    {
      title: '所属分类',
      dataIndex: 'goodsCatgName'
    },
    {
      title: '货物类型',
      dataIndex: 'goodsTypeName',
    },
    {
      title: '库存单位',
      dataIndex: 'goodsUnit'
    },
    {
      title: '货物状态',
      dataIndex: 'goodsStatus',
      render: (text) => {
        return (
          <span>{goodsStatus[text]}</span>
        )
      }
    },
    {
      title: '货物特性',
      dataIndex: 'goodsSpeciality',
      render: (text) => {
        return (
          <span>{goodsSpeciality[text]}</span>
        )
      }
    },
    {
      title: '季节因子',
      dataIndex: 'seasonFactor'
    },
    {
      title: '品牌名称',
      dataIndex: 'brandName'
    },
    {
      title: '创建日期',
      dataIndex: 'createTime'
    },
    {
      title: '操作',
      fixed: 'right',
      width: 136,
      render: (text, record) => {
        const { auths, match } = this.props
        const { path } = match
        const authState = (isEmpty(auths) || isEmpty(auths[path])) ? [] : auths[path]
        return (
          <span>
            {authState.includes('edit') && <Link to={`${urls.SUPPLY_GOODS_CENTER_EDIT}/${record.goodsNo}`}>修改</Link>}
            {authState.includes('edit') && authState.includes('editSpec') && <Divider type='vertical' />}
            {authState.includes('editSpec') && <Link to={`${urls.SUPPLY_GOODS_CENTER_SPEC_EDIT}/${record.goodsNo}`}>修改规格</Link>}
          </span>
        )
      }
    }
  ]

  _handleExport = () => {
    const values = this.props.form.getFieldsValue()
    const exportBean = {
      goodsNo: values.goodsNo,
      skuNo: values.skuNo,
      goodsName: values.goodsName,
      goodsCatgNo: values.goodsCatgNo,
      goodsType: values.goodsType,
      goodsStatus: values.goodsStatus,
      goodsSpeciality: values.goodsSpeciality,
      seasonFactorList: !isEmpty(values.seasonFactorList) ? '[' + values.seasonFactorList + ']' : '',
      brandName: values.brandName,
      startTime: values.time && !isEmpty(values.time) ? values.time[0].format('YYYY-MM-DD') : '',
      endTime: values.time && !isEmpty(values.time) ? values.time[1].format('YYYY-MM-DD') : '',
      currentPage: 1,
      pageSize: 10
    }
    const params = parmasUtil.json2url(exportBean)
    const ticket = storage.get('userInfo').ticket
    const url = (supplyChainUrl === '/') ? `http://${location.host}` : supplyChainUrl
    let href = `${url}/api/supplychain/cargo/goods/sku/list/export/v2?ticket=${ticket}&${params}`
    location.href = href
  }

  render() {
    const { centerPage, goodsCategoryList, goodsType, filter, centerList, showListSpin, auths, match } = this.props
    const { path } = match
    const authState = (isEmpty(auths) || isEmpty(auths[path])) ? [] : auths[path]
    const { getFieldDecorator } = this.props.form
    const pagination = genPagination(centerPage)
    return (
      <div>
        <Form onSubmit={this.handleSubmit} className='search-form'>
          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label={'货物编码'}
              >
                {getFieldDecorator('goodsNo', {
                  rules: [{
                    required: false
                  }],
                  initialValue: filter.goodsNo,
                })(
                  <Input placeholder='货物编码' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label={'SKU编码'}
              >
                {getFieldDecorator('skuNo', {
                  rules: [{
                    required: false
                  }],
                  initialValue: filter.skuNo,
                })(
                  <Input placeholder='SKU编码' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label={'货物名称'}
              >
                {getFieldDecorator('goodsName', {
                  rules: [{
                    required: false
                  }],
                  initialValue: filter.goodsName,
                })(
                  <Input placeholder='货物名称' />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label={'货物分类'}
              >
                <div
                  id='goodsCatgNo'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('goodsCatgNo', {
                    rules: [{
                      required: false
                    }, {
                      validator: (rule, value, callback) => {
                        this._selectChange(rule, value, callback)
                      }
                    }],
                    initialValue: filter.goodsCatgNo,
                  })(
                    <TreeSelect
                      showSearch
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder='请选择货物分类'
                      allowClear
                      treeNodeFilterProp='title'
                      getPopupContainer={() => document.getElementById('goodsCatgNo')}
                    >
                      {
                        goodsCategoryList && goodsCategoryList.map(item => {
                          if (item.childGoodsCatgList && !isEmpty(item.childGoodsCatgList)) {
                            return (
                              <TreeNode
                                value={item.goodsCatgNo}
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
                                                <TreeNode value={ele.goodsCatgNo} title={ele.goodsCatgName} key={ele.goodsCatgNo}>
                                                  {
                                                    ele.childGoodsCatgList && ele.childGoodsCatgList.map(last => {
                                                      return (
                                                        <TreeNode value={last.goodsCatgNo} title={last.goodsCatgName} key={last.goodsCatgNo} />
                                                      )
                                                    })
                                                  }
                                                </TreeNode>
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
                label='货物类型：'
                className={styles['form-item']}
                {...formItemLayout}
              >
                <div
                  id='goodsType'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('goodsType', {
                    initialValue: filter.goodsType || '',
                  })(
                    <Select
                      allowClear
                      showSearch={false}
                      optionLabelProp='title'
                      placeholder='货物类型'
                      filterOption={false}
                      getPopupContainer={() => document.getElementById('goodsType')}
                    >
                      <Option value='' title='全部'>全部</Option>
                      {goodsType && goodsType.map(item => (
                        <Option
                          key={item.value}
                          value={item.value}
                          title={item.name}
                        >
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 17 }}
                label='季节因子：'
              >
                <div
                  id='seasonFactorList'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('seasonFactorList')(
                    <Select
                      mode='multiple'
                      allowClear={true}
                      placeholder='请选择季节因子'
                      onChange={this._handleSelect}
                      getPopupContainer={() => document.getElementById('seasonFactorList')}
                    >
                      {SeasonFactorChildren}
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={1} style={{ marginTop: 8 }} >
              <span>
                <a onClick={this._selectAll}>全部</a>
              </span>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label={'品牌名称'}
              >
                {getFieldDecorator('brandName', {
                  rules: [{
                    required: false
                  }],
                  initialValue: '',
                })(
                  <Input placeholder='品牌名称' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='创建日期'
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
                      style={{ width: '100%' }}
                      format='YYYY-MM-DD'
                      placeholder={['开始日期', '结束日期']}
                      showTime={{ hideDisabledOptions: true }}
                      getCalendarContainer={() => document.getElementById('time')}
                    />
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label='货物状态：'
                className={styles['form-item']}
                {...formItemLayout}
              >
                <div
                  id='goodsStatus'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('goodsStatus', {
                    initialValue: '',
                  })(
                    <Select
                      allowClear
                      placeholder='货物状态'
                      getPopupContainer={() => document.getElementById('goodsStatus')}
                    >
                      <Option value=''>全部</Option>
                      {Object.keys(goodsStatus).map((key) => (
                        <Option
                          key={key}
                          value={key}
                        >
                          {goodsStatus[key]}
                        </Option>
                      ))}
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem
                label='货物特性：'
                className={styles['form-item']}
                {...formItemLayout}
              >
                <div
                  id='goodsSpeciality'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('goodsSpeciality', {
                    initialValue: '',
                  })(
                    <Select
                      allowClear
                      placeholder='货物特性'
                      getPopupContainer={() => document.getElementById('goodsSpeciality')}
                    >
                      <Option value=''>全部</Option>
                      {Object.keys(goodsSpeciality).map((key) => (
                        <Option
                          key={key}
                          value={key}
                        >
                          {goodsSpeciality[key]}
                        </Option>
                      ))}
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                <Button
                  type='primary'
                  htmlType='submit'
                >查询
                </Button>
                {authState.includes('add') &&
                  <Link to={urls.SUPPLY_GOODS_CENTER_ADD}>
                    <Button
                      type='primary'
                    >新增
                    </Button>
                  </Link>
                }
                {authState.includes('export') &&
                  <Button
                    onClick={this._handleExport}
                    type='primary'
                  >导出
                  </Button>
                }
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Table
          className={styles['c-table-center']}
          columns={this.columns}
          dataSource={centerList}
          onChange={this._handlePageChange}
          rowKey='skuNo'
          scroll = {{ x: 1600 }}
          pagination={pagination}
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
    goodsCenterList: state.purchase.goods.center.goodsCenterList,
    goodsCategoryList: state.purchase.goods.center.goodsCategoryList,
    goodsType: state.purchase.goods.center.codeList.goodsType,
    filter: state.purchase.goods.center.filter,
    preRouter: state.router.pre,
    centerList: state.purchase.goods.center.centerList,
    centerPage: state.purchase.goods.center.centerPage
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Center))
