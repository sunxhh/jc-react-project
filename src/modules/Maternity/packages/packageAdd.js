import React, { Component } from 'react'
import { Form, Row, Col, Input, Select, InputNumber, Button, Popover } from 'antd'
import { connect } from 'react-redux'
import * as actions from './reduck'
import { MATER_PACKAGES } from 'Global/urls'
import styles from './style.less'
import { fetchMaternity as fetchData } from 'Utils/fetch'
import ModalSelectInput from 'Components/modal/ModalSelectInput'
import apis from '../apis'

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
class PackageAdd extends Component {
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
      const { serviceList, ...restvalues } = values
      if (!err) {
        dispatch(actions.add({
          ...restvalues,
          serviceList: serviceList && serviceList.length > 0 ? serviceList.map((item) => item.id) : '',
        })).then(res => {
          if (res === 0) {
            history.push(MATER_PACKAGES)
          }
        })
      }
    })
  }
  // 获取套餐类型
  _getDictValue = (dictionary, value) => {
    const filterDic = dictionary.filter(dictionary => dictionary.value === value)
    if (filterDic.length > 0) {
      return filterDic[0].name
    }
    return ''
  }

  // 服务弹层列表
  _serviceColumns = [
    {
      key: 'serviceClass',
      title: '服务分类',
      dataIndex: 'serviceClass',
      render: (text, record) => {
        return (
          <p className={styles['item-content']}>{this._getDictValue(this.props.serviceClassList, record.serviceClass)}</p>
        )
      }
    },
    {
      key: 'serviceType',
      title: '服务类型',
      dataIndex: 'serviceType',
      render: (text, record) => {
        return (
          <p className={styles['item-content']}>{this._getDictValue(this.props.serviceTypeList, record.serviceType)}</p>
        )
      }
    },
    {
      key: 'serviceName',
      title: '服务名称',
      dataIndex: 'serviceName',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'servicePrice',
      title: '服务价格',
      dataIndex: 'servicePrice',
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'remark',
      title: '描述',
      dataIndex: 'remark',
      render: (text) => {
        return (
          <Popover
            placement='topRight'
            content={<div className={styles['pop']}>{text && text !== 'null' && text}</div>}
            title='描述'
          >
            <span>{text && text.length > 10 ? `${text.substring(0, 10)}...` : text}</span>
          </Popover>
        )
      }
    }
  ]

  // 选择服务信息
  _getServiceParams = () => {
    const { form } = this.props
    return {
      modalParam: {
        title: '选择服务项目'
      },
      rowKey: 'id',
      selectType: 'checkbox',
      fetch: fetchData,
      url: apis.service.list,
      extraParams: { status: '1' },
      instantSelected: false,
      showSelectedTagFlag: true,
      selectedTagFieldName: 'serviceName',
      selectedList: form.getFieldValue('serviceList'),
      columns: this._serviceColumns,
      empty: () => {
        return (
          <span>
            未找到您查询的服务，请确认 -
            <a
              target='_blank'
              href='/maternity/service/add'
            > 新增服务
            </a>
          </span>
        )
      },
      filter: [{
        id: 'serviceClass',
        props: {
          label: '服务分类：'
        },
        element: (
          <Select
            dropdownMatchSelectWidth={false}
            style={{ width: '140px' }}
            placeholder='请选择服务分类'
            getPopupContainer={() => document.getElementsByClassName('ant-modal-wrap')[0]}
          >
            <Select.Option value=''>全部</Select.Option>
            {
              this.props.serviceClassList.map((itme) => {
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
        )
      }, {
        id: 'keyWords',
        element: (
          <Input
            placeholder='请输入关键词'
          />
        )
      }
      ]
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { comboTypeList } = this.props
    return (
      <div>
        <Form onSubmit={this._handleSubmit}>
          <Row>
            <Col span={10}>
              <FormItem
                {...formItemLayout}
                label='套餐名称：'
              >
                {getFieldDecorator('comboName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入套餐名称',
                    }
                  ],
                })(
                  <Input
                    placeholder='套餐名称'
                    maxLength='20'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={10} id={'selectedArea'}>
              <FormItem
                {...formItemLayout}
                label='套餐类型：'
              >
                {getFieldDecorator('comboType', {
                  rules: [{
                    required: true,
                    message: '请选择套餐类型'
                  }],
                })(
                  <Select
                    dropdownMatchSelectWidth={false}
                    // style={{ width: '140px' }}
                    placeholder='请选择套餐类型'
                    getPopupContainer={() => document.getElementById('selectedArea')}
                  >
                    {
                      comboTypeList.map((itme) => {
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
                label='套餐金额：'
              >
                {getFieldDecorator('comboPrice', {
                  rules: [
                    {
                      required: true,
                      message: '请输入套餐金额',
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
                    placeholder='请输入套餐金额'
                    style={{ width: '300px' }}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem
                label='服务项目：'
                {...formItemLayout}
              >
                {getFieldDecorator('serviceList', {
                  rules: [{
                    required: true,
                    message: '请选择服务项目',
                  }],
                })(
                  <ModalSelectInput
                    displayName='serviceName'
                    params = {this._getServiceParams}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              <FormItem
                {...formItemLayoutTextArea}
                label='环境服务：'
              >
                {getFieldDecorator('environService', {
                  rules: [{
                    required: true,
                    message: '请输入环境服务'
                  }],
                  initialValue: ''
                })(
                  <TextArea
                    placeholder='请输入环境服务'
                    maxLength={500}
                    rows='5'
                  />
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
                    maxLength={500}
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
                  onClick={() => this.props.history.push(MATER_PACKAGES)}
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
    comboTypeList: state.packages.comboTypeList,
    serviceClassList: state.packages.serviceClassList,
    serviceTypeList: state.packages.serviceTypeList,
    loadingBtn: state.packages.loadingBtn,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(PackageAdd))
