import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Divider, InputNumber, Icon, TreeSelect, message } from 'antd'
import styles from './threshold.less'

import { isEmpty } from 'Utils/lang'
import { genPlanColumn, genPagination, genEllipsisColumn } from 'Utils/helper'
import Filter from 'Components/Filter'
// import Ellipsis from 'Components/Ellipsis'

import { queryOrgByLevel } from 'Global/action'
import {
  getThresholdList, getThresholdDefault, updateThreshold, setDefaultThreshold, updateThresholdDefault
} from '../reduck'
import { ThresholdTypes } from '../dict'
import { codeList, goodscatgList } from '../../../reduck'

const TreeNode = TreeSelect.TreeNode

class StockThreshold extends Component {
  constructor(props) {
    super(props)
    // initial state
    this.state = {
      dataSource: [],
      info: {},
      defaultEditable: false,
    }
  }

  getThresholdListReq = (orgCode) => {
    const { dispatch, orgLevel } = this.props
    dispatch(getThresholdList({ pageSize: 10, currentPage: 1, warehouseNo: orgLevel === '2' ? orgCode : '' }))
    orgLevel === '2' && dispatch(getThresholdDefault({ warehouseNo: orgCode }))
  }

  componentWillMount() {
    const { dispatch, orgLevel, goodsType, orgCode } = this.props

    isEmpty(goodsType) && dispatch(codeList({ codeKeys: ['goodsType'] }))
    dispatch(goodscatgList({ parentNo: '', status: '1' }))

    if (orgLevel === '') {
      dispatch(queryOrgByLevel()).then(res => {
        res && this.getThresholdListReq(res.myOrgCode)
      })
    } else {
      this.getThresholdListReq(orgCode)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.list !== nextProps.list) {
      this.setState({
        dataSource: nextProps.list
      })
    }
    if (!isEmpty(nextProps.info) && this.props.info !== nextProps.info) {
      this.setState({
        info: nextProps.info
      })
    }
  }

  _cacheOriginData = {} // 缓存待编辑数据

  _getRowByKey(key, newData) {
    return (newData || this.state.dataSource).filter(item => item.stockNo === key)[0]
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

  _handleReset = (e, { stockNo }) => {
    e.preventDefault()
    const { filter, dispatch } = this.props
    dispatch(setDefaultThreshold({ stockNo })).then(res => {
      res && dispatch(getThresholdList({ ...filter }))
    })
  }

  _handleSave = record => {
    const { filter, dispatch } = this.props
    const { stockNo, thresholdDown, thresholdUp, standardStock } = record
    dispatch(updateThreshold({ stockNo, thresholdDown, thresholdUp, standardStock })).then(res => {
      if (res) {
        const newData = [...this.state.dataSource]
        const target = this._getRowByKey(record.stockNo, newData)
        if (target) {
          delete target.editable
          this.setState({ dataSource: newData })
          delete this._cacheOriginData[record.stockNo]
        }
        dispatch(getThresholdList({ ...filter }))
      }
    })
  }

  _handleCancel = key => {
    const newData = [...this.state.dataSource]
    const target = this._getRowByKey(key, newData)
    if (target) {
      if (this._cacheOriginData[key]) {
        Object.assign(target, this._cacheOriginData[key])
        delete this._cacheOriginData[key]
      }
      delete target.editable
      this.setState({ dataSource: newData })
    }
  }

  _handleCellChange = (value, key, column) => {
    const newData = [...this.state.dataSource]
    let target = newData.filter(item => key === item.stockNo)[0]
    if (target) {
      target[column] = value
      this.setState({ dataSource: newData })
    }
  }

  _columns = [
    genEllipsisColumn('skuNo', 'SKU 编码', 13),
    genEllipsisColumn('goodsName', 'SKU 名称', 10),
    genPlanColumn('goodsCatgName', '所属分类'),
    genPlanColumn('goodsType', '货物类型'),
    genPlanColumn('goodsUnit', '库存单位'),
    genPlanColumn('warehouseName', '仓库部门'),
    // genPlanColumn('thresholdType', '预警类型'),
    {
      key: 'thresholdDown',
      title: '下限库存',
      dataIndex: 'thresholdDown',
      render: (text, record) => {
        return !record.editable ? text : (
          <InputNumber
            min={0}
            // max={record.thresholdUp}
            precision={3}
            max={99999999999.999}
            value={text}
            onChange={value => this._handleCellChange(value, record.stockNo, 'thresholdDown')}
          />
        )
      }
    }, {
      key: 'thresholdUp',
      title: '上限库存',
      dataIndex: 'thresholdUp',
      render: (text, record) => {
        return !record.editable ? text : (
          <InputNumber
            min={0}
            precision={3}
            max={99999999999.999}
            value={text}
            onChange={value => this._handleCellChange(value, record.stockNo, 'thresholdUp')}
          />
        )
      }
    }, {
      key: 'standardStock',
      title: '标准库存',
      dataIndex: 'standardStock',
      render: (text, record) => {
        return !record.editable ? text : (
          <InputNumber
            min={0}
            precision={3}
            max={99999999999.999}
            value={text}
            onChange={value => this._handleCellChange(value, record.stockNo, 'standardStock')}
          />
        )
      }
    },
  ]
  _columnOperation = {
    key: 'operation',
    title: '操作',
    width: 100,
    render: (text, record) => {
      const { editable, thresholdType } = record
      if (editable) {
        return (
          <span>
            <a onClick={() => this._handleSave(record)}>保存</a>
            <Divider type='vertical' />
            <a onClick={() => this._handleCancel(record.stockNo)}>取消</a>
          </span>
        )
      }
      if (thresholdType === ThresholdTypes[0].value) {
        return (
          <a onClick={e => this._toggleEditable(e, record.stockNo)}>自定义</a>
        )
      }
      return (
        <span>
          <a onClick={e => this._handleReset(e, record)}>使用默认</a>
          <Divider type='vertical' />
          <a onClick={e => this._toggleEditable(e, record.stockNo)}>修改</a>
        </span>
      )
    }
  }

  _handleSearch = searchData => {
    const { filter } = this.props
    const finalFilter = Object.assign({}, filter, searchData, { currentPage: 1 })
    this.props.dispatch(getThresholdList(finalFilter))
  }

  _handleChange = (pagination, filters, sorter) => {
    // console.log('params', pagination, filters, sorter)
    const { filter, dispatch, page } = this.props
    const { current, pageSize } = pagination
    const finalFilter = { ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize }
    dispatch(getThresholdList(finalFilter))
  }

  _genFilterFields = () => {
    const { filter, orgCode, orgName, orgLevel, orgList, goodsType, goodscatgListData } = this.props
    const fields = [
      {
        key: 'skuNo',
        label: 'SKU 编码',
        initialValue: filter.skuNo,
        type: 'Input',
      }, {
        key: 'goodsName',
        label: 'SKU 名称',
        initialValue: filter.goodsName,
        type: 'Input',
      }, {
        key: 'goodsCatgNo',
        label: '所属分类',
        initialValue: filter.goodsCatgNo,
        element: (
          <TreeSelect
            style={{ width: 180 }}
            // showSearch
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder='请选择所属分类'
            allowClear
            treeDefaultExpandAll
            getPopupContainer={() => document.getElementById('listFilter')}
          >
            {
              goodscatgListData && goodscatgListData.map(item => {
                if (item.childGoodsCatgList && !isEmpty(item.childGoodsCatgList)) {
                  return (
                    <TreeNode
                      value={item.goodsCatgNo}
                      disabled={true}
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
      }, {
        key: 'goodsType',
        label: '货物类型',
        initialValue: filter.goodsType || '',
        type: 'Select',
        content: goodsType
      }
    ]

    if (orgLevel === '2') { // 二级机构
      fields.push({
        key: 'warehouseNo',
        label: '仓库部门',
        initialValue: orgCode,
        disabled: true,
        type: 'Select',
        content: [{ value: orgCode, name: orgName }]
      })
    } else if (orgLevel !== '') { // 一级机构或总部
      fields.push({
        key: 'warehouseNo',
        label: '仓库部门',
        initialValue: filter.warehouseNo,
        type: 'Select',
        content: orgList && orgList.map(({ orgCode, orgName }) => ({ value: orgCode, name: orgName })) || []
      })
    }
    return fields
  }

  _handleDefaultChange = (value, key) => {
    this.setState(prevState => ({
      info: {
        ...prevState.info,
        [key]: value
      }
    }))
  }

  _handleIconClick = () => {
    const { defaultEditable, info } = this.state
    const { dispatch, filter } = this.props
    if (defaultEditable) {
      if (!info.defaultThresholdDown || !info.defaultThresholdUp) {
        message.error('请设置默认预警值后再保存！')
        return
      }
      dispatch(updateThresholdDefault({ ...info })).then(res => {
        res && dispatch(getThresholdList({ ...filter }))
      })
    }
    this.setState({
      defaultEditable: !defaultEditable
    })
  }

  _renderDefault = () => {
    const { info, defaultEditable } = this.state
    const { orgLevel } = this.props
    if (orgLevel !== '2') {
      return null
    }
    return (
      <div className={styles.default}>
        <span>默认预警： </span>
        <span>
          <span className='margin-right'>下限</span>
          {
            defaultEditable
              ? (
                <InputNumber
                  min={0}
                  precision={3}
                  max={99999999999.999}
                  value={info.defaultThresholdDown}
                  onChange={value => this._handleDefaultChange(value, 'defaultThresholdDown')}
                />
              ) : (
                <span className={styles.default_number}>{info.defaultThresholdDown}</span>
              )
          }
        </span>
        <Divider type='vertical' />
        <span>
          <span className='margin-right'>上限</span>
          {
            defaultEditable
              ? (
                <InputNumber
                  min={0}
                  precision={3}
                  max={99999999999.999}
                  value={info.defaultThresholdUp}
                  onChange={value => this._handleDefaultChange(value, 'defaultThresholdUp')}
                />
              ) : (
                <span className={styles.default_number}>{info.defaultThresholdUp}</span>
              )
          }
        </span>
        <Divider type='vertical' />
        <span>
          <span className='margin-right'>标准</span>
          {
            defaultEditable
              ? (
                <InputNumber
                  min={0}
                  precision={3}
                  max={99999999999.999}
                  value={info.defaultStandardStock}
                  onChange={value => this._handleDefaultChange(value, 'defaultStandardStock')}
                />
              ) : (
                <span className={styles.default_number}>{info.defaultStandardStock}</span>
              )
          }
        </span>
        {orgLevel === '2' && (
          <Icon type={defaultEditable ? 'check' : 'edit'} onClick={this._handleIconClick} />
        )}
      </div>
    )
  }

  render() {
    const { showListSpin, filter, page, orgLevel } = this.props
    let finalColumns = [{
      key: 'index',
      title: '序号',
      render: (text, record, index) => page.pageSize * page.pageNo + (index + 1) - page.pageSize
    }].concat(this._columns)
    const fields = this._genFilterFields(filter)
    const pagination = genPagination(page)

    return (
      <div
        className={styles.threshold}
      >
        <Filter
          fields={fields}
          onSearch={this._handleSearch}
        />
        <Table
          // style={{ width: '100%' }}
          pagination={pagination}
          columns={finalColumns.concat(orgLevel === '2' ? [this._columnOperation] : [])}
          onChange={this._handleChange}
          rowKey='stockNo'
          dataSource={this.state.dataSource}
          loading={showListSpin}
          title={this._renderDefault}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state.common.showListSpin,
    orgId: state.common.orgId,
    orgCode: state.common.orgCode,
    orgName: state.common.orgName,
    orgLevel: state.common.orgLevel,
    orgList: state.common.orgList,
    goodsType: state.supplyChain.commonSupply.goodsType,
    goodscatgListData: state.supplyChain.commonSupply.goodscatgListData,

    list: state.supplyChain.depotStock.thresholdList,
    filter: state.supplyChain.depotStock.thresholdFilter,
    page: state.supplyChain.depotStock.thresholdPage,
    info: state.supplyChain.depotStock.threshold
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(StockThreshold)
