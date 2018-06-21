import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'

import { Card, Form, Input, Row, Col, Radio, Button, Icon, message } from 'antd'
import { Link } from 'react-router-dom'

import { getUrlParam } from 'Utils/params'
import { isEmpty, trim } from 'Utils/lang'
import * as urls from 'Global/urls'
import Module from './module'
import styles from './styles.less'
import CustomField, { validateField } from './customField'
import { typeToName } from './dic'

const FormItem = Form.Item
const RadioGroup = Radio.Group

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}
const formItemLayout1 = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
}

const formItemLayoutDisplay = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

class Add extends Component {
  state = {
    orgId: '',
    componentType: '1',
    options: [],
    fieldLabel: '',
    hasInit: false,
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(Module.actions.resetField())
  }

  componentWillMount() {
    const { dispatch, match, history } = this.props
    const orgId = getUrlParam('orgId')
    if (orgId) {
      this.setState({ orgId })
      if (match.params && match.params.fieldId) {
        dispatch(Module.actions.getField({ fieldId: match.params.fieldId }))
      }
    } else {
      history.replace(urls.MEMBER_CUSTOM_FIELDS)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { hasInit } = this.state
    if (!hasInit && nextProps.info.fieldId) {
      this.setState({
        fieldLabel: nextProps.info.fieldLabel,
        componentType: nextProps.info.componentType,
        options: nextProps.info.options,
        hasInit: true,
      })
    }
  }

  // 删除
  remove = (index) => {
    const { options } = this.state
    const { form } = this.props
    options.splice(index, 1)
    options.forEach((value, index) => {
      form.setFieldsValue({
        [`optionName${index}`]: value.optionName
      })
    })
    this.setState({ options })
  }

  // 新增
  add = () => {
    const { options } = this.state
    options.push({ optionName: '' })
    this.setState({ options })
  }

  // 选择切换
  _changeRadio = (e) => {
    const componentType = e.target.value
    this.setState({
      componentType,
      options: [],
    })
  }

  // 提交
  handleSubmit = (e) => {
    const { form, dispatch, history, info } = this.props
    const { options, orgId } = this.state
    let hasError = false
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        // 如果为单选或多选校验选项是否添加
        if (['3', '4'].includes(values.componentType)) {
          const arr = options.map(op => { return op.optionName })
          if (arr.length === 0) {
            message.error('请添加选项！')
            hasError = true
          }
          if ((new Set(arr)).size !== arr.length) {
            message.error('存在重复选项！')
            hasError = true
          }
        }
        if (hasError) {
          return
        }
        dispatch(Module.actions.addField({
          fieldId: isEmpty(info) ? '' : info.fieldId,
          orgCode: orgId,
          options,
          fieldLabel: values.fieldLabel,
          componentType: values.componentType,
        })).then(res => {
          if (res.status === 'success') {
            history.push({
              pathname: `${urls.MEMBER_CUSTOM_FIELDS}`,
              search: `fromOrgId=${orgId}`
            })
          }
        })
      }
    })
  }

  _genOptions = (options) => {
    const { componentType } = this.state
    const { getFieldDecorator } = this.props.form
    const selectAfter = (index) => {
      return (
        <Icon
          className='dynamic-delete-button'
          type='minus-circle-o'
          onClick={() => options.length > 1 && this.remove(index)}
        />
      )
    }
    return (
      <div>
        {
          !isEmpty(options) && options.map((value, index) => {
            return (
              <FormItem
                {...formItemLayout1}
                label={`选项${index + 1}`}
                key={index}
              >
                {getFieldDecorator(`optionName${index}`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: options[index].optionName,
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: '请输入10个字以内的选项内容！',
                  }],
                })(
                  <Input
                    placeholder='请输入10个字以内的选项内容'
                    onChange = {(e) => { this._handleOptionChange(e, index) }}
                    addonAfter={selectAfter(index)}
                    maxLength='10'
                  />
                )}
              </FormItem>
            )
          })
        }
        {
          (componentType === '3' || componentType === '4') ? (
            <Row>
              <Col
                span={12}
              >
                <Button
                  type='dashed'
                  onClick={this.add}
                  style={{ marginBottom: 30, marginLeft: 60 }}
                >
                  <Icon type='plus' /> 新增一行
                </Button>
              </Col>
            </Row>
          ) : null
        }
      </div>
    )
  }

  _handleOptionChange = (e, index) => {
    const { options } = this.state
    options[index]['optionName'] = trim(e.target.value)
    this.setState({ options })
  }

  _handleLabelChange = (e) => {
    this.setState({ fieldLabel: e.target.value })
  }

  render() {
    const { info } = this.props
    const { getFieldDecorator } = this.props.form
    const { orgId, componentType, options, fieldLabel } = this.state
    return (
      <div>
        <Card title='产业字段配置' bordered={false} >
          <Form
            id='filter-form'
            onSubmit={this.handleSubmit}
          >
            <Col span={12}>
              <Row>
                <Col span={22}>
                  <FormItem
                    {...formItemLayout}
                    label='产业字段'
                  >
                    {getFieldDecorator('fieldLabel', {
                      initialValue: isEmpty(info) ? undefined : info.fieldLabel,
                      rules: [{
                        required: true,
                        message: '请输入10个字以内的字段名称!',
                      }],
                    })(
                      <Input placeholder='请输入10个字以内的字段名称' maxLength='10' onChange={this._handleLabelChange} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem
                    {...formItemLayout}
                    label='字段属性'
                  >
                    {getFieldDecorator('componentType', {
                      initialValue: isEmpty(info) ? componentType : info.componentType,
                      rules: [{
                        required: true,
                        message: '请选择字段属性!',
                      }],
                    })(
                      <RadioGroup onChange={this._changeRadio}>
                        {
                          Object.keys(typeToName).map(key => {
                            return <Radio key={key} value={key}>{typeToName[key]}</Radio>
                          })
                        }
                      </RadioGroup>
                    )}
                  </FormItem>
                  {this._genOptions(options)}
                </Col>
              </Row>
              <Row>
                <Col>
                  <Link
                    to={{
                      pathname: `${urls.MEMBER_CUSTOM_FIELDS}`,
                      search: `fromOrgId=${orgId}`
                    }}
                  >
                    <Button style={{ marginLeft: '40px' }}>取消</Button>
                  </Link>
                  <Button
                    type='primary'
                    htmlType='submit'
                    style={{ marginLeft: '30px' }}
                  > 添加
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <div id='effectArea' className={styles['effect-area']}>
                <h4>呈现效果参照</h4>
                <FormItem
                  {...formItemLayoutDisplay}
                  label={fieldLabel || '--'}
                >
                  {getFieldDecorator('customField', {
                    rules: [{
                      validator: validateField(componentType)
                    }],
                  })(
                    <CustomField
                      fieldLabel={fieldLabel}
                      options={options}
                      componentType={componentType}
                      getPopContainer={() => document.getElementById('effectArea')}
                    />
                  )}
                  
                </FormItem>
              </div>
            </Col>
          </Form>
        </Card>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state['memberCenter.customFields']
  }
}
export default connect(['memberCenter.customFields'], mapStateToProps)(Form.create()(Add))
