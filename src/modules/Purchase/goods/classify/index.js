import React, { Component } from 'react'
import { createAction } from 'redux-actions'
import { Form, Input, Tree, Icon, Row, Col, Select, Button, message, Card } from 'antd'
import { connect } from 'react-redux'
import * as actions from './reduck'
import styles from './style.less'
import { showModalForm } from '../../../../components/modal/ModalForm'
import { isEmpty } from '../../../../utils/lang'

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

    if (node.childGoodsCatgList) {
      if (node.childGoodsCatgList.some(item => item.goodsCatgNo === key)) {
        parentKey = node.goodsCatgNo
      } else if (getParentKey(key, node.childGoodsCatgList)) {
        parentKey = getParentKey(key, node.childGoodsCatgList)
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
      visible: false,
      showBtn: 'hidden',
      editShowBtn: 'hidden',
      selectedKey: '',
      selectedCatg: {}
    }
  }

  // 设置 props 默认值
  static defaultProps = {
    goodsCategoryDetail: {},
    editBtn: false,
  }

  // 激活编辑
  _isshow = () => {
    this.props.dispatch(createAction('SWITCH_EDIT_BTN')(true))
  }

  // 取消编辑
  _cancel = () => {
    this.props.dispatch(createAction('SWITCH_EDIT_BTN')(false))
    this.props.dispatch(actions.getTreeDetail({
      goodsCatgNo: this.props.goodsCategoryDetail.goodsCatgNo
    }))
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
      if (item.menuName && item.menuName.indexOf(value) > -1) {
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

  // 菜单数据
  componentDidMount = () => {
    this.props.dispatch(actions.getTreeList({ parentNo: '' }))
  }

  returnRes = res => {
    let _res = {
      goodsCatgNo: res.goodsCatgNo,
      goodsCatgName: res.goodsCatgName,
      goodsCatgStep: String(res.goodsCatgStep),
      parentCatgName: res.parentCatgName,
      sort: String(res.sort),
      status: res.status,
      descInfo: res.descInfo
    }

    if (this.state.selectedCatg.goodsCatgStep === 2) {
      _res = {
        ..._res,
        purchaserNo: res.purchaserNo,
        purchaserName: res.purchaserName
      }
    }
    return _res
  }

  selectedCatg = null
  getSelectedCatgByNo = (treeList, selectedKey) => {
    if (!treeList) {
      return
    }
    treeList.some((item, index) => {
      const bool = item.goodsCatgNo === selectedKey
      if (!bool) {
        this.getSelectedCatgByNo(item.childGoodsCatgList, selectedKey)
      } else {
        this.selectedCatg = item
      }
      return bool
    })
  }

  // 点击左侧菜单
  _clickTree = (selectedKeys, info) => {
    if (info.selected) {
      const selectedKey = selectedKeys[0]
      this.selectedCatg = null
      this.getSelectedCatgByNo(this.props.treeList, selectedKey)
      this.setState({
        selectedKey: selectedKey,
        selectedCatg: this.selectedCatg
      })
      this.props.dispatch(actions.getTreeDetail({ goodsCatgNo: selectedKey }))
        .then(res => {
          if (res) {
            this.props.form.setFieldsValue(this.returnRes(res))
          }
        })
    } else {
      this.setState({
        selectedKey: '',
        selectedCatg: {}
      })
    }
  }

  // 编辑提交
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.goodsCatgStep = values.goodsCatgStep ? values.goodsCatgStep : values.goodsCatgStep - 1
        this.props.dispatch(actions.modifyMenu({
          ...values
        })).then(res => {
          this.props.dispatch(actions.getTreeDetail({ goodsCatgNo: values.goodsCatgNo }))
            .then(res => {
              if (res) {
                this.props.form.setFieldsValue(this.returnRes(res))
              }
            })
        })
      }
    })
  }

  // 删除
  _handleCatgDelete = () => {
    this.props.dispatch(actions.deleteMenu({
      'goodsCatgNo': this.props.goodsCategoryDetail.goodsCatgNo
    }))
    this.props.form.resetFields()
    this.setState({
      selectedCatg: {}
    })
  }

  // 新增弹窗
  _handleCatgAdd = (detail) => {
    if (this.state.selectedCatg.goodsCatgStep === 3) {
      message.error('该三级分类下不能新增分类！')
      return
    } else {
      showModalForm({
        formItemLayout: {
          labelCol: { span: 5 },
          wrapperCol: { span: 16 }
        },
        title: '新增分类',
        fields: [
          {
            id: 'goodsCatgNo',
            props: {
              label: '分类编码'
            },
            options: {
              initialValue: '',
              rules: [{
                required: true,
                message: '请输入分类编码!'
              }, {
                pattern: /^\d+$/,
                message: '请输入数字!'
              }]
            },
            element: (
              <Input
                maxLength='50'
                placeholder='请输入分类编码'
              />
            )
          },
          {
            id: 'goodsCatgName',
            props: {
              label: '分类名称'
            },
            options: {
              initialValue: '',
              rules: [{
                required: true,
                message: '请输入分类名称!'
              }]
            },
            element: (
              <Input
                maxLength='50'
                placeholder='请输入分类名称'
              />
            )
          },
          {
            id: 'goodsCatgStep',
            props: {
              label: '分类等级'
            },
            options: {
              initialValue: this.state.selectedCatg.goodsCatgStep ? String(this.state.selectedCatg.goodsCatgStep + 1) : this.state.selectedCatg.goodsCatgStep === 0 ? '1' : '0',
              rules: [{
                required: true,
                message: '请选择分类等级!'
              }]
            },
            element: (
              <Select
                disabled={true}
                getPopupContainer={() => document.getElementById('goodsCatgStep')}
              >
                <Option value='0'>顶级</Option>
                <Option value='1'>一级</Option>
                <Option value='2'>二级</Option>
                <Option value='3'>三级</Option>
              </Select>
            )
          },
          {
            id: 'parentNo',
            props: {
              label: '上级分类'
            },
            options: {
              initialValue: detail.goodsCatgNo && detail.goodsCatgNo || ''
            },
            element: (
              <Select
                disabled={true}
                getPopupContainer={() => document.getElementById('parentNo')}
              >
                <Option value={detail.goodsCatgNo}>{detail.goodsCatgName}</Option>
              </Select>
            )
          },
          {
            id: 'sort',
            props: {
              label: '显示顺序',
            },
            options: {
              initialValue: '',
              rules: [{
                required: true,
                message: '请输入显示顺序!',
              }, {
                pattern: /^[1-9]\d*$/,
                message: '请输入1~99999的正整数!'
              }]
            },
            element: (
              <Input
                maxLength='5'
                placeholder='请输入显示顺序'
              />
            )
          },
          {
            id: 'status',
            props: {
              label: '有效性'
            },
            options: {
              initialValue: detail.status ? String(detail.status) : '1',
              rules: [{
                required: true,
                message: '请选择有效性!'
              }]
            },
            element: (
              <Select
                getPopupContainer={() => document.getElementById('modal-form')}
              >
                <Option value='0'>失效</Option>
                <Option value='1'>生效</Option>
              </Select>
            )
          },
          {
            id: 'purchaserNo',
            props: {
              label: '采购工号',
              style: {
                display: this.state.selectedCatg.goodsCatgStep !== 1 ? 'none' : 'block'
              }
            },
            options: {
              initialValue: '',
              rules: [{
                pattern: /^[0-9]\d*$/,
                message: '请输入0~99999的正整数!'
              }]
            },
            element: (
              <Input
                maxLength='20'
                placeholder='请输入采购工号'
              />
            )
          },
          {
            id: 'purchaserName',
            props: {
              label: '采购姓名',
              style: {
                display: this.state.selectedCatg.goodsCatgStep !== 1 ? 'none' : 'block'
              }
            },
            options: {
              initialValue: '',
            },
            element: (
              <Input
                maxLength='50'
                placeholder='请输入采购姓名'
              />
            )
          },
          {
            id: 'descInfo',
            props: {
              label: '分类描述'
            },
            options: {
              initialValue: ''
            },
            element: (
              <Input.TextArea
                placeholder='请输入分类描述'
                maxLength='500'
              />
            )
          }
        ],
        onOk: values => {
          const data = {
            ...values
          }
          data.sort = parseInt(data.sort)
          data.goodsCatgStep = parseInt(data.goodsCatgStep)
          return this.props.dispatch(actions.addMenu({
            ...data
          }))
        }
      })
    }
  }

  render() {
    const { searchValue, expandedKeys, autoExpandParent, selectedKey, selectedCatg } = this.state
    const { getFieldDecorator } = this.props.form
    const { treeList, goodsCategoryDetail, match, auths } = this.props
    const { path } = match
    const authState = (isEmpty(auths) || isEmpty(auths[path])) ? [] : auths[path]

    const finalActions = [
      <Icon
        key='plus'
        type='plus'
        title='新增分类'
        onClick={() => this._handleCatgAdd(selectedCatg)}
      />
    ]

    if (isEmpty(goodsCategoryDetail)) {
      <span>暂无数据</span>
    }

    const loop = data => data.map((item) => {
      const index = item.goodsCatgName && item.goodsCatgName.indexOf(searchValue)
      const beforeStr = item.goodsCatgName && item.goodsCatgName.substr(0, index)
      const afterStr = item.goodsCatgName && item.goodsCatgName.substr(index + searchValue.length)
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.goodsCatgName}</span>

      if (item.childGoodsCatgList && item.childGoodsCatgList.length > 0) {
        return (
          <TreeNode
            key={item.goodsCatgNo}
            goodsCatgName={item.goodsCatgName}
            goodsCatgNo={item.goodsCatgNo}
            goodsCatgStep={item.goodsCatgStep}
            parentNo={item.parentNo}
            title={title}
            selectable={true}
          >
            {loop(item.childGoodsCatgList)}
          </TreeNode>
        )
      }

      return (
        <TreeNode
          key={item.goodsCatgNo}
          goodsCatgName={item.goodsCatgName}
          goodsCatgNo={item.goodsCatgNo}
          goodsCatgStep={item.goodsCatgStep}
          parentNo={item.parentNo}
          title={title}
        />
      )
    })

    return (
      <div className={styles['common-table']}>
        <Card
          title='货物分类'
          style={{ width: '25%', float: 'left' }}
          actions={finalActions}
          loading={this.props.spinning}
        >
          <div>
            <Search
              style={{ marginBottom: 8 }}
              placeholder='请输入关键词'
              onChange={this._handleSearchChange}
            />
            <div className={styles['tree-wrap']}>
              <Tree
                showLine
                onExpand={this.onExpand}
                onSelect={this._clickTree}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onDragEnter={this._onDragEnter}
                selectedKeys={selectedKey ? [selectedKey] : []}
              >
                {
                  loop(treeList)
                }
              </Tree>
            </div>
          </div>
        </Card>
        <div className={styles['right-table']}>
          <div className={styles['out-wrap']}>
            <h3 className={styles['info-title']}>基础信息</h3>
            <div className={styles['detai-box']}>
              <Form onSubmit={this.handleSubmit}>
                <Row>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label={'分类编码'}
                    >
                      {getFieldDecorator('goodsCatgNo', {
                        rules: [{
                          required: true,
                          message: '请输入分类编码!' }, {
                          max: 50,
                          message: '请输入分类编码名称过长!'
                        }
                        ],
                      })(
                        <Input
                          maxLength='50'
                          disabled={true}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label={'分类名称'}
                    >
                      {getFieldDecorator('goodsCatgName', {
                        rules: [{
                          required: true,
                          message: '请输入分类名称!' }, {
                          max: 50,
                          message: '分类名称过长!'
                        }
                        ],
                      })(
                        <Input
                          maxLength='50'
                          disabled={!this.props.editBtn}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label={'分类等级'}
                    >
                      {getFieldDecorator('goodsCatgStep')(
                        <Select
                          disabled={true}
                        >
                          <Option value='0'>顶级</Option>
                          <Option value='1'>一级分类</Option>
                          <Option value='2'>二级分类</Option>
                          <Option value='3'>三级分类</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label={'上级分类'}
                    >
                      {getFieldDecorator('parentCatgName')(
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
                      {getFieldDecorator('sort', {
                        rules: [{
                          pattern: /^[1-9]\d*$/,
                          message: '请输入1~99999的正整数!'
                        }],
                      })(
                        <Input
                          maxLength='5'
                          disabled={!this.props.editBtn}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8} id={'selectedArea'}>
                    <FormItem
                      {...formItemLayout}
                      label={'有效性'}
                    >
                      {getFieldDecorator('status', {
                        initialValue: ''
                      })(
                        <Select
                          disabled={!this.props.editBtn}
                          getPopupContainer={() => document.getElementById('selectedArea')}
                        >
                          <Option value='1'>生效</Option>
                          <Option value='0'>失效</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  {
                    this.state.selectedCatg.goodsCatgStep === 2 ? (
                      <span>
                        <Col span={8}>
                          <FormItem
                            {...formItemLayout}
                            label={'采购工号'}
                          >
                            {getFieldDecorator('purchaserNo', {
                              rules: [{
                                pattern: /^[0-9]\d*$/,
                                message: '请输入0~99999的正整数!'
                              }]
                            })(
                              <Input
                                min={0}
                                maxLength='20'
                                disabled={!this.props.editBtn}
                              />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem
                            {...formItemLayout}
                            label={'采购姓名'}
                          >
                            {getFieldDecorator('purchaserName', {
                            })(
                              <Input
                                maxLength='20'
                                disabled={!this.props.editBtn}
                              />
                            )}
                          </FormItem>
                        </Col>
                      </span>
                    ) : null
                  }
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label={'分类描述'}
                    >
                      {getFieldDecorator('descInfo', {
                        initialValue: '',
                        rules: [{
                          max: 500,
                          message: '分类描述过长!'
                        }]
                      })(
                        <Input.TextArea
                          maxLength='500'
                          disabled={!this.props.editBtn}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>

                <Row>
                  <Col
                    span={24}
                    className={styles['button-center']}
                  >
                    <FormItem
                      className={styles['search-form-item']}
                    >
                      {authState.includes('edit') && !isEmpty(this.state.selectedCatg) && !this.props.editBtn && (
                        <Button
                          type='primary'
                          onClick={this._isshow}
                        >
                          编辑
                        </Button>)}
                      {!isEmpty(this.state.selectedCatg) && this.props.editBtn && (
                        <div>
                          <Button
                            type='primary'
                            htmlType='submit'
                          >
                            保存
                          </Button>
                          <Button
                            type='primary'
                            onClick={this._cancel}
                          >
                            取消
                          </Button>
                        </div>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </div>
      </div>)
  }
}

const mapStateToProps = (state) => {
  return {
    treeList: state.purchase.goods.classify.treeList,
    treeListArray: state.purchase.goods.classify.treeListArray,
    spinning: state.common.showListSpin,
    auths: state.common.auths,
    editBtn: state.purchase.goods.classify.editBtn,
    goodsCategoryDetail: state.purchase.goods.classify.goodsCategoryDetail,
  }
}
const mapDispatchToProps = (dispatch) => ({
  dispatch,
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(MenuManage))
