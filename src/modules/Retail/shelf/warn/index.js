import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
import { Button, Table, Form, Row, Col, InputNumber, Input, Select } from 'antd'
import Module from './module'
import { genPagination } from 'Utils/helper'
import { debounce } from 'Utils/function'
import styles from './style.less'
import RetailModule from '../../module'
import { isEmpty } from 'Utils/lang'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  },
}

class ShelfWarnList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      page: {
        currentPage: 1,
        pageSize: 20
      },
      dataSource: [],
    }
    this._handleModeChange = debounce(this._handleModeChange, 100)
  }

  // 生命周期， 初始化表格数据
  componentWillMount() {
    this._getList()
    this._getCategory()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.list !== nextProps.list) {
      this.setState({
        dataSource: nextProps.list && nextProps.list.map(item => ({
          ...item,
        }))
      })
    }
  }

  componentWillUnmount() {
    this.props.dispatch(Module.actions.emptyList())
  }

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getParameter(current, pageSize)
    dispatch(Module.actions.getShelfWarnList(arg))
    this._setQueryParam(arg)
  }

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.page.pageNo, pageSize = this.props.page.pageSize) => {
    const { form } = this.props
    const arg = form.getFieldsValue()
    return {
      ...arg,
      currentPage: current,
      pageSize: pageSize,
    }
  }

  _handleQuery = () => {
    this._getList(1)
  }

  _getCategory = () => {
    const { dispatch } = this.props
    dispatch(RetailModule.actions.getCategoryList())
    dispatch(RetailModule.actions.getGoodsTypeList())
  }

  // 点击分页获取列表数据
  _handlePageChange = (page) => {
    if (this.props.page.pageSize === page.pageSize) {
      this._getList(page.current)
    } else {
      this._getList(1, page.pageSize)
    }
  }

  // 设置列表数据查询参数
  _setQueryParam = (queryParam) => {
    const { dispatch } = this.props
    dispatch(Module.actions.setQueryParam(queryParam))
  }

  // 处理输入框变化
  _handleCellChange = (value, key, column) => {
    const finalDataSource = [...this.state.dataSource]
    let target = finalDataSource.filter(item => key === item.skuNo)[0]
    if (target) {
      target[column] = value
      this.setState({ dataSource: finalDataSource })
    }
  }

  // 保存
  _setOrder = () => {
    const { dispatch } = this.props
    const { dataSource } = this.state
    let warnReqs = []

    dataSource.forEach(key => {
      warnReqs.push({
        skuNo: key.skuNo,
        warnStockLimit: key.warnStockLimit,
        standardStockLimit: key.standardStockLimit,
      })
    })
    dispatch(Module.actions.saveWarns({ data: warnReqs })).then((res) => {
      if (res.status) {
        this._getList()
      }
    })
  }

  _handleModeChange = () => {
    this._getList()
  }

  _columns = [
    {
      key: 'index',
      title: '序号',
      dataIndex: 'index',
      width: 50,
      render: (text, record, index) => {
        const { pageSize, pageNo } = this.props.page
        if (!isEmpty(pageSize) && !isEmpty(pageNo)) {
          return (
            <span>{(pageNo - 1) * pageSize + index + 1}</span>
          )
        }
      }
    },
    {
      key: 'skuNo',
      title: 'SKU编码',
      dataIndex: 'skuNo',
      width: 100,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'goodsName',
      title: '商品名称',
      dataIndex: 'goodsName',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'retailCatgName',
      title: '前台分类',
      dataIndex: 'retailCatgName',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' ? text : '其他'}</span>
        )
      }
    },
    {
      key: 'goodsCatgName',
      title: '系统分类',
      dataIndex: 'goodsCatgName',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'goodsTypeName',
      title: '商品类型',
      dataIndex: 'goodsTypeName',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'goodsUnit',
      title: '库存单位',
      dataIndex: 'goodsUnit',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'warnStockLimit',
      title: '预警库存',
      width: 40,
      dataIndex: 'warnStockLimit',
      render: (text, record, index) => {
        return (
          <InputNumber
            min={1}
            value={text}
            precision={0}
            step={1}
            maxLength='9'
            onChange={value => this._handleCellChange(value, record.skuNo, 'warnStockLimit')}
          />
        )
      }
    },
    {
      key: 'standardStockLimit',
      title: '标准库存',
      width: 40,
      dataIndex: 'standardStockLimit',
      render: (text, record, index) => (
        <InputNumber
          min={1}
          value={text}
          precision={0}
          step={1}
          maxLength={9}
          onChange={value => this._handleCellChange(value, record.skuNo, 'standardStockLimit')}
        />
      )
    }
  ]

  render() {
    const { showListSpin, auths, page, match, shelfWarnQueryParam, categoryList, goodsTypeList } = this.props
    console.log(this.props)
    const { getFieldDecorator } = this.props.form
    const btnRole = auths[match.path] ? auths[match.path] : []
    const pagination = genPagination(page)
    return (
      <div>
        <Form
          className={styles['parameter-wrap']}
        >
          <Row id='rowArea'>
            <Col span={6}>
              <FormItem
                label='SKU编码'
                {...formItemLayout}
              >
                {getFieldDecorator('skuNo', {
                  initialValue: shelfWarnQueryParam.skuNo
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
                label='商品名称'
                {...formItemLayout}
              >
                {getFieldDecorator('goodsName', {
                  initialValue: shelfWarnQueryParam.goodsName
                })(
                  <Input
                    placeholder='请输入商品名称'
                    maxLength='50'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label='系统分类'
                {...formItemLayout}
              >
                {getFieldDecorator('goodsCatgNo', {
                  initialValue: shelfWarnQueryParam.goodsCatgNo,
                })(
                  <Select
                    placeholder='选择系统分类'
                    allowClear={true}
                    showSearch={true}
                    optionFilterProp='children'
                  >
                    {categoryList.map((item, index) => (
                      <Select.Option
                        key={item.categoryNo}
                        value={item.categoryNo}
                      >{item.categoryName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label='商品分类'
                {...formItemLayout}
              >
                {getFieldDecorator('goodsType', {
                  initialValue: shelfWarnQueryParam.goodsType,
                })(
                  <Select
                    placeholder='选择商品类型'
                    allowClear={true}
                  >
                    {goodsTypeList.map((item, index) => (
                      <Select.Option
                        key={item.goodsTypeNo}
                        value={item.goodsTypeNo}
                      >{item.goodsTypeName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <div style={{ 'float': 'right' }}>
                <Button
                  type='primary'
                  title='点击查询'
                  onClick={this._handleQuery}
                >
                  查询
                </Button>
                {
                  btnRole.indexOf('add') !== -1 &&
                  <Button
                    type='primary'
                    onClick={this._setOrder}
                    className={styles['button-spacing']}
                  >保存
                  </Button>
                }
              </div>
            </Col>
          </Row>
        </Form>
        <div className={styles['table-wrapper']}>
          <Table
            className={styles['c-table-center']}
            columns={this._columns}
            rowKey='skuNo'
            dataSource={this.state.dataSource}
            bordered={true}
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
    ...state['retail.shelf.warn'],
    ...state['retail'],
    auths: state['common.auths'],
  }
}
export default connect(['common.auths', 'common.showListSpin', 'retail', 'retail.shelf.warn'], mapStateToProps)(Form.create()(ShelfWarnList))
