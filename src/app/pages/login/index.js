import React, { Component } from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'
import styles from './style.less'
import { Input, Button, message } from 'antd'
import title from 'Assets/images/login/logo_login.png'
import loginLeft from 'Assets/images/login/login-left.png'
import loginName from 'Assets/images/login/login_icon_name.png'
import passWord from 'Assets/images/login/login_icon_password.png'
import { userLogin } from 'Global/action'
// import storage from 'Utils/storage'
import * as urls from 'Global/urls'

class Login extends Component {
  static defaultProps = {
    userInfo: {},
  }

  constructor(props) {
    super(props)
    this.state = {
      userName: '',
      userPwd: ''
    }
    let methods = ['getEmail', 'getPwd', 'login']
    methods.map((item) => {
      this[item] = this[item].bind(this)
    })
  }

  componentDidMount() {
    // const userInfo = storage.get('userInfo')
    const { userInfo, dispatch } = this.props
    if (userInfo && userInfo.ticket) {
      dispatch(replace(urls.HOME))
    }
  }

  // componentWillReceiveProps(next) {
  //   let userInfo = next.userInfo
  //   if (userInfo.ticket) {
  //     storage.set('userInfo', userInfo)
  //     // location.href = urls.HOME
  //   }
  // }
  render() {
    return (
      <div className={styles['login-body']}>
        <div className={styles['user-login-wrapper']}>
          <div className={styles['login-left']}>
            <img
              src={loginLeft}
              className={styles['login-left-img']}
            />
          </div>
          <div className={styles['layout-right']}>
            <div className={styles['login-title']}>
              <img src={title} />
            </div>
            <h2>金诚产业管理系统</h2>
            <div
              className={styles['box-input']}
            >
              <div className={styles['input-name']}>
                <img
                  src={loginName}
                />
              </div>
              <Input
                type='text'
                placeholder='请输入账号'
                onChange={this.getEmail}
              />
            </div>
            <div className={styles['box-input']}>
              <div className={styles['input-name']}>
                <img
                  src={passWord}
                />
              </div>
              <Input
                type='password'
                placeholder='请输入密码'
                onChange={this.getPwd}
                onPressEnter={this.login}
              />
            </div>
            <Button
              className={styles['box-button']}
              loading={this.props.showButtonSpin}
              disabled={this.props.showButtonSpin}
              onClick={this.login}
            >登&nbsp;&nbsp;录
            </Button>
          </div>
        </div>
      </div>
    )
  }

  getEmail(e) {
    this.setState({
      userName: e.target.value
    })
  }

  getPwd(e) {
    this.setState({
      userPwd: e.target.value
    })
  }

  login() {
    let userName = this.state.userName
    let userPwd = this.state.userPwd
    if (userName === '') {
      message.error('请输入账号')
      return
    }

    if (userPwd === '') {
      message.error('请输入密码')
      return
    }

    let userInfoFormData = new FormData()
    userInfoFormData.append('userName', userName)
    userInfoFormData.append('userPwd', userPwd)
    this.props.dispatch(userLogin(userInfoFormData))
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.common.userInfo,
    showButtonSpin: state.common.showButtonSpin
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
