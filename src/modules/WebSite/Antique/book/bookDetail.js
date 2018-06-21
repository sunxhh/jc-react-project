import React, { Component } from 'react'
import { Form, Table, Input, Row, Col, Button, Radio } from 'antd'
import style from './style.less'
import { bookStatus, bookStatusMap as status } from '../dict'

const FormItem = Form.Item
const TextArea = Input.TextArea

class BookDetail extends Component {
  state = {
    showButtonSpin: false
  }

  _onSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ showButtonSpin: true })
        const bool = this.props.onSubmit(values)
        if (bool instanceof Promise) {
          bool.then((res) => {
            this.setState({ showButtonSpin: false })
            res && this.props.onCancel()
          })
        } else {
          this.setState({ showButtonSpin: false })
          this.props.onCancel()
        }
      }
    })
  }

  render() {
    const record = this.props.dataSource
    const { showButtonSpin } = this.state
    const { getFieldDecorator } = this.props.form
    const columns = [{
      key: 'processName',
      title: '处理人姓名',
      dataIndex: 'processName',
      width: '25%'
    }, {
      key: 'processResult',
      title: '处理结果',
      dataIndex: 'processResult',
      width: '25%',
      render: (text, record, index) => (
        <span>
          {status[text] ? status[text].name : ''}
        </span>
      )
    }, {
      key: 'processRemark',
      title: '处理备注',
      dataIndex: 'processRemark',
      width: '25%'
    }, {
      key: 'processTime',
      title: '处理时间',
      dataIndex: 'processTime',
      width: '25%'
    }]
    return (
      <div>
        <Row
          style={{ paddingLeft: '38px' }}
          className={style['enroll-detail-row']}
        >
          <Col>
            姓名：<span>{record.name}</span>
          </Col>
        </Row>
        <Row
          style={{ paddingLeft: '38px' }}
          className={style['enroll-detail-row']}
        >
          <Col>
            电话：<span>{record.phone}</span>
          </Col>
        </Row>
        <Row
          style={{ paddingLeft: '10px' }}
          className={style['enroll-detail-row']}
        >
          <Col>
            预约时间：<span>{record.reservedTime}</span>
          </Col>
        </Row>
        { this.props.isHandle === '1' ? (<div>
          <Form>
            <FormItem
              label='处理结果'
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
            >
              {getFieldDecorator('processResult', {
                rules: [{
                  required: true,
                  message: '请选择处理结果',
                }],
              })(
                <Radio.Group>
                  {bookStatus.map((item) => {
                    return (
                      <Radio key={item.value} value={item.value}>{item.name}</Radio>
                    )
                  })}
                </Radio.Group>
              )}
            </FormItem>
            <FormItem
              label='备注'
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
            >
              {getFieldDecorator('remark', {
                initialValue: record.reviewMessage,
                rules: [{
                  required: true,
                  message: '请填写50字符以内的备注',
                  max: 50
                }],
              })(
                <TextArea row={8} placeholder='备注' />
              )}
            </FormItem>
          </Form>
        </div>) : null }
        <div
          className={style['table-wrapper']}
        >
          <Table
            columns={columns}
            dataSource={this.props.tableSource}
            pagination={false}
          />
        </div>
        {
          this.props.isHandle === '1' ? (
            <div className={style['jc-modal-form-footer']}>
              <Button
                key='cancel'
                size='large'
                onClick={this.props.onCancel}
              >取消
              </Button>
              <Button
                key='confirm'
                size='large'
                type='primary'
                loading={showButtonSpin}
                onClick={this._onSubmit}
              >确定
              </Button>
            </div>
          ) : (
            <div className={style['jc-modal-form-footer']}>
              <Button
                key='cancel'
                size='large'
                onClick={this.props.onCancel}
              >关闭
              </Button>
            </div>
          )
        }
      </div>
    )
  }
}

export default Form.create()(BookDetail)
