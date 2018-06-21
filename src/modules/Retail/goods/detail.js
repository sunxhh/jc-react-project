import React, { Component } from 'react'
import { Button, Table, Form, Row, Col, Card, Tag } from 'antd'
import styles from './styles.less'
import * as urls from 'Global/urls'
import { isEmpty } from 'Utils/lang'

import { connect } from '@dx-groups/arthur'
import Module from './module'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const specFormItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
}

class GoodDetail extends Component {
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

  componentWillMount() {
    const { dispatch, match } = this.props
    if (match.params && match.params.goodsNo) {
      dispatch(Module.actions.getGoodDetail({ goodsNo: match.params.goodsNo, 'type': '2' }))
    }
  }

  componentWillUnMount() {
    const { dispatch } = this.props
    dispatch(Module.actions.resetGoodDetail())
  }

  componentWillReceiveProps(nextProps) {
    const { match, info } = nextProps
    const { hasInit } = this.state
    if (match.params && match.params.goodsNo) {
      if (!hasInit && !isEmpty(info)) {
        this._setByInfo(info)
      }
    }
  }

  _columns = [
    {
      key: 'sku',
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

  // 根据info设置state
  _setByInfo = (info) => {
    const goodsImage = isEmpty(info.goodsImage) ? [] : info.goodsImage
    const goodsAttrSpecs = isEmpty(info.goodsAttrSpecs) ? [] : info.goodsAttrSpecs
    const goodsSkus = isEmpty(info.goodsSkuInfo) ? [] : info.goodsSkuInfo
    const goodsInfo = isEmpty(info.goodsInfo) ? {} : info.goodsInfo

    const coverImages = info.goodsInfo.coverImage !== '' ? [{ imageUrl: info.goodsInfo.coverImage, url: info.goodsInfo.coverImage, uid: 1 }] : []
    const goodImages = this._getImageByType(goodsImage, '1')
    const detailImages = this._getImageByType(goodsImage, '2')

    this.setState({
      goodsInfo: goodsInfo,
      coverImages: coverImages,
      goodImages: goodImages,
      detailImages: detailImages,
      goodsSpec: this._getGoodSpecData(goodsSkus),
      goodsAttr: this._getGoodAttrData(goodsAttrSpecs),
      hasInit: true
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
    this.setState({ specExtraColumns })
    return goodsSkus
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

  // 生成图片
  _getImage = (arr) => {
    return arr.map((data, index) => {
      return (
        <li key={index}>
          <a href={data.imageUrl} rel='noopener noreferrer' target='_blank'>
            <img src={data.imageUrl} />
          </a>
        </li>
      )
    })
  }

  // 返回
  _handleBack = () => {
    const { history } = this.props
    const path = location.pathname
    if (path.indexOf(urls.RETAIL_STORE_GOODS_DETAIL) !== -1) {
      history.push(urls.RETAIL_STORE_GOODS)
    } else {
      history.push(urls.RETAIL_GOODS)
    }
  }

  render() {
    const emptyStr = '-'
    const { coverImages, goodImages, detailImages, specExtraColumns, goodsInfo, goodsSpec, goodsAttr } = this.state
    return (
      <Form>
        <FormItem className='operate-btn'>
          <Button
            title='点击返回'
            onClick={this._handleBack}
          >
            返回
          </Button>
        </FormItem>
        <Card
          title={<span className={styles['card-tit']}>基础信息</span>}
          className={styles['card-wrapper']}
        >
          <Row
            justify='start'
            type='flex'
          >
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
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='简称：'
              >
                <span className='ant-form-text'>{!isEmpty(goodsInfo) ? goodsInfo.shortName : emptyStr}</span>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='首字母：'
              >
                <span className='ant-form-text'>{!isEmpty(goodsInfo) ? goodsInfo.shortLetters : emptyStr}</span>
              </FormItem>
            </Col>
          </Row>

        </Card>
        <Card
          title={<span className={styles['card-tit']}>商品规格</span>}
          className={styles['card-wrapper']}
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
                <div className={styles['table-wrapper']}>
                  <Table
                    className={styles['c-table-center']}
                    columns={[...specExtraColumns, ...this._columns]}
                    rowKey='sku'
                    dataSource={goodsSpec}
                    pagination={false}
                  />
                </div>
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
          title={<span className={styles['card-tit']}>商品详情</span>}
          className={styles['card-wrapper']}
        >
          <Row
            justify='start'
            type='flex'
          >
            <Col span={16}>
              <FormItem
                {...specFormItemLayout}
                label='封面图：'
              >
                <ul className={styles['image-wrapper']}>{this._getImage(coverImages)}</ul>
              </FormItem>
            </Col>
            <Col span={16}>
              <FormItem
                {...specFormItemLayout}
                label='商品图：'
              >
                <ul className={styles['image-wrapper']}>{this._getImage(goodImages)}</ul>
              </FormItem>
            </Col>
            <Col span={16}>
              <FormItem
                {...specFormItemLayout}
                label='详情图：'
              >
                <ul className={styles['image-wrapper']}>{this._getImage(detailImages)}</ul>
              </FormItem>
            </Col>
            <Col span={16}>
              <FormItem
                {...specFormItemLayout}
                label='商品说明：'
              >
                <span className={styles['tip']}>{!isEmpty(goodsInfo) ? goodsInfo.tips : emptyStr}</span>
              </FormItem>
            </Col>
          </Row>
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
  }
}
export default connect(['common.auths', 'common.showListSpin', 'retail.goods'], mapStateToProps)(Form.create()(GoodDetail))
