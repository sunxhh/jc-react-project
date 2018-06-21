/**
 * Created with webstorm
 * User: HuangZeXia / huangzexiameishu@163.com
 * Date: 2018/4/14
 * Time: 上午10:22
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button, Card, Radio, Icon, message } from 'antd'
import styles from './index.less'
import * as actions from './reduck'

const RadioGroup = Radio.Group

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
}

class ShopLogistic extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shopId: '',
      shopName: '',
      getLogisticsId: '',
      bindSource: '',
      disabledSave: true,
      visible: false
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(actions.supplyShopList({
      shopType: '1'
    }))
  }

  // 获取店铺的id加载对对于的物流公司
  _getShopId = (e) => {
    const { dispatch } = this.props
    this.setState({
      visible: false
    })
    dispatch(actions.getBindLogisticsList({
      shopId: e.target.value
    })).then(res => {
      let newLogisticsId = ''
      res && res.map(item => {
        if (item.selected === 1) {
          newLogisticsId = item.logisticsId
        }
      })
      this.setState({
        disabledSave: false,
        bindSource: res,
        shopId: e.target.value,
        getLogisticsId: newLogisticsId,
        visible: true
      })
    })
  }

  // 获取物流公司公司的值
  _getLogisticsId = (e) => {
    const { bindSource } = this.state
    const newBindSource = bindSource.map(item => {
      item.selected = (item.logisticsId === e.target.value) ? 1 : 0
      return item
    })

    this.setState({
      bindSource: newBindSource,
      getLogisticsId: e.target.value
    })
  }
  // 刷新店铺
  _refurbish = () => {
    const { dispatch } = this.props
    dispatch(actions.supplyShopList({
      shopType: '1'
    })).then(res => {
      if (res === 0) {
        message.success('刷新成功！')
      }
    })
  }

  // 保存
  _saveBind = () => {
    const { dispatch } = this.props
    const { shopId, getLogisticsId } = this.state
    dispatch(actions.bindShopLogistics({
      shopId: shopId,
      logisticsId: getLogisticsId
    }))
  }
  render() {
    const { getSupplyShopList } = this.props
    const { bindSource, visible } = this.state
    return (
      <div>
        <Row>
          <Col
            span={8}
            style={{ marginRight: 10 }}
          >
            <Card
              className={styles['card']}
              title='店铺名称'
              actions={[<Icon key={'cardaction1'} type='reload' onClick={this._refurbish} />]}
            >
              <div className={styles['shop-list']}>
                <RadioGroup onChange={this._getShopId}>
                  {
                    getSupplyShopList && getSupplyShopList.map(key => {
                      return (
                        <Radio
                          style={radioStyle}
                          value={key.shopId}
                          key={key.shopId}
                        >
                          { key.shopName }
                        </Radio>
                      )
                    })
                  }
                </RadioGroup>
              </div>
            </Card>
          </Col>
          <Col span={15}>
            <Card
              className={styles['card']}
              title='已选择：'
            >
              <div className={styles['warehouse']}>
                <p><Icon type='folder-open' />&nbsp;&nbsp;物流公司</p>
                <div className={styles['out-line']}>
                  { visible && <RadioGroup onChange={this._getLogisticsId}>
                    {
                      bindSource && bindSource.map(key => {
                        return (
                          <Radio
                            style={radioStyle}
                            value={key.logisticsId}
                            key={key.logisticsId}
                            checked={key.selected === 1 ? Boolean(1) : Boolean(0)}
                          >
                            { key.logisticsName }
                          </Radio>
                        )
                      })
                    }
                  </RadioGroup>}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        <Row
          style={{ marginTop: 30, textAlign: 'center' }}
        >
          <Col>
            <Button
              type='primary'
              disabled={this.state.disabledSave}
              onClick={this._saveBind}
            >
              保存
            </Button>
          </Col>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    getSupplyShopList: state.supplyChain.logistics.getSupplyShopList,
    getLogisticsList: state.supplyChain.logistics.getLogisticsList,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)((ShopLogistic))
