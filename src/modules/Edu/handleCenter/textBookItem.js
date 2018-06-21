import React, { Component } from 'react'
import { Form, Input, Row, Col, Icon } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

class TextBookItem extends Component {
  // _handleInputChange = (e) => {
  //   const { handleChange, itemKey } = this.props
  //   handleChange(e.target.value, itemKey)
  // }

  render() {
    const { getFieldDecorator, remove, textbookPrices, handleChange } = this.props
    return (
      <div>
        <Row>
          <Col>
            <FormItem
              {...formItemLayout}
              label='数量'
            >
              {getFieldDecorator(`bookNum${this.props.itemKey}`, {
                initialValue: 1
              })(
                <Input
                  onChange = {handleChange}
                  addonAfter={
                    <div>
                      <span>{textbookPrices.fee }{textbookPrices.unit}</span>
                      <a
                        onClick={remove}
                        href='javascript:;'
                      >
                        &nbsp;&nbsp;
                        <Icon type='minus-circle-o' />
                      </a>
                    </div>
                  }
                />
              )}

            </FormItem>
          </Col>
        </Row>
      </div>
    )
  }
}
export default TextBookItem

