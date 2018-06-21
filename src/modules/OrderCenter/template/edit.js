import React, { Component } from 'react'
import { Form, Input, DatePicker, Col, Select, Row, Switch, Button, Cascader, Card, Icon } from 'antd'
import { connect } from 'react-redux'
import style from './style.less'
import { addTemplate, deleteTemplateDetailCache, getDictionary, getTemplateDetail, updateTemplate, getOrgList, getBusinessTypeList } from './reduck'
import { isEmpty } from 'Utils/lang'

const FormItem = Form.Item

export const FormItemTypes = {
  TEXT: 'Text',
  INPUT: 'Input',
  SELECT: 'Select',
  DATEPICKER: 'DatePicker',
  SWITCH: 'Switch',
  CASCADER: 'Cascader'
}

const DesignSize = 'default'

const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}

class AddTemplete extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showRefundAmount: true,
      templateNo: this.props.match.params.id
    }
  }

  // 生命周期， 初始化数据
  componentDidMount() {
    const templateNo = this.state.templateNo
    if (templateNo) {
      this.props.dispatch(getTemplateDetail({ templateNo })).then((data) => {
        this.setState({
          showRefundAmount: !!data.refundFlag
        })
      })
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(getDictionary({ codeKeys: ['orderType', 'ladingType', 'refundStatus', 'pinCode'] }))
    dispatch(getOrgList({ 'org': { 'orgMod': 1, 'orgLevel': 1 }}))
    dispatch(getBusinessTypeList())
  }

  componentWillUnmount() {
    this.props.dispatch(deleteTemplateDetailCache())
  }

  /**
   * 表单内容的顺序
   */
  fieldKeys = ['templateName', 'platform', 'parentOrderType', 'parentBusinessType', 'ladingType', 'availableDate', 'pingCode']

  /*
    生成默认组件
  */
  _formItemCreatorMap = {
    [FormItemTypes.INPUT]: (data) => {
      return (
        <Input size={DesignSize} placeholder={data.placeholder} {...data.optionConfig} />
      )
    },
    [FormItemTypes.SELECT]: (data) => {
      return (
        <Select
          size={DesignSize}
          getPopupContainer={() => document.getElementById(data.id)}
        >
          <Select.Option value=''>请选择</Select.Option>
          {data.content && data.content.map((key) => {
            return (
              <Select.Option
                key={key.value}
                value={key.value}
              >
                {key.name}
              </Select.Option>
            )
          })}
        </Select>
      )
    },
    [FormItemTypes.DATEPICKER]: (data) => {
      return (
        <DatePicker size={DesignSize} />
      )
    },
    [FormItemTypes.CASCADER]: (data) => {
      return (
        <Cascader
          options={data.content}
          expandTrigger='hover'
          getPopupContainer={() => document.getElementById(data.id)}
          placeholder='请选择商品类型'
        />
      )
    }
  }

  /*  生成表单单个组件
    id: PropTypes.string,          // id 值
    label: PropTypes.string,       // label 值
    initialValue: PropTypes.any,   // 初始化值
    type: PropTypes.string,        // 组件类型，参考 FormItemTypes
    content: PropTypes.any,        // 组件内容，需要时用
    config: PropTypes.any          // 组件的校验规则
    element: PropTypes.any,        // 自定义组件
  */
  _renderFormItem = (data) => {
    const { getFieldDecorator } = this.props.form
    return (
      <FormItem {...data.props} {...data.formItemLayout}>
        <div
          id={data.id}
          style={{ position: 'relative' }}
        >
          {getFieldDecorator(data.id, data.config)(
            data.element || this._formItemCreatorMap[data.type](data)
          )}
        </div>
      </FormItem>
    )
  }

  _getFormCol = (data) => {
    return (
      <Col
        key={data.id}
        span={data.span || 10}
      >
        {this._renderFormItem(data)}
      </Col>
    )
  }

  _getFormRow = (list, colNumber = 2) => {
    let rowRes = []
    for (let i = 0; i < list.length; i = i + colNumber) {
      let colList = list.slice(i, i + colNumber)
      rowRes.push(
        <Row key={'row_' + i}>
          {
            colList.map((item) => {
              return this._getFormCol(item)
            })
          }
        </Row>
      )
    }
    return rowRes
  }

  /**
   * 删除字符串首位空格
   *
   */
  trimParam (data) {
    Object.keys(data).forEach((key) => {
      let val = data[key]
      if (typeof val === 'string') {
        data[key] = val.trim()
      }
    })
    return data
  }

  /**
   * 提交表单
   */
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      let result = Object.assign({}, values)
      if (!isEmpty(result.businessType)) {
        result.parentBusinessType = result.businessType[0]
        result.businessType = result.businessType[1]
      } else {
        result.parentBusinessType = null
        result.businessType = null
      }
      result.refundFlag = result.refundFlag ? 1 : 0
      this.trimParam(result)
      const { dispatch } = this.props
      if (this.state.templateNo) {
        result.templateNo = this.state.templateNo
        dispatch(updateTemplate(result))
      } else {
        dispatch(addTemplate(result))
      }
    })
  }

  /**
   * 退款按钮选择修改
   */
  _refundStatusChange = (checked) => {
    if (!checked) {
      this.props.form.setFieldsValue({ 'refundAmount': 0 })
    }

    this.setState({
      showRefundAmount: checked
    })
  }

  _setDefaultData = (map, data) => {
    Object.keys(map).forEach(key => {
      let item = map[key]
      let id = item.id
      if (!isEmpty(data[id])) {
        if (item.handleDefaultValue) {
          item.config.initialValue = item.handleDefaultValue(data[id])
        } else {
          item.config.initialValue = String(data[id])
        }
      }
    })
  }

  render() {
    let { dict, templateDetail, orgList, showButtonSpin, businessTypeList } = this.props
    if (!this.state.templateNo) {
      templateDetail = {}
    }
    /**
     * 表单配置
     */
    const formItemConfigMap = {
      templateName: {
        id: 'templateName',
        props: {
          label: '模板名称'
        },
        options: {
          initialValue: ''
        },
        type: FormItemTypes.INPUT,
        placeholder: '请输入模板名称',
        config: {
          rules: [{
            required: true,
            message: '请输入模板名称',
          }, {
            validator: (rule, value, callback) => {
              if (isEmpty(value)) {
                callback()
                return
              } else if (value.trim() === '') {
                callback('模板名称不能为空字符！')
                return
              }
              if (value.length > 30) {
                callback('模板名称长度最多30个字符！')
                return
              }
              callback()
            }
          }],
          initialValue: templateDetail.templateName
        },
        formItemLayout
      },
      platform: {
        id: 'organizationType',
        formItemLayout,
        props: {
          label: '所属机构'
        },
        options: {},
        type: FormItemTypes.SELECT,
        placeholder: '请选择所属机构',
        content: orgList,
        config: {
          rules: [{
            required: true,
            message: '请选择所属机构',
          }],
          initialValue: templateDetail.organizationType && String(templateDetail.organizationType)
        },
      },
      parentOrderType: {
        id: 'orderType',
        formItemLayout,
        props: {
          label: '订单类型'
        },
        options: {},
        type: FormItemTypes.SELECT,
        placeholder: '请选择订单类型',
        content: dict.orderType,
        config: {
          rules: [{
            required: true,
            message: '请选择订单类型',
          }],
          initialValue: templateDetail.orderType && String(templateDetail.orderType)
        },
      },
      ladingType: {
        id: 'ladingType',
        formItemLayout,
        props: {
          label: '提单类型'
        },
        options: {},
        type: FormItemTypes.SELECT,
        placeholder: '请选择提单类型',
        content: dict.ladingType,
        config: {
          rules: [{
            required: true,
            message: '请选择提单类型',
          }],
          initialValue: templateDetail.ladingType && String(templateDetail.ladingType)
        },
      },
      parentBusinessType: {
        id: 'businessType',
        formItemLayout,
        props: {
          label: '商品类型'
        },
        options: {},
        type: FormItemTypes.CASCADER,
        placeholder: '请选择商品类型',
        content: businessTypeList,
        config: {
          rules: [{
            required: true,
            message: '请选择商品类型',
          }, {
            validator: (rule, value, callback) => {
              if (isEmpty(value)) {
                callback()
                return
              }
              if (isEmpty(value[0]) || isEmpty(value[1])) {
                callback('请选择商品类型')
              }
              callback()
            }
          }],
          initialValue: [templateDetail.parentBusinessType, templateDetail.businessType]
        }
      },
      availableDate: {
        id: 'availableDate',
        formItemLayout,
        props: {
          label: '订单有效期'
        },
        type: FormItemTypes.INPUT,
        placeholder: '请输入订单有效期',
        config: {
          rules: [
            {
              required: true,
              message: '请输入订单有效期',
            }, {
              validator: (rule, value, callback) => {
                if (isEmpty(value)) {
                  callback()
                  return
                }
                const objReg = /(^[0-9]*$)|(^[0-9]*[\.]{1}[0-9]{1}$)/
                if ((String(value) && !objReg.test(value)) || parseFloat(value) < 0) {
                  callback('请输入合法有效期!')
                  return
                }
                callback()
              }
            }
          ],
          initialValue: templateDetail.availableDate || 0.5
        },
        optionConfig: {
          addonAfter: '小时',
          // disabled: !!this.state.templateNo
        }
      },
      refundFlag: {
        id: 'refundFlag',
        formItemLayout: {
          labelCol: {
            span: 16
          },
          wrapperCol: {
            span: 8
          }
        },
        config: {
          initialValue: this.state.showRefundAmount
        },
        props: {
          label: '退款审核'
        },
        type: FormItemTypes.SWITCH,
        element: (
          <Switch checked={this.state.showRefundAmount} onChange={this._refundStatusChange} />
        )
      },
      refundAmount: {
        id: 'refundAmount',
        formItemLayout: {
          labelCol: {
            span: 8
          },
          wrapperCol: {
            span: 16
          }
        },
        props: {
          label: '高于',
          colon: false
        },
        type: FormItemTypes.INPUT,
        placeholder: '请输入金额',
        config: {
          rules: [{
            required: true,
            message: '请输入金额',
          }, {
            validator: (rule, value, callback) => {
              if (isEmpty(value)) {
                callback()
                return
              }
              const objReg = /(^[0-9]*$)|(^[0-9]{1,9}$)/
              if ((String(value) && !objReg.test(value)) || parseFloat(value) < 0) {
                callback('请输入整数的退款金额!')
                return
              }
              callback()
            }
          }],
          initialValue: templateDetail.refundAmount || 0
        },
        optionConfig: {
          addonAfter: '元'
        }
      },
      pingCode: {
        id: 'pinCode',
        formItemLayout,
        props: {
          label: 'Pin码'
        },
        options: {},
        type: FormItemTypes.SELECT,
        placeholder: '请选择Pin码',
        content: dict.pinCode,
        config: {
          rules: [{
            required: true,
            message: '请选择Pin码',
          }],
          initialValue: templateDetail.pinCode && String(templateDetail.pinCode)
        },
      },
    }

    // if (this.state.templateNo) {
    //   this._setDefaultData(formItemConfigMap, templateDetail)
    // }

    const fields = this.fieldKeys.map(key => {
      return formItemConfigMap[key]
    })
    const rowsCol = 2

    return (
      <Card
        className='add-templete-outter'
        title={templateDetail.templateNo ? '编辑模板' : '新增模板'}
        extra={<a href='javascript:;' onClick={() => history.go(-1)} className={style['goback']}><Icon type='rollback' />返回</a>}
      >
        <Form
          onSubmit={this.handleSubmit}
        >
          {
            this._getFormRow(fields, rowsCol)
          }
          <div className={style['separate-wrapper']}>
            <span className={style['separate-descripe']}>审核设置</span>
            <div className={style['separate-line']}>&nbsp;</div>
          </div>
          <Row className={style['refund-amount-row']}>
            <Col span={5}>
              {
                this._renderFormItem(formItemConfigMap.refundFlag)
              }
            </Col>
            <Col span={18}>
              {
                this.state.showRefundAmount && (
                  <div className={style['refund-amount-wrapper']}>
                    <div className={style['refund-amount']}>
                      {this._renderFormItem(formItemConfigMap.refundAmount)}
                    </div>
                    <span className={style['refund-amount-span']}>, 需要进行审核</span>
                  </div>
                )
              }
            </Col>
          </Row>
          <Row type='flex' justify='center'>
            <Col span={8}>
              <Button
                type='primary'
                htmlType='submit'
                loading={showButtonSpin}
              >
                提交
              </Button>
              <Button type='default' onClick={() => history.go(-1)}>
                取消
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }
}

const mapStateToProps = state => {
  return {
    dict: state.orderCenter.template.dictionary,
    templateDetail: state.orderCenter.template.templateDetail,
    orgList: state.orderCenter.template.orgList,
    showButtonSpin: state.common.showButtonSpin,
    businessTypeList: state.orderCenter.template.businessTypeList,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(
  Form.create()(AddTemplete)
)
