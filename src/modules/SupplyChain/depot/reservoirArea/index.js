import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Table, Input, Select, Form, Row, Col, Popconfirm, TreeSelect, Tooltip, Divider } from 'antd'
import { getAreaList, handleDelete, areaAdd, getAreaDetail, areaModify, getGoodsCateList } from './reduck'
import { showModalForm } from '../../../../components/modal/ModalForm'
import { queryOrgByLevel } from 'Global/action'
import { isEmpty } from '../../../../utils/lang'
import { genPagination } from 'Utils/helper'
// import { getWareList } from '../qualityWatch/reduck'
// import { Link } from 'react-router-dom'
// import * as urls from '../../../../global/urls'

const Option = Select.Option
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

class ReservoirArea extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reqBean: {
        houseareaCode: '',
        houseareaName: '',
        catgNoList: [],
        warehouseNo: '',
        operatorName: '',
        currentPage: 1,
        pageSize: 10
      },
      goodsCateList: []
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(queryOrgByLevel()).then(res => {
      if (res.myOrgLevel !== '2') {
        dispatch(getAreaList(this.state.reqBean))
      } else {
        this.setState({ reqBean: Object.assign({}, this.state.reqBean, { warehouseNo: res.myOrgCode }) }, () => {
          dispatch(getAreaList(this.state.reqBean))
        })
      }
    })
    dispatch(getGoodsCateList({ parentNo: '', status: '1' }))
    // dispatch(getWareList())
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.goodsCateList !== nextProps.goodsCateList) {
      const goodsCateList = []
      nextProps.goodsCateList.map(item => {
        if (!isEmpty(item.children)) {
          goodsCateList.push(item)
        }
      })
      this.setState({
        goodsCateList: goodsCateList
      })
    }
  }

  _genFilterFields = () => {
    const { orgLevel } = this.props
    const _columns = [
      {
        key: 'rowNo',
        title: '序号',
        dataIndex: 'rowNo',
        render: (text, record, index) => {
          const { pageSize, pageNo } = this.props.page
          return (
            <span>{
              pageSize *
              pageNo +
              (index + 1) -
              pageSize
            }
            </span>
          )
        }
      },
      {
        key: 'houseareaCode',
        title: '库区编码',
        dataIndex: 'houseareaCode',
      },
      {
        key: 'houseareaName',
        title: '库区名称',
        dataIndex: 'houseareaName',
      },
      {
        key: 'goodsCatgName',
        title: '二级分类',
        dataIndex: 'goodsCatgName',
        render: (text, record, index) => {
          // const length = record.catgList && record.catgList.length
          // return record.catgList && record.catgList.map((item, index) => {
          //   if (index === length - 1) {
          //     return <span key={index}>{item.goodsCatgName}</span>
          //   } else {
          //     return <span key={index}>{item.goodsCatgName} / </span>
          //   }
          // })

          const res = record.catgList ? record.catgList.reduce((old, item, index, arr) => {
            if (arr.length - 1 === index) {
              return old + item.goodsCatgName
            }
            return old + item.goodsCatgName + ' / '
          }, '') : ''
          if (res.length <= 20) {
            return res
          }
          return (
            <Tooltip placement='top' title={res}>
              {res.substring(0, 20) + '...'}
            </Tooltip>
          )
        }
      },
      {
        key: 'warehouseName',
        title: '仓库部门',
        dataIndex: 'warehouseName',
      },
      {
        key: 'operatorName',
        title: '操作人',
        dataIndex: 'operatorName',
      },
      {
        key: 'operateTime',
        title: '操作时间',
        dataIndex: 'operateTime',
        width: 108
      },
    ]
    if (orgLevel === '2') { // 二级机构
      _columns.push({
        key: 'operate',
        title: '操作',
        dataIndex: 'operate',
        render: (text, record, index) => {
          const { auths, match } = this.props
          const btnRole = auths[match.path] ? auths[match.path] : []
          return (
            <span>
              {
                btnRole.includes('edit') &&
                <a size='small'><span onClick={() => this.edit(record.houseareaNo)}>编辑</span></a>
              }
              {
                btnRole.includes('edit') && btnRole.includes('delete') && <Divider type='vertical' />
              }
              {
                btnRole.includes('delete') && (
                  <Popconfirm
                    title={`确认删除该库区?`}
                    okText='确定'
                    cancelText='取消'
                    onConfirm={() => this._handleDelete(record.houseareaNo)}
                  >
                    <a
                      href='javascript:void(0);'
                      title='删除'
                    >
                      删除
                    </a>
                  </Popconfirm>
                )
              }
            </span>
          )
        }
      })
    }
    return _columns
  }

  edit = (houseareaNo) => {
    this.props.dispatch(getAreaDetail({ houseareaNo: houseareaNo })).then(res => {
      const tProps = {
        treeData: this.state.goodsCateList,
        treeCheckable: true,
        searchPlaceholder: '请选择二级分类',
        treeNodeFilterProp: 'label',
        dropdownStyle: {
          height: '400px',
          overflow: 'auto'
        }
      }
      const { orgLevel, orgList, orgCode, orgName } = this.props
      showModalForm({
        title: '编辑库区',
        fields: [
          {
            id: 'houseareaCode',
            placeHolder: '请输入库区编码',
            props: {
              label: '库区编码'
            },
            options: {
              initialValue: res && res.houseareaCode,
              rules: [{
                required: true,
                message: '请输入15字符以内的库区编码',
                max: '15'
              }]
            },
          }, {
            id: 'houseareaName',
            placeHolder: '请输入库区名称',
            props: {
              label: '库区名称'
            },
            options: {
              initialValue: res && res.houseareaName,
              rules: [{
                required: true,
                message: '请输入15字符以内的库区名称',
                max: '15'
              }]
            },
          }, {
            id: 'warehouseNo',
            props: {
              label: '所属仓库',
            },
            options: {
              rules: [{
                required: true,
                message: '请选择所属仓库',
              }],
              initialValue: res && res.warehouseNo
            },
            element: (
              <Select
                disabled={orgLevel === '2' ? Boolean(1) : Boolean(0)}
                showSearch={false}
                placeholder='请选择所属仓库'
                optionFilterProp='children'
                getPopupContainer={() => document.getElementById('warehouseNo')}
              >
                {
                  orgLevel && orgLevel === '2' ? (<Option value={orgCode}>{orgName}</Option>) : (
                    orgList && orgList.map(item => {
                      return (
                        <Option key={item.orgCode} value={item.orgCode}>
                          {item.orgName}
                        </Option>
                      )
                    })
                  )
                }
              </Select>

            ),
            hasPopup: true
          }, {
            id: 'twoLevelType',
            props: {
              label: '二级分类',
            },
            options: {
              rules: [{
                required: true,
                message: '请选择二级分类',
              }],
              initialValue: res && res.catgList.map(item => {
                return item.goodsCatgNo
              }),
            },
            element: (
              <TreeSelect {...tProps} />
            ),
            hasPopup: true
          },
        ],
        onOk: values => {
          this.props.dispatch(areaModify({ houseareaNo: houseareaNo, houseareaCode: values.houseareaCode, houseareaName: values.houseareaName, warehouseNo: values.warehouseNo, catgNoList: values.twoLevelType })).then(res => {
            if (res) {
              this.props.dispatch(getAreaList(this.state.reqBean))
            }
          })
        }
      })
    })
  }

  _handleDelete = (houseareaNo) => {
    const { dispatch } = this.props
    dispatch(handleDelete({ houseareaNo: houseareaNo })).then(res => {
      if (res) {
        dispatch(getAreaList(this.state.reqBean))
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const newReqBean = {
          houseareaCode: values.houseareaCode ? values.houseareaCode.replace(/(^\s+)|(\s+$)/g, '') : '',
          houseareaName: values.houseareaName ? values.houseareaName.replace(/(^\s+)|(\s+$)/g, '') : '',
          catgNoList: values.goodsCatgNo,
          warehouseNo: values.warehouseNo,
          operatorName: values.operatorName ? values.operatorName.replace(/(^\s+)|(\s+$)/g, '') : '',
          currentPage: 1,
          pageSize: 10
        }
        this.setState({
          reqBean: newReqBean
        }, () => {
          this.props.dispatch(getAreaList(this.state.reqBean))
        })
      }
    })
  }

  _handlePageChange = (pagination) => {
    window.scrollTo(0, 0)
    const { current, pageSize } = pagination
    const { page } = this.props
    this.setState({
      reqBean: Object.assign({}, this.state.reqBean, { currentPage: page.pageSize !== pageSize ? 1 : current, pageSize: pageSize })
    }, () => {
      this.props.dispatch(getAreaList(this.state.reqBean))
    })
  }

  _handleAdd = () => {
    const tProps = {
      treeData: this.state.goodsCateList,
      treeCheckable: true,
      searchPlaceholder: '请选择二级分类',
      treeNodeFilterProp: 'label',
      showCheckedStrategy: TreeSelect.SHOW_CHILD,
      dropdownStyle: {
        height: '400px',
        overflow: 'auto'
      }
    }
    const { orgLevel, orgList, orgCode, orgName } = this.props
    showModalForm({
      title: '新增库区',
      fields: [
        {
          id: 'houseareaCode',
          placeHolder: '请输入库区编码',
          props: {
            label: '库区编码'
          },
          options: {
            initialValue: '',
            rules: [{
              required: true,
              message: '请输入15字符以内的库区编码',
              max: '15'
            }]
          },
        }, {
          id: 'houseareaName',
          placeHolder: '请输入库区名称',
          props: {
            label: '库区名称'
          },
          options: {
            initialValue: '',
            rules: [{
              required: true,
              message: '请输入15字符以内的库区名称',
              max: '15'
            }]
          },
        }, {
          id: 'warehouseNo',
          props: {
            label: '所属仓库',
          },
          options: {
            rules: [{
              required: true,
              message: '请选择所属仓库',
            }],
            initialValue: orgLevel === '2' ? orgCode : '',
          },
          element: (
            <Select
              disabled={orgLevel === '2' ? Boolean(1) : Boolean(0)}
              showSearch={false}
              placeholder='请选择所属仓库'
              optionFilterProp='children'
              getPopupContainer={() => document.getElementById('warehouseNo')}
            >
              {
                orgLevel && orgLevel === '2' ? (<Option value={orgCode}>{orgName}</Option>) : (
                  orgList && orgList.map(item => {
                    return (
                      <Option key={item.orgCode} value={item.orgCode}>
                        {item.orgName}
                      </Option>
                    )
                  })
                )
              }
            </Select>

          ),
          hasPopup: true
        }, {
          id: 'twoLevelType',
          props: {
            label: '二级分类',
          },
          options: {
            rules: [{
              required: true,
              message: '请选择二级分类',
            }],
          },
          element: (
            <TreeSelect {...tProps} />
          ),
          hasPopup: true
        },
      ],
      onOk: values => {
        this.props.dispatch(areaAdd({ houseareaCode: values.houseareaCode, houseareaName: values.houseareaName, warehouseNo: values.warehouseNo, catgNoList: values.twoLevelType })).then(res => {
          if (res) {
            this.props.dispatch(getAreaList(this.state.reqBean))
          }
        })
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { list, page, showListSpin, orgLevel, orgList, auths, match, orgCode, orgName } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    const _columns = this._genFilterFields()
    const pagination = genPagination(page)
    const tProps = {
      treeData: this.state.goodsCateList,
      treeCheckable: true,
      searchPlaceholder: '请选择二级分类',
      treeNodeFilterProp: 'label',
      dropdownStyle: {
        height: '350px',
        overflow: 'auto'
      }
    }
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Row className='search-form'>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='库区编码'
              >
                {getFieldDecorator('houseareaCode', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: '',
                })(
                  <Input placeholder='请输入库区编码' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='库区名称'
              >
                {getFieldDecorator('houseareaName', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: '',
                })(
                  <Input placeholder='请输入库区名称' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='二级分类'
              >
                <div
                  id='goodsCatgNo'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('goodsCatgNo', {
                    rules: [{
                      required: false,
                    }],
                  })(
                    <TreeSelect {...tProps} />
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='仓库部门'
              >
                <div
                  id='warehouseNoBg'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('warehouseNo', {
                    rules: [{
                      required: false,
                    }],
                    initialValue: orgLevel === '2' ? orgCode : ''
                  })(
                    <Select
                      allowClear={true}
                      disabled={orgLevel === '2' ? Boolean(1) : Boolean(0)}
                      showSearch={false}
                      placeholder='请选择仓库部门'
                      optionFilterProp='children'
                      getPopupContainer={() => document.getElementById('warehouseNoBg')}
                    >
                      <Option key='' value=''>全部</Option>
                      {
                        orgLevel && orgLevel === '2' ? (<Option value={orgCode}>{orgName}</Option>) : (
                          orgList && orgList.map(item => {
                            return (
                              <Option key={item.orgCode} value={item.orgCode}>
                                {item.orgName}
                              </Option>
                            )
                          })
                        )
                      }
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='操作人'
              >
                {getFieldDecorator('operatorName', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: '',
                })(
                  <Input placeholder='请输入操作人' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
              >
                <Button
                  type='primary'
                  htmlType='submit'
                >查询
                </Button>
                {
                  btnRole.includes('add') && orgLevel === '2' &&
                  <Button
                    type='primary'
                    title='新增'
                    onClick={this._handleAdd}
                  >
                    新增
                  </Button>
                }
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Table
          columns={_columns}
          dataSource={list}
          rowKey='id'
          pagination={pagination}
          onChange={this._handlePageChange}
          loading={showListSpin}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state.common.showListSpin,
    orgCode: state.common.orgCode,
    orgLevel: state.common.orgLevel,
    orgName: state.common.orgName,
    orgList: state.common.orgList,
    list: state.supplyChain.houseArea.areaList,
    page: state.supplyChain.houseArea.areaPage,
    auths: state.common.auths,
    // wareList: state.supplyChain.qualityWatch.wareList,
    goodsCateList: state.supplyChain.houseArea.goodsCateList
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ReservoirArea))
