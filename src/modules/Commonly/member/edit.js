import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Form, Input, Button, Select, DatePicker, Row, Col } from 'antd'
import moment from 'moment'

import * as urls from '../../../global/urls'
import TableEditItem from './item'
import styles from './styles.less'
import { getMemberDetail, getOrgList, editMember } from './reduck'

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

class Edit extends Component {
  static defaultProps = {
    orgList: [],
    info: {},
    editDisabled: false,
    detail: {},
    cardList: [],
    shopName: '',
    shopId: '',
    activeKey: '',
    dealPanes: []
  }

  componentDidMount() {
    const { dispatch } = this.props
    const memberId = this.props.match.params.memberId
    dispatch(getMemberDetail({ memberId: memberId }))
    dispatch(getOrgList({ isMember: '' }))
  }

  handleSubmit = e => {
    const { dispatch } = this.props
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch(
          editMember({
            ...this.getMemberArg(values),
            memCardList: [...this._memCardListOrg(values), ...this.props.dealPanes]
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
      titleCode: values['titleCode'],
      isMember: values['isMember'],
      sex: values['sex'],
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

  _disabledDate = current => {
    return current && current.valueOf() > Date.now()
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { detail } = this.props
    return (
      <div>
        <Form onSubmit={e => this.handleSubmit(e)}>
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
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      pattern: /^\d{11}$/,
                      message: '请输入正确的手机号！'
                    }
                  ],
                  initialValue: detail.phoneNumber
                })(<Input disabled={true} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label='会员ID：'>
                {getFieldDecorator('memberId', {
                  rules: [
                    {
                      required: true,
                      message: '会员ID不能为空!'
                    }
                  ],
                  initialValue: detail.memberId
                })(<Input disabled={true} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label='姓名：'>
                {getFieldDecorator('name', {
                  whitespace: true,
                  rules: [
                    {
                      required: true,
                      message: '姓名不能为空!'
                    }
                  ],
                  initialValue: detail.name
                })(<Input placeholder='请输入姓名' />)}
              </FormItem>
            </Col>
          </Row>
          <Row id='editMember'>
            <Col span={8}>
              <FormItem {...formItemLayout} label='内部会员：'>
                {getFieldDecorator('isMember', {
                  rules: [
                    {
                      required: true,
                      message: '请选择是否为内部会员!'
                    }
                  ],
                  initialValue: detail.isMember && detail.isMember !== 'undefined' && String(detail.isMember)
                })(
                  <Select
                    placeholder='请选择是否为内部会员'
                    getPopupContainer={() => document.getElementById('editMember')}
                    onChange={e => this._handleRankChange(e)}
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
                  initialValue: detail.sex && detail.sex
                })(
                  <Select placeholder='请选择性别' getPopupContainer={() => document.getElementById('editMember')}>
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
            <Col span={8}>
              <FormItem {...formItemLayout} label='出生日期'>
                {getFieldDecorator('birthDate', {
                  initialValue: detail.birthDate ? moment(new Date(detail.birthDate)) : null
                })(
                  <DatePicker
                    getCalendarContainer={() => document.getElementById('editMember')}
                    style={{ width: '100%' }}
                    disabledDate={this._disabledDate}
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
                  initialValue: detail.identificationNo && detail.identificationNo
                })(<Input placeholder='请输入身份证号' />)}
              </FormItem>
            </Col>{' '}
            <Col span={8}>
              <FormItem {...formItemLayout} label='职级：'>
                {getFieldDecorator('titleCode', {
                  initialValue: detail.titleCode
                })(<Input placeholder='请输入职级' disabled={true} maxLength={32} />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label='住址：'>
                {getFieldDecorator('address', {
                  rules: [
                    {
                      whitespace: true
                    }
                  ],
                  initialValue: detail.address
                })(<Input.TextArea placeholder='请输入住址' />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label='备注：'>
                {getFieldDecorator('remark', {
                  initialValue: detail.remark
                })(<Input.TextArea placeholder='请输入备注' maxLength={512} />)}
              </FormItem>
            </Col>
          </Row>
          <TableEditItem
            getFieldDecorator={getFieldDecorator}
            detail={this.props.detail}
            cardList={this.props.cardList}
            orgList={this.props.orgList}
            shopName={this.props.shopName}
            shopId={this.props.shopId}
            activeKey={this.props.activeKey}
            dispatch={this.props.dispatch}
            editDisabled={this.props.editDisabled}
            form={this.props.form}
          />
        </Form>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    detail: state.member.memberDetail,
    cardList: state.member.cardList,
    orgList: state.member.orgList,
    showBtnSpin: state.common.showButtonSpin,
    shopName: state.member.shopName,
    shopId: state.member.shopId,
    activeKey: state.member.activeKey,
    dealPanes: state.member.dealPanes
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({})(Edit))
