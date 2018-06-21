import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
import { Button, Table, Form, Radio, Row, Col } from 'antd'
import Module from './module'
import { genPagination } from 'Utils/helper'
import { debounce } from 'Utils/function'
import styles from './style.less'
import * as urls from 'Global/urls'
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
  '0': '全部',
  '1': '正常',
  '2': '待补货',
}

class ShelfMonitorList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      page: {
        currentPage: 1,
        pageSize: 20
      },
    }
    this._handleModeChange = debounce(this._handleModeChange, 100)
  }

  // 列表复选框事件
  _onSelectChange = (selectedRowKeys) => {
    const { dispatch } = this.props
    dispatch(Module.actions.updateSelectedShelfNos(selectedRowKeys))
  }

  // 点击批量保存
  _handleAdd = () => {
    const { shelfNos, dispatch, history } = this.props
    dispatch(Module.actions.addReples({ shelfNos: shelfNos })).then((res) => {
      if (res.status) {
        history.push(urls.RETAIL_SHELF_REPLE)
      } else {
        dispatch(Module.actions.updateSelectedShelfNos([]))
        this._getList()
      }
    })
  }

  // 点击分页获取列表数据
  _handlePageChange = (page) => {
    if (this.props.page.pageSize === page.pageSize) {
      this._getList(page.current)
    } else {
      this._getList(1, page.pageSize)
    }
  }

  // 生命周期， 初始化表格数据
  componentWillMount() {
    this._getList()
  }

  componentWillUnmount() {
    this.props.dispatch(Module.actions.emptyList())
  }

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getParameter(current, pageSize)
    dispatch(Module.actions.getShelfMonitorList(arg))
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
      key: 'shelfName',
      title: '货架名称',
      dataIndex: 'shelfName',
      width: 100,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'groupCount',
      title: '在架商品种数',
      dataIndex: 'groupCount',
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
    }
  ]

  render() {
    const { shelfNos, showListSpin, list, auths, page, match } = this.props
    const { getFieldDecorator } = this.props.form
    const btnRole = auths[match.path] ? auths[match.path] : []
    const pagination = genPagination(page)
    const rowSelection = {
      selectedRowKeys: shelfNos,
      onChange: this._onSelectChange,
    }
    return (
      <div>
        <Form
          className={styles['parameter-wrap']}
        >
          <Row id='rowArea'>
            <Col span={10}>
              <FormItem
                label='货架状态：'
                {...formItemLayout}
              >
                {getFieldDecorator('stockStatus', {
                  initialValue: ''
                })(
                  <Radio.Group onChange={this._handleModeChange}>
                    <Radio.Button value=''>全部</Radio.Button>
                    <Radio.Button value='1'>正常</Radio.Button>
                    <Radio.Button value='2'>待补货</Radio.Button>
                  </Radio.Group>
                )}
              </FormItem>
            </Col>
            <Col span={14}>
              <FormItem className={styles['operate-btn']} style={{ float: 'right' }}>
                {
                  btnRole.indexOf('add') !== -1 &&
                  <Button
                    disabled={shelfNos.length > 0 ? 0 : 1}
                    type='primary'
                    onClick={(e) => {
                      this._handleAdd(e)
                    }}
                  >生成补货单
                  </Button>
                }
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div className={styles['table-wrapper']}>
          <Table
            className={styles['c-table-center']}
            columns={this._columns}
            rowKey='shelfNo'
            dataSource={list}
            bordered={true}
            rowSelection={rowSelection}
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
    ...state['retail.shelf.monitor'],
    auths: state['common.auths'],
  }
}
export default connect(['common.auths', 'common.showListSpin', 'retail.shelf.monitor'], mapStateToProps)(Form.create()(ShelfMonitorList))
