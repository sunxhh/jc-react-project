import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Select, DatePicker } from 'antd'
import styles from './Filter.less'

const FormItem = Form.Item
const { Option } = Select
const { RangePicker } = DatePicker

export const FieldTypes = {
  TEXT: 'Text',
  INPUT: 'Input',
  SELECT: 'Select',
  RANGEPICKER: 'RangePicker'
}

class Filter extends React.Component {
  static propTypes = {
    fields: PropTypes.array, // 筛选项列表

    /*  field 参数，若需要，可继续添加
      key: PropTypes.string,         // 关联 key 值
      label: PropTypes.string,       // label 值
      initialValue: PropTypes.any,   // 初始化值
      type: PropTypes.string,        // 组件类型，参考 FieldTypes
      content: PropTypes.any,        // 组件内容，需要时用
      element: PropTypes.any,        // 自定义组件
    */

    extraBtns: PropTypes.array, // 额外的按钮
    onSearch: PropTypes.func, // 点击 `查询` 按钮时的回调
  }

  _onSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { onSearch } = this.props
        onSearch && onSearch(values)
      }
    })
  }

  _renderFieldItem(field) {
    switch (field.type) {
      case FieldTypes.TEXT: {
        return (
          <span>{field.content}</span>
        )
      }
      case FieldTypes.INPUT: {
        return (
          <Input placeholder={`请输入${field.label}`} />
        )
      }
      case FieldTypes.SELECT: {
        return (
          <Select
            showSearch
            allowClear
            style={{ width: 175 }}
            placeholder={`请选择${field.label}`}
            optionFilterProp='children'
            disabled={field.disabled}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            getPopupContainer={() => document.getElementById('listFilter')}
          >
            <Option value=''>全部</Option>
            {
              field.content.map(item => (
                <Option
                  key={item.value}
                  value={item.value}
                >
                  {item.name}
                </Option>
              ))
            }
          </Select>
        )
      }
      case FieldTypes.RANGEPICKER: {
        return (
          <RangePicker
            {...field.exProps}
            getCalendarContainer={() => document.getElementById('listFilter')}
          />
        )
      }
    }
  }

  render() {
    const { form, fields, extraBtns } = this.props
    const { getFieldDecorator } = form
    return (
      <div
        className='search-form'
        id='listFilter'
        style={{ position: 'relative' }}
      >
        <Form
          className={styles.filter}
          onSubmit={this._onSubmit}
        >
          {
            fields.map(field => (
              <div key={field.key}>
                {field.label && <span>{field.label}： </span>}
                <div className={styles['filter_item_wrapper']}>
                  <FormItem key={field.key}>
                    {getFieldDecorator(field.key, { initialValue: field.initialValue, rules: field.rules })(
                      field.element || this._renderFieldItem(field)
                    )}
                  </FormItem>
                </div>
              </div>
            ))
          }
          <div className={styles['filter_btns']}>
            <Button key='confirm' type='primary' htmlType='submit'>查询</Button>
            {
              extraBtns && extraBtns.map(btn => btn)
            }
          </div>
        </Form>
      </div>
    )
  }
}

export default Form.create()(Filter)
