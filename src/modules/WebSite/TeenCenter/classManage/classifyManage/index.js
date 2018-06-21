import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Table, Popconfirm, Radio, Divider } from 'antd'
import { Link } from 'react-router-dom'
import * as actions from './reduck'
import { showModalForm } from 'Components/modal/ModalForm'

const RadioGroup = Radio.Group

const classType = {
  '1': '主修',
  '2': '选修',
  '3': '必修',
}

class Classify extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(actions.getClassifyList())
  }

  _handleDelete = (id) => {
    const { dispatch } = this.props
    dispatch(actions.handleDelete({ id: id })).then(res => {
      if (res) {
        dispatch(actions.getClassifyList())
      }
    })
  }

  add = () => {
    showModalForm({
      title: '新增',
      fields: [
        {
          id: 'name',
          placeHolder: '请输入分类名称',
          props: {
            label: '分类名称'
          },
          options: {
            initialValue: '',
            rules: [{
              required: true,
              message: '请输入25个字符以内的分类名称',
              max: 25
            }]
          },
        }, {
          id: 'sort',
          placeHolder: '请输入排序序号',
          props: {
            label: '排序序号'
          },
          options: {
            initialValue: '',
            rules: [{
              required: true,
              pattern: /^[1-9]\d{0,3}$/,
              message: '请填写1-9999范围整数序号'
            }]
          },
        }, {
          id: 'type',
          props: {
            label: '类型',
          },
          options: {
            initialValue: '',
            rules: [{
              required: true,
              message: '请选择类型',
            }],
          },
          element: (
            <RadioGroup>
              <Radio value='1'>主修</Radio>
              <Radio value='2'>选修</Radio>
              <Radio value='3'>必修</Radio>
            </RadioGroup>
          ),
          hasPopup: true
        },
      ],
      onOk: values => {
        this.props.dispatch(actions.classifyAdd({ name: values.name, type: values.type, sort: values.sort }))
      }
    })
  }

  edit = (id) => {
    this.props.dispatch(actions.getClassifyDetail({ id: id })).then(res => {
      if (res.code === 0) {
        showModalForm({
          title: '编辑',
          fields: [
            {
              id: 'name',
              placeHolder: '请输入分类名称',
              props: {
                label: '分类名称'
              },
              options: {
                initialValue: res.data.name,
                rules: [{
                  required: true,
                  message: '请输入25个字符以内的分类名称',
                  max: 25
                }]
              },
            }, {
              id: 'sort',
              placeHolder: '请输入排序序号',
              props: {
                label: '排序序号'
              },
              options: {
                initialValue: res.data.sort,
                rules: [{
                  required: true,
                  pattern: /^[1-9]\d{0,3}$/,
                  message: '请填写1-9999范围整数序号'
                }]
              },
            }, {
              id: 'type',
              props: {
                label: '类型',
              },
              options: {
                initialValue: res.data.type,
                rules: [{
                  required: true,
                  message: '请选择类型',
                }],
              },
              element: (
                <RadioGroup>
                  <Radio value='1'>主修</Radio>
                  <Radio value='2'>选修</Radio>
                  <Radio value='3'>必修</Radio>
                </RadioGroup>
              ),
              hasPopup: true
            },
          ],
          onOk: values => {
            this.props.dispatch(actions.classifyEdit({ id: id, name: values.name, type: values.type, sort: values.sort }))
          }
        })
      }
    })
  }

  columns = [
    {
      key: 'rowNo',
      title: '序号',
      dataIndex: 'rowNo',
      render: (text, record, index) => {
        return (
          <span>{index + 1}</span>
        )
      }
    },
    {
      key: 'name',
      title: '分类名称',
      dataIndex: 'name',
    },
    {
      key: 'type',
      title: '类型',
      dataIndex: 'type',
      render: (text, record, index) => {
        return (
          <span>{classType[text]}</span>
        )
      }
    },
    {
      key: 'sort',
      title: '排序',
      dataIndex: 'sort'
    },
    {
      key: 'operate',
      title: '操作',
      dataIndex: 'operate',
      render: (text, record, index) => {
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        return (
          <span>
            {
              btnRole.includes('delete') && (
                <Popconfirm
                  title={`删除分类后，该分类所有的课程和教师将同步被删除，确认删除?`}
                  okText='确定'
                  cancelText='取消'
                  onConfirm={() => this._handleDelete(record.id)}
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
            {
              btnRole.includes('delete') &&
              btnRole.includes('modify') &&
              <Divider type='vertical' />
            }
            {
              btnRole.includes('modify') &&
              <Link
                to='#'
                onClick={() => this.edit(record.id)}
              >修改
              </Link>
            }
          </span>
        )
      }
    }
  ]

  render() {
    const { auths, match, classifyList } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    return (
      <div>
        <div style={{ marginBottom: '20px' }}>
          {
            btnRole.includes('add') &&
            <Button
              type='primary'
              onClick={this.add}
            >
              新增
            </Button>
          }
        </div>
        <Table
          columns={this.columns}
          dataSource={classifyList}
          rowKey='id'
          pagination= {false}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auths: state.common.auths,
    classifyList: state.classify.classifyList || [],
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Classify)
