import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from './reduck'
import { Select, Table, Input, Form, Row, Col, Button, Popconfirm, Icon, message, Divider } from 'antd'
import { Link } from 'react-router-dom'
import style from '../../activityCenter/style.less'
import { isEmpty } from '../../../../utils/lang'
import apis from '../../apis'
import { showModalWrapper } from '../../../../components/modal/ModalWrapper'
import { getQiniuToken } from '../../../../global/action'
import * as urls from '../../../../global/urls'
import OrderUpload from '../../../../components/upload'
import { genPagination } from 'Utils/helper'

const Option = Select.Option
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}
const status = {
  '0': '待发布',
  '1': '已发布',
  '2': '已下架'
}

const topFlag = {
  '0': '未置顶',
  '1': '置顶'
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg'
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

class Consult extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reqBean: {
        orgId: '',
        title: '',
        channelId: '',
        status: '',
        topFlag: '',
        currentPage: '1',
        pageSize: '20',
      },
      image: [],
    }
  }
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(actions.getChannelList())
    dispatch(getQiniuToken())
    const org = {
      orgMod: '1',
      orgLevel: '1'
    }
    dispatch(actions.getOrg({ org: org })).then(res => {
      if (res.myOrgLevel === '0') {
        dispatch(actions.getConsultList(this.state.reqBean))
      } else {
        this.setState({ reqBean: Object.assign({}, this.state.reqBean, { orgId: res.myOrgList[0].id }) }, () => {
          dispatch(actions.getConsultList(this.state.reqBean))
        })
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const newReqBean = {
          orgId: values.orgId,
          title: values.title,
          channelId: values.channelId,
          status: values.status,
          topFlag: values.topFlag,
          currentPage: '1',
          pageSize: '20'
        }
        this.setState({
          reqBean: newReqBean
        }, () => {
          this.props.dispatch(actions.getConsultList(this.state.reqBean))
        })
      }
    })
  }

  _handlePageChange = (page) => {
    this.setState({
      reqBean: Object.assign({}, this.state.reqBean, { currentPage: page.current })
    }, () => {
      this.props.dispatch(actions.getConsultList(this.state.reqBean))
    })
  }

  _handleChangeStatus = (id, status, code) => {
    const req = {
      id: id
    }
    if (code === 'delete') {
      this.props.dispatch(actions.changeStatus(apis.consult.consult.delete, req)).then(res => {
        if (res) {
          this.props.dispatch(actions.getConsultList(this.state.reqBean))
        }
      })
    } else if (code === 'publish') {
      this.props.dispatch(actions.changeStatus(apis.consult.consult.changestatus, Object.assign({}, req, { status: status }))).then(res => {
        if (res) {
          this.props.dispatch(actions.getConsultList(this.state.reqBean))
        }
      })
    } else if (code === 'setTop') {
      this.props.dispatch(actions.changeStatus(apis.consult.consult.cancelTop, Object.assign({}, req, { topFlag: status }))).then(res => {
        if (res) {
          this.props.dispatch(actions.getConsultList(this.state.reqBean))
        }
      })
    }
  }

  columns = [
    {
      key: 'rowNo',
      title: '序号',
      dataIndex: 'rowNo',
      width: 70,
      fixed: 'left',
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
      key: 'title',
      title: '标题',
      dataIndex: 'title',
      width: '15%'
    },
    {
      key: 'subTitle',
      title: '副标题',
      dataIndex: 'subTitle',
      width: '15%'
    },
    {
      key: 'image',
      title: '图片',
      dataIndex: 'image',
      width: 75,
      render: (text, record, index) => {
        return (
          isEmpty(record.image) ? '' : (
            <div className={style['img-wrapper']}>
              <img
                src={record.image}
                alt='图片'
              />
            </div>
          )
        )
      }
    },
    {
      key: 'orgName',
      title: '所属机构',
      dataIndex: 'orgName',
    },
    {
      key: 'chanName',
      title: '所属频道',
      dataIndex: 'chanName',
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render: (text, record, index) => {
        return (<span>{status[text]}</span>)
      }
    },
    {
      key: 'topFlag',
      title: '置顶',
      dataIndex: 'topFlag',
      render: (text, record, index) => {
        return (<span>{topFlag[text]}</span>)
      }
    },
    {
      key: 'topTime',
      title: '置顶时间',
      width: 108,
      align: 'center',
      dataIndex: 'topTime'
    },
    {
      key: 'operate',
      title: '操作',
      dataIndex: 'operate',
      width: 200,
      fixed: 'right',
      render: (text, record, index) => {
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        const edit = btnRole.includes('edit') ? (
          <Link
            to={`${urls.CONSULT_MANAGE_EDIT}/${record.id}`}
          >修改
          </Link>
        ) : null
        if (record.status === '0') {
          return (
            <div>
              {btnRole.includes('delete') && (
                <Popconfirm
                  title='是否确认删除？'
                  onConfirm={(e) => this._handleChangeStatus(record.id, '', 'delete')}
                >
                  <a size='small'>删除</a>
                </Popconfirm>
              )}
              <Divider type='vertical' />
              {btnRole.includes('publish') && (
                <Popconfirm
                  title='是否确认发布？'
                  onConfirm={(e) => this._handleChangeStatus(record.id, '1', 'publish')}
                >
                  <a size='small'>发布</a>
                </Popconfirm>
              )}
              {edit}
            </div>
          )
        } else if (record.status === '1') {
          return (
            <div>
              {btnRole.includes('under') && (
                <a
                  href='javascript:void(0);'
                  onClick= {(e) => this._handleChangeStatus(record.id, '2', 'publish')}
                >下架
                </a>
              )}
              <Divider type='vertical' />
              {btnRole.includes('stick') && (record.topFlag === '0' ? (<a size='small' onClick={() => this._handleTop(record.id, '1')}><span>置顶&nbsp;&nbsp;</span></a>) : (
                <Popconfirm
                  title={`确定要取消置顶吗？`}
                  onConfirm={(e) => this._handleChangeStatus(record.id, '0', 'setTop')}
                >
                  <a size='small'>取消置顶</a>
                </Popconfirm>
              ))}
              <Divider type='vertical' />
              {edit}
            </div>
          )
        } else if (record.status === '2') {
          return (
            <div>
              {btnRole.includes('publish') && (
                <Popconfirm
                  title='是否确认发布？'
                  onConfirm={(e) => this._handleChangeStatus(record.id, '1', 'publish')}
                >
                  <a size='small'>发布</a>
                </Popconfirm>
              )}
              <Divider type='vertical' />
              {edit}
            </div>
          )
        }
      }
    }
  ]

  TopImg = (props) => {
    const { form } = props
    return (
      <div>
        <Form>
          <FormItem
            {...formItemLayout}
            label = '图片'
          >
            {form.getFieldDecorator('topImage', {
              rules: [{
                required: true,
                message: '请选择图片'
              }],
              getValueFromEvent: this.imageUpload,
            })(
              <OrderUpload
                action='http://upload.qiniu.com'
                listType='picture-card'
                beforeUpload={beforeUpload}
                accept='image/jpg, image/jpeg, image/png'
                showUploadList={{ showPreviewIcon: false }}
                data={{ token: props.token }}
                needOrder={false}
                max={1}
              >
                {this.getUploadButton()}
              </OrderUpload>
            )}
            <div style={{ float: 'left' }}>选择合适的图片，利于您分享，上传图片时，请上传1MB以下jpg、jpeg、png的图片，推荐尺寸1920px*600px;
            </div>
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

  confirm = (props) => {
    props.form.validateFields((err, values) => {
      if (!err) {
        const reqBean = {
          id: props.id,
          topFlag: props.topFlag,
          topImage: props.form.getFieldValue('topImage')[0]
        }
        this.props.dispatch(actions.changeStatus(apis.consult.consult.changetop, reqBean)).then(res => {
          if (res) {
            message.info('置顶成功')
            props.onCancel()
            this.props.dispatch(actions.getConsultList(this.state.reqBean))
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

  _handleTop = (id, topFlag) => {
    const TopImage = Form.create()(this.TopImg)
    showModalWrapper(
      (
        <TopImage
          token={this.props.token}
          id={id}
          topFlag={topFlag}
        />),
      {
        title: '置顶确定'
      }
    )
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { list, page, orgList, channelList, auths, match } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    const pagination = genPagination(page, false)
    return (
      <div>
        <Form onSubmit={this.handleSubmit} className={style['search-form']}>
          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='所属机构'
              >
                <div
                  id='orgId'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('orgId', {
                    rules: [{
                      required: false,
                    }],
                    initialValue: orgList.myOrgLevel === '0' ? '' : (orgList.myOrgList && orgList.myOrgList[0].id),
                  })(
                    <Select
                      getPopupContainer={() => document.getElementById('orgId')}
                      disabled={orgList.myOrgLevel === '0' ? Boolean(0) : Boolean(1)}
                    >
                      <Option value=''>全部</Option>
                      {
                        orgList.myOrgList && orgList.myOrgList.map(item => {
                          return (
                            <Option key={item.id} value={item.id}>
                              {item.orgName}
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
                label='标题'
              >
                {getFieldDecorator('title', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: '',
                })(
                  <Input placeholder='标题' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='频道'
              >
                <div
                  id='channelId'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('channelId', {
                    rules: [{
                      required: false,
                    }],
                    initialValue: '',
                  })(
                    <Select
                      getPopupContainer={() => document.getElementById('channelId')}
                    >
                      <Option value=''>全部</Option>
                      {
                        channelList && channelList.map(item => {
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
          </Row>
          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='状态'
              >
                <div
                  id='status'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('status', {
                    rules: [{
                      required: false,
                    }],
                    initialValue: '',
                  })(
                    <Select
                      getPopupContainer={() => document.getElementById('status')}
                    >
                      <Option value=''>全部</Option>
                      <Option value='0'>待发布</Option>
                      <Option value='1'>已发布</Option>
                      <Option value='2'>已下架</Option>
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='置顶'
              >
                <div
                  id='topFlag'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('topFlag', {
                    rules: [{
                      required: false,
                    }],
                    initialValue: '',
                  })(
                    <Select
                      getPopupContainer={() => document.getElementById('topFlag')}
                    >
                      <Option value=''>全部</Option>
                      <Option value='0'>未置顶</Option>
                      <Option value='1'>置顶</Option>
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                <Button
                  type='primary'
                  htmlType='submit'
                >查询
                </Button>
                {btnRole.includes('add') && (
                  <Link to={urls.CONSULT_MANAGE_ADD}>
                    <Button
                      type='primary'
                      title='新增'
                    >
                      新增
                    </Button>
                  </Link>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Table
          columns={this.columns}
          dataSource={list}
          rowKey='id'
          scroll={{ x: 1400 }}
          pagination= {pagination}
          onChange={this._handlePageChange}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.consult.list,
    page: state.consult.page,
    auths: state.common.auths,
    channelList: state.consult.channelList,
    orgList: state.banner.orgData,
    token: state.common.qiniuToken || '',
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Consult))
