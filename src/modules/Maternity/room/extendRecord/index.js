import React, { Component } from 'react'
import { Button, Select, Form, Row, Col, Table, Input, Radio, Divider } from 'antd'
import { connect } from 'react-redux'
// import styles from './style.less'
import * as actions from './reduck'
import * as urls from 'Global/urls'
import { Link } from 'react-router-dom'
import { PAG_CONFIG, PAGE_SIZE } from '../../pagination'
import { showModalForm } from '../../../../components/modal/ModalForm'

const FormItem = Form.Item
const Option = Select.Option

class extendRecord extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initialReq: {
        currentPage: 1,
        pageSize: PAGE_SIZE,
        centerId: '',
        roomStatus: '',
        customerName: '',
      }
    }
  }

  _getStatusValue = (status, arg) => {
    let statusName = ''
    status.map(item => {
      if (item.value === arg) {
        statusName = item.name
      }
    })
    return statusName
  }

  _columns = [{
    title: '所在中心',
    dataIndex: 'centerId',
    render: text => {
      return this.props.AllListCondition.careCenterList && this.props.AllListCondition.careCenterList.filter(center => {
        return center.centerId === text
      }).map(item => {
        return (
          <span key={item.id}>{item.centerName}</span>
        )
      })
    }
  }, {
    title: '会员姓名',
    dataIndex: 'customerName',
  }, {
    title: '房间号',
    dataIndex: 'roomNum',
  }, {
    title: '续房天数',
    dataIndex: 'continuedDateNum',
  }, {
    title: '床位护士',
    dataIndex: 'nurseUser',
  }, {
    title: '审核人',
    dataIndex: 'auditUser',
  }, {
    title: '审核状态',
    dataIndex: 'auditStatus',
    render: text => {
      return <span>{this._getStatusValue(this.props.AllListCondition.auditStatusList || [], text)}</span>
    }
  }, {
    title: '审核备注',
    dataIndex: 'remark',
  }, {
    title: '创建日期',
    dataIndex: 'createTime',
  }, {
    title: '创建人',
    dataIndex: 'createUser',
  }, {
    title: '操作',
    dataIndex: 'option',
    render: (text, record) => {
      const { auths, match } = this.props
      const btnRole = auths[match.path] ? auths[match.path] : []
      const statusHtml = (
        <span>
          {
            btnRole.includes('see') &&
            <Link
              to={`materRoomExtendRecord/extend/${record.recordAuditId}/see`}
            >查看
            </Link>
          }
          {
            btnRole.includes('see') &&
            (btnRole.includes('edit') || btnRole.includes('examine')) && record.auditStatus === '0' &&
            <Divider type='vertical' />
          }
          {
            btnRole.includes('edit') && record.auditStatus === '0' &&
            <Link
              to={`materRoomExtendRecord/extend/${record.recordAuditId}/edit`}
            >编辑
            </Link>
          }
          {
            btnRole.includes('edit') &&
            btnRole.includes('examine') && record.auditStatus === '0' &&
            <Divider type='vertical' />
          }
          {
            btnRole.includes('examine') && record.auditStatus === '0' &&
            <a
              onClick={() => { this.showAuditModal(record) }}
            >审核
            </a>
          }
        </span>
      )
      return statusHtml
    }
  }]

  showAuditModal = record => {
    showModalForm({
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 }
      },
      title: '审核',
      fields: [
        {
          id: 'auditStatus',
          props: {
            label: '审核状态'
          },
          options: {
            rules: [{
              required: true,
              message: '请选择审核状态'
            }]
          },
          element: (
            <Radio.Group>
              <Radio value='1'>审核通过</Radio>
              <Radio value='2'>驳回</Radio>
            </Radio.Group>
          )
        },
        {
          id: 'remark',
          props: {
            label: '备注'
          },
          options: {},
          element: (
            <Input.TextArea placeholder='请输入备注' maxLength='500' />
          )
        },
      ],
      onOk: (values) => {
        this.props.dispatch(actions.auditExtendRoom({
          ...values,
          type: record.type,
          recordAuditId: record.recordAuditId,
          recordId: record.recordId,
          recordProcessId: record.newRecordProcessId,
        }, this.state.initialReq))
      }
    })
  }

  componentDidMount () {
    const args = this.props.saveData
    this.props.dispatch(actions.getExtendRecordList(args))
    this.props.dispatch(actions.getListConditions({ status: '0' }))
  }

  componentWillUnmount () {
    if (!location.pathname.startsWith(`${urls.MATER_ROOM_EXTEND_RECORD_INDEX}`)) {
      this.props.dispatch(actions.saveQueryData({ currentPage: 1, pageSize: PAGE_SIZE }))
    }
  }
  // 获取查询数据
  _getHandleData = (current = this.state.initialReq.currentPage, pageSize = this.state.initialReq.pageSize) => {
    const args = { ...this.props.form.getFieldsValue(), currentPage: current, pageSize: pageSize }
    this.setState({ initialReq: args }, () => {
      this.props.dispatch(actions.getExtendRecordList(this.state.initialReq))
      this.props.dispatch(actions.saveQueryData(this.state.initialReq))
    })
    return args
  }

  // 查询 列表数据
  _queryMemExtendRecord = () => {
    this._getHandleData(1)
  }

  // 点击分页时获取表格数据
  _handlePagination = page => {
    if (page.pageSize === this.state.initialReq.pageSize) {
      this._getHandleData(page.current, page.pageSize)
    } else {
      this._getHandleData(1, page.pageSize)
    }
  }

  render() {
    const { extendRecordList, AllListCondition, saveData, showListSpin } = this.props
    const { getFieldDecorator } = this.props.form
    const centerList = AllListCondition.careCenterList
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    }
    const pagination = extendRecordList.page || {}
    const paginationData = {
      current: pagination.currentPage,
      total: pagination.totalCount,
      pageSize: pagination.pageSize,
      ...PAG_CONFIG,
    }
    return (
      <div
        id='statusSelect'
        style={{ position: 'relative' }}
      >
        <Form className='search-form'>
          <Row>
            <Col span={6}>
              <FormItem
                {...formItemLayout}
                label={'所在中心'}
              >
                {getFieldDecorator('centerId', {
                  initialValue: saveData && saveData.centerId || ''
                })(
                  <Select
                    getPopupContainer={() => document.getElementById('statusSelect')}
                  >
                    <Option key='' value=''>全部</Option>
                    {
                      centerList && centerList.map(centerList => {
                        return (
                          <Option
                            key={centerList.centerId}
                            value={centerList.centerId}
                          >{centerList.centerName}
                          </Option>
                        )
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                {...formItemLayout}
              >
                {getFieldDecorator('customerName', {
                  initialValue: saveData && saveData.customerName || ''
                })(
                  <Input
                    style={{ marginLeft: '20px' }}
                    placeholder='关键词'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <Button
                type='primary'
                onClick={() => { this._queryMemExtendRecord() }}
              >
                查询
              </Button>
            </Col>
          </Row>
        </Form>
        <Table
          columns={this._columns}
          dataSource={extendRecordList ? extendRecordList.result : []}
          rowKey={(item, index) => index}
          loading={showListSpin}
          pagination={paginationData}
          onChange={this._handlePagination}
        />
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    extendRecordList: state.extendRecordList.extendRecordList,
    AllListCondition: state.extendRecordList.getListConditions,
    saveData: state.extendRecordList.getSaveData,
    auths: state.common.auths,
    showListSpin: state.common.showListSpin,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(extendRecord))
