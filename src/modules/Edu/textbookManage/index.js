import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from './reduck'
import { Form, Input, Row, Col, Select, Button, Table, Popconfirm, message, InputNumber } from 'antd'
import { showModalForm } from '../../../components/modal/ModalForm'
import styles from './index.less'
import { isEmpty } from '../../../utils/lang'
import Ellipsis from 'Components/Ellipsis'
import { genPagination } from 'Utils/helper'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRowKeys: [],
      loading: false,
    }
  }

  componentDidMount() {
    this._getList(1)
    this.props.dispatch(actions.getCourseType())
  }

  // 获取列表数据的公用方法
  _getList = (currentPage, pageSize) => {
    const arg = this._getParameter(currentPage, pageSize)
    this.props.dispatch(actions.getBookList(arg))
    this.setState({
      selectedRowKeys: []
    })
  }

  // 获取所有表格需要的参数
  _getParameter = (currentPage = this.props.page.pageNo, pageSize = this.props.page.pageSize) => {
    const arg = this.props.form.getFieldsValue()
    return {
      textbook: {
        textBookTitle: arg.textBookTitle ? arg.textBookTitle : '',
        courseType: arg.courseType ? arg.courseType : ''
      },
      currentPage: currentPage,
      pageSize: pageSize
    }
  }

  // 点击分页获取列表数据
  _handlePageChange = (page) => {
    this._getList(page.current, page.pageSize)
  }
  // 搜索
  _search = () => {
    this._getList(1)
  }

  // 表格项
  _columns = [
    {
      key: 'rowNo',
      title: '序号',
      dataIndex: 'rowNo',
      render: (text, record, index) => {
        const { pageSize, pageNo } = this.props.page
        return (
          <span>{
            pageSize *
            pageNo +
            (index + 1) -
            pageSize
          }
          </span>
        )
      }
    },
    {
      title: '教材名称',
      dataIndex: 'textBookTitle',
      render: (text) => {
        return (
          <Ellipsis
            length={15}
            tooltip={true}
          >
            {text || ''}
          </Ellipsis>
        )
      }
    },
    {
      title: '课程类别',
      dataIndex: 'courseType',
      render: (text) => {
        return this.props.courseType.map((item) => {
          if (item.value === text) {
            return (
              <span>{item.name}</span>
            )
          }
        })
      }
    },
    {
      title: '价格',
      dataIndex: 'salePrice',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      title: '成本',
      dataIndex: 'buyPrice',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      title: '备注',
      dataIndex: 'memo',
      render: (text) => {
        return (
          <Ellipsis
            length={15}
            tooltip={true}
          >
            {text || ''}
          </Ellipsis>
        )
      }
    }
  ]

  // 提交请求
  _req = (values) => {
    const textbook = {
      salePrice: values.salePrice === 0 ? values.salePrice = '0.00' : values.salePrice,
      buyPrice: values.buyPrice === 0 ? values.buyPrice = '0.00' : values.buyPrice,
      ...values
    }
    return textbook
  }
  // 新增
  _addShowModal = (e) => {
    e.preventDefault()
    showModalForm({
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 }
      },
      title: '新增教材',
      fields: [
        {
          id: 'textBookTitle',
          props: {
            label: '教材名称'
          },
          options: {
            rules: [{
              required: true,
              message: '请输入教材名称!'
            }, {
              max: 50,
              message: '教材名称不能超过50个字!'
            }]
          },
          element: (
            <Input
              maxLength='50'
              placeholder='请输入教材名称'
            />
          )
        },
        {
          id: 'courseType',
          props: {
            label: '课程类别'
          },
          options: {
            rules: [{
              required: true,
              message: '请选择课程类别!'
            }]
          },
          element: (
            <Select
              placeholder='请选择课程类别'
            >
              {
                this.props.courseType.map(item => (
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
        },
        {
          id: 'salePrice',
          props: {
            label: '价格'
          },
          options: {
            rules: [{
              required: true,
              message: '请输入价格!',
            }]
          },
          element: (
            <InputNumber
              style={{ width: '100%' }}
              precision={2}
              min={0}
              maxLength='12'
              placeholder='请输入价格'
            />
          )
        },
        {
          id: 'buyPrice',
          props: {
            label: '成本'
          },
          element: (
            <InputNumber
              style={{ width: '100%' }}
              precision={2}
              min={0}
              maxLength='12'
              placeholder='请输入成本'
            />
          )
        },
        {
          id: 'memo',
          props: {
            label: '备注'
          },
          element: (
            <Input.TextArea
              maxLength='500'
              placeholder='请输入备注'
            />
          )
        }
      ],
      onOk: values => {
        return this.props.dispatch(actions.addBook({
          textbook: this._req(values)
        })).then(res => {
          return res
        })
      }
    })
  }

  // 编辑
  _editShowModal = (e) => {
    e.preventDefault()
    if (this.state.selectedRowKeys.length > 1) {
      message.error('请选择一个课程进行编辑！！')
      return
    }
    this.props.dispatch(actions.bookDeatil({
      id: this.state.selectedRowKeys[0]
    })).then(res => {
      showModalForm({
        formItemLayout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 16 }
        },
        title: '编辑教材',
        fields: [
          {
            id: 'textBookTitle',
            props: {
              label: '教材名称'
            },
            options: {
              initialValue: res && res.textBookTitle ? res.textBookTitle : '',
              rules: [{
                required: true,
                message: '请输入教材名称!'
              }, {
                max: 50,
                message: '教材名称不能超过50个字!'
              }]
            },
            element: (
              <Input
                maxLength='50'
                placeholder='请输入教材名称'
              />
            )
          },
          {
            id: 'courseType',
            props: {
              label: '课程类别'
            },
            options: {
              initialValue: res && res.courseType ? res.courseType : '',
              rules: [{
                required: true,
                message: '请选择课程类别!'
              }]
            },
            element: (
              <Select
                placeholder='请选择课程类别'
              >
                {
                  this.props.courseType.map(item => (
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
          },
          {
            id: 'salePrice',
            props: {
              label: '价格'
            },
            options: {
              initialValue: res && res.salePrice >= 0 ? res.salePrice : '',
              rules: [{
                required: true,
                message: '请输入价格!'
              }]
            },
            element: (
              <InputNumber
                style={{ width: '100%' }}
                precision={2}
                min={0}
                maxLength='12'
                placeholder='请输入价格'
              />
            )
          },
          {
            id: 'buyPrice',
            props: {
              label: '成本'
            },
            options: {
              initialValue: res && res.buyPrice >= 0 ? res.buyPrice : ''
            },
            element: (
              <InputNumber
                style={{ width: '100%' }}
                precision={2}
                min={0}
                maxLength='12'
                placeholder='请输入成本'
              />
            )
          },
          {
            id: 'memo',
            props: {
              label: '备注'
            },
            options: {
              initialValue: res && res.memo ? res.memo : '',
            },
            element: (
              <Input.TextArea
                maxLength={500}
                placeholder='请输入备注'
              />
            )
          },
          {
            id: 'id',
            options: {
              initialValue: res && res.id ? res.id : ''
            },
            element: (
              <Input style={{ display: 'none' }} />
            )
          }
        ],
        onOk: values => {
          return this.props.dispatch(actions.bookEdit({
            textbook: this._req(values)
          })).then(res => {
            if (res) {
              this.setState({
                selectedRowKeys: []
              })
              return res
            }
          })
        }
      })
    })
  }

  // 删除
  _delBook = () => {
    this.setState({ loading: true })
    this.props.dispatch(actions.delBook({
      idList: this.state.selectedRowKeys
    }))
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      })
    }, 1000)
  }
  // 取消删除
  _cancelDel = () => {
    this.setState({
      selectedRowKeys: [],
      loading: false,
    })
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { loading, selectedRowKeys } = this.state
    const { bookList, courseType, page, match, auths, showListSpin } = this.props
    const authState = (isEmpty(auths) || isEmpty(auths[match.path])) ? [] : auths[match.path]
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const hasSelected = selectedRowKeys.length > 0

    const pagination = genPagination(page)
    return (
      <div>
        <div className={styles['search-container']}>
          <Form className='search-form'>
            <Row>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='教材名称：'
                >
                  {getFieldDecorator('textBookTitle')(
                    <Input
                      style={{ width: '150px' }}
                      placeholder='请输入教材名称'
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='课程类别：'
                >
                  {getFieldDecorator('courseType')(
                    <Select
                      allowClear
                      placeholder='请选择课程类别'
                    >
                      {
                        courseType.map(item => (
                          <Option
                            key={item.value}
                            value={item.value}
                          >
                            {item.name}
                          </Option>
                        ))
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <div className={styles['operation-btn']}>
                  <Button
                    type='primary'
                    onClick={this._search}
                  >
                    查询
                  </Button>
                  {
                    authState.indexOf('add') !== -1 && (
                      <Button
                        type='primary'
                        onClick={this._addShowModal}
                      >
                        新增
                      </Button>
                    )
                  }
                  {
                    authState.indexOf('edit') !== -1 && (
                      <Button
                        type='primary'
                        onClick={this._editShowModal}
                        disabled={selectedRowKeys.length !== 1}
                      >
                        编辑
                      </Button>
                    )
                  }
                  {
                    authState.indexOf('delete') !== -1 && (
                      <Popconfirm
                        title='确定要删除吗？'
                        onConfirm={() => this._delBook()}
                        onCancel={() => this._cancelDel()}
                      >
                        <Button
                          type='danger'
                          disabled={!hasSelected}
                          loading={loading}
                        >
                          删除
                        </Button>
                      </Popconfirm>
                    )
                  }
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        <div>
          <Table
            className={styles['c-table-center']}
            columns={this._columns}
            rowSelection={rowSelection}
            dataSource={bookList}
            rowKey='id'
            loading={showListSpin}
            pagination={pagination}
            onChange={this._handlePageChange}
          />
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    bookList: state.textbookManage.bookList,
    page: state.textbookManage.page,
    courseType: state.textbookManage.courseType || [],
    auths: state.common.auths,
    showListSpin: state.common.showListSpin,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Index))
