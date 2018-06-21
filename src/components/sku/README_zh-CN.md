---
title: SKU
subtitle: 规格选择器
path: components/sku
group: 业务组件
---

## SKU 规格选择器

这是一个规格选择

### 使用场景

创建有多种规格的商品、服务的编辑页面


### API

| 参数 | 说明 | 类型 | 默认值 | 备选值 |
|------|------|------|--------|--------|
| value | 当前选中的sku列表 | array | `[]` |  |
| maxSize | 最大规格名称数 | number | `3` |  |
| skuTree | 可选的规格列表 | array | `[]` |  |
| optionValue | 自定义sku的id的key值 | string | `'id'` |  |
| optionText | 自定义sku的文案的key值 | string | `'text'` |  |
| childOptionValue | 自定义sku子节点的id的key值 | string | `'id'` |  |
| childOptionText | 自定义sku子节点的文案的key值 | string | `'text'` |  |
| leafOptionValue | 自定义sku叶子的key值 | string | `'leaf'` |  |
| onFetchGroup | 异步获取可选的规格列表，如“颜色”、“尺寸” | function | `Promise` |  |
| onFetchSKU | 异步获取单个规格可选的值，如“红色”、“蓝色” | function | `Promise` |  |
| onChange | 当sku发生改变时的回调，返回值为sku当前value | function | `noop` |  |
| onReplaceChange | 当sku子节点发生替换时的回调，返回值为（old, new） | function | `noop` |  |
| editable | 控制组件的可编辑状态，bool或object(groupEditable, containerAddable, containerDeleteable, containerReplaceable) | bool \| object | `true` |  |

#### 工具方法

为了更方便操作规格数据，SKU组件提供了一些工具方法

#### SKU.flatten(sku, items, options)

通过计算笛卡尔积，将树形的value变成扁平的数组

| 参数 | 说明 | 类型 | 默认值 | 备选值 |
|------|------|------|--------|--------|
| sku | 当前选中规格的value | array | `[]` |  |
| items | 当前已存在的数据 | array | `[]` |  |
| options | 可配置参数 | object | `{}` | `optionValue: 'id', optionText: 'text', childOptionValue: 'id', childOptionText: 'text', leafOptionValue: 'leaf'` |
