import React, { Component } from 'react'
import { Form, Select, Cascader, Input, Button, Divider, Icon } from 'antd'
import { shopMode, selfSupport } from './dict'
import { addOrg } from './reduck'
import BindShopModal from './bindShopModal'
import { showModalWrapper } from 'Components/modal/ModalWrapper'

const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

class AddOrgModal extends Component {
  _renderOrgBelongIndustry = (getFieldDecorator) => {
    const { orgLevel, belongIndustry } = this.props
    if (orgLevel === '1') {
      return null
    }
    return (
      <FormItem
        {...formItemLayout}
        label='所属产业'
      >
        {getFieldDecorator('orgBelongIndustry', {
          rules: [{
            required: !(orgLevel === '1'),
            message: '请选择所属产业!'
          }]
        })(
          <Select
            placeholder='请选择所属产业'
          >
            {belongIndustry.map(item => (
              <Option key={item.value} value={item.value}>{item.name}</Option>
            ))}
          </Select>
        )}
      </FormItem>
    )
  }

  _renderShopIDAndInventory = (getFieldDecorator) => {
    return [
      <FormItem
        key='orgStockFlag'
        {...formItemLayout}
        label='是否有库存'
      >
        {getFieldDecorator('orgStockFlag', {
        })(
          <Select
            placeholder='请选择是否有库存'
          >
            <Option value='0'>没有库存</Option>
            <Option value='1'>有库存</Option>
          </Select>
        )}
      </FormItem>,
      <FormItem
        key='shopNumber'
        {...formItemLayout}
        label='店铺编号'
      >
        {getFieldDecorator('shopNumber', {
        })(
          <Input
            addonAfter={[
              <span key='select' onClick={() => this._showShopListModal(this._bindShopInAdd)}>选择</span>,
              <Divider key='divider' type='vertical' />,
              <Icon
                key='delete'
                type='delete'
                onClick={() => {
                  this.props.form.setFieldsValue({
                    shopNumber: '',
                    shopName: '',
                    mode: '',
                    selfSupport: '',
                  })
                }}
              />
            ]}
            disabled={true}
            placeholder='请选择店铺'
            maxLength={50}
          />
        )}
      </FormItem>,
      <FormItem
        key='shopName'
        {...formItemLayout}
        label='店铺名称'
      >
        {getFieldDecorator('shopName', {
        })(
          <Input
            disabled={true}
            placeholder='请选择店铺'
          />
        )}
      </FormItem>,
      <FormItem
        key='mode'
        {...formItemLayout}
        label='经营方式'
      >
        {getFieldDecorator('mode', {
        })(
          <Select
            disabled
            placeholder='请选择经营方式'
          >
            {shopMode.map(item => (
              <Option value={item.value} key={item.value}>{item.key}</Option>
            ))}
          </Select>
        )}
      </FormItem>,
      <FormItem
        key='selfSupport'
        {...formItemLayout}
        label='是否自营'
      >
        {getFieldDecorator('selfSupport', {
        })(
          <Select
            disabled
            placeholder='请选择是否自营'
          >
            {selfSupport.map(item => (
              <Option value={item.value} key={item.value}>{item.key}</Option>
            ))}
          </Select>
        )}
      </FormItem>,

    ]
  }

  _showShopListModal = () => {
    showModalWrapper((
      <BindShopModal
        handleSelect={(record) => {
          this.props.form.setFieldsValue({
            shopNumber: record.shopNumber,
            shopName: record.shopName,
            mode: record.mode,
            selfSupport: record.selfSupport,
          })
        }}
      />
    ), {
      title: '选择店铺',
      width: 800
    })
  }

  confirm = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const orgCascaderAddress = values.orgCascaderAddress
        const org = {
          ...values,
          orgMod: '1',
        }
        if (orgCascaderAddress) {
          org.orgProvinceId = orgCascaderAddress[0]
          org.orgCityId = orgCascaderAddress[1]
          org.orgAreaId = orgCascaderAddress[2]
        }
        delete org.orgCascaderAddress
        return this.props.dispatch(addOrg({
          org
        })).then(res => {
          res && this.props.onCancel()
        })
      }
    })
  }

  render() {
    const { orgLevel, crrTreeId, orgName, regionList, onCancel } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <Form>
        {this._renderOrgBelongIndustry(getFieldDecorator)}
        <FormItem
          {...formItemLayout}
          label='组织编码'
        >
          {getFieldDecorator('orgCode', {
            rules: [{
              required: true,
              message: '请输入组织编码!'
            }]
          })(
            <Input
              maxLength={50}
              placeholder='请输入组织编码'
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='组织名称'
        >
          {getFieldDecorator('orgName', {
            rules: [{
              required: true,
              message: '请输入组织名称!'
            }]
          })(
            <Input
              maxLength={50}
              placeholder='请输入组织名称'
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='组织等级'
        >
          {getFieldDecorator('orgLevel', {
            initialValue: String(parseInt(orgLevel) + 1),
            rules: [{
              required: true,
              message: '请选择组织等级!'
            }]
          })(
            <Select
              disabled={true}
            >
              <Option value='1'>一级</Option>
              <Option value='2'>二级</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='上级组织'
        >
          {getFieldDecorator('orgPid', {
            initialValue: String(crrTreeId),
            rules: [{ required: true }]
          })(
            <Select disabled={true}>
              <Option value={String(crrTreeId)}>{orgName}</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='组织简称'
        >
          {getFieldDecorator('orgSName', {
            rules: [{
              required: true,
              message: '请输入组织简称!'
            }]
          })(
            <Input
              maxLength={50}
              placeholder='请输入组织简称'
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='组织顺序'
        >
          {getFieldDecorator('orgSort', {
            rules: [{
              required: true,
              message: '请输入组织顺序!',
            }, {
              pattern: /^[0-9]*[1-9][0-9]*$/,
              message: '请输入数字!'
            }]
          })(
            <Input
              maxLength={5}
              placeholder='请输入组织顺序'
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='联系人'
        >
          {getFieldDecorator('orgLinkMan', {
            rules: [{
              required: true,
              message: '请输入联系人!'
            }]
          })(
            <Input
              maxLength={50}
              placeholder='请输入联系人'
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='联系电话'
        >
          {getFieldDecorator('orgPhone', {
            rules: [{
              required: true,
              message: '请输入联系电话!',
            }, {
              pattern: /^[1]\d{10}|0\d{2,3}-?\d{7,8}|400[-]\d{4}[-]\d{3}$/,
              message: '请输入正确的电话号码!'
            }]
          })(
            <Input
              maxLength={13}
              placeholder='请输入联系电话'
            />
          )}
        </FormItem>
        {orgLevel === '1' && (
          <FormItem
            {...formItemLayout}
            label='执照号'
          >
            {getFieldDecorator('orgRegisteredNo', {
            })(
              <Input
                placeholder='请输入执照号'
                maxLength={50}
              />
            )}
          </FormItem>
        )}
        <FormItem
          {...formItemLayout}
          label='组织地址'
        >
          {getFieldDecorator('orgCascaderAddress', {
            rules: [{
              required: true,
              message: '请选择组织地址!',
            }]
          })(
            <Cascader
              options={regionList}
              placeholder='请选择组织地址'
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='详细地址'
        >
          {getFieldDecorator('orgAddress', {
            rules: [{
              required: true,
              message: '请输入详细地址!',
            }]
          })(
            <Input.TextArea
              placeholder='请输入详细地址'
              maxLength={100}
            />
          )}
        </FormItem>
        {orgLevel === '1' && this._renderShopIDAndInventory(getFieldDecorator)}
        <div style={{ textAlign: 'right' }}>
          <Button
            onClick={onCancel}
            style={{ marginRight: '15px' }}
          >取消
          </Button>
          <Button
            type='primary'
            style={{ marginRight: '15px' }}
            onClick={() => this.confirm()}
          >确定
          </Button>
        </div>
      </Form>
    )
  }
}

export default Form.create()(AddOrgModal)
