import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Table, Form, Row, Col, Popover, Select, Input, Divider } from 'antd'
import Ellipsis from 'Components/Ellipsis'
import {
  getContractList,
  getListConditions,
  changeStatus,
  setQueryPar,
  resetQueryPar
} from './reduck'
import styles from './styles.less'
import { isEmpty } from 'Utils/lang'
import { showModalForm } from 'Components/modal/ModalForm'
import { MATER_CONTRACT_EDIT, MATER_CONTRACT_DETAIL, MATER_CONTRACT_ADD } from 'Global/urls'
import { genPagination } from 'Utils/helper'

const FormItem = Form.Item
const SelectOption = Select.Option

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

class ContractList extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  _columns = [
    {
      key: 'key',
      title: '编号',
      dataIndex: 'key',
      render: (text, record, index) => {
        const { pageSize, current } = this.props.page
        return (
          <span>{(current - 1) * pageSize + index + 1}</span>
        )
      }
    },
    {
      key: 'centerName',
      title: '所在中心',
      dataIndex: 'centerName',
      render: (text, record) => (
        <span>{this._getCenterName(record.centerId)}</span>
      )
    },
    {
      key: 'contractNum',
      title: '合同编号',
      dataIndex: 'contractNum',
      render: (text) => (
        <Ellipsis
          length={12}
          tooltip={true}
        >
          {text && text !== 'null' && text}
        </Ellipsis>
      )
    },
    {
      key: 'customerName',
      title: '妈妈姓名',
      dataIndex: 'customerName',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'comboName',
      title: '套餐名称',
      dataIndex: 'comboName',
      render: (text) => (
        <Ellipsis
          length={12}
          tooltip={true}
        >
          {text || ''}
        </Ellipsis>
      )
    },
    {
      key: 'contractStatus',
      title: '合同状态',
      dataIndex: 'contractStatus',
      render: (text, record) => (
        <span>{this._getStatusName(record.contractStatus)}</span>
      )
    },
    {
      key: 'roomNum',
      title: '预定房间',
      dataIndex: 'roomNum',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'stayDays',
      title: '入住天数',
      dataIndex: 'stayDays',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'amount',
      title: '合同金额',
      dataIndex: 'amount',
      render: (text) => (
        <span>{text && text !== 'null' && `¥ ${this._formatPrice(text)}`}</span>
      )
    },
    {
      key: 'signingTime',
      title: '创建时间',
      dataIndex: 'signingTime',
      render: (text) => {
        return (
          <Popover
            placement='topRight'
            content={<div className={styles['pop']}>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</div>}
            title='创建时间'
          >
            <span>{moment(text).format('YYYY-MM-DD')}</span>
          </Popover>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 200,
      render: (text, record) => {
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        return (
          <div className={styles['table-ope']}>
            {
              btnRole.includes('check') &&
              <a
                href='javascript:;'
                onClick={(e) => { this._detail(e, record) }}
              >查看
              </a>
            }
            {
              btnRole.includes('check') &&
              (btnRole.includes('change') || btnRole.includes('changeStatus')) &&
              <Divider type='vertical' />
            }
            {
              btnRole.includes('change') &&
              <a
                href='javascript:;'
                onClick={(e) => { this._edit(e, record) }}
              >变更合同
              </a>
            }
            {
              btnRole.includes('change') &&
              btnRole.includes('changeStatus') &&
              <Divider type='vertical' />
            }
            {
              btnRole.includes('changeStatus') &&
              <a
                href='javascript:;'
                onClick={(e) => { this._handleChangeStatus(e, record) }}
              >变更合同状态
              </a>
            }
          </div>
        )
      }
    }
  ]

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getParameter(current, pageSize)
    dispatch(getContractList(arg))
  }

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.page.current, pageSize = this.props.page.pageSize) => {
    const { dispatch, form } = this.props
    const arg = form.getFieldsValue()
    dispatch(setQueryPar(arg))
    return {
      ...arg,
      currentPage: current,
      pageSize: pageSize,
    }
  }

  // 点击查询
  _handleQuery = () => {
    this._getList(1)
  }

  // 获取表单提交参数
  _getParam = (values, data) => {
    if (data && data.id) {
      values['id'] = data.id
    }
    values['planDate'] = moment(values['planDate']).format('YYYY-MM-DD')
    return values
  }

  // 获取中心名称
  _getCenterName = (centerId) => {
    const { centerList } = this.props
    const center = centerList.find((item) => {
      return centerId === item.centerId
    })
    return center && center.centerName ? center.centerName : ''
  }

  // 获取合同状态
  _getStatusName = (statusId) => {
    const { contractStatusList } = this.props
    const status = contractStatusList.find((item) => {
      return statusId === item.value
    })
    return status && status.name ? status.name : ''
  }

  // 变更合同状态
  _handleChangeStatus = (e, record) => {
    const { contractStatusList } = this.props
    showModalForm({
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 }
      },
      title: '变更合同状态',
      fields: [
        {
          id: 'contractStatus',
          props: {
            label: '合同状态：'
          },
          options: {
            rules: [{
              required: true,
              message: '请选择合同状态!'
            }]
          },
          element: (
            <Select
              allowClear={false}
              optionLabelProp='title'
              filterOption={false}
              placeholder='请选择合同状态'
              getPopupContainer={() => document.getElementsByClassName('ant-modal-wrap')[0]}
            >
              {!isEmpty(contractStatusList) ? contractStatusList.map(d => (
                <SelectOption
                  key={d.value}
                  value={d.value}
                  title={d.name}
                >
                  {d.name}
                </SelectOption>
              )) : null}
            </Select>
          )
        }
      ],
      onOk: values => {
        const { dispatch } = this.props
        return dispatch(changeStatus({ ...values, contractId: record.contractId })).then(res => {
          if (res.status === 'success') {
            this._getList()
            return res
          }
        })
      }
    })
  }

  // 变更合同
  _edit = (e, record) => {
    const { history } = this.props
    history.push(`${MATER_CONTRACT_EDIT}/${record.contractId}`)
  }

  // 查看合同
  _detail = (e, record) => {
    const { history } = this.props
    history.push(`${MATER_CONTRACT_DETAIL}/${record.contractId}`)
  }

  // 点击分页获取列表数据
  _handlePageChange = (pages) => {
    const { page } = this.props
    const arg = { current: page && page.pageSize !== pages.pageSize ? 1 : pages.current, pageSize: pages.pageSize }
    this._getList(arg.current, arg.pageSize)
  }

  // 格式化价格
  _formatPrice(x) {
    let f = parseFloat(x)
    if (isNaN(f)) {
      return ''
    }
    f = Math.round(x * 100) / 100
    return f
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(resetQueryPar())
  }

  // 生命周期， 初始化表格数据
  componentDidMount() {
    const { dispatch } = this.props
    document.querySelector('.ant-layout-content').style.background = '#f8f8f8'
    dispatch(getListConditions({ status: 0 })).then(() => {
      this._getList()
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { list, showListSpin, initQueryPar, page, auths, match, contractStatusList, centerList } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    const pages = genPagination({ ...page, records: page.total, pageNo: page.current })
    return (
      <div>
        <Form
          className={styles['parameter-wrap']}
        >
          <Row id='rowArea'>
            <Col span={6}>
              <FormItem
                label='所在中心：'
                {...formItemLayout}
              >
                {getFieldDecorator('centerId', {
                  initialValue: initQueryPar.centerId || ''
                })(
                  <Select
                    placeholder='请选择所在中心'
                    getPopupContainer={() => document.getElementById('rowArea')}
                  >
                    <SelectOption
                      key=''
                      value=''
                      title='全部'
                    >
                      全部
                    </SelectOption>
                    {
                      !isEmpty(centerList) && centerList.map(item => (
                        <SelectOption
                          key={item.centerId}
                          value={item.centerId}
                        >
                          {item.centerName}
                        </SelectOption>
                      ))
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label='合同状态：'
                {...formItemLayout}
              >
                {getFieldDecorator('contractStatus', {
                  initialValue: initQueryPar.contractStatus || '',
                })(
                  <Select
                    allowClear={false}
                    optionLabelProp='title'
                    filterOption={false}
                    placeholder='请选择合同状态'
                    getPopupContainer={() => document.getElementById('rowArea')}
                  >
                    <SelectOption
                      key=''
                      value=''
                      title='全部'
                    >
                      全部
                    </SelectOption>
                    {!isEmpty(contractStatusList) ? contractStatusList.map(d => (
                      <SelectOption
                        key={d.value}
                        value={d.value}
                        title={d.name}
                      >
                        {d.name}
                      </SelectOption>
                    )) : null}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                {...formItemLayout}
              >
                {getFieldDecorator('keyword', {
                  initialValue: initQueryPar.keyword,
                })(
                  <Input
                    style={{ marginLeft: '20px' }}
                    placeholder='关键词'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
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
                  <Link to={`${MATER_CONTRACT_ADD}`}>
                    <Button
                      type='primary'
                      title='新增合同'
                    >
                    新增合同
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
            rowKey='contractId'
            dataSource={list}
            loading={showListSpin}
            pagination={pages}
            onChange={this._handlePageChange}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.contract.contractList,
    page: state.contract.page,
    centerList: state.contract.listConditions.careCenterList,
    contractStatusList: state.contract.listConditions.contractStatusList,
    initQueryPar: state.contract.initQueryPar,
    auths: state.common.auths,
    showListSpin: state.common.showListSpin,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ContractList))
