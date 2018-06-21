import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
// import { Link } from 'react-router-dom'
import { Button, Table, Form, Row, Col, Input, InputNumber, message, Modal } from 'antd'

import styles from '../styles.less'
import { genPagination } from 'Utils/helper'
import { getUrlParam } from 'Utils/params'
import Module from './module'
import { RETAIL_STOCK_LOSS_OVERFLOW } from 'Global/urls'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

class StockInventoryRecord extends Component {
  // 生命周期， 初始化表格数据
  componentDidMount() {
    this._init()
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(Module.actions.resetInventoryRecord())
  }

  getColumns = (page) => {
    // 列表header信息
    return [
      {
        key: 'id',
        title: '序号',
        width: 80,
        fixed: 'left',
        render: (text, record, index) => {
          return page.pageSize * (page.pageNo - 1) + (index + 1)
        }
      },
      {
        key: 'goodsNo',
        title: '商品编码',
        dataIndex: 'goodsNo',
        width: 150,
        fixed: 'left'
      },
      {
        key: 'skuNo',
        title: 'SKU编码',
        dataIndex: 'skuNo',
        width: 150,
        fixed: 'left'
      },
      {
        key: 'goodsName',
        title: '商品名称',
        dataIndex: 'goodsName'
      },
      {
        key: 'specName',
        title: '规格',
        dataIndex: 'specName'
      },
      {
        key: 'retailCatgName',
        title: '前台分类',
        dataIndex: 'retailCatgName'
      },
      {
        key: 'goodsCatgName',
        title: '前台分类',
        dataIndex: 'goodsCatgName'
      },
      {
        key: 'goodsTypeName',
        title: '系统分类',
        dataIndex: 'goodsTypeName'
      },
      {
        key: 'goodsUnit',
        title: '库存单位',
        dataIndex: 'goodsUnit'
      },
      {
        key: 'salePrice',
        title: '门店零售价',
        dataIndex: 'salePrice'
      },
      {
        key: 'relShelfCount',
        title: '实际在架库存',
        dataIndex: 'relShelfCount',
        width: 160,
        fixed: 'right',
        render: (text, record, index) => {
          const objReg = /(^[0-9]{1,9}$)/
          text = objReg.test(text) ? text : ''
          return (
            <InputNumber
              style={{ width: '150px' }}
              placeholder='请输入实际在架库存'
              maxLength='9'
              min={0}
              value={text}
              onChange={(value) => this._setRecordData(value, index)}
            />
          )
        }
      }
    ]
  }

  _init() {
    setTimeout(this._getInventoryRecordList, 100)
  }

  // 获取列表数据查询参数
  _getQueryParam(current = Module.state.inventoryDetailPage.current, pageSize = Module.state.inventoryDetailPage.pageSize) {
    const { form } = this.props
    const arg = form.getFieldsValue()
    if (arg) {
      const reg = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
      console.log(reg)
      arg['countsUuid'] = getUrlParam('countsUuid')
    }
    return {
      ...arg,
      currentPage: current,
      pageSize: pageSize,
    }
  }
  // 设置列表数据查询参数
  _setQueryParam = (queryParam) => {
    const { dispatch } = this.props
    dispatch(Module.actions.setRecordQueryParam(queryParam))
  }

  /**
   * 库存盘点录入列表
   */
  _getInventoryRecordList = (current, pageSize) => {
    const { dispatch } = this.props
    let queryParam = this._getQueryParam(current, pageSize)
    dispatch(Module.actions.getInventoryRecordList(queryParam))

    this._setQueryParam(queryParam)
  }

  _handlePageChange = (page) => {
    if (this.props.inventoryRecordPage.pageSize === page.pageSize) {
      this._getInventoryRecordList(page.current, page.pageSize)
    } else {
      this._getInventoryRecordList(1, page.pageSize)
    }
  }

  /**
   * 设置数据
   */
  _setRecordData = (record, index) => {
    const { dispatch, inventoryRecordList } = this.props
    const inventoryRecordListCopy = JSON.parse(JSON.stringify(inventoryRecordList))
    inventoryRecordListCopy[index]['relShelfCount'] = record
    dispatch(Module.actions.setInventoryRecordList(inventoryRecordListCopy))
  }

  /**
   * 获取保存数据
   * @private
   */
  _getSaveRecordData = () => {
    const { inventoryRecordList } = this.props
    let saveData = []
    const objReg = /(^[0-9]{1,9}$)/
    inventoryRecordList.forEach((record) => {
      if (objReg.test(record.relShelfCount)) {
        saveData.push({
          skuNo: record.skuNo,
          relShelfCount: record.relShelfCount
        })
      }
    })
    return saveData
  }
  /**
   * 保存盘点
   * @private
   */
  _saveInventory = () => {
    let saveData = this._getSaveRecordData()
    if (saveData.length > 0) {
      const { dispatch } = this.props
      dispatch(Module.actions.saveInventoryData({
        data: saveData,
        countsUuid: getUrlParam('countsUuid')
      }))
    } else {
      message.error('请先录入商品实际库存')
    }
  }

  /**
   * 执行查询
   */
  _handleQuery = () => {
    this._getInventoryRecordList(1, this.props.inventoryRecordPage.pageSize)
  }

  /**
   * 检查完成盘点
   * @private
   */
  _checkInventory = () => {
    let saveData = this._getSaveRecordData()
    const { dispatch } = this.props
    dispatch(Module.actions.checkInventoryData({
      data: saveData,
      countsUuid: getUrlParam('countsUuid')
    })).then(res => {
      if (res) {
        if (res.code === 0) {
          this._finishInventory()
        } else {
          Modal.confirm({
            title: '盘点完成',
            content: '您有部分商品未完成盘点，是否继续完成盘点操作？',
            onOk: () => {
              this._finishInventory(saveData)
            }
          })
        }
      }
    })
  }

  /**
   * 完成盘点
   * @private
   */
  _finishInventory = () => {
    const { dispatch, history } = this.props
    dispatch(Module.actions.finishInventoryData({
      countsUuid: getUrlParam('countsUuid')
    })).then(status => {
      if (status) {
        history.push({
          pathname: `${RETAIL_STOCK_LOSS_OVERFLOW}`
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { history, showListSpin, inventoryRecordQueryParam, inventoryRecordList, inventoryRecordIn, inventoryRecordPage, auths, match } = this.props
    const pagination = genPagination(inventoryRecordPage)
    const btnRole = auths[match.path] ? auths[match.path] : []
    console.log(btnRole)
    return (
      <div>
        <Form
          className={styles['parameter-wrap']}
        >
          <Row id='rowArea'>
            <Col span={6}>
              <FormItem
                label='库存单位'
                {...formItemLayout}
              >
                {inventoryRecordIn['shelfName']}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label='创建人'
                {...formItemLayout}
              >
                {inventoryRecordIn['createUser']}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label='创建时间'
                {...formItemLayout}
              >
                {inventoryRecordIn['createTime']}
              </FormItem>
            </Col>
            <Col span={4}>
              <Button
                type='cancel'
                title='取消'
                onClick={() => history.go(-1)}
                style={{ left: '20px' }}
              >
                取消
              </Button>
            </Col>
          </Row>
        </Form>
        <Form
          id='filter-form'
          className={styles['parameter-wrap']}
        >
          <Row id='rowArea'>
            <Col span={6}>
              <FormItem
                label='商品编码：'
                {...formItemLayout}
              >
                {getFieldDecorator('goodsNo', {
                  initialValue: inventoryRecordQueryParam.goodsNo
                })(
                  <Input
                    placeholder='请输入商品编码'
                    maxLength='50'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label='SKU编码：'
                {...formItemLayout}
              >
                {getFieldDecorator('skuNo', {
                  initialValue: inventoryRecordQueryParam.skuNo
                })(
                  <Input
                    placeholder='请输入SKU编码'
                    maxLength='50'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label='商品名称：'
                {...formItemLayout}
              >
                {getFieldDecorator('goodsName', {
                  initialValue: inventoryRecordQueryParam.goodsName
                })(
                  <Input
                    placeholder='请输入商品名称'
                    maxLength='50'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem className={styles['operate-btn']}>
                <Button
                  className={styles['search-btn']}
                  type='primary'
                  title='点击查询'
                  onClick={this._handleQuery}
                  style={{ left: '20px' }}
                >
                  查询
                </Button>
              </FormItem>
            </Col>
            <div className={styles['record-button-wrap']}>
              <Button
                type='primary'
                title='保存'
                onClick={this._saveInventory}
              >
                保存
              </Button>
              <Button
                type='primary'
                title='完成盘点'
                onClick={this._checkInventory}
                style={{ marginLeft: '10px' }}
              >
                完成盘点
              </Button>
            </div>
          </Row>
        </Form>
        <div className={styles['table-wrapper']}>
          <Table
            locale={{
              emptyText: '暂无数据'
            }}
            scroll={{ x: 1800 }}
            columns={this.getColumns(inventoryRecordPage)}
            rowKey='goodsNo'
            dataSource={inventoryRecordList}
            bordered
            loading={showListSpin}
            onChange={this._handlePageChange}
            pagination={pagination}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state['common.showListSpin'],
    auths: state['common.auths'],
    ...state['retail.stock.inventory'],
    ...state['retail.stock'],
    ...state['retail']
  }
}
export default connect(['common.showListSpin', 'common.auths', 'retail', 'retail.stock', 'retail.stock.inventory'], mapStateToProps)(Form.create()(StockInventoryRecord))
