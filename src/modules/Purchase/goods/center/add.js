import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, InputNumber, Button, Card, TreeSelect, Select, Row, Col, Icon, message, Modal, Tooltip } from 'antd'

import { isEmpty } from 'Utils/lang'
import GoodsUpload from 'Components/upload/aliUpload'
import { getAliToken } from 'Global/action'

import * as actions from './reduck'
import SpecItem from './SpecItem'
import SpecTable from './SpecTable'
import { getSpecCatgList } from '../spec/reduck'
import { SeasonFactor } from '../dict'
import styles from './style.less'

const FormItem = Form.Item
const Option = Select.Option
const TreeNode = TreeSelect.TreeNode
const TextArea = Input.TextArea

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

const specFormItemLayout = {
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

class Add extends Component {
  constructor(props) {
    super(props)
    this.finalData = null
    this.state = {
      tableData: {},
      propertyList: [],
      skuSpecList: [],
      coverImages: [], // 货物封面图片
      goodImages: [], // 货物图片列表
      detailImages: [], // 货物详情图片列表
      goodsDesc: '', // 货物说明
      previewVisible: false,
      previewImage: '',
      numErrorCode: '',
      showDetail: false,
      showSpec: false,
    }
  }

  componentWillMount() {
    this.props.dispatch(actions.getCategoryList({ parentNo: '', status: 1 }))
    this.props.dispatch(actions.getCodeList({ 'codeKeys': ['goodsType', 'stockUnit'] }))
    this.props.dispatch(getSpecCatgList({}))
    this.props.dispatch(getAliToken())
  }

  _getFinalData = data => {
    this.finalData = data
  }

  // 提交处理
  _handleSubmit = (e) => {
    e.preventDefault()

    const { skuSpecList, propertyList } = this.state
    if (!isEmpty(skuSpecList)) {
      const hasUnselected = skuSpecList.some(spec => {
        if (!spec.specCatgNo) {
          message.error('请选择规格类别')
          return true
        } else if (isEmpty(spec.specList)) {
          message.error('请选择货物规格【' + spec.specCatgName + '】类别下的规格')
          return true
        }
        return false
      })
      if (hasUnselected) {
        return
      }
    }
    if (!isEmpty(propertyList)) {
      const hasUnselected = propertyList.some(spec => {
        if (!spec.specCatgNo) {
          message.error('请为添加的货物属性选择类别')
          return true
        } else if (isEmpty(spec.specList)) {
          message.error('请选择货物属性【' + spec.specCatgName + '】类别下的规格')
          return true
        }
        return false
      })
      if (hasUnselected) {
        return
      }
    }

    const { dispatch, form } = this.props
    // 数据再封装
    form.validateFields((err, values) => {
      if (!err) {
        const skuSpecModelList = []
        const goodsAttrSpecList = []
        let goodsSkuList = []

        this.state.skuSpecList.forEach(value => {
          const specDetailList = []
          value.specList.forEach(e => {
            specDetailList.push({
              specNo: e.specNo
            })
          })
          skuSpecModelList.push({
            specCatgNo: value.specCatgNo,
            specDetailList: specDetailList
          })
        })

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
        this.state.goodImages.forEach(value => {
          goodsImgUrls.push(value.url)
        })
        this.state.detailImages.forEach(value => {
          goodsDetailImgUrls.push(value.url)
        })
        goodsImgInfo.coverImgUrl = this.state.coverImages && !isEmpty(this.state.coverImages) ? this.state.coverImages[0].url : ''
        goodsImgInfo.goodsImgUrls = goodsImgUrls
        goodsImgInfo.goodsDetailImgUrls = goodsDetailImgUrls

        if (this.finalData && !isEmpty(this.finalData)) {
          goodsSkuList = this.finalData.map(item => ({
            ...item,
            barNo: item.barNo.trim(),
            skuNo: item.skuNo.trim(),
            weight: !item.weight ? 0 : item.weight,
            volume: !item.volume ? 0 : item.volume,
          }))
        } else {
          goodsSkuList = [{
            skuNo: '',
            barNo: '',
            weight: null,
            volume: null,
            skuSpecList: [
              { specCatgNo: '', specNo: '' }
            ]
          }]
        }
        dispatch(actions.addGoods({
          ...values,
          goodsTypeName: this.props.goodsType.filter(item => item.value === values.goodsType)[0].name,
          shortName: '',
          goodsSkuList: goodsSkuList,
          skuSpecModelList: skuSpecModelList,
          goodsAttrSpecList: goodsAttrSpecList,
          goodsImgInfo: goodsImgInfo
        }))
      }
    })
  }

  // 添加规格选择器
  _specKey = 1
  _addSpecSelector = () => {
    this.setState(prevState => ({
      skuSpecList: prevState.skuSpecList.concat({
        key: this._specKey++,
        specCatgNo: '',
        specCatgName: '',
        specList: []
      })
    }))
  }

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

  // 获取表单提交数据
  getGoodsArg = (values) => {
    return {
      userName: values['number']
    }
  }

  _handleCatgChange = (value, record, key) => {
    let finalSkuSpec = {
      specCatgNo: '',
      specCatgName: ''
    }
    if (!isEmpty(value)) {
      finalSkuSpec = { ...value[0] }
    }
    const finalSkuSpecList = this.state[key].map(item => {
      return item.key === record.key ? { ...item, ...finalSkuSpec, specList: [] } : item
    })

    this.setState({
      [key]: finalSkuSpecList
    })

    // this.setState({
    //   skuSpecList: [{
    //     specCatgNo: value,
    //     specList: []
    //   }]
    // })
  }

  _handleSpecChange = (value, record, key) => {
    const finalSkuSpecList = this.state[key].map(item => {
      return item.key === record.key ? { ...item, specList: value } : item
    })
    this.setState({
      [key]: finalSkuSpecList
    })
  }

  _handleDelete = (record, key) => {
    this.setState(prevState => ({
      [key]: prevState[key].filter(item => item.key !== record.key)
    }))
  }

  // childGoodsCatgList
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

  saveValue = (index, key, value, prevState) => {
    if (!prevState.tableData[index]) {
      prevState.tableData[index] = {}
    }
    prevState.tableData[index][key] = value
  }

  _handleCellChange = (index, key, value) => {
    this.setState((prevState) => {
      if (key instanceof Array) {
        key.forEach(item => {
          this.saveValue(index, item, value, prevState)
        })
      } else {
        this.saveValue(index, key, value, prevState)
      }
      return {
        tableData: prevState.tableData
      }
    })
  }

  _revertVisible = key => {
    this.setState(prevState => ({
      [key]: !prevState[key]
    }))
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

  _selectAll = () => {
    this.props.form.resetFields(['seasonFactorList'])
    this.props.form.setFieldsValue({
      seasonFactorList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C']
    })
  }

  render() {
    const { form, goodsCategoryList, goodsType, stockUnit, specCategoryList, dispatch, aliToken, showButtonSpin } = this.props
    const { skuSpecList, coverImages, goodImages, detailImages, goodsDesc, previewVisible, previewImage, propertyList, showSpec, showDetail } = this.state
    const { getFieldDecorator } = form
    return (
      <div className={styles.goods_center}>
        <Form
          onSubmit={e => this._handleSubmit(e)}
        >
          <FormItem className='operate-btn'>
            <Button
              type='primary'
              title='点击保存'
              htmlType='submit'
              loading={showButtonSpin}
            >
              保存
            </Button>
            <Button
              title='点击取消'
              onClick={() =>
                history.go(-1)
              }
            >
              取消
            </Button>
          </FormItem>
          <Card
            title={<span className={styles['card-tit']}>基础信息</span>}
            className={styles['card-wrapper']}
          >
            <Row>
              <Col>
                <Row>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label={'货物分类'}
                    >
                      <div
                        id='goodsCatgNo'
                        style={{ position: 'relative', marginBottom: '5px' }}
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
                        })(
                          <TreeSelect
                            showSearch
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder='请选择货物分类'
                            allowClear
                            treeNodeFilterProp='title'
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
                                      goodsCatgStep={item.goodsCatgStep}
                                    >
                                      {
                                        item.childGoodsCatgList.map(i => {
                                          if (i.childGoodsCatgList && !isEmpty(i.childGoodsCatgList)) {
                                            return (
                                              <TreeNode
                                                value={i.goodsCatgNo}
                                                title={i.goodsCatgName}
                                                key={i.goodsCatgNo}
                                                goodsCatgStep={i.goodsCatgStep}
                                              >
                                                {
                                                  i.childGoodsCatgList.map(ele => {
                                                    return (
                                                      <TreeNode
                                                        value={ele.goodsCatgNo}
                                                        title={ele.goodsCatgName}
                                                        key={ele.goodsCatgNo}
                                                        goodsCatgStep={ele.goodsCatgStep}
                                                      >
                                                        {
                                                          ele.childGoodsCatgList && ele.childGoodsCatgList.map(last => {
                                                            return (
                                                              <TreeNode
                                                                value={last.goodsCatgNo}
                                                                title={last.goodsCatgName}
                                                                key={last.goodsCatgNo}
                                                                goodsCatgStep={last.goodsCatgStep}
                                                              />
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
                      label='货物编码：'
                    >
                      <Input
                        disabled={true}
                      />
                    </FormItem>
                  </Col>

                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='货物名称：'
                    >
                      {getFieldDecorator('goodsName', {
                        rules: [{
                          required: true,
                          whitespace: true,
                          message: '请填写货物名称',
                        }],
                        initialValue: ''
                      })(
                        <Input
                          placeholder='请输入货物名称'
                          maxLength='30'
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='货物类型：'
                    >
                      <div
                        id='goodsType'
                        style={{ position: 'relative', marginBottom: '5px' }}
                      >
                        {getFieldDecorator('goodsType', {
                          rules: [{
                            required: true,
                            message: '请选择货物类型',
                          }]
                        })(
                          <Select
                            allowClear
                            showSearch={false}
                            placeholder='请选择货物类型'
                            filterOption={false}
                            required={true}
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
                      label='库存单位：'
                    >
                      <div
                        id='goodsUnit'
                        style={{ position: 'goodsUnit', marginBottom: '5px' }}
                      >
                        {getFieldDecorator('goodsUnit', {
                          rules: [{
                            required: true,
                            message: '请选择库存单位!'
                          }]
                        })(
                          <Select
                            allowClear
                            showSearch={false}
                            placeholder='请选择库存单位'
                            filterOption={false}
                            required={true}
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
                          initialValue: '1',
                          rules: [{
                            required: true,
                            message: '请选择货物状态!'
                          }]
                        })(
                          <Select
                            allowClear
                            placeholder='请选择货物状态'
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
                          initialValue: '0',
                          rules: [{
                            required: true,
                            message: '请选择货物特性!'
                          }]
                        })(
                          <Select
                            allowClear
                            placeholder='请选择货物特性'
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
                      label='保质期(天)：'
                    >
                      {getFieldDecorator('shelfLife', {
                        initialValue: ''
                      })(
                        <InputNumber
                          placeholder='请输入保质期'
                          style={{ width: '100%' }}
                          precision={0}
                          min={1}
                          max={99999}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='品牌名称：'
                    >
                      {getFieldDecorator('brandName', {
                        rules: [{
                          whitespace: true,
                          message: '请填写品牌名称',
                        }],
                        initialValue: ''
                      })(
                        <Input
                          placeholder='请输入品牌名称'
                          maxLength='20'
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='箱规：'
                    >
                      {getFieldDecorator('boxSpec', {
                        initialValue: '',
                        rules: [{
                          pattern: /^[1-9]\d*$/,
                          message: '请输入大于0的正整数,最多五位！'
                        }]
                      })(
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder='请输入箱规'
                          maxLength='5'
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formItemLayout}
                      label='一级产地：'
                    >
                      {getFieldDecorator('productionPlaceLv1')(
                        <Input
                          placeholder='请输入一级产地'
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
                      {getFieldDecorator('productionPlaceLv2')(
                        <Input
                          placeholder='请输入二级产地'
                          maxLength='10'
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='等级：'
                >
                  {getFieldDecorator('goodsLevel', {
                    initialValue: ''
                  })(
                    <Input
                      placeholder='请输入等级'
                      maxLength='10'
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={7}>
                <FormItem
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 15 }}
                  label='季节因子：'
                >
                  <div
                    id='seasonFactorList'
                    style={{ position: 'relative' }}
                  >
                    {getFieldDecorator('seasonFactorList')(
                      <Select
                        mode='multiple'
                        allowClear={true}
                        placeholder='请选择季节因子'
                        getPopupContainer={() => document.getElementById('seasonFactorList')}
                      >
                        {SeasonFactorChildren}
                      </Select>
                    )}
                  </div>
                </FormItem>
              </Col>
              <Col span={1} style={{ marginTop: 8, paddingLeft: 10 }} >
                <span>
                  <a onClick={this._selectAll}>全部</a>
                </span>
              </Col>
            </Row>
          </Card>
          <Card
            title={<span className={styles['card-tit']}>货物规格</span>}
            className={styles['card-wrapper']}
          >
            {
              skuSpecList.map((m, i) => {
                return (
                  <SpecItem
                    key={m.key}
                    catgList={specCategoryList}
                    data={m}
                    selected={skuSpecList.concat(propertyList).map(item => item.specCatgNo)}
                    dispatch={dispatch}
                    onCatgChange={value => this._handleCatgChange(value, m, 'skuSpecList')}
                    onSpecChange={value => this._handleSpecChange(value, m, 'skuSpecList')}
                    onDelete={() => this._handleDelete(m, 'skuSpecList')}
                  />
                )
              })
            }

            {
              skuSpecList.length < 3 && skuSpecList.filter(item => item.specCatgNo === '').length < 1 &&
              <Button
                type='primary'
                onClick={this._addSpecSelector}
              >
                添加规格
              </Button>
            }
            <SpecTable
              handleCellChange={this._handleCellChange}
              data={skuSpecList}
              tableData={this.state.tableData}
              getFinalData={this._getFinalData}
            />
          </Card>
          <Card
            title={<span className={styles['card-tit']}>货物属性</span>}
            className={styles['card-wrapper']}
            extra={
              <Tooltip
                placement='top'
                title={<span>添加货物属性</span>}
                onClick={() => this._revertVisible('showSpec')}
              >
                <a
                  href='javascript:;'
                  style={{ fontSize: '20px' }}
                >
                  { this.state.showSpec ? <Icon type='up' /> : <Icon type='down' /> }
                </a>
              </Tooltip>
            }
          >
            {
              showSpec && propertyList.map((m, i) => {
                return (
                  <SpecItem
                    key={m.key}
                    catgList={specCategoryList}
                    data={m}
                    selected={propertyList.concat(skuSpecList).map(item => item.specCatgNo)}
                    dispatch={dispatch}
                    onCatgChange={value => this._handleCatgChange(value, m, 'propertyList')}
                    onSpecChange={value => this._handleSpecChange(value, m, 'propertyList')}
                    onDelete={() => this._handleDelete(m, 'propertyList')}
                  />
                )
              })
            }
            {
              showSpec && propertyList.length < 10 && propertyList.filter(item => item.specCatgNo === '').length < 1 &&
              <Button
                type='primary'
                onClick={this._addPropertyListSelector}
              >
                添加规格
              </Button>
            }
          </Card>

          <Card
            title={<span className={styles['card-tit']}>货物详情</span>}
            className={styles['card-wrapper']}
            extra={
              <Tooltip
                placement='top'
                title={<span>添加货物详情</span>}
                onClick={() => this._revertVisible('showDetail')}
              >
                <a
                  href='javascript:;'
                  style={{ fontSize: '20px' }}
                >
                  { this.state.showDetail ? <Icon type='up' /> : <Icon type='down' /> }
                </a>
              </Tooltip>
            }
          >
            {
              showDetail &&
              <Row
                justify='start'
                type='flex'
              >
                <Col span={17}>
                  <FormItem
                    {...specFormItemLayout}
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
                        aliToken={aliToken}
                        rootPath='retail'
                        fileList={coverImages}
                        accept='image/jpg, image/jpeg, image/png'
                      >
                        {coverImages.length >= 1 ? null : uploadButton}
                      </GoodsUpload>
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
                        aliToken={aliToken}
                        rootPath='retail'
                        fileList={goodImages}
                        accept='image/jpg, image/jpeg, image/png'
                      >
                        {goodImages.length >= 6 ? null : uploadButton}
                      </GoodsUpload>
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
                      <GoodsUpload
                        listType='picture-card'
                        onPreview={this._handlePreview}
                        beforeUpload={this._beforeUpload}
                        onChange={this._handleDetailChange}
                        onRemove={this._handleDetailRemove}
                        aliToken={aliToken}
                        rootPath='retail'
                        fileList={detailImages}
                        accept='image/jpg, image/jpeg, image/png'
                      >
                        {detailImages.length >= 6 ? null : uploadButton}
                      </GoodsUpload>
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
                    label='货物说明：'
                  >
                    {getFieldDecorator('goodsDesc', {
                      initialValue: goodsDesc
                    })(
                      <TextArea
                        rows={4}
                        maxLength='500'
                        onChange={e => this.setState({ goodsDesc: e.target.value })}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
            }
          </Card>
          {
            previewVisible &&
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
          }
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    info: state.baseUser.userInfo,
    roleList: state.baseUser.roleList,
    orgList: state.baseUser.orgList,
    posList: state.baseUser.posList,
    selectFetchingFlag: state.baseUser.selectFetchingFlag,
    goodsCategoryList: state.purchase.goods.center.goodsCategoryList,
    goodsType: state.purchase.goods.center.codeList.goodsType,
    stockUnit: state.purchase.goods.center.codeList.stockUnit,
    // specCategoryList: state.supplyChain.goods.center.specCategoryList,
    specCategoryList: state.purchase.goods.spec.catg,
    specSelectorData: state.purchase.goods.center.specSelectorData,
    // specChildList: state.supplyChain.goods.center.specChildList,
    aliToken: state.common.aliToken,
    showDetail: state.purchase.goods.center.showDetail,
    showSpec: state.purchase.goods.center.showSpec,
    showButtonSpin: state.common.showButtonSpin
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Add))
