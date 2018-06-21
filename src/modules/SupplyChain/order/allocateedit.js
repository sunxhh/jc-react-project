/**
 * Created with webstorm
 * User: HuangZeXia / huangzexiameishu@163.com
 * Date: 2018/3/5
 * Time: 下午3:31
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Select, Row, Col, Button, Table, Card, message, InputNumber, TreeSelect } from 'antd'
import { showModalSelectForm } from 'Components/modal/ModalSelectForm'
import { queryOrgByLevel } from 'Global/action'
import { fetchSupplyChain as fetchData } from 'Utils/fetch'
import * as actions from './reduck'
import { goodscatgList, stockOrgList } from '../reduck'
import paramsUtil from '../../../utils/params'
import apis from '../apis'

import styles from './index.less'
import { isEmpty } from '../../../utils/lang'
import { StockStatus } from '../depot/stockManage/dict'
import { genPlanColumn, genSelectColumn } from 'Utils/helper'

const FormItem = Form.Item
const TextArea = Input.TextArea
const Option = Select.Option
const TreeNode = TreeSelect.TreeNode

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

class AddAllocate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      goodList: [],
      selectedList: [],
      warehouseNo: '',
    }
  }

  componentDidMount() {
    const { dispatch, orgLevel } = this.props
    dispatch(actions.getAllocateOrderDetail({
      allocationOrderId: paramsUtil.url2json(location).allocationOrderId
    }))
    this.setState({
      allocationOrderId: paramsUtil.url2json(location).allocationOrderId
    })
    dispatch(actions.getSupllyWareHouseList())
    dispatch(stockOrgList({
      org: {
        orgName: ''
      }
    }))
    // 获取组织
    orgLevel === '' && dispatch(queryOrgByLevel())
    dispatch(goodscatgList({ parentNo: '', status: '1' }))
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      goodList: nextProps.allocateOrderDetail.orderSkuList,
      selectedList: nextProps.allocateOrderDetail.orderSkuList
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
    const skuNos = this.sort(value)
    const { goodList } = this.state
    const finalGoodList = skuNos.map(item => {
      return {
        ...item,
        weightCost: item.purAmount,
        goodsQuantity: '',
        totalAmount: ''
      }
    }).concat(goodList)
    // value && value.map((item) => {
    //   goodList.push({
    //     departmentStock: item.stockCount,
    //     goodsCatagory: item.goodsCatgName,
    //     goodsName: item.goodsName,
    //     goodsQuantity: '',
    //     goodsUnit: item.goodsUnit,
    //     skuNo: item.skuNo,
    //     totalAmount: '',
    //     weightCost: item.purAmount
    //   })
    // })
    this.setState({
      goodList: finalGoodList,
      selectedList: finalGoodList
    })
  }

  // 数量
  _changeCount = (e, record, index) => {
    let { goodList } = this.state
    goodList = goodList.map((item, key) => {
      if (index === key && !isNaN(e)) {
        item.totalAmount = (e * parseInt(item.weightCost)).toFixed(2)
        item.goodsQuantity = e
      }
      return item
    })
    this.setState({ goodList })
  }
  // 删除
  _delGoods = (skuNo) => {
    const { goodList, selectedList } = this.state
    this.setState({
      goodList: goodList.filter(item => item.skuNo !== skuNo),
      selectedList: selectedList.filter(item => item.skuNo !== skuNo)
    })
  }

  _handleParams = (params) => {
    return {
      ...params,
      skuNoList: params.skuNoList ? params.skuNoList.split(/\s+/g) : [],
    }
  }

  // 添加货物
  _handleAddClick = () => {
    const { goodscatgListData, dispatch } = this.props

    const arg = this.props.form.getFieldsValue()

    if (arg.warehouseNo === undefined) {
      message.warn('请先选择一个调出部门！')
      return
    }
    this.setState({ warehouseNo: arg.warehouseNo })
    dispatch(actions.getGoodsTypeList({
      codeKeys: ['goodsType']
    }))
    showModalSelectForm({
      modalParam: {
        title: '添加货物',
        style: { minWidth: '80%' },
      },
      beforeSearch: this._handleParams,
      listFieldName: 'data',
      fetch: fetchData, // 后台请求方法
      url: apis.order.getStockGoods, // 数据请求地址
      disabledSelectedList: true,
      filter: [ // 筛选条件，参考 ModalForm 的入参
        {
          id: 'skuNoList',
          props: {
            label: 'SKU 编码'
          },
          element: (
            <TextArea
              placeholder='请输入货物编码'
              maxLength={500}
            />
          )
        }, {
          id: 'goodsName',
          props: {
            label: '货物名称'
          }
        }, {
          id: 'goodsCatgNo',
          props: {
            label: '所属分类'
          },
          element: (
            <TreeSelect
              style={{ width: 180 }}
              showSearch={false}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder='请选择所属分类'
              allowClear
              treeDefaultExpandAll
              // getPopupContainer={() => document.getElementById('goodsCatgNo')}
            >
              {
                goodscatgListData && goodscatgListData.map(item => {
                  if (item.childGoodsCatgList && !isEmpty(item.childGoodsCatgList)) {
                    return (
                      <TreeNode
                        value={item.goodsCatgNo}
                        disabled='true'
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
                        disabled='true'
                        title={item.goodsCatgName}
                        key={item.goodsCatgNo}
                      />
                    )
                  }
                })
              }
            </TreeSelect>
          )
        }
      ],
      extraParams: { warehouseNo: arg.warehouseNo, expectSkuNoList: this.state.selectedList ? this.state.selectedList.map(item => item.skuNo) : [] }, // 额外的请求参数
      // initDataSource: PropTypes.array,                                 // 外部数据源与onlySelectFlag配合使用
      // onlySelectFlag: PropTypes.bool,                                  // onlySelectFlag 则仅仅可以选择不做查询翻页等功能
      // showSelectedTagFlag: true,                             // 是否显示选中标签
      // selectedList: this.state.selectedList,                                   // 选中回显集合
      selectedTagFieldName: 'goodsName', // 选中标签展示所需字段
      selectType: 'checkbox', // 选择框类型 radio/checkbox
      instantSelected: false, // 选中后立即返回，还是附加确定按钮
      columns: [ // 表格列的配置描述
        genPlanColumn('skuNo', 'SKU 编码'),
        genPlanColumn('goodsName', '货物名称'),
        genPlanColumn('goodsCatgName', '所属分类'),
        genPlanColumn('goodsTypeName', '货物类型'),
        genPlanColumn('goodsUnit', '库存单位'),
        genSelectColumn('status', '库存状态', StockStatus),
        genPlanColumn('stockCount', '当前库存'),
        genPlanColumn('availStockCount', '可用库存'),
      ],
      rowKey: 'skuNo', // 主键

      onSelect: this._handleSelectGoods, // 选择时的回调
      // onCancel: PropTypes.func,                                        // 关闭弹层方法
    })
  }

  // 货物展示表格项
  _columns = [
    {
      title: '序号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text, record, index) => <span>{ index + 1 }</span>
    },
    {
      title: 'SKU编码',
      dataIndex: 'skuNo',
      key: 'skuNo'
    },
    {
      title: '货物名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
    },
    {
      title: '所属分类',
      dataIndex: 'goodsCatagory',
      key: 'goodsCatagory',
      render: (text, record) => {
        return (
          <span>{text || record.goodsCatgName}</span>
        )
      }
    },
    {
      title: '库存单位',
      dataIndex: 'goodsUnit',
      key: 'goodsUnit'
    },
    {
      title: '加权成本（元）',
      dataIndex: 'weightCost',
      key: 'weightCost',
    },
    {
      title: '调拨数量',
      dataIndex: 'goodsQuantity',
      key: 'goodsQuantity',
      render: (text, record, index) => {
        return (
          <InputNumber
            onChange={(e) => {
              this._changeCount(e, record, index)
            }}
            value={text}
            placeholder='请输入数量'
            min={0}
            step={0.1}
            precision={3}
          />
        )
      }
    },
    {
      title: '合计金额（元）',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
    },
    {
      title: '调出部门库存',
      dataIndex: 'departmentStock',
      key: 'departmentStock',
      render: (text, record) => {
        return (
          <span>{text || record.stockCount}</span>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'handle',
      key: 'handle',
      render: (text, record, index) => {
        return (
          <a
            onClick={() => { this._delGoods(record.skuNo) }}
            href='javascript:;'
          >
            删除
          </a>
        )
      }
    }
  ]

  // 保存
  _saveOrder = (orderStatus) => {
    const { goodList, allocationOrderId } = this.state
    const { dispatch, allocateOrderDetail } = this.props
    let allocationGoods = []
    goodList && goodList.map(item => {
      allocationGoods.push({
        skuNo: item.skuNo,
        goodsQuantity: item.goodsQuantity,
        totalAmount: item.totalAmount,
      })
    })
    if (allocationGoods.length === 0) {
      message.error('请添加货物！')
      return
    }
    const isPass = allocationGoods.some(item => {
      return !(item.goodsQuantity > 0 && !isEmpty(item.goodsQuantity))
    })
    if (isPass) {
      message.error('调拨数量需大于0')
      return
    }
    dispatch(actions.allocationModify({
      outDepartmentNo: allocateOrderDetail.outDepartmentNo,
      allocationOrderId: allocationOrderId,
      allocationGoods: allocationGoods,
      orderStatus: orderStatus + ''
    }))
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { allocationOrderId, goodList } = this.state
    const { orgLevel, orgList, orgCode, getStockList, orgName, allocateOrderDetail } = this.props
    return (
      <div>
        <Form
          id='filter-form'
        >
          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='订单编码'
              >
                {getFieldDecorator('allocationOrderId', {
                  initialValue: allocationOrderId
                })(
                  <Input
                    disabled={true}
                  />
                )}
              </FormItem>
            </Col>
            <Col
              span={8}
              id='warehouseNo'
            >
              <FormItem
                {...formItemLayout}
                label='调出部门'
              >
                {getFieldDecorator('warehouseNo', {
                  rules: [{
                    required: true,
                  }],
                  initialValue: allocateOrderDetail.outDepartmentNo
                })(
                  <Select
                    disabled={true}
                    allowClear
                    showSearch={false}
                    optionFilterProp='children'
                    placeholder='请选择调出部门'
                    getPopupContainer={() => document.getElementById('warehouseNo')}
                  >
                    {
                      getStockList && getStockList.map((item) => {
                        return (
                          <Option
                            key={item.orgCode}
                            value={item.orgCode}
                          >
                            {item.orgName}
                          </Option>
                        )
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col
              span={8}
              id='shopName'
            >
              <FormItem
                {...formItemLayout}
                label='申请部门'
              >
                {getFieldDecorator('shopName', {
                  initialValue: allocateOrderDetail.applyDepartmentNo
                })(
                  <Select
                    disabled={orgLevel === '2' ? Boolean(1) : Boolean(0)}
                    placeholder='请选择申请部门'
                    getPopupContainer={() => document.getElementById('shopName')}
                  >
                    {
                      orgLevel && orgLevel === '2' ? (<Option value={orgCode} key={orgCode}>{orgName}</Option>) : (
                        orgList && orgList.map(item => {
                          return (
                            <Option key={item.orgCode} value={item.orgCode}>{item.orgName}</Option>
                          )
                        }))
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col
              span={8}
              offset={16}
            >
              <Button
                className={styles['backBtn']}
                type='primary'
                onClick={() => history.go(-1)}
              >
                返回
              </Button>
              <Button
                className={styles['backBtn']}
                type='primary'
                onClick={() => { this._saveOrder(2) }}
              >
                提交
              </Button>
              <Button
                className={styles['backBtn']}
                type='primary'
                onClick={() => { this._saveOrder(1) }}
              >
                保存
              </Button>
              <Button
                className={styles['backBtn']}
                type='primary'
                onClick={this._handleAddClick}
              >
                添加货物
              </Button>
            </Col>
          </Row>
        </Form>
        <Card title='货物信息'>
          <Table
            columns={this._columns}
            rowKey='skuNo'
            pagination={false}
            locale={{
              emptyText: '暂无数据'
            }}
            dataSource={goodList}
          />
        </Card>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    wareHouseList: state.supplyChain.supplyOrder.wareHouseList,
    goodsTypeList: state.supplyChain.reportCost.goodsTypeList,
    orgLevel: state.common.orgLevel,
    orgList: state.common.orgList,
    orgCode: state.common.orgCode,
    orgName: state.common.orgName,
    getStockList: state.supplyChain.commonSupply.stockOrgList,
    allocateOrderDetail: state.supplyChain.supplyOrder.allocateOrderDetail,
    goodscatgListData: state.supplyChain.commonSupply.goodscatgListData,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AddAllocate))

