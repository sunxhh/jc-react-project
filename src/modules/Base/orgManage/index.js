import React, { Component } from 'react'
import { createAction } from 'redux-actions'
import { Form, Input, Tree, Popconfirm, Icon, Row, Col, Button, message, Select, Cascader, Divider, Card } from 'antd'
import { connect } from 'react-redux'
import * as actions from './reduck'
import styles from './style.less'
// import { showModalForm } from 'Components/modal/ModalForm'
import { showModalWrapper } from 'Components/modal/ModalWrapper'
import { isEmpty } from 'Utils/lang'
import BindShopModal from './bindShopModal'
import AddOrgModal from './addOrgModal'
import { shopMode, selfSupport } from './dict'

const TreeNode = Tree.TreeNode
const Search = Input.Search
const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

const getParentKey = (key, tree) => {
  let parentKey = ''
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.id === key)) {
        parentKey = node.id
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}

class OrgManage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expandedKeys: ['1'],
      searchValue: '',
      autoExpandParent: true,
      addShopData: {}
    }
  }

  // 设置 props 默认值
  static defaultProps = {
    orgList: [],
    orgDetail: {},
    crrTreeId: '',
    orgLevel: '',
    orgName: '',
    topTreeNode: {
      orgId: '',
      levelId: '',
      nodeName: '',
    },
    editBtn: false,
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    })
  }

  onChange = (e) => {
    const value = e.target.value
    let expandedKeys = []
    if (value) {
      expandedKeys = this.props.orgListArray.filter((item) => {
        return item.orgName.indexOf(value) > -1
      }).map((item) => getParentKey(item.key, this.props.orgList))
    } else {
      expandedKeys = ['1']
    }
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    })
  }

  // 初始化表格数据
  componentDidMount = () => {
    this.props.dispatch(actions.getOrgTreeList())
    this.props.dispatch(actions.getBelongIndustryList({ codeType: 'belongIndustry' }))
    this.props.dispatch(actions.getRegionList({}))
  }

  returnRes = res => {
    return {
      orgCode: res.org.orgCode,
      orgName: res.org.orgName,
      orgPid: res.org.orgPid,
      id: res.org.id,
      orgAddress: res.org.orgAddress,
      orgPhone: res.org.orgPhone,
      orgLinkMan: res.org.orgLinkMan,
      orgSort: res.org.orgSort,
      orgSName: res.org.orgSName,
      parentOrgName: res.parentOrgName,
      orgLevel: res.org.orgLevel,
      orgStockFlag: res.org.orgStockFlag,
      shopNumber: res.org.shopNumber,
      shopName: res.org.shopName,
      mode: res.org.mode,
      selfSupport: res.org.selfSupport,
      orgCascaderAddress: res.org.orgProvinceId
        ? [res.org.orgProvinceId, res.org.orgCityId, res.org.orgAreaId]
        : [],
    }
  }
  // 点击左侧菜单
  _clickTree = (key, e) => {
    const { dispatch } = this.props
    if (e.selected) {
      // if (e.selectedNodes[0].props['orgLevel'] === '0') {
      //   this.setState({
      //     isBtn: true,
      //   })
      // } else {
      //   this.setState({
      //     isBtn: false,
      //   })
      // }
      dispatch(createAction('SWITCH_EDIT_BTN')(false))
      dispatch(createAction('CRR_TREE_ID')({
        crrTreeId: key[0],
        orgLevel: e.selectedNodes[0].props['data-orgLevel'],
        orgName: e.selectedNodes[0].props['data-title'],
      }))
      dispatch(actions.getOrgDetail({ id: key[0] })).then(res => {
        this.props.form.setFieldsValue(this.returnRes(res))
      })
    }
  }

  // 删除
  _delTreeNode = () => {
    if (this.props.crrTreeId === '') {
      message.error('请先选中一个组织机构再操作')
      return
    }
    if (this.props.orgLevel === '0') {
      message.error('您不能删除该组织机构！')
      return
    }
    this.props.dispatch(actions.orgDel({
      'id': this.props.crrTreeId,
      'topTreeNode': this.props.topTreeNode,
    }, () => {
      this.props.dispatch(actions.getOrgDetail({
        id: this.props.crrTreeId
      })).then(res => this.props.form.setFieldsValue(this.returnRes(res)))
    }))
  }

  // 新增弹窗
  _showModal = (e) => {
    e.preventDefault()
    const { belongIndustry, regionList, dispatch, crrTreeId, orgName, orgLevel } = this.props
    if (this.props.crrTreeId === '') {
      message.error('请先选中一个组织机构再操作')
      return
    } else if (this.props.orgLevel === '2') {
      message.error('该二级组织不能新增下级组织机构！')
      return
    } else {
      showModalWrapper((
        <AddOrgModal
          belongIndustry={belongIndustry}
          regionList={regionList}
          orgLevel={orgLevel}
          dispatch={dispatch}
          crrTreeId={crrTreeId}
          orgName={orgName}
        />
      ), {
        title: '新增机构'
      })
    }
  }

  // 激活编辑
  _isshow = () => {
    this.props.dispatch(createAction('SWITCH_EDIT_BTN')(true))
    // this.setState({
    //   saveBtn: true,
    //   editBtn: false,
    // })
  }

  // 取消编辑
  _cancel = () => {
    this.props.dispatch(createAction('SWITCH_EDIT_BTN')(false))
    this.props.dispatch(actions.getOrgDetail({
      id: this.props.crrTreeId
    })).then(res => this.props.form.setFieldsValue(this.returnRes(res)))
    // this.setState({
    //   saveBtn: false,
    //   editBtn: true,
    // })
  }

  // 编辑提交
  handleSubmit = (e) => {
    e.preventDefault()
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
        this.props.dispatch(actions.orgModify({
          org
        }))
        // this.setState({
        //   saveBtn: false,
        //   editBtn: true,
        // })
      }
    })
  }

  componentWillUnmount() {
    this.props.dispatch(createAction(actions.EMPTY_CRR_TREE_ID)())
  }

  _bindShopInEdit = record => {
    this.props.form.setFieldsValue({
      shopNumber: record.shopNumber,
      shopName: record.shopName,
      mode: record.mode,
      selfSupport: record.selfSupport,
      shopType: record.shopType,
    })
  }

  _bindShopInAdd = record => {
    this.setState({
      addShopData: record
    })
  }

  _showShopListModal = (selectCallback) => {
    showModalWrapper((
      <BindShopModal handleSelect={selectCallback} />
    ), {
      title: '选择店铺',
      width: 800
    })
  }

  // 组件 jsx 的编写
  render() {
    const { searchValue, autoExpandParent, expandedKeys } = this.state
    const { getFieldDecorator } = this.props.form
    const { orgList, orgDetail, parentOrgName, path, auths, belongIndustry, regionList } = this.props
    const authState = (isEmpty(auths) || isEmpty(auths[path])) ? [] : auths[path]
    if (isEmpty(orgDetail && parentOrgName)) {
      <span>暂无数据</span>
    }
    const loop = data => data.map((item) => {
      const index = item.orgName.indexOf(searchValue)
      const beforeStr = item.orgName.substr(0, index)
      const afterStr = item.orgName.substr(index + searchValue.length)
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.orgName}</span>
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode
            key={item.id}
            title={title}
            data-id={item.id}
            data-title={item.orgName}
            data-orgLevel={item.orgLevel}
            orgLevel={item.orgLevel}
            selectable={this.props.crrTreeId !== item.id}
          >
            {loop(item.children)}
          </TreeNode>
        )
      }
      return (
        <TreeNode
          key={item.id}
          title={title}
          data-id={item.id}
          data-orgLevel={item.orgLevel}
          data-title={item.orgName}
        />
      )
    })
    const finalActions = []
    if (authState.includes('add') && this.props.orgLevel !== '2') {
      finalActions.push(
        <Icon key='plus' type='plus' onClick={this._showModal} />
      )
    }
    if (authState.includes('delete') && this.props.crrTreeId && this.props.orgLevel !== '0') {
      finalActions.push(
        <Popconfirm
          title={`确认要删除该组织机构吗？`}
          okText='确定'
          cancelText='取消'
          onConfirm={() => this._delTreeNode()}
        >
          <a
            href='javascript:void(0);'
            title={'删除'}
          >
            <Icon
              className={styles['bottom-tree-icon']}
              type='minus'
            />
          </a>
        </Popconfirm>
      )
    }

    return (
      <div className={styles['common-table']}>
        {
          this.props.orgList.length > 0 && (
            <Card
              title='组织结构'
              loading={this.props.spinning}
              className={styles['left-tree']}
              actions={finalActions}
            >
              <Search
                style={{ marginBottom: 8 }}
                placeholder='请输入关键词'
                onChange={e => this.onChange(e)}
              />
              <Tree
                showLine
                onExpand={this.onExpand}
                onSelect={this._clickTree}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                // defaultExpandAll={true}
                defaultExpandedKeys = {[this.props.topTreeNode.orgId]}
                selectedKeys = {[this.props.crrTreeId]}
              >
                {
                  loop(orgList)
                }
              </Tree>
            </Card>
          )
        }
        <div className={styles['right-table']} style={orgDetail && !isEmpty(orgDetail) ? {} : { display: 'none' }}>
          <Card
            title='基础信息'
            extra={(
              <div>
                {authState.includes('edit') && this.props.orgLevel !== '0' && !this.props.editBtn && (
                  <Button
                    type='primary'
                    icon='edit'
                    onClick={this._isshow}
                  >
                    编辑
                  </Button>)}
                {this.props.orgLevel !== '0' && this.props.editBtn && (
                  <div>
                    <Button
                      type='primary'
                      icon='save'
                      onClick={this.handleSubmit}
                      loading={this.props.showBtnSpin}
                    >
                      保存
                    </Button>
                    <Button
                      icon='rollback'
                      onClick={this._cancel}
                    >
                      取消
                    </Button>
                  </div>
                )}
              </div>
            )}
          >
            <Form onSubmit={this.handleSubmit}>
              <Row
                type='flex'
                justify='start'
              >
                <Col span={orgDetail.orgLevel === '1' ? 12 : 0}>
                  <FormItem
                    {...formItemLayout}
                    label='所属产业'
                  >
                    {getFieldDecorator('orgBelongIndustry', {
                      rules: [{
                        required: orgDetail.orgLevel === '1',
                        message: '请选择所属产业!',
                      }],
                      initialValue: orgDetail && orgDetail.orgBelongIndustry || null,
                    })(
                      <Select disabled={!this.props.editBtn}>
                        {belongIndustry.map(item => (
                          <Option key={item.value} value={item.value}>{item.name}</Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label={'组织编码：'}
                  >
                    {getFieldDecorator('orgCode', {
                      rules: [{
                        required: true,
                        message: '请输入组织编码!',
                      }],
                      initialValue: orgDetail.orgCode,
                    })(
                      <Input
                        placeholder='请输入组织编码'
                        disabled={true}
                        maxLength='50'
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label={'组织名称：'}
                  >
                    {getFieldDecorator('orgName', {
                      rules: [{
                        required: true,
                        message: '请输入组织名称!',
                      }],
                      initialValue: orgDetail.orgName,
                    })(
                      <Input
                        placeholder='请输入组织名称'
                        disabled={!this.props.editBtn}
                        maxLength='50'
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label={'组织等级：'}
                  >
                    {getFieldDecorator('orgLevel', {
                      initialValue: orgDetail.orgLevel && orgDetail.orgLevel,
                    })(
                      <Select
                        disabled={true}
                      >
                        <Option value='0'>总部 </Option>
                        <Option value='1'>一级</Option>
                        <Option value='2'>二级</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label={'上级组织：'}
                  >
                    {getFieldDecorator('parentOrgName', {
                      initialValue: parentOrgName,
                    })(
                      <Input
                        disabled={true}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label={'组织简称：'}
                  >
                    {getFieldDecorator('orgSName', {
                      rules: [{
                        required: true,
                        message: '请输入组织简称!',
                      }],
                      initialValue: orgDetail.orgSName,
                    })(
                      <Input
                        placeholder='请输入组织简称'
                        disabled={!this.props.editBtn}
                        maxLength={50}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label={'组织顺序：'}
                  >
                    {getFieldDecorator('orgSort', {
                      rules: [{
                        required: true,
                        message: '请输入组织顺序!',
                      }, {
                        pattern: /^[0-9]*[1-9][0-9]*$/,
                        message: '请输入数字!'
                      }],
                      initialValue: orgDetail.orgSort,
                    })(
                      <Input
                        maxLength={5}
                        placeholder='请输入组织顺序'
                        disabled={!this.props.editBtn}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label={'联系人：'}
                  >
                    {getFieldDecorator('orgLinkMan', {
                      rules: [{
                        required: true,
                        message: '请输入联系人!',
                      }],
                      initialValue: orgDetail.orgLinkMan,
                    })(
                      <Input
                        placeholder='请输入联系人'
                        disabled={!this.props.editBtn}
                        maxLength={50}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label={'联系电话：'}
                  >
                    {getFieldDecorator('orgPhone', {
                      rules: [{
                        required: true,
                        message: '请输入联系电话!',
                      }, {
                        pattern: /^[1]\d{10}|0\d{2,3}-?\d{7,8}|400[-]\d{4}[-]\d{3}$/,
                        message: '请输入正确的电话号码!'
                      }],
                      initialValue: orgDetail.orgPhone ? orgDetail.orgPhone : undefined,
                    })(
                      <Input
                        placeholder='请输入联系电话'
                        disabled={!this.props.editBtn}
                        maxLength={13}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={orgDetail.orgLevel === '2' ? 12 : 0}>
                  <FormItem
                    {...formItemLayout}
                    label='执照号'
                  >
                    {getFieldDecorator('orgRegisteredNo', {
                      initialValue: orgDetail.orgRegisteredNo,
                    })(
                      <Input
                        disabled={!this.props.editBtn}
                        placeholder='请输入执照号'
                        maxLength={50}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label='组织地址'
                  >
                    {getFieldDecorator('orgCascaderAddress', {
                      rules: [{
                        required: true,
                        message: '请选择组织地址!',
                      }],
                      initialValue: orgDetail.orgProvinceId
                        ? [orgDetail.orgProvinceId, orgDetail.orgCityId, orgDetail.orgAreaId]
                        : [],
                    })(
                      <Cascader
                        placeholder='请选择组织地址'
                        options={regionList}
                        disabled={!this.props.editBtn}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label='详细地址'
                  >
                    {getFieldDecorator('orgAddress', {
                      rules: [{
                        required: true,
                        message: '请输入详细地址!',
                      }],
                      initialValue: orgDetail.orgAddress,
                    })(
                      <Input.TextArea
                        placeholder='请输入详细地址'
                        disabled={!this.props.editBtn}
                        maxLength={100}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={orgDetail.orgLevel === '2' ? 12 : 0}>
                  <FormItem
                    {...formItemLayout}
                    label='是否有库存'
                  >
                    {getFieldDecorator('orgStockFlag', {
                      initialValue: orgDetail.orgStockFlag,
                    })(
                      <Select
                        disabled={!this.props.editBtn}
                        placeholder='请选择是否有库存'
                      >
                        <Option value='0'>没有库存</Option>
                        <Option value='1'>有库存</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                {orgDetail.orgLevel === '2' && <Divider type='horizontal' />}
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label='店铺编号'
                  >
                    {getFieldDecorator('shopNumber', {
                      initialValue: orgDetail.shopNumber,
                    })(
                      <Input
                        addonAfter={this.props.editBtn ? [
                          <span key='select' onClick={() => this._showShopListModal(this._bindShopInEdit)}>选择</span>,
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
                        ] : null}
                        disabled={true}
                        placeholder='请选择店铺'
                        maxLength={50}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={orgDetail.orgLevel === '2' ? 12 : 0}>
                  <FormItem
                    {...formItemLayout}
                    label='店铺名称'
                  >
                    {getFieldDecorator('shopName', {
                      initialValue: orgDetail.shopName,
                    })(
                      <Input
                        disabled={true}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={orgDetail.orgLevel === '2' ? 12 : 0}>
                  <FormItem
                    {...formItemLayout}
                    label='经营方式'
                  >
                    {getFieldDecorator('mode', {
                      initialValue: orgDetail.mode,
                    })(
                      <Select
                        disabled={true}
                        placeholder='请选择经营方式'
                      >
                        {shopMode.map(item => (
                          <Option value={item.value} key={item.value}>{item.key}</Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={orgDetail.orgLevel === '2' ? 12 : 0}>
                  <FormItem
                    {...formItemLayout}
                    label='是否自营'
                  >
                    {getFieldDecorator('selfSupport', {
                      initialValue: orgDetail.selfSupport,
                    })(
                      <Select
                        disabled={true}
                        placeholder='请选择是否自营'
                      >
                        {selfSupport.map(item => (
                          <Option value={item.value} key={item.value}>{item.key}</Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                  >
                    {getFieldDecorator('id', {
                      initialValue: orgDetail.id,
                    })(
                      <Input style={{ display: 'none' }} />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                  >
                    {getFieldDecorator('orgPid', {
                      initialValue: orgDetail.orgPid,
                    })(
                      <Input style={{ display: 'none' }} />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
      </div>)
  }
}

const mapStateToProps = (state) => {
  return {
    orgListArray: state.org.orgListArray,
    orgList: state.org.orgList,
    orgDetail: state.org.orgDetail,
    parentOrgName: state.org.parentOrgName,
    crrTreeId: state.org.crrTreeId,
    orgLevel: state.org.orgLevel,
    orgName: state.org.orgName,
    topTreeNode: state.org.topTreeNode,
    editBtn: state.org.editBtn,
    belongIndustry: state.org.belongIndustry,
    auths: state.common.auths,
    regionList: state.org.regionList,
    spinning: state.common.showListSpin,
    showBtnSpin: state.common.showButtonSpin,
  }
}
const mapDispatchToProps = (dispatch) => ({
  dispatch,
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(OrgManage))
