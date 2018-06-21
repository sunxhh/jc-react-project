import React from 'react'
import ReactDOM from 'react-dom'
import { Modal, Form, Input, Button, message } from 'antd'
import styles from './ModalForm.less'

const defaultFormItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

const FormItem = Form.Item

const showModalForm = (params = {}) => {
  const maskDiv = document.createElement('div')
  maskDiv.setAttribute('class', 'mask-div')
  document.body.appendChild(maskDiv)

  const _close = () => {
    const unmountResult = ReactDOM.unmountComponentAtNode(maskDiv)
    if (unmountResult) {
      maskDiv.parentNode.removeChild(maskDiv)
    }
  }

  const { title, onOk, okText, okVisible, cancelText, cancelVisible, fields, validator, formItemLayout } = params

  class ModalForm extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        loading: false
      }
    }

    _onSubmit = e => {
      e.preventDefault()
      this.props.form.validateFields((err, values) => {
        if (!err) {
          let isFinish = true
          if (validator) {
            const validateResult = validator(values)
            if (validateResult.error) {
              message.error(validateResult.payload, 3)
              isFinish = false
            }
          }

          if (isFinish) {
            this.setState({
              loading: true
            })
            const res = onOk && onOk(values)
            if (res instanceof Promise) {
              res.then((res) => {
                if (res) {
                  _close()
                }
                this.setState({
                  loading: false
                })
              })
            } else {
              _close()
              this.setState({
                loading: false
              })
            }
          }
        }
      })
    }

    render() {
      const { form } = this.props
      const { loading } = this.state
      const { getFieldDecorator } = form
      return (
        <Modal
          visible={true}
          onCancel={_close}
          c
          footer={null}
          title={title || '输入框'}
          style={{ minWidth: '580px' }}
        >
          <div>
            <Form
              className={styles['jc-modal-form']}
              onSubmit={this._onSubmit}
              id='modal-form'
            >
              {
                fields.map(field => (
                  <FormItem
                    key={field.id}
                    {...(formItemLayout || defaultFormItemLayout)}
                    {...field.props}
                  >
                    {getFieldDecorator(field.id, field.options)(
                      field.element || <Input placeholder={field.placeHolder} />
                    )}
                  </FormItem>
                ))
              }
              <FormItem className={styles['jc-modal-form-footer']}>
                {
                  cancelVisible !== false &&
                  <Button
                    key='cancel'
                    onClick={_close}
                  >{cancelText || '取消'}
                  </Button>
                }

                {
                  okVisible !== false &&
                  <Button
                    loading={loading}
                    key='confirm'
                    type='primary'
                    htmlType='submit'
                  >{okText || '确定'}
                  </Button>
                }
              </FormItem>
            </Form>
          </div>
        </Modal>
      )
    }
  }

  ReactDOM.render(
    React.createElement(Form.create()(ModalForm)),
    maskDiv
  )
}

export { showModalForm }
