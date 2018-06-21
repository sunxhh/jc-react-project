import { Form, Modal, Button, Table, Row, Col, Popconfirm, Input, message, Popover } from 'antd'
import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
import styles from './style.less'
import moment from 'moment'
import { isEmpty, trim } from 'Utils/lang'
import Module from './module'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
}

const petGender = {
  '1': 'GG',
  '2': 'MM',
}
const sterilizationStatus = {
  '1': '是',
  '0': '否',
}

class PetInfo extends Component {
  state = {
    openId: undefined,
  }

  // columns
  _columns = [
    {
      title: '图片',
      dataIndex: 'avatar',
      render(text) {
        if (text) {
          return <img style={{ width: '50px' }} src={text} />
        }
      }
    },
    {
      title: '宠物爱称',
      dataIndex: 'petName',
      render: (text) => {
        return (
          <Popover
            placement='topLeft'
            content={<div className={styles['pop']}>{text}</div>}
            title='宠物爱称'
          >
            <span>{text && text.length > 8 ? `${text.substring(0, 8)}...` : text}</span>
          </Popover>
        )
      }
    },
    {
      title: '性别',
      dataIndex: 'gender',
      render(text) {
        return petGender[text]
      }
    },
    {
      title: '宠物类型',
      dataIndex: 'typeName',
      render: (text) => {
        return (
          <Popover
            placement='topLeft'
            content={<div className={styles['pop']}>{text}</div>}
            title='宠物类型'
          >
            <span>{text && text.length > 8 ? `${text.substring(0, 8)}...` : text}</span>
          </Popover>
        )
      }
    },
    {
      title: '品种',
      dataIndex: 'catgName',
      render: (text) => {
        return (
          <Popover
            placement='topLeft'
            content={<div className={styles['pop']}>{text}</div>}
            title='品种'
          >
            <span>{text && text.length > 8 ? `${text.substring(0, 8)}...` : text}</span>
          </Popover>
        )
      }
    },
    {
      title: '生日',
      dataIndex: 'birthday',
      render(text) {
        if (text) {
          return moment(text).format('YYYY-MM-DD')
        }
      }
    },
    {
      title: '绝育状况',
      dataIndex: 'sterilizationStatus',
      render(text) {
        return sterilizationStatus[text]
      }
    },
    {
      title: '添加时间',
      dataIndex: 'createdAt',
      render(text) {
        return (
          text && <Popover
            placement='topRight'
            content={<div className={styles['pop']}>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</div>}
            title='添加时间'
          >
            <span>{moment(text).format('YYYY-MM-DD')}</span>
          </Popover>
        )
      }
    },
    {
      title: '修改时间',
      dataIndex: 'updatedAt',
      render(text) {
        return (
          text && <Popover
            placement='topRight'
            content={<div className={styles['pop']}>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</div>}
            title='修改时间'
          >
            <span>{moment(text).format('YYYY-MM-DD')}</span>
          </Popover>
        )
      }
    }
  ]

  // 弹层取消
  _handleCancel = () => {
    const { setPetInfo } = this.props
    setPetInfo({
      showPetModal: false,
      petInfo: {},
    })
  }

  // openId 解绑操作
  _handleUnbind = () => {
    const { dispatch, userNo, setPetInfo, petOpenId, petInfo } = this.props
    petInfo.memberInfo.createdAt = undefined
    petInfo.memberInfo.referrer = undefined
    dispatch(Module.actions.unBindOpenId({ userNo, openId: petOpenId })).then(res => {
      if (res.status === 'success') {
        setPetInfo({ petOpenId: undefined, petInfo })
        this.setState({ openId: undefined })
      }
    })
  }

  // 绑定操作
  _handleBind = () => {
    const { dispatch, setPetInfo, userNo, petInfo } = this.props
    let { openId } = this.state
    if (!openId || trim(openId) === '') {
      message.error('请输入openId！')
      return
    }
    openId = trim(openId)
    dispatch(Module.actions.bindOpenId({ userNo, openId })).then(res => {
      if (res.status === 'success') {
        petInfo.memberInfo.createdAt = res.result.createdAt
        setPetInfo({
          petOpenId: openId,
          petInfo,
        })
        this.setState({ openId: undefined })
      }
    })
  }

  // openId 事件
  _handleOpenIdChange = (e) => {
    const value = e.target.value
    if (value && value !== '') {
      this.setState({ openId: value })
    } else {
      this.setState({ openId: undefined })
    }
  }

  render() {
    const { showPetModal, petInfo, petOpenId } = this.props
    const memberInfo = (isEmpty(petInfo) || isEmpty(petInfo.memberInfo)) ? {} : petInfo.memberInfo
    return (
      <Modal
        title='查看宠物信息'
        maskClosable={false}
        width='1100px'
        footer={null}
        visible={showPetModal}
        onCancel={this._handleCancel}
        style={{ top: '30px' }}
      >
        <Form>
          {
            !isEmpty(memberInfo) &&
            <div>
              <Row>
                <Col span='12'>
                  <FormItem {...formItemLayout} label='推荐人' >{memberInfo.referrer}</FormItem>
                </Col>
                <Col span='12'>
                  <FormItem {...formItemLayout} label='理财师' />
                </Col>
                <Col span='12'>
                  <FormItem {...formItemLayout} label='理财师手机号' />
                </Col>
                <Col span='12'>
                  <FormItem
                    {...formItemLayout}
                    label='openId'
                  >
                    {
                      petOpenId
                        ? <div>
                          <span>{petOpenId}</span>
                          <Popconfirm
                            title={`确定解绑吗？`}
                            onConfirm={this._handleUnbind}
                          >
                            <a href='javascript:;' style={{ marginLeft: '5px' }} >解绑</a>
                          </Popconfirm>
                        </div>
                        : <div>
                          <Input
                            placeholder='请输入openId'
                            maxLength='50'
                            style={{ width: '150px' }}
                            onChange={this._handleOpenIdChange}
                          />
                          <a
                            href='javascript:;'
                            onClick={this._handleBind}
                            style={{ marginLeft: '5px' }}
                          >
                          绑定
                          </a>
                        </div>
                    }
                  </FormItem>
                </Col>
                <Col span='12'>
                  <FormItem
                    {...formItemLayout}
                    label='绑定时间'
                  >
                    {memberInfo.createdAt ? moment(memberInfo.createdAt).format('YYYY-MM-DD HH:mm:ss') : ''}
                  </FormItem>
                </Col>
              </Row>

            </div>
          }
          <Table
            style={{ width: '100%' }}
            className={styles['c-table-center']}
            columns={this._columns}
            rowKey={(item, index) => index}
            pagination={false}
            dataSource={isEmpty(petInfo.petList) ? [] : petInfo.petList}
          />
          <FormItem className={styles['jc-modal-form-footer']}>
            <Button onClick={this._handleCancel}>取消</Button>
          </FormItem>
        </Form>
      </Modal>)
  }
}

const mapStateToProps = (state) => {
  return {

  }
}

export default connect([], mapStateToProps)(Form.create()(PetInfo))
