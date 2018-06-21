import React, { Component } from 'react'
// import moment from 'moment'
import moment from 'moment'
import { Table, Button, Input, Form, Select, Popconfirm, Row, Col } from 'antd'
import { connect } from 'react-redux'
import {
  getRoomList,
  addRoom,
  modifyRoom,
  deleteRoom,
  getRoomDetail,
} from './reduck'
import {
  queryOrg
} from '../../../global/action'
import styles from './room.less'
import { isEmpty } from '../../../utils/lang'
import { showModalForm } from '../../../components/modal/ModalForm'
import * as urls from 'Global/urls'
import Ellipsis from 'Components/Ellipsis'
import { genPagination } from 'Utils/helper'

const FormItem = Form.Item

class Room extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRows: [],
      selectedRowKeys: [],
    }
  }

  columns = [
    {
      key: 'roomName',
      title: '教室名称',
      dataIndex: 'roomName',
    },
    {
      key: 'organizationName',
      title: '所属机构',
      dataIndex: 'organizationName'
    },
    {
      key: 'updateTime',
      title: '更新时间',
      dataIndex: 'updateTime',
      render: (text) => (
        <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
      )
    },
    {
      key: 'remark',
      title: '备注',
      dataIndex: 'remark',
      render: (text) => {
        return (
          <Ellipsis
            length={30}
            tooltip={true}
          >
            {text || ''}
          </Ellipsis>)
      }
    },
  ]

  rowSelect = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRows,
      selectedRowKeys
    })
  }

  componentWillMount() {
    const { dispatch, list, preRouter } = this.props
    dispatch(queryOrg({ org: { orgMod: 1, orgLevel: 2 }})).then(res => {
      const roomListReqBody = { currentPage: 1 }
      if (res && res.myOrgLevel === '2') {
        roomListReqBody.organizationId = res.myOrgId
      }
      if (isEmpty(list) || !(preRouter && preRouter.startsWith(urls.SPORT_ROOM))) {
        dispatch(getRoomList(roomListReqBody))
      }
    })
  }

  _onPaginationChange = page => {
    const { filter } = this.props
    this.props.dispatch(getRoomList({ ...filter, currentPage: this.props.page.pageSize === page.pageSize ? page.current : 1, pageSize: page.pageSize }))
    this.setState({ selectedRows: [], selectedRowKeys: [] })
  }

  _handleSearch = () => {
    const { filter, dispatch, form } = this.props
    const values = form.getFieldsValue()
    const searchBody = {
      currentPage: 1,
      roomName: values.roomName,
      organizationId: values.organizationId,
      pageSize: filter.pageSize
    }
    dispatch(getRoomList(searchBody))
    this.setState({ selectedRows: [], selectedRowKeys: [] })
  }

  _handleDelete = (selectedRows) => {
    const { dispatch, filter } = this.props
    dispatch(deleteRoom({ roomNo: selectedRows[0].roomNo })).then(res => {
      res && dispatch(getRoomList(filter)) && this.setState({ selectedRows: [], selectedRowKeys: [] })
    })
  }

  _showModal = (data = {}) => {
    const { orgLevel, orgId, orgList, dispatch, filter } = this.props
    showModalForm({
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 }
      },
      title: isEmpty(data) ? '新增教室' : '编辑教室',
      fields: [
        {
          id: 'roomName',
          props: {
            label: '教室名称'
          },
          options: {
            initialValue: data.roomName,
            rules: [{
              required: true,
              message: '请输入教室名称!'
            }]
          },
          element: (
            <Input
              maxLength='30'
              placeholder='请输入教室名称'
            />
          )
        },
        {
          id: 'organizationId',
          props: {
            label: '所属机构'
          },
          options: {
            initialValue: orgLevel === '2'
              ? orgId
              : (data.organizationId || ''),
            rules: [{
              required: true,
              message: '请选择所属机构!'
            }]
          },
          element: (
            <Select
              disabled = {orgLevel === '2'}
            >
              {
                orgList.map((item) => {
                  return (
                    <Option
                      key={item.id}
                      value={item.id}
                    >
                      {item.orgName}
                    </Option>
                  )
                })
              }
            </Select>
          )
        },
        {
          id: 'remark',
          props: {
            label: '备注'
          },
          options: {
            initialValue: data.remark,
          },
          element: (
            <Input.TextArea
              maxLength='200'
              placeholder='最多输入200字符'
            />
          )
        }
      ],
      onOk: values => {
        const orgs = orgList.filter(item => {
          return item.id === values.organizationId
        })
        const reqBody = {
          roomName: values.roomName,
          organizationId: values.organizationId,
          organizationName: orgs.length > 0 ? orgs[0].orgName : '',
          remark: values.remark
        }
        if (isEmpty(data)) {
          return dispatch(addRoom(reqBody)).then(res => {
            res && dispatch(getRoomList({ ...filter, currentPage: 1 }))
            return res
          })
        } else {
          return dispatch(modifyRoom({ ...reqBody, roomNo: data.roomNo })).then(res => {
            res && dispatch(getRoomList(filter))
            return res
          })
        }
      }
    })
  }

  _filterOption = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  _showFormModal = (params) => {
    if (params) {
      this.props.dispatch(getRoomDetail(params)).then(res => {
        res && this._showModal(res)
      })
    } else {
      this._showModal()
    }
  }

  render() {
    const { page, list, form, orgList, filter, orgLevel, orgId, auths, match, showListSpin } = this.props
    const path = match.path
    const { selectedRows, selectedRowKeys } = this.state
    const authState = (isEmpty(auths) || isEmpty(auths[path])) ? [] : auths[path]
    const rowSelection = {
      selectedRowKeys,
      onChange: this.rowSelect,
      type: 'radio',
      getCheckboxProps: record => ({
        disabled: authState.indexOf('edit') === -1 && authState.indexOf('delete') === -1
      })
    }
    const { getFieldDecorator } = form
    const selectedRowsLength = selectedRowKeys.length
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    }
    const pagination = genPagination(page)
    return (
      <div>
        <div className='search-form'>
          <Form
            id='filter-form'
            style={{ position: 'relative' }}
          >
            <Row>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='教室名称'
                  className={styles['search-form-item']}
                >
                  {getFieldDecorator('roomName', {
                    initialValue: '',
                  })(
                    <Input
                      placeholder='请输入教室名称'
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='所属机构'
                  className={styles['search-form-item']}
                >
                  {getFieldDecorator('organizationId', {
                    initialValue: orgLevel === '2'
                      ? orgId
                      : (filter.organizationId || ''),
                  })(
                    <Select
                      placeholder='全部'
                      disabled = {orgLevel === '2'}
                      showSearch={true}
                      allowClear={true}
                      filterOption={this._filterOption}
                      getPopupContainer={() => document.getElementById('filter-form')}
                    >
                      <Select.Option
                        key='-1'
                        value=''
                      >全部
                      </Select.Option>
                      {
                        orgList.map((item) => {
                          return (
                            <Select.Option
                              key={item.id}
                              value={item.id}
                            >
                              {item.orgName}
                            </Select.Option>
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
                    onClick={() => this._handleSearch()}
                  >查询
                  </Button>
                  {authState.indexOf('add') !== -1 && (
                    <Button
                      type='primary'
                      onClick={() => {
                        this._showFormModal()
                      }}
                    >新增
                    </Button>
                  )}
                  {authState.indexOf('edit') !== -1 && (
                    <Button
                      type='primary'
                      disabled={selectedRowsLength !== 1}
                      onClick={() => {
                        this._showFormModal({ roomNo: selectedRows[0].roomNo })
                      }}
                    >
                      编辑
                    </Button>
                  )}
                  {authState.indexOf('delete') !== -1 && (
                    <Popconfirm
                      title={`确定要删除该条数据吗？`}
                      onConfirm={() => this._handleDelete(selectedRows)}
                    >
                      <Button
                        type='danger'
                        disabled={selectedRowsLength < 1}
                      >删除
                      </Button>
                    </Popconfirm>
                  )}
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        <Table
          className={styles['c-table-center']}
          columns={this.columns}
          dataSource={list}
          rowKey='roomNo'
          rowSelection={rowSelection}
          onChange={this._onPaginationChange}
          loading={showListSpin}
          pagination={pagination}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    filter: state.sportRoom.filter,
    list: state.sportRoom.roomList,
    page: state.sportRoom.roomPage,
    orgList: state.common.orgList,
    orgLevel: state.common.orgLevel,
    orgId: state.common.orgId,
    auths: state.common.auths,
    showListSpin: state.common.showListSpin,
    preRouter: state.router.pre
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Room))

