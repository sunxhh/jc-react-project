import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { Layout, Icon, Spin, Button, Tooltip, Dropdown, Menu, Form, Input } from 'antd'
import {
  // Link,
  Route
} from 'react-router-dom'
import { push, goBack } from 'react-router-redux'

import YXBreadcrunb from './Breadcrumb/index'
import AppMenu from './menu'
import SubMenu from 'Components/Menus/subMenu'
import { showModalWrapper } from 'Components/modal/ModalWrapper'
import styles from './style.less'
import { connect } from 'react-redux'
import { userLogout, modifyPassword } from 'Global/action'
import storage from 'Utils/storage.js'
import logo from 'Assets/images/logo_home.png'
import { isEmpty } from 'Utils/lang'

const { Content, Sider, Header } = Layout
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
}

class MainLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      confirmDirty: false,
      selectedKeys: storage.get('moduleKey') ? [storage.get('moduleKey')] : ['mams_home']
    }
  }

  componentDidMount() {
    // to init something for whole project
  }

  // 设置是否可收起
  _toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }

  _firstLevelMenuClick = (key) => {
    storage.set('moduleKey', key)
    this.setState({
      collapsed: false,
      selectedKeys: [key]
    })
  }

  _logoClick = () => {
    storage.set('moduleKey', 'mams_home')
    this.setState({
      collapsed: true,
      selectedKeys: ['mams_home']
    })
    this.props.match.history.push('/')
  }

  // 拓展时用
  _selectFirstLevelMenu = () => {
    return (
      <AppMenu
        selectedKeys={this.state.selectedKeys}
        onClickCallback={this._firstLevelMenuClick}
        match={this.props.match}
      />
    )
  }

  _selectMenu = (subMenus) => {
    return (
      <SubMenu
        selectedKeys={this.state.selectedKeys}
        match={this.props.match}
        subMenus={subMenus}
      />
    )
  }

  getMenuName = (pathName) => {
    if (!pathName || pathName === '/') return ''
    let reg = new RegExp(/\/(\b\w*\b)/)
    let matchName = pathName.match(reg)[1]
    let name = matchName.split('')
    name = name[0].toUpperCase() + name.slice(1).join('')
    return name
  }

  _logout = () => {
    this.props.dispatch(userLogout())
  }

  checkPassword = (rule, value, callback, form) => {
    if (value.length >= form.getFieldValue('newPassword').length) {
      if (value && value !== form.getFieldValue('newPassword')) {
        callback('两次密码不一致')
      } else {
        callback()
      }
    } else {
      callback()
    }
  }

  checkConfirm = (rule, value, callback, form) => {
    if (value && this.state.confirmDirty) {
      form.validateFields(['passwordConfirm'], { force: true })
    }
    callback()
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }

  handleSubmit = (form, onCancel) => {
    form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch(modifyPassword(
          { userName: values.userName, origPwd: values.password, userPwd: values.newPassword, confirmPwd: values.passwordConfirm }
        )).then(res => {
          if (res) {
            this.setState({ confirmDirty: false }, () => {
              onCancel()
            })
          }
        })
      }
    })
  }

  _modifyPasswordForm = (props) => {
    const { getFieldDecorator } = props.form
    return (
      <Form className='login-form'>
        <FormItem
          {...formItemLayout}
          label='账户'
        >
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入你的账户' }],
            initialValue: storage.get('userInfo').userName
          })(
            <Input placeholder='请输入账户' />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='密码'
        >
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入你的密码' }],
          })(
            <Input type='password' placeholder='请输入密码' />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='新密码'
        >
          {getFieldDecorator('newPassword', {
            rules: [{
              required: true, message: '请输入你的新密码',
            }, {
              validator: (rule, value, callback) => this.checkConfirm(rule, value, callback, props.form),
            }],
          })(
            <Input type='password' placeholder='请输入新密码' />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='确认密码'
        >
          {getFieldDecorator('passwordConfirm', {
            rules: [{
              required: true, message: '请确认新密码',
            }, {
              validator: (rule, value, callback) => this.checkPassword(rule, value, callback, props.form),
            }],
          })(
            <Input type='password' onBlur={this.handleConfirmBlur} placeholder='请再次输入新密码' />
          )}
        </FormItem>
        <FormItem className={styles['operate-modal-btn']}>
          <Button
            onClick={() => {
              this.setState({ confirmDirty: false }, () => {
                props.onCancel()
              })
            }}
          >
            取消
          </Button>
          <Button
            type='primary'
            htmlType='submit'
            onClick={() => this.handleSubmit(props.form, props.onCancel)}
          >
            确认
          </Button>
        </FormItem>
      </Form>
    )
  }

  _modifyPassword = () => {
    const ModifyPasswordForm = Form.create()(this._modifyPasswordForm)
    showModalWrapper((
      <ModifyPasswordForm />
    ), {
      title: '修改密码'
    })
  }

  _onHeaderMenuClick = ({ key }) => {
    if (key === 'logout') {
      this._logout()
    } else if (key === 'modifyPassword') {
      this._modifyPassword()
    }
  }

  render() {
    let MainContent = this.props.content
    const { showSpin, routeActions, menuTreeList } = this.props
    let userInfo = storage.get('userInfo')
    let userDetail = ''
    if (userInfo) {
      userDetail = userInfo.userName + (userInfo.fullName ? '/' + userInfo.fullName : '') + (userInfo.orgName ? '-' + userInfo.orgName : '')
    }
    let subMenus = []
    let menuName = ''
    if (!isEmpty(menuTreeList)) {
      const parentMenu = menuTreeList[0].children.find(item => item.menuUrl === this.state.selectedKeys[0])
      if (parentMenu) {
        menuName = parentMenu.menuName
        subMenus = parentMenu.children
      }
    }
    const menu = (
      <Menu
        className={styles.menu}
        selectedKeys={[]}
        onClick={this._onHeaderMenuClick}
      >
        <Menu.Item key='modifyPassword'><Icon type='user' />修改密码</Menu.Item>
        <Menu.Divider />
        <Menu.Item key='logout'><Icon type='logout' />退出登录</Menu.Item>
      </Menu>
    )
    return (
      <Layout className={styles.layout}>
        <Sider
          trigger={null}
          collapsible
          collapsed={true}
          breakpoint='lg'
          // style={{ background: '#ffffff' }}
        >
          <div className={styles.logo} onClick={this._logoClick}>
            <img src={logo} alt='logo' />
          </div>
          <div className={styles.map}>
            { this._selectFirstLevelMenu() }
          </div>
        </Sider>
        {!isEmpty(subMenus) && (
          <Sider
            style={!this.state.collapsed ? {} : { display: 'none' }}
            className={styles['sub-contianer']}
            trigger={null}
            collapsible
            collapsed={false}
            breakpoint='lg'
            width={220}
          >
            <div className={styles['sub-title']}>
              <h3>{menuName}</h3>
            </div>
            { this._selectMenu(subMenus) }
          </Sider>
        )}
        <Layout
          style={{ minWidth: 960, overflow: 'auto', height: '100vh', background: 'rgb(240, 242, 245)' }}
        >
          <Header className={styles.header} style={{ background: '#ffffff' }}>
            {!isEmpty(subMenus) && (
              <div
                className={styles.header_button}
                onClick={this._toggle}
              >
                <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
              </div>
            )}
            <div className={styles.right_warpper}>
              <span className={styles['name']}>
                <Dropdown overlay={menu}>
                  <span className={`${styles.action} ${styles.account}`}>
                    <Icon type='user' style={{ fontSize: 30 }} />
                  </span>
                </Dropdown>
                欢迎您，
                {userDetail.length > 20 ? (
                  <Tooltip
                    placement='bottom'
                    title={userDetail}
                  >
                    <span>{userDetail.substring(0, 19) + '...'}</span>
                  </Tooltip>
                ) : (
                  <span>{userDetail}</span>
                )}
              </span>
            </div>
          </Header>
          <div>
            <Route
              render={({ location, match }) => (
                <YXBreadcrunb
                  location={location}
                  match={match}
                  routes={this.props.routes}
                />
              )}
            />
            {/* <YXBreadcrunb />*/}
            <Content className={styles.content}>
              <MainContent {...this.props} routeActions={routeActions} />
            </Content>
          </div>
        </Layout>
        {
          showSpin && showSpin.bool ? (
            <div className={styles.cover}>
              <Spin
                tip={showSpin.content}
                style={{ marginTop: 160 }}
              />
            </div>
          ) : null
        }
      </Layout>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showSpin: state.common.showSpin,
    userInfo: state.common.userInfo,
    menuTreeList: state.common.menuTreeList,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  routeActions: bindActionCreators({
    push,
    goBack,
    // showLogin,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout)

