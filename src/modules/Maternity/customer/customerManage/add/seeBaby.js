import React from 'react'
import { Form, Row, Col, Popover } from 'antd'
import moment from 'moment'
import style from './index.less'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

const formItemLayoutLarge = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
}

const _getProcessName = (value) => {
  const processStatus = {
    '0': '未启用',
    '1': '潜在用户',
    '2': '意向用户',
    '3': '签单用户',
    '4': '正式客户'
  }
  if (!value) {
    return ''
  }
  return processStatus[value.toString()]
}

const EditBaby = (props) => {
  const { babyInfo } = props
  return (
    <div>
      <Form id='babyArea'>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label='客户编号：'
            >
              <span className='ant-form-text'>{babyInfo.number}</span>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label='会员类型：'
            >
              <span className='ant-form-text'>宝宝客户</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label='跟进阶段：'
            >
              <span className='ant-form-text'>{_getProcessName(babyInfo.process)}</span>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label='跟进人员：'
            >
              <span className='ant-form-text'>{babyInfo.processorName}</span>
            </FormItem>
          </Col>
          
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label='会员姓名：'
            >
              <span className='ant-form-text'>{babyInfo.name}</span>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label='生日：'
            >
              <span className='ant-form-text'>{babyInfo.birthday ? moment(babyInfo.birthday).format('YYYY-MM-DD') : ''}</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label='性别：'
            >
              <span className='ant-form-text'>{babyInfo.sex === '0' ? '女' : '男'}</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={16}>
            <FormItem
              label='住址：'
              {...formItemLayoutLarge}
            >
              <Popover
                placement='topRight'
                content={<div className={style['pop']}>{babyInfo && babyInfo.address}</div>}
                title='住址'
              >
                <span>{ babyInfo.address && babyInfo.address.length > 45 ? `${babyInfo.address.substring(0, 45)}...` : babyInfo.address}</span>
              </Popover>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={16}>
            <FormItem
              label='备注：'
              {...formItemLayoutLarge}
            >
              <span className='ant-form-text'>
                <Popover
                  placement='topRight'
                  content={<div className={style['pop']}>{babyInfo && babyInfo.remark}</div>}
                  title='备注'
                >
                  <span>{ babyInfo.remark && babyInfo.remark.length > 45 ? `${babyInfo.remark.substring(0, 45)}...` : babyInfo.remark}</span>
                </Popover>
              </span>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
export default EditBaby
