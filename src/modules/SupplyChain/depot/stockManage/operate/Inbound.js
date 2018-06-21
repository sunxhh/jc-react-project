import React, { Component } from 'react'
import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'
import { Table, Button, Select, InputNumber, message, Divider, TreeSelect, Input } from 'antd'
// import { Link } from 'react-router-dom'

import { isEmpty } from 'Utils/lang'
import * as urls from 'Global/urls'
import { getUrlParam } from 'Utils/params'
import { genPlanColumn, genSelectColumn, genPagination, unshiftIndexColumn, genEllipsisColumn } from 'Utils/helper'
import { fetchSupplyChain as fetchData } from 'Utils/fetch'
import { queryOrgByLevel } from 'Global/action'
import { createInbound, getInboundInfo, editInbound, getPrintIp, handleInboundPrint, handlePrint } from '../reduck'
import styles from './operate.less'

import ShelfLife from './ShelfLife'
import { showModalSelectForm } from 'Components/modal/ModalSelectForm'
import apis from '../../../apis'
import { PageTypes, StockStatus, InOutBillTypes } from '../dict'
import { goodscatgList } from '../../../reduck'
import parmasUtil from 'Utils/params'
import storage from 'Utils/storage'
import { supplyChainUrl } from '../../../../../config'

const { Option } = Select

const InboundBillTypes = InOutBillTypes[6]
const TreeNode = TreeSelect.TreeNode
const TextArea = Input.TextArea

function sliceArray(array, size) {
  let result = []
  for (let x = 0; x < Math.ceil(array.length / size); x++) {
    let start = x * size
    let end = start + size
    result.push(array.slice(start, end))
  }
  return result
}

class StockInbound extends Component {
  constructor(props) {
    super(props)
    // initial state
    let pageType = PageTypes.INFO
    if (props.match.path === urls.SUPPLY_STOCK_OPERATE_INBOUND_NEW) {
      pageType = PageTypes.NEW
    } else if (props.match.path === urls.SUPPLY_STOCK_OPERATE_INBOUND_EDIT) {
      pageType = PageTypes.EDIT
    }

    this.state = {
      pageType,
      outinOrderNo: getUrlParam('id'),
      dataSource: [],
      slVisible: false,
      slData: {
        readonly: false,
        skuNo: '',
        goodsName: '',
        count: 0,
        dataSource: [],
        pageType: ''
      }
    }
  }

  componentWillMount() {
    const { dispatch, orgLevel } = this.props
    orgLevel === '' && dispatch(queryOrgByLevel())
    dispatch(goodscatgList({ parentNo: '', status: '1' }))
    this.state.pageType !== PageTypes.NEW && dispatch(getInboundInfo({
      outinOrderNo: this.state.outinOrderNo,
      currentPage: 1,
      pageSize: this.state.pageType === PageTypes.INFO ? 10 : 10000
    }))
    dispatch(getPrintIp())
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.info) && this.props.info !== nextProps.info) {
      this.setState({
        dataSource: nextProps.info.result.data.map(item => {
          return { ...item, inboundCount: item.count }
        })
      })
    }
  }

  _handleDelete = record => {
    this.setState(prevState => ({
      dataSource: prevState.dataSource.filter(item => item.skuNo !== record.skuNo)
    }))
  }

  _handleShelfLife = (record, readonly = false) => {
    this.setState({
      slData: {
        readonly,
        skuNo: record.skuNo,
        goodsName: record.goodsName,
        count: record.count,
        dataSource: record.shelfLifes || [],
        shelfLife: record.shelfLife,
        pageType: this.state.pageType
      },
      slVisible: true,
    })
  }

  _handleCellChange = (value, key, column) => {
    const newData = [...this.state.dataSource]
    let target = newData.filter(item => key === item.skuNo)[0]
    if (target) {
      if (column === 'purAmount') {
        target = Object.assign(target, {
          purAmount: (value || 0),
          amount: (target.count || 0) * (value || 0)
        })
      } else if (column === 'count') {
        target = Object.assign(target, {
          count: (value || 0),
          amount: (target.purAmount || 0) * (value || 0)
        })
      } else if (column === 'amount') {
        target = Object.assign(target, {
          amount: (value || 0),
          purAmount: target.count ? (value || 0) / (target.count) : 0
        })
      }
      this.setState({ dataSource: newData })
    }
  }

  _columns = [
    genEllipsisColumn('skuNo', 'SKU 编码', 13),
    genEllipsisColumn('goodsName', 'SKU 名称', 30),
    genPlanColumn('goodsCatgName', '所属分类'),
    genPlanColumn('goodsUnit', '库存单位'),
    {
      key: 'purAmount',
      title: '采购价/成本（元）',
      dataIndex: 'purAmount',
      render: (text, record) => {
        return this.state.pageType === PageTypes.INFO ? text : (
          <InputNumber
            min={0}
            max={999999999999.99}
            precision={2}
            value={text}
            onChange={value => this._handleCellChange(value, record.skuNo, 'purAmount')}
          />
        )
      }
    }, {
      key: 'count',
      title: '入库数量',
      dataIndex: 'count',
      render: (text, record) => {
        const { info } = this.props
        return this.state.pageType === PageTypes.INFO ? text : (
          <InputNumber
            precision={3}
            max={info && info.dataSourceCode === InOutBillTypes[4].value ? record.inboundCount : 999999999999.99}
            min={0}
            value={text}
            onChange={value => this._handleCellChange(value, record.skuNo, 'count')}
          />
        )
      }
    }, {
      key: 'amount',
      title: '合计金额（元）',
      dataIndex: 'amount',
      render: (text, record) => {
        return this.state.pageType === PageTypes.INFO ? text : (
          <InputNumber
            min={0}
            precision={2}
            max={999999999999.99}
            value={text}
            onChange={value => this._handleCellChange(value, record.skuNo, 'amount')}
          />
        )
      }
    },
    genPlanColumn('warehouseAreaCode', '库位号'),
    {
      key: 'operation',
      title: '操作',
      render: (text, record) => {
        if (this.state.pageType === PageTypes.INFO) {
          return (
            <span>
              <a onClick={() => this._handleShelfLife(record, true)}>保质期详情</a>
            </span>
          )
        }
        return (
          <span>
            {(InOutBillTypes[6].name === this.props.info.dataSource || this.state.pageType === PageTypes.NEW) && (
              <span>
                <a onClick={() => this._handleDelete(record)}>删除</a>
                <Divider type='vertical' />
              </span>
            )}
            <a onClick={() => this._handleShelfLife(record)}>{isEmpty(record.shelfLifes) ? '保质期录入' : '保质期编辑'}</a>
          </span>
        )
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
              treeNodeFilterProp='title'
              allowClear
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
                        disabled={true}
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
      extraParams: { warehouseNo: orgCode, expectSkuNoList: this.state.dataSource ? this.state.dataSource.map(item => item.skuNo) : [] }, // 额外的请求参数
      // initDataSource: PropTypes.array,                                 // 外部数据源与onlySelectFlag配合使用
      // onlySelectFlag: PropTypes.bool,                                  // onlySelectFlag 则仅仅可以选择不做查询翻页等功能
      // showSelectedTagFlag: true,                             // 是否显示选中标签
      // selectedList: this.state.dataSource,                                   // 选中回显集合
      selectedTagFieldName: 'goodsName', // 选中标签展示所需字段
      selectType: 'checkbox', // 选择框类型 radio/checkbox
      instantSelected: false, // 选中后立即返回，还是附加确定按钮
      disabledSelectedList: true,
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
    const { dispatch, orgCode, info } = this.props
    const { outinOrderNo } = this.state
    if (!this.state.dataSource || isEmpty(this.state.dataSource)) {
      message.info('请先添加货物！')
      return
    }
    const finalArg = {
      goodsInfo: this.state.dataSource.map(({ skuNo, purAmount, count, amount, shelfLifes }) => ({
        skuNo,
        purAmount,
        count,
        amount,
        shelfLifes,
      }))
    }
    if (outinOrderNo) {
      finalArg.outinOrderNo = outinOrderNo
      finalArg.dataSource = info.dataSourceCode
      dispatch(editInbound(finalArg))
    } else {
      finalArg.dataSource = InboundBillTypes.value
      finalArg.warehouseNo = orgCode
      dispatch(createInbound(finalArg))
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

  _handleShelfLifeOk = (skuNo, data) => {
    const { dataSource } = this.state
    const finalDataSource = dataSource.map(item => ({
      ...item,
      shelfLifes: skuNo === item.skuNo ? data.map(({ count, productionDate, shelfLife }) => ({ count, productionDate, shelfLife })) : item.shelfLifes
    }))
    this.setState({ slVisible: false, dataSource: finalDataSource })
  }

  _handleOnChange = (pagination) => {
    const { dispatch, info } = this.props
    const { current, pageSize } = pagination
    dispatch(getInboundInfo({ outinOrderNo: this.state.outinOrderNo, currentPage: info.result.pageSize !== pageSize ? 1 : current, pageSize: this.state.pageType === PageTypes.INFO ? pageSize : 10000 }))
  }

  _handleExport = () => {
    const params = parmasUtil.json2url({ outinOrderNo: this.state.outinOrderNo })
    const ticket = storage.get('userInfo').ticket
    const url = (supplyChainUrl === '/') ? `http://${location.host}` : supplyChainUrl
    let href = `${url}/api/supplychain/stock/inboundInfo/export/v1?ticket=${ticket}&${params}`
    location.href = href
  }

  _handleInboundPrint = () => {
    const { dispatch, printIp } = this.props
    const { outinOrderNo } = this.state
    dispatch(handleInboundPrint({ outinOrderNo: outinOrderNo })).then(res => {
      if (res) {
        let list = sliceArray(res.list, 30)
        message.success('正在打印...', 2, () => {
          list && list.map((item, index) => {
            dispatch(handlePrint(`${printIp}api/printer/printTemplate`, { templateName: 'acceptanceOrders', templateParam: JSON.stringify(Object.assign({}, res, { list: item, pageNow: parseInt(index + 1), pageSize: list && list.length })) }))
          })
        })
      }
    })
  }

  render() {
    const { dataSource, slVisible, slData, pageType, outinOrderNo } = this.state
    const { orgName, info, showButtonSpin } = this.props

    let finalColums = [...this._columns]
    finalColums = unshiftIndexColumn(this._columns, info.result)
    if (pageType !== PageTypes.NEW) {
      finalColums.splice(6, 0, {
        key: 'rate',
        title: '税率（%）',
        dataIndex: 'rate'
      })
    }

    return (
      <div className={styles.inbound}>
        <div className={styles.filter}>
          {pageType !== PageTypes.NEW && <span>单据编号： {outinOrderNo}</span>}
          <span>单据类型： {pageType === PageTypes.NEW ? InboundBillTypes.name : info.dataSource}</span>
          <span className='margin-left'>入库部门： {pageType === PageTypes.NEW ? orgName : info.warehouseName}</span>
          {pageType === PageTypes.INFO && (
            <span className='margin-left'>总金额（元）： {dataSource ? parseFloat(parseFloat(dataSource.reduce((a, c) => (c.amount + a), 0)).toFixed(3)) : ''}</span>
          )}
          {pageType !== PageTypes.INFO && (
            <span>
              {(InOutBillTypes[6].name === info.dataSource || pageType === PageTypes.NEW) && (
                <Button type='primary' className='margin-left' onClick={this._handleSelect}>添加货物</Button>
              )}
              <Button
                type='primary'
                onClick={this._handleSave}
                loading={showButtonSpin}
              >保存
              </Button>
              {pageType !== PageTypes.NEW && (
                <Button
                  type='primary'
                  onClick={this._handleExport}
                >导出
                </Button>
              )}
            </span>
          )}
          <Button type='primary' className='margin-left' onClick={() => this.props.dispatch(goBack())}>返回</Button>
          {pageType === PageTypes.INFO && info.dataSource === '采购入库' && (
            <Button type='primary' className='margin-left' onClick={this._handleInboundPrint}>验收单打印</Button>
          )}
        </div>
        <Table
          scroll={{ x: 1600 }}
          // style={{ width: '100%' }}
          columns={finalColums}
          rowKey='skuNo'
          dataSource={dataSource}
          onChange={this._handleOnChange}
          pagination={pageType === PageTypes.NEW || pageType === PageTypes.EDIT ? false : genPagination(info.result)}
          // loading={showListSpin}
        />
        {
          slVisible &&
            <ShelfLife
              key={slData.skuNo}
              title={pageType === PageTypes.INFO ? '保质期详情' : '保质期录入'}
              visible={slVisible}
              {...slData}
              onOk={this._handleShelfLifeOk}
              onCancel={() => this.setState({ slVisible: false })}
            />
        }
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

    goodscatgListData: state.supplyChain.commonSupply.goodscatgListData,
    info: state.supplyChain.depotStock.inbound,
    printIp: state.supplyChain.depotStock.printIp,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(StockInbound)

