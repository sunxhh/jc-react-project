
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { Form, Table, Button, Popconfirm, Select, Divider } from 'antd'

import * as actions from './reduck'
import AddRoom from './AddRoom'
import EditRoom from './EditRoom'
import styles from './style.less'
import { PAG_CONFIG, PAGE_SIZE } from '../../pagination'

const { Item: FormItem } = Form

class MaterRoomManage extends Component {
  _columns = [
    {
      title: '房间号',
      dataIndex: 'roomNum',
      key: 'roomNum',
      width: 80
    },
    {
      title: '所在中心',
      dataIndex: 'centerId',
      key: 'centerId',
      width: 200,
      render: centerId =>
        this.props.careCenterList
          .map(item => {
            if (centerId === item.centerId) {
              return item.centerName
            }
          })
          .filter(value => value !== undefined)
          .join()
    },
    {
      title: '房间状态',
      dataIndex: 'roomStatus',
      key: 'roomStatus',
      width: 80,
      render: text => this.props.roomStatusList.map(item => item.value === text && item.name)
    },
    {
      title: '清理状态',
      dataIndex: 'clearStatus',
      key: 'clearStatus',
      width: 80,
      render: text => this.props.clearStatusList.map(item => item.value === text && item.name)
    },
    {
      title: '使用时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 125,
      render: (text, row) => `${(text && text) || ''}${(row.endTime && ` ~ ${row.endTime}`) || ''}`
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 100,
      render: (text, row) => {
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        const roomStatus = row.roomStatus === '1' || row.roomStatus === '0' ? Boolean(1) : Boolean(0)
        return (
          <span>
            {btnRole.includes('edit') &&
              roomStatus &&
                (
                  <a href='javascript:void(0);' onClick={() => this._showEditClassroom(row.roomId)}>
                    编辑
                  </a>
                )
            }
            {
              btnRole.includes('edit') && btnRole.includes('offline') && roomStatus &&
              <Divider type='vertical' />
            }
            {btnRole.includes('offline') &&
              roomStatus &&
                <Popconfirm
                  title={`确定要${row.offFlag === '0' ? '下架' : '上架'}（${row.roomNum}）吗?`}
                  onConfirm={() => this._handleOffLineAndOnline(row.roomId, row.offFlag)}
                  okText='确定'
                  cancelText='取消'
                >
                  <a href='javascript:void(0);'>{row.offFlag === '0' ? '下架' : '上架'}</a>
                </Popconfirm>
            }
          </span>
        )
      }
    }
  ]

  // 设置 props 默认值
  static defaultProps = {
    list: [],
    pagination: {
      current: 1,
      total: 0,
      pageSize: PAGE_SIZE
    },
    loading: true,
    showAddModal: false,
    showEditModal: false,
    detail: {
      classRoomName: undefined,
      orgId: undefined,
      memo: undefined
    },
    okLoading: false,
    clearStatusList: [],
    roomStatusList: [],
    careCenterList: [],
    auths: []
  }

  // 初始化表格数据
  componentDidMount = () => {
    const { dispatch } = this.props
    dispatch(actions.listConditions({ status: 1 }))
    this._handleAction()
  }

  // 组件销毁时， 重置此组建列表数据为[]，减少内存不 必要的开销。
  componentWillUnmount() {
    this._willUnmountListData()
  }

  _willUnmountListData = () => {
    const { dispatch } = this.props
    dispatch(
      createAction(actions.getListAction)({
        list: [],
        pagination: {
          currentPage: 1,
          totalCount: 0,
          pageSize: PAGE_SIZE
        }
      })
    )
  }

  // 获取查询条件里面的 value 值
  _getQueryParameter = (current = this.props.pagination.current, pageSize = this.props.pagination.pageSize) => {
    return { ...this.props.form.getFieldsValue(), currentPage: current, pageSize: pageSize }
  }

  // 发起列表查询的 ACTION
  _handleAction = (page, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getQueryParameter(page, pageSize)
    dispatch(actions.getList(arg))
  }

  // 点击查询按钮时，根据参数获取表格数据
  _handleSubmit = e => {
    this._handleAction(1)
  }

  // 点击分页时获取表格数据
  _handlePagination = page => {
    if (page.pageSize === this.props.pagination.pageSize) {
      this._handleAction(page.current, page.pageSize)
    } else {
      this._handleAction(1, page.pageSize)
    }
  }

  // 添加 modal 的props
  _handleAddProps = () => {
    return {
      showAddModal: this.props.showAddModal,
      defaultValue: this._getQueryParameter(),
      dispatch: this.props.dispatch,
      okLoading: this.props.okLoading,
      roomStatusList: this.props.roomStatusList,
      careCenterList: this.props.careCenterList,
      handleBack: this._handleBack,
    }
  }

  _handleBack = () => {
    this.props.form.resetFields()
    this.props.dispatch(actions.getList(this._getQueryParameter()))
  }

  // 点击添加按钮
  _showAddClassroom = () => {
    const { dispatch } = this.props
    dispatch(createAction(actions.showAddModalAction)(true))
  }

  // 编辑的 props
  _handleEditProps = () => {
    return {
      showEditModal: this.props.showEditModal,
      dispatch: this.props.dispatch,
      detail: this.props.detail,
      defaultValue: this._getQueryParameter(),
      okLoading: this.props.okLoading,
      roomStatusList: this.props.roomStatusList,
      careCenterList: this.props.careCenterList,
    }
  }

  // 编辑的 modal 初始化
  _showEditClassroom = id => {
    const { dispatch } = this.props
    dispatch(createAction(actions.showEditModalAction)(true))
    dispatch(actions.detail({ roomId: id }))
  }

  // 删除
  _handleOffLineAndOnline = (id, offFlag) => {
    let offFlagValue = ''
    if (offFlag === '0') {
      offFlagValue = '1'
    }
    if (offFlag === '1') {
      offFlagValue = '0'
    }
    this.props.dispatch(actions.offAndOnLine({ roomId: id, offFlag: offFlagValue }, this._getQueryParameter()))
  }

  _filterOption = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  // 组件 jsx 的编写
  render() {
    const { getFieldDecorator } = this.props.form
    const { auths, match } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    return (
      <div className={styles['common-table']}>
        <div className='search-form' id={'selectedArea'}>
          <Form layout='inline'>
            <FormItem label='所在中心'>
              {getFieldDecorator('centerId')(
                <Select
                  placeholder='请选择所在中心'
                  style={{ width: '150px' }}
                  showSearch={true}
                  filterOption={this._filterOption}
                  getPopupContainer={() => document.getElementById('selectedArea')}
                >
                  <Select.Option key='-1' value=''>
                    全部
                  </Select.Option>
                  {this.props.careCenterList.map(item => {
                    return (
                      <Select.Option key={item.centerId} value={item.centerId}>
                        {item.centerName}
                      </Select.Option>
                    )
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem label='房间状态'>
              {getFieldDecorator('roomStatus')(
                <Select
                  placeholder='请选择房间状态'
                  style={{ width: '150px' }}
                  showSearch={true}
                  filterOption={this._filterOption}
                  getPopupContainer={() => document.getElementById('selectedArea')}
                >
                  <Select.Option key='-1' value=''>
                    全部
                  </Select.Option>
                  {this.props.roomStatusList.map(item => {
                    return (
                      <Select.Option key={item.value} value={item.value}>
                        {item.name}
                      </Select.Option>
                    )
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem label='清理状态'>
              {getFieldDecorator('clearStatus')(
                <Select
                  placeholder='请选择清理状态'
                  style={{ width: '150px' }}
                  showSearch={true}
                  filterOption={this._filterOption}
                  getPopupContainer={() => document.getElementById('selectedArea')}
                >
                  <Select.Option key='-1' value=''>
                    全部
                  </Select.Option>
                  {this.props.clearStatusList.map(item => {
                    return (
                      <Select.Option key={item.value} value={item.value}>
                        {item.name}
                      </Select.Option>
                    )
                  })}
                </Select>
              )}
            </FormItem>

            <FormItem className={styles['search-form-item']}>
              <Button type='primary' onClick={this._handleSubmit} icon='search'>
                查询
              </Button>
            </FormItem>
            <FormItem className={styles['search-form-item']}>
              {btnRole.includes('add') && (
                <Button type='primary' onClick={this._showAddClassroom}>
                  新增
                </Button>
              )}
            </FormItem>
            <FormItem className={styles['search-form-item']}>
              {btnRole.includes('delete') && (
                <Button
                  type='primary'
                  className='ant-btn ant-btn-primary'
                  disabled={this.props.selectedRowKeys.length !== 0 ? 0 : 1}
                >
                  <Popconfirm
                    title='确定要删除吗?' onConfirm={() => this._heandleDels()} okText='确定'
                    cancelText='取消'
                  >
                    删除
                  </Popconfirm>
                </Button>
              )}
            </FormItem>
          </Form>
        </div>
        <AddRoom {...this._handleAddProps()} />
        <EditRoom {...this._handleEditProps()} />
        <Table
          columns={this._columns}
          rowKey='roomId'
          loading={this.props.loading}
          dataSource={this.props.list}
          onChange={this._handlePagination}
          locale={{ emptyText: '暂无数据' }}
          pagination={{ ...this.props.pagination, ...PAG_CONFIG }}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    list: state.materClassRoom.list,
    pagination: state.materClassRoom.pagination,
    loading: state.materClassRoom.loading,
    showAddModal: state.materClassRoom.showAddModal,
    showEditModal: state.materClassRoom.showEditModal,
    detail: state.materClassRoom.detail,
    okLoading: state.materClassRoom.okLoading,
    clearStatusList: state.materClassRoom.clearStatusList,
    roomStatusList: state.materClassRoom.roomStatusList,
    careCenterList: state.materClassRoom.careCenterList,
    auths: state.common.auths
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(MaterRoomManage))
