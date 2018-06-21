import React, { Component } from 'react'
import { createAction } from 'redux-actions'
import { showModalForm } from '../../../../components/modal/ModalForm'
import {
  getChannelList,
  addChannel,
  editCheannelList,
  delChannelList,
  getChannelType,
  SET_CHANNEL_ROWKEYS,
} from '../reduck'
import { Button, Popconfirm, Table, Form, Input, Select, Row, Col, Modal } from 'antd'
import { connect } from 'react-redux'
import styles from './index.less'
import Ellipsis from 'Components/Ellipsis'
import { genPagination } from 'Utils/helper'

const FormItem = Form.Item
const Option = Select.Option
const channelType = {
  '1': '地推',
  '2': '线下活动'
}

class channelIndex extends Component {
  static defaultProps = {
    channelList: [],
    channelId: [],
    channelListpagination: {
      current: 1,
      total: 0,
      pageSize: '20',
    },
    selectedRowKeys: [],
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      confirmLoading: false,
      current: 1
    }
  }

  componentDidMount() {
    this._getChannelList()
    this.props.dispatch(getChannelType({ codeType: 'stuChannelType' }))
    this.props.dispatch(createAction(SET_CHANNEL_ROWKEYS)([]))
  }

  _columns = [
    {
      title: '序号',
      dataIndex: 'rowNo',
      key: 'rowNo',
      render: (text, record, index) => {
        const { pageSize, pageNo } = this.props.channelListpagination
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
      key: 'channelName',
      title: '渠道名称',
      dataIndex: 'channelName',
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
      key: 'channelType',
      title: '渠道分类',
      dataIndex: 'channelType',
      render: (text) => (
        <span>{channelType[text]}</span>
      )
    },
    {
      key: 'updateTime',
      title: '更新时间',
      dataIndex: 'updateTime',
    },
    {
      key: 'channelDesc',
      title: '备注',
      dataIndex: 'channelDesc',
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

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.channelListpagination.pageNo, pageSize = this.props.channelListpagination.pageSize) => {
    const arg = this.props.form.getFieldsValue()
    return {
      currentPage: current,
      pageSize: pageSize,
      studentChannel: {
        ...arg
      }
    }
  }

  // 获取列表数据的公用方法
  _getChannelList = (current, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getParameter(current, pageSize)
    dispatch(getChannelList(arg))
  }

  // 点击分页获取列表数据
  _handlePageChange = (page) => {
    const { current, pageSize } = page
    this.setState({
      current
    })
    this._getChannelList(current, pageSize)
  }

  // 点击查询
  _handleQuery = () => {
    const { dispatch } = this.props
    dispatch(createAction(SET_CHANNEL_ROWKEYS)([]))
    this._getChannelList(1)
  }

  // 新增渠道
  _addShowModal = (modalType, rowSelection) => {
    const { channelType } = this.props
    const typeName = {
      'add': '新增',
      'edit': '编辑',
    }
    const rowData = modalType === 'edit' ? rowSelection.selectRowData.filter(item => item.id === this.props.channelId[0])[0] : null
    showModalForm({
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 }
      },
      title: `${typeName[modalType]}渠道`,
      fields: [
        {
          id: 'channelName',
          props: {
            label: `${typeName[modalType]}渠道`,
          },
          options: {
            initialValue: rowData ? rowData.channelName : '',
            rules: [{
              required: true,
              message: '请输入渠道名称!'
            }]
          },
          element: (
            <Input
              placeholder='请输入渠道名称'
            />
          )
        },
        {
          id: 'channelType',
          props: {
            label: '类别'
          },
          options: {
            initialValue: rowData ? rowData.channelType : '',
            rules: [{
              required: true,
              message: '请选择渠道类别!'
            }]
          },
          element: (
            <Select
              placeholder='请选择类别'
            >
              {
                channelType && channelType.map((item) => {
                  return (
                    <Option
                      key={item.value}
                      value={item.value}
                    >
                      {item.name}
                    </Option>
                  )
                })
              }
            </Select>
          )
        },
        {
          id: 'channelDesc',
          props: {
            label: '备注'
          },
          options: {
            initialValue: rowData ? rowData.channelDesc : '',
          },
          element: (
            <Input.TextArea
              placeholder='请输入备注'
              maxLength='500'
            />
          )
        }
      ],
      onOk: (values) => {
        if (modalType === 'add') {
          this.props.dispatch(addChannel(values)).then(() => {
            this.props.form.setFieldsValue({ channelType: '' })
          })
        } else if (modalType === 'edit') {
          const id = rowData.id
          return this.props.dispatch(editCheannelList({
            id: id,
            ...values
          })).then(res => {
            res && this._getChannelList(this.state.current)
            return res
          })
        }
      }
    })
  }

  // 删除
  _heandleDels = () => {
    const length = this.props.channelList.length
    const ids = this.props.channelId
    if (length > 1) {
      const page = Number(this.props.channelListpagination.pageNo)
      const current = page > 1 ? Number(this.props.channelListpagination.pageNo) - 1 : 1
      this.props.dispatch(delChannelList({ idList: ids }, this._getParameter(current)))
      return
    }
    this.props.dispatch(delChannelList({ idList: ids }, this._getParameter()))
  }

  _onSelectChange = (ids) => {
    const { dispatch } = this.props
    dispatch(createAction(SET_CHANNEL_ROWKEYS)(ids))
  }

  render() {
    const { visible, confirmLoading } = this.state
    const { channelType } = this.props
    const { getFieldDecorator } = this.props.form
    const rowSelection = {
      selectRowData: this.props.channelList,
      selectedRowKeys: this.props.channelId,
      onChange: this._onSelectChange,
    }
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    }
    const channelListpagination = genPagination(this.props.channelListpagination)
    return (
      <div>
        <Form
          className='search-form'
        >
          <Row>
            <Col span={6}>
              <FormItem
                {...formItemLayout}
                label='渠道名称：'
              >
                {getFieldDecorator('channelName')(
                  <Input
                    type='text'
                    placeholder='渠道名称'
                  />
                )}
              </FormItem>
            </Col>
            <Col
              id='channelType'
              span={6}
            >
              <FormItem
                {...formItemLayout}
                label='渠道分类:'
              >
                {getFieldDecorator('channelType')(
                  <Select
                    placeholder='请选择渠道类别'
                    getPopupContainer={() => document.getElementById('channelType')}
                  >
                    <Option
                      key='-1'
                      value=''
                    >
                      请选择
                    </Option>
                    {
                      channelType && channelType.map((item) => {
                        return (
                          <Option
                            value={item.value}
                            key={item.value}
                          >
                            {item.name}
                          </Option>
                        )
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <div className={styles['operate-btn']}>
                <Button
                  type='primary'
                  title='点击查询'
                  onClick={this._handleQuery}
                >
                  查询
                </Button>
                <Button
                  type='primary'
                  title='点击新增'
                  onClick={() => {
                    this._addShowModal('add', '')
                  }}
                >
                  新增
                </Button>
                <Button
                  disabled={this.props.channelId.length !== 1}
                  type='primary'
                  title='点击编辑'
                  onClick={() => {
                    this._addShowModal('edit', rowSelection)
                  }}
                >
                  编辑
                </Button>
                <Popconfirm
                  title={`确定要删除吗?`}
                  onConfirm={this._heandleDels}
                >
                  <Button
                    style={{ marginRight: 10 }}
                    disabled={this.props.channelId.length > 0 ? 0 : 1}
                    type='danger'
                    title='点击删除'
                  >删除
                  </Button>
                </Popconfirm>
              </div>
            </Col>
          </Row>
        </Form>
        <div className={styles['modal-box']}>
          <Modal
            title='新建渠道'
            onOk={this.handleOk}
            visible={visible}
            confirmLoading={confirmLoading}
            onCancel={this.handleCancel}
            okText='保存'
            cancelText='取消'
          >
            <Form>
              <Row>
                <Col>
                  <FormItem
                    {...formItemLayout}
                    label='名称：'
                  >
                    {getFieldDecorator('channelName', {
                      rules: [{
                        required: true,
                        message: '请输渠道名称'
                      }],
                    })(
                      <Input
                        type='text'
                        placeholder='请输渠道名称'
                      />
                    )}
                  </FormItem>
                </Col>
                <Col>
                  <FormItem
                    {...formItemLayout}
                    label='分类:'
                  >
                    {getFieldDecorator('channelType', {
                      rules: [{
                        required: true,
                        message: '请选择分类'
                      }]
                    })(
                      <Select
                        placeholder='请选择分类'
                      >
                        <Option value='1'>地推</Option>
                        <Option value='2'>线下活动</Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label='备注：'
                    hasFeedback
                  >
                    {getFieldDecorator('channelDesc')(
                      <Input.TextArea
                        maxLength='500'
                        type='text'
                        placeholder='请输入备注'
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Modal>
        </div>
        <Table
          className={styles['table-center']}
          columns={this._columns}
          rowKey='id'
          dataSource={this.props.channelList}
          rowSelection={rowSelection}
          onChange={this._handlePageChange}
          loading={this.props.isLoading}
          pagination={channelListpagination}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    channelListpagination: state.eduStudents.channelListpagination,
    isLoading: state.eduStudents.isLoading,
    orgList: state.eduStudents.orgList,
    selectedRowKeys: state.eduStudents.selectedRowKeys,
    idList: state.eduStudents.idList,
    orgLevel: state.eduStudents.orgLevel,
    channelList: state.eduStudents.channelList,
    channelId: state.eduStudents.channelId,
    channelType: state.eduStudents.channelType,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(channelIndex))

