import React, { Component } from 'react'
import { Form, Switch, Input, Row, Col, Button } from 'antd'

import styles from './styles.less'

const FormItem = Form.Item
const TextArea = Input.TextArea

class EnrollDetail extends Component {
  _onSubmit = e => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const bool = this.props.onSubmit(values)
        if (bool instanceof Promise) {
          bool.then((res) => {
            res && this.props.onCancel()
          })
        } else {
          this.props.onCancel()
        }
      }
    })
  }

  render() {
    const record = this.props.dataSource
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Row
          gutter={20}
          className={styles['enroll-detail-row']}
        >
          <Col span={12}>
            姓名：<span>{record.userName}</span>
          </Col>
          <Col span={12}>
            工号：<span>{record.jobNumber}</span>
          </Col>
        </Row>
        <Row
          gutter={20}
          className={styles['enroll-detail-row']}
        >
          <Col span={12}>
            性别：<span>{record.sex}</span>
          </Col>
          <Col span={12}>
            电话：<span>{record.mobile}</span>
          </Col>
        </Row>
        <Row
          gutter={20}
          className={styles['enroll-detail-row']}
        >
          <Col span={12}>
            部门：<span>{record.department}</span>
          </Col>
          <Col span={12}>
            所在城市：<span>{record.officeSite}</span>
          </Col>
        </Row>
        <div className={styles['enroll-detail-row']}>
          报名时间：<span>{record.signTime}</span>
        </div>
        <div className={styles['enroll-detail-row']}>
          报名类别：<span>{record.signType.filter(item => !!item).join(' ')}</span>
        </div>
        <div className={styles['enroll-detail-row']}>
          <span>报名原因：</span>
          <div>{record.signReason}</div>
        </div>
        {record.message && (
          <div className={styles['enroll-detail-row']}>
            <span>是否常参加慈善活动并举例：</span>
            <div>{record.message}</div>
          </div>
        )}
        <Form>
          <FormItem
            label='审核是否通过'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 10 }}
          >
            {getFieldDecorator('status', {
              valuePropName: 'checked',
              initialValue: record.status === '1'
            })(
              <Switch
                checkedChildren='ON'
                unCheckedChildren='OFF'
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('reviewMessage', {
              initialValue: record.reviewMessage,
              rules: [{
                required: true,
                message: '请输入审核意见',
              }],
            })(
              <TextArea placeholder='请输入审核意见' />
            )}
          </FormItem>
          <div className={styles['jc-modal-form-footer']}>
            <Button
              key='cancel'
              onClick={this.props.onCancel}
            >取消
            </Button>
            <Button
              key='confirm'
              type='primary'
              onClick={this._onSubmit}
            >确定
            </Button>
          </div>
        </Form>
      </div>
    )
  }
}

export default Form.create()(EnrollDetail)
