import React, { Component } from 'react'
import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'
import { Table, Button, Select, InputNumber, message, TreeSelect, Input } from 'antd'
// import { Link } from 'react-router-dom'

import { isEmpty } from 'Utils/lang'
import * as urls from 'Global/urls'
import { getUrlParam } from 'Utils/params'
import { genPlanColumn, genSelectColumn, genPagination, unshiftIndexColumn, genEllipsisColumn } from 'Utils/helper'
import { fetchSupplyChain as fetchData } from 'Utils/fetch'
import { queryOrgByLevel } from 'Global/action'
import { createOutbound, getOutboundInfo, editOutbound } from '../reduck'
import styles from './operate.less'

import { showModalSelectForm } from 'Components/modal/ModalSelectForm'
import apis from '../../../apis'
import { PageTypes, StockStatus } from '../dict'
import { codeList, goodscatgList } from '../../../reduck'

const { Option } = Select
const TreeNode = TreeSelect.TreeNode
const TextArea = Input.TextArea

class StockOutbound extends Component {
  constructor(props) {
    super(props)
    // initial state
    let pageType = PageTypes.INFO
    if (props.match.path === urls.SUPPLY_STOCK_OPERATE_OUTBOUND_NEW) {
      pageType = PageTypes.NEW
    } else if (props.match.path === urls.SUPPLY_STOCK_OPERATE_OUTBOUND_EDIT) {
      pageType = PageTypes.EDIT
    }

    this.state = {
      pageType,
      billType: '',
      outinOrderNo: getUrlParam('id'),
      dataSource: [],
    }
  }

  componentWillMount() {
    const { dispatch, orgLevel, inOutBillType } = this.props
    orgLevel === '' && dispatch(queryOrgByLevel())
    dispatch(goodscatgList({ parentNo: '', status: '1' }))
    isEmpty(inOutBillType) ? dispatch(codeList({ codeKeys: ['inOutBillType'] })).then(res => {
      res && this.setState({ billType: res.inOutBillType[11].value })
    }) : this.setState({ billType: inOutBillType[11].value })
    this.state.pageType !== PageTypes.NEW && dispatch(getOutboundInfo({
      outinOrderNo: this.state.outinOrderNo,
      currentPage: 1,
      pageSize: this.state.pageType === PageTypes.INFO ? 10 : 10000
    }))
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.info) && this.props.info !== nextProps.info) {
      this.setState({
        dataSource: nextProps.info.result.data
      })
    }
  }

  _handleDelete = record => {
    this.setState(prevState => ({
      dataSource: prevState.dataSource.filter(item => item.skuNo !== record.skuNo)
    }))
  }

  _handleCellChange = (value, key, column) => {
    const newData = [...this.state.dataSource]
    let target = newData.filter(item => key === item.skuNo)[0]
    if (target && column === 'count') {
      target = Object.assign(target, {
        count: value,
        amount: (target.purAmount * (value || 0)).toFixed(2)
      })
      this.setState({ dataSource: newData })
    }
  }

  _columns = [
    genEllipsisColumn('skuNo', 'SKU 编码', 13),
    genEllipsisColumn('goodsName', 'SKU 名称', 30),
    genPlanColumn('goodsCatgName', '所属分类'),
    genPlanColumn('goodsUnit', '库存单位'),
    genPlanColumn('purAmount', '加权成本'),
    {
      key: 'count',
      title: '出库数量',
      dataIndex: 'count',
      render: (text, record) => {
        return this.state.pageType === PageTypes.INFO ? text : (
          <InputNumber
            min={0}
            precision={3}
            max={99999999999.999}
            value={text}
            onChange={value => this._handleCellChange(value, record.skuNo, 'count')}
          />
        )
      }
    },
    genPlanColumn('amount', '合计金额（元）'),
    genPlanColumn('stockCount', '当前库存'),
    {
      key: 'operation',
      title: '操作',
      render: (text, record) => {
        if (this.state.pageType !== PageTypes.INFO) {
          return (
            <span>
              <a onClick={() => this._handleDelete(record)}>删除</a>
            </span>
          )
        }
      }
    },
  ]

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

  _handleGoodsSelect = selectedGoods => {
    const skuNos = this.sort(selectedGoods)
    const finalSelectGoods = skuNos.map(good => {
      return {
        ...good,
        // purAmount: good.purAmount,
        count: 1,
        amount: good.purAmount
      }
    }).concat(this.state.dataSource)
    this.setState({ dataSource: finalSelectGoods })
  }

  _handleParams = (params) => {
    return {
      ...params,
      skuNoList: params.skuNoList ? params.skuNoList.split(/\s+/g) : [],
    }
  }

  _handleSelect = () => {
    const { goodscatgListData, orgCode } = this.props
    if (!orgCode || isEmpty(goodscatgListData)) {
      message.warn('用户机构信息获取失败，请稍后再试！')
      return
    }

    showModalSelectForm({
      modalParam: {
        title: '添加货物',
        style: { minWidth: '80%' },
      },
      beforeSearch: this._handleParams,
      listFieldName: 'data',
      fetch: fetchData, // 后台请求方法
      url: apis.depot.stock.goods, // 数据请求地址
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
            label: 'SKU 名称'
          }
        }, {
          id: 'goodsCatgNo',
          props: {
            label: '所属分类'
          },
          element: (
            <TreeSelect
              style={{ width: 180 }}
              showSearch
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder='请选择所属分类'
              allowClear
              treeNodeFilterProp='title'
              getPopupContainer={() => document.getElementById('modalRow')}
            >
              {
                goodscatgListData && goodscatgListData.map(item => {
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
      extraParams: { warehouseNo: this.props.orgCode, expectSkuNoList: this.state.dataSource ? this.state.dataSource.map(item => item.skuNo) : [] }, // 额外的请求参数
      // initDataSource: PropTypes.array,                                 // 外部数据源与onlySelectFlag配合使用
      // onlySelectFlag: PropTypes.bool,                                  // onlySelectFlag 则仅仅可以选择不做查询翻页等功能
      // showSelectedTagFlag: true,                             // 是否显示选中标签
      // selectedList: this.state.dataSource,                                   // 选中回显集合
      selectedTagFieldName: 'goodsName', // 选中标签展示所需字段
      selectType: 'checkbox', // 选择框类型 radio/checkbox
      instantSelected: false, // 选中后立即返回，还是附加确定按钮

      columns: [ // 表格列的配置描述
        genPlanColumn('skuNo', 'SKU 编码'),
        genPlanColumn('goodsName', 'SKU 名称'),
        genPlanColumn('goodsCatgName', '所属分类'),
        genPlanColumn('goodsTypeName', '货物类型'),
        genPlanColumn('goodsUnit', '库存单位'),
        genSelectColumn('status', '库存状态', StockStatus),
        genPlanColumn('stockCount', '当前库存'),
        genPlanColumn('availStockCount', '可用库存'),
      ],
      rowKey: 'skuNo', // 主键

      onSelect: this._handleGoodsSelect, // 选择时的回调
      // onCancel: PropTypes.func,                                        // 关闭弹层方法
    })
  }

  _handleSave = () => {
    const { dispatch, orgCode } = this.props
    const { outinOrderNo } = this.state
    if (!this.state.dataSource || isEmpty(this.state.dataSource)) {
      message.info('请先选择货物')
      return
    }
    const finalArg = {
      goodsInfo: this.state.dataSource.map(({ skuNo, purAmount, count, amount }) => ({
        skuNo,
        purAmount,
        count,
        amount,
      }))
    }
    if (outinOrderNo) {
      finalArg.outinOrderNo = outinOrderNo
      dispatch(editOutbound(finalArg))
    } else {
      finalArg.dataSource = this.state.billType
      finalArg.warehouseNo = orgCode
      dispatch(createOutbound(finalArg))
    }
  }

  _handleOrgChange = orgCode => {
    this.setState({ orgCode })
  }

  _renderInWarehouse = () => {
    const { orgLevel, orgName, orgList } = this.props
    return orgName

    // 当前页面仅允许二级机构访问，故一下逻辑暂时不生效
    // eslint-disable-next-line no-unreachable
    if (orgLevel === '2') { // 二级机构
      return orgName
    } else if (orgLevel !== '') { // 一级机构或总部
      return (
        <Select style={{ width: 150 }} onChange={this._handleOrgChange}>
          {
            orgList.map(item => (
              <Option
                key={item.id}
                value={item.id}
              >
                {item.orgName}
              </Option>
            ))
          }
        </Select>
      )
    }
  }

  _renderBillType = () => {
    const { pageType, billType } = this.state
    const { inOutBillType } = this.props
    if (pageType === PageTypes.NEW) {
      return (
        <Select
          style={{ width: 150 }}
          value={billType}
          onChange={value => this.setState({ billType: value })}
          getPopupContainer={() => document.getElementById('selectedArea')}
        >
          {
            inOutBillType.slice(11).map(item => (
              <Option
                key={item.value}
                value={item.value}
              >
                {item.name}
              </Option>
            ))
          }
        </Select>
      )
    }
    return this.props.info.dataSource
  }

  _handleOnChange = (pagination) => {
    const { dispatch, info } = this.props
    const { current, pageSize } = pagination
    dispatch(getOutboundInfo({ outinOrderNo: this.state.outinOrderNo, currentPage: info.result.pageSize !== pageSize ? 1 : current, pageSize: this.state.pageType === PageTypes.INFO ? pageSize : 10000 }))
  }

  render() {
    const { dataSource, pageType, outinOrderNo } = this.state
    const { orgName, info, showButtonSpin } = this.props

    return (
      <div className={styles.inbound}>
        <div className={styles.filter}>
          {pageType !== PageTypes.NEW && <span>单据编号： {outinOrderNo}</span>}
          <span id={'selectedArea'}>单据类型： {this._renderBillType()}</span>
          <span className='margin-left'>出库部门： {pageType === PageTypes.NEW ? orgName : info.warehouseName}</span>
          {pageType !== PageTypes.INFO && (
            <span>
              <Button type='primary' className='margin-left' onClick={this._handleSelect}>添加货物</Button>
              <Button
                type='primary'
                onClick={this._handleSave}
                loading={showButtonSpin}
              >保存
              </Button>
            </span>
          )}
          <Button type='primary' className='margin-left' onClick={() => this.props.dispatch(goBack())}>返回</Button>
        </div>
        <Table
          scroll={{ x: 1300 }}
          columns={unshiftIndexColumn(this._columns, info.result)}
          rowKey='skuNo'
          dataSource={dataSource}
          onChange={this._handleOnChange}
          pagination={pageType === PageTypes.NEW || pageType === PageTypes.EDIT ? false : genPagination(info.result)}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state.common.showListSpin,
    orgCode: state.common.orgCode,
    orgName: state.common.orgName,
    orgLevel: state.common.orgLevel,
    orgList: state.common.orgList,
    showButtonSpin: state.common.showButtonSpin,

    inOutBillType: state.supplyChain.commonSupply.inOutBillType,
    goodscatgListData: state.supplyChain.commonSupply.goodscatgListData,
    info: state.supplyChain.depotStock.outbound
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(StockOutbound)
