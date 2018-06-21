import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
import { Link } from 'react-router-dom'
import { Table, Form, Modal, Button, Radio, Checkbox, InputNumber, message } from 'antd' // Select
import * as urls from 'Global/urls'
import styles from './styles.less'
// import params from 'Utils/params'
import storage from 'Utils/storage'
import { getUrlParam } from 'Utils/params'
import { MEMBER_INTEGRAL } from 'Global/urls'

import Module from './module'

// const FormItem = Form.Item
const RadioGroup = Radio.Group
const FormItem = Form.Item

class Rule extends Component {
  state = {
    ruleVisible: false,
    currencyRuleVisible: false,
    setCurrencyRuleVisible: false,
    confirmLoading: false,
    // 当前产业
    orgIn: {
      code: '',
      name: ''
    },
    currentOrgName: '',
    rule: {
      ruleTempletCode: '', // 规则模板编码
      point: '', // 奖励积分数
      topPoint: '', // 每天奖励上限，flag传1时必填
      flag: '2', // 每天奖励上限标示位（1为有奖励上线，2为没有）
    },
    currencyRule: {
      effectiveDateType: '1', // 通用规则有效期类型 1: 永久有效 2 设置有效期日期
      flag: '2', // 每天奖励上限标示位（1为有奖励上线，2为没有）
      topPoint: '', // 每日最高获取积分数
      effectiveDate: '' // 过期日期
    }
  }

  // 列表header信息
  _columns = [
    {
      key: 'ruleName',
      title: '获得条件',
      dataIndex: 'ruleName',
      width: '450px',
      render: (text, record, index) => {
        return (
          <div style={{ textAlign: 'left', paddingLeft: '20px' }}>{text}</div>
        )
      }
    },
    {
      key: 'point',
      title: '单笔增加积分数',
      dataIndex: 'point',
      width: '230px',
      render: (text, record, index) => {
        return (
          <span>{text}积分</span>
        )
      }
    },
    {
      key: 'updateTime',
      title: '规则更新时间',
      dataIndex: 'updateTime',
      width: '230px'
    },
    {
      key: 'topPoint',
      title: '上限',
      dataIndex: 'topPoint',
      width: '230px',
      render: (text, record, index) => {
        return (
          <span>{text ? '每日上限' + text + '积分' : '不限制'}</span>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 80,
      render: (text, record, index) => {
        const { auths } = this.props
        const btnRole = auths[MEMBER_INTEGRAL] ? auths[MEMBER_INTEGRAL] : []
        return (
          <div className={styles['table-ope']}>
            {
              btnRole.includes('delRule') &&
              <a
                href='javascript:;'
                onClick={(e) => { this._delRule(e, record, index) }}
                className={styles['del']}
              >
                删除
              </a>
            }
          </div>
        )
      }
    }
  ]

  // 生命周期， 初始化表格数据
  componentDidMount() {
    this._initData()
  }

  componentWillUnmount() {
  }

  /**
   * 设置会员基础信息
   */
  _initData = () => {
    let userIn = storage.get('userInfo')
    let orgIn = {}
    // 如果是管理员
    if (userIn && userIn.orgLevel === '0') {
      orgIn.code = getUrlParam('orgCode')
      orgIn.name = getUrlParam('orgName')
    } else {
      orgIn.code = userIn.orgCode
      orgIn.name = userIn.orgName
    }
    this.setState({ orgIn })
    this._getRuleList(orgIn.code)
    this._getRurrencyRule(orgIn.code)
  }

  /**
   * 积分规则条件列表
   */
  _getRuleList = (orgCode) => {
    const { dispatch } = this.props
    dispatch(Module.actions.getRuleList({ orgCode: orgCode }))
  }

  /**
   * 积分规则列表
   */
  _getRuleTempletList = (orgCode) => {
    const { dispatch } = this.props
    dispatch(Module.actions.getRuleTempletList({ orgCode: orgCode }))
  }

  /**
   * 设置获取数量状态
   */
  _setCurrencyTopPoint = (e) => {
    const { currencyRule } = this.state
    currencyRule.flag = e.target.checked ? '1' : '2'
    this.setState({ currencyRule })
  }

  _checkPoint = (point) => {
    let checkStatus = true
    const objReg = /(^[0-9]{1,9}$)/
    if (point === '' || (String(point) && !objReg.test(point)) || parseFloat(point) <= 0) {
      checkStatus = false
    }
    return checkStatus
  }

  _onPointChange = (e) => {
    if (!this._checkPoint(e.target.value)) {
      e.target.value = ''
    }
  }

  /**
   * 设置通用积分规则
   */
  _handleCurrencyRule = () => {
    const { currencyRuleDetail } = this.props

    let setCurrencyRule = { currencyRuleVisible: true }
    if (currencyRuleDetail !== null) {
      const { currencyRule } = this.state
      const { setFieldsValue } = this.props.form

      currencyRule.flag = currencyRuleDetail.topPoint ? '1' : '2'
      currencyRule.effectiveDateType = currencyRuleDetail.effectiveDateType
      currencyRule.topPoint = currencyRuleDetail.topPoint
      currencyRule.effectiveDate = currencyRuleDetail.effectiveDate
      setCurrencyRule.currencyRule = currencyRule
      this.setState(setCurrencyRule, () => {
        setFieldsValue({
          currencyTopPoint: currencyRule.topPoint,
          effectiveDateType: currencyRule.effectiveDateType
        })
      })
    } else {
      this.setState(setCurrencyRule)
    }
  }

  _handleSetCurrencyRuleCancel = () => {
    this.setState({ currencyRuleVisible: false })
  }

  /**
   * 执行添加通用积分规则
   * @private
   */
  _setCurrencyRule = () => {
    const { currencyRule, orgIn } = this.state
    const { getFieldsValue } = this.props.form
    let data = getFieldsValue()
    if (currencyRule.flag === '1' && !this._checkPoint(data.currencyTopPoint)) {
      message.error('请填写最多积分')
      return false
    }
    this._handleSetCurrencyRuleCancel()
    currencyRule.orgCode = orgIn.code
    currencyRule.topPoint = currencyRule.flag === '2' ? '' : data.currencyTopPoint
    const { dispatch } = this.props
    dispatch(Module.actions.addCurrencyRule(currencyRule)).then(status => {
      const { resetFields } = this.props.form
      let initData = {
        effectiveDateType: 1,
        topPoint: '',
        flag: '2'
      }
      // 重置
      resetFields()
      this.setState({ currencyRule: initData })
      if (status) {
        this._getRurrencyRule(orgIn.code)
        this._getRuleList(orgIn.code)
      }
    })
  }

  /**
   * 设置通用积分规则
   */
  _handleSetRule = () => {
    const { resetFields } = this.props.form
    resetFields()
    const { orgIn } = this.state
    this._getRuleTempletList(orgIn.code)
    this.setState({ ruleVisible: true })
  }

  /**
   * 设置积分规则
   */
  _setRule = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { orgIn, rule } = this.state
        if (rule.flag === '1' && !this._checkPoint(values.topPoint)) {
          message.error('请正确填写用户每天获得该类积分上限')
          return false
        }
        this._handleSetRuleCancel()
        const { dispatch } = this.props
        let topPoint = rule.flag === '2' ? '' : values.topPoint
        dispatch(Module.actions.addRule({
          orgCode: orgIn.code,
          ruleTempletCode: values.ruleTempletCode,
          topPoint: topPoint,
          point: values.point,
          flag: rule.flag
        })).then(status => {
          const { resetFields } = this.props.form
          resetFields()
          let initData = {
            ruleTempletCode: '',
            topPoint: '',
            point: '',
            flag: '2'
          }
          this.setState({ rule: initData })
          if (status) {
            this._getRuleList(orgIn.code)
          }
        })
      }
    })
  }

  _handleSetRuleCancel = () => {
    this.setState({ ruleVisible: false })
  }

  /**
   * 设置用户每天获得该类积分上限状态
   * @param e
   * @private
   */
  _setTopPoint = (e) => {
    const { rule } = this.state
    rule.flag = e.target.checked ? '1' : '2'
    this.setState({ rule })
  }

  /**
   * 获取通用积分规则
   */
  _getRurrencyRule = (orgCode) => {
    const { dispatch } = this.props
    dispatch(Module.actions.getCurrencyRuleDetail({ orgCode: orgCode }))
  }

  /**
   * 删除积分规则
   * @returns {*}
   */
  _delRule = (event, record, index) => {
    Modal.confirm({
      title: '删除积分规则?',
      content: '确定要删除此积分规则吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props
        dispatch(Module.actions.delRule({ id: record.id })).then(status => {
          if (status) {
            const { orgIn } = this.state
            this._getRuleList(orgIn.code)
          }
        })
      },
      onCancel() {
      },
    })
  }

  _getShowTempletList = (ruleTempletList) => {
    let showTempletList = []
    if (ruleTempletList) {
      ruleTempletList.forEach((ruleTemplet) => {
        showTempletList.push({
          label: ruleTemplet.ruleName,
          value: ruleTemplet.code
        })
      })
    }
    return showTempletList
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { orgIn, currencyRuleVisible, ruleVisible, currencyRule, rule } = this.state
    const { showListSpin, ruleList, ruleTempletList, currencyRuleDetail, auths } = this.props
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    }
    const formItemPointLayout = {
      labelCol: { span: 13 },
      wrapperCol: { span: 10 }
    }
    const formItemCurrencyPointLayout = {
      labelCol: { span: 11 },
      wrapperCol: { span: 10 }
    }
    const btnRole = auths[MEMBER_INTEGRAL] ? auths[MEMBER_INTEGRAL] : []
    return (
      <div>
        <div className={styles['rule-header']}>
          <span>{orgIn.name}积分设置</span>
          <Link to={`${urls.MEMBER_INTEGRAL}`}>&#60;返回</Link>
        </div>
        <div className={styles['handle-option']}>
          <label>积分通用规则</label>
          {
            btnRole.includes('add') &&
            <Button
              className={styles['search-btn']}
              type='primary'
              title='设置通用积分规则'
              onClick={this._handleCurrencyRule}
            >
              设置通用规则
            </Button>
          }
        </div>
        <div className={styles['handle-result']}>
          {currencyRuleDetail &&
            <div>
              <div className={styles['currency-rule-option']}>
                <label>积分通用有效期：</label>
                {currencyRuleDetail.effectiveDateType === '1' &&
                <span>永久有效</span>
                }
              </div>
              <div className={styles['currency-rule-option']}>
                <label>积分上限：</label>
                {currencyRuleDetail.topPoint &&
                  <span>每天{currencyRuleDetail.topPoint}积分</span>
                }
                {currencyRuleDetail.topPoint === null &&
                  <span>暂无</span>
                }
              </div>

            </div>
          }
          {currencyRuleDetail === null &&
            <span>无设置</span>
          }
        </div>
        <div className={styles['handle-option']}>
          <label>自定义积分规则</label>
          {
            btnRole.includes('add') &&
            <Button
              className={styles['search-btn']}
              type='primary'
              title='新建积分规则'
              onClick={this._handleSetRule}
            >
              新建积分规则
            </Button>
          }
        </div>
        <div className={styles['table-wrapper']}>
          <Table
            locale={{
              emptyText: '暂无数据'
            }}
            className={styles['c-table-center']}
            columns={this._columns}
            rowKey='id'
            dataSource={ruleList}
            bordered={true}
            loading={showListSpin}
            pagination={false}
          />
        </div>

        <Modal
          title='设置积分通用规则'
          okText='确定'
          cancelText='取消'
          visible={currencyRuleVisible}
          onOk={this._setCurrencyRule}
          onCancel={this._handleSetCurrencyRuleCancel}
          maskClosable={false}
        >
          <Form
            id='currency-rule-form'
            className={styles['parameter-wrap']}
          >
            <FormItem
              label='通用有效期'
              {...formItemLayout}
            >
              {getFieldDecorator('effectiveDateType', {
                initialValue: currencyRule.effectiveDateType
              })(
                <RadioGroup>
                  <Radio className={styles['radio-style']} value={'1'}>永久有效</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              className={styles['rule-point-label']}
              label={<Checkbox onChange={this._setCurrencyTopPoint} checked={currencyRule.flag !== '2'}>一个客户每天最多获取：</Checkbox>}
              {...formItemCurrencyPointLayout}
            >
              {getFieldDecorator('currencyTopPoint', {
                initialValue: currencyRule.topPoint
              })(
                <InputNumber
                  className={styles['rule-point-input']}
                  disabled={currencyRule.flag === '2'}
                  placeholder=''
                  min={1}
                  maxLength='9'
                  // onKeyUp={this._onPointChange}
                />
              )}
              <span>积分</span>
            </FormItem>
          </Form>
        </Modal>

        <Modal
          title='设置积分获得规则'
          okText='确定'
          cancelText='取消'
          visible={ruleVisible}
          onOk={this._setRule}
          onCancel={this._handleSetRuleCancel}
          maskClosable={false}
        >
          <Form
            id='rule-form'
            className={styles['parameter-wrap']}
          >
            <FormItem
              label='奖励积分数'
              {...formItemLayout}
            >
              {getFieldDecorator('point', {
                initialValue: rule.point,
                rules: [{
                  required: true,
                  message: '请输入奖励积分数!',
                }]
              })(
                <InputNumber
                  className={styles['rule-top-point-input']}
                  placeholder=''
                  min={1}
                  maxLength='9'
                  // onKeyUp={this._onPointChange}
                />
              )}
            </FormItem>
            <FormItem
              label='奖励条件'
              {...formItemLayout}
            >
              {getFieldDecorator('ruleTempletCode', {
                initialValue: rule.ruleTempletCode,
                rules: [{
                  required: true,
                  message: '请选择奖励条件!',
                }]
              })(
                <RadioGroup className={styles['radio-group']} options={this._getShowTempletList(ruleTempletList)} />
              )}
            </FormItem>
            <FormItem
              className={styles['rule-point-label']}
              label={<Checkbox onChange={this._setTopPoint} checked={rule.flag !== '2'}>用户每天获得该类积分上限：</Checkbox>}
              {...formItemPointLayout}
            >
              {getFieldDecorator('topPoint', {
                initialValue: rule.topPoint
              })(
                <InputNumber
                  className={styles['rule-point-input']}
                  disabled={rule.flag === '2'}
                  placeholder=''
                  min={1}
                  maxLength='9'
                  // onKeyUp={this._onPointChange}
                />
              )}
              <span>积分</span>
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state['common.showListSpin'],
    ...state['memberCenter.integral'],
    auths: state['common.auths']
  }
}
export default connect(['common.showListSpin', 'common.auths', 'memberCenter.integral'], mapStateToProps)(Form.create()(Rule))
