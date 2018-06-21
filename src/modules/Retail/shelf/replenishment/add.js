import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
import { Button, Table, Form, Radio, Row, Col, InputNumber } from 'antd'
import Module from './module'
import { genPagination } from 'Utils/helper'
import { debounce } from 'Utils/function'
import styles from './style.less'
import { isEmpty } from 'Utils/lang'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 18
  },
}

const stockStatus = {
  '1': '正常',
  '2': '缺货'
}

class ShelfRepleAddList extends Component {
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
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: nextProps.list && nextProps.list.map(item => ({
        ...item,
      }))
    })
  }

  componentWillUnmount() {
    this.props.dispatch(Module.actions.emptyList())
  }

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getParameter(current, pageSize)
    dispatch(Module.actions.getShelfRepleAddList(arg))
  }

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.page.pageNo, pageSize = this.props.page.pageSize) => {
    const { form, match } = this.props
    const arg = form.getFieldsValue()
    return {
      ...arg,
      currentPage: current,
      pageSize: pageSize,
      replenishmentUuid: match.params && match.params.replenishmentUuid
    }
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

  // 点击分页获取列表数据
  _handlePageChange = (page) => {
    if (this.props.page.pageSize === page.pageSize) {
      this._getList(page.current)
    } else {
      this._getList(1, page.pageSize)
    }
  }

  // 保存
  _setOrder = type => {
    const { dispatch, match } = this.props
    const { dataSource } = this.state
    let repleReqs = []

    dataSource.forEach(key => {
      repleReqs.push({
        skuNo: key.skuNo,
        stockCount: key.stockCount,
        replenishmentCount: key.replenishmentCount,
        realCount: key.realCount
      })
    })
    dispatch(Module.actions.saveReple({ replenishmentDetailList: repleReqs, finishFlag: type === 'add' ? 'N' : 'Y', replenishmentUuid: match.params && match.params.replenishmentUuid })).then((res) => {
      if (type !== 'add' && res.status) {
        history.go(-1)
      } else {
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
      key: 'stockStatus',
      title: '库存状态',
      dataIndex: 'stockStatus',
      width: 80,
      render: (text) => {
        if (text && text !== 'null' && text === '1') {
          return (
            <span>{text && text !== 'null' && stockStatus[text]}</span>
          )
        } else {
          return (
            <span className={styles['c-red']}>{text && text !== 'null' && stockStatus[text]}</span>
          )
        }
      }
    },
    {
      key: 'stockCount',
      title: '在架库存',
      dataIndex: 'stockCount',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'availableCount',
      title: '可用库存',
      dataIndex: 'availableCount',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'replenishmentCount',
      title: '建议补货数',
      dataIndex: 'replenishmentCount',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'realCount',
      title: '实际补货数',
      width: 40,
      dataIndex: 'realCount',
      render: (text, record, index) => (
        <InputNumber
          min={0}
          value={text}
          precision={0}
          step={1}
          maxLength={9}
          onChange={value => this._handleCellChange(value, record.skuNo, 'realCount')}
        />
      )
    }
  ]

  render() {
    const { showListSpin, page } = this.props
    const { getFieldDecorator } = this.props.form
    const pagination = genPagination(page)
    return (
      <div>
        <Form
          className={styles['parameter-wrap']}
        >
          <Row id='rowArea'>
            <Col span={10}>
              <FormItem
                label='库存状态：'
                {...formItemLayout}
              >
                {getFieldDecorator('stockStatus', {
                  initialValue: ''
                })(
                  <Radio.Group onChange={this._handleModeChange}>
                    <Radio.Button value=''>全部</Radio.Button>
                    <Radio.Button value='1'>正常</Radio.Button>
                    <Radio.Button value='2'>缺货</Radio.Button>
                  </Radio.Group>
                )}
              </FormItem>
            </Col>
            <Col span={14}>
              <FormItem className={styles['operate-btn']} style={{ float: 'right' }}>
                <Button
                  type='primary'
                  onClick={() => { this._setOrder('add') }}
                >保存
                </Button>
                <Button
                  type='primary'
                  onClick={() => { this._setOrder('finish') }}
                  className={styles['button-spacing']}
                >完成补货
                </Button>
                <Button
                  type='primary'
                  onClick={() => history.go(-1)}
                  className={styles['button-spacing']}
                >返回
                </Button>
              </FormItem>
            </Col>
            <Col span={24}>
              <span className={styles['c-red']}>温馨提示：每一页补货录入操作请进行“保存”操作，以免数据丢失！</span>
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
    ...state['retail.shelf.reple'],
    auths: state['common.auths'],
  }
}
export default connect(['common.auths', 'common.showListSpin', 'retail.shelf.reple'], mapStateToProps)(Form.create()(ShelfRepleAddList))
