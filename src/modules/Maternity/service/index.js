import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table, Form, Select, Popconfirm, Row, Col, Button, Input, DatePicker, Popover, Divider } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'
import styles from './style.less'
import * as actions from './reduck'
import { MATER_SERVICE_ADD, MATER_SERVICE_SEE, MATER_SERVICE_EDIT } from 'Global/urls'
import { PAG_CONFIG, PAGE_SIZE } from '../pagination'

const FormItem = Form.Item
const { RangePicker } = DatePicker
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const statusType = {
  '0': '无效',
  '1': '有效'
}

class ServiceList extends Component {
  // 默认props
  static defaultProps = {
    list: [],
    page: {
      pageSize: PAGE_SIZE,
      current: '1',
      total: 0,
    },
    serviceClassList: [],
    serviceTypeList: [],
    editInfo: {}
  }

  // 套餐列表
  _columns = [
    {
      key: 'id',
      title: '编号',
      dataIndex: 'id',
      render: (text, record, index) => {
        const { pageSize, current } = this.props.page
        return (
          <span>{(current - 1) * pageSize + index + 1}</span>
        )
      }
    },
    {
      key: 'serviceClass',
      title: '服务分类',
      dataIndex: 'serviceClass',
      render: (text, record) => {
        return (
          <p className={styles['item-content']}>{this._getDictValue(this.props.serviceClassList, record.serviceClass)}</p>
        )
      }
    },
    {
      key: 'serviceType',
      title: '服务类型',
      dataIndex: 'serviceType',
      render: (text, record) => {
        return (
          <p className={styles['item-content']}>{this._getDictValue(this.props.serviceTypeList, record.serviceType)}</p>
        )
      }
    },
    {
      key: 'serviceName',
      title: '服务名称',
      dataIndex: 'serviceName',
      render: (text) => (
        <Popover
          placement='topRight'
          content={<div className={styles['pop']}>{text && text !== 'null' && text}</div>}
          title='服务名称'
        >
          <span>{text && text.length > 15 ? `${text.substring(0, 15)}...` : text}</span>
        </Popover>
      )
    },
    {
      key: 'servicePrice',
      title: '服务价格',
      dataIndex: 'servicePrice',
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'createUserName',
      title: '创建人名称',
      dataIndex: 'createUserName',
    },
    {
      key: 'createTime',
      title: '创建时间',
      dataIndex: 'createTime',
      render: (text, record) => (
        <span>{moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
      )
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render: (text, record) => { return <span>{statusType[record.status]}</span> }
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 160,
      render: (text, record) => {
        let status = record.status
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        const statusHtml = (
          <div className={styles['basic-a']}>
            {
              btnRole.includes('see') &&
              <Link
                to={`${MATER_SERVICE_SEE}/${record.id}`}
              >查看
              </Link>
            }
            {
              btnRole.includes('see') &&
              (btnRole.includes('edit') || btnRole.includes('invalid')) &&
              <Divider type='vertical' />
            }
            {
              btnRole.includes('edit') &&
              <a
                href='javascript:void(0);'
                onClick={() => this._edit(record.id)}
              >编辑
              </a>
            }
          </div>
        )
        return (
          <div className={styles['basic-a']}>
            {statusHtml}
            {
              btnRole.includes('edit') && btnRole.includes('invalid') &&
              <Divider type='vertical' />
            }
            {
              btnRole.includes('invalid') &&
              <Popconfirm
                title={`确定要置为${status === '1' ? '无效' : '有效'}吗？`}
                onConfirm={() => this._handleChangeStatus(record.id, status === '0' ? '1' : '0')}
              >
                <a size='small'>{status === '1' ? <span>置为无效&nbsp;&nbsp;</span> : <span>置为有效&nbsp;&nbsp;</span>}</a>
              </Popconfirm>
            }
          </div>
        )
      }
    }
  ]

  // 生命周期， 初始化表格数据
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(actions.listConditions())
    this._getList()
  }

  componentWillUnmount() {
    if (!location.pathname.startsWith(MATER_SERVICE_EDIT) && !location.pathname.startsWith(MATER_SERVICE_SEE)) {
      this._willUnmountQueryArgData()
      this._willUnmountListData()
    }
  }

  _willUnmountQueryArgData = () => {
    const { dispatch } = this.props
    dispatch(actions.setQueryPar({
      serviceClass: '',
      serviceType: '',
      createTimeStart: '',
      createTimeEnd: '',
      status: '',
      keyWords: '',
    }))
  }

  _willUnmountListData = () => {
    const { dispatch } = this.props
    dispatch(actions.getServiceListAction({
      list: [],
      page: {
        currentPage: 1,
        totalCount: 0,
        pageSize: PAGE_SIZE,
      },
    }))
  }

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getParameter(current, pageSize)
    dispatch(actions.getServiceList(arg))
  }

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.page.current, pageSize = this.props.page.pageSize) => {
    const arg = this.props.form.getFieldsValue()
    return {
      ...arg,
      createTimeStart: arg.serviceTime && arg.serviceTime.length > 0 ? arg.serviceTime[0].format('YYYY-MM-DD HH:mm:ss') : '',
      createTimeEnd: arg.serviceTime && arg.serviceTime.length > 0 ? arg.serviceTime[1].format('YYYY-MM-DD HH:mm:ss') : '',
      currentPage: current,
      pageSize: pageSize,
    }
  }

  // 点击查询
  _handleQuery = () => {
    this._setQueryPar()
    this._getList(1)
  }

  // 点击分页获取列表数据
  _handlePageChange = (page) => {
    if (this.props.page.pageSize === page.pageSize) {
      this._getList(page.current)
    } else {
      this._getList(1, page.pageSize)
    }
  }
  // 获取套餐类型
  _getDictValue = (dictionary, value) => {
    const filterDic = dictionary.filter(dictionary => dictionary.value === value)
    if (filterDic.length > 0) {
      return filterDic[0].name
    }
    return ''
  }

  // 修改套餐状态
  _handleChangeStatus = (id, status) => {
    const req = {
      id: id,
      status: status
    }
    const { page } = this.props
    const arg = this._getParameter(page.current, page.pageSize)
    this.props.dispatch(actions.changeStatus(req, arg))
  }

  _setQueryPar = () => {
    const { dispatch } = this.props
    const arg = this._getParameter()
    dispatch(actions.setQueryPar(arg))
  }

  _edit = (id) => {
    const { history } = this.props
    history.push(`${MATER_SERVICE_EDIT}/${id}`)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { list, showListSpin, page, serviceClassList, serviceTypeList, auths, match } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    return (
      <div>
        <Form
          className='search-form'
        >
          <Row id='rowArea'>
            <Col span={8}>
              <FormItem
                label='服务分类：'
                {...formItemLayout}
              >
                {getFieldDecorator('serviceClass', {
                  initialValue: this.props.initQueryPar.serviceClass
                })(
                  <Select
                    placeholder='服务分类'
                    getPopupContainer={() => document.getElementById('rowArea')}
                  >
                    <Select.Option value=''>全部</Select.Option>
                    {
                      serviceClassList.map((itme) => {
                        return (
                          <Select.Option
                            value={itme.value}
                            key={itme.value}
                          >
                            {itme.name}
                          </Select.Option>
                        )
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label='服务类型：'
                {...formItemLayout}
              >
                {getFieldDecorator('serviceType', {
                  initialValue: this.props.initQueryPar.serviceType
                })(
                  <Select
                    placeholder='服务类型'
                    getPopupContainer={() => document.getElementById('rowArea')}
                  >
                    <Select.Option value=''>全部</Select.Option>
                    {
                      serviceTypeList.map((itme) => {
                        return (
                          <Select.Option
                            value={itme.value}
                            key={itme.value}
                          >
                            {itme.name}
                          </Select.Option>
                        )
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label='状态：'
                {...formItemLayout}
              >
                {getFieldDecorator('status', {
                  initialValue: this.props.initQueryPar.status
                })(
                  <Select
                    placeholder='状态'
                    getPopupContainer={() => document.getElementById('rowArea')}
                  >

                    <Select.Option value=''>全部</Select.Option>
                    {
                      Object.keys(statusType).map(index => {
                        return (
                          <Select.Option
                            value={index}
                            key={index}
                          >
                            {statusType[index]}
                          </Select.Option>
                        )
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label='创建时间：'
                {...formItemLayout}
              >
                {getFieldDecorator('serviceTime', {
                  initialValue: this.props.initQueryPar.serviceTime
                })(
                  <RangePicker
                    style={{ width: '100%' }}
                    format='YYYY-MM-DD'
                    // showTime={{ format: 'HH:mm:ss' }}
                    getCalendarContainer={() => document.getElementById('rowArea')}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label='关键词：'
                {...formItemLayout}
              >
                {getFieldDecorator('keyWords', {
                  initialValue: this.props.initQueryPar.keyWords
                })(
                  <Input
                    style={{ marginLeft: '20px' }}
                    placeholder='请输入关键词'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem className={styles['operate-btn']}>
                <Button
                  type='primary'
                  title='点击查询'
                  onClick={this._handleQuery}
                >
                  查询
                </Button>
                {
                  btnRole.indexOf('add') !== -1 &&
                  <Link to={`${MATER_SERVICE_ADD}`}>
                    <Button
                      type='primary'
                      title='新增服务'
                    >
                      新增服务
                    </Button>
                  </Link>
                }
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div className={styles['table-wrapper']}>
          <Table
            className={styles['c-table-center']}
            columns={this._columns}
            rowKey='id'
            dataSource={list}
            loading={showListSpin}
            onChange={this._handlePageChange}
            pagination={{
              ...PAG_CONFIG,
              ...page,
            }}
          />
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    list: state.service.list,
    page: state.service.page,
    serviceClassList: state.service.serviceClassList,
    serviceTypeList: state.service.serviceTypeList,
    auths: state.common.auths,
    initQueryPar: state.service.initQueryPar,
    showListSpin: state.common.showListSpin,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ServiceList))
