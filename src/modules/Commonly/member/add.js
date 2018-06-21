import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Form, Input, Button, Select, DatePicker, Row, Col, message } from 'antd'
import moment from 'moment'
import * as urls from '../../../global/urls'

import TableEditItem from './item'
import styles from './styles.less'
import { phoneNumberSearch, saveMemberInfo, getOrgList, addMember, getMemberList } from './reduck'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

const isMember = {
  '1': '是',
  '2': '否'
}

const isSex = {
  '1': '女',
  '0': '男'
}

class Add extends Component {
  static defaultProps = {
    orgList: [],
    info: {},
    editDisabled: false
  }
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(saveMemberInfo({}))
    dispatch(getOrgList({ isMember: '' }))
  }

  _handlePhoneNumberSearch = e => {
    const { dispatch } = this.props
    const phone = e.target.value
    if (phone && phone.length === 11) {
      dispatch(
        getMemberList({
          memberId: this.props.info.memberId,
          currentPage: 1,
          pageSize: 20,
          phoneNumber: phone
        })
      ).then(res => {
        res.result && res.result.length === 0 && dispatch(phoneNumberSearch({ phoneNumber: phone }))
        res.result && res.result.length !== 0 && message.error('该手机号已经存在,请换号码重试')
      })
      return
    }
    dispatch(saveMemberInfo({}))
  }
  _disabledDate = current => {
    return current && current.valueOf() > Date.now()
  }

  handleSubmit = e => {
    const { dispatch } = this.props
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch(
          addMember({
            ...this.getMemberArg(values),
            memCardList: this._memCardListOrg(values)
          })
        )
      }
    })
  }

  getMemberArg = values => {
    return {
      phoneNumber: values['phoneNumber'],
      memberId: values['memberId'],
      name: values['name'],
      isMember: values['isMember'],
      sex: values['sex'],
      titleCode: values['titleCode'],
      birthDate: values['birthDate'] ? values['birthDate'].format('YYYY-MM-DD') : '',
      identificationNo: values['identificationNo'],
      address: values['address'],
      remark: values['remark']
    }
  }

  _memCardListOrg = values => {
    const cardKeys = Object.keys(values).filter(item => item.includes('shopId-'))
    return cardKeys.map(key => {
      const listArg = {}
      const keyTemp = key.split('-')[1]
      Object.keys(values).forEach((valueskey, index) => {
        const valuesKeyTemp = valueskey.split('-')
        if (keyTemp === valuesKeyTemp[1] && valuesKeyTemp[0] !== 'cardTime') {
          listArg[valuesKeyTemp[0]] = values[valueskey]
        } else if (keyTemp === valuesKeyTemp[1] && valuesKeyTemp[0] === 'cardTime') {
          listArg[valuesKeyTemp[0]] = values[valueskey] ? values[valueskey].format('YYYY-MM-DD HH:mm:ss') : ''
        }
      })
      return listArg
    })
  }

  // 等级联动
  _handleRankChange = value => {
    const values = this.props.form.getFieldsValue()
    const cardKeys = Object.keys(values).filter(item => item.includes('shopId-'))
    cardKeys.forEach(item => {
      const shopId = item.split('-')[1]
      this.props.form.setFieldsValue({ ['rank-' + shopId]: value })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { orgList, info } = this.props
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem className={styles['operate-btn']}>
            <Button
              type='primary'
              title='点击保存'
              loading={this.props.showBtnSpin}
              htmlType='submit'
            >
              保存
            </Button>
            <Link to={urls.MEMBER}>
              <Button title='点击取消'>取消</Button>
            </Link>
          </FormItem>
          <Row>
            <Col span={8}>
              <FormItem {...formItemLayout} label='电话号码：'>
                {getFieldDecorator('phoneNumber', {
                  whitespace: true,
                  rules: [
                    {
                      required: true,
                      message: '手机号不能为空！'
                    },
                    {
                      pattern: /^\d{11}$/,
                      message: '请输入正确的手机号！'
                    }
                  ]
                })(<Input placeholder='请输入手机号码' onChange={e => this._handlePhoneNumberSearch(e)} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label='会员ID：'>
                {getFieldDecorator('memberId', {
                  rules: [
                    {
                      required: true,
                      message: '请输入会员ID！'
                    }
                  ],
                  initialValue: info.memberId
                })(<Input disabled={true} placeholder='请输入会员ID' />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label='姓名：'>
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '请输入姓名！'
                    }
                  ],
                  initialValue: info.name
                })(<Input placeholder='请输入姓名' maxLength='32' />)}
              </FormItem>
            </Col>
          </Row>
          <Row id='rowMember'>
            <Col span={8}>
              <FormItem {...formItemLayout} label='内部会员：'>
                {getFieldDecorator('isMember', {
                  rules: [
                    {
                      required: true,
                      message: '请选择是否为内部会员!'
                    }
                  ],
                  initialValue: info.isMember && info.isMember !== 'null' ? String(info.isMember) : undefined
                })(
                  <Select
                    placeholder='请选择是否为内部会员'
                    onChange={e => this._handleRankChange(e)}
                    getPopupContainer={() => document.getElementById('rowMember')}
                  >
                    {Object.keys(isMember).map(key => {
                      return (
                        <Option key={key} value={key}>
                          {isMember[key]}
                        </Option>
                      )
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label='性别：'>
                {getFieldDecorator('sex', {
                  initialValue: info.sex !== undefined && info.sex !== null ? String(info.sex) : ''
                })(
                  <Select placeholder='请选择性别' getPopupContainer={() => document.getElementById('rowMember')}>
                    <Option key='-1' value=''>
                      请选择
                    </Option>
                    {Object.keys(isSex).map(key => {
                      return (
                        <Option key={key} value={key}>
                          {isSex[key]}
                        </Option>
                      )
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8} id='colBirthDate'>
              <FormItem {...formItemLayout} label='出生日期'>
                {getFieldDecorator('birthDate', {
                  initialValue: info.birthDate ? moment(new Date(info.birthDate)) : null
                })(
                  <DatePicker
                    getCalendarContainer={() => document.getElementById('colBirthDate')}
                    placeholder='请选择出生日期'
                    disabledDate={this._disabledDate}
                    style={{ width: '100%' }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem {...formItemLayout} label='身份证号：'>
                {getFieldDecorator('identificationNo', {
                  rules: [
                    {
                      whitespace: true,
                      pattern: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
                      message: '请输入正确的身份证号！'
                    }
                  ],
                  initialValue: info.identificationNo
                })(<Input placeholder='请输入身份证号' />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label='职级：'>
                {getFieldDecorator('titleCode', {
                  initialValue: info.titleCode
                })(<Input placeholder='请输入职级' disabled={true} maxLength='32' />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label='住址：'>
                {getFieldDecorator('address', {
                  initialValue: info.address
                })(<Input.TextArea placeholder='请输入住址' maxLength='255' />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem {...formItemLayout} label='备注：'>
                {getFieldDecorator('remark', {
                  initialValue: info.remark
                })(<Input.TextArea placeholder='请输入备注' maxLength='255' />)}
              </FormItem>
            </Col>
          </Row>
          <TableEditItem
            getFieldDecorator={getFieldDecorator}
            orgList={orgList}
            dispatch={this.props.dispatch}
            shopName={this.props.shopName}
            shopId={this.props.shopId}
            activeKey={this.props.activeKey}
            cardList={this.props.cardList}
            editDisabled={this.props.editDisabled}
            getOrgList={getOrgList}
            form={this.props.form}
          />
        </Form>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    info: state.member.memberInfo,
    orgList: state.member.orgList,
    showBtnSpin: state.common.showButtonSpin,
    cardList: state.member.cardList,
    shopName: state.member.shopName,
    shopId: state.member.shopId,
    activeKey: state.member.activeKey
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Add))
