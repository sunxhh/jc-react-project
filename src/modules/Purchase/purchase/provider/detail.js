import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button, Card, Row, Col, Select, InputNumber, TreeSelect } from 'antd'

import { isEmpty } from 'Utils/lang'

import { getCodeList, getProviderDetail } from './reduck'
import { getGoodsCateList } from '../../reduck'
// import styles from './style.less'

const FormItem = Form.Item
const Option = Select.Option
const TreeNode = TreeSelect.TreeNode
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const TextArea = Input.TextArea

class Detail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      supplierNo: this.props.match.params.id,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(getCodeList({ 'codeKeys': ['supplierType'] }))
    dispatch(getProviderDetail({ supplierNo: this.state.supplierNo }))
    dispatch(getGoodsCateList({ parentNo: '', status: '1', toStep: '1' }))
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { supplierType, provideDetail, goodsCateList } = this.props
    return (
      <div>
        <Form
          onSubmit={this._handleSubmit}
        >
          <FormItem className='operate-btn'>
            <Button
              title='点击取消'
              type='primary'
              onClick={() => history.go(-1)}
            >
              返回
            </Button>
          </FormItem>
          <Card title='基础信息'>
            <Row>
              <Col>
                <Row
                  id='rowUser'
                  justify='start'
                  type='flex'
                >
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='供应商编码：'
                    >
                      {getFieldDecorator('supplierNo', {
                        rules: [{
                          required: false,
                        }],
                        initialValue: provideDetail.supplierNo
                      })(
                        <Input disabled={true} placeholder='请输入供应商编码' />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='供应商名称：'
                    >
                      {getFieldDecorator('supplierName', {
                        rules: [{
                          required: true,
                          message: '请输入供应商名称'
                        }],
                        initialValue: provideDetail.supplierName
                      })(
                        <Input disabled={true} placeholder='请输入供应商名称' />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='供应商类别：'
                    >
                      <div
                        id='supplierType'
                        style={{ position: 'relative', marginBottom: '6px' }}
                      >
                        {getFieldDecorator('supplierType', {
                          rules: [
                            { required: true, message: '请选择供应商类别' }
                          ],
                          initialValue: provideDetail.supplierType
                        })(
                          <Select
                            disabled={true}
                            placeholder='请选择供应商类别'
                            getPopupContainer={() => document.getElementById('supplierType')}
                          >
                            {
                              supplierType && supplierType.map(item => (
                                <Option key={item.value} value={item.value}>{item.name}</Option>
                              ))
                            }
                          </Select>
                        )}
                      </div>
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='供应商税率：'
                    >
                      {getFieldDecorator('supplierRate', {
                        rules: [{
                          required: true,
                          message: '请输入供应商税率'
                        }],
                        initialValue: provideDetail.supplierRate
                      })(
                        <InputNumber
                          disabled={true}
                          style={{ width: '100%' }}
                          min={0}
                          max={100}
                          formatter={value => `${value}%`}
                          parser={value => value.replace('%', '')}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='联系人：'
                    >
                      {getFieldDecorator('linkMan', {
                        rules: [{
                          required: false,
                        }],
                        initialValue: provideDetail.linkMan
                      })(
                        <Input
                          disabled={true}
                          placeholder='请输入联系人'
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='联系人电话：'
                    >
                      {getFieldDecorator('telephone', {
                        rules: [{
                          required: false,
                        }, {
                          validator: this.isTelephone
                        }],
                        initialValue: provideDetail.telephone
                      })(
                        <Input
                          disabled={true}
                          maxLength='13'
                          placeholder='请输入联系人电话'
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='联系人邮箱：'
                    >
                      {getFieldDecorator('mailbox', {
                        rules: [{
                          required: false,
                        }, {
                          validator: this.isMailbox
                        }],
                        initialValue: provideDetail.mailbox
                      })(
                        <Input
                          disabled={true}
                          placeholder='请输入联系人邮箱'
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='合同编号：'
                    >
                      {getFieldDecorator('contractNumber', {
                        rules: [{
                          required: false,
                        }],
                        initialValue: provideDetail.contractNumber
                      })(
                        <Input
                          disabled={true}
                          placeholder='请输入合同编号'
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='采购周期：'
                    >
                      {getFieldDecorator('purchasingCycle', {
                        rules: [{
                          required: false,
                        }],
                        initialValue: provideDetail.purchasingCycle
                      })(
                        <InputNumber
                          disabled={true}
                          style={{ width: '100%' }}
                          min={1}
                          formatter={value => `${value}天`}
                          parser={value => value.replace('天', '')}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='供货范围'
                    >
                      <div
                        id='supplyScope'
                        style={{ position: 'relative' }}
                      >
                        {getFieldDecorator('supplyScope', {
                          rules: [{
                            required: false,
                          }],
                          initialValue: provideDetail.supplyScopeList
                        })(
                          <TreeSelect
                            disabled={true}
                            showSearch
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder='请选择供货范围'
                            allowClear
                            treeNodeFilterProp='title'
                            multiple={true}
                            // filterTreeNode={this._filterType}
                            onChange={this._treeChange}
                            getPopupContainer={() => document.getElementById('supplyScope')}
                          >
                            {
                              goodsCateList && goodsCateList.map(item => {
                                if (item.childGoodsCatgList && !isEmpty(item.childGoodsCatgList)) {
                                  return (
                                    <TreeNode
                                      value={item.goodsCatgNo}
                                      title={item.goodsCatgName}
                                      key={item.goodsCatgNo}
                                    >
                                      {
                                        item.childGoodsCatgList && item.childGoodsCatgList.map(i => {
                                          return (
                                            <TreeNode value={i.goodsCatgNo} title={i.goodsCatgName} key={i.goodsCatgNo} />
                                          )
                                        })
                                      }
                                    </TreeNode>
                                  )
                                } else {
                                  return (
                                    <TreeNode
                                      value={item.goodsCatgNo}
                                      title={item.goodsCatgName}
                                      key={item.goodsCatgNo}
                                    />
                                  )
                                }
                              })
                            }
                          </TreeSelect>
                        )}
                      </div>
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='供应商地址：'
                    >
                      {getFieldDecorator('address', {
                        initialValue: provideDetail.address
                      })(
                        <TextArea
                          disabled={true}
                          placeholder='请输入供应商地址'
                          maxLength={500}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='备注：'
                    >
                      {getFieldDecorator('supplierDesc', {
                        initialValue: provideDetail.supplierDesc
                      })(
                        <TextArea
                          disabled={true}
                          placeholder='请输入备注'
                          maxLength={500}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
          <Card title='税务信息'>
            <Row>
              <Col span={24}>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label='开票全称：'
                  >
                    {getFieldDecorator('InvoiceName', {
                      rules: [{
                        required: false,
                      }],
                      initialValue: provideDetail.invoiceName
                    })(
                      <Input
                        disabled={true}
                        placeholder='请输入开票全称'
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label='供应商税号：'
                  >
                    {getFieldDecorator('dutyParagraph', {
                      rules: [{
                        required: false,
                      }],
                      initialValue: provideDetail.dutyParagraph
                    })(
                      <Input
                        disabled={true}
                        placeholder='请输入供应商税号'
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label='发票类型：'
                  >
                    <div
                      id='invoiceType'
                      style={{ position: 'relative' }}
                    >
                      {getFieldDecorator('invoiceType', {
                        rules: [
                          { required: false }
                        ],
                        initialValue: provideDetail.invoiceType
                      })(
                        <Select
                          disabled={true}
                          placeholder='请选择发票类型'
                          getPopupContainer={() => document.getElementById('invoiceType')}
                        >
                          <Option value='0'>普通发票</Option>
                          <Option value='1'>专用发票</Option>
                        </Select>
                      )}
                    </div>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label='注册电话：'
                  >
                    {getFieldDecorator('registerTelephone', {
                      rules: [{
                        required: false,
                      }],
                      initialValue: provideDetail.registerTelephone
                    })(
                      <Input
                        disabled={true}
                        placeholder='请输入注册电话'
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label='开户行：'
                  >
                    {getFieldDecorator('openBank', {
                      rules: [{
                        required: false,
                      }],
                      initialValue: provideDetail.openBank
                    })(
                      <Input
                        disabled={true}
                        placeholder='请输入开户行'
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label='银行账号：'
                  >
                    {getFieldDecorator('bankAccount', {
                      rules: [{
                        required: false,
                      }],
                      initialValue: provideDetail.bankAccount
                    })(
                      <Input
                        disabled={true}
                        placeholder='请输入银行账号'
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label='注册地址：'
                  >
                    {getFieldDecorator('invoiceRegAddress', {
                      initialValue: provideDetail.invoiceRegAddress
                    })(
                      <TextArea
                        disabled={true}
                        placeholder='请输入注册地址'
                        maxLength={500}
                      />
                    )}
                  </FormItem>
                </Col>
              </Col>
            </Row>
          </Card>
          <Card title='资质资料'>
            <Row>
              <Col span={24}>
                {
                  provideDetail.qualificationFileList && provideDetail.qualificationFileList.map((item, index) => (
                    <a
                      style={{ marginLeft: '20px' }}
                      href={item.fileUrl}
                      target='_blank'
                      download={item.fileName}
                      key={index}
                    >
                      {item.fileName}
                    </a>
                  ))
                }
              </Col>
            </Row>
          </Card>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    supplierType: state.purchase.provider.codeList.supplierType,
    provideDetail: state.purchase.provider.provideDetail,
    goodsCateList: state.purchase.commonPurc.goodsCateList,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Detail))
