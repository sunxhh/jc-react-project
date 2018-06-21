import React, { Component } from 'react'
import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'
import { Table, Button, InputNumber, TreeSelect, message, Input } from 'antd'

import { showModalSelectForm } from 'Components/modal/ModalSelectForm'
import { isEmpty } from 'Utils/lang'
import * as urls from 'Global/urls'
import { genPlanColumn } from 'Utils/helper'
import { fetchSupplyChain as fetchData } from 'Utils/fetch'

import * as actions from './reduck'
import styles from './formula.less'
import apis from './apis'
import { PageTypes } from './dict'
import { goodscatgList } from '../../reduck'

// const { Option } = Select
const TreeNode = TreeSelect.TreeNode
const TextArea = Input.TextArea

class FormulaBound extends Component {
  constructor(props) {
    super(props)
    // initial state
    let pageType = PageTypes.INFO
    const path = props.match.path
    if (path.indexOf(urls.SUPPLY_GOODS_FORMULA_BOUND) > -1) {
      pageType = PageTypes.BOUND
    } else if (path.indexOf(urls.SUPPLY_GOODS_FORMULA_EDIT) > -1) {
      pageType = PageTypes.EDIT
    } else if (path.indexOf(urls.SUPPLY_GOODS_FORMULA_INFO) > -1) {
      pageType = PageTypes.INFO
    }
    let skuNo = props.match.params.skuNo

    this.state = {
      pageType,
      dataSource: [],
      skuNo,
      currentGoods: {}
    }
  }
  // 设置 props 默认值
  static defaultProps = {
    list: [],
    page: {
      currentPage: 1,
      total: 0,
      pageSize: 10,
    }
  };

  componentWillMount() {
    const { dispatch, location } = this.props
    const { skuNo } = this.state
    const { pageType } = this.state
    let current = (location.state && location.state.current) || {}

    dispatch(goodscatgList({ parentNo: '', status: '1' }))
    this.setState({ currentGoods: current })
    switch (pageType) {
      case 'INFO' :
      case 'EDIT' :
      {
        dispatch(actions.getFormulaInfo({ skuNo: skuNo }))
        break
      }
      case 'BOUND' : {
        break
      }
      default: {
        dispatch(actions.getFormulaInfo({ skuNo: skuNo }))
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.info) && this.props.info !== nextProps.info) {
      let newValue = Object.values(nextProps.info)
      let localList = newValue && newValue.map((item) => {
        return { ...item, skuNo: item.boundSkuNo }
      })
      this.setState({
        dataSource: localList
      })
    }
  }

  _handleDelete = record => {
    const { dataSource } = this.state
    let newValue = dataSource.filter(item => item.boundSkuNo !== record.boundSkuNo)
    this.setState({ dataSource: newValue })
  }

  _handleCellChange = (value, key) => {
    const initData = [...this.state.dataSource]
    const newData = initData && initData.map((o) => {
      let item = o
      if (value < 0 || value === 0) {
        return false
      } else {
        if (key === o['boundSkuNo']) {
          item['skuGoodsNum'] = value
        }
        return item
      }
    })
    if (newData.findIndex((o) => !o) > -1) {
      message.error('数量必须大于零')
      return
    }
    this.setState({ dataSource: newData })
  }

  operateColumn = [
    {
      key: 'operation',
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => (
        <a onClick={() => this._handleDelete(record)}>删除</a>
      )
    }
  ]

  _columns = [
    { key: 'index', title: '序号', render: (text, record, index) => {
      return (
        <span>
          {
            index + 1
          }
        </span>
      )
    }
    },
    genPlanColumn('boundSkuNo', 'SKU 编码'),
    genPlanColumn('skuGoodsName', 'SKU名称'),
    genPlanColumn('goodsCatgName', '所属分类'),
    genPlanColumn('goodsTypeName', '货物类型'),
    genPlanColumn('goodsUnit', '库存单位'),
    {
      key: 'skuGoodsNum',
      title: '数量',
      dataIndex: 'skuGoodsNum',
      render: (text, record) => {
        if (this.state.pageType === 'INFO') {
          return (<span>{record.skuGoodsNum}</span>)
        } else {
          return (
            <InputNumber
              autoFocus
              min={0.001}
              max={999999.999}
              value={record.skuGoodsNum}
              precision={3}
              onChange={value => this._handleCellChange(value, record.boundSkuNo)}
            />)
        }
      }
    }
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
    const { dataSource } = this.state
    const skuNos = this.sort(selectedGoods)
    const finalSelectGoods = skuNos.map(good => {
      return {
        ...good,
        boundSkuNo: good.skuNo,
        skuGoodsNum: 1
      }
    }).concat(dataSource)
    this.setState({ dataSource: finalSelectGoods })
  }
  _handlerGoodsSearchBefore = params => {
    let newParams = params
    if (params.goodsNoList) {
      newParams = Object.assign({}, newParams, { goodsNoList: params.goodsNoList.split(/\s+/g) })
    } else {
      newParams = Object.assign({}, newParams, { goodsNoList: [] })
    }
    if (params.skuNoList) {
      newParams = Object.assign({}, newParams, { skuNoList: params.skuNoList.split(/\s+/g) })
    } else {
      newParams = Object.assign({}, newParams, { skuNoList: [] })
    }
    newParams = Object.assign({}, newParams, { useAt: 'PFHW' })
    return newParams
  }

  _handleSelect = () => {
    const { goodsCatgList, filter } = this.props
    showModalSelectForm({
      modalParam: {
        title: '添加货物',
        style: { minWidth: '80%' },
      },

      fetch: fetchData, // 后台请求方法
      url: apis.goods.formula.goodsSelect, // 数据请求地址
      listFieldName: 'data',
      disabledSelectedList: true,
      filter: [ // 筛选条件，参考 ModalForm 的入参
        {
          id: 'goodsNoList',
          props: {
            label: '货物编码'
          },
          element: (
            <TextArea
              placeholder='请输入货物编码'
              rows={2}
              maxLength='500'
            />
          )
        }, {
          id: 'skuNoList',
          props: {
            label: 'SKU 编码'
          },
          element: (
            <TextArea
              placeholder='请输入SKU 编码'
              rows={2}
              maxLength='500'
            />
          )
        }, {
          id: 'goodsName',
          props: {
            label: '货物名称'
          },
          element: (
            <Input placeholder='请输入货物名称' />
          )
        }, {
          id: 'goodsCatgNo',
          props: {
            label: '货物分类'
          },
          initialValue: filter.goodsCatgNo,
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
                goodsCatgList && goodsCatgList.map(item => {
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
        },
      ],
      extraParams: { expectSkuNoList: this.state.dataSource ? this.state.dataSource.map(item => item.skuNo) : [] }, // 额外的请求参数
      beforeSearch: this._handlerGoodsSearchBefore,
      onlySelectFlag: false, // onlySelectFlag 则仅仅可以选择不做查询翻页等功能
      // showSelectedTagFlag: true,                              // 是否显示选中标签
      // selectedList: this.state.dataSource || [],              // 选中回显集合
      selectedTagFieldName: 'skuGoodsName', // 选中标签展示所需字段
      selectType: 'checkbox', // 选择框类型 radio/checkbox
      instantSelected: false, // 选中后立即返回，还是附加确定按钮
      pagination: {
        showSizeChanger: false,
        showQuickJumper: false
      },
      showOrderFlag: true,

      columns: [
        genPlanColumn('goodsNo', '货物编码'),
        genPlanColumn('skuNo', 'SKU 编码'),
        genPlanColumn('goodsName', '货物名称'),
        genPlanColumn('skuSpecName', '规格'),
        genPlanColumn('goodsCatgName', '所属分类'),
        genPlanColumn('goodsTypeName', '货物类型'),
        genPlanColumn('goodsUnit', '库存单位'),
      ],
      rowKey: 'skuNo', // 主键
      onSelect: this._handleGoodsSelect, // 选择时的回调
      // onCancel: PropTypes.func,                                        // 关闭弹层方法
    })
  }

  _handleSave = () => {
    const { dispatch } = this.props
    const { dataSource, skuNo } = this.state
    let boundArray = dataSource && dataSource.map((item) => {
      if (item.boundSkuNo && !item.skuGoodsNum) {
        return false
      } else {
        return ({ boundSkuNo: item.boundSkuNo, skuGoodsNum: item.skuGoodsNum })
      }
    })
    if (boundArray.findIndex((o) => !o) > -1) {
      message.error('数量不可以为空')
      return
    }

    const finalValue = {
      skuNo: skuNo,
      boundSkuGoodsList: boundArray
    }
    dispatch(actions.boundFormula(finalValue)).then((res) => {
      res && dispatch(actions.getFormulaInfo({ skuNo: skuNo }))
    })
  }

  _handleCancel = () => {
    this.props.dispatch(goBack())
  }

  render() {
    const { dataSource, pageType, currentGoods } = this.state
    const { showButtonSpin } = this.props

    return (
      <div className={styles.inbound}>
        <div className={styles.filter}>
          <span>货物名称（规格）： {currentGoods && currentGoods.skuGoodsName} X 1 {currentGoods && currentGoods.goodsUnit}</span>
          {pageType === PageTypes.INFO ? (
            <Button type='primary' className='margin-left' onClick={this._handleCancel}>返回</Button>
          ) : (
            <span>
              <Button type='primary' className='margin-left' onClick={this._handleSelect}>添加货物</Button>
              <Button loading={showButtonSpin} type='primary' onClick={this._handleSave}>保存</Button>
              <Button type='primary' onClick={this._handleCancel}>取消</Button>
            </span>
          )}
        </div>
        <Table
          columns={pageType !== PageTypes.INFO ? this._columns.concat(this.operateColumn) : this._columns}
          rowKey='skuNo'
          dataSource={dataSource}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    goodsCatgList: state.purchase.commonPurc.goodscatgListData,
    info: state.purchase.goods.formula.info,
    list: state.purchase.goods.formula.formulaList,
    filter: state.purchase.goods.formula.formulaFilter,
    page: state.purchase.goods.formula.formulaPages,
    showButtonSpin: state.common.showButtonSpin
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(FormulaBound)
