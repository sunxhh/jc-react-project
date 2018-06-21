import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
import { Card, Form, Row, Col, Select, Button, Radio, Input, Icon } from 'antd'
import styles from './styles.less'
import Module from './module'
import { isEmpty } from 'Utils/lang'
import { MEMBER_CARD } from 'Global/urls'
import { push } from 'react-router-redux'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

class MemberCardAddDetail extends Component {
  constructor(props) {
    super(props)
    const { match } = this.props
    const cardId = match.params.cardId
    const orgCode = match.params.orgCode
    this.state = {
      cardId: cardId,
      orgCode: orgCode,
      fieldList: [
        { fieldCode: 'BASIC_FIELD_REAL_NAME', fieldLabel: '姓名', fieldEnabled: 1 },
        { fieldCode: 'BASIC_FIELD_MOBILE_NO', fieldLabel: '手机号', fieldEnabled: 1 },
        { fieldCode: 'BASIC_FIELD_MEMBER_CARD', fieldLabel: '会员卡号', fieldEnabled: 0 },
        { fieldCode: 'BASIC_FIELD_CERT_TYPE', fieldLabel: '证件类型', fieldEnabled: 0 },
        { fieldCode: 'BASIC_FIELD_CERT_NO', fieldLabel: '身份证号', fieldEnabled: 0 },
        { fieldCode: 'BASIC_FIELD_ADDRESS', fieldLabel: '住址', fieldEnabled: 0 },
        { fieldCode: 'BASIC_FIELD_BIRTHDAY', fieldLabel: '出生日期', fieldEnabled: 0 },
        { fieldCode: 'BASIC_FIELD_LOCATION', fieldLabel: '地区', fieldEnabled: 0 },
        { fieldCode: 'BASIC_FIELD_TEL_NUMBER', fieldLabel: '固定电话', fieldEnabled: 0 },
      ],
      expandFieldList: [],
      dateTypeRadio: '0',
      dateType: '0', // 默认无限期
      orgList: [],
      orgLevel: '',
      currentOrgName: '',
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    const { orgCode } = this.state
    dispatch(Module.actions.getFieldList({ orgCode: orgCode })).then(res => {
      if (res.status) {
        this.setState({
          expandFieldList: res.result
        })
      }
    })
  }

  componentWillUnmount() {
    this.setState({
      cardId: '',
      orgCode: '',
      fieldList: [],
      expandFieldList: []
    })
  }

  _handleRadioChange = (e) => {
    this.setState({
      dateTypeRadio: e.target.value
    })
  }

  _handleChangeBaseFieldEnabled = (item, index) => {
    if (item.fieldCode === 'BASIC_FIELD_REAL_NAME' || item.fieldCode === 'BASIC_FIELD_MOBILE_NO') {
      return
    }
    let list = this.state.fieldList
    list[index].fieldEnabled = list[index].fieldEnabled === 1 ? 0 : 1
    this.setState({
      fieldList: list
    })
  }

  _handleChangeExpandFieldEnabled = (item, index) => {
    let list = this.state.expandFieldList
    if (!isEmpty(list[index].fieldEnabled)) {
      list[index].fieldEnabled = list[index].fieldEnabled === 1 ? 0 : 1
    } else {
      list[index].fieldEnabled = 1
    }
    this.setState({
      expandFieldList: list
    })
  }

  _handleChangeBaseFieldSort = (sort, item, index) => {
    let list = this.state.fieldList
    if (sort === 'up') {
      list.splice(index, 1)
      list.splice(index - 1, 0, item)
      this.setState({
        fieldList: list
      })
    } else if (sort === 'down') {
      list.splice(index, 1)
      list.splice(index + 1, 0, item)
      this.setState({
        fieldList: list
      })
    }
  }

  _handleChangeExpandFieldSort = (sort, item, index) => {
    let list = this.state.expandFieldList
    if (sort === 'up') {
      list.splice(index, 1)
      list.splice(index - 1, 0, item)
      this.setState({
        expandFieldList: list
      })
    } else if (sort === 'down') {
      list.splice(index, 1)
      list.splice(index + 1, 0, item)
      this.setState({
        expandFieldList: list
      })
    }
  }

  // 提交处理
  _handleSubmit = (e) => {
    e.preventDefault()
    const { form, dispatch } = this.props
    const { dateTypeRadio, fieldList, expandFieldList, cardId } = this.state
    form.validateFields((err, values) => {
      if (!err) {
        let fieldListArr = []
        fieldList.forEach((item, index) => {
          fieldListArr.push({
            fieldType: 0,
            fieldCode: item.fieldCode,
            fieldEnabled: item.fieldEnabled,
            fieldOrder: index
          })
        })
        expandFieldList.forEach((item, index) => {
          fieldListArr.push({
            fieldType: 1,
            fieldCode: item.fieldId,
            fieldEnabled: isEmpty(item.fieldEnabled) ? 0 : item.fieldEnabled,
            fieldOrder: index
          })
        })
        dispatch(Module.actions.addDetailInfo({
          cardDetailReq: {
            cardId: cardId,
            dateType: dateTypeRadio === '0' ? 0 : parseInt(values.dateType),
            expireTranslate: dateTypeRadio === '0' ? 1 : parseInt(values.expireTranslate),
            applicablePeople: parseInt(values.applicablePeople),
            discountType: 0,
            fieldList: fieldListArr
          }
        })).then(res => {
          if (res.status) {
            this.setState({
              fieldList: [],
              expandFieldList: [],
              cardId: '',
              orgCode: '',
            }, () => {
              dispatch(push(MEMBER_CARD))
            })
          }
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { dateTypeRadio, fieldList, expandFieldList } = this.state
    return (
      <div>
        <Card
          title='第二步：领取设置&字段设置'
          bordered={false}
        >
          <Form onSubmit={this._handleSubmit}>
            <Card
              title='领取设置'
              bordered={false}
            >
              <Row>
                <Col span={10}>
                  <FormItem
                    {...formItemLayout}
                    label='会员期限'
                  >
                    {getFieldDecorator('dateTypeRadio', {
                      initialValue: '0',
                      rules: [{
                        required: true,
                        message: '请选择会员期限',
                      }],
                    })(
                      <RadioGroup
                        onChange={this._handleRadioChange}
                      >
                        <Radio value='0'>无限期</Radio>
                        <Radio value='1'>
                          {getFieldDecorator('dateType', {
                            initialValue: '1',
                            rules: [{
                              required: true,
                              message: '请选择会员期限',
                            }],
                          })(
                            <Select
                              disabled={dateTypeRadio === '0'}
                              style={{ width: 150 }}
                              getPopupContainer={trigger => trigger.parentNode}
                            >
                              <Option key='1'>1年</Option>
                              <Option key='2'>2年</Option>
                              <Option key='3'>3年</Option>
                              <Option key='4'>5年</Option>
                              <Option key='5'>10年</Option>
                              <Option key='6'>15年</Option>
                              <Option key='7'>20年</Option>
                              <Option key='8'>30年</Option>
                            </Select>
                          )}
                        </Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
              </Row>
              {
                dateTypeRadio !== '0' &&
                <Row>
                  <Col span={10}>
                    <FormItem
                      {...formItemLayout}
                      label='过期设置'
                    >
                      <div>
                        <div style={{ float: 'left', marginRight: 10 }}>过期后调整至</div>
                        <div style={{ float: 'left' }}>
                          {getFieldDecorator('expireTranslate', {
                            initialValue: '0',
                            rules: [{
                              required: true,
                              message: '请选择会员期限',
                            }],
                          })(
                            <Select
                              style={{ width: 100 }}
                              getPopupContainer={trigger => trigger.parentNode}
                            >
                              <Option key='0'>非会员</Option>
                              <Option key='1'>会员</Option>
                            </Select>
                          )}
                        </div>
                      </div>
                    </FormItem>
                  </Col>
                </Row>
              }
              <Row>
                <Col span={10}>
                  <FormItem
                    {...formItemLayout}
                    label='领取人群'
                  >
                    {getFieldDecorator('applicablePeople', {
                      rules: [{
                        required: true,
                        message: '请选择领取人群',
                      }],
                    })(
                      <Select
                        placeholder='选择会员卡的领取人群'
                        getPopupContainer={trigger => trigger.parentNode}
                      >
                        <Option key='0'>全部用户</Option>
                        <Option key='1'>仅内部员工</Option>
                        <Option key='2'>仅外部员工</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card
              title='会员信息字段设置'
              bordered={false}
            >
              <div style={{ marginBottom: 15, marginLeft: 15 }}>
                <span style={{ color: 'red' }}>*</span>说明：可以根据各产业需求，启用所需的会员信息字段
              </div>
              {
                fieldList && fieldList.map((item, index, array) => {
                  return (
                    <div
                      key={item.fieldCode}
                      style={{ marginBottom: 10, marginLeft: 25 }}
                    >
                      <Input
                        placeholder={item.fieldLabel}
                        style={{ width: 200, marginRight: 10 }}
                        disabled
                        key={item.fieldCode}
                      />
                      {
                        item.fieldEnabled === 1
                          ? <Button
                            type='primary'
                            size='small'
                            onClick={() => this._handleChangeBaseFieldEnabled(item, index)}
                          >
                              已启用
                          </Button>
                          : <a style={{ marginRight: 10 }} onClick={() => this._handleChangeBaseFieldEnabled(item, index)}>启用</a>
                      }
                      {
                        index !== 0 &&
                        <a onClick={() => this._handleChangeBaseFieldSort('up', item, index)}>
                          <Icon
                            type='arrow-up'
                            style={{ fontSize: 18, marginRight: 10 }}
                          />
                        </a>
                      }
                      {
                        index !== (array.length - 1) &&
                        <a onClick={() => this._handleChangeBaseFieldSort('down', item, index)}>
                          <Icon
                            type='arrow-down'
                            style={{ fontSize: 18 }}
                          />
                        </a>
                      }
                    </div>
                  )
                })
              }
              <div style={{ marginTop: 15, marginBottom: 15, marginLeft: 25 }}>
                <div style={{ marginBottom: 10 }}>产业字段</div>
                {
                  expandFieldList && expandFieldList.map((item, index, array) => {
                    return (
                      <div
                        key={item.fieldId}
                        style={{ marginBottom: 10 }}
                      >
                        <Input
                          placeholder={item.fieldLabel}
                          key={item.fieldId}
                          style={{ width: 200, marginRight: 10 }}
                          disabled
                        />
                        {
                          item.fieldEnabled === 1
                            ? <Button
                              type='primary'
                              size='small'
                              onClick={() => this._handleChangeExpandFieldEnabled(item, index)}
                            >
                              已启用
                            </Button>
                            : <a style={{ marginRight: 10 }} onClick={() => this._handleChangeExpandFieldEnabled(item, index)}>启用</a>
                        }
                        {
                          index !== 0 &&
                          <a onClick={() => this._handleChangeExpandFieldSort('up', item, index)}>
                            <Icon
                              type='arrow-up'
                              style={{ fontSize: 18, marginRight: 10 }}
                            />
                          </a>
                        }
                        {
                          index !== (array.length - 1) &&
                          <a onClick={() => this._handleChangeExpandFieldSort('down', item, index)}>
                            <Icon
                              type='arrow-down'
                              style={{ fontSize: 18 }}
                            />
                          </a>
                        }
                      </div>
                    )
                  })
                }
              </div>
            </Card>
            <Row className={styles['option-save']}>
              <Col>
                <Button
                  type='primary'
                  title='保存'
                  htmlType='submit'
                >
                  保存
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state['memberCenter.card'],
    showListSpin: state['common.showListSpin'],
    auths: state['common.auths'],
    userInfo: state['common.userInfo'],
    aliToken: state['common.aliToken'],
  }
}

export default connect(['common.userInfo', 'common.auths', 'common.showListSpin', 'common.aliToken', 'memberCenter.card'], mapStateToProps)(Form.create()(MemberCardAddDetail))
