import React, { Component } from 'react'
import { Button, Table, Form, Row, Col, Input, Card, Tag, Icon, Modal, message } from 'antd'
import { Link } from 'react-router-dom'
import OrderUpload from 'Components/upload/aliUpload'
import styles from './styles.less'
import * as urls from 'Global/urls'
import { isEmpty } from 'Utils/lang'
import { getAliToken } from 'Global/action'

import { connect } from '@dx-groups/arthur'
import Module from './module'

const FormItem = Form.Item
const TextArea = Input.TextArea

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const specFormItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
}
const uploadButton = (
  <div>
    <Icon type='plus' />
    <div className='ant-upload-text'>上传照片</div>
  </div>
)

class GoodAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasInit: false,
      specList: [],
      numErrorCode: 0,
      previewVisible: false,
      previewImage: '',
      goodsInfo: {}, // 基础信息
      goodsSpec: [], // 商品规格
      specExtraColumns: [],
      goodsAttr: [], // 商品属性
      coverImages: [], // 封面图
      goodImages: [], // 商品图
      detailImages: [], // 详情图
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(Module.actions.resetGoodDetail())
  }

  componentWillMount() {
    const { dispatch, match } = this.props
    dispatch(getAliToken())
    if (match.params && match.params.goodsNo) {
      dispatch(Module.actions.getGoodDetail({ goodsNo: match.params.goodsNo, 'type': '2' }))
    }
  }

  componentWillReceiveProps(nextProps) {
    const { match } = this.props
    const { info } = nextProps
    const { hasInit } = this.state
    if (match.params && match.params.goodsNo) {
      if (!hasInit && !isEmpty(info)) {
        this._setByInfo(info, false)
      }
    }
  }

  _columns = [
    {
      key: 'sku1',
      title: 'SKU编码',
      dataIndex: 'sku',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'barNo',
      title: '条形码',
      dataIndex: 'barNo',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'weight',
      title: '重量（g）',
      dataIndex: 'weight',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'volume',
      title: '体积(cm³)',
      dataIndex: 'volume',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
  ]

  // 提交处理
  _handleSubmit = (e) => {
    e.preventDefault()
    const { dispatch, form, history, match } = this.props
    const { numErrorCode } = this.state
    const isEdit = !isEmpty(match.params) && match.params.goodsNo !== ''
    form.validateFields((err, values) => {
      if (numErrorCode !== 0) {
        const number = form.getFieldValue('number')
        form.setFields({
          number: {
            value: number,
            errors: [new Error(this._getNumErrorMes())],
          },
        })
        return
      }
      if (!err) {
        dispatch(Module.actions.addGood({
          ...this._getUserArg(values)
        }, isEdit)).then((res) => {
          if (res.status === 'success') {
            dispatch(Module.actions.resetGoodDetail())
            history.push(urls.RETAIL_GOODS)
          }
        })
      }
    })
  }

  // 图片排序
  _getImages = (images) => {
    if (isEmpty(images)) {
      return []
    }
    return images.map((image) => {
      return {
        imageType: image['imageType'],
        // 处理新上传的图片
        imageUrl: image.imageUrl ? image.imageUrl : image.url,
        sort: image['sort']
      }
    })
  }

  // 获取表单提交数据
  _getUserArg = (values) => {
    const { goodImages, detailImages, coverImages, goodsSpec, goodsInfo } = this.state
    let newCoverImages = this._getImages(coverImages)
    return {
      goodsInfo: {
        goodsNo: values.goodsNo,
        goodsName: goodsInfo.goodsName,
        shortLetters: values.shortLetters,
        coverImage: isEmpty(newCoverImages) ? '' : newCoverImages[0].imageUrl,
        tips: values.tips,
        shortName: values.shortName,
        goodsCatgNo: goodsInfo.goodsCatgNo,
        goodsType: goodsInfo.goodsType,
      },
      goodsImage: [
        ...this._getImages(goodImages),
        ...this._getImages(detailImages),
      ],
      goodsSku: goodsSpec.map((data) => {
        return data.sku
      })
    }
  }

  // 根据info设置state
  _setByInfo = (info, useGoodNameFlag) => {
    const { form } = this.props
    const coverImage = info.goodsInfo.coverImage

    const goodsImage = isEmpty(info.goodsImage) ? [] : info.goodsImage
    const goodsAttrSpecs = isEmpty(info.goodsAttrSpecs) ? [] : info.goodsAttrSpecs
    const goodsSkus = isEmpty(info.goodsSkuInfo) ? [] : info.goodsSkuInfo
    const goodsInfo = isEmpty(info.goodsInfo) ? {} : info.goodsInfo
    const coverImages = (coverImage !== '' && coverImage !== null) ? [{ imageUrl: coverImage, url: coverImage, uid: 1 }] : []
    const goodImages = this._getImageByType(goodsImage, '1')
    const detailImages = this._getImageByType(goodsImage, '2')

    const goodsName = goodsInfo['goodsName']

    this.setState({
      goodsInfo: goodsInfo,
      coverImages: coverImages,
      goodImages: goodImages,
      detailImages: detailImages,
      goodsSpec: goodsSkus,
      goodsAttr: this._getGoodAttrData(goodsAttrSpecs),
      specExtraColumns: this._getGoodSpecData(goodsSkus),
      hasInit: true
    })

    form.setFieldsValue({
      coverImages,
      goodImages,
      detailImages,
      shortLetters: goodsInfo['shortLetters'],
      tips: goodsInfo['tips'],
      goodsNo: goodsInfo['goodsNo'],
      //  “简称”字段默认带入商品名称 不包括修改页面初始查询
      shortName: useGoodNameFlag
        ? (goodsName && goodsName.length > 15 ? `${goodsName.substring(0, 15)}...` : goodsName)
        : goodsInfo['shortName'],
    })
  }

  // 获取规格值
  _getSpec = (specs, specCatgNo) => {
    const data = specs.find((spec) => {
      return spec['specCatgNo'] === specCatgNo
    })
    return data.specName
  }

  // 获取商品规格
  _getGoodSpecData = (goodsSkus) => {
    const specExtraColumns = []
    if (!isEmpty(goodsSkus) && !isEmpty(goodsSkus[0].skuSpecs)) {
      goodsSkus[0].skuSpecs.forEach((spec) => {
        specExtraColumns.push({
          key: spec['specCatgNo'],
          title: spec['specCatgName'],
          dataIndex: spec['specCatgNo'],
          render: (text, record) => {
            return (
              <span>{this._getSpec(record.skuSpecs, spec['specCatgNo'])}</span>
            )
          }
        })
      })
    }
    return specExtraColumns
  }

  // 获取商品属性
  _getGoodAttrData = (goodsAttrSpecs) => {
    const arr = []
    goodsAttrSpecs.forEach((goodsAttr) => {
      let index = arr.findIndex((data) => {
        return data.specName === goodsAttr.specName
      })
      if (index === -1) {
        arr.push({
          specName: goodsAttr.specName,
          specInfoNames: [goodsAttr.specInfoName]
        })
      } else {
        arr[index]['specInfoNames'].push(goodsAttr.specInfoName)
      }
    })
    return arr
  }

  // 获取商品编码错误消息
  _getNumErrorMes = (numErrorCode) => {
    if (numErrorCode === 40000) {
      return '此商品编码已存在!'
    } else if (numErrorCode === 40001) {
      return '此商品编码不存在!'
    }
  }

  // 商品编码blur事件
  _handleNumberBlur = (e) => {
    const { dispatch, form } = this.props
    let goodsNo = e.target.value
    if (goodsNo === '') {
      return
    }
    goodsNo = goodsNo.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
    dispatch(Module.actions.getGoodDetail({ goodsNo, 'type': '1' })).then((info) => {
      this._setByInfo(info.result, true)
      this.setState({ numErrorCode: 0, hasInit: false })
    }, (data) => {
      form.setFields({
        goodsNo: {
          value: goodsNo,
          errors: [new Error(this._getNumErrorMes(data.code))],
        },
      })
      this.setState({
        numErrorCode: data.code,
        goodsInfo: {}, // 基础信息
        goodsSpec: [], // 商品规格
        specExtraColumns: [],
        goodsAttr: [], // 商品属性
        coverImages: [], // 封面图
        goodImages: [], // 商品图
        detailImages: [], // 详情图
      })
    })
  }

  // 商品编码修改事件
  _handleNumberChange = (e) => {
    const { form } = this.props
    const goodsNo = e.target.value
    form.setFieldsValue({ goodsNo })
  }

  // 上传前校验
  _beforeUpload = (file) => {
    const isFormat = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isFormat) {
      message.error('图片格式不对!')
    }
    const isLt10M = file.size / 1024 / 1024 < 10
    if (!isLt10M) {
      message.error('上传的图片不能大于10M!')
    }
    return isFormat && isLt10M
  }

  // 上传图片预览弹层取消
  _previewCancel = () => this.setState({ previewVisible: false })

  // 上传图片预览弹层
  _handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  // 上传封面图change事件
  _handleDetailChange = ({ fileList }) => {
    const newImages = fileList.map((file, index) => {
      file.imageType = '2'
      file.sort = index
      return file
    })
    this.setState({ detailImages: newImages })
  }

  _handleDetailRemove = (file) => {
    const { detailImages } = this.state
    const index = detailImages.indexOf(file)
    const newFileList = detailImages.slice()
    newFileList.splice(index, 1)
    this.setState({ detailImages: newFileList })
  }

  // 上传商品图change事件
  _handleGoodChange = ({ fileList }) => {
    const newImages = fileList.map((file, index) => {
      file.imageType = '1'
      file.sort = index
      return file
    })
    this.setState({ goodImages: newImages })
  }

  _handleGoodRemove = (file) => {
    const { goodImages } = this.state
    const index = goodImages.indexOf(file)
    const newFileList = goodImages.slice()
    newFileList.splice(index, 1)
    this.setState({ goodImages: newFileList })
  }

  // 上传详情图change事件
  _handleCoverChange = ({ fileList }) => {
    this.setState({ coverImages: fileList })
  }

  _handleCoverRemove = (file) => {
    this.setState({ coverImages: [] })
  }

  // 获取图片类型集合
  _getImageByType = (arr, type) => {
    return arr.filter((data) => {
      return data.imageType === type
    }).sort((b, a) => {
      return parseInt(b.sort) - parseInt(a.sort)
    }).map((image, index) => {
      image['url'] = image['imageUrl']
      image['uid'] = index
      return image
    })
  }

  render() {
    const emptyStr = '-'
    const { showButtonSpin, form, aliToken, match } = this.props
    const { previewVisible, previewImage, coverImages, goodImages, detailImages, specExtraColumns, goodsInfo, goodsSpec, goodsAttr } = this.state
    const { getFieldDecorator } = form
    const isEdit = !isEmpty(match.params) && match.params.goodsNo !== ''
    return (
      <Form
        onSubmit={this._handleSubmit}
      >
        <Card className='operate-btn'>
          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='商品编码：'
              >
                {getFieldDecorator('goodsNo', {
                  rules: [
                    { required: true, message: '请输入商品编码！', whitespace: true }
                  ],
                  initialValue: !isEmpty(goodsInfo) ? goodsInfo.goodsNo : ''
                })(
                  <Input
                    disabled={isEdit}
                    placeholder='请输入商品编码'
                    maxLength='50'
                    onBlur={(e) => { this._handleNumberBlur(e) }}
                    onChange={(e) => { this._handleNumberChange(e) }}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={16}>
              <FormItem>
                <Button
                  type='primary'
                  title='点击保存'
                  loading={showButtonSpin}
                  disabled={showButtonSpin}
                  htmlType='submit'
                >
                  保存
                </Button>
                <Link to={urls.RETAIL_GOODS}>
                  <Button
                    title='点击取消'
                  >
                    取消
                  </Button>
                </Link>
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card
          title='基础信息'
        >
          <Row
            justify='start'
            type='flex'
          >
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='商品编码：'
              >
                <span className='ant-form-text'>{!isEmpty(goodsInfo) ? goodsInfo.goodsNo : emptyStr}</span>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='商品名称：'
              >
                <span className='ant-form-text'>{!isEmpty(goodsInfo) ? goodsInfo.goodsName : emptyStr}</span>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='商品类别：'
              >
                <span className='ant-form-text'>{!isEmpty(goodsInfo) ? goodsInfo.goodsCatgName : emptyStr}</span>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='商品类型：'
              >
                <span className='ant-form-text'>{!isEmpty(goodsInfo) ? goodsInfo.goodsTypeName : emptyStr}</span>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='库存单位：'
              >
                <span className='ant-form-text'>{!isEmpty(goodsInfo) ? goodsInfo.unit : emptyStr}</span>
              </FormItem>
            </Col>
          </Row>

        </Card>
        <Card
          title='商品规格'
        >
          <Row
            justify='start'
            type='flex'
          >
            <Col span={24}>
              <FormItem
                {...specFormItemLayout}
                label='规格信息：'
              >
                {
                  <div className={styles['table-wrapper']}>
                    <Table
                      className={styles['c-table-center']}
                      columns={[...specExtraColumns, ...this._columns]}
                      rowKey='sku'
                      dataSource={goodsSpec}
                      pagination={false}
                    />
                  </div>
                }

              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card
          title={<span className={styles['card-tit']}>商品属性</span>}
          className={styles['card-wrapper']}
        >
          <Row
            justify='start'
            type='flex'
          >
            <Col span={24}>
              {
                goodsAttr.map((attr, index) => {
                  return (
                    <div key={index} style={{ marginBottom: '10px' }}>
                      <h3>{attr.specName}</h3>
                      {
                        attr.specInfoNames.map((specInfoName, i) => {
                          return (
                            <Tag key={i}>{specInfoName}</Tag>
                          )
                        })
                      }
                    </div>
                  )
                })
              }
            </Col>
          </Row>
        </Card>
        <Card
          title={<span className={styles['card-tit']}>自定义信息</span>}
          className={styles['card-wrapper']}
        >
          <Row
            justify='start'
            type='flex'
          >
            <Col span={17}>
              <FormItem
                {...specFormItemLayout}
                label='简称：'
              >
                {getFieldDecorator('shortName', {
                  initialValue: !isEmpty(goodsInfo) ? goodsInfo.shortName : ''
                })(
                  <Input
                    placeholder='请输入简称'
                    maxLength='15'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={17}>
              <FormItem
                {...specFormItemLayout}
                label='首字母：'
              >
                {getFieldDecorator('shortLetters', {
                  initialValue: !isEmpty(goodsInfo) ? goodsInfo.shortLetters : ''
                })(
                  <Input
                    placeholder='请输入首字母'
                    maxLength='50'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={17}>
              <FormItem
                {...specFormItemLayout}
                label='封面图：'
              >
                {getFieldDecorator('coverImages', {
                  fileList: coverImages,
                })(
                  <OrderUpload
                    listType='picture-card'
                    onPreview={this._handlePreview}
                    beforeUpload={this._beforeUpload}
                    onChange={this._handleCoverChange}
                    onRemove={this._handleCoverRemove}
                    aliToken={aliToken}
                    rootPath='retail'
                    fileList={coverImages}
                    accept='image/jpg, image/jpeg, image/png'
                  >
                    {coverImages.length >= 1 ? null : uploadButton}
                  </OrderUpload>
                )}
              </FormItem>
            </Col>
            <Col span={5} offset={2}>
              <span className={styles['good-tips']}>
                请上传10M以下，图片支持png、jpg格式，最佳尺寸750*300的封面图
              </span>
            </Col>
            <Col span={17}>
              <FormItem
                {...specFormItemLayout}
                label='商品图：'
              >
                {getFieldDecorator('goodImages', {
                  fileList: goodImages,
                })(
                  <OrderUpload
                    listType='picture-card'
                    onPreview={this._handlePreview}
                    beforeUpload={this._beforeUpload}
                    onChange={this._handleGoodChange}
                    onRemove={this._handleGoodRemove}
                    aliToken={aliToken}
                    rootPath='retail'
                    fileList={goodImages}
                    accept='image/jpg, image/jpeg, image/png'
                    needOrder={true}
                  >
                    {goodImages.length >= 6 ? null : uploadButton}
                  </OrderUpload>
                )}
              </FormItem>
            </Col>
            <Col span={5} offset={2}>
              <span className={styles['good-tips']}>
                请上传10M以下，图片支持png、jpg格式，最佳尺寸750*496，默认第一张为主图，最多上传6张
              </span>
            </Col>
            <Col span={17}>
              <FormItem
                {...specFormItemLayout}
                label='详情图：'
              >
                {getFieldDecorator('detailImages', {
                  getValueFromEvent: this.imageUpload,
                  fileList: detailImages,
                })(
                  <OrderUpload
                    listType='picture-card'
                    onPreview={this._handlePreview}
                    beforeUpload={this._beforeUpload}
                    onChange={this._handleDetailChange}
                    onRemove={this._handleDetailRemove}
                    aliToken={aliToken}
                    rootPath='retail'
                    fileList={detailImages}
                    accept='image/jpg, image/jpeg, image/png'
                    needOrder={true}
                  >
                    {detailImages.length >= 6 ? null : uploadButton}
                  </OrderUpload>
                )}
              </FormItem>
            </Col>
            <Col span={5} offset={2}>
              <span className={styles['good-tips']}>
                请上传10M以下，图片支持png、jpg格式，最佳尺寸750*496，默认第一张为主图，最多上传6张
              </span>
            </Col>
            <Col span={17}>
              <FormItem
                {...specFormItemLayout}
                label='商品说明：'
              >
                {getFieldDecorator('tips', {
                  initialValue: !isEmpty(goodsInfo) ? goodsInfo.tips : ''
                })(
                  <TextArea
                    rows={4}
                    maxLength='500'
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Modal
            visible={previewVisible}
            footer={null}
            onCancel={this._previewCancel}
          >
            <img
              alt='example'
              style={{ width: '100%' }}
              src={previewImage}
            />
          </Modal>
        </Card>
      </Form>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state['retail.goods'],
    auths: state['common.auths'],
    showListSpin: state['common.showListSpin'],
    aliToken: state['common.aliToken'],
  }
}
export default connect(['common.auths', 'common.showListSpin', 'common.aliToken', 'retail.goods'], mapStateToProps)(Form.create()(GoodAdd))
