import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getDepotGoodsDetail } from './reduck'
import { Card, Col, Form, Select, Input, Table, Upload, Modal, Icon, Button } from 'antd'
import style from './style.less'
import { isEmpty } from '../../../../utils/lang'
// import { isEmpty } from '../../../../utils/lang'

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

class GoodsDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      goodsNo: this.props.match.params.id,
      coverImgUrl: '',
      goodsImgUrls: [],
      goodsDetailImgUrls: [],
      previewImage: '',
      previewVisible: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.goodsImgInfo !== nextProps.goodsImgInfo) {
      this.setState({
        coverImgUrl: [{ uid: 1, url: nextProps.goodsImgInfo.coverImgUrl }],
        goodsImgUrls: nextProps.goodsImgInfo.goodsImgUrls && nextProps.goodsImgInfo.goodsImgUrls.map((item, index) => {
          return {
            uid: index, url: item
          }
        }),
        goodsDetailImgUrls: nextProps.goodsImgInfo.goodsDetailImgUrls && nextProps.goodsImgInfo.goodsDetailImgUrls.map((item, index) => {
          return {
            uid: index, url: item
          }
        })
      })
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(getDepotGoodsDetail({ goodsNo: this.state.goodsNo }))
  }

  _genFilterFields = () => {
    const { goodsSkuList } = this.props
    const _columns = [
      {
        key: 'skuNo',
        title: 'SKU编码',
        dataIndex: 'skuNo',
      },
      {
        key: 'barNo',
        title: '条形码',
        dataIndex: 'barNo',
      },
      {
        key: 'weight',
        title: '重量（g）',
        dataIndex: 'weight',
      },
      {
        key: 'volume',
        title: '体积(cm³)',
        dataIndex: 'volume',
      },
    ]

    let arr = []
    if (goodsSkuList && !isEmpty(goodsSkuList)) {
      if (goodsSkuList[0].skuSpecs && !isEmpty(goodsSkuList[0].skuSpecs)) {
        arr = goodsSkuList[0].skuSpecs && goodsSkuList[0].skuSpecs.map((item) => {
          return {
            title: item.specCatgName,
            key: `specName_${item.specCatgNo}`,
            dataIndex: `specName_${item.specCatgNo}`
          }
        })
      } else {
        arr = []
      }
    }
    return [...arr, ..._columns]
  }

  _getTableData = () => {
    const { goodsSkuList } = this.props
    if (!goodsSkuList) {
      return []
    }
    return goodsSkuList.map((item) => {
      let obj = {}
      let skuSpecs = item.skuSpecs
      if (skuSpecs && !isEmpty(skuSpecs)) {
        for (let i = 0, len = skuSpecs.length; i < len; i++) {
          obj[`specName_${skuSpecs[i].specCatgNo}`] = skuSpecs[i].specName
        }
      }
      return { ...item, ...obj }
    })
  }

  projectImgUpload = (e) => {
    return e.fileList.map(e => {
      if (e.response) {
        return e.response.key
      }
      if (e.url) {
        return e.url
      }
    })
  }

  _handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  _coverCancel = () => this.setState({ previewVisible: false })

  getUploadButton = content => (
    <div>
      <Icon type='plus' />
      <div className='ant-upload-text'>{content || '上传照片'}</div>
    </div>
  )

  render() {
    const { goodsDetail, goodsAttrSpecList, goodsImgInfo } = this.props
    const { getFieldDecorator } = this.props.form
    const { coverImgUrl, goodsImgUrls, goodsDetailImgUrls, previewImage, previewVisible } = this.state
    const _columns = this._genFilterFields()
    return (
      <div>
        <Form>
          <FormItem className={style['operate-btn']}>
            <Button
              style={{ float: 'right' }}
              type='primary'
              title='返回'
              htmlType='submit'
              onClick={() => history.go(-1)}
            >
              返回
            </Button>
          </FormItem>
          <Card
            title='基础信息'
          >
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='货物类别'
              >
                <div
                  id='goodsCatgNo'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('goodsCatgNo', {
                    rules: [{
                      required: true,
                    }],
                    initialValue: goodsDetail.goodsCatgNo,
                  })(
                    <Select
                      disabled={true}
                      getPopupContainer={() => document.getElementById('goodsCatgNo')}
                    >
                      <Option
                        key={goodsDetail.goodsCatgNo}
                        value={goodsDetail.goodsCatgNo}
                      >
                        {goodsDetail.goodsCatgName}
                      </Option>
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='货物编码'
              >
                {getFieldDecorator('goodsNo', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: goodsDetail.goodsNo,
                })(
                  <Input
                    disabled={true}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='货物名称'
              >
                {getFieldDecorator('goodsName', {
                  rules: [{
                    required: true,
                  }],
                  initialValue: goodsDetail.goodsName,
                })(
                  <Input
                    disabled={true}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='货物类型'
              >
                <div
                  id='goodsType'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('goodsType', {
                    rules: [{
                      required: true,
                    }],
                    initialValue: goodsDetail.goodsType,
                  })(
                    <Select
                      disabled={true}
                      getPopupContainer={() => document.getElementById('goodsType')}
                    >
                      <Option
                        key={goodsDetail.goodsType}
                        value={goodsDetail.goodsType}
                      >
                        {goodsDetail.goodsTypeName}
                      </Option>
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='库存单位'
              >
                <div
                  id='goodsUnit'
                  style={{ position: 'relative' }}
                >
                  {getFieldDecorator('goodsUnit', {
                    rules: [{
                      required: true,
                    }],
                    initialValue: goodsDetail.goodsUnit,
                  })(
                    <Select
                      disabled={true}
                      getPopupContainer={() => document.getElementById('goodsUnit')}
                    >
                      <Option key={goodsDetail.goodsUnit} value={goodsDetail.goodsUnit}>{goodsDetail.goodsUnit}</Option>
                    </Select>
                  )}
                </div>
              </FormItem>
            </Col>
          </Card>
          <Card
            title='货物规格'
          >
            <Table
              columns={_columns}
              dataSource={this._getTableData()}
              rowKey='skuNo'
              pagination={false}
            />
          </Card>
          <Card
            title='货物属性'
          >
            {
              !isEmpty(goodsAttrSpecList) ? goodsAttrSpecList.map(item => {
                return (
                  <div className={style['spec']} key='1'>
                    <div key={item.specCatgNo} style={{ width: '100%' }}>
                      <Col span={8}>
                        <FormItem
                          {...formItemLayout}
                        >
                          <div
                            id='specCatgNo'
                            style={{ position: 'relative' }}
                          >
                            {getFieldDecorator('specCatgNo', {
                              rules: [{
                                required: true,
                              }],
                              initialValue: item.specCatgNo,
                            })(
                              <Select
                                disabled={true}
                                getPopupContainer={() => document.getElementById('specCatgNo')}
                              >
                                <Option
                                  key={item.specCatgNo}
                                  value={item.specCatgNo}
                                >
                                  {item.specCatgName}
                                </Option>
                              </Select>
                            )}
                          </div>
                        </FormItem>
                      </Col>
                    </div>
                    {
                      item.specDetailList && item.specDetailList.map(i => {
                        return (
                          <span className={style['speclist']} key={i.specNo}>{i.specName}</span>
                        )
                      })
                    }
                  </div>
                )
              }) : (<div className={style['noData']}>暂无数据</div>)
            }
          </Card>
          <Card
            title='货物详情'
          >
            <Col span={12}>
              {
                goodsImgInfo && goodsImgInfo.coverImgUrl ? (
                  <FormItem
                    {...formItemLayout}
                    label='封面图'
                    hasFeedback
                  >
                    {getFieldDecorator('coverImgUrl', {
                      rules: [{
                        required: false,
                      }],
                      initialValue: coverImgUrl && coverImgUrl.map(item => {
                        item = item.url
                        return item
                      }),
                      getValueFromEvent: this.projectImgUpload,
                    })(
                      <Upload
                        action='http://upload.qiniu.com'
                        listType='picture-card'
                        fileList={coverImgUrl}
                        onPreview={this._handlePreview}
                        showUploadList={{ showRemoveIcon: false }}
                        accept='image/jpg, image/jpeg, image/png'
                      />
                    )}
                    <Modal
                      visible={previewVisible}
                      footer={null}
                      onCancel={this._coverCancel}
                    >
                      <img
                        alt='example'
                        style={{ width: '100%' }}
                        src={previewImage}
                      />
                    </Modal>
                  </FormItem>
                ) : (
                  <FormItem
                    {...formItemLayout}
                    label='封面图'
                  >
                    {getFieldDecorator('coverImgUrl', {
                      rules: [{
                        required: false,
                      }],
                      initialValue: '暂无图片',
                    })(
                      <label>暂无图片</label>
                    )}
                  </FormItem>
                )
              }
              {
                goodsImgInfo && !isEmpty(goodsImgInfo.goodsImgUrls) ? (
                  <FormItem
                    {...formItemLayout}
                    label='货物图'
                    hasFeedback
                  >
                    {getFieldDecorator('goodsImgUrls', {
                      rules: [{
                        required: false,
                      }],
                      initialValue: goodsImgUrls && goodsImgUrls.map(item => {
                        item = item.url
                        return item
                      }),
                      getValueFromEvent: this.projectImgUpload,
                    })(
                      <Upload
                        action='http://upload.qiniu.com'
                        listType='picture-card'
                        fileList= {goodsImgUrls}
                        onPreview={this._handlePreview}
                        showUploadList={{ showRemoveIcon: false }}
                        accept='image/jpg, image/jpeg, image/png'
                        needOrder={true}
                      />
                    )}
                    <Modal
                      visible={previewVisible}
                      footer={null}
                      onCancel={this._coverCancel}
                    >
                      <img
                        alt='example'
                        style={{ width: '100%' }}
                        src={previewImage}
                      />
                    </Modal>
                  </FormItem>
                ) : (
                  <FormItem
                    {...formItemLayout}
                    label='货物图'
                  >
                    {getFieldDecorator('goodsImgUrls', {
                      rules: [{
                        required: false,
                      }],
                      initialValue: '暂无图片',
                    })(
                      <label>暂无图片</label>
                    )}
                  </FormItem>
                )
              }
              {
                goodsImgInfo && !isEmpty(goodsImgInfo.goodsDetailImgUrls) ? (
                  <FormItem
                    {...formItemLayout}
                    label='详情图'
                    hasFeedback
                  >
                    {getFieldDecorator('goodsDetailImgUrls', {
                      rules: [{
                        required: false,
                      }],
                      initialValue: goodsDetailImgUrls && goodsDetailImgUrls.map(item => {
                        item = item.url
                        return item
                      }),
                      getValueFromEvent: this.projectImgUpload,
                    })(
                      <Upload
                        action='http://upload.qiniu.com'
                        listType='picture-card'
                        fileList={goodsDetailImgUrls}
                        onPreview={this._handlePreview}
                        showUploadList={{ showRemoveIcon: false }}
                        accept='image/jpg, image/jpeg, image/png'
                      />
                    )}
                    <Modal
                      visible={previewVisible}
                      footer={null}
                      onCancel={this._coverCancel}
                    >
                      <img
                        alt='example'
                        style={{ width: '100%' }}
                        src={previewImage}
                      />
                    </Modal>
                  </FormItem>
                ) : (
                  <FormItem
                    {...formItemLayout}
                    label='详情图'
                  >
                    {getFieldDecorator('goodsDetailImgUrls', {
                      rules: [{
                        required: false,
                      }],
                      initialValue: '暂无图片',
                    })(
                      <label>暂无图片</label>
                    )}
                  </FormItem>
                )
              }
              <FormItem
                {...formItemLayout}
                label='货物说明'
              >
                {getFieldDecorator('goodsDesc', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: goodsDetail.goodsDesc,
                })(
                  <TextArea
                    disabled={true}
                    placeholder='货物说明'
                  />
                )}
              </FormItem>
            </Col>
          </Card>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    goodsDetail: state.supplyChain.depotGoods.goodsDetail,
    goodsSkuList: state.supplyChain.depotGoods.goodsSkuList,
    goodsAttrSpecList: state.supplyChain.depotGoods.goodsAttrSpecList,
    goodsImgInfo: state.supplyChain.depotGoods.goodsImgInfo,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(GoodsDetail))
