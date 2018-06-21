/**
 * Created with webstorm
 * User: HuangZeXia / huangzexiameishu@163.com
 * Date: 2018/3/5
 * Time: 上午9:28
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button, Card, Radio, Icon, Tree } from 'antd'
import * as actions from './reduck'
import styles from './index.less'
import { queryOrgByLevel } from 'Global/action'

const TreeNode = Tree.TreeNode
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
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      warehouseNo: '',
      hideCity: false,
      provinces: [],
      cityState: false,
      disabledSave: true
    }
  }

  componentDidMount() {
    const { dispatch, orgLevel } = this.props
    dispatch(actions.getSupllyWareHouseList())
    // 获取组织
    orgLevel === '' && dispatch(queryOrgByLevel())
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.getWareHouseCityList !== nextProps.getWareHouseCityList) {
      this.setState({
        provinces: nextProps.getWareHouseCityList.map(province => ({
          ...province,
          cities: province.cities.filter(city => city.selected === 1)
        }))
      })
    }
  }

  // 城市操作
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    })
  }
  onCheck = (checkedKeys, e) => {
    let checkedNodes = e.checkedNodes
    let halfCheckedKeys = e.halfCheckedKeys
    let provinces = []

    const { getWareHouseCityList } = this.props
    getWareHouseCityList && getWareHouseCityList.map((item) => {
      // 过滤半选中状态（皆为省份）
      halfCheckedKeys.map((key) => {
        let prov = {}
        let citys = []
        if (item.provinceNo === key) {
          item.cities.map((city) => {
            checkedNodes.map((check) => {
              let currCity = {}
              if (check.key === city.cityNo) {
                currCity.cityNo = city.cityNo
                currCity.cityName = city.cityName
                citys.push(currCity)
              }
            })
          })
          prov.provinceNo = item.provinceNo
          prov.provinceName = item.provinceName
          prov.cities = citys
          provinces.push(prov)
        }
      })

      // 过滤选中状态节点中的所有省份，并将该省份下的所有城市selected状态置为1
      checkedNodes.map((check) => {
        if (item.provinceNo === check.key) {
          provinces.push({
            provinceNo: item.provinceNo,
            provinceName: item.provinceName,
            cities: item.cities
          })
        }
      })

      item.cities.map(city => {
        if (city.selected !== 2) {
          city.selected = 0
        }
        checkedNodes.forEach(node => {
          if (node.key === city.cityNo) {
            city.selected = 1
          }
        })
      })
    })

    this.setState({
      checkedKeys,
      provinces: provinces
    })
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.cities && item.cities.length > 0) {
        const newCity = item.cities.map((key) => {
          return {
            provinceNo: key.cityNo,
            provinceName: key.cityName,
            selected: key.selected
          }
        })
        return (
          <TreeNode
            title={item.provinceName}
            key={item.provinceNo}
            dataRef={item}
            value={item.provinceNo}
          >
            {this.renderTreeNodes(newCity)}
          </TreeNode>
        )
      }
      return (
        <TreeNode
          title={item.provinceName}
          key={item.provinceNo}
          dataRef={item}
          value={item.provinceNo}
          disabled={item.selected === 2}
        />
      )
    })
  }

  // 获取仓库值
  _onChangeRadio = (e) => {
    const { dispatch } = this.props
    this.setState({
      warehouseNo: e.target.value,
      disabledSave: false
    })
    dispatch(actions.wareHouseCity({
      warehouseNo: e.target.value
    }))
  }

  // 仓库刷新
  _refurbishWareHouseList = () => {
    const { dispatch } = this.props
    dispatch(actions.refurbishWareHouseList())
  }

  // 保存
  _saveBindCity = () => {
    const { dispatch } = this.props
    const { warehouseNo, provinces } = this.state

    dispatch(actions.wareHouseBindCity({
      warehouseNo: warehouseNo,
      provinces: provinces
    })).then(res => {
      if (res === 0) {
        dispatch(actions.wareHouseCity({
          warehouseNo: this.state.warehouseNo
        }))
      }
    })
  }
  render() {
    const { wareHouseList, getWareHouseCityList, match, auths } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    let checkArr = []
    getWareHouseCityList.map(item => {
      if (item.cities.length > 0) {
        item.cities.map(key => {
          if (key.selected === 1) {
            checkArr.push(key.cityNo)
          }
        })
      }
    })
    return (
      <div>
        <Row>
          <Col
            span={8}
            style={{ marginRight: 10 }}
          >
            <Card
              className={styles['card']}
              title='仓库部门'
              actions={[<Icon key={'cardaction1'} type='reload' onClick={this._refurbishWareHouseList} />]}
            >
              <div className={styles['shop-list']}>
                <RadioGroup onChange={this._onChangeRadio}>
                  {
                    wareHouseList && wareHouseList.map(key => {
                      return (
                        <Radio
                          style={radioStyle}
                          value={key.warehouseNo}
                          key={key.warehouseNo}
                        >
                          { key.warehouseName }
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
                <p><Icon type='folder-open' />&nbsp;&nbsp;行政区域</p>
                <div
                  className={styles['out-line']}
                >
                  {
                    getWareHouseCityList.length > 0 ? (
                      <Tree
                        checkable={true}
                        onExpand={this.onExpand}
                        expandedKeys={this.state.expandedKeys}
                        autoExpandParent={this.state.autoExpandParent}
                        onCheck={this.onCheck}
                        checkedKeys={checkArr}
                        // selectedKeys={this.state.selectedKeys}
                      >
                        {this.renderTreeNodes(getWareHouseCityList)}
                      </Tree>
                    ) : '暂无数据'
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
                  onClick={this._saveBindCity}
                  disabled={this.state.disabledSave}
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
    wareHouseList: state.supplyChain.supplyOrder.wareHouseList,
    addHouseList: state.supplyChain.supplyOrder.addHouseList,
    getWareHouseCityList: state.supplyChain.supplyOrder.getWareHouseCityList,
    auths: state.common.auths,
    orgLevel: state.common.orgLevel,
    showListSpin: state.common.showListSpin,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)((BindShop))

