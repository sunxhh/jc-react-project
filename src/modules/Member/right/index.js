import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
import { Table, Button, Form, Card, Tree, message, Popconfirm, Modal, Row, Col, InputNumber, Input, Checkbox, Select } from 'antd'
// import * as urls from 'Global/urls'
import styles from './styles.less'
import { isEmpty, isArray, trim } from 'Utils/lang'
import { getUrlParam } from 'Utils/params'
import Module from './module'
import ParentModule from '../module'

const FormItem = Form.Item
const Option = Select.Option
const CheckboxGroup = Checkbox.Group

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 16 },
}

const formItemLayout1 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}
// 是否启用
const activated = {
  'Y': '启用',
  'N': '未启用'
}
class RightList extends Component {
  state = {
    orgList: [],
    currentOrgId: '',
    fromOrgId: '',
    visible: false,
    getRightListInfo: [],
    beginPoint: '',
    endPoint: '',
    rightList: [],
    rightIds: [],
    getRightListInfoDetail: {},
    levelId: null
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(Module.actions.resetRightList())
  }

  componentWillMount() {
    const { dispatch, userInfo } = this.props
    const orgCode = userInfo.orgCode
    const orgLevel = userInfo.orgLevel
    const param = orgLevel === '0' ? { org: { }} : { org: { orgCode }}
    dispatch(ParentModule.actions.getIndustryAndOrgList(param)).then(res => {
      if (res.status === 'success') {
        if (isEmpty(res.result)) {
          this.setState({ orgList: [] })
          dispatch(Module.actions.resetFieldList())
        } else {
          let fromOrgId = getUrlParam('fromOrgId')
          let subtitle = ''
          if (orgLevel !== '0') {
            fromOrgId = res.result[0].orgs[0].orgCode
            subtitle = res.result[0].orgs[0].orgName
          }
          this.setState({ orgList: res.result, subtitle }, () => {
            if (fromOrgId) {
              this.setState({ currentOrgId: fromOrgId })
              dispatch(Module.actions.getRightList({ orgCode: fromOrgId }))
            }
          })
        }
      }
    })
  }

  // 弹窗
  showModal = (levelId) => {
    if (levelId === '') {
      this.setState({
        visible: true,
      })
    }
    const { currentOrgId } = this.state
    const { dispatch } = this.props
    if (currentOrgId === '') {
      message.error('请选择产业！')
      return
    }
    // 获取权益编辑
    levelId && dispatch(Module.actions.edit({ levelId: levelId })).then(res => {
      if (res && res.status === 'success') {
        this.setState({
          visible: true,
        })
        const rightId = []
        if (!isEmpty(res.result)) {
          res.result.rightList.map(item => {
            rightId.push({
              rightId: item.rightId,
              rightItemId: item.rightItemId
            })
          })
          this.setState({
            getRightListInfoDetail: res.result,
            rightIds: rightId,
            levelId: levelId,
          })
        }
      }
    })
    // 获取权益
    dispatch(Module.actions.getRightListInfo({ orgCode: currentOrgId })).then(res => {
      if (res.status === 'success') {
        if (!isEmpty(res.result)) {
          this.setState({
            getRightListInfo: res.result,
          })
        }
      }
    })
  }
  handleOk = (e) => {
    const { form, dispatch } = this.props
    const { currentOrgId, levelId, getRightListInfo } = this.state

    const rightList = []
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        getRightListInfo.map(right => {
          const rightCheckValue = form.getFieldValue(`checkbox${right.rightId}`)
          if (!isEmpty(rightCheckValue)) {
            rightList.push({
              rightId: isArray(rightCheckValue) ? rightCheckValue[0] : rightCheckValue,
              rightItemId: form.getFieldValue(`rightItemId${right.rightId}`) ? form.getFieldValue(`rightItemId${right.rightId}`) : ''
            })
          }
        })
        if (rightList.length === 0) {
          message.error('请至少选择一项权益')
          return
        }
        if (!isEmpty(levelId)) {
          dispatch(Module.actions.sava({
            levelId: levelId,
            levelName: trim(values.levelName),
            beginPoint: values.beginPoint,
            endPoint: values.endPoint,
            rightList: rightList
          })).then(res => {
            if (res === 0) {
              message.success('编辑成功！')
              this.setState({
                visible: false,
                rightIds: [],
                getRightListInfoDetail: {},
                levelId: null
              })
              form.resetFields()
              dispatch(Module.actions.getRightList({ orgCode: currentOrgId }))
            }
          })
        } else {
          dispatch(Module.actions.add({
            orgCode: currentOrgId,
            levelName: trim(values.levelName),
            beginPoint: values.beginPoint,
            endPoint: values.endPoint,
            rightList: rightList
          })).then(res => {
            if (res === 0) {
              message.success('新增成功！')
              this.setState({
                visible: false,
                rightIds: [],
                getRightListInfoDetail: {}
              })
              form.resetFields()
              dispatch(Module.actions.getRightList({ orgCode: currentOrgId }))
            }
          })
        }
      }
    })
  }
  handleCancel = (e) => {
    const { form } = this.props
    form.resetFields()
    this.setState({
      visible: false,
      getRightListInfoDetail: {},
      levelId: null
    })
  }
  // 验证积分数

  _validatePoint = () => (rule, value, callback) => {
    const { form } = this.props
    const beginPoint = form.getFieldValue('beginPoint')
    const endPoint = form.getFieldValue('endPoint')
    if (endPoint === '') {
      callback()
      return
    }
    if (endPoint <= beginPoint) {
      callback('积分结束范围必须大于积分开始范围!')
      return
    }
    callback()
  }
  _beginPoint = () => {
    const { form } = this.props
    form.validateFields(['endPoint'], { force: true })
  }
  // 获取默认值
  _checkDefaultValue = (item, obj) => {
    return isEmpty(obj.rightList) ? undefined : obj.rightList.find(right => {
      return right.rightId && right.rightId.toString() === item.rightId.toString()
    })
  }

  // 表格项
  _columns = [{
    title: '会员等级',
    dataIndex: 'levelName',
    key: 'levelName',
  }, {
    title: '对应积分',
    dataIndex: 'beginPoint',
    key: 'beginPoint',
    render: (text, record) => {
      return (
        <span>{record.beginPoint + '-' + record.endPoint}</span>
      )
    }
  }, {
    title: '对应权益',
    dataIndex: 'rightList',
    key: 'rightList',
    render: (text) => {
      return (
        text !== [] && text.map(item => {
          const rightItemName = item.rightId === null || item.rightItemName === null ? '' : `:${item.rightItemName}`
          const rightName = item.rightId ? item.rightName : ''
          return (
            <div key={item.rightId}>{`${rightName}${rightItemName}`}</div>
          )
        })
      )
    }
  }, {
    title: '状态',
    dataIndex: 'activated',
    key: 'activated',
    render: (text) => {
      return (
        <span>{activated[text]}</span>
      )
    }
  }, {
    title: '操作',
    key: 'handle',
    width: '150px',
    render: (text, record) => {
      const { auths, match, userInfo } = this.props
      const btnRole = auths[match.path] ? auths[match.path] : []
      const orgLevel = userInfo.orgLevel
      return (
        <div>
          {
            record.activated === 'Y' ? '' : (
              <div>
                {
                  btnRole.includes('edit') && orgLevel !== '2' &&
                    <a href='javascript:;' onClick={() => { this.showModal(record.levelId) }}>编辑</a>
                }
                {
                  btnRole.includes('delete') && orgLevel !== '2' &&
                    <span id='del'>
                      <Popconfirm
                        getPopupContainer={() => document.getElementById('del')}
                        title={`确定删除吗？`}
                        onConfirm={() => { this._del(record.levelId) }}
                      >
                        <a href='javascript:;' style={{ margin: ' 0 10px' }} >删除</a>
                      </Popconfirm>
                    </span>
                }
                {
                  btnRole.includes('active') && orgLevel !== '2' &&
                    <span id='pop'>
                      <Popconfirm
                        getPopupContainer={() => document.getElementById('pop')}
                        placement='topRight'
                        title={
                          <div>
                            <div>启用该等级以及对应的权益？</div>
                            <div style={{ color: '#999' }}>启用后改等级对应的积分以及权益均</div>
                            <div style={{ color: '#999' }}>不能编辑以及删除。</div>
                          </div>
                        }
                        onConfirm={() => { this._isActive(record) }}
                      >
                        <a href='javascript:;'>启用</a>
                      </Popconfirm>
                    </span>
                }
              </div>
            )
          }
        </div>
      )
    }
  }]

  // 生成树
  _renderTreeNodes = (data) => {
    return data.map((item, index) => {
      return (
        <Tree.TreeNode
          title={item.industryName}
          key={`${item.industryName}${index}`}
          data-id={`${item.industryName}${index}`}
          selectable={false}
        >
          {
            item.orgs.map(org => {
              return (
                <Tree.TreeNode
                  title={org.orgName}
                  key={org.orgCode}
                  data-id={org.orgCode}
                />
              )
            })
          }
        </Tree.TreeNode>
      )
    })
  }

  // 点击左边树结构
  _clickTree = (key, e) => {
    const { dispatch } = this.props
    if (e.selected) {
      this.setState({
        currentOrgId: key[0],
        getRightListInfo: [],
        subtitle: e.selectedNodes[0].props.title
      }, () => {
        dispatch(Module.actions.getRightList({ orgCode: key[0] }))
      })
    }
  }

  // 删除会员等级
  _del = (levelId) => {
    const { dispatch, form } = this.props
    const { currentOrgId } = this.state
    dispatch(Module.actions.delRight({ levelId: levelId })).then(res => {
      console.log(res)
      if (res === 0) {
        message.success('删除成功')
        form.resetFields()
        dispatch(Module.actions.getRightList({
          orgCode: currentOrgId
        }))
      }
    })
  }

  // 启用会员等级
  _isActive = (record) => {
    const { dispatch } = this.props
    const { currentOrgId } = this.state
    if (record.rightList.length === 0) {
      message.error('会员权益为空，请先完善权益内容!')
      return
    }
    dispatch(Module.actions.isActive({ levelId: record.levelId })).then(res => {
      if (res === 0) {
        message.success('启用成功')
        dispatch(Module.actions.getRightList({
          orgCode: currentOrgId
        }))
      }
    })
  }

  // 获取权益等级id
  _handleCheckChange = (oldRightId, value) => {
    const { rightIds } = this.state
    const { form } = this.props
    if (value.length > 0) {
      rightIds.push(oldRightId)
    } else {
      rightIds.splice(rightIds.indexOf(oldRightId), 1)
      form.setFieldsValue({ [`rightItemId${oldRightId}`]: '' })
    }
    this.setState({ rightIds }, () => {
      form.validateFields([`rightItemId${oldRightId}`], { force: true })
    })
  }

  // 设置复选框勾选
  _handleSelectChange = (value, rightId) => {
    const { form } = this.props
    form.setFieldsValue({ [`checkbox${rightId}`]: [rightId] })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { rightList, showListSpin, auths, match, userInfo } = this.props
    const { orgList, currentOrgId, getRightListInfo, getRightListInfoDetail, rightIds } = this.state
    const btnRole = auths[match.path] ? auths[match.path] : []
    const orgLevel = userInfo.orgLevel
    return (
      <div className={styles['common-table']}>
        <Card
          title='所属产业'
          className={styles['left-tree']}
        >
          {
            isEmpty(orgList)
              ? null
              : <Tree
                showLine
                defaultExpandAll
                onSelect={this._clickTree}
                selectedKeys={[currentOrgId]}
              >
                {
                  this._renderTreeNodes(orgList)
                }
              </Tree>
          }
        </Card>
        <div className={styles['right-table']}>
          <div>
            <p className={styles['table-title-name']} style={{ borderBottom: '1px solid #eee', paddingBottom: 20 }}>{this.state.subtitle}会员权益</p>
            <div className={styles['table-title']}>
              <span className={styles['table-title-name']}>会员等级与权益</span>
              {
                btnRole.includes('add') && orgLevel !== '2' && currentOrgId !== '' &&
                <Button
                  onClick={() => { this.showModal('') }}
                  type='primary'
                  style={{ float: 'right' }}
                >
                  添加
                </Button>
              }
            </div>
            <Table
              className={styles['c-table-center']}
              bordered
              pagination={false}
              loading={showListSpin}
              columns={this._columns}
              dataSource={rightList}
              rowKey='levelId'
            />
            <Modal
              title={!isEmpty(this.state.levelId) ? '编辑积分等级权益' : '添加一条新的积分等级权益'}
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              width={630}
              maskClosable={false}
            >
              <Form>
                <Row>
                  <Col>
                    <FormItem
                      {...formItemLayout}
                      colon={false}
                      label='会员等级'
                    >
                      {getFieldDecorator('levelName', {
                        initialValue: isEmpty(getRightListInfoDetail) ? '' : getRightListInfoDetail.levelName,
                        rules: [{
                          required: true,
                          message: '请输入会员等级',
                        }]
                      })(
                        <Input
                          placeholder='请输入会员等级'
                          maxLength='8'
                          style={{ width: 466 }}
                        />
                      )}
                    </FormItem>

                  </Col>
                </Row>
                <Row>
                  <Col span='14'>
                    <FormItem
                      {...formItemLayout1}
                      colon={false}
                      label='积分范围'
                      style={{ marginRight: 40 }}
                    >
                      {getFieldDecorator('beginPoint', {
                        initialValue: isEmpty(getRightListInfoDetail) ? '' : getRightListInfoDetail.beginPoint,
                        rules: [{
                          required: true,
                          message: '请输入积分'
                        }]
                      })(
                        <InputNumber
                          placeholder='请输入积分'
                          maxLength='9'
                          min={0}
                          onBlur={this._beginPoint}
                          style={{ width: 200 }}
                        />
                      )}
                      <span style={{ position: 'relative', left: 18 }}>至</span>
                    </FormItem>
                  </Col>
                  <Col span='10'>
                    <FormItem
                      label=''
                    >
                      {getFieldDecorator('endPoint', {
                        initialValue: isEmpty(getRightListInfoDetail) ? '' : getRightListInfoDetail.endPoint,
                        validateTrigger: ['onBlur'],
                        rules: [{
                          required: true,
                          message: '请输入积分'
                        }, {
                          validator: this._validatePoint()
                        }]
                      })(
                        <InputNumber
                          placeholder='请输入积分'
                          style={{ width: 200, marginRight: 0 }}
                          maxLength='9'
                          min={1}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <div className={styles['modal-line']}>请选择该等级对应的权益</div>
                </Row>
                <div className={styles['modal-scorll']}>
                  {
                    getRightListInfo.length > 0 ? (getRightListInfo.map(item => {
                      const right = this._checkDefaultValue(item, getRightListInfoDetail)
                      return (
                        <Row key={item.rightId} className={styles['line']}>
                          <Col span='7' className={styles['checkbox-row']}>
                            <FormItem
                              colon={false}
                            >
                              {getFieldDecorator(`checkbox${item.rightId}`, {
                                initialValue: isEmpty(right) ? undefined : [right.rightId.toString()]
                              })(
                                <CheckboxGroup
                                  onChange={(value) => {
                                    this._handleCheckChange(item.rightId, value)
                                  }}
                                >
                                  <Checkbox value ={item.rightId} >{item.rightName}</Checkbox>
                                </CheckboxGroup>
                              )}
                            </FormItem>
                          </Col>
                          <Col span='16' id='select'>
                            {
                              item.itemList.length > 0 ? (
                                <FormItem>
                                  {getFieldDecorator(`rightItemId${item.rightId}`, {
                                    initialValue: !isEmpty(right) && right.rightItemId ? right.rightItemId.toString() : undefined,
                                    rules: [{
                                      required: rightIds.includes(item.rightId),
                                      message: '请选择会员权益!',
                                    }]
                                  })(
                                    <Select
                                      getPopupContainer={() => document.getElementById('select')}
                                      style={{ width: 362 }}
                                      placeholder='请选择'
                                      onChange={(value) => { this._handleSelectChange(value, item.rightId) }}
                                    >
                                      <Option value=''>请选择</Option>
                                      {
                                        item.itemList.map(list => {
                                          return (
                                            <Option
                                              key={list.itemId}
                                              value={list.itemId}
                                            >
                                              {list.itemName}
                                            </Option>
                                          )
                                        })
                                      }
                                    </Select>
                                  )}
                                </FormItem>
                              ) : null
                            }
                          </Col>
                        </Row>
                      )
                    })) : <div style={{ paddingLeft: 10, color: 'red' }}>权益库为空，无法选择权益，请先完善权益库</div>
                  }
                </div>
              </Form>
            </Modal>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state['memberCenter.right'],
    showListSpin: state['common.showListSpin'],
    auths: state['common.auths'],
    userInfo: state['common.userInfo'],
  }
}
export default connect(['common.userInfo', 'common.auths', 'common.showListSpin', 'memberCenter.right'], mapStateToProps)(Form.create()(RightList))
