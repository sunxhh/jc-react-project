import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
import { Button, Table, Form, Row, Col, Input, Modal } from 'antd'
import Module from './module'
import { RETAIL_SHELF_LIST_DETAIL, RETAIL_SHELF_LIST_ADD } from 'Global/urls'
import { genPagination } from 'Utils/helper'
import { showModalForm } from 'Components/modal/ModalForm'
import style from './style.less'
import { Link } from 'react-router-dom'
import { isEmpty } from 'Utils/lang'

const FormItem = Form.Item

class ShelfList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      page: {
        currentPage: 1,
        pageSize: 20
      }
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
    console.log(this.props.title)
    const arg = this._getParameter(current, pageSize)
    dispatch(Module.actions.getShelfList(arg))
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

  // 删除货架
  _handleDelete = (event, record) => {
    Modal.confirm({
      title: '删除?',
      content: '你是否确认删除此货架？？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props
        dispatch(Module.actions.shelfListDelete({ shelfNo: record.shelfNo })).then(status => {
          if (!status) {
            Modal.error({
              title: '删除',
              content: '该货架有在架库存，不可删除！',
            })
          }
          this._getList()
        })
      },
      onCancel() {
      },
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

  // 新增货架
  _addShowModal = (record, titleType) => {
    const showTitleType = {
      'addShelf': '新增',
      'modifyShelf': '编辑',
    }
    showModalForm({
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 }
      },
      title: showTitleType[titleType],
      fields: [
        {
          id: 'shelfName',
          props: {
            label: `货架名称`,
          },
          options: {
            initialValue: record.shelfName || '',
            rules: [{
              required: true,
              whitespace: true,
              message: '请输入货架名称！'
            }]
          },
          element: (
            <Input
              placeholder='请输入货架名称'
            />
          )
        },
      ],
      onOk: (values) => {
        if (titleType === 'addShelf') {
          this.props.dispatch(Module.actions.addShelf({ ...values })).then(status => {
            if (status) {
              this._getList(1)
            }
          })
        } else if (titleType === 'modifyShelf') {
          this.props.dispatch(Module.actions.modifyShelf({ ...values }, { shelfNo: record.shelfNo })).then(status => {
            if (status) {
              this._getList(1)
            }
          })
        }
      }
    })
  }

  _columns = [
    {
      key: 'rowNo',
      title: '序号',
      dataIndex: 'rowNo',
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
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'groupCount',
      title: '在架商品种数',
      dataIndex: 'groupCount',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 250,
      render: (text, record, index) => {
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        return (
          <div className={style['table-ope']}>
            {
              btnRole.includes('edit') &&
              <a
                onClick={() => { this._addShowModal(record, 'modifyShelf') }}
              >编辑
              </a>
            }
            {
              btnRole.includes('delete') &&
                <a
                  href='javascript:;'
                  onClick={(e) => { this._handleDelete(e, record, index) }}
                >删除
                </a>

            }
            {
              btnRole.includes('set') && (
                <Link
                  to={`${RETAIL_SHELF_LIST_ADD}/${record.shelfNo}`}
                >
                  商品配置
                </Link>
              )
            }
            {
              btnRole.includes('check') && !record.isEdit &&
              <Link
                to = {`${RETAIL_SHELF_LIST_DETAIL}/${record.shelfNo}`}
                style={{ marginRight: '5px' }}
              >
                查看库存
              </Link>
            }
          </div>
        )
      }
    }
  ]

  render() {
    const { showListSpin, list, auths, page, match } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    const pagination = genPagination(page)
    return (
      <div>
        <Form>
          <Row id='rowArea'>
            <Col span={12}>
              <FormItem style={{ 'float': 'left' }}>
                {
                  btnRole.includes('add') &&
                  <Button
                    style={{ marginRight: 10 }}
                    type='primary'
                    title='新增货架'
                    onClick={() => {
                      this._addShowModal('', 'addShelf')
                    }}
                  >
                    新增货架
                  </Button>
                }
              </FormItem>
            </Col>

          </Row>
        </Form>
        <div>
          <Table
            columns={this._columns}
            rowKey='shelfNo'
            dataSource={list}
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
    ...state['retail.shelf.list'],
    auths: state['common.auths'],
  }
}
export default connect(['common.auths', 'common.showListSpin', 'retail.shelf.list'], mapStateToProps)(Form.create()(ShelfList))
