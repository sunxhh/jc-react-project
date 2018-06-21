import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { goBack } from 'react-router-redux'
import { Card, Row, Col, Form, Select, Input, Table, Modal, Icon, message, InputNumber, Button, TreeSelect } from 'antd'

import GoodsUpload from 'Components/upload/aliUpload'
import { getAliToken } from 'Global/action'
import * as urls from 'Global/urls'
import { getCenterDetail } from './reduck'
import { isEmpty } from 'Utils/lang'

import { PageTypes } from '../../dict'
import { SeasonFactor } from '../dict'
import * as actions from './reduck'
import styles from './style.less'
import { GoodsTypes } from '../dict'
import SpecItem from './SpecItem'
import { getSpecCatgList, getSpecDetailList } from '../spec/reduck'
import style from './style.less'

const FormItem = Form.Item
const TreeNode = TreeSelect.TreeNode
const Option = Select.Option
const TextArea = Input.TextArea
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

const imageFormItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
}

const goodsStatus = {
  '1': '正常',
  '2': '淘汰',
  '3': '缺失'
}

const goodsSpeciality = {
  '0': '非买断',
  '1': '买断'
}
const SeasonFactorChildren = []
SeasonFactor.forEach(item => (
  SeasonFactorChildren.push(<Option key={item}>{item}</Option>)
))

const uploadButton = (
  <div>
    <Icon type='plus' />
    <div className='ant-upload-text'>上传照片</div>
  </div>
)

class GoodsDetail extends Component {
  constructor(props) {
    super(props)
    let pageType = PageTypes.INFO
    if (props.match.path.includes(urls.SUPPLY_GOODS_CENTER_EDIT)) {
      pageType = PageTypes.EDIT
    }
    this.state = {
      pageType,
      goodsNo: this.props.match.params.id,
      coverImages: [], // 货物封面图片
      goodImages: [], // 货物图片列表
      detailImages: [], // 货物详情图片列表
      previewImage: '',
      previewVisible: false,
      propertyList: [],
      specListObject: {},
      newSkuSpecModelListObject: {},
      newSkuList: [],
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.goodsImgInfo !== nextProps.goodsImgInfo) {
      this.setState({
        coverImages: nextProps.goodsImgInfo.coverImgUrl ? [{ uid: 1, url: nextProps.goodsImgInfo.coverImgUrl }] : [],
        goodImages: nextProps.goodsImgInfo.goodsImgUrls ? nextProps.goodsImgInfo.goodsImgUrls.map((item, index) => {
          return {
            uid: index, url: item
          }
        }) : [],
        detailImages: nextProps.goodsImgInfo.goodsDetailImgUrls ? nextProps.goodsImgInfo.goodsDetailImgUrls.map((item, index) => {
          return {
            uid: index, url: item
          }
        }) : [],
        propertyList: nextProps.goodsAttrSpecList ? nextProps.goodsAttrSpecList.map(item => {
          return {
            key: this._propertyKey++,
            specCatgNo: item.specCatgNo,
            specCatgName: item.specCatgName,
            specList: item.specDetailList
          }
        }) : []
      })
      nextProps.skuSpecModelList.map(item => {
        this.props.dispatch(getSpecDetailList({ specCatgNo: item.specCatgNo }))
          .then(res => {
            const { specListObject } = this.state
            specListObject[item.specCatgNo] = res
            this.setState({
              specListObject
            })
          })
      })
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    const { pageType } = this.state
    pageType === PageTypes.EDIT && dispatch(actions.getCategoryList({ parentNo: '', status: 1 }))
    pageType === PageTypes.EDIT && dispatch(actions.getCodeList({ 'codeKeys': ['goodsType', 'stockUnit'] }))
    dispatch(getCenterDetail({ goodsNo: this.state.goodsNo }))
    dispatch(getSpecCatgList({}))
    dispatch(getAliToken())
  }

  _handleInputChange = (value, key, index, isNew, specNo) => {
    if (isNew) {
      const { newSkuList } = this.state
      const index = newSkuList.findIndex(item => item.specNo === specNo)
      newSkuList[index][key] = value
      this.setState({
        newSkuList
      })
    } else {
      const { goodsSkuList, dispatch } = this.props
      const goodsSkuListData = JSON.parse(JSON.stringify(goodsSkuList))
      goodsSkuListData[index][key] = value
      dispatch(createAction(actions.SET_GOOD_SKU_LIST)(goodsSkuListData))
    }
  }

  _handleNewGoodsChange = (e, specNo) => {
    const { newSkuList } = this.state
    const index = newSkuList.findIndex(item => item.specNo === specNo)
    newSkuList[index].skuNo = e.target.value
    newSkuList[index].barNo = e.target.value
    this.setState({
      newSkuList
    })
  }

  _handleOldGoodsChange = (value, key, index) => {
    const { goodsSkuList, dispatch } = this.props
    const goodsSkuListData = JSON.parse(JSON.stringify(goodsSkuList))
    goodsSkuListData[index][key] = value
    dispatch(createAction(actions.SET_GOOD_SKU_LIST)(goodsSkuListData))
  }

  _handleNewGoodSkuDelete = (specNo) => {
    const { newSkuList } = this.state
    const index = newSkuList.findIndex(item => item.specNo === specNo)
    newSkuList[index].skuNo = ''
    this.setState({
      newSkuList
    })
  }

  _genFilterFields = () => {
    const { goodsSkuList } = this.props
    const { pageType } = this.state
    const _columns = [
      {
        key: 'skuNo',
        title: 'SKU编码',
        dataIndex: 'skuNo',
        render: (text, record) => {
          return (pageType === PageTypes.INFO || !record.isNew) ? (
            <span>{text}</span>
          ) : (
            <Input
              disabled
              addonAfter={<Icon type='delete' onClick={() => this._handleNewGoodSkuDelete(record.specNo)} />}
              value={text}
            />
          )
        }
      },
      {
        key: 'barNo',
        title: '条形码',
        dataIndex: 'barNo',
        render: (text, record, index) => {
          if (pageType === PageTypes.INFO) {
            return (
              <span>{text}</span>
            )
          } else if (record.isNew) {
            return (
              <Input
                value={text}
                onChange={value => this._handleNewGoodsChange(value, record.specNo)}
              />
            )
          }
          return (
            <Input
              value={text}
              onChange={e => this._handleOldGoodsChange(e.target.value, 'barNo', index)}
            />
          )
        }
      },
      {
        key: 'weight',
        title: '重量（g）',
        dataIndex: 'weight',
        render: (text, record, index) => {
          return pageType === PageTypes.INFO ? (
            <span>{text === 0 ? null : text}</span>
          ) : (
            <InputNumber
              min={0.001}
              precision={3}
              value={text === 0 ? null : text}
              onChange={value => this._handleInputChange(value, 'weight', index, record.isNew, record.specNo)}
            />
          )
        }
      },
      {
        key: 'volume',
        title: '体积（cm³）',
        dataIndex: 'volume',
        render: (text, record, index) => {
          return pageType === PageTypes.INFO ? (
            <span>{text === 0 ? null : text}</span>
          ) : (
            <InputNumber
              min={0.001}
              precision={3}
              value={text === 0 ? null : text}
              onChange={value => this._handleInputChange(value, 'volume', index, record.isNew, record.specNo)}
            />
          )
        }
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
    return [{
      title: '序号',
      dataIndex: 'rowNo',
      key: 'rowNo',
      render: (text, record, index) => index + 1
    }, ...arr, ..._columns]
  }

  _getTableData = () => {
    const { goodsSkuList } = this.props
    if (!goodsSkuList) {
      return []
    }
    const finalGoodsSkuList = goodsSkuList.map((item) => {
      let obj = {}
      let skuSpecs = item.skuSpecs
      let specNo = ''
      if (skuSpecs && !isEmpty(skuSpecs)) {
        for (let i = 0, len = skuSpecs.length; i < len; i++) {
          obj[`specName_${skuSpecs[i].specCatgNo}`] = skuSpecs[i].specName
          specNo += skuSpecs[i].specNo
        }
      }

      return { ...item, ...obj, specNo }
    })
    return [...finalGoodsSkuList, ...this.state.newSkuList]
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

  _propertyKey = 1
  _addPropertyListSelector = () => {
    this.setState(prevState => ({
      propertyList: prevState.propertyList.concat({
        key: this._propertyKey++,
        specCatgNo: '',
        specCatgName: '',
        specList: []
      })
    }))
  }

  _handleCatgChange = (value, specCatgNo, key) => {
    let finalSkuSpec = {
      specCatgNo: '',
      specCatgName: ''
    }
    if (!isEmpty(value)) {
      finalSkuSpec = { ...value[0] }
    }
    const finalSkuSpecList = this.state[key].map(item => {
      return item.specCatgNo === specCatgNo ? { ...item, ...finalSkuSpec, specList: [] } : item
    })

    this.setState({
      [key]: finalSkuSpecList
    })
  }

  _handleSpecChange = (value, specCatgNo, key) => {
    const finalSkuSpecList = this.state[key].map(item => {
      return item.specCatgNo === specCatgNo ? { ...item, specList: value } : item
    })
    this.setState({
      [key]: finalSkuSpecList
    })
  }

  _handleDelete = (specCatgNo, key) => {
    this.setState(prevState => ({
      [key]: prevState[key].filter(item => item.specCatgNo !== specCatgNo)
    }))
  }

  _renderAttrSpecList = (goodsAttrSpecList) => {
    const { specCategoryList, dispatch, form, skuSpecModelList } = this.props
    const { getFieldDecorator } = form
    const { pageType, propertyList } = this.state
    if (pageType === PageTypes.INFO) {
      return goodsAttrSpecList.map(item => {
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
      })
    } else {
      return (
        <div>
          {
            propertyList.map((m, i) => {
              return (
                <SpecItem
                  key={m.key}
                  catgList={specCategoryList}
                  data={m}
                  selected={propertyList.concat(skuSpecModelList).map(item => item.specCatgNo)}
                  dispatch={dispatch}
                  onCatgChange={value => this._handleCatgChange(value, m.specCatgNo, 'propertyList')}
                  onSpecChange={value => this._handleSpecChange(value, m.specCatgNo, 'propertyList')}
                  onDelete={(specCatgNo) => this._handleDelete(specCatgNo, 'propertyList')}
                />
              )
            })
          }
          {
            propertyList.length < 10 && propertyList.filter(item => item.specCatgNo === '').length < 1 &&
            <Button
              type='primary'
              onClick={this._addPropertyListSelector}
            >
              添加规格
            </Button>
          }
        </div>
      )
    }
  }

  _selectChange = (rule, value, callback) => {
    const { goodsCategoryList, form } = this.props
    const category = this._getCategoryByNo(value, goodsCategoryList)
    if (category && category.goodsCatgStep !== 3) {
      message.warning('货物只能挂载到三级分类下面', 2)
      form.setFieldsValue({
        goodsCatgNo: ''
      })
    } else {
      callback()
    }
  }

  _getCategoryByNo = (catgNo, categoryList) => {
    if (!categoryList) return null
    for (let i = 0; i < categoryList.length; i++) {
      const cate = categoryList[i]
      if (cate.goodsCatgNo === catgNo) {
        return cate
      } else if (cate.childGoodsCatgList) {
        const category = this._getCategoryByNo(catgNo, cate.childGoodsCatgList)
        if (category) return category
      }
    }
  }

  // 上传详情图change事件
  _handleCoverChange = ({ fileList }) => {
    this.setState({ coverImages: fileList })
  }

  _handleCoverRemove = (file) => {
    this.setState({ coverImages: [] })
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

  _handleSubmit = (e) => {
    e.preventDefault()
    const { dispatch, form, goodsSkuList } = this.props
    const { goodsNo, newSkuSpecModelListObject } = this.state

    // 数据再封装
    form.validateFields((err, values) => {
      if (!err) {
        const goodsAttrSpecList = []

        this.state.propertyList.forEach(value => {
          const specDetailList = []
          value.specList.forEach(e => {
            specDetailList.push({
              specNo: e.specNo
            })
          })
          goodsAttrSpecList.push({
            specCatgNo: value.specCatgNo,
            specDetailList: specDetailList
          })
        })

        // 图片上传
        const goodsImgInfo = {}
        const goodsImgUrls = []
        const goodsDetailImgUrls = []
        this.state.goodImages && this.state.goodImages.forEach(value => {
          goodsImgUrls.push(value.url)
        })
        this.state.detailImages && this.state.detailImages.forEach(value => {
          goodsDetailImgUrls.push(value.url)
        })
        goodsImgInfo.coverImgUrl = this.state.coverImages && !isEmpty(this.state.coverImages) ? this.state.coverImages[0].url : ''
        goodsImgInfo.goodsImgUrls = goodsImgUrls
        goodsImgInfo.goodsDetailImgUrls = goodsDetailImgUrls
        // const additionalSkuSpecModelList = []
        const additionalGoodsSkuList = this.state.newSkuList.map(item => {
          // additionalSkuSpecModelList.push({
          //   specCatgNo: item.skuSpecList[0].specCatgNo,
          //   specDetailList: item.skuSpecList ? item.skuSpecList.map(i => ({ specNo: i.specNo })) : []
          // })
          return {
            skuNo: item.skuNo,
            barNo: item.barNo,
            weight: !item.weight ? 0 : item.weight,
            volume: !item.volume ? 0 : item.volume,
            skuSpecList: item.skuSpecList.map(i => ({
              specCatgNo: i.specCatgNo,
              specNo: i.specNo
            }))
          }
        })
        const additionalSkuSpecModelList = Object.keys(newSkuSpecModelListObject).map(item => ({
          specCatgNo: item,
          specDetailList: newSkuSpecModelListObject[item].map(i => ({ specNo: i }))
        }))
        dispatch(actions.editGoods({
          ...values,
          goodsNo: goodsNo,
          goodsTypeName: GoodsTypes.filter((item) => item.value === values.goodsType)[0].name,
          shortName: '',
          goodsSkuList: goodsSkuList.map(item => ({
            ...item,
            weight: !item.weight ? 0 : item.weight,
            volume: !item.volume ? 0 : item.volume,
          })),
          goodsAttrSpecList: goodsAttrSpecList,
          additionalGoodsSkuList,
          additionalSkuSpecModelList,
          goodsImgInfo: goodsImgInfo
        }))
      }
    })
  }

  _genNewSkuList = (specCatgNo, value) => {
    const { specListObject, newSkuSpecModelListObject } = this.state
    const skuSpecModelListCopy = JSON.parse(JSON.stringify(this.props.skuSpecModelList))
    const specList = skuSpecModelListCopy.map(item => {
      if (item.specCatgNo === specCatgNo) {
        return {
          ...item,
          specDetailList: specListObject[item.specCatgNo].filter(i => i.specNo === value)
        }
      } else {
        const newSkuSpecModelList = newSkuSpecModelListObject[item.specCatgNo]
        let newList = []
        if (newSkuSpecModelList) {
          newList = newSkuSpecModelList.map(i => {
            return specListObject[item.specCatgNo].filter(ci => ci.specNo === i)[0]
          })
        }
        return {
          ...item,
          specDetailList: [...item.specDetailList, ...newList]
        }
      }
    })
    const finalDataSource = specList.reduce((a, c) => {
      const finalA = []
      if (isEmpty(a)) {
        c.specDetailList.forEach(spec => {
          finalA.push({
            ['specName_' + c.specCatgNo]: spec.specName,
            specNo: spec.specNo,
            barNo: '',
            weight: 0,
            volume: 0,
            skuNo: '',
            isNew: true,
            skuSpecList: [
              {
                specNo: spec.specNo,
                specCatgNo: c.specCatgNo,
              }
            ]
          })
        })
      } else if (isEmpty(c.specDetailList)) {
        finalA.push(...a)
      } else {
        a.forEach(item => {
          c.specDetailList.forEach(spec => {
            finalA.push({
              ...item,
              ['specName_' + c.specCatgNo]: spec.specName,
              specNo: item.specNo + spec.specNo,
              barNo: '',
              weight: 0,
              volume: 0,
              skuNo: '',
              isNew: true,
              skuSpecList: [...item.skuSpecList, {
                specNo: spec.specNo,
                specCatgNo: c.specCatgNo,
              }]
            })
          })
        })
      }
      return finalA
    }, [])
    return finalDataSource
  }

  _handleSpecSelect = (value, specCatgNo) => {
    const newSkuSpecModelListObject = this.state.newSkuSpecModelListObject
    if (newSkuSpecModelListObject[specCatgNo]) {
      newSkuSpecModelListObject[specCatgNo].push(value)
    } else {
      newSkuSpecModelListObject[specCatgNo] = [value]
    }
    this.setState({
      newSkuSpecModelListObject,
      newSkuList: [...this.state.newSkuList, ...this._genNewSkuList(specCatgNo, value)]
    })
  }

  _handleSpecDeSelect = (value, specCatgNo) => {
    let newSkuSpecModelListObject = this.state.newSkuSpecModelListObject
    newSkuSpecModelListObject[specCatgNo] = newSkuSpecModelListObject[specCatgNo].filter(item => item !== value)
    const filterSkuList = this._genNewSkuList(specCatgNo, value)
    const newSkuList = this.state.newSkuList.filter(item => {
      return !filterSkuList.some(i => i.specNo === item.specNo)
    })
    this.setState({
      newSkuSpecModelListObject,
      newSkuList
    })
  }

  _renderSpecModeList = () => {
    const { skuSpecModelList } = this.props
    const { specListObject } = this.state
    if (this.state.pageType === PageTypes.EDIT) {
      return skuSpecModelList.map(item => {
        if (!isEmpty(specListObject[item.specCatgNo])) {
          return (
            <div key={item.specCatgNo} id='selectContainer' style={{ position: 'relative' }}>
              <Select
                style={{ width: 200 }}
                disabled={true}
                value={item.specCatgNo}
                getPopupContainer={() => document.getElementById('selectContainer')}
              >
                <Option value={item.specCatgNo}>{item.specCatgName}</Option>
              </Select>
              <div className={style['properties-wrapper']}>
                <div style={{ display: 'inline-block', width: '50%' }}>
                  <Select
                    mode='multiple'
                    optionFilterProp='children'
                    // onChange={this._handleSpecChange}
                    getPopupContainer={() => document.getElementById('selectContainer')}
                    onSelect={(value, option) => this._handleSpecSelect(value, item.specCatgNo, option)}
                    onDeselect={(value) => this._handleSpecDeSelect(value, item.specCatgNo)}
                    defaultValue={item.specDetailList.map(i => i.specNo)}
                  >
                    {
                      specListObject[item.specCatgNo] && specListObject[item.specCatgNo].map(i => {
                        return (
                          <Option
                            disabled={item.specDetailList.some(ci => ci.specNo === i.specNo)}
                            key={i.specNo}
                            value={i.specNo}
                          >
                            { i.specName }
                          </Option>
                        )
                      })
                    }
                  </Select>
                </div>
              </div>
            </div>
          )
        }
        return null
      })
    }
    return null
  }

  _selectAll = () => {
    this.props.form.resetFields(['seasonFactorList'])
    this.props.form.setFieldsValue({
      seasonFactorList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C']
    })
  }

  render() {
    const { goodsDetail, goodsAttrSpecList, goodsImgInfo, aliToken, goodsCategoryList, goodsType, stockUnit } = this.props
    const { getFieldDecorator } = this.props.form
    const { coverImages, goodImages, detailImages, previewVisible, previewImage, pageType } = this.state
    const _columns = this._genFilterFields()
    return (
      <div>
        <Form
          onSubmit={e => this._handleSubmit(e)}
        >
          <FormItem className='operate-btn'>
            {pageType === PageTypes.EDIT && (
              <Button
                type='primary'
                title='点击保存'
                htmlType='submit'
              >
                保存
              </Button>
            )}
            <Button
              onClick={() => this.props.dispatch(goBack())}
            >
              {pageType === PageTypes.EDIT ? '取消' : '返回'}
            </Button>
          </FormItem>
          <Card
            title='基础信息'
          >
            <Row>
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
                        message: '请选择货物分类',
                      }, {
                        validator: (rule, value, callback) => {
                          this._selectChange(rule, value, callback)
                        }
                      }],
                      initialValue: goodsDetail.goodsCatgNo,
                    })(
                      <TreeSelect
                        showSearch
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder='请选择货物分类'
                        allowClear
                        treeNodeFilterProp='title'
                        disabled={pageType === PageTypes.INFO}
                        getPopupContainer={() => document.getElementById('goodsCatgNo')}
                      >
                        {
                          goodsCategoryList && goodsCategoryList.map(item => {
                            if (item.childGoodsCatgList && !isEmpty(item.childGoodsCatgList)) {
                              return (
                                <TreeNode
                                  value={item.goodsCatgNo}
                                  title={item.goodsCatgName}
                                  key={item.goodsCatgNo}
                                >
                                  {
                                    item.childGoodsCatgList.map(i => {
                                      if (i.childGoodsCatgList && !isEmpty(i.childGoodsCatgList)) {
                                        return (
                                          <TreeNode value={i.goodsCatgNo} title={i.goodsCatgName} key={i.goodsCatgNo}>
                                            {
                                              i.childGoodsCatgList.map(ele => {
                                                return (
                                                  <TreeNode value={ele.goodsCatgNo} title={ele.goodsCatgName} key={ele.goodsCatgNo}>
                                                    {
                                                      ele.childGoodsCatgList && ele.childGoodsCatgList.map(last => {
                                                        return (
                                                          <TreeNode value={last.goodsCatgNo} title={last.goodsCatgName} key={last.goodsCatgNo} />
                                                        )
                                                      })
                                                    }
                                                  </TreeNode>
                                                )
                                              })
                                            }
                                          </TreeNode>
                                        )
                                      } else {
                                        return (
                                          <TreeNode value={i.goodsCatgNo} title={i.goodsCatgName} key={i.goodsCatgNo} />
                                        )
                                      }
                                    })
                                  }
                                </TreeNode>
                              )
                            } else {
                              return (
                                <TreeNode
                                  value={item.goodsCatgNo}
                                  disabled={true}
                                  title={item.goodsCatgName}
                                  key={item.goodsCatgNo}
                                />
                              )
                            }
                          })
                        }
                      </TreeSelect>
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
                      message: '请输入货物名称!',
                    }],
                    initialValue: goodsDetail.goodsName,
                  })(
                    <Input
                      maxLength='30'
                      disabled={pageType === PageTypes.INFO}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
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
                        message: '请选择货物类型',
                      }],
                      initialValue: goodsDetail.goodsType,
                    })(
                      <Select
                        placeholder='请选择货物类型'
                        filterOption={false}
                        disabled={pageType === PageTypes.INFO}
                        getPopupContainer={() => document.getElementById('goodsType')}
                      >
                        {goodsType && goodsType.map(item => (
                          <Option
                            key={item.value}
                            value={item.value}
                            title={item.name}
                          >
                            {item.name}
                          </Option>
                        ))}
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
                        message: '请选择库存单位!'
                      }],
                      initialValue: goodsDetail.goodsUnit,
                    })(
                      <Select
                        placeholder='请选择库存单位'
                        filterOption={false}
                        disabled={pageType === PageTypes.INFO}
                        getPopupContainer={() => document.getElementById('goodsUnit')}
                      >
                        {stockUnit && stockUnit.map(item => (
                          <Option
                            key={item.value}
                            value={item.value}
                            title={item.name}
                          >
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </div>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='货物状态：'
                >
                  <div
                    id='goodsStatus'
                    style={{ position: 'goodsUnit', marginBottom: '5px' }}
                  >
                    {getFieldDecorator('goodsStatus', {
                      initialValue: goodsDetail.goodsStatus,
                      rules: [{
                        required: true,
                        message: '请选择货物状态!'
                      }]
                    })(
                      <Select
                        allowClear
                        placeholder='请选择货物状态'
                        disabled={pageType === PageTypes.INFO}
                        getPopupContainer={() => document.getElementById('goodsStatus')}
                      >
                        {Object.keys(goodsStatus).map((key) => (
                          <Option
                            key={key}
                            value={key}
                          >
                            {goodsStatus[key]}
                          </Option>
                        ))}
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
                  label='货物特性：'
                >
                  <div
                    id='goodsSpeciality'
                    style={{ position: 'goodsUnit', marginBottom: '5px' }}
                  >
                    {getFieldDecorator('goodsSpeciality', {
                      initialValue: goodsDetail.goodsSpeciality,
                      rules: [{
                        required: true,
                        message: '请选择货物特性!'
                      }]
                    })(
                      <Select
                        allowClear
                        placeholder='请选择货物特性'
                        disabled={pageType === PageTypes.INFO}
                        getPopupContainer={() => document.getElementById('goodsSpeciality')}
                      >
                        {Object.keys(goodsSpeciality).map((key) => (
                          <Option
                            key={key}
                            value={key}
                          >
                            {goodsSpeciality[key]}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </div>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='保质期(天)'
                >
                  {getFieldDecorator('shelfLife', {
                    initialValue: goodsDetail.shelfLife === 0 ? '' : goodsDetail.shelfLife
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      precision={0}
                      placeholder={pageType === PageTypes.INFO ? '' : '请输入保质期'}
                      min={1}
                      max={99999}
                      disabled={pageType === PageTypes.INFO}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='品牌名称'
                >
                  {getFieldDecorator('brandName', {
                    initialValue: goodsDetail.brandName,
                  })(
                    <Input
                      maxLength='20'
                      placeholder={pageType === PageTypes.INFO ? '' : '请输入品牌名称'}
                      disabled={pageType === PageTypes.INFO}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='箱规'
                >
                  {getFieldDecorator('boxSpec', {
                    initialValue: goodsDetail.boxSpec,
                    rules: [{
                      pattern: /^[1-9]\d*$/,
                      message: '请输入大于0的正整数,最多五位！'
                    }]
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      maxLength='5'
                      placeholder={pageType === PageTypes.INFO ? '' : '请输入箱规'}
                      disabled={pageType === PageTypes.INFO}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='一级产地：'
                >
                  {getFieldDecorator('productionPlaceLv1', {
                    initialValue: goodsDetail.productionPlaceLv1
                  })(
                    <Input
                      disabled={pageType === PageTypes.INFO}
                      placeholder={pageType === PageTypes.INFO ? '' : '请输入一级产地'}
                      maxLength='10'
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='二级产地：'
                >
                  {getFieldDecorator('productionPlaceLv2', {
                    initialValue: goodsDetail.productionPlaceLv2
                  })(
                    <Input
                      placeholder={pageType === PageTypes.INFO ? '' : '请输入二级产地'}
                      disabled={pageType === PageTypes.INFO}
                      maxLength='10'
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='等级：'
                >
                  {getFieldDecorator('goodsLevel', {
                    initialValue: goodsDetail.goodsLevel
                  })(
                    <Input
                      placeholder={pageType === PageTypes.INFO ? '' : '请输入等级'}
                      maxLength='10'
                      disabled={pageType === PageTypes.INFO}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={pageType !== PageTypes.INFO ? 7 : 8}>
                <FormItem
                  labelCol={{ span: pageType !== PageTypes.INFO ? 7 : 6 }}
                  wrapperCol={{ span: pageType !== PageTypes.INFO ? 17 : 18 }}
                  label='季节因子：'
                >
                  <div
                    id='seasonFactorList'
                    style={{ position: 'relative' }}
                  >
                    {getFieldDecorator('seasonFactorList', {
                      initialValue: !isEmpty(goodsDetail.seasonFactorList) ? goodsDetail.seasonFactorList : []
                    })(
                      <Select
                        mode='multiple'
                        allowClear={true}
                        disabled={pageType === PageTypes.INFO}
                        getPopupContainer={() => document.getElementById('seasonFactorList')}
                      >
                        {SeasonFactorChildren}
                      </Select>
                    )}
                    {
                      pageType !== PageTypes.INFO &&
                      <div style={{ marginTop: 8, position: 'absolute', right: -42, top: -8 }} >
                        <span>
                          <a onClick={this._selectAll}>全部</a>
                        </span>
                      </div>
                    }
                  </div>
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card
            title='货物规格'
          >
            {this._renderSpecModeList()}
            <Table
              columns={_columns}
              dataSource={this._getTableData()}
              rowKey='specNo'
              pagination={false}
            />
          </Card>
          <Card
            title='货物属性'
          >
            {this._renderAttrSpecList(goodsAttrSpecList)}
          </Card>
          <Card
            title='货物详情'
          >
            <Row>
              <Col span={17}>
                {!(goodsImgInfo && !isEmpty(goodsImgInfo.coverImgUrl)) && pageType === PageTypes.INFO ? (
                  <FormItem
                    {...imageFormItemLayout}
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
                ) : (
                  <FormItem
                    {...imageFormItemLayout}
                    label='封面图：'
                  >
                    {getFieldDecorator('coverImages', {
                      getValueFromEvent: this._imageUpload,
                      fileList: coverImages,
                    })(
                      <GoodsUpload
                        listType='picture-card'
                        onPreview={this._handlePreview}
                        beforeUpload={this._beforeUpload}
                        onChange={this._handleCoverChange}
                        onRemove={this._handleCoverRemove}
                        showUploadList={{ showRemoveIcon: pageType === PageTypes.EDIT }}
                        aliToken={aliToken}
                        rootPath='supply'
                        fileList={coverImages}
                        accept='image/jpg, image/jpeg, image/png'
                        max={1}
                      >
                        {pageType === PageTypes.EDIT ? uploadButton : null}
                      </GoodsUpload>
                    )}
                  </FormItem>
                )}
              </Col>
              {
                pageType === PageTypes.EDIT && (
                  <Col span={5} offset={2}>
                    <span className={styles['good-tips']}>
                      请上传10M以下，图片支持png、jpg格式，最佳尺寸750*300的封面图
                    </span>
                  </Col>
                )
              }
            </Row>
            <Row>
              <Col span={17}>
                {!(goodsImgInfo && !isEmpty(goodsImgInfo.goodsImgUrls)) && pageType === PageTypes.INFO ? (
                  <FormItem
                    {...imageFormItemLayout}
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
                ) : (
                  <FormItem
                    {...imageFormItemLayout}
                    label='货物图：'
                  >
                    {getFieldDecorator('goodImages', {
                      getValueFromEvent: this._imageUpload,
                      fileList: goodImages,
                    })(
                      <GoodsUpload
                        listType='picture-card'
                        onPreview={this._handlePreview}
                        beforeUpload={this._beforeUpload}
                        onChange={this._handleGoodChange}
                        onRemove={this._handleGoodRemove}
                        showUploadList={{ showRemoveIcon: pageType === PageTypes.EDIT }}
                        aliToken={aliToken}
                        rootPath='supply'
                        fileList={goodImages}
                        accept='image/jpg, image/jpeg, image/png'
                        max={6}
                      >
                        {pageType === PageTypes.EDIT ? uploadButton : null}
                      </GoodsUpload>
                    )}
                  </FormItem>
                )}
              </Col>
              {
                pageType === PageTypes.EDIT && (
                  <Col span={5} offset={2}>
                    <span className={styles['good-tips']}>
                      请上传10M以下，图片支持png、jpg格式，最佳尺寸750*496，默认第一张为主图，最多上传6张
                    </span>
                  </Col>
                )
              }
            </Row>
            <Row>
              <Col span={17}>
                {!(goodsImgInfo && !isEmpty(goodsImgInfo.goodsDetailImgUrls)) && pageType === PageTypes.INFO ? (
                  <FormItem
                    {...imageFormItemLayout}
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
                ) : (
                  <FormItem
                    {...imageFormItemLayout}
                    label='详情图：'
                  >
                    {getFieldDecorator('detailImages', {
                      getValueFromEvent: this.imageUpload,
                      fileList: detailImages,
                    })(
                      <GoodsUpload
                        listType='picture-card'
                        onPreview={this._handlePreview}
                        beforeUpload={this._beforeUpload}
                        onChange={this._handleDetailChange}
                        onRemove={this._handleDetailRemove}
                        showUploadList={{ showRemoveIcon: pageType === PageTypes.EDIT }}
                        aliToken={aliToken}
                        rootPath='supply'
                        fileList={detailImages}
                        accept='image/jpg, image/jpeg, image/png'
                        max={6}
                      >
                        {pageType === PageTypes.EDIT ? uploadButton : null}
                      </GoodsUpload>
                    )}
                  </FormItem>
                )}
              </Col>
              {
                pageType === PageTypes.EDIT && (
                  <Col span={5} offset={2}>
                    <span className={styles['good-tips']}>
                      请上传10M以下，图片支持png、jpg格式，最佳尺寸750*496，默认第一张为主图，最多上传6张
                    </span>
                  </Col>
                )
              }
            </Row>
            <Row>
              <Col span={17}>
                <FormItem
                  {...imageFormItemLayout}
                  label='货物说明：'
                >
                  {getFieldDecorator('goodsDesc', {
                    initialValue: goodsDetail.goodsDesc,
                  })(
                    <TextArea
                      disabled={pageType === PageTypes.INFO}
                      rows={5}
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
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    goodsDetail: state.purchase.goods.center.goodsDetail,
    goodsSkuList: state.purchase.goods.center.goodsSkuList,
    goodsAttrSpecList: state.purchase.goods.center.goodsAttrSpecList,
    goodsImgInfo: state.purchase.goods.center.goodsImgInfo,
    skuSpecModelList: state.purchase.goods.center.skuSpecModelList,

    goodsCategoryList: state.purchase.goods.center.goodsCategoryList,
    goodsType: state.purchase.goods.center.codeList.goodsType,
    stockUnit: state.purchase.goods.center.codeList.stockUnit,

    specCategoryList: state.purchase.goods.spec.catg,
    specSelectorData: state.purchase.goods.center.specSelectorData,
    aliToken: state.common.aliToken,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(GoodsDetail))
