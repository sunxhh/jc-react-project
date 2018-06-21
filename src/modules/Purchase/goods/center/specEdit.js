import React, { Component } from 'react'
import { Card, Table, Button } from 'antd'
import { connect } from 'react-redux'

import Sku from 'Components/sku'
import { getCenterDetail, saveGoodsSpec } from './reduck'
import { isEmpty } from 'Utils/lang'

import { getSpecCatgList, getSpecDetailList } from '../spec/reduck'

// const flatten = Sku.flatten

class SpecEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      goodsNo: this.props.match.params.id,
      skuData: [],
      replaceSku: []
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(getCenterDetail({ goodsNo: this.state.goodsNo }))
  }

  _handleSkuChange = (value) => {
    this.setState({
      skuData: value
    })
  }

  _handleReplaceChange = (oldObj, newObj) => {
    const { replaceSku } = this.state
    let isNew = true
    const newReplaceSku = replaceSku.map(item => {
      if (item.sourceSpec.specNo === newObj.specNo && item.targetSpec.specNo === oldObj.specNo) {
        isNew = false
        return null
      } else if (item.sourceSpec.specNo !== newObj.specNo && item.targetSpec.specNo === oldObj.specNo) {
        isNew = false
        item.targetSpec = newObj
        return item
      } else if (item.sourceSpec.specNo === newObj.specNo && item.targetSpec.specNo !== oldObj.specNo) {
        isNew = false
        item.sourceSpec = oldObj
        return item
      }
      return item
    })
    if (isNew) {
      newReplaceSku.unshift({ sourceSpec: oldObj, targetSpec: newObj })
    }
    console.log(newReplaceSku.filter(item => !!item))
    this.setState({
      replaceSku: newReplaceSku.filter(item => !!item)
    })
  }

  _genColumns = () => {
    const { goodsSkuList } = this.props
    const _columns = [
      {
        title: 'SKU编码',
        dataIndex: 'skuNo',
      },
      {
        title: '条形码',
        dataIndex: 'barNo',
      },
      {
        title: '重量（g）',
        dataIndex: 'weight',
      },
      {
        title: '体积（cm³）',
        dataIndex: 'volume',
      },
    ]
    let arr = []
    if (goodsSkuList && !isEmpty(goodsSkuList)) {
      if (goodsSkuList[0].skuSpecs && !isEmpty(goodsSkuList[0].skuSpecs)) {
        arr = goodsSkuList[0].skuSpecs && goodsSkuList[0].skuSpecs.map((item) => {
          return {
            title: item.specCatgName,
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
      render: (text, record, index) => index + 1
    }, ...arr, ..._columns]
  }

  _getTableData = () => {
    const { goodsSkuList } = this.props
    const { replaceSku } = this.state
    if (!goodsSkuList) {
      return []
    }
    const finalGoodsSkuList = goodsSkuList.map((item) => {
      let obj = {}
      let skuSpecs = item.skuSpecs
      let specNo = ''
      if (skuSpecs && !isEmpty(skuSpecs)) {
        for (let i = 0, len = skuSpecs.length; i < len; i++) {
          const specFilter = replaceSku.find(item => {
            return skuSpecs[i].specNo === item.sourceSpec.specNo
          })
          obj[`specName_${skuSpecs[i].specCatgNo}`] = specFilter ? specFilter.targetSpec.specName : skuSpecs[i].specName
          specNo += specFilter ? specFilter.targetSpec.specNo : skuSpecs[i].specNo
        }
      }

      return { ...item, ...obj, specNo }
    })
    return [...finalGoodsSkuList]
  }

  _renderExtre = () => {
    return (
      <div>
        <Button onClick={() => history.go(-1)}>取消</Button>
        <Button
          type='primary'
          onClick={() => {
            this.props.dispatch(saveGoodsSpec({ goodsNo: this.state.goodsNo, replaceSpecList: this.state.replaceSku.map(item => {
              return {
                sourceSpecNo: item.sourceSpec.specNo,
                targetSpecNo: item.targetSpec.specNo,
              }
            }) }))
          }}
        >保存
        </Button>
      </div>
    )
  }

  render() {
    const { dispatch, skuSpecModelList } = this.props
    return (
      <div>
        <Card
          title='规格设置'
          extra={this._renderExtre()}
        >
          <Sku
            editable={{ groupEditable: false, containerAddable: false, containerDeleteable: false, containerReplaceable: true }}
            optionValue='specCatgNo'
            optionText='specCatgName'
            childOptionValue='specNo'
            childOptionText='specName'
            leafOptionValue='specDetailList'
            onFetchGroup={() => {
              return dispatch(getSpecCatgList({}))
            }}
            onFetchSKU={specCatgNo => {
              return dispatch(getSpecDetailList({ specCatgNo }))
            }}
            value={skuSpecModelList}
            onChange={this._handleSkuChange}
            onReplaceChange={this._handleReplaceChange}
          />
          <Table
            columns={this._genColumns()}
            dataSource={this._getTableData()}
            rowKey='specNo'
            pagination={false}
          />
        </Card>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    cardLoading: state.common.showListSpin,
    goodsSkuList: state.purchase.goods.center.goodsSkuList,
    skuSpecModelList: state.purchase.goods.center.skuSpecModelList,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(SpecEdit)
