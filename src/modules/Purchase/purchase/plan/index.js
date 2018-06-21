import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Select, Row, Col, Button, Table, DatePicker, message, Popconfirm, TreeSelect, InputNumber, Radio } from 'antd'

import { queryOrgByLevel } from 'Global/action'
import { showModalSelectForm } from 'Components/modal/ModalSelectForm'
import { fetchSupplyChain as fetchData } from 'Utils/fetch'
import { genPagination, genEllipsisColumn } from 'Utils/helper'

import apis from '../../apis'
import * as actions from './reduck'
import { isEmpty, isArray } from 'Utils/lang'
import styles from './index.less'

const TreeNode = TreeSelect.TreeNode
const FormItem = Form.Item
const Option = Select.Option
const TextArea = Input.TextArea
const RangePicker = DatePicker.RangePicker
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

// 操作状态
const wareHouseStatus = {
  '1': '正常库存',
  '2': '低库存',
  '3': '高库存',
}

// tab切换
const tabTitle = [
  { value: '2', name: '未生成订单' },
  { value: '1', name: '全部' },
]
class PurchasePlan extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRowKeys: [],
      startTime: '',
      endTime: '',
      selectedList: [],
      warehouseNo: '',
      num: 0,
      dataSource: [],
      purCountSource: [],
      listType: '2',
    }
  }

  componentWillMount() {
    const { dispatch, orgLevel } = this.props
    dispatch(actions.getSupplyList())
    dispatch(actions.getGoodsCatg({
      parentNo: '',
      status: 1
    }))
    this._getOrderList(1, 10, '2')
    // 获取组织
    orgLevel === '' && dispatch(queryOrgByLevel())
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.planList !== nextProps.planList) {
      this.setState({
        dataSource: nextProps.planList && nextProps.planList.map(item => {
          let purCount = item.purCount
          const purCountTarget = this.state.purCountSource.find(item1 => item.purCode === item1.purCode)
          if (purCountTarget) {
            purCount = purCountTarget.purCount
          }
          return {
            ...item,
            purCount,
            supplierNo: item.supplierName ? item.supplyListRes && item.supplyListRes.filter(s => s.supplierName === item.supplierName) : ''
          }
        })
      })
    }
  }

  // 获取列表数据的公用方法
  _getOrderList = (currentPage, pageSize, hasOrder) => {
    const { dispatch } = this.props
    const arg = this._getParameter(currentPage, pageSize, hasOrder)
    dispatch(actions.getPlanList(arg))
    this.setState({
      selectedRowKeys: []
    })
  }

  // 获取所有搜索参数
  _getParameter = (currentPage = this.props.page.currentPage, pageSize = this.props.page.pageSize, hasOrder) => {
    const arg = this.props.form.getFieldsValue()
    const { startTime, endTime } = this.state
    return {
      skuNo: arg.skuNo ? arg.skuNo : '',
      skuGoodsName: arg.skuGoodsName ? arg.skuGoodsName : '',
      goodsCatgNo: arg.goodsCatgNo ? arg.goodsCatgNo : '',
      supplierNo: arg.supplierNo ? arg.supplierNo : '',
      warehouseNo: arg.warehouseNo ? arg.warehouseNo : '',
      startTime: startTime,
      endTime: endTime,
      hasOrder: hasOrder,
      currentPage: currentPage,
      pageSize: pageSize,
    }
  }

  // 点击分页获取列表数据
  _handlePageChange = (pagination) => {
    // console.log('params', pagination, filters, sorter)
    const { page } = this.props
    const { listType } = this.state
    const { current, pageSize } = pagination
    this._getOrderList(pageSize !== page.pageSize ? 1 : current, pagination.pageSize, listType)
  }

  // 搜索
  _search = () => {
    const { page } = this.props
    const { listType } = this.state
    // if (listType === '2') {
    //   this.setState({
    //     listType: '1'
    //   })
    // }
    this._getOrderList(1, page.pageSize, listType)
  }

  // tab切换查询
  _tabSearch = (e) => {
    const listType = e.target.value
    const { page } = this.props
    this.setState({ listType }, () => {
      this._getOrderList(1, page.pageSize, listType)
    })
  }

  sort = (arr) => {
    for (let j = 0; j < arr.length - 1; j++) {
      for (let i = 0; i < arr.length - 1 - j; i++) {
        if (arr[i].index > arr[i + 1].index) {
          let temp = arr[i]
          arr[i] = arr[i + 1]
          arr[i + 1] = temp
        }
      }
    }
    return arr
  }

  // 选择货物
  _handleSelectGoods = (value) => {
    const { dispatch } = this.props
    const { warehouseNo } = this.state
    const skuNos = this.sort(value)
    let purchasePlanAddReqs = []
    skuNos && skuNos.map((item) => {
      purchasePlanAddReqs.push({
        skuNo: item.skuNo,
        stockCount: item.stockCount,
        sevenOutboundCount: item.sevenOutboundCount,
        forthOutboundCount: item.forthOutboundCount,
        dayOutboundCount: item.dayOutboundCount,
        warehouseNo: warehouseNo,
      })
      return purchasePlanAddReqs
    })
    dispatch(actions.addPurchasePlan({
      purchasePlanAddReqs: purchasePlanAddReqs
    })).then(res => {
      res & this.setState({
        listType: '2'
      })
    })
  }

  // 选择货物表格
  _packagesColumns = [
    {
      key: 'skuNo',
      title: 'SKU编码',
      dataIndex: 'skuNo',
    },
    {
      key: 'goodsName',
      title: 'SKU名称',
      dataIndex: 'goodsName',
    },
    {
      key: 'goodsCatgName',
      title: '所属分类',
      dataIndex: 'goodsCatgName',
    },
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
    {
      key: 'status',
      title: '库存状态',
      dataIndex: 'status',
      render: (text) => {
        return (
          <span>{wareHouseStatus[text]}</span>
        )
      }
    },
    {
      key: 'stockCount',
      title: '当前库存',
      dataIndex: 'stockCount',
    },
    {
      key: 'availStockCount',
      title: '可用库存',
      dataIndex: 'availStockCount',
    }
  ]

  // 添加货物
  _handleAddClick = () => {
    const { getGoodsCatg } = this.props
    const arg = this.props.form.getFieldsValue()
    if (arg.warehouseNo === undefined) {
      message.warn('请先选择一个采购商！')
      return
    }
    this.setState({ warehouseNo: arg.warehouseNo })
    showModalSelectForm({
      modalParam: {
        title: '添加货物',
        width: 1200
      },
      rowKey: 'skuNo',
      selectType: 'checkbox',
      showOrderFlag: true,
      fetch: fetchData,
      url: apis.purchase.plan.getPurchaseGoods,
      instantSelected: false,
      selectedTagFieldName: 'goodsName',
      listFieldName: 'data',
      extraParams: {
        skuNoList: '',
        warehouseNo: arg.warehouseNo,
        goodsName: '',
        goodsCatgNo: '',
        status: '',
        minStock: '',
        maxStock: '',
      },
      pagination: {
        showSizeChanger: false,
        showQuickJumper: false,
      },
      selectedList: this.state.selectedList,
      onSelect: this._handleSelectGoods,
      beforeSearch: (params) => {
        return {
          ...params,
          skuNoList: params.skuNoList ? params.skuNoList.split(/\s+/g) : [],
        }
      },
      columns: this._packagesColumns,
      filter: [{
        id: 'skuNoList',
        props: {
          label: 'SKU编码：'
        },
        element: (
          <TextArea
            placeholder='请输入SKU编码'
            rows={2}
            maxLength='500'
          />
        )
      }, {
        id: 'goodsName',
        props: {
          label: 'SKU名称：'
        },
        element: (
          <Input placeholder='请输入SKU名称' />
        )
      }, {
        id: 'goodsCatgNo',
        props: {
          label: '所属分类：',
        },
        element: (
          <TreeSelect
            showSearch
            style={{ width: 200 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder='请选择所属分类'
            allowClear
            treeDefaultExpandAll
            filterTreeNode={this._filterType}
            getPopupContainer={() => document.getElementsByClassName('ant-modal-wrap')[0]}
          >
            {
              getGoodsCatg && getGoodsCatg.map(item => {
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
                    <TreeNode value={item.goodsCatgNo} title={item.goodsCatgName} key={item.goodsCatgNo} />
                  )
                }
              })
            }
          </TreeSelect>
        )
      }, {
        id: 'status',
        props: {
          label: '库存状态：'
        },
        element: (
          <Select
            placeholder='请选择库存状态'
            allowClear
            getPopupContainer={() => document.getElementsByClassName('ant-modal-wrap')[0]}
            style={{ width: '172px', height: '40px' }}
          >
            {
              Object.keys(wareHouseStatus).map(key => {
                return (
                  <Option
                    key={key}
                    value={key}
                  >
                    {wareHouseStatus[key]}
                  </Option>
                )
              })
            }
          </Select>
        )
      }, {
        id: 'minStock',
        props: {
          label: '当前库存：'
        },
        element: (
          <div>
            <Input
              placeholder='库存低位'
              style={{ width: 80 }}
            />
            <span style={{ color: '#999' }}>&nbsp;&nbsp;—</span>
          </div>
        )
      }, {
        id: 'maxStock',
        props: {
          label: ''
        },
        element: (
          <div>
            <Input
              placeholder='库存高位'
              style={{ width: 80 }}
            />
          </div>
        )
      }]
    })
  }

  // 货物数量
  _handleCellChange = (value, key, column) => {
    const finalDataSource = [...this.state.dataSource]
    const finalPurCountSource = [...this.state.purCountSource]
    let purCountTarget = finalPurCountSource.find(item => key === item.purCode)
    let target = finalDataSource.filter(item => key === item.purCode)[0]
    if (target) {
      target[column] = value
      if (purCountTarget) {
        purCountTarget[column] = value
      } else {
        finalPurCountSource.push({ purCode: key, purCount: value })
      }
      this.setState({ dataSource: finalDataSource, purCountSource: finalPurCountSource })
    }
  }

  // 处理供应商选择
  _dealSupply = (record) => {
    if (!isEmpty(record.purOrderId)) {
      return record.supplierName
    }
    if (!isEmpty(record.supplyListRes) && record.supplyListRes.length > 1) {
      return (
        <Select
          placeholder='请选择供应商'
          style={{ width: 160 }}
          defaultValue={record.supplierNo[0] && record.supplierNo[0].supplierNo}
          onChange={value => this._handleCellChange(value, record.purCode, 'supplierNo')}
          getPopupContainer={() => document.getElementById('rowArea')}
        >
          {
            record.supplyListRes.map(key => {
              return (
                <Option
                  key={key.supplierNo}
                  value={key.supplierNo}
                >
                  {key.supplierName}
                </Option>
              )
            })
          }
        </Select>)
    }
    if (!isEmpty(record.supplyListRes) && record.supplyListRes.length === 1) {
      return (
        <span>{record.supplyListRes[0].supplierName}</span>
      )
    }
  }

  // 表格项
  _columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      width: 60,
      render: (text, record, index) => {
        const { pageSize, currentPage } = this.props.page
        return (
          <span>{
            pageSize *
            currentPage +
            (index + 1) -
            pageSize
          }
          </span>
        )
      }
    },
    genEllipsisColumn('skuNo', 'SKU编码', 13),
    genEllipsisColumn('skuGoodsName', 'SKU 名称', 30),
    {
      title: '所属分类',
      dataIndex: 'goodsCatgName',
      key: 'goodsCatgName',
    },
    {
      title: '库存单位',
      dataIndex: 'goodsUnit',
      key: 'goodsUnit',
    },
    {
      title: '箱规',
      dataIndex: 'boxSpec',
      key: 'boxSpec'
    },
    {
      title: '采购数量',
      dataIndex: 'purCount',
      key: 'purCount',
      render: (text, record, index) => {
        return (
          <div>{
            <InputNumber
              onChange={value => this._handleCellChange(value, record.purCode, 'purCount')}
              value={record.purCount}
              style={{ width: 160 }}
              placeholder='请输入数量'
              min={1}
              step={0.1}
              precision={3}
              max={999999999.999}
            />
          }
          </div>
        )
      }
    },
    {
      title: '当前库存',
      dataIndex: 'stockCount',
      key: 'stockCount',
    },
    {
      title: '7日总出库',
      dataIndex: 'sevenOutboundCount',
      key: 'sevenOutboundCount',
    },
    {
      title: '14日总出库',
      dataIndex: 'forthOutboundCount',
      key: 'forthOutboundCount',
    },
    {
      title: '28日日均出库',
      dataIndex: 'dayOutboundCount',
      key: 'dayOutboundCount',
    },
    {
      title: '供应商',
      dataIndex: 'supplierNo',
      key: 'supplierNo',
      render: (text, record) => {
        return (
          <div id={'rowArea'}>
            {
              this._dealSupply(record)
            }
          </div>
        )
      }
    },
    {
      title: '采购部门',
      dataIndex: 'warehouseName',
      key: 'warehouseName'
    },
    {
      title: '订单号',
      dataIndex: 'purOrderId',
      key: 'purOrderId',
    },
    {
      title: '下单时间',
      dataIndex: 'purOrderTime',
      key: 'purOrderTime',
      width: 108
    },
  ]

  // 格式化日期
  _formatterDate = (val) => {
    this.setState({
      startTime: isEmpty(val) ? '' : val[0].format('YYYY-MM-DD HH:mm:ss'),
      endTime: isEmpty(val) ? '' : val[1].format('YYYY-MM-DD HH:mm:ss'),
    })
  }

  // 删除计划
  _deletePurchasePlan = () => {
    const { dispatch } = this.props
    const { selectedRowKeys } = this.state
    if (selectedRowKeys.length === 0) {
      message.warn('请选择一个或者多个进行操作！')
      return
    }
    dispatch(actions.deletePurchasePlan({
      purCodeList: selectedRowKeys
    })).then(res => {
      res & this.setState({
        listType: '2'
      })
    })
    this.setState({ selectedRowKeys: [] })
  }

  // 生成订单
  _setOrder = () => {
    const { dispatch } = this.props
    const { selectedRowKeys, dataSource } = this.state
    let purchasePlanReqs = []

    dataSource.filter(item => selectedRowKeys.includes(item.purCode)).forEach(key => {
      let supplierNo = key.supplierNo
      if (isArray(key.supplyListRes) && key.supplyListRes.length === 1) {
        supplierNo = key.supplyListRes[0].supplierNo
      }
      purchasePlanReqs.push({
        purCount: key.purCount,
        purCode: key.purCode,
        supplierNo: isArray(supplierNo) ? supplierNo[0].supplierNo : supplierNo,
      })
    })
    dispatch(actions.placePurOrder({
      purchasePlanReqs: purchasePlanReqs
    })).then(res => {
      res & this.setState({
        listType: '2'
      })
    })
    // this._search()
    this.setState({ selectedRowKeys: [] })
  }

  // 计划选择!isEmpty(record.supplyListRes)
  onSelectChange = (selectedRowKeys, selectedRows) => {
    // const selectedRowsLength = selectedRows.length
    // const len = selectedRows.filter(item => item.purCount && !item.purOrderId && item.supplierNo).length
    this.setState({
      // disBtn: len !== selectedRowsLength,
      selectedRowKeys,
    })
  }

  // 过滤
  _filterType = (inputValue, childGoodsCatgList) => {
    return (childGoodsCatgList.props.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { selectedRowKeys, dataSource } = this.state
    const {
      page,
      showListSpin,
      supplyList,
      orgLevel,
      orgList,
      getGoodsCatg,
      orgCode,
      orgName,
      auths,
      match
    } = this.props
    const pagination = genPagination({ ...page, pageNo: page.currentPage })
    const btnRole = auths[match.path] ? auths[match.path] : []
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }

    const len = this.state.dataSource.filter(item => selectedRowKeys.includes(item.purCode))
      .filter(item => item.purCount && !item.purOrderId && (item.supplierNo || (item.supplyListRes && item.supplyListRes.length === 1))).length
    const disBtn = len !== selectedRowKeys.length

    return (
      <div>
        <div className='operate-btn'>
          <Form
            id='filter-form'
          >
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='SKU编码'
                >
                  {getFieldDecorator('skuNo')(
                    <Input
                      placeholder='请输入SKU编码'
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='SKU名称'
                >
                  {getFieldDecorator('skuGoodsName')(
                    <Input
                      placeholder='请输入SKU名称'
                    />
                  )}
                </FormItem>
              </Col>
              <Col
                span={8}
              >
                <div
                  id='goodsCateNo'
                  style={{ position: 'relative', textAlign: 'left' }}
                >
                  <FormItem
                    {...formItemLayout}
                    label='所属分类'
                  >
                    {getFieldDecorator('goodsCatgNo')(
                      <TreeSelect
                        showSearch
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder='请选择所属分类'
                        allowClear
                        treeDefaultExpandAll
                        treeNodeFilterProp='children'
                        filterTreeNode={this._filterType}
                        getPopupContainer={() => document.getElementById('goodsCateNo')}
                      >
                        {
                          getGoodsCatg && getGoodsCatg.map(item => {
                            if (item.childGoodsCatgList && !isEmpty(item.childGoodsCatgList)) {
                              return (
                                <TreeNode
                                  value={item.goodsCatgNo}
                                  // disabled='true'
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
                                <TreeNode value={item.goodsCatgNo} title={item.goodsCatgName} key={item.goodsCatgNo} />
                              )
                            }
                          })
                        }
                      </TreeSelect>
                    )}
                  </FormItem>
                </div>
              </Col>
            </Row>
            <Row>
              <Col
                span={8}
              >
                <FormItem
                  {...formItemLayout}
                  label='供应商'
                >
                  <div
                    id='shopNames'
                    style={{ position: 'relative', textAlign: 'left' }}
                  >
                    {getFieldDecorator('supplierNo', {
                      initialValue: ''
                    })(
                      <Select
                        allowClear
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        placeholder='请选择供应商'
                        getPopupContainer={() => document.getElementById('shopNames')}
                      >
                        <Option value=''>全部</Option>
                        {
                          supplyList && supplyList.map((key) => {
                            return (
                              <Option
                                key={key.supplierNo}
                                value={key.supplierNo}
                              >
                                {key.supplierName}
                              </Option>
                            )
                          })
                        }
                      </Select>
                    )}
                  </div>
                </FormItem>
              </Col>
              <Col
                span={8}
              >
                <div
                  id='warehouseNo'
                  style={{ position: 'relative', textAlign: 'left' }}
                >
                  <FormItem
                    {...formItemLayout}
                    label='采购部门'
                  >
                    {getFieldDecorator('warehouseNo', {
                      initialValue: orgLevel === '2' ? orgCode : ''
                    })(
                      <Select
                        allowClear
                        disabled={orgLevel === '2' ? Boolean(1) : Boolean(0)}
                        placeholder='请选择采购部门'
                        getPopupContainer={() => document.getElementById('warehouseNo')}
                      >
                        <Option value=''>全部</Option>
                        {
                          (orgLevel && orgLevel === '2') ? (<Option value={orgCode} key={orgCode}>{orgName}</Option>) : (
                            orgList && orgList.map(item => {
                              return (
                                <Option key={item.orgCode} value={item.orgCode}>{item.orgName}</Option>
                              )
                            }))
                        }
                      </Select>
                    )}
                  </FormItem>
                </div>
              </Col>
              <Col
                span={8}
                id={'dateSelect'}
              >
                <FormItem
                  {...formItemLayout}
                  label='下单时间'
                >
                  {getFieldDecorator('date')(
                    <RangePicker
                      style={{ maxWidth: '100%' }}
                      showTime
                      format='YYYY-MM-DD HH:mm:ss'
                      placeholder={['开始日期', '结束日期']}
                      getCalendarContainer={() => document.getElementById('dateSelect')}
                      onChange={this._formatterDate}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row
              type='flex'
              justify='end'
            >
              <Col>
                <Button
                  type='primary'
                  className={styles['queryBtn']}
                  onClick={this._search}
                >查询
                </Button>
                {
                  btnRole.includes('add') && orgLevel === '2' &&
                  <Button
                    type='primary'
                    onClick={this._handleAddClick}
                  >添加货物
                  </Button>
                }
                {
                  btnRole.includes('setOrder') && orgLevel === '2' && (
                    <Popconfirm
                      title='你确定生成订单吗？'
                      onConfirm={this._setOrder}
                      okText='确定'
                      cancelText='取消'
                    >
                      <Button type='primary' disabled={selectedRowKeys.length < 1 || disBtn}>生成订单</Button>
                    </Popconfirm>
                  )
                }
                {
                  btnRole.includes('delete') && orgLevel === '2' && (
                    <Popconfirm
                      title='你确定要删除该计划吗？'
                      onConfirm={this._deletePurchasePlan}
                      okText='确定'
                      cancelText='取消'
                      placement='topRight'
                    >
                      <Button type='primary'> 删除 </Button>
                    </Popconfirm>
                  )
                }
              </Col>
            </Row>
          </Form>
        </div>
        <div className={styles['tab']}>
          <RadioGroup onChange={this._tabSearch} value={this.state.listType}>
            {
              tabTitle.map((key) => {
                return (
                  <RadioButton
                    key={key.value}
                    value={key.value}
                  >
                    {key.name}
                  </RadioButton>
                )
              })
            }
          </RadioGroup>
        </div>
        <Table
          rowSelection={rowSelection}
          columns={this._columns}
          dataSource={dataSource}
          loading={showListSpin}
          scroll = {{ x: 2200 }}
          rowKey='purCode'
          locale={{
            emptyText: '暂无数据'
          }}
          onChange={this._handlePageChange}
          pagination={pagination}
        />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    planList: state.purchase.purchasePlan.planList,
    page: state.purchase.purchasePlan.page,
    showListSpin: state.common.showListSpin,
    supplyList: state.purchase.purchasePlan.supplyList,
    orgLevel: state.common.orgLevel,
    orgList: state.common.orgList,
    orgCode: state.common.orgCode,
    orgName: state.common.orgName,
    getGoodsCatg: state.purchase.purchasePlan.getGoodsCatg,
    auths: state.common.auths,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(PurchasePlan))
