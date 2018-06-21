/**
 * Created by yiming on 2017/6/20.
 */
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'antd'
import * as urls from '../../global/urls'
import classNames from 'classnames'
import storage from 'Utils/storage'
import { connect } from 'react-redux'
import { isEmpty } from '../../utils/lang'
import menuCodes from '../../global/menuCodes'

const SubMenu = Menu.SubMenu
const MenuItem = Menu.Item

class MamsMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: 'inline',
      openKeys: storage.get('openKeys') || [],
    }
  }

  // 获取根节点menuKey
  _getRootSubmenuKeys = () => {
    const arr = []
    for (let menuCode of menuCodes) {
      arr.push(menuCode.menuKey)
    }
    return arr
  }

  onOpenChange = (openKeys) => {
    const rootSubmenuKeys = this._getRootSubmenuKeys()
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1)
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys }, () => {
        storage.set('openKeys', openKeys)
      })
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      }, () => {
        storage.set('openKeys', [latestOpenKey])
      })
    }
  }

  getAncestorKeys = (key) => {
    const map = {
      mall: ['classify', 'center'],
      'student-centre': ['edu'],
      'edu-course': ['edu'],
    }
    return map[key] || []
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

  componentWillReceiveProps(nextProps) {
    this.setState({
      mode: nextProps.mode,
    })
  }

  componentDidMount() {
    window.requestAnimationFrame(() => {
      const selector = document.querySelector('#jc-sub-menu')
      if (selector) {
        selector.scrollTop = this.props.menuScrollTop
      }
    })
    // setTimeout(() => {
      
    // })
  }

  _renderMenuItem = (menuTreeList, baseData) => {
    if (isEmpty(menuTreeList.filter(item => item.menuType + '' === '1'))) {
      return
    }
    return menuTreeList.map(item => {
      const menuInfos = (baseData || menuCodes).filter(menuCode => item.menuUrl === menuCode.menuUrl || item.menuUrl === menuCode.menuKey)
      const menuInfo = menuInfos.length > 0 ? menuInfos[0] : {}
      if (item.children && !isEmpty(item.children) && menuInfo && !isEmpty(menuInfo)) {
        const menus = item.children.filter(menuBean => menuBean.menuType + '' === '1')
        if (menus && !isEmpty(menus)) {
          return (
            <SubMenu
              key={menuInfo.menuKey}
              title={<span><span>{item.menuName}</span></span>}
            >
              {this._renderMenuItem(item.children, menuInfo.children)}
            </SubMenu>
          )
        } else {
          return (
            <MenuItem
              key={menuInfo.menuKey}
              className={this.getMenuItemClass(menuInfo.menuUrl)}
            >
              <Link to={menuInfo.menuUrl}>
                <span>{item.menuName}</span>
              </Link>
            </MenuItem>
          )
        }
      }
      return null
    })
  }

  render() {
    const { mode, selectedMenu, subMenus, selectedKeys } = this.props
    const config = !mode ? { openKeys: this.state.openKeys } : {}

    const menuInfos = menuCodes.filter(menuCode => selectedKeys[0] === menuCode.menuUrl || selectedKeys[0] === menuCode.menuKey)
    const menuInfo = menuInfos.length > 0 ? menuInfos[0] : {}

    return (
      <Menu
        id='jc-sub-menu'
        mode='inline'
        selectedKeys={[selectedMenu]}
        style={{ border: 'none', overflow: 'auto', height: 'calc(100% - 64px)' }}
        {...config}
        onOpenChange={this.onOpenChange}
        inlineCollapsed={mode}
      >
        {this._renderMenuItem(subMenus, menuInfo.children)}
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
