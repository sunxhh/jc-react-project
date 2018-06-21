import React, { Component } from 'react'
import { Form, Input, Row, Col, Button } from 'antd'
import { Link } from 'react-router-dom'

import style from '../../app/pages/layout/style.less'

const FormItem = Form.Item
const defaultFormItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 15 },
}
const defaultNoLabelFormItemLayout = {
  wrapperCol: { span: 23 },
}

class TableFilter extends Component {
  _renderPopupField = (field, getFieldDecorator) => (
    <div
      id={field.id}
      style={{ position: 'relative' }}
    >
      {getFieldDecorator(field.id, field.options)(
        field.element
      )}
    </div>
  )

  _renderFieldLayout = (getFieldDecorator, fields, formItemLayout) => {
    return (
      <Row
        justify='start'
        type='flex'
      >
        {
          fields.map(field => (
            <Col
              key={field.id}
              span={field.span || 5}
            >
              <FormItem
                className={style['jc-table-filter-item']}
                {...(field.props)}
                {
                ...(
                  field.formItemLayout ||
                    formItemLayout ||
                    (field.props.label ? defaultFormItemLayout : defaultNoLabelFormItemLayout)
                )
                }
              >
                {field.hasPopup && (this._renderPopupField(field, getFieldDecorator))}
                {!field.hasPopup && getFieldDecorator(field.id, field.options)(
                  field.element ||
                  <Input
                    placeholder={field.placeHolder}
                    onChange={field.onChange}
                  />
                )}
              </FormItem>
            </Col>
          ))
        }
      </Row>
    )
  }

  renderExtendBtn = button => {
    return (
      <Button
        key={button.id}
        className={style['jc-table-filter-btn']}
        type='primary'
        {...button.props}
        onClick={(e) => {
          (button.handleClick instanceof Function)
            ? (button.needFilterBean
              ? button.handleClick(this.props.form.getFieldsValue(), e)
              : button.handleClick(e))
            : null
        }}
      >{button.name}
      </Button>
    )
  }

  _renderButtonLayout = (extendButtons, submitText, span, styles, props) => {
    return (
      <Row
        {...props}
        style={styles}
      >
        <Button
          className={style['jc-table-filter-btn']}
          key='confirm'
          type='primary'
          onClick={() => this.props.handleChange(this.props.form.getFieldsValue())}
        >
          {submitText || '查询'}
        </Button>
        {
          extendButtons && extendButtons.map(button => (button.handleClick instanceof Function)
            ? this.renderExtendBtn(button)
            : (
              <Link to={button.handleClick}>
                {this.renderExtendBtn(button)}
              </Link>
            ))
        }
      </Row>
    )
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { fields, extendButtons, formItemLayout, submitText, layout } = this.props.filterSetting
    const fieldLayout = this._renderFieldLayout(getFieldDecorator, fields, formItemLayout)
    switch (layout || 'vertical') {
      case 'horizontal':
        return (
          <Form className='search-form'>
            <Row>
              <Col span={20}>
                {fieldLayout}
              </Col>
              <Col span={4}>
                {this._renderButtonLayout(extendButtons, submitText, 12)}
              </Col>
            </Row>
          </Form>
        )

      case 'vertical':
        return (
          <Form className='search-form'>
            {fieldLayout}
            {this._renderButtonLayout(extendButtons.reverse(), submitText, 2, { margin: '8px 0' }, { type: 'flex', justify: 'end' })}
          </Form>
        )
      case 'inline':
      default:
        return (
          <Form className='search-form'>
            <Row type='flex'>
              {fieldLayout.props.children}
              {this._renderButtonLayout(extendButtons, submitText, 2, { margin: '8px 0' }).props.children}
            </Row>
          </Form>
        )
    }
  }
}

export default Form.create()(TableFilter)
