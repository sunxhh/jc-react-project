import React, { Component } from 'react'
import { Form, Input, Select, Tabs, Row, Col, DatePicker, message, Button } from 'antd'
import moment from 'moment'
import { createAction } from 'redux-actions'

import styles from './styles.less'
// import * as actionTypes from './reduck'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}

class TableEditItem extends Component {
  componentWillUnmount() {
    this.props.dispatch(createAction('ACTIVE_SHOP')({ shopName: '', shopId: '' }))
    this.props.dispatch(createAction('ACTIVE_KEY')(''))
    this.props.dispatch(
      createAction('TABS_EDIT_ITEM')({
        activeKey: '',
        cardList: []
      })
    )
  }

  _selectChange = value => {
    const { orgList } = this.props
    const orgs = orgList.filter(item => item.shopId === value)
    this.props.dispatch(
      createAction('ACTIVE_SHOP')({
        shopName: orgs[0].shopName,
        shopId: orgs[0].shopId
      })
    )
  }

  _onChange = activeKey => {
    this.props.dispatch(createAction('ACTIVE_KEY')(activeKey))
  }

  _onEdit = (targetKey, action) => {
    this[action](targetKey)
  }

  add = () => {
    if (this.props.cardList.some(item => item.shopId === this.props.shopId)) {
      message.error('已经增加过这个会籍了！', 1)
    } else {
      this.props.dispatch(
        createAction('TABS_EDIT_ITEM')({
          activeKey: this.props.shopId,
          cardList: [
            ...this.props.cardList,
            {
              id: '',
              key: this.props.activeKey,
              shopName: this.props.shopName,
              shopId: this.props.shopId,
              memberNo: '',
              rank: '',
              memRight: '',
              cardTime: '',
              orgSnapshot: '',
              remark: ''
            }
          ]
        })
      )
    }
  }

  remove = targetKey => {
    const { activeKey } = this.props
    const { getFieldsValue } = this.props.form
    const cardList = this._memCardListOrg(getFieldsValue())
    let actKey = activeKey
    let lastIndex = ''
    cardList.forEach((pane, i) => {
      if (pane.shopId === targetKey) {
        lastIndex = i - 1
      }
    })
    const filterPanes = cardList.filter(pane => pane.shopId !== targetKey)
    const dealPanes = cardList.filter(pane => pane.shopId === targetKey)

    if (cardList.length > 0 && lastIndex >= 0 && activeKey === targetKey) {
      actKey = cardList[lastIndex].shopId
    } else if (cardList.length > 0 && lastIndex === -1 && activeKey === targetKey) {
      actKey = cardList[lastIndex + 2] ? cardList[lastIndex + 2].shopId : ''
    }
    if (dealPanes[0].id) {
      dealPanes[0].delFlag = 1
      this.props.dispatch(createAction('DEAL_PANES')(dealPanes))
    }
    this.props.dispatch(
      createAction('TABS_EDIT_ITEM')({
        activeKey: actKey,
        cardList: filterPanes
      })
    )
  }
  _memCardListOrg = values => {
    const cardKeys = Object.keys(values).filter(item => item.includes('shopId-'))
    return cardKeys.map(key => {
      const listArg = {}
      const keyTemp = key.split('-')[1]
      Object.keys(values).forEach((valueskey, index) => {
        const valuesKeyTemp = valueskey.split('-')
        if (keyTemp === valuesKeyTemp[1] && valuesKeyTemp[0] !== 'cardTime') {
          listArg[valuesKeyTemp[0]] = values[valueskey]
        } else if (keyTemp === valuesKeyTemp[1] && valuesKeyTemp[0] === 'cardTime') {
          listArg[valuesKeyTemp[0]] = values[valueskey] ? values[valueskey].format('YYYY-MM-DD HH:mm:ss') : ''
        }
      })
      return listArg
    })
  }
  _renderForm = (item, index) => {
    const { getFieldDecorator } = this.props
    return (
      <div>
        <FormItem className={styles['tab-form-item']} {...formItemLayout} label='会员编号：'>
          {getFieldDecorator(`memberNo-${item.shopId}`, {
            initialValue: item.memberNo
          })(<Input placeholder='请输入会员编号' disabled={true} />)}
        </FormItem>
        <FormItem className={styles['tab-form-item']} {...formItemLayout} label='等级：'>
          {getFieldDecorator(`rank-${item.shopId}`, {
            initialValue: this.props.form.getFieldValue('isMember')
          })(
            <Select
              placeholder='请输入等级'
              getPopupContainer={() => document.getElementById(`temsConent${item.shopId}`)}
              disabled={true}
            >
              <Option value='1'>内部会员</Option>
              <Option value='2'>外部会员</Option>
            </Select>
          )}
        </FormItem>
        <FormItem className={styles['tab-form-item']} {...formItemLayout} label='权利：'>
          {getFieldDecorator(`memRight-${item.shopId}`, {
            initialValue: item && item.memRight
          })(<Input placeholder='请输入权利' maxLength='32' />)}
        </FormItem>
        <FormItem className={styles['tab-form-item']} {...formItemLayout} label='特有属性：'>
          {getFieldDecorator(`orgSnapshot-${item.shopId}`, {
            initialValue: item && item.orgSnapshot
          })(<Input placeholder='请输入其它属性' />)}
        </FormItem>
        <div className='cardTimeRow'>
          <FormItem className={styles['tab-form-item']} {...formItemLayout} label='办卡日期'>
            {getFieldDecorator(`cardTime-${item.shopId}`, {
              initialValue: item.cardTime ? moment(new Date(item.cardTime), 'YYYY-MM-DD HH:mm:ss') : null
            })(<DatePicker
              placeholder='请选择办卡日期' format='YYYY-MM-DD HH:mm:ss' showTime
              style={{ width: '100%' }}
            />)}
          </FormItem>
        </div>
        <div className='cardTimeRow'>
          <FormItem className={styles['tab-form-item']} {...formItemLayout} label='失效日期'>
            {getFieldDecorator(`deadline-${item.shopId}`, {
              initialValue: item.deadline ? moment(new Date(item.deadline), 'YYYY-MM-DD HH:mm:ss') : null
            })(<DatePicker
              placeholder='请选择失效日期' format='YYYY-MM-DD HH:mm:ss' showTime
              disabled={true}
              style={{ width: '100%' }}
            />)}
          </FormItem>
        </div>
        <FormItem className={styles['tab-form-item']} {...formItemLayout} label='失效状态：'>
          {getFieldDecorator(`cardStatus-${item.shopId}`, {
            initialValue: item.cardStatus && String(item.cardStatus)
          })(
            <Select
              placeholder='请选择失效状态'
              getPopupContainer={() => document.getElementById(`temsConent${item.shopId}`)}
              disabled={true}
            >
              <Option value=''>全部</Option>
              <Option value='0'>未开卡</Option>
              <Option value='1'>已开卡</Option>
              <Option value='2'>已失效</Option>
            </Select>
          )}
        </FormItem>
        <FormItem className={styles['tab-form-item']} {...formItemLayout} label='备注：'>
          {getFieldDecorator(`remark-${item.shopId}`, {
            initialValue: item && item.remark
          })(<Input.TextArea placeholder='请输入备注' maxLength='512' />)}
        </FormItem>
        <FormItem className={styles['tab-form-item']} style={{ display: 'none' }}>
          {getFieldDecorator(`shopName-${item.shopId}`, {
            initialValue: item.shopName
          })(<Input disabled={true} />)}
        </FormItem>
        <FormItem className={styles['tab-form-item']} style={{ display: 'none' }}>
          {getFieldDecorator(`shopId-${item.shopId}`, {
            initialValue: item.shopId
          })(<Input disabled={true} />)}
        </FormItem>
        <FormItem className={styles['tab-form-item']} style={{ display: 'none' }}>
          {getFieldDecorator(`id-${item.shopId}`, {
            initialValue: item.id
          })(<Input disabled={true} />)}
        </FormItem>
        <FormItem className={styles['tab-form-item']} style={{ display: 'none' }}>
          {getFieldDecorator(`delFlag-${item.shopId}`, {
            initialValue: item.delFlag
          })(<Input disabled={true} />)}
        </FormItem>
        <FormItem className={styles['tab-form-item']} {...formItemLayout} label='会员须知：'>
          {getFieldDecorator(`memNote-${item.shopId}`, {
            initialValue: item && item.memNote
          })(<Input.TextArea placeholder='请输入会员须知' maxLength='512' />)}
        </FormItem>
      </div>
    )
  }

  renderPane = cardList => {
    return (
      <Tabs
        className={styles['c-edit-tabs']}
        hideAdd
        onChange={this._onChange}
        activeKey={this.props.activeKey}
        type='editable-card'
        onEdit={this._onEdit}
      >
        {cardList.map((item, index) => {
          return (
            <TabPane tab={item.shopName} key={item.shopId} closable={item.shopId === this.props.activeKey ? 1 : 0}>
              {this._renderForm(item, index)}
            </TabPane>
          )
        })}
      </Tabs>
    )
  }
  render() {
    return (
      <div>
        <Row>
          <Col span={8}>
            <Col span={8} className={styles['txt-lable']}>
              所属会籍：
            </Col>
            <Col span={16} id='itemCom'>
              <Select
                onChange={value => this._selectChange(value)}
                getPopupContainer={() => document.getElementById('itemCom')}
                placeholder='请选择所属会籍'
              >
                {this.props.orgList.map(item => (
                  <Option key={item.shopId} value={item.shopId}>
                    {item.shopName}
                  </Option>
                ))}
              </Select>
            </Col>
          </Col>
          {this.props.shopName && (
            <Button
              type='primary' title='点击添加'
              onClick={this.add} disabled={this.props.editDisabled}
            >
              添加
            </Button>
          )}
        </Row>
        {this.renderPane(this.props.cardList)}
      </div>
    )
  }
}

export default TableEditItem
