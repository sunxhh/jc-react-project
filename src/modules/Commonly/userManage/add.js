import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Form, Input, Button, Card, Select, Row, Col, Checkbox, Upload, Icon, message, Spin } from 'antd'
import { isEmpty } from '../../../utils/lang'
import { debounce } from '../../../utils/function'
import {
  getQiniuToken,
  getRoleList,
  addUser,
  getOrgList,
  getPosList,
  resetUserDetail,
  getOuterUserNum,
  getInnerUserInfo
} from './reduck'

import styles from './userManage.less'
import * as urls from '../../../global/urls'

const FormItem = Form.Item
const SelectOption = Select.Option
const TextArea = Input.TextArea
const CheckboxGroup = Checkbox.Group

const userAddPwd = '000000'
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const sex = {
  '1': '女',
  '0': '男'
}
const userType = {
  '1': '内部员工',
  '2': '外部员工'
}

class UserAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      numberDisabledFlag: false,
      userPwd: userAddPwd,
      imgLoading: false,
      numErrorCode: 0
    }
    this._handleOrgSearch = debounce(this._handleOrgSearch, 800)
  }

  // 提交处理
  _handleSubmit = (e) => {
    e.preventDefault()
    const { dispatch, form } = this.props
    const { numErrorCode } = this.state
    form.validateFields((err, values) => {
      if (numErrorCode !== 0) {
        const number = form.getFieldValue('number')
        form.setFields({
          number: {
            value: number,
            errors: [new Error(this._getNumErrorMes(numErrorCode))],
          },
        })
        return
      }
      if (!err) {
        dispatch(addUser({
          ...this.getUserArg(values)
        }))
      }
    })
  }

  // 获取表单提交数据
  getUserArg = (values) => {
    return {
      userName: values['number'],
      userPwd: values['userPwd'],
      fullName: values['fullName'],
      telPhone: values['telPhone'],
      source: '1',
      userType: values['userType'],
      number: values['number'],
      organizationId: values['organizationId'],
      jobTitle: values['jobTitle'],
      sex: values['sex'],
      email: values['email'],
      remark: values['remark'],
      image: isEmpty(values['image']) ? '' : values['image'].uid,
      roleIds: values['roleIds'],
    }
  }

  // 用户类型更改事件
  _handleUserTypeChange = (value) => {
    const { form } = this.props
    form.setFieldsValue({ number: '', userName: '' })
    this.setState({ numErrorCode: 0 })
    // 1为外部用户
    if (value === '1') {
      this.setState({ numberDisabledFlag: false })
      form.validateFields(['number'])
    } else {
      this.setState({ numberDisabledFlag: true })
      getOuterUserNum().then(function (data) {
        form.setFieldsValue({ ...data, userName: data.number })
      }, function () {
        form.validateFields(['number']
        )
      })
    }
  }

  // 上传前校验
  _beforeUpload = (file) => {
    const picTypeArr = ['image/jpeg', 'image/jpg', 'image/png']
    const isPic = picTypeArr.indexOf(file.type) !== -1
    const isLt300K = file.size / 1024 <= 300
    !isPic && message.error('请上传jpg、jpeg、png的图片!')
    !isLt300K && message.error('请上传300KB以下的图片!')
    return isPic && isLt300K
  }

  // 上传后回调
  _imgUpload = e => {
    let data = e.file
    if (e.file.hasOwnProperty('response') && typeof e.file.response !== 'undefined') {
      const key = e.file.response.key
      data.url = `https://mallimg.easybao.com/${key}`
      data.uid = key
      data.thumbUrl = 'https://mallimg.easybao.com/' + key + '?vframe/jpg/offset/3'
    }
    return data
  }

  // 获取上传图片显示内容
  _getImg = () => {
    const { getFieldValue } = this.props.form
    const { imgLoading } = this.state
    if (isEmpty(getFieldValue('image'))) {
      return (
        <div className={styles['avatar-plus-wrapper']}>
          <Icon
            type={imgLoading ? 'loading' : 'plus'}
            className={imgLoading ? styles['avatar-loading'] : styles['avatar-plus']}
          />
          <div className={styles['ant-upload-text']}>上传照片</div>
        </div>)
    } else {
      return (
        // 修改页面info.image即对应url
        <img
          src={getFieldValue('image').url}
          alt=''
          className={styles['avatar']}
        />)
    }
  }

  // 图片上传loading效果
  _handleImageChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ imgLoading: true })
    } else if (info.file.status === 'done') {
      this.setState({ imgLoading: false })
    }
  }

  // 机构查询
  _handleOrgSearch = (orgName) => {
    const { dispatch } = this.props
    dispatch(getOrgList({ orgName }))
  }

  // 机构选择触发角色查询
  _handleOrgSelect = (roleOrgId) => {
    const { dispatch, form } = this.props
    form.setFieldsValue({ roleIds: [] })
    dispatch(getRoleList({ roleOrgId }))
  }

  _getNumErrorMes = (numErrorCode) => {
    if (numErrorCode === 700001) {
      return '员工工号已存在，请重新获取!'
    } else {
      return '此工号不在用户中心!'
    }
  }

  // 内部用户工号blur事件
  _handleNumberBlur = (e) => {
    const { form } = this.props
    const selectedValue = form.getFieldValue('userType')
    if (selectedValue === '1') {
      const number = e.target.value
      getInnerUserInfo({ number }).then((data) => {
        form.setFieldsValue(data)
        this.setState({ numErrorCode: 0 })
      }, (data) => {
        form.setFields({
          number: {
            value: number,
            errors: [new Error(this._getNumErrorMes(data.code))],
          },
        })
        this.setState({ numErrorCode: data.code })
      })
    }
  }

  // 工号修改事件
  _handleNumberChange = (e) => {
    const { form } = this.props
    const number = e.target.value
    form.setFieldsValue({ userName: number })
  }

  // 密码点击事件
  _handlePwdClick = () => {
    const { form } = this.props
    this.setState({ userPwd: '' })
    form.setFieldsValue({ userPwd: '' })
  }

  // 密码修改事件
  _handlePwdChange = (e) => {
    const { form } = this.props
    const userPwd = e.target.value
    this.setState({ userPwd })
    form.setFieldsValue({ userPwd })
  }

  componentDidMount() {
    const { dispatch } = this.props
    const timeStr = new Date().getSeconds().toString(16) + Math.random()
    const str = String(timeStr)
    dispatch(getQiniuToken(str))
    dispatch(getPosList())
    dispatch(getOrgList())
    dispatch(resetUserDetail())
  }

  render() {
    const { form, info, roleList, qiniuToken, orgList, posList, selectFetchingFlag } = this.props
    const { numberDisabledFlag, userPwd } = this.state
    const { getFieldDecorator } = form
    return (
      <div>
        <Form
          onSubmit={this._handleSubmit}
        >
          <FormItem className={styles['form-operate-btn']}>
            <Button
              type='primary'
              title='点击保存'
              loading={this.props.showBtnSpin}
              htmlType='submit'
            >
              保存
            </Button>
            <Link to={urls.USER_MANAGE}>
              <Button
                title='点击取消'
              >
                取消
              </Button>
            </Link>
          </FormItem>
          <Card
            title={<span className={styles['card-tit']}>基础信息</span>}
            className={styles['card-wrapper']}
          >
            <Row>
              <Col span={18}>
                <Row
                  id='rowUser'
                  justify='start'
                  type='flex'
                >
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='用户类型：'
                    >
                      {getFieldDecorator('userType', {
                        rules: [{
                          required: true,
                          message: '请选择用户类型!'
                        }],
                        initialValue: !isEmpty(info.userType) ? info.userType.toString() : undefined,
                      })(
                        <Select
                          placeholder='请选择用户类型'
                          onChange={e => this._handleUserTypeChange(e)}
                          getPopupContainer={() => document.getElementById('rowUser')}
                        >
                          {
                            Object.keys(userType).map(key => {
                              return (
                                <SelectOption
                                  key={key}
                                  value={key}
                                >
                                  {userType[key]}
                                </SelectOption>
                              )
                            })
                          }
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='工号：'
                    >
                      {getFieldDecorator('number', {
                        rules: [
                          { required: true, message: '请输入工号！', whitespace: true }
                        ],
                        initialValue: info.number
                      })(
                        <Input
                          placeholder='请输入工号'
                          maxLength={50}
                          disabled={numberDisabledFlag}
                          onBlur={(e) => { this._handleNumberBlur(e) }}
                          onChange={(e) => { this._handleNumberChange(e) }}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='姓名：'
                    >
                      {getFieldDecorator('fullName', {
                        rules: [{
                          required: true,
                          whitespace: true,
                          message: '请输入姓名！'
                        }],
                        initialValue: info.fullName
                      })(
                        <Input
                          placeholder='请输入姓名'
                          maxLength={50}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='性别：'
                    >
                      {getFieldDecorator('sex', {
                        initialValue: info.sex && String(info.sex) !== '9' ? info.sex : undefined,
                        rules: [{
                          required: true,
                          message: '请选择性别!'
                        }],
                      })(
                        <Select
                          placeholder='请选择性别'
                          getPopupContainer={() => document.getElementById('rowUser')}
                        >
                          {
                            Object.keys(sex).map(key => {
                              return (
                                <SelectOption
                                  key={key}
                                  value={key}
                                >
                                  {sex[key]}
                                </SelectOption>
                              )
                            })
                          }
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='电话号码：'
                    >
                      {getFieldDecorator('telPhone', {
                        whitespace: true,
                        rules: [{
                          required: true,
                          message: '请输入电话号码！'
                        }, {
                          pattern: /^[\d-]{11,13}$/,
                          message: '请输入正确的电话号码！'
                        }],
                        initialValue: info.telPhone
                      })(
                        <Input
                          maxLength={13}
                          placeholder='请输入电话号码'
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='所属机构：'
                    >
                      {getFieldDecorator('organizationId', {
                        rules: [{
                          required: true,
                          message: '请选择所属机构!'
                        }],
                        initialValue: info.organizationId
                      })(
                        <Select
                          showSearch
                          optionLabelProp='title'
                          placeholder='请选择所属机构'
                          filterOption={false}
                          onSearch={this._handleOrgSearch}
                          notFoundContent={selectFetchingFlag ? <Spin size='small' /> : null}
                          onSelect={this._handleOrgSelect}
                          getPopupContainer={() => document.getElementById('rowUser')}
                        >
                          {orgList.map(d => (
                            <SelectOption
                              key={d.id}
                              value={d.id}
                              title={d.orgName}
                            >
                              {d.orgName}
                            </SelectOption>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='岗位名称：'
                    >
                      {getFieldDecorator('jobTitle', {
                        rules: [{
                          required: true,
                          message: '请选择岗位名称!'
                        }],
                        initialValue: info.jobTitle
                      })(
                        <Select
                          optionLabelProp='title'
                          placeholder='请选择岗位名称'
                          filterOption={false}
                          getPopupContainer={() => document.getElementById('rowUser')}
                        >
                          {!isEmpty(posList) ? posList.map(d => (
                            <SelectOption
                              key={d.value}
                              value={d.value}
                              title={d.name}
                            >
                              {d.name}
                            </SelectOption>
                          )) : null}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='电子邮箱'
                    >
                      {getFieldDecorator('email', {
                        rules: [{
                          type: 'email', message: '请输入正确的电子邮箱!',
                        }],
                        initialValue: info.email
                      })(
                        <Input
                          placeholder='请输入电子邮箱'
                          maxLength={50}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='备注：'
                    >
                      {getFieldDecorator('remark', {
                        initialValue: info.remark
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
              <Col span={6}>
                <div className={styles['avatar-wrapper']}>
                  <p className={styles['avatar-title']}>用户照片</p>
                  <FormItem>
                    {
                      getFieldDecorator('image', {
                        valuePropName: 'file',
                        getValueFromEvent: this._imgUpload,
                        initialValue: !isEmpty(info.image) ? {
                          url: `https://mallimg.easybao.com/${info.image}`,
                          thumbUrl: `https://mallimg.easybao.com/${info.image}?vframe/jpg/offset/3`,
                          uid: info.image
                        } : {},
                      })(
                        <Upload
                          className={styles['avatar-uploader']}
                          name='file'
                          showUploadList={false}
                          data={{ token: qiniuToken }}
                          action='http://upload.qiniu.com'
                          accept='image/jpg, image/jpeg, image/png'
                          beforeUpload={this._beforeUpload}
                          onChange={this._handleImageChange}
                        >
                          {this._getImg()}
                        </Upload>
                      )
                    }
                  </FormItem>
                  <p className={styles['avatar-des']}>上传图片时，请上传300KB以下jpg、jpeg、png的图片，推荐尺寸130*130px</p>
                </div>
              </Col>
            </Row>
          </Card>
          <Card
            title={<span className={styles['card-tit']}>账号信息</span>}
            className={styles['card-wrapper']}
          >
            <Row>
              <Col span={12}>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label='账号：'
                  >
                    {getFieldDecorator('userName', {
                      initialValue: info.number
                    })(
                      <Input
                        disabled={true}
                        maxLength={50}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label='密码：'
                  >
                    {getFieldDecorator('userPwd', {
                      rules: [{
                        whitespace: true,
                        required: true,
                        min: 6,
                        max: 18,
                        message: '请输入密码！密码长度为6-18位'
                      }],
                      initialValue: userAddPwd
                    })(
                      <div>
                        <Input
                          placeholder='请输入密码'
                          value={userPwd}
                          type='password'
                          maxLength={18}
                          onClick={this._handlePwdClick}
                          onChange={(e) => { this._handlePwdChange(e) }}
                        />
                        <Input
                          type='password'
                          style={{ display: 'none' }}
                          name='fakePassWordRemembered'
                          disabled={true}
                        />
                        <Input
                          style={{ display: 'none' }}
                          name='fakeUserNameRemembered'
                          disabled={true}
                        />
                      </div>
                    )}
                  </FormItem>
                </Col>
              </Col>
            </Row>
          </Card>
          <Card
            title={<span className={styles['card-tit']}>角色信息</span>}
            className={styles['card-wrapper']}
          >
            <div className={styles['card-check-item']}>
              <FormItem>
                {getFieldDecorator('roleIds', {
                  initialValue: info.roleIds
                })(
                  <CheckboxGroup>
                    <Row>
                      {
                        !isEmpty(roleList) && roleList.map((val) => {
                          return (
                            <Col
                              span={24}
                              key={val.id}
                            >
                              <Checkbox
                                value={val.id}
                              >
                                {val.roleName}
                              </Checkbox>
                            </Col>
                          )
                        })
                      }
                    </Row>
                  </CheckboxGroup>
                )}
              </FormItem>
            </div>
          </Card>
        </Form>
      </div>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    info: state.baseUser.userInfo,
    qiniuToken: state.baseUser.qiniuToken,
    roleList: state.baseUser.roleList,
    orgList: state.baseUser.orgList,
    posList: state.baseUser.posList,
    selectFetchingFlag: state.baseUser.selectFetchingFlag,
    showBtnSpin: state.common.showButtonSpin,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(UserAdd))
