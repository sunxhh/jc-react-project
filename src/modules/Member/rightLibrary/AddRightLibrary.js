import React from 'react'
import { Form, Input, Modal, Icon, Row, Col, Button, message } from 'antd'
import { isEmpty, trim } from 'Utils/lang'
import Module from './module'
import { connect } from '@dx-groups/arthur'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
}

class AddRightLibrary extends React.Component {
  state = {
    options: [{
      optionName: ''
    }],
    itemDeleteList: [],
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.info) && !isEmpty(nextProps.info.itemList)) {
      if (this.props.info.itemList !== nextProps.info.itemList) {
        let itemList = []
        nextProps.info.itemList.map(item => {
          itemList.push({
            optionId: item.itemId,
            optionName: item.itemName
          })
        })
        this.setState({
          options: itemList,
        })
      }
    }
  }

  // 新增文本
  _handleAddInput = () => {
    const { options } = this.state
    let optionNameArr = options.map(item => {
      return item.optionName
    })
    if (optionNameArr.includes('')) {
      message.error('权益选项不能为空！')
    } else {
      options.push({ optionName: '' })
      this.setState({ options })
    }
  }

  // 删除文本
  _handleRemoveInput = (index, value) => {
    const { options, itemDeleteList } = this.state
    const { form } = this.props
    if (!isEmpty(value.optionId)) {
      itemDeleteList.push(value.optionId)
      this.setState({ itemDeleteList })
    }
    options.splice(index, 1)
    form.setFieldsValue({ [`optionName${index}`]: undefined })
    options.forEach((value, index) => {
      form.setFieldsValue({
        [`optionName${index}`]: value.optionName
      })
    })
    this.setState({ options })
  }

  // 输入文本内容
  _handleChangeInput = (e, index) => {
    const { options } = this.state
    options[index]['optionName'] = trim(e.target.value)
    this.setState({ options })
  }

  // 关闭弹窗
  _handleCancel = () => {
    this.props.dispatch(Module.actions.showAddModalAction(false))
    this.setState({
      options: [{
        optionName: ''
      }],
      itemDeleteList: []
    })
    this.props.form.resetFields()
  }

  // 提交
  _handleOk = () => {
    const { isEdit, info } = this.props
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const itemList = []
        let argEdit = {}
        let argAdd = {}
        if (this.state.options.some(item => trim(item.optionName) === '')) {
          message.error('权益选项不能为空！')
          return
        }
        if (isEdit) {
          this.state.options.map((item) => {
            itemList.push({
              itemName: trim(item.optionName),
              itemId: item.optionId
            })
          })
          argEdit = {
            orgCode: this.props.orgCode,
            rightName: trim(values.rightName),
            itemList: itemList,
            rightId: info.rightId,
            itemDeleteList: this.state.itemDeleteList
          }
        } else {
          this.state.options.map((item) => {
            itemList.push({
              itemName: trim(item.optionName),
            })
          })
          argAdd = {
            orgCode: this.props.orgCode,
            rightName: trim(values.rightName),
            itemList: itemList,
          }
        }

        this.props.dispatch(Module.actions.addRightLibrary(isEdit ? argEdit : argAdd, this.props.isEdit)).then(res => {
          if (res.status === 'success') {
            this.setState({
              options: [{
                optionName: ''
              }],
              itemDeleteList: []
            })
            this.props.form.resetFields()
            this.props.dispatch(Module.actions.showAddModalAction(false))
            this.props.dispatch(Module.actions.getRightLibraryList({ orgCode: this.props.orgCode }))
          }
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { options } = this.state
    const { showAddModal, info, isEdit } = this.props
    const selectAfter = (index, value) => {
      return (
        <Icon
          className='dynamic-delete-button'
          type='minus-circle-o'
          onClick={() => this._handleRemoveInput(index, value)}
        />
      )
    }
    return (
      <Modal
        width='600px'
        title='配置权益库'
        visible={showAddModal}
        onOk={this._handleOk}
        onCancel={this._handleCancel}
        maskClosable={false}
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label='权益主题：'
          >
            {getFieldDecorator('rightName', {
              initialValue: isEdit ? ((!isEmpty(info) && !isEmpty(info.rightName)) ? info.rightName : null) : null,
              rules: [{
                required: true,
                message: '请输入10个字符以内的权益主题',
                max: 10
              }],
            })(
              <Input
                type='text'
                placeholder='请输入该产业的会员权益，例如借书数量'
                maxLength ='10'
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='权益选项：'
          >
            {getFieldDecorator('itemList')(
              <div>
                <p style={{ color: '#FF9900', lineHeight: '1.5' }}>请添加该权益主题对应的权益选项，没有可不填</p>
                {
                  !isEmpty(options) && options.map((value, index) => {
                    return (
                      <FormItem
                        key={index}
                      >
                        {getFieldDecorator(`optionName${index}`, {
                          validateTrigger: ['onChange', 'onBlur'],
                          initialValue: options[index].optionName,
                          rules: [{
                            required: true,
                            whitespace: true,
                            message: '请输入20个字以内的选项内容！',
                          }],
                        })(
                          <Input
                            placeholder={`选项${index + 1}: 请输入不同会员等级的对应权益`}
                            addonAfter={selectAfter(index, value)}
                            onChange = {(e) => { this._handleChangeInput(e, index) }}
                            maxLength='20'
                          />
                        )}
                      </FormItem>
                    )
                  })
                }
                <Row>
                  <Col
                    span={12}
                  >
                    <Button
                      type='dashed'
                      onClick={this._handleAddInput}
                      style={{ marginBottom: 30 }}
                    >
                      <Icon type='plus' /> 新增一行
                    </Button>
                  </Col>
                </Row>
              </div>
            )}
          </FormItem>
        </Form>
      </Modal>)
  }
}

const mapStateToProps = (state) => {
  return {
    ...state['memberCenter.rightLibrary']
  }
}
export default connect(['memberCenter.rightLibrary'], mapStateToProps)(Form.create()(AddRightLibrary))
