import React, { Component } from 'react'
import { Form, Row, Col, Input, Select, InputNumber, Button } from 'antd'
import { connect } from 'react-redux'
import * as actions from './reduck'
import styles from './style.less'
import { MATER_SERVICE } from 'Global/urls'

const FormItem = Form.Item
const TextArea = Input.TextArea

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const formItemLayoutTextArea = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}
class ServiceAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  // 默认props
  static defaultProps = {
    serviceClassList: [],
    serviceTypeList: [],
    loadingBtn: false,
  }

  // 生命周期， 初始化数据
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(actions.listConditions())
  }

  // 提交处理
  _handleSubmit = (e) => {
    e.preventDefault()
    const { form, dispatch, history } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        dispatch(actions.add(values)).then(res => {
          if (res === 0) {
            history.push(MATER_SERVICE)
          }
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { serviceClassList, serviceTypeList } = this.props
    return (
      <div>
        <Form onSubmit={this._handleSubmit}>
          <Row id={'rowArea'}>
            <Col span={10}>
              <FormItem
                {...formItemLayout}
                label='服务名称：'
              >
                {getFieldDecorator('serviceName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入服务名称',
                    }
                  ],
                })(
                  <Input
                    placeholder='服务名称'
                    maxLength='20'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem
                {...formItemLayout}
                label='服务类型：'
              >
                {getFieldDecorator('serviceType', {
                  rules: [{
                    required: true,
                    message: '请选择服务类型'
                  }],
                })(
                  <Select
                    placeholder='请选择服务类型'
                    showSearch={true}
                    filterOption={this._filterOption}
                    getPopupContainer={() => document.getElementById('rowArea')}
                  >
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
            <Col span={10}>
              <FormItem
                {...formItemLayout}
                label='服务价格：'
              >
                {getFieldDecorator('servicePrice', {
                  rules: [
                    {
                      required: true,
                      message: '请输入服务价格',
                    },
                    {
                      validator: (rule, value, callback) => {
                        let errorMessage = '保留两位小数'
                        if (value === undefined) {
                          rule.message = errorMessage
                          callback(errorMessage)
                        } else if (value > 999999999.99) {
                          errorMessage = '输入值不能大于 999999999.99'
                          rule.message = errorMessage
                          callback(errorMessage)
                        } else {
                          callback()
                        }
                      }
                    }
                  ],
                })(
                  <InputNumber
                    min={0}
                    step={0.01}
                    max={999999999.99}
                    precision={2}
                    placeholder='请输入服务价格'
                    style={{ width: '300px' }}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem
                {...formItemLayout}
                label='服务分类：'
              >
                {getFieldDecorator('serviceClass', {
                  rules: [{
                    required: true,
                    message: '请选择服务分类'
                  }],
                })(
                  <Select
                    placeholder='请选择服务分类'
                    showSearch={true}
                    filterOption={this._filterOption}
                    getPopupContainer={() => document.getElementById('rowArea')}
                  >
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
          </Row>
          <Row>
            <Col span={20}>
              <FormItem
                {...formItemLayoutTextArea}
                label='描述：'
              >
                {getFieldDecorator('remark', {
                  rules: [{
                    required: true,
                    message: '请输入描述'
                  }],
                  initialValue: ''
                })(
                  <TextArea
                    placeholder='请输入描述'
                    maxLength='500'
                    rows='5'
                  />
                )}
              </FormItem>
              <FormItem className={styles['operate-btn']}>
                <Button
                  type='primary'
                  title='点击保存'
                  htmlType='submit'
                  loading={this.props.loadingBtn}
                >
                  保存
                </Button>
                <Button
                  title='点击取消'
                  onClick={() => this.props.history.push(MATER_SERVICE)}
                >
                  取消
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    serviceClassList: state.service.serviceClassList,
    serviceTypeList: state.service.serviceTypeList,
    loadingBtn: state.service.loadingBtn,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ServiceAdd))
