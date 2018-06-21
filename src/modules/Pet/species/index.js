import React, { Component } from 'react'
import { Form, Input, Tree, Icon, Row, Select, Button, Col, Card } from 'antd'
import { createAction } from 'redux-actions'
import { connect } from '@dx-groups/arthur'
import Module, { LEVEL_LIST } from './module'
import styles from './style.less'
import { showModalForm } from 'Components/modal/ModalForm'
import { isEmpty } from 'Utils/lang'

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

    if (node.childPetCatgList) {
      if (node.childPetCatgList.some(item => item.petCatgNo === key)) {
        parentKey = node.petCatgNo
      } else if (getParentKey(key, node.childPetCatgList)) {
        parentKey = getParentKey(key, node.childPetCatgList)
      }
    }
  }
  return parentKey
}

class PetSpecies extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchValue: '',
      currentKey: '1',
      treeList: [],
      editable: false,
      expandedKeys: ['1'],
      selectedKeys: ['1'],
      petCatgStep: '',
      currentName: '',
      node: null,
    }
  }

  // 激活编辑
  _isshow = () => {
    this.setState({
      editable: true
    })
  }

  // 取消编辑
  _cancel = () => {
    this.setState({
      editable: false
    })
    this.props.dispatch(Module.actions.getTreeDetail({
      petCatgNo: this.state.currentKey
    })).then(res => {
      if (res) {
        this.props.form.setFieldsValue(this.returnRes(res))
      }
    })
  }

  // 菜单数据
  componentDidMount = () => {
    this.props.dispatch(Module.actions.getLevelList({ petCatgNo: '0' }))
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.levelList !== this.props.levelList && (nextProps.levelList.length !== 0 || this.props.levelList.length !== 0)) || isEmpty(this.state.treeList)) {
      this.setState({
        treeList: nextProps.levelList
      })
    }
  }

  returnRes = res => {
    return {
      petCatgNo: res.petCatgNo,
      petCatgName: res.petCatgName,
      petCatgStep: String(res.petCatgStep),
      parentCatgName: res.parentCatgName || '宠物种类列表',
      sort: String(res.sort),
      status: res.status + '',
    }
  }

  // 点击左侧菜单
  _clickTree = (selectedKeys, info) => {
    if (info.selected) {
      const currentKey = selectedKeys[0]
      this.setState({
        currentKey,
        petCatgStep: info.node.props.petCatgStep,
        currentName: info.node.props.petCatgName,
        selectedKeys: [currentKey],
        node: info.node
      })
      if (currentKey === '1') {
        this.props.form.setFieldsValue({
          petCatgNo: '',
          petCatgName: '',
          petCatgStep: '',
          parentCatgName: '',
          sort: '',
          status: '',
        })
        return
      }
      this.props.dispatch(Module.actions.getTreeDetail({ petCatgNo: currentKey }))
        .then(res => {
          if (res) {
            this.props.form.setFieldsValue(this.returnRes(res))
          }
        })
    }
    this.setState({
      editable: false
    })
  }

  _recurve = (treeList, petCatgNo, petCatgName) => treeList.map(item => {
    if (petCatgNo === item.petCatgNo) {
      return {
        ...item,
        petCatgName: petCatgName
      }
    } else if (!isEmpty(item.childPetCatgList)) {
      return {
        ...item,
        childPetCatgList: this._recurve(item.childPetCatgList, petCatgNo, petCatgName)
      }
    }

    return item
  })

  // 编辑提交
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch(Module.actions.modifyCate({
          ...values
        })).then(res => {
          if (res) {
            this.setState({
              treeList: this._recurve(this.state.treeList, values.petCatgNo, values.petCatgName),
              editable: false
            })
            // this._handleSearch(this.state.searchValue)
            // this.props.dispatch(Module.actions.getTreeDetail({ petCatgNo: values.petCatgNo }))
            //   .then(res => {
            //     if (res) {
            //       this.props.form.setFieldsValue(this.returnRes(res))
            //       this.setState({
            //         editable: false
            //       })
            //     }
            //   })
          }
        })
      }
    })
  }

  // 新增弹窗
  _handleCatgAdd = (detail) => {
    const secondCateItems = this.state.currentKey !== '1' ? [{
      id: 'parentCatgName',
      props: {
        label: '上级分类',
      },
      options: {
        initialValue: this.state.currentName,
      },
      element: (
        <Input disabled />
      )
    }] : []
    showModalForm({
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      title: '新增分类',
      fields: [
        {
          id: 'parentCatgNo',
          props: {
            style: { display: 'none' }
          },
          options: {
            initialValue: this.state.currentKey === '1' ? '' : this.state.currentKey,
          },
          element: (
            <Input />
          )
        },
        {
          id: 'petCatgStep',
          props: {
            label: '分类级别'
          },
          options: {
            initialValue: this.state.currentKey === '1' ? '1' : '2'
          },
          element: (
            <Select
              disabled={true}
            >
              <Option value='1'>一级</Option>
              <Option value='2'>二级</Option>
            </Select>
          )
        },
        ...secondCateItems,
        {
          id: 'sort',
          props: {
            label: '分类序号',
          },
          options: {
            initialValue: '',
            rules: [{
              required: true,
              message: '请输入分类序号!',
            }, {
              pattern: /^[1-9]\d*$/,
              message: '请输入1~99999的正整数!'
            }]
          },
          element: (
            <Input
              maxLength='5'
              placeholder='请输入分类序号'
            />
          )
        },
        {
          id: 'petCatgName',
          props: {
            label: '分类名称'
          },
          options: {
            rules: [{
              required: true,
              message: '请输入分类名称!'
            }]
          },
          element: (
            <Input
              maxLength='15'
              placeholder='请输入分类名称'
            />
          )
        },
        {
          id: 'status',
          props: {
            label: '有效性'
          },
          options: {
            initialValue: '1',
            rules: [{
              required: true,
              message: '请选择有效性!'
            }]
          },
          element: (
            <Select>
              <Option value='1'>有效</Option>
              <Option value='0'>无效</Option>
            </Select>
          )
        },
      ],
      onOk: values => {
        const data = {
          ...values
        }
        data.sort = parseInt(data.sort)
        data.petCatgStep = parseInt(data.petCatgStep)
        if (data.petCatgStep === 1) {
          data.parentCatgNo = '0'
        }
        return this.props.dispatch(Module.actions.addCate(data))
      }
    })
  }

  _onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve()
        return
      }
      this.props.dispatch(Module.actions.getLevelList({ petCatgNo: treeNode.props.petCatgNo })).then(res => {
        resolve()
        if (res) {
          treeNode.props.dataRef.childPetCatgList = res.map(item => ({ ...item, petCatgStep: '2' }))
          // if (!res || isEmpty(res)) {
          //   treeNode.props.isLeaf = true
          // }
          this.setState({
            treeList: [...this.state.treeList],
            // expandedKeys: []
          })
        }
      })
    })
  }

  _handleSearchChange = (e) => {
    this.setState({
      searchValue: e.target.value
    })
  }

  _handleSearch = (value) => {
    if (value) {
      this.props.dispatch(Module.actions.getTreeList({ petCatgName: value })).then(res => {
        if (res) {
          if (res) {
            // const expandedKeys = (res[0].childPetCatgList || []).map((item) => {
            //   if (item.menuName && item.menuName.indexOf(value) > -1) {
            //     return getParentKey(item.key, this.props.treeList)
            //   }
            //   return null
            // }).filter((item, i, self) => item && self.indexOf(item) === i)
            this.props.dispatch(createAction(LEVEL_LIST)([]))
            this.setState({
              treeList: res || [],
              expandedKeys: ['1'],
              editable: false
            })
          }
        }
      })
    } else {
      this.props.dispatch(Module.actions.getLevelList({ petCatgNo: '0' }))
      this.setState({
        expandedKeys: ['1'],
        editable: false
      })
    }
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
    })
  }

  render() {
    const { currentKey, treeList, searchValue, editable, expandedKeys, petCatgStep, selectedKeys } = this.state
    const { getFieldDecorator } = this.props.form
    const { match, auths } = this.props
    const { path } = match
    const authState = (isEmpty(auths) || isEmpty(auths[path])) ? [] : auths[path]
    const treeDataSource = [{ petCatgNo: '1', petCatgName: '宠物分类列表', childPetCatgList: treeList, hasSon: (isEmpty(treeList) || !treeList) ? null : 1 }]

    const finalActions = [
      <Icon
        key='plus'
        type='plus'
        title='新增分类'
        onClick={() => this._handleCatgAdd()}
      />
    ]

    const loop = (data) => data.map((item) => {
      const { searchValue } = this.state
      const index = item.petCatgName && item.petCatgName.indexOf(searchValue)
      const beforeStr = item.petCatgName && item.petCatgName.substr(0, index)
      const afterStr = item.petCatgName && item.petCatgName.substr(index + searchValue.length)
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.petCatgName}</span>
      const extendsProps = searchValue ? {} : { isLeaf: item.hasSon !== 1 }
      if (item.childPetCatgList && item.childPetCatgList.length > 0) {
        return (
          <TreeNode
            key={item.petCatgNo}
            petCatgNo={item.petCatgNo}
            petCatgName={item.petCatgName}
            petCatgStep={item.petCatgStep ? '2' : '1'}
            title={title}
            dataRef={item}
            {...extendsProps}
          >
            {loop(item.childPetCatgList)}
          </TreeNode>
        )
      }

      return (
        <TreeNode
          key={item.petCatgNo}
          title={title}
          petCatgNo={item.petCatgNo}
          petCatgName={item.petCatgName}
          dataRef={item}
          petCatgStep={item.petCatgStep ? '2' : '1'}
          {...extendsProps}
        />
      )
    })

    return (
      <div className={styles['common-table']}>
        <Card
          title='宠物分类'
          style={{ width: '25%', float: 'left' }}
          actions={petCatgStep === '2' ? null : finalActions}
          loading={this.props.showListSpin}
        >
          <div>
            <Search
              style={{ marginBottom: 8 }}
              placeholder='请输入关键词'
              onSearch={this._handleSearch}
              onChange={this._handleSearchChange}
              enterButton
              value={searchValue}
            />
            <div className={styles['tree-wrap']}>
              {searchValue ? (
                <Tree
                  showLine
                  selectedKeys={selectedKeys}
                  onSelect={this._clickTree}
                  expandedKeys={expandedKeys}
                  onExpand={this.onExpand}
                >
                  {
                    loop(treeDataSource)
                  }
                </Tree>
              ) : (
                <Tree
                  showLine
                  onSelect={this._clickTree}
                  expandedKeys={expandedKeys}
                  loadData={this._onLoadData}
                  onExpand={this.onExpand}
                  selectedKeys={selectedKeys}
                >
                  {
                    loop(treeDataSource)
                  }
                </Tree>
              )}
            </div>
          </div>
        </Card>
        <div className={styles['right-table']}>
          {currentKey !== '1' && (
            <Card
              title='基础信息'
              extra={currentKey !== '1' && (
                <div>
                  {authState.includes('edit') && !editable && (
                    <Button
                      type='primary'
                      icon='edit'
                      onClick={this._isshow}
                    >
                        编辑
                    </Button>)}
                  {editable && (
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
                  <Col span={0}>
                    <FormItem
                      {...formItemLayout}
                    >
                      {getFieldDecorator('petCatgNo', {
                      })(
                        <Input />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label='分类级别'
                    >
                      {getFieldDecorator('petCatgStep', {
                      })(
                        <Select
                          disabled={true}
                        >
                          <Option value='1'>一级</Option>
                          <Option value='2'>二级</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label='分类编码'
                    >
                      {getFieldDecorator('petCatgNo', {
                        rules: [{
                          required: true,
                          message: '请输入分类编码!',
                        }],
                      })(
                        <Input
                          placeholder='请输入分类编码'
                          disabled={true}
                          maxLength='50'
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label='所属上级'
                    >
                      {getFieldDecorator('parentCatgName', {
                      })(
                        <Input
                          disabled={true}
                          maxLength='50'
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label='分类名称'
                    >
                      {getFieldDecorator('petCatgName', {
                        rules: [{
                          required: true,
                          message: '请输入分类名称!',
                        }],
                      })(
                        <Input
                          placeholder='请输入分类名称'
                          disabled={!editable}
                          maxLength='15'
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label='分类序号'
                    >
                      {getFieldDecorator('sort', {
                        rules: [{
                          required: true,
                          message: '请输入分类序号!',
                        }, {
                          pattern: /^[1-9]\d*$/,
                          message: '请输入1~99999的正整数!'
                        }],
                      })(
                        <Input
                          placeholder='请输入分类序号'
                          disabled={!editable}
                          maxLength='5'
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label='有效性'
                    >
                      {getFieldDecorator('status', {
                        rules: [{
                          required: true,
                          message: '请输入有效性!',
                        }],
                      })(
                        <Select
                          disabled={!editable}
                        >
                          <Option value='1'>有效</Option>
                          <Option value='0'>无效</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Card>
          )}
        </div>
      </div>)
  }
}

const mapStateToProps = (state) => {
  return {
    ...state['petModule.species'],
    auths: state['common.auths'],
    showListSpin: state['common.showListSpin'],
  }
}
export default connect(['common.showListSpin', 'common.auths', 'petModule.species'], mapStateToProps)(Form.create()(PetSpecies))
