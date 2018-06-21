/**
 * Created with webstorm
 * User: HuangZeXia / huangzexiameishu@163.com
 * Date: 2018/3/5
 * Time: 上午9:24
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button, Card, Radio, Icon, Tooltip, Checkbox, message, Popconfirm } from 'antd'
import { showModalWrapper } from '../../../components/modal/ModalWrapper'
import styles from './index.less'
import * as actions from './reduck'
import { queryOrgByLevel } from 'Global/action'
import BindShopModal from './bindShopModal'

const RadioGroup = Radio.Group

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
}

class BindShop extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expandedKeys: ['0-0-0', '0-0-1'],
      autoExpandParent: true,
      selectedKeys: [],
      delShopId: '',
      shopId: '',
      shopName: '',
      warehouses: [],
      disabledSave: true
    }
  }

  componentDidMount() {
    const { dispatch, orgLevel } = this.props
    dispatch(actions.supplyShopList({
      shopType: '1'
    }))
    dispatch(actions.supplyCreateShop({
      shopName: ''
    }))
    // 获取组织
    orgLevel === '' && dispatch(queryOrgByLevel())
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.getShopHouseList !== nextProps.getShopHouseList) {
      this.setState({
        warehouses: nextProps.getShopHouseList.filter(item => item.selected === 1)
      })
    }
  }

  // 店铺添加弹窗
  _showModal = (e) => {
    e.preventDefault()
    showModalWrapper((
      <BindShopModal
        handleSelect={(record) => {
          const { dispatch } = this.props
          dispatch(actions.saveShop({
            shopId: record.shopNumber,
            shopName: record.shopName,
            shopType: '1'
          }))
        }}
      />
    ), {
      title: '添加店铺',
      width: 800
    })
  }

  // 删除仓库
  _delShop = () => {
    const { dispatch } = this.props
    const { delShopId } = this.state
    if (delShopId === '') {
      message.warn('请选择一个店铺')
      return
    }
    dispatch(actions.delShop({
      shopId: delShopId
    }))
    this.setState({
      disabledSave: true
    })
  }

  // 获取店铺值
  _getShopId = (e) => {
    const { dispatch } = this.props
    this.setState({
      delShopId: e.target.value,
      disabledSave: false
    })
    dispatch(actions.getShopWareHouse({
      shopId: e.target.value
    }))
  }

  // 仓库选择
  _checkHouse = (e) => {
    // debugger
    const warehouses = []
    this.props.getShopHouseList.map(item => {
      if (item.warehouseNo === e.target.value) {
        item.selected = e.target.checked ? 1 : 0
        return item
      }
    })

    this.props.getShopHouseList.map(item => {
      if (item.selected === 1) {
        let warehouse = {
          warehouseNo: item.warehouseNo,
          warehouseName: item.warehouseName
        }
        warehouses.push(warehouse)
      }
    })

    this.setState({
      warehouses: warehouses
    })
  }

  // 保存绑定
  _saveBind = () => {
    const { dispatch } = this.props
    const { warehouses, delShopId } = this.state
    dispatch(actions.bindShopHouse({
      shopId: delShopId,
      warehouses: warehouses
    })).then(res => {
      if (res === 0) {
        dispatch(actions.getShopWareHouse({
          shopId: delShopId
        }))
      }
    })
  }

  _handlerFinalActions = (data) => {
    let result = []
    const add = (
      <Tooltip title='点击添加店铺'>
        <Icon
          key='plus'
          type='plus'
          title='点击添加店铺'
          onClick={this._showModal}
        />
      </Tooltip>
    )
    const minus = (
      <Tooltip title='删除店铺'>
        <Popconfirm
          key='minus'
          title='你确定删除此店铺吗？'
          onConfirm={this._delShop}
          okText='确定'
          cancelText='取消'
        >
          <Icon
            type='minus'
            title='删除店铺'
          />
        </Popconfirm>
      </Tooltip>
    )
    if (data.includes('add')) {
      result.push(add)
    }
    if (data.includes('delete')) {
      result.push(minus)
    }
    return result
  }

  render() {
    const { getSupplyShopList, getShopHouseList, match, auths } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []

    const finalActions = this._handlerFinalActions(btnRole)

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
              actions={finalActions}
            >
              <div className={styles['shop-list']}>
                <RadioGroup onChange={this._getShopId} >
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
                <p><Icon type='folder-open' />&nbsp;&nbsp;仓库部门</p>
                <div className={styles['out-line']}>
                  {
                    getShopHouseList && getShopHouseList.map((item) => {
                      return (
                        <p
                          style={{ marginBottom: 10, paddingLeft: 10 }}
                          key={item.warehouseNo}
                        >
                          <Checkbox
                            onChange={this._checkHouse}
                            key={item.warehouseNo}
                            value={item.warehouseNo}
                            warehouseName={item.warehouseName}
                            checked={(!this.state.disabledSave && item.selected === 1) ? Boolean(1) : Boolean(0)}
                          >{item.warehouseName}</Checkbox>
                        </p>
                      )
                    })
                  }
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        <Row
          style={{ marginTop: 30, textAlign: 'center' }}
        >
          <Col>
            {
              btnRole.includes('save') && (
                <Button
                  type='primary'
                  disabled={this.state.disabledSave}
                  onClick={this._saveBind}
                >
                  保存
                </Button>
              )
            }
          </Col>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    getSupplyShopList: state.supplyChain.supplyOrder.getSupplyShopList,
    getAllSupplyShopList: state.supplyChain.supplyOrder.getAllSupplyShopList,
    getShopHouseList: state.supplyChain.supplyOrder.getShopHouseList,
    auths: state.common.auths,
    orgLevel: state.common.orgLevel,
    showListSpin: state.common.showListSpin
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)((BindShop))

