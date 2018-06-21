import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
import { Card, Row, Col, Table, Button, Select, Input, Modal, InputNumber, Form } from 'antd'
import { showModalForm } from 'Components/modal/ModalForm'
import { genPagination } from 'Utils/helper'
import storage from 'Utils/storage'
import paramsUtil from 'Utils/params'
import Module from './module'
import { MEMBER_INTEGRAL } from 'Global/urls'
import styles from './styles.less'

const { Meta } = Card
const FormItem = Form.Item
const Option = Select.Option
const TextArea = Input.TextArea
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
}

class Detail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      userName: '',
      userPhone: '',
      overdue: '',
      userId: '',
      changeCode: '',
      visible: false,
      isMember: '',
      orgCode: storage.get('userInfo') && storage.get('userInfo').orgCode
    }
  }

  componentDidMount () {
    const { dispatch } = this.props
    const params = paramsUtil.url2json(location)
    this.setState({
      userName: params.userName,
      userPhone: params.userPhone,
      overdue: params.overdue,
      userId: params.userId,
    })

    // 积分概况
    dispatch(Module.actions.getIntegraInfo({
      userId: params.userId,
      orgCode: this.state.orgCode === 'jccy' ? '' : this.state.orgCode
    })).then(res => {
      if (res === 0) {
        const { getIntegraInfo } = this.props
        this.setState({
          changeCode: this.state.orgCode === 'jccy' ? getIntegraInfo[0] && getIntegraInfo[0].orgCode : this.state.orgCode
        })
        dispatch(Module.actions.getIntegraDetail({
          orgCode: this.state.orgCode === 'jccy' ? getIntegraInfo[0] && getIntegraInfo[0].orgCode : this.state.orgCode,
          userId: params.userId,
          currentPage: 1,
          pageSize: 10,
        }))
        // 判断是否过期
        dispatch(Module.actions.isMember({
          userId: params.userId,
          orgCode: this.state.orgCode === 'jccy' ? getIntegraInfo[0] && getIntegraInfo[0].orgCode : this.state.orgCode
        })).then(res => {
          console.log(res)
          if (res !== '') {
            this.setState({
              isMember: res
            })
          }
        })
      }
    })
  }

  // 积分弹窗
  _showModal = () => {
    const { dispatch } = this.props
    dispatch(Module.actions.getRuleList({
      orgCode: this.state.changeCode,
      type: ''
    }))
    this.setState({
      visible: true
    })
  }

  // 积分添加
  _handleOk = (e) => {
    const { dispatch, form } = this.props
    const { changeCode } = this.state
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        dispatch(Module.actions.addIntegra({
          userId: this.state.userId,
          ruleCode: values.ruleTempletCode,
          orgCode: changeCode,
          originPoint: values.originPoint
        })).then(res => {
          if (res === 0) {
            // 积分明细
            dispatch(Module.actions.getIntegraDetail({
              orgCode: changeCode,
              userId: this.state.userId,
              currentPage: 1,
              pageSize: 10,
            }))
            // 积分概况
            dispatch(Module.actions.getIntegraInfo({
              userId: paramsUtil.url2json(location).userId,
              orgCode: this.state.orgCode === 'jccy' ? '' : this.state.orgCode
            }))
          }
        })

        form.resetFields(['originPoint', 'ruleTempletCode', 'orgCode'])
        this.setState({
          visible: false,
        })
      }
    })
  }

  _handleCancel = (e) => {
    this.setState({
      visible: false,
    })

    this.props.form.resetFields(['originPoint', 'ruleTempletCode', 'orgCode'])
  }
  // 表格项
  _columns = [
    {
      title: '积分日期',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '明细',
      dataIndex: 'sourceDesc',
      key: 'sourceDesc'
    },
    {
      title: '所属产业',
      dataIndex: 'orgName',
      key: 'orgName',
    },
    {
      title: '积分数',
      dataIndex: 'originPoint',
      key: 'originPoint',
      render: (text, record, index) => {
        return (
          <div>
            { parseInt(record.optionType) === 1 ? <span style={{ color: '#690' }}> {'+' + text }</span> : <span style={{ color: '#f00' }}> {'-' + text }</span> }
          </div>
        )
      }
    },
    {
      title: '积分有效期',
      dataIndex: 'effective',
      key: 'effective',
      render: (text, record) => {
        return (
          <span>{record.effectiveDateType === '1' ? '永久有效' : record.effectiveDate}</span>
        )
      }
    }
  ]

  // 积分扣除
  _cutIntegralModal = (e) => {
    const userName = (this.state.userName && this.state.userName !== 'null') ? this.state.userName : ''
    e.preventDefault()
    showModalForm({
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 }
      },
      title: '积分扣除',
      fields: [
        {
          id: 'name',
          props: {
            label: '会员用户'
          },
          element: (
            <span>{userName}</span>
          )
        },
        {
          id: 'desc',
          props: {
            label: '扣除事项'
          },
          options: {
            rules: [{
              required: true,
              message: '请输入积分扣除原因!',
            }]
          },
          element: (
            <TextArea
              placeholder='请输入积分扣除原因'
              rows={2}
              maxLength='30'
            />
          )
        },
        {
          id: 'originPoint',
          props: {
            label: '积分数'
          },
          options: {
            rules: [{
              required: true,
              pattern: /^[1-9][0-9]*$/,
              message: '请输入积分数',
            }]
          },
          element: (
            <InputNumber
              style={{ width: '100%' }}
              maxLength='9'
              min={1}
              placeholder='请输入积分数'
            />
          )
        }
      ],
      onOk: values => {
        const { dispatch } = this.props
        const { userId, changeCode } = this.state
        dispatch(Module.actions.cutIntegra({
          userId: userId,
          desc: values.desc,
          orgCode: changeCode,
          originPoint: values.originPoint
        })).then(res => {
          if (res === 0) {
            // 积分明细
            dispatch(Module.actions.getIntegraDetail({
              orgCode: changeCode,
              userId: userId,
              currentPage: 1,
              pageSize: 10,
            }))
            // 积分概况
            dispatch(Module.actions.getIntegraInfo({
              userId: userId,
              orgCode: this.state.orgCode === 'jccy' ? '' : this.state.orgCode
            }))
          }
        })
      }
    })
  }

  // 点击分页获取列表数据
  _handlePageChange = (pagination) => {
    const { dispatch } = this.props
    const { changeCode, userId, orgCode } = this.state
    const { current, pageSize } = pagination
    dispatch((Module.actions.getIntegraDetail({
      orgCode: changeCode !== '' ? changeCode : orgCode === 'jccy' ? this.props.getIntegraInfo[0].orgCode : orgCode,
      userId: userId,
      currentPage: current,
      pageSize: pageSize,
    })))
  }

  // 顶级产业下拉查询
  _changeSelect = (e) => {
    const { dispatch, getIntegraPage } = this.props
    dispatch((Module.actions.getIntegraDetail({
      orgCode: e,
      userId: this.state.userId,
      current: getIntegraPage.currentPage,
      pageSize: getIntegraPage.pageSize,
    })))
    // 判断是否过期
    dispatch(Module.actions.isMember({
      userId: this.state.userId,
      orgCode: e,
    })).then(res => {
      console.log(res)
      if (res !== '') {
        this.setState({
          isMember: res
        })
      }
    })
    this.setState({
      changeCode: e
    })
  }

  render() {
    const { auths } = this.props
    const { getFieldDecorator } = this.props.form
    const {
      getIntegraInfo,
      getIntegraList,
      showListSpin,
      getIntegraPage,
    } = this.props
    const pagination = genPagination(getIntegraPage)
    const btnRole = auths[MEMBER_INTEGRAL] ? auths[MEMBER_INTEGRAL] : []
    return (
      <div>
        <Card
          title='基本信息'
          extra={<a href='javascript:;' onClick={() => history.go(-1)} className={styles['goback']}>＜返回</a>}
          style={{ marginBottom: 40 }}
        >
          <Row>
            <Col span={6}>
              <span className={styles['info-item']}>姓名：</span>{this.state.userName === 'null' ? '' : this.state.userName}
            </Col>
            <Col span={6}>
              <span className={styles['info-item']}>联系方式：</span>{this.state.userPhone === 'null' ? '' : this.state.userPhone}
              {
                this.state.isMember === true ? '' : <span>&nbsp;&nbsp;(会员已过期)</span>
              }
            </Col>
          </Row>
        </Card>
        <Card
          title='积分概况'
          style={{ marginBottom: 40 }}
        >
          <Row>
            {
              getIntegraInfo && getIntegraInfo.map((item) => {
                return (
                  <Col
                    key={item.orgName}
                    span={6}
                  >
                    <Card
                      title=''
                      style={{ marginBottom: 20, width: '94%' }}
                    >
                      <Meta
                        title={item.orgName}
                        description={<p><span style={{ color: '#690' }}>{item.totalPoint}</span>会员积分/<span style={{ color: '#690' }}>{item.effectivePoint}</span>可用积分</p>}
                      />
                    </Card>
                  </Col>
                )
              })
            }
          </Row>
        </Card>
        <Card
          id='select'
          title={
            <span>
              积分明细
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Select
                style={{ width: 200 }}
                value={this.state.changeCode}
                disabled={this.state.orgCode === 'jccy' ? Boolean(0) : Boolean(1)}
                getPopupContainer={() => document.getElementById('select')}
                onChange={e => this._changeSelect(e)}
                placeholder='请选择产业'
              >
                {
                  getIntegraInfo && getIntegraInfo.map((item) => {
                    return (
                      <Option
                        key={item.orgCode}
                        value={item.orgCode}
                      >
                        {item.orgName}
                      </Option>
                    )
                  })
                }
              </Select>
            </span>
          }
          extra={
            <span>
              {
                this.state.isMember === true ? (
                  <span>
                    {
                      btnRole.includes('addPoint') &&
                      <Button
                        type='primary'
                        style={{ marginBottom: 4 }}
                        onClick={this._showModal}
                      >
                        +积分录入
                      </Button>
                    }
                    {
                      btnRole.includes('delPoint') &&
                      <Button
                        style={{ margin: '4px 15px 0' }}
                        type='primary'
                        onClick={this._cutIntegralModal}
                      >
                        -积分扣除
                      </Button>
                    }
                  </span>
                ) : null
              }
            </span>
          }
        >
          <Table
            bordered
            columns={this._columns}
            className={styles['c-table-center']}
            dataSource={getIntegraList}
            locale={{
              emptyText: '暂无数据'
            }}
            loading={showListSpin}
            onChange={this._handlePageChange}
            pagination={pagination}
          />
        </Card>
        <Modal
          title='积分录入'
          visible={this.state.visible}
          onOk={this._handleOk}
          onCancel={this._handleCancel}
        >
          <Form
            id='filter-form'
          >
            <Row>
              <Col>
                <FormItem
                  {...formItemLayout}
                  label='会员用户'
                >
                  {getFieldDecorator('name')(
                    <span>{(this.state.userName && this.state.userName !== 'null') ? this.state.userName : ''}</span>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem
                  {...formItemLayout}
                  label='积分来源'
                >
                  {getFieldDecorator('ruleTempletCode', {
                    rules: [{
                      required: true,
                      message: '请选择积分来源',
                    }]
                  })(
                    <Select
                      placeholder='请选择积分来源'
                    >
                      {
                        this.props.ruleList && this.props.ruleList.map(item => {
                          return (
                            <Option
                              key={item.ruleTempletCode}
                              value={item.ruleTempletCode}
                            >
                              {item.ruleName}
                            </Option>
                          )
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem
                  {...formItemLayout}
                  label='积分数'
                >
                  {getFieldDecorator('originPoint', {
                    rules: [{
                      required: true,
                      pattern: /^[1-9][0-9]*$/,
                      message: '请输入积分数',
                    }]
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      maxLength='9'
                      min={1}
                      placeholder='请输入积分数'
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state['memberCenter.integral'],
    showListSpin: state['common.showListSpin'],
    auths: state['common.auths'],
  }
}
export default connect(['common.showListSpin', 'memberCenter.integral', 'common.auths'], mapStateToProps)(Form.create()(Detail))
