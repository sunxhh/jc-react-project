/**
 * author yanchong
 *
 * This is dicionary list components
 */

import React, { Component } from 'react'
import { Form, Table, Input, Button, Tree, Popconfirm, message, Icon, Switch, Popover, Card } from 'antd'
import { connect } from 'react-redux'

import * as actions from './reduck'
import * as comActions from '../../../global/action'
import AddDictionary from './AddDictionary'
import EditDictionary from './EditDictionary'
import DetailDictionary from './DetailDictionary'
import AddType from './AddTypeModal'
import EditType from './EditTypeModal'
import styles from './style.less'

const { Item: FormItem } = Form
const { Search } = Input

class DictionaryList extends Component {
  _cashColumns = [{
    title: '序号',
    dataIndex: 'rowNo',
    key: 'rowNo',
    width: 80,
    fixed: 'left',
    render: (text, record, index) => {
      const { pageSize, current } = this.props.pagination
      return (
        <span>{
          pageSize *
          current +
          (index + 1) -
          pageSize
        }
        </span>
      )
    }
  }, {
    title: '项目名',
    dataIndex: 'codeName',
    key: 'codeName',
    width: 140,
    fixed: 'left',
    render: (text) => {
      return (
        <Popover
          content = {<div className={styles['pop']}>{text}</div>}
          title = '项目名'
        >
          <span>{text && text.length > 6 ? `${text.substring(0, 6)}...` : text}</span>
        </Popover>)
    },
  }, {
    title: '项目值',
    dataIndex: 'codeValue',
    key: 'codeValue',
    width: 140,
    render: (text) => {
      return (
        <Popover
          content = {<div className={styles['pop']}>{text}</div>}
          title = '项目值'
        >
          <span>{text && text.length > 6 ? `${text.substring(0, 6)}...` : text}</span>
        </Popover>)
    },
  }, {
    title: '简拼',
    dataIndex: 'codePy',
    key: 'codePy',
    width: 100,
    render: (text) => {
      return (
        <Popover
          content = {<div className={styles['pop']}>{text}</div>}
          title = '项目值'
        >
          <span>{text && text.length > 6 ? `${text.substring(0, 6)}...` : text}</span>
        </Popover>)
    },
  }, {
    title: '排序',
    dataIndex: 'orders',
    key: 'orders',
    width: 80,
  }, {
    title: '是否有效',
    dataIndex: 'isAvailable',
    key: 'isAvailable',
    width: 100,
    render: (text, row) => {
      return (<Switch
        checked = {Number(row.isAvailable) === 1}
        checkedChildren = '有效'
        unCheckedChildren = '无效'
        onChange={(checkedValue) => this._heandleIsAvailable(row.uuid, checkedValue)}
      />)
    }
  }, {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    render: (text) => {
      return (
        <Popover
          content = {<div className={styles['pop']}>{text}</div>}
          title = '备注'
        >
          <span>{text && text.length > 15 ? `${text.substring(0, 10)}...` : text}</span>
        </Popover>)
    }
  }, {
    title: '操作',
    dataIndex: 'option',
    key: 'option',
    width: 140,
    fixed: 'right',
    render: (text, row) => {
      return (
        <span>
          <a
            href='javascript:void(0);'
            onClick={() => this._showDetailDictionary(row.uuid)}
          >查看
          </a>
          <span className='vertical-line'>|</span>
          <a
            href='javascript:void(0);'
            onClick={() => this._showEditDictionary(row.uuid)}
          >编辑
          </a>
          <span className='vertical-line'>|</span>
          <Popconfirm
            title={`确定要删除（${row.codeName}）吗?`}
            onConfirm={() => this._heandleDel(row.uuid)}
            okText='确定'
            cancelText='取消'
          >
            <a href='javascript:void(0);'>删除</a>
          </Popconfirm>
        </span>)
    }
  }]

  // 设置 props 默认值
  static defaultProps = {
    list: [],
    typeNo: '',
    uuid: '',
    typeName: '',
    pagination: {
      current: 1,
      total: 0,
      pageSize: 20,
    },
    loading: true,
    treeList: [],
    showAddModal: false,
    showEditModal: false,
    showDetailModal: false,
    showAddTypeModal: false,
    showEditTypeModal: false,
    detail: {},
    spinning: true,
    okLoading: false,
    comDisabled: false,
  };

  // 初始化表格数据
  componentDidMount = () => {
    this.props.dispatch(actions.getTreeList())
  }

  componentWillUnmount = () => {
    this.props.dispatch(actions.switchTypeNoAction({
      typeNo: '',
      uuid: '',
      typeName: '',
    }))
    this.props.dispatch(actions.getListAction({
      list: [],
      pagination: {},
    }))
  }

  // 获取查询条件里面的 value 值
  _getQueryParameter = (page = this.props.pagination.current, typeNo = this.props.typeNo) => {
    return { ...this.props.form.getFieldsValue(), typeNo: typeNo, currentPage: page }
  }

  // 发起列表查询的 ACTION
  _handleAction = (page, typeNo) => {
    const { dispatch } = this.props
    const arg = this._getQueryParameter(page, typeNo)
    dispatch(actions.getList(arg))
  }

  // 点击查询按钮时，根据参数获取表格数据
  _handleSubmit = (e) => {
    if (this.props.typeNo === '') {
      message.error('请选择分类树')
      return
    }
    this._handleAction(1, this.props.typeNo)
  }

  // 点击分页时获取表格数据
  _handlePagination = (page) => {
    if (this.props.typeNo === '') {
      message.error('请选择分类树')
      return
    }
    this._handleAction(page, this.props.typeNo)
  }

  // 添加 modal 的props
  _handleAddProps = () => {
    return {
      showAddModal: this.props.showAddModal,
      defaultValue: this._getQueryParameter(),
      dispatch: this.props.dispatch,
      okLoading: this.props.okLoading,
    }
  }

  // 点击添加按钮
  _showAddDictionary = () => {
    const { dispatch } = this.props
    if (this.props.typeNo === '') {
      dispatch(comActions.switchDisabledAction(true))
      message.error('请选择分类树', 3, () => dispatch(comActions.switchDisabledAction(false)))
      return
    }
    dispatch(actions.showAddModalAction(true))
  }

  // 编辑的 props
  _handleEditProps = () => {
    return {
      showEditModal: this.props.showEditModal,
      dispatch: this.props.dispatch,
      detail: this.props.detail,
      defaultValue: this._getQueryParameter(),
      okLoading: this.props.okLoading,
    }
  }

  // 编辑的 modal 初始化
  _showEditDictionary = (uuid) => {
    const { dispatch } = this.props
    dispatch(actions.showEditModalAction(true))
    dispatch(actions.detail({ 'uuid': uuid }))
  }

  // 查看详情的props
  _handleDetailProps = () => {
    return {
      showDetailModal: this.props.showDetailModal,
      dispatch: this.props.dispatch,
      detail: this.props.detail,
    }
  }

  // 点击查看详情。
  _showDetailDictionary = (uuid) => {
    const { dispatch } = this.props
    dispatch(actions.showDetailModalAction(true))
    dispatch(actions.detail({ 'uuid': uuid }))
  }

  // 树的一个递归。
  _renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <Tree.TreeNode
            title={`${item.typeName}-(${item.typeNo})`}
            key={item.typeNo}
            data-id={item.uuid}
          >
            { item.hasChild ? this._renderTreeNodes(item.children) : null }
          </Tree.TreeNode>
        )
      }
      return (<Tree.TreeNode
        title={`${item.typeName}-(${item.typeNo})`}
        key={item.typeNo}
        data-id={item.uuid}
      />)
    })
  }

  // 点击左边树结构
  _clickTree = (key, e) => {
    if (e.selected) {
      this.props.dispatch(actions.switchTypeNoAction({
        typeNo: key[0],
        uuid: e.selectedNodes[0].props['data-id'],
        typeName: e.selectedNodes[0].props['title'],
      }))
      this._handleAction(1, key[0])
      return
    }

    this.props.dispatch(actions.switchTypeNoAction({
      typeNo: '',
      uuid: '',
      typeName: '',
    }))
    this.props.dispatch(actions.getListAction({
      list: [],
      pagination: {},
    }))
  }

  // 删除
  _heandleDel = (uuid) => {
    const length = this.props.list.length
    if (length > 1) {
      this.props.dispatch(actions.del({ 'uuid': uuid }, this._getQueryParameter()))
    } else if (length === 1) {
      let page = Number(this.props.pagination.current)
      const current = page > 1 ? Number(this.props.pagination.current) - 1 : 1
      this.props.dispatch(actions.del({ 'uuid': uuid }, this._getQueryParameter(current)))
    }
  }

  // 置为无效或者有效
  _heandleIsAvailable = (uuid, boolean) => {
    let isAvailable = 0
    boolean && (isAvailable = 1)
    this.props.dispatch(actions.updAvailable({ 'uuid': uuid, 'isAvailable': isAvailable }, this._getQueryParameter()))
  }

  // 删除树节点
  _delTree = () => {
    if (this.props.uuid === '') {
      message.error('请选择分类树')
      return
    }
    if (this.props.list.length > 0) {
      message.error('该分类下有数据，请先将分类下数据删除')
      return
    }
    this.props.dispatch(actions.delType({ 'uuid': this.props.uuid }))
  }

  // 添加类型（树节点）
  _addTree = () => {
    this.props.dispatch(actions.showAddTypeModalAction(true))
  }

  // 编辑类型 （树节点）
  _updTree = () => {
    if (this.props.uuid === '') {
      message.error('请选择分类树')
      return
    }
    this.props.dispatch(actions.showEditTypeModalAction(true))
  }

  // 组件 jsx 的编写
  render() {
    const { getFieldDecorator } = this.props.form
    const finalActions = [
      <Icon key='plus' type='plus' onClick={this._addTree} />
    ]
    if (this.props.uuid) {
      finalActions.push(
        <Icon key='edit' type='edit' onClick={this._updTree} />,
        // <Popconfirm
        // key='minus'
        // title={`确定要删除${this.props.typeName && `（${this.props.typeName}）`}吗?`}
        // onConfirm={this._delTree}
        // okText='确定'
        // cancelText='取消'
        // >
        // <Icon type='minus' />
        // </Popconfirm>
      )
    }
    return (
      <div className={styles['common-table']}>
        <Card
          loading={this.props.spinning}
          title='数字字典'
          className={styles['left-tree']}
          actions={finalActions}
        >
          <Tree
            showLine
            onSelect={this._clickTree}
          >
            {this._renderTreeNodes(this.props.treeList)}
          </Tree>
        </Card>
        <div className={styles['right-table']}>
          <div className={styles['search']}>
            <Form
              layout='inline'
            >
              <FormItem className={styles['search-form-item']}>
                {getFieldDecorator('searchParam')(
                  <Search placeholder='请输入查询关键字' onSearch={this._handleSubmit} enterButton />,
                )}
              </FormItem>
              <FormItem
                className={styles['search-form-item']}
              >
                <Button
                  type='primary'
                  onClick={this._showAddDictionary}
                  disabled = {this.props.comDisabled}
                >新增
                </Button>
              </FormItem>
            </Form>
          </div>
          <AddDictionary {...this._handleAddProps()} />
          <EditDictionary {...this._handleEditProps()} />
          <DetailDictionary {...this._handleDetailProps()} />
          <AddType
            typeNo = {this.props.typeNo}
            typeName = {this.props.typeName}
            okLoading = {this.props.okLoading}
            showAddTypeModal = {this.props.showAddTypeModal}
            dispatch = {this.props.dispatch}
          />
          <EditType
            uuid = {this.props.uuid}
            typeName = {this.props.typeName}
            typeNo = {this.props.typeNo}
            okLoading = {this.props.okLoading}
            showEditTypeModal = {this.props.showEditTypeModal}
            dispatch = {this.props.dispatch}
          />
          <Table
            columns = {this._cashColumns}
            rowKey = 'uuid'
            loading = {this.props.loading}
            dataSource = {this.props.list}
            scroll = {{ x: 1000 }}
            pagination = {{ ...this.props.pagination, onChange: this._handlePagination }}
          />
        </div>
      </div>)
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.dictionary.list,
    pagination: state.dictionary.pagination,
    loading: state.dictionary.loading,
    treeList: state.dictionary.treeList,
    showAddModal: state.dictionary.showAddModal,
    showEditModal: state.dictionary.showEditModal,
    showDetailModal: state.dictionary.showDetailModal,
    detail: state.dictionary.detail,
    spinning: state.common.showListSpin,
    typeNo: state.dictionary.typeNo,
    typeName: state.dictionary.typeName,
    uuid: state.dictionary.uuid,
    showAddTypeModal: state.dictionary.showAddTypeModal,
    showEditTypeModal: state.dictionary.showEditTypeModal,
    okLoading: state.dictionary.okLoading,
    comDisabled: state.common.comDisabled,
  }
}
const mapDispatchToProps = (dispatch) => ({
  dispatch,
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(DictionaryList))
