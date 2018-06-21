/**
 * Created by yiming on 2017/6/20.
 */
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Icon } from 'antd'
import * as urls from 'Global/urls'
import classNames from 'classnames'
// import storage from 'Utils/storage'
import { connect } from 'react-redux'
import { isEmpty } from 'Utils/lang'
import menuCodes from 'Global/menuCodes'

// const SubMenu = Menu.SubMenu
const MenuItem = Menu.Item

class MamsMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: 'inline',
    }
  }

  _handleMenuChange = (e) => {
    this.props.onClickCallback(e.key)
  }

  getMenuItemClass = (str) => {
    const pathName = this.props.match.location.pathname
    if (str !== urls.HOME) {
      return classNames({
        'ant-menu-item-selected': pathName.indexOf(str) > -1,
      })
    }
    return classNames({
      'ant-menu-item-selected': pathName === str,
    })
  }

  _renderMenuItem = (menuTreeList, baseData) => {
    if (isEmpty(menuTreeList.filter(item => item.menuType + '' === '1'))) {
      return
    }
    return menuTreeList.map(item => {
      const menuInfos = (baseData || menuCodes).filter(menuCode => item.menuUrl === menuCode.menuUrl || item.menuUrl === menuCode.menuKey)
      const menuInfo = menuInfos.length > 0 ? menuInfos[0] : {}
      if (isEmpty(menuInfo)) {
        return null
      }
      return (
        <MenuItem
          key={menuInfo.menuUrl}
        >
          <Icon type={menuInfo.menuIcon} /><span>{item.menuName}</span>
        </MenuItem>
      )
    })
  }

  render() {
    return (
      <Menu
        style={{ border: 'none', height: '100%' }}
        theme='dark'
        selectedKeys={this.props.selectedKeys}
        onClick={this._handleMenuChange}
        inlineCollapsed={true}
      >
        <MenuItem
          key='mams_home'
        >
          <Link to='/'>
            <Icon type='home' /><span>首页</span>
          </Link>
        </MenuItem>
        {this._renderMenuItem(isEmpty(this.props.menuTreeList) ? [] : this.props.menuTreeList[0].children)}
      </Menu>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    menuTreeList: state.common.menuTreeList,
    menuScrollTop: state.router.menuScrollTop,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(MamsMenu)
