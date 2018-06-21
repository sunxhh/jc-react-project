import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button, Card, Row, Col, Select, InputNumber, TreeSelect, message, Icon } from 'antd'

import { isEmpty } from 'Utils/lang'
import AliUpload from 'Components/upload/aliUploadV2'
import { getAliToken } from 'Global/action'

import { getCodeList, providerAdd } from './reduck'
import { getGoodsCateList } from '../../reduck'
import styles from './style.less'

const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

const TextArea = Input.TextArea
const TreeNode = TreeSelect.TreeNode
const uploadButton = (
  <Button type='primary' className={styles['provider-upload-bth']}>
    <Icon type='upload' />上传资料
  </Button>
)

class Add extends Component {
  constructor(props) {
    super(props)
    this.state = {
      treeChange: [],
      qualificationFileList: [], // 货物封面图片
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(getCodeList({ 'codeKeys': ['supplierType'] }))
    dispatch(getGoodsCateList({ parentNo: '', status: '1', toStep: '1' }))
    this.props.dispatch(getAliToken())
  }

  _handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { treeChange, qualificationFileList } = this.state
        const addData = {
          supplierName: values.supplierName,
          supplierType: values.supplierType,
          supplierRate: values.supplierRate,
          linkMan: values.linkMan ? values.linkMan : '',
          telephone: values.telephone ? values.telephone : '',
          mailbox: values.mailbox ? values.mailbox : '',
          contractNumber: values.contractNumber ? values.contractNumber : '',
          purchasingCycle: values.purchasingCycle ? values.purchasingCycle : '',
          address: values.address ? values.address : '',
          supplierDesc: values.supplierDesc ? values.supplierDesc : '',
          invoiceName: values.invoiceName ? values.invoiceName : '',
          dutyParagraph: values.dutyParagraph ? values.dutyParagraph : '',
          invoiceType: values.invoiceType ? values.invoiceType : '',
          registerTelephone: values.registerTelephone ? values.registerTelephone : '',
          openBank: values.openBank ? values.openBank : '',
          bankAccount: values.bankAccount ? values.bankAccount : '',
          invoiceRegAddress: values.invoiceRegAddress ? values.invoiceRegAddress : '',
          supplyScopeList: treeChange,
          qualificationFileList: qualificationFileList && qualificationFileList.map(item => {
            return { fileName: item.name, fileUrl: item.thumbUrl, fileType: item.name.split('.').pop() }
          })
        }
        this.props.dispatch(providerAdd(addData))
      }
    })
  }

  isTelephone = (rule, value, callback) => {
    const form = this.props.form
    if (form.getFieldValue('telephone')) {
      if (/^[1][3,4,5,7,8,9]\d{9}$/.test(form.getFieldValue('telephone')) || /^0\d{2,3}-?\d{7,8}$/.test(form.getFieldValue('telephone'))) {
        callback()
      } else {
        callback('请填写正确的手机号或者固话号码')
      }
    } else {
      callback()
    }
  }

  isMailbox = (rule, value, callback) => {
    const form = this.props.form
    if (form.getFieldValue('mailbox')) {
      if (/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(form.getFieldValue('mailbox'))) {
        callback()
      } else {
        callback('请填写正确的邮箱')
      }
    } else {
      callback()
    }
  }

  _treeChange = (value) => {
    if (value && value.length > 3) {
      message.warning('供货范围最多选择三个')
      this.setState({
        treeChange: value.pop()
      })
    }
    this.setState({
      treeChange: value
    })
  }

  _handleDetailChange = ({ fileList }) => {
    this.setState({ qualificationFileList: fileList && fileList.map(item => {
      item.thumbUrl = item.response && item.response.url
      return item
    }) })
  }

  _handleDetailRemove = (file) => {
    const { qualificationFileList } = this.state
    const index = qualificationFileList.indexOf(file)
    const newFileList = qualificationFileList.slice()
    newFileList.splice(index, 1)
    this.setState({ qualificationFileList: newFileList })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { supplierType, showButtonSpin, goodsCateList, aliToken } = this.props
    const { treeChange, qualificationFileList } = this.state
    return (
      <div>
        <Form
          onSubmit={this._handleSubmit}
        >
          <FormItem className='operate-btn'>
            <Button
              type='primary'
              title='点击保存'
              loading={showButtonSpin}
              // disabled={editDisabled}
              htmlType='submit'
            >
              保存
            </Button>
            <Button
              title='点击取消'
              onClick={() => history.go(-1)}
            >
              取消
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
                      label='供应商名称：'
                    >
                      {getFieldDecorator('supplierName', {
                        rules: [{
                          required: true,
                          message: '请输入30字以内的供应商名称',
                          max: 30
                        }],
                        initialValue: ''
                      })(
                        <Input placeholder='请输入供应商名称' />
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
                        })(
                          <Select
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
                          message: '请输入供应商税率',
                        }],
                      })(
                        <InputNumber
                          style={{ width: '100%' }}
                          min={0}
                          max={100}
                          precision={2}
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
                      })(
                        <Input
                          maxLength='10'
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
                      })(
                        <Input
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
                      })(
                        <Input
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
                      })(
                        <Input
                          maxLength='20'
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
                      })(
                        <InputNumber
                          style={{ width: '100%' }}
                          min={1}
                          max={99999}
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
                          initialValue: treeChange
                        })(
                          <TreeSelect
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
                        initialValue: ''
                      })(
                        <TextArea
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
                        initialValue: ''
                      })(
                        <TextArea
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
                    {getFieldDecorator('invoiceName', {
                      rules: [{
                        required: false,
                      }],
                      initialValue: ''
                    })(
                      <Input
                        maxLength='30'
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
                      initialValue: ''
                    })(
                      <Input
                        maxLength='30'
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
                      })(
                        <Select
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
                    })(
                      <Input
                        maxLength='15'
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
                    })(
                      <Input
                        maxLength='30'
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
                    })(
                      <Input
                        maxLength='30'
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
                      initialValue: ''
                    })(
                      <TextArea
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
                <FormItem style={{ marginLeft: '5%' }}>
                  {getFieldDecorator('qualificationFileList', {
                    fileList: qualificationFileList,
                  })(
                    <AliUpload
                      defaultUpload
                      className={styles['upload-list-inline']}
                      listType='picture'
                      onChange={this._handleDetailChange}
                      onRemove={this._handleDetailRemove}
                      aliToken={aliToken}
                      rootPath='provider'
                      fileList={qualificationFileList}
                    >
                      {qualificationFileList.length >= 6 ? null : uploadButton}
                    </AliUpload>
                  )}
                </FormItem>
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
    showButtonSpin: state.common.showButtonSpin,
    goodsCateList: state.purchase.commonPurc.goodsCateList,
    aliToken: state.common.aliToken,

  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Add))
