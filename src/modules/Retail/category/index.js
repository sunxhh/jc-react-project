import React, { Component } from 'react'
import { Button, Table, Form, Row, Col, Input, message } from 'antd'
import styles from './styles.less'
import moment from 'moment'

import storage from 'Utils/storage'
import { showModalForm } from 'Components/modal/ModalForm'
import { showModalWrapper } from 'Components/modal/ModalWrapper'

import { connect } from '@dx-groups/arthur'
import { genPagination } from 'Utils/helper'
import Module from './module'
import StoreCategory from './storeCategory'

class CategoryList extends Component {
  // 生命周期， 初始化表格数据
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(Module.actions.getNoAddCategory())
    this._getList()
  }

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const orgLevel = storage.get('userInfo') ? storage.get('userInfo').orgLevel : ''
    const argChain = this._getParameterChain(current, pageSize)
    const argStore = this._getParameterStore(current, pageSize)
    if (orgLevel !== '2') {
      dispatch(Module.actions.getChainCategoryList(argChain))
    } else {
      dispatch(Module.actions.getStoreCategoryList(argStore))
    }
  }

  // 获取所有表格需要的参数
  _getParameterChain = (current = this.props.chainPage.currentPage, pageSize = this.props.chainPage.pageSize) => {
    return {
      currentPage: current,
      pageSize: pageSize,
    }
  }
  // 获取所有表格需要的参数
  _getParameterStore = (current = this.props.storePage.currentPage, pageSize = this.props.storePage.pageSize) => {
    return {
      currentPage: current,
      pageSize: pageSize,
    }
  }

  // 列表
  _chainColumns = [
    {
      key: 'index',
      title: '序号',
      dataIndex: 'index',
      width: 80,
      render: (text, record, index) => {
        const { pageSize, pageNo } = this.props.chainPage
        return (
          <span>{(pageNo - 1) * pageSize + index + 1}</span>
        )
      }
    },
    {
      key: 'categoryName',
      title: '分类名称',
      dataIndex: 'categoryName',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'updateTime',
      title: '更新日期',
      dataIndex: 'updateTime',
      render: (text) => (
        <span>{text && text !== 'null' && moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
      )
    },
    {
      key: 'option',
      title: '操作',
      dataIndex: 'option',
      width: 150,
      render: (text, record) => {
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        return (
          <div className={styles['table-ope']}>
            {
              btnRole.includes('edit') &&
              <a
                href='javascript:;'
                onClick={() => this._handleAddOrEdit(record)}
              >编辑
              </a>
            }
          </div>
        )
      }
    }
  ]

  // 列表
  _storeColumns = [
    {
      key: 'index',
      title: '序号',
      dataIndex: 'index',
      width: 80,
      render: (text, record, index) => {
        const { pageSize, pageNo } = this.props.storePage
        return (
          <span>{(pageNo - 1) * pageSize + index + 1}</span>
        )
      }
    },
    {
      key: 'categoryName',
      title: '分类名称',
      dataIndex: 'categoryName',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'updateTime',
      title: '更新日期',
      dataIndex: 'updateTime',
      render: (text) => (
        <span>{text && text !== 'null' && moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
      )
    },
    {
      key: 'option',
      title: '排序',
      dataIndex: 'option',
      width: 150,
      render: (text, record) => {
        const { storePage, storeList } = this.props
        return (
          <div className={styles['table-ope']}>
            {
              storePage.pageNo === 1 && storeList.indexOf(record) === 0
                ? '' : <a href='javascript:;' onClick={() => this._handleMoveUp(record)}>上移</a>
            }
            {
              storePage.pageNo === storePage.pages && storeList.indexOf(record) === storeList.length - 1
                ? '' : <a href='javascript:;' onClick={() => this._handleMoveDown(record)}>下移</a>
            }

          </div>
        )
      }
    }
  ]

  // 连锁分类（新增、编辑）
  _handleAddOrEdit = (record) => {
    showModalForm({
      title: record.categoryNo ? '编辑分类' : '新增分类',
      okText: '确定',
      cancelText: '取消',
      fields: [
        {
          id: 'categoryName',
          props: {
            label: '分类名称：'
          },
          options: {
            rules: [{
              required: true,
              message: '请输入分类名称!'
            }],
            initialValue: record.categoryName
          },
          element: (
            <Input style={{ width: '356px' }} placeholder='分类名称' />
          )
        },
      ],
      onOk: values => {
        if (record.categoryNo) {
          this.props.dispatch(Module.actions.chainEdit({ ...values, categoryNo: record.categoryNo })).then(status => {
            if (status) {
              this._getList(1)
            }
          })
        } else {
          this.props.dispatch(Module.actions.chainAdd(values)).then(status => {
            if (status) {
              this._getList(1)
            }
          })
        }
      },
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 },
      }
    })
  }

  // 门店分类（绑定连锁中分类）
  _handleAdd = () => {
    const { dispatch, noAddCategoryList } = this.props
    if (noAddCategoryList.length === 0) {
      message.error('暂无分类可添加')
      return
    }
    showModalWrapper(
      (
        <StoreCategory
          dispatch={dispatch}
          noAddCategoryList={noAddCategoryList}
        />
      ),
      {
        title: '新增分类',
        width: 496,
      }
    )
  }

  // 点击分页获取列表数据
  _handlePageChangeChain = (chainPage) => {
    if (this.props.chainPage.pageSize === chainPage.pageSize) {
      this._getList(chainPage.current)
    } else {
      this._getList(1, chainPage.pageSize)
    }
  }

  // 点击分页获取列表数据
  _handlePageChangeStore = (storePage) => {
    if (this.props.storePage.pageSize === storePage.pageSize) {
      this._getList(storePage.current)
    } else {
      this._getList(1, storePage.pageSize)
    }
  }

  // 排序 上移
  _handleMoveUp = (record) => {
    const { dispatch } = this.props
    dispatch(Module.actions.getStoreCategorySort({ categoryNo: record.categoryNo, direction: '1' })).then(status => {
      if (status) {
        this._getList(this.props.chainPage.pageNo)
      }
    })
  }

  // 排序 下移
  _handleMoveDown = (record) => {
    const { dispatch } = this.props
    dispatch(Module.actions.getStoreCategorySort({ categoryNo: record.categoryNo, direction: '2' })).then(status => {
      if (status) {
        this._getList(this.props.chainPage.pageNo)
      }
    })
  }

  render() {
    const { showListSpin, auths, match, chainList, chainPage, storeList, storePage } = this.props
    const orgLevel = storage.get('userInfo') ? storage.get('userInfo').orgLevel : ''
    const paginationChain = genPagination(chainPage)
    const paginationStore = genPagination(storePage)
    const btnRole = auths[match.path] ? auths[match.path] : []
    return (
      <div>
        <Form
          className={styles['parameter-wrap']}
        >
          <Row id='rowArea'>
            <Col span={12}>
              <div style={{ 'float': 'left' }}>
                {
                  btnRole.indexOf('add') !== -1 && orgLevel !== '2' &&
                  <Button
                    type='primary'
                    onClick={this._handleAddOrEdit}
                    className={styles['button-spacing']}
                  >
                    新增分类
                  </Button>
                }
                {
                  btnRole.indexOf('add') !== -1 && orgLevel === '2' &&
                  <Button
                    type='primary'
                    onClick={this._handleAdd}
                    className={styles['button-spacing']}
                  >
                    新增分类
                  </Button>
                }
              </div>
            </Col>
          </Row>
        </Form>
        <div className={styles['table-wrapper']}>
          {
            orgLevel !== '2' &&
            <Table
              className={styles['c-table-center']}
              columns={this._chainColumns}
              rowKey='categoryNo'
              dataSource={chainList}
              bordered={true}
              loading={showListSpin}
              onChange={this._handlePageChangeChain}
              pagination={paginationChain}
            />
          }
          {
            orgLevel === '2' &&
            <Table
              className={styles['c-table-center']}
              columns={this._storeColumns}
              rowKey='categoryNo'
              dataSource={storeList}
              bordered={true}
              loading={showListSpin}
              onChange={this._handlePageChangeStore}
              pagination={paginationStore}
            />
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state['retail.category'],
    auths: state['common.auths'],
    showListSpin: state['common.showListSpin'],
  }
}
export default connect(['common.auths', 'common.showListSpin', 'retail.category'], mapStateToProps)(Form.create()(CategoryList))
