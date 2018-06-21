/**
 * author yanchong
 *
 * This is room change set list components
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { Link } from 'react-router-dom'
import { Form, Table, Button, Select, Input, Divider } from 'antd'
import Ellipsis from 'Components/Ellipsis'

import * as urls from 'Global/urls'
import * as actions from './reduck'
import styles from './style.less'
import { PAG_CONFIG, PAGE_SIZE } from '../../pagination'
import AuditModal from './AuditModal'

const { Item: FormItem } = Form

class ChangeRecord extends Component {
  _columns = [
    {
      title: '所在中心',
      dataIndex: 'centerId',
      key: 'centerId',
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
      title: '会员姓名',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: '入住时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text) => {
        return (
          <Ellipsis
            length={10}
            tooltip={true}
          >
            {text || ''}
          </Ellipsis>
        )
      }
    },
    {
      title: '原住房',
      dataIndex: 'roomNum',
      key: 'roomNum',
    },
    {
      title: '床位护士',
      dataIndex: 'nurseUser',
      key: 'nurseUser',
    },
    {
      title: '审核人',
      dataIndex: 'auditUser',
      key: 'auditUser',
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      render: key =>
        this.props.auditStatusList.map(item => {
          if (item.value === key) {
            return item.name
          }
        })
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => {
        return (
          <Ellipsis
            length={10}
            tooltip={true}
          >
            {text}
          </Ellipsis>
        )
      },
    },
    {
      title: '创建用户',
      dataIndex: 'createUser',
      key: 'createUser',
    },
    {
      title: '审核备注',
      dataIndex: 'remark',
      key: 'remark',
      render: text => {
        return (
          <Ellipsis
            length={10}
            tooltip={true}
          >
            {text}
          </Ellipsis>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      render: (text, row) => {
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []

        return (
          <span>
            {
              row.auditStatus === '0' &&
              btnRole.includes('edit') && (
                <Link to={`${urls.MATER_ROOM_CHANGE_RECORD_EDIT}/${row.recordAuditId}`}>编辑</Link>
              )
            }
            {
              row.auditStatus === '0' && btnRole.includes('edit') && btnRole.includes('examine') &&
              <Divider type='vertical' />
            }
            {row.auditStatus === '0' &&
              btnRole.includes('examine') &&
                (
                  <a
                    href='javascript:void(0);'
                    onClick={() =>
                      this._audit({
                        recordAuditId: row.recordAuditId,
                        recordId: row.recordId,
                        recordProcessId: row.newRecordProcessId,
                        type: row.type
                      })}
                  >
                    审核
                  </a>
                )
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
    clearStatusList: [],
    roomStatusList: [],
    careCenterList: [],
    auditStatusList: [],
    auths: [],
    showAuditModal: false,
    okLoading: false,
    auditProps: {}
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

  _filterOption = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  _audit = idObj => {
    const { dispatch } = this.props
    dispatch(createAction(actions.swtichShowAuditModal)(true))
    dispatch(createAction(actions.auditPropsAction)(idObj))
  }

  // 组件 jsx 的编写
  render() {
    const { getFieldDecorator } = this.props.form
    // const { auths, path } = this.props
    // const btnRole = auths[path] ? auths[path] : []

    return (
      <div className={styles['common-table']}>
        <div className='search-form'>
          <Form layout='inline' id={'selectedArea'}>
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
            <FormItem
              style={{ marginTop: '3px' }}
            >{getFieldDecorator('customerName')(<Input placeholder='关键词' />)}
            </FormItem>
            <FormItem className={styles['search-form-item']}>
              <Button type='primary' onClick={this._handleSubmit} icon='search'>
                查询
              </Button>
            </FormItem>
          </Form>
        </div>
        <AuditModal
          showAuditModal={this.props.showAuditModal}
          dispatch={this.props.dispatch}
          defaultValue={this._getQueryParameter()}
          okLoading={this.props.okLoading}
          auditProps={this.props.auditProps}
        />
        <Table
          columns={this._columns}
          rowKey={(item, index) => index}
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
    list: state.materChangeRoom.list,
    pagination: state.materChangeRoom.pagination,
    loading: state.materChangeRoom.loading,
    clearStatusList: state.materChangeRoom.clearStatusList,
    roomStatusList: state.materChangeRoom.roomStatusList,
    careCenterList: state.materChangeRoom.careCenterList,
    auditStatusList: state.materChangeRoom.auditStatusList,
    showAuditModal: state.materChangeRoom.showAuditModal,
    okLoading: state.materChangeRoom.okLoading,
    auditProps: state.materChangeRoom.auditProps,
    auths: state.common.auths
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ChangeRecord))
