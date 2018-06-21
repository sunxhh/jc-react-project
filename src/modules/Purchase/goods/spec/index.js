import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { Tree, Table, Button, Card, Icon, InputNumber, Radio, Alert, Input } from 'antd'

import { showModalForm } from 'Components/modal/ModalForm'
import { genPlanColumn } from 'Utils/helper'
import { isEmpty } from 'Utils/lang'
import { getSpecCatgList, addSpecCatg, updateSpecCatg, deleteSpecCatg, getSpecDetailList, addSpecDetail, updateSpecDetail, deleteSpecDetail, GET_SPEC_CATG_LIST } from './reduck'
import styles from './spec.less'

const TreeNode = Tree.TreeNode
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const Search = Input.Search

class GoodsSpec extends Component {
  constructor(props) {
    super(props)
    // initial state
    this.state = {
      selectedKey: '',
      selectedCatg: {},
      catg: [],
      pageNo: 1,
      pageSize: 15,
      searchValue: ''
    }
  }

  componentWillMount() {
    this.props.dispatch(getSpecCatgList({})).then(res => {
      if (res) {
        this.setState({
          catg: res
        })
      }
    })
  }

  componentWillUnmount() {
    this.props.dispatch(createAction(GET_SPEC_CATG_LIST)([]))
  }

  _handleDetailAddOrEdit = (detail) => {
    showModalForm({
      title: detail ? '编辑规格' : '新增规格',
      fields: [
        {
          id: 'specName',
          props: {
            label: '规格名称： ',
          },
          options: {
            initialValue: detail && detail.specName,
            rules: [{
              required: true,
              message: '请输入规格名称',
            }]
          }
        }, {
          id: 'sort',
          props: {
            label: '显示顺序： ',
          },
          options: {
            initialValue: detail && detail.sort,
            rules: [{
              required: true,
              message: '请输入显示顺序!',
            }, {
              pattern: /^[1-9]\d*$/,
              message: '请输入正整数!'
            }]
          },
          element: (
            <InputNumber
              style={{ width: '100%' }}
              precision={0}
              min={1}
              // placeholder='请输入成本'
            />
          )
        }
      ],
      onOk: values => {
        // onUpdate && onUpdate(values);
        if (detail) {
          return this.props.dispatch(updateSpecDetail({ ...detail, ...values }, this.state.selectedKey))
        }
        return this.props.dispatch(addSpecDetail(values, this.state.selectedKey))
      },
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 },
      }
    })
  }

  _handleDetailDelete = specNo => {
    return this.props.dispatch(deleteSpecDetail({ specNo }, this.state.selectedKey))
  }

  _columns = [
    { key: 'index', title: '序号', render: (text, record, index) => index + 1 },
    genPlanColumn('specName', '规格名称'),
    genPlanColumn('sort', '排序'),
    {
      key: 'operation',
      title: '操作',
      render: (text, record) => (
        <span>
          <a onClick={() => this._handleDetailAddOrEdit(record)}>编辑</a>
          {/* <Divider type='vertical' />
          <Popconfirm
            title={`确定要删除规格【${record.specName}】吗?`}
            onConfirm={() => this._handleDetailDelete(record.specNo)}
            okText='确定'
            cancelText='取消'
          >
            <a>删除</a>
          </Popconfirm> */}
        </span>
      )
    },
  ]

  _handleCatgSelect = (selectedKeys, info) => {
    if (info.selected) {
      const selectedKey = selectedKeys[0]
      this.props.dispatch(getSpecDetailList({ specCatgNo: selectedKey }))
      const selectedCatg = this.state.catg.find(item => item.specCatgNo === selectedKey)
      this.setState({
        selectedKey,
        selectedCatg
      })
    } else {
      this.setState({
        selectedKey: '',
        selectedCatg: {}
      })
    }
  }

  _handleCatgAddOrEdit = (selectedCatg) => {
    showModalForm({
      title: selectedCatg ? '编辑类别' : '新增类别',
      fields: [
        {
          id: 'specCatgName',
          props: {
            label: '类别名称： ',
          },
          options: {
            initialValue: selectedCatg && this.state.catg.filter(item => item.specCatgNo === selectedCatg.specCatgNo)[0].specCatgName,
            rules: [{
              required: true,
              message: '请输入类别名称',
            }]
          }
        }, {
          id: 'sort',
          props: {
            label: '显示顺序： ',
          },
          options: {
            initialValue: selectedCatg && this.state.catg.filter(item => item.specCatgNo === selectedCatg.specCatgNo)[0].sort,
            rules: [{
              required: true,
              message: '请输入显示顺序!',
            }, {
              pattern: /^[1-9]\d*$/,
              message: '请输入正整数!'
            }]
          },
          element: (
            <InputNumber
              style={{ width: '100%' }}
              precision={0}
              min={1}
              // placeholder='请输入成本'
            />
          )
        }
      ],
      onOk: values => {
        const { dispatch } = this.props
        if (selectedCatg) {
          return dispatch(updateSpecCatg({ ...selectedCatg, ...values }, () => {
            dispatch(getSpecCatgList()).then(res => {
              if (res) {
                this.setState({
                  catg: res
                })
              }
            })
          }))
        } else {
          return dispatch(addSpecCatg(values, () => {
            dispatch(getSpecCatgList()).then(res => {
              if (res) {
                this.setState({
                  catg: res,
                  pageNo: 1
                })
              }
            })
          }))
        }
      },
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 },
      }
    })
  }

  _handleCatgDelete = () => {
    return this.props.dispatch(deleteSpecCatg({ specCatgNo: this.state.selectedKey }))
      .then(res => {
        res && this.setState({
          selectedKey: ''
        })
      })
  }

  _pageChange = (e) => {
    console.log(e)
    if (e.target.value === 'next') {
      this.setState({
        pageNo: ++this.state.pageNo
      })
    } else {
      this.setState({
        pageNo: --this.state.pageNo
      })
    }
  }

  _handleSearch = value => {
    const catg = this.props.catg.filter(item => item.specCatgName.includes(this.state.searchValue))
    this.setState({
      catg
    })
  }

  _handleSearchChange = e => {
    this.setState({
      searchValue: e.target.value,
      pageNo: 1
    })
  }

  render() {
    const { showListSpin, detail, spinning } = this.props
    const { selectedKey, selectedCatg, catg, pageNo, pageSize, searchValue } = this.state

    const finalActions = [
      <Icon
        key='plus'
        type='plus'
        title='新增类别'
        onClick={() => this._handleCatgAddOrEdit()}
      />
    ]

    if (selectedKey) {
      finalActions.push(
        <Icon type='edit' title='编辑类别' onClick={() => this._handleCatgAddOrEdit(selectedCatg)} />,
      )
    }

    return (
      <div>
        <Alert
          message={(
            <div style={{ display: 'inline-block' }}>
              <Search
                style={{ width: 240, marginRight: 10 }}
                value={searchValue}
                onSearch={this._handleSearch}
                onChange={this._handleSearchChange}
                enterButton
              />
              <span>共{isEmpty(catg) ? 0 : catg.length}条，当前在第 {pageNo} 页</span>
            </div>
          )}
          type='info'
          showIcon
        />
        <div className={styles.spec}>
          <Card
            loading={spinning}
            title='规格类别'
            style={{ width: '25%', maxHeight: 556 }}
            actions={finalActions}
            extra={
              <RadioGroup size='small' onChange={this._pageChange} value=''>
                <RadioButton value='prev' disabled={pageNo === 1}>上一页</RadioButton>
                <RadioButton value='next' disabled={isEmpty(catg) || (catg.length / pageSize < pageNo)}>下一页</RadioButton>
              </RadioGroup>
            }
          >
            {
              isEmpty(catg) ? '暂无数据...'
                : (
                  <div className={styles['tree-wrap']}>
                    <Tree
                      showLine={true}
                      onSelect={this._handleCatgSelect}
                      // selectedKeys={selectedKey ? [selectedKey] : []}
                    >
                      {
                        catg.slice(pageSize * (pageNo - 1), pageSize * (pageNo)).map(item => (
                          <TreeNode title={item.specCatgName} key={item.specCatgNo} />
                        ))
                      }
                    </Tree>
                  </div>
                )
            }
          </Card>
          {
            !selectedKey ? null
              : (
                <Table
                  // style={{ width: '75%' }}
                  className={styles.detail}
                  pagination={false}
                  columns={this._columns}
                  rowKey='specNo'
                  dataSource={detail}
                  loading={showListSpin}
                  title={() => (<Button type='primary' onClick={() => this._handleDetailAddOrEdit()}>新增规格</Button>)}
                />
              )
          }
        </div>
      </div>
      
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state.common.showListSpin,
    catg: state.purchase.goods.spec.catg,
    detail: state.purchase.goods.spec.detail,
    spinning: state.common.showListSpin,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(GoodsSpec)
