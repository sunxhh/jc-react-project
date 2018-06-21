import React, { Component } from 'react'
import { createAction } from 'redux-actions'
import { Form, Input, Tree, Popconfirm, Icon, Row, Col, Select, Button, message, Spin, Card } from 'antd'
import { connect } from 'react-redux'
import * as actions from './reduck'
import styles from './style.less'
import { showModalForm } from 'Components/modal/ModalForm'
import { isEmpty } from 'Utils/lang'
import menuCode from 'Global/menuCodes'

const TreeNode = Tree.TreeNode
const Search = Input.Search
const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
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
class MenuManage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expandedKeys: ['1'],
      searchValue: '',
      autoExpandParent: true,
      menuUrl: '',
      menuName: '金诚产业',
      childType: '',
      menuLevel: '0',
      visible: false,
      menuType: '1',
      displayType: true,
      showBtn: false,
      menuLevelId: '',
      editShowBtn: false,
      menuChildren: []
    }
  }
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false
    })
  }

  _handleSearchChange = (e) => {
    const value = e.target.value
    const expandedKeys = this.props.treeListArray.map((item) => {
      if (item.menuName.indexOf(value) > -1) {
        return getParentKey(item.key, this.props.treeList)
      }
      return null
    }).filter((item, i, self) => item && self.indexOf(item) === i)
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true
    })
  }

  returnRes = res => {
    return {
      id: res.menu.id,
      menuName: res.menu.menuName,
      menuType: res.menu.menuType,
      menuPid: res.menu.menuPid,
      menuUrl: res.menu.menuUrl,
      menuSort: res.menu.menuSort,
      menuDesc: res.menu.menuDesc,
      parentMenuName: res.parentMenuName
    }
  }
  // 菜单数据
  componentDidMount = () => {
    this.props.dispatch(actions.getTreeList()).then(res => {
      if (res && res[0] && res[0].children) {
        this.setState({
          menuChildren: res[0].children.map(item => item.menuUrl)
        })
      }
    })
  }
  // 点击左侧菜单
  _clickTree = (key, e) => {
    const { dispatch } = this.props
    if (e.selected) {
      dispatch(createAction('GET_TREE_ID')({
        treeId: key[0]
      }))
      const menuChildren = e.node.props.children
        ? e.node.props.children.map(item => item.props['data-url'])
        : []
      if (e.selectedNodes[0].props['menuLevel'] === '0') {
        this.props.dispatch(actions.getTreeDetail({
          id: key[0]
        })).then(res => this.props.form.setFieldsValue(this.returnRes(res)))
        this.setState({
          menuLevel: e.selectedNodes[0].props['menuLevel'],
          menuName: e.selectedNodes[0].props['data-title'],
          editShowBtn: false,
          showBtn: false,
          menuChildren
        })
        return
      } else {
        this.props.dispatch(actions.getTreeDetail({
          id: key[0]
        })).then(res => this.props.form.setFieldsValue(this.returnRes(res)))
        this.setState({
          menuLevel: '',
          displayType: true,
          showBtn: false,
          editShowBtn: true
        })
      }

      this.setState({
        menuName: e.selectedNodes[0].props['data-title'],
        menuUrl: e.selectedNodes[0].props['data-url'],
        childType: e.selectedNodes[0].props['child-type'],
        menuChildren
      })
    }
  }
  // 删除
  _delTreeNode = () => {
    const menuParentName = this.props.form.getFieldValue('parentMenuName')
    if (this.state.menuLevel === '0') {
      message.error('您不能删除顶级菜单！')
      return
    }
    if (this.props.treeId === '') {
      message.error('请选择一个菜单删除')
      return
    }
    if (this.state.menuUrl === 'add' && menuParentName === '菜单管理') {
      message.error('该菜单不能删除！')
      return
    }
    this.props.dispatch(actions.menuDel({ 'id': this.props.treeId }, () => {
      this.props.dispatch(actions.getTreeDetail({
        id: this.props.menuLevelId
      })).then(res => {
        this.props.dispatch(createAction('GET_TREE_ID')({
          treeId: ''
        }))
        this.props.form.setFieldsValue(this.returnRes(res))
      })
    }))
  }
  // 新增弹窗
  _showModal = (e) => {
    e.preventDefault()
    const { menuUrl } = this.state
    // 渲染菜单url
    if (this.props.treeId === '') {
      message.error('请选择一个菜单添加')
      return
    } else if (this.state.childType === '2') {
      message.error('您不能在该菜单上面再增加了！')
      return
    } else {
      const filterMenus = data => {
        if (isEmpty(data)) {
          return []
        } else if (this.state.menuLevel === '0') {
          return data
        }
        const res = data.filter(item => item.menuUrl === menuUrl || item.menuKey === menuUrl)
        if (res.length > 0) {
          return res[0].children || res[0].buttons || []
        } else {
          let newArr = []
          data.forEach(item => {
            if (!isEmpty(item.children)) {
              newArr = newArr.concat(item.children)
            }
          })
          return filterMenus(newArr)
        }
      }
      const res = filterMenus(menuCode).filter(item => !this.state.menuChildren.includes(item.menuUrl || item.key))
      if (isEmpty(res)) {
        message.warn('没有可添加的菜单！')
        return
      }
      const menuType = isEmpty(res) || res[0].menu ? '1' : '2'
      const renderUrl = data => {
        return data.map((item) => {
          const key = item.menuUrl || item.key || 'empty'
          const value = item.menu || item.name
          return (
            <Option
              key={key}
              value={key}
            >
              {value}
            </Option>
          )
        })
      }
      showModalForm({
        formItemLayout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 16 }
        },
        title: '添加菜单',
        fields: [
          {
            id: 'menuName',
            props: {
              label: menuType === '1' ? '菜单名称' : '按钮名称'
            },
            options: {
              rules: [{
                required: true,
                message: '请输入菜单名称!'
              }, {
                max: 50,
                message: '菜单名称过长!'
              }]
            },
            element: (
              <Input
                maxLength={50}
                placeholder='请输入菜单名称'
              />
            )
          },
          {
            id: 'menuType',
            props: {
              label: '类型'
            },
            options: {
              initialValue: menuType,
              rules: [{
                required: true,
                message: '请选择菜单类型!'
              }]
            },
            element: (
              <Select
                disabled={true}
              >
                <Option value='1'>菜单</Option>
                <Option value='2'>按钮</Option>
              </Select>
            )
          },
          {
            id: 'menuPid',
            props: {
              label: '上级菜单'
            },
            options: {
              initialValue: this.state.menuName ? this.state.menuName : '',
              rules: [{
                required: true,
                message: '请输入上级菜单!'
              }]
            },
            element: (
              <Input
                disabled={true}
              />
            )
          },
          {
            id: 'menuUrl',
            props: {
              label: menuType === '1' ? '菜单URL' : '按钮URL'
            },
            options: {
              rules: [{
                required: true,
                message: '请选择URL!'
              }]
            },
            element: (
              <Select>
                {
                  renderUrl(res)
                }
              </Select>
            )
          },
          {
            id: 'menuSort',
            props: {
              label: '显示顺序'
            },
            options: {
              rules: [{
                required: true,
                message: '显示顺序不能为空!'
              }, {
                pattern: '^[0-9]*$',
                message: '显示顺序只能为数字!'
              }]
            },
            element: (
              <Input
                maxLength={5}
                placeholder='请输入显示顺序'
              />
            )
          },
          {
            id: 'menuDesc',
            props: {
              label: menuType === '1' ? '菜单描述' : '按钮描述'
            },
            options: {
              rules: [{
                max: 500,
                message: '菜单描述过长!'
              }]
            },
            element: (
              <Input.TextArea
                maxLength={500}
                placeholder='请输入菜单描述'
              />
            )
          }
        ],
        onOk: values => {
          this.props.dispatch(actions.addMenu({
            'menu': {
              ...values,
              'menuPid': this.props.treeId,
              'menuMod': '1'
            }
          })).then(res => this.setState({ menuChildren: this.state.menuChildren.concat([values.menuUrl]) }))
        }
      })
    }
  }
  // 编辑
  _editInfo = () => {
    this.setState({
      displayType: false,
      showBtn: true,
      editShowBtn: false
    })
  }
  // 取消编辑
  _canlceEditInfo = () => {
    this.props.dispatch(actions.getTreeDetail({
      id: this.props.form.getFieldValue('id')
    })).then(res => this.props.form.setFieldsValue(this.returnRes(res)))
    this.setState({
      displayType: true,
      showBtn: false,
      editShowBtn: true
    })
  }
  // 编辑提交
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.menuPid === '' && values.id === '') {
          values.id = this.props.menuLevelId
          values.menuPid = this.props.menuPid
          this.props.dispatch(actions.menuModify({
            'menu': {
              ...values,
              'menuMod': '1',
            }
          }))
        }
        this.props.dispatch(actions.menuModify({
          'menu': {
            ...values,
            'menuMod': '1',
          }
        }))
        this.setState({
          displayType: true,
          showBtn: false,
          editShowBtn: true
        })
      }
    })
  }

  render() {
    const { searchValue, expandedKeys, autoExpandParent } = this.state
    const { getFieldDecorator } = this.props.form
    const { treeList, treeDetail, parentMenuName, path, auths } = this.props
    const authState = (isEmpty(auths) || isEmpty(auths[path])) ? [] : auths[path]
    if (isEmpty(treeDetail && parentMenuName)) {
      <span>暂无数据</span>
    }

    const loop = data => data.map((item) => {
      const index = item.menuName.indexOf(searchValue)
      const beforeStr = item.menuName.substr(0, index)
      const afterStr = item.menuName.substr(index + searchValue.length)
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.menuName}</span>

      if (item.children && item.children.length > 0) {
        return (
          <TreeNode
            key={item.id}
            title={item.menuType === '2' ? <div><Icon type='star' />&nbsp;&nbsp;{title}</div> : title}
            data-id={item.id}
            child-type={item.menuType}
            data-title={item.menuName}
            menuLevel={item.menuLevel}
            data-url={item.menuUrl}
            selectable={this.props.treeId !== item.id}
          >
            {loop(item.children)}
          </TreeNode>
        )
      }

      return (
        <TreeNode
          key={item.id}
          title={title}
          data-id={item.menuPid}
          data-title={item.menuUrl}
          child-type={item.menuType}
          menuLevel={item.menuLevel}
          data-url={item.menuUrl}
          selectable={this.props.treeId !== item.id}
        />
      )
    })

    const finalActions = [
      <Icon key='plus' type='plus' onClick={this._showModal} />
    ]
    if (this.props.treeId) {
      finalActions.push(
        <Popconfirm
          key='minus'
          title={`确定要删除该菜单吗?`}
          onConfirm={this._delTreeNode}
          okText='确定'
          cancelText='取消'
        >
          <Icon type='minus' />
        </Popconfirm>
      )
    }
    return (
      <div className={styles['common-table']}>
        <Card
          title='菜单结构'
          // loading={this.props.spinning}
          className={styles['left-tree']}
          actions={finalActions}
        >
          <Search
            style={{ marginBottom: 8 }}
            placeholder='请输入关键词'
            onChange={this._handleSearchChange}
          />
          <Spin spinning={this.props.spinning}>
            <Tree
              showLine
              onExpand={this.onExpand}
              onSelect={this._clickTree}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              defaultSelectedKeys={['1']}
            >
              {
                loop(treeList)
              }
            </Tree>
          </Spin>
        </Card>
        <div className={styles['right-table']}>
          <Card
            style={{}}
            title='基础信息'
            extra={
              <div>
                {
                  authState.indexOf('edit') !== -1 && this.state.editShowBtn && (
                    <Button
                      type='primary'
                      icon='edit'
                      onClick={this._editInfo}
                    >
                      编辑
                    </Button>
                  )
                }
                {this.state.showBtn && (
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
                      onClick={this._canlceEditInfo}
                    >
                      取消
                    </Button>
                  </div>
                )}
              </div>
            }
          >
            <Form>
              <Row>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label={'类型'}
                  >
                    {getFieldDecorator('menuType', {
                      initialValue: treeDetail.menuType ? treeDetail.menuType : treeList[0] ? treeList[0].menuType : '',
                      rules: [{
                        required: true,
                        message: '请选择菜单类型!' }],
                    })(
                      <Select
                        disabled={true}
                      >
                        <Option value='1'>菜单</Option>
                        <Option value='2'>按钮</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label={'菜单名称'}
                  >
                    {getFieldDecorator('menuName', {
                      initialValue: treeDetail.menuName ? treeDetail.menuName : treeList[0] ? treeList[0].menuName : '',
                      rules: [{
                        required: true,
                        message: '请输入菜单名称!' }, {
                        max: 50,
                        message: '按钮或者菜单名称过长!'
                      }
                      ],
                    })(
                      <Input
                        maxLength='50'
                        disabled={this.state.displayType}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label={'上级菜单'}
                  >
                    {getFieldDecorator('parentMenuName', {
                      initialValue: parentMenuName,
                    })(
                      <Input
                        disabled={true}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label={'菜单URL'}
                  >
                    {getFieldDecorator('menuUrl', {
                      initialValue: treeDetail.menuUrl ? treeDetail.menuUrl : treeList[0] ? treeList[0].menuUrl : '',
                      rules: [{
                        required: true,
                        message: '请输入菜单URL!' }, {
                        max: 50,
                        message: '菜单URL过长!'
                      }
                      ],
                    })(
                      <Input
                        disabled={true}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label={'显示顺序'}
                  >
                    {getFieldDecorator('menuSort', {
                      initialValue: treeDetail.menuSort ? treeDetail.menuSort : treeList[0] ? treeList[0].menuSort : '',
                      rules: [{
                        pattern: '^[0-9]*$',
                        message: '显示顺序只能为数字!'
                      }],
                    })(
                      <Input
                        maxLength='5'
                        disabled={this.state.displayType}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                    label={'菜单描述'}
                  >
                    {getFieldDecorator('menuDesc', {
                      initialValue: treeDetail.menuDesc ? treeDetail.menuDesc : this.props.menuPid === '0' ? treeList[0].menuDesc : '',
                      rules: [{
                        max: 500,
                        message: '菜单描述过长!'
                      }]
                    })(
                      <Input.TextArea
                        maxLength={500}
                        disabled={this.state.displayType}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                  >
                    {getFieldDecorator('id', {
                      initialValue: treeDetail.id ? treeDetail.id : '',
                    })(
                      <Input style={{ display: 'none' }} />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formItemLayout}
                  >
                    {getFieldDecorator('menuPid', {
                      initialValue: treeDetail.menuPid ? treeDetail.menuPid : '',
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
    treeList: state.menuManageReducers.treeList,
    treeListArray: state.menuManageReducers.treeListArray,
    treeDetail: state.menuManageReducers.treeDetail,
    parentMenuName: state.menuManageReducers.parentMenuName,
    menuLevelId: state.menuManageReducers.menuLevelId,
    menuPid: state.menuManageReducers.menuPid,
    spinning: state.common.showListSpin,
    auths: state.common.auths,
    treeId: state.menuManageReducers.treeId || '1',
    showBtnSpin: state.common.showButtonSpin,
  }
}
const mapDispatchToProps = (dispatch) => ({
  dispatch,
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(MenuManage))
