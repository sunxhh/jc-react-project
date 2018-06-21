import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from './reduck'
import { Select, Table, Input, Form, Row, Col, Button, Popconfirm, Icon, message, Divider } from 'antd'
import { Link } from 'react-router-dom'
import { isEmpty } from 'Utils/lang'
import { showModalWrapper } from 'Components/modal/ModalWrapper'
import { getQiniuToken } from 'Global/action'
import OrderUpload from 'Components/upload'
import { getClassifyList } from '../classifyManage/reduck'
import { genPagination } from 'Utils/helper'
import style from './style.less'

const Option = Select.Option
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/png'
  if (!isJPG) {
    message.error('你上传的图片格式有误！')
    return false
  }
  const isLt300K = file.size / 1024 / 1024 < 1
  if (!isLt300K) {
    message.error('上传的图片不能大于1M!')
  }
  return isJPG && isLt300K
}

class ConsultDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reqBean: {
        categoryId: '',
        name: '',
        currentPage: '1',
        pageSize: '20',
      },
      image: [],
    }
  }
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(getClassifyList())
    dispatch(getQiniuToken())
    dispatch(actions.getClassList(this.state.reqBean))
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const newReqBean = {
          categoryId: values.categoryId,
          name: values.name,
          currentPage: '1',
          pageSize: '20'
        }
        this.setState({
          reqBean: newReqBean
        }, () => {
          this.props.dispatch(actions.getClassList(this.state.reqBean))
        })
      }
    })
  }

  _handlePageChange = (page) => {
    const { dispatch } = this.props
    const { reqBean } = this.state

    this.setState({
      reqBean: Object.assign({}, this.state.reqBean, { currentPage: reqBean.pageSize !== page.pageSize ? 1 : page.current, pageSize: page.pageSize })
    }, () => {
      dispatch(actions.getClassList(this.state.reqBean))
    })
  }

  _handleChangeStatus = (id) => {
    const { dispatch } = this.props
    dispatch(actions.handleDelete({ id: id })).then(res => {
      if (res) {
        dispatch(actions.getClassList((this.state.reqBean)))
      }
    })
  }

  _handleRecommend = (record) => {
    const { dispatch } = this.props
    dispatch(actions.handleRecommand({ id: record.id, recommendMessage: record.recommendMessage, recommendPic: record.recommendPic, isRecommend: 'N' })).then(res => {
      if (res) {
        dispatch(actions.getClassList((this.state.reqBean)))
      }
    })
  }

  columns = [
    {
      key: 'rowNo',
      title: '序号',
      dataIndex: 'rowNo',
      render: (text, record, index) => {
        const { pageSize, currentPage } = this.props.page
        return (
          <span>{
            pageSize *
            currentPage +
            (index + 1) -
            pageSize
          }
          </span>
        )
      }
    },
    {
      key: 'name',
      title: '课程名称',
      dataIndex: 'name',
    },
    {
      key: 'coverPic',
      title: '封面图片',
      dataIndex: 'coverPic',
      width: 75,
      render: (text, record, index) => {
        return (
          isEmpty(record.coverPic) ? '' : (
            <div className={style['img-wrapper']}>
              <img
                src={record.coverPic}
                alt='图片'
              />
            </div>
          )
        )
      }
    },
    {
      key: 'categoryName',
      title: '所属分类',
      dataIndex: 'categoryName',
    },
    {
      key: 'sort',
      title: '排序序号',
      dataIndex: 'sort',
    },
    {
      key: 'isRecommend',
      title: '状态',
      dataIndex: 'isRecommend',
      render: (text, record, index) => {
        return (record.isRecommend === 'Y' ? (<span>已推荐</span>) : '')
      }
    },
    {
      key: 'recommendTime',
      title: '推荐时间',
      dataIndex: 'recommendTime',
      render: (text, record, index) => {
        return (record.isRecommend === 'Y' ? (<span>{text}</span>) : '')
      }
    },
    {
      key: 'createTime',
      title: '添加时间',
      dataIndex: 'createTime',
    },
    {
      key: 'operate',
      title: '操作',
      dataIndex: 'operate',
      render: (text, record, index) => {
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        const edit = (
          <div style={{ float: 'left' }}>
            {
              btnRole.includes('modify') && <Link
                to={`/teen/classManage/classDetail/edit/${record.id}`}
              >
                修改
              </Link>
            }
            {
              btnRole.includes('modify') &&
              btnRole.includes('delete') &&
              <Divider type='vertical' />
            }
            {
              btnRole.includes('delete') && <Popconfirm
                title='删除后该课程下的老师信息也将无法展示，确认删除？'
                onConfirm={(e) => this._handleChangeStatus(record.id)}
              >
                <a size='small'>删除</a>
              </Popconfirm>
            }
            {
              btnRole.includes('modify') &&
              btnRole.includes('delete') &&
              <Divider type='vertical' />
            }
          </div>
        )
        return (
          <div>
            {edit}
            {
              record.isRecommend === 'Y' ? (
                <Popconfirm
                  title='是否确认取消推荐？'
                  onConfirm={(e) => this._handleRecommend(record)}
                >
                  <a size='small'>取消推荐</a>
                </Popconfirm>) : (<a size='small' onClick={() => this._handleTop(record)}>推荐&nbsp;&nbsp;</a>)
            }
          </div>
        )
      }
    }]

  TopImg = (props) => {
    const { form } = props
    return (
      <div>
        <Form>
          <FormItem
            {...formItemLayout}
            label = '图片'
          >
            {form.getFieldDecorator('recommendPic', {
              rules: [{
                required: true,
                message: '请选择图片'
              }],
              getValueFromEvent: this.imageUpload,
              initialValue: this.imageUpload({ fileList: this.state.image })
            })(
              <OrderUpload
                action='http://upload.qiniu.com'
                listType='picture-card'
                beforeUpload={beforeUpload}
                fileList={this.state.image}
                onChange={this._handleChangeImage}
                accept='image/png'
                showUploadList={{ showPreviewIcon: false }}
                data={{ token: props.token }}
                needOrder={false}
                max={1}
              >
                {this.getUploadButton()}
              </OrderUpload>
            )}
            <div style={{ float: 'left' }}>图片尺寸180*150px（高180)，仅支持PNG格式;
            </div>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='推荐语'
          >
            {form.getFieldDecorator('recommendMessage', {
              rules: [{
                required: true,
                message: '请输入16个字符的推荐介绍',
                max: 16
              }],
              initialValue: props.record.recommendMessage
            })(
              <Input
                placeholder='请输入推荐语'
              />
            )}
          </FormItem>
          <div style={{ textAlign: 'center' }}>
            <Button
              size='large'
              onClick={props.onCancel}
              style={{ marginRight: '15px' }}
            >取消
            </Button>
            <Button
              size='large'
              type='primary'
              onClick={() => this.confirm(props)}
            >确定
            </Button>
          </div>
        </Form>
      </div>
    )
  }

  _handleChangeImage = ({ fileList }) => {
    this.setState({
      image: fileList
    })
  }

  confirm = (props) => {
    props.form.validateFields((err, values) => {
      if (!err) {
        const reqBean = {
          id: props.record.id,
          recommendPic: props.form.getFieldValue('recommendPic')[0],
          recommendMessage: props.form.getFieldValue('recommendMessage'),
          isRecommend: 'Y'
        }
        this.props.dispatch(actions.handleRecommand(reqBean)).then(res => {
          if (res) {
            message.info('推荐成功')
            props.onCancel()
            this.props.dispatch(actions.getClassList(this.state.reqBean))
          }
        })
      }
    })
  }

  getUploadButton = content => (
    <div>
      <Icon type='plus' />
      <div className='ant-upload-text'>{content || '上传图片'}</div>
    </div>
  )

  imageUpload = (e) => {
    return e.fileList.map(e => {
      if (e.response) {
        return e.response.key
      }
      if (e.url) {
        return e.url
      }
    })
  }

  _handleChangeImage = ({ fileList }) => {
    this.setState({
      image: fileList
    })
  }

  _handleTop = (record) => {
    const TopImage = Form.create()(this.TopImg)
    this.setState({
      image: record.recommendPic ? [{ uid: 1, url: record.recommendPic }] : []
    }, () => {
      showModalWrapper(
        (
          <TopImage
            token={this.props.token}
            record={record}
          />),
        {
          title: '推荐确认'
        }
      )
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { classList, page, classifyList, auths, match } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    const pagination = genPagination({ ...page, records: page.totalCount, pageNo: page.currentPage })

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Row className='search-form'>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='所属分类'
              >
                <div
                  id='categoryId'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('categoryId', {
                    rules: [{
                      required: false,
                    }],
                    initialValue: '',
                  })(
                    <Select
                      getPopupContainer={() => document.getElementById('categoryId')}
                    >
                      <Option value=''>全部</Option>
                      {
                        classifyList && classifyList.map(item => {
                          return (
                            <Option key={item.id} value={item.id}>
                              {item.name}
                            </Option>
                          )
                        })
                      }
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='课程名称'
              >
                {getFieldDecorator('name', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: '',
                })(
                  <Input placeholder='课程名称' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                <Button
                  type='primary'
                  htmlType='submit'
                >查询
                </Button>
                {
                  btnRole.includes('add') &&
                  <Link to='/teen/classManage/classDetail/add'>
                    <Button
                      type='primary'
                      title='新增'
                    >
                      新增
                    </Button>
                  </Link>
                }
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Table
          columns={this.columns}
          dataSource={classList}
          rowKey='id'
          pagination= {pagination}
          onChange={this._handlePageChange}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    classList: state.classDetail.classList,
    page: state.classDetail.page,
    auths: state.common.auths,
    token: state.common.qiniuToken || '',
    classifyList: state.classify.classifyList,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ConsultDetail))
