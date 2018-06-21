import React from 'react'
import { Input, InputNumber, Select, DatePicker } from 'antd'
import PropTypes from 'prop-types'
import { isEmpty } from 'Utils/lang'
import moment from 'moment'

const Option = Select.Option

export default class CustomField extends React.Component {
  static propTypes = {
    componentType: PropTypes.string.isRequired, // 组件类型
    fieldLabel: PropTypes.string, // 组件label
    options: PropTypes.array, // 单选、多选选项
    getPopContainer: PropTypes.func, // Select、Datepicker pop容器
  }

  componentWillReceiveProps(nextProps) {
    const { componentType } = this.props
    if (componentType !== nextProps.componentType) {
      this._handleChange(undefined)
    }
  }

  _handleChange = (e) => {
    const { onChange } = this.props
    if (onChange) {
      if (e && e.target) {
        onChange(e.target.value)
      } else {
        onChange(e)
      }
    }
  }

  _getFormItem = (componentType) => {
    const { fieldLabel, value, getPopContainer } = this.props
    switch (componentType) {
      case '1':
        return (
          <InputNumber
            style={{ width: '250px' }}
            value={value}
            maxLength='12'
            placeholder={`请输入${fieldLabel}`}
            onChange={this._handleChange}
          />)
      case '2':
        return (
          <Input
            value={value}
            maxLength='50'
            placeholder={`请输入${fieldLabel}`}
            onChange={this._handleChange}
          />)
      case '3':
        return (
          <Select
            allowClear
            value={value}
            placeholder={`请选择${fieldLabel}`}
            onChange={this._handleChange}
            getPopupContainer={getPopContainer || null}
          >
            {this._getOptions()}
          </Select>)
      case '4':
        return (
          <Select
            allowClear
            value={value}
            mode='multiple'
            placeholder={`请选择${fieldLabel}`}
            onChange={this._handleChange}
            getPopupContainer={getPopContainer || null}
          >
            {this._getOptions()}
          </Select>)
      case '5':
        return (
          <DatePicker
            allowClear
            getCalendarContainer={getPopContainer || null}
            value={value && moment(value)}
            style={{ width: '250px' }}
            placeholder={`请选择${fieldLabel}`}
            onChange={this._handleChange}
          />
        )
      default:
        return null
    }
  }

  _getOptions = () => {
    const { options } = this.props
    return isEmpty(options) ? null : options.map((option, index) => {
      const value = option.optionId ? option.optionId : `${index}${option.optionName}`
      return (
        <Option key={value} value={value}>
          {option.optionName}
        </Option>
      )
    })
  }

  render() {
    const { componentType } = this.props
    return (
      this._getFormItem(componentType)
    )
  }
}

/*
 * 校验产业自定义字段
 * @param {*} componentType 组件类型
 */
export const validateField = componentType => (rule, value, callback) => {
  if (isEmpty(value)) {
    callback()
    return
  }
  if (componentType === '1') {
    const objReg = /(^[0-9]{1,9}$)|(^[0-9]{1,9}[\.]{1}[0-9]{1,2}$)/
    if ((String(value) && !objReg.test(value)) || parseFloat(value) < 0) {
      callback('只能输入9位整数+2位小数!')
      return
    }
  }
  callback()
}

/*
 * 获取表单初始值（编辑页面回显）
 * @param {*} componentType 组件类型
 * @param {*} value 组件值
 */
export const getInitailFieldValue = (componentType, value) => {
  if (isEmpty(value) || !componentType) return undefined
  if (componentType !== '4') {
    return value[0]
  } else {
    return value
  }
}

/*
 * 获取表单信息
 * @param {*} values  ant Form values
 * @param {*} customFieldst 自定义字段信息（根据orgCode获得）
 */
export const getFieldsValue = (values, customFieldst) => {
  return isEmpty(customFieldst) ? [] : customFieldst.map(item => {
    let field = {}
    field['fieldName'] = item['fieldName']
    field['id'] = item['id'] || ''
    // 多选组件回显需要传数组
    if (item.componentType === '4') {
      field['fieldValue'] = isEmpty(values[item['fieldName']]) ? [] : values[item['fieldName']]
    } else if (item.componentType === '5') {
      let value = (values[item['fieldName']]) ? [`${moment(values[item['fieldName']]).format('YYYY-MM-DD')} 00:00:00`] : []
      field['fieldValue'] = value
    } else {
      field['fieldValue'] = values[item['fieldName']] ? [values[item['fieldName']]] : []
    }
    return field
  })
}
