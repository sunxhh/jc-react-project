## 技术栈

**react** + **redux** + **react-router-dom** + **antd**

[eslint 规则](http://git.dx-groups.com/frontend/jc-industry-admin/blob/starter/.eslintrc.js)
[stylelint 规则](http://git.dx-groups.com/frontend/jc-industry-admin/blob/starter/.stylelintrc)

## 日志

项目中重写了 `console.log` 方法，在日志中进行拦截，开启的方法很简单，在浏览器的控制台中输入：

```bash
localStorage.log = true
```

## Mock

Mock 工具现在可以使用针对小幺鸡的自动化 mock 工具 [xiaoyaoji-mock-server](https://github.com/alcat2008/xiaoyaoji-mock-server)

执行 `npm run mock` 命令后，将在本地 `5000` 端口监听请求，具体使用方法请参考文档

## 模块规范

新的模块统一在 `modules` 中维护，默认会有以下文件

```
.
├── apis.js                     # 该模块请求的 api 地址
├── index.js                    # 模块入口文件，做路由分割用
├── menu.js                     # 模块页面菜单及权限配置文件 最终信息汇总至 ‘src/global/menuCodes.js’ 只有一个
├── routes.js                   # 模块路由配置文件，最终信息汇总至 ‘src/routes.js’ 只有一个
└── module.js                   # 模块化配置文件，指定 state 等信息，只有一个
```

### `arthur` 模式

每个子模块中均有个一 `module.js` 文件，该文件的基本格式如下：

```javascript
// ===========================> Action Types <=========================== //

export default {
  namespace: 'page',

  state: {
    data: 'old'
  },

  actions: {
    getCheckList(arg) {
      return dispatch => {
        dispatch({
          type: GET_PAGE_LIST,
          payload: 'new'
        })
      }
    }
  },

  reducers: {
    [GET_PAGE_LIST]: (state, action) => ({
      ...state,
      data: action.payload,
    })
  },

  children: [

  ]
}

```

参考 dva 的写法，相比之前采用的 reduck 模式，项目/数据 结构更为清晰，并且减少了冗余代码。

### 菜单配置

每个子模块中均有个一 `menu.js` 文件，该文件的基本格式如下：

```javascript

// 以基础模块为例
import * as urls from 'Global/urls'

export default {
  menu: '基础模块',                // 导航名称
  menuKey: 'base_module',        // 导航键值（保证一定是唯一的）
  menuIcon: 'book',              // 导航Icon
  menuUrl: 'base_module',        // 导航Url（有子菜单时保证唯一）
  children:[                     // children属性不能与buttons属性同时存在
    {
      menu: '组织管理',           // 二级导航名称
      menuKey: 'org_manage',     // 二级导航键值（保证一定是唯一的）
      menuIcon: 'credit-card',   // 二级导航Icon
      menuUrl: urls.ORG_MANAGE,  // 二级导航Url
      buttons: [                 // 页面按钮权限 页面代码中使用key值判断当前人员是否有权限
        {
          name: '新增',
          key: 'add'
        },
        {
          name: '编辑',
          key: 'edit'
        },
        {
          name: '删除',
          key: 'delete'
        },
        {                       // 至少要应配置查看权限
          name: '查看',
          key: 'check'
        }
      ]
    },
    // ...
  ],
}
```

建议参考 `src/modules/SupplyChain/menu.js` 的写法，减少冗余。

### 路由配置

每个子模块中均有个一 `routes.js` 文件，该文件的基本格式如下：

```javascript

// 以教育模块为例
import * as urls from 'Global/urls'
import EduModule from 'bundle-loader?lazy!../Edu' // 异步懒加载模块
export default [
  {
    path: urls.CLASS_ROOM_MANAGE,       // url地址
    exact: true,                        // 是否为严格匹配
    baseComponent: EduModule,           // 模块通过懒加载处理时使用
    breadcrumbName: '教室设置',          // 面包屑（导航名称）
    parentPath: urls.HOME               // 面包屑上一级路径
  },
  // ...
]
```

实现路由代码参考 `src/routes.js`

建议参考 `src/modules/SupplyChain/routes.js` 的写法，一目了然，减少代码量的同时增强了可维护性，

## 命名规范

- 目录命名

  有复数结构时，要采用复数命名法
  例： actions、reducers

- 文件命名

  命名尽量简洁，若是模块的入口文件，统一为 `index.js`；若是样式，为了模块化后的名字的一致性，直接用所在模块的名字，例： user 模块的样式文件命名为 `user.less`
  不必在文件名带有模块属性，例如： actions 下的 user 直接定义为 `user.js`，而不是 `userAction.js`

- ClassName 命名

  ClassName 的命名应该尽量精短、明确，必须以字母开头命名，且全部字母为小写，单词之间统一使用下划线 “_” 连接

  ```html
  <div class="modulename">
    <div class="modulename_info">
      <div class="modulename_son"></div>
      <div class="modulename_son"></div>
      ...
    </div>
  </div>
  ```

## 引用常用资源

现在在 webpack 配置了 alias 方便引用资源，举个例子当你在某个视图组件中需要引用公共组件，不管你与那个组件的相对路径是怎样的，可以直接 `import AddButton from 'Components/AddButton'`

目前可以这样引用的有：

- Utils: 对应 'src/utils/'
- Components: 对应 'src/components/',
- Assets: 对应 'src/assets/',
- Global: 对应 'src/global/'
- Modules: 对应 'src/modules/'

## 通用组件或方法

### 面包屑

面包屑的基础是路由配置中的 path，如果当前路径不是根据参数动态匹配的路径，你需要在路由配置中增加 breadcrumbName。
如："/crawler"、"/crawler/crawlerDetail/:id/addCrawler" 需要配置 breadcrumbName，"/crawler/crawlerDetail/:id" 不需要做这个配置。

当遇到根据参数匹配的路径时，需要在对应的组件中使用 alterBreadItemName 方法，传入要改变的文字（如相应视频的名字），其中 alterBreadItemName 在 utils 目录下

### fetch 使用

在项目开发中，发送请求常常伴随 loading 效果处理，项目中通常使用 fetch、fetchMaternity 等，针对普遍使用场景将 loading 的效果相关代码封装到fetch等中。

将 loading 的效果分为三种类型：
- 全局 loading(SHOW_SPIN) 应用场景:详情、编辑页面等
- 按钮 loading(SHOW_BUTTON_SPIN) 应用场景：表单页面，保存提交按钮的 loading 效果
- 列表 loading(SHOW_LIST_SPIN )应用场景：列表页面如 Table 等组件的加载效果

ps：需保证当前页面 loading 类型只能使用一次

fetch 使用方式：

```javascript

import fetchData from 'Utils/fetch'

// 1. 不使用 fetch 封装的处理 loading（如果需要自定义 loading 只能在 reduck 单独处理）
fetchData(api, args)

// 2. 使用 fetch 封装的 loading 代码
// dispatch => redux dispatch
// SHOW_SPIN、SHOW_BUTTON_SPIN、SHOW_LIST_SPIN
fetchData(dispatch, SHOW_LIST_SPIN)(api, args)
```

## 列表页面

典型的列表页面包含一下三个部分：

- 搜索项 `filter`
- 列表内容 `list`
- 分页 `page`

根据三者的数据流向，可以生成一些通用的模板，方便大家实现列表页面，具体规则如下：

### `module.js`

```javascript
import { createAction } from 'redux-actions'
import { fetchSupplyChain as fetchData } from 'Utils/fetch'
import { SHOW_SPIN, SHOW_LIST_SPIN } from 'Global/action'
import { ReduckHelper } from 'Utils/helper'
import { message } from 'antd'

// ===========================> Action Types <=========================== //

const GET_CHECK_LIST = 'spa/SupplyChain/depotStock/GET_CHECK_LIST'  // 库存查询


export default {
  namespace: 'page',

  state: {
    ...ReduckHelper.genListState('check', { // 注入除 page 以外的参数
      skuNo: '',
      goodsName: '',
      // ...
    })
  },

  actions: {
    getCheckList(arg) {
      return ReduckHelper.genListAction(arg, fetchData, apis.depot.stock.check, GET_CHECK_LIST)
    }
  },

  reducers: {
    [GET_PAGE_LIST]: (state, action) => ReduckHelper.resolveListState('check', state, action.payload)
  },

  children: [

  ]
}
```

### 列表页

```javascript
import React, { Component } from 'react'
import { connect } from 'arthur'
import { Table, Button } from 'antd'

import * as urls from 'Global/urls'
import { isEmpty } from 'Utils/lang'
import { genPlanColumn, genSelectColumn, genPagination, unshiftIndexColumn } from 'Utils/helper'
import Filter from 'Components/Filter'

import { getCheckList } from '../reduck'

class StockCheck extends Component {
  componentWillMount() {
    const { dispatch, list, filter } = this.props
    isEmpty(list) && dispatch(getCheckList(filter))
  }

  _columns = [
    genPlanColumn('skuNo', 'SKU 编码'),
    genSelectColumn('status', '库存状态', StockStatus),
    {
      key: 'operation',
      title: '操作',
      render: (text, record) => {},
    },
  ]

  _handleSearch = searchData => {
    const { filter, dispatch } = this.props
    const finalFilter = { ...filter, ...searchData, currentPage: 1 }
    dispatch(getCheckList(finalFilter))
  }

  _handleChange = (pagination, filters, sorter) => {
    // console.log('params', pagination, filters, sorter)
    const { filter, dispatch, page } = this.props
    const { current, pageSize } = pagination
    const finalFilter = { ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize }
    dispatch(getCheckList(finalFilter))
  }

  _genFilterFields = () => {
    const { filter } = this.props
    const fields = [
      {
        key: 'skuNo',
        label: 'SKU 编码',
        initialValue: filter.skuNo,
        type: 'Input',
      }, {
        key: 'goodsCatgNo',
        label: '所属分类',
        initialValue: filter.goodsCatgNo,
        element: (...)
      }, {
        key: 'status',
        label: '库存状态',
        initialValue: filter.status || '',
        type: 'Select',
        content: StockStatus
      }
    ]
    return fields
  }

  render() {
    const { showListSpin, list, page, orgLevel } = this.props
    const finalColumns = unshiftIndexColumn(this._columns, page, { // 根据需要插入序号
      fixed: 'left',
    })
    const fields = this._genFilterFields()
    const extraBtns = orgLevel === '2' ? [
      <Button key='export' type='primary' onClick={...}>导出</Button>
    ] : []
    const pagination = genPagination(page)

    return (
      <div>
        <Filter fields={fields} onSearch={this._handleSearch} extraBtns={extraBtns} />
        <Table
          // style={{ width: '100%' }}
          pagination={pagination}
          columns={finalColumns}
          onChange={this._handleChange}
          rowKey='skuNo'
          dataSource={list}
          loading={showListSpin}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const showListSpin = state['common.showListSpin']
  const checkProps = state[''supplyChain.depotStock'']
  return {
    showListSpin,
    list: checkProps.checkList,
    filter: checkProps.checkFilter,
    page: checkProps.checkPage,
  }
}

export default connect(['common.showListSpin', 'supplyChain.depotStock'], mapStateToProps)(StockCheck)

```

## 常见问题

- 列表页，filter 不统一，导致请求的结果有误，可以根据以下步骤自测

  改变搜索条件 => 查询 => 翻页 （数据对否，页码是否正确） => 改变 pageSize （数据对否，页码回到 1） => 查询  （数据对否，页码是否正确）

- 样式不统一，请参考 [交互规范](https://elephant-fe.github.io/guide/docs/ui/design.html)，
