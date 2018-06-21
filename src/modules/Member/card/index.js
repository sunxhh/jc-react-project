import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
import { push } from 'react-router-redux'
import { Button, Table, message } from 'antd'
import { Link } from 'react-router-dom'
import { MEMBER_CARD_ADD, MEMBER_CARD_EDIT, MEMBER_CARD_MEMBER_LIST } from 'Global/urls'
import Module from './module'
import styles from './styles.less'
import { isEmpty } from 'Utils/lang'
import ParentModule from '../module'

const CardKind = [
  { cardKind: 0, cardKindName: '无门槛类' },
  { cardKind: 1, cardKindName: '购买类' }
]

const CardStatus = [
  { status: 0, name: '未启用' },
  { status: 1, name: '已启用' }
]
class MemberCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasInitParam: false
    }
  }

  componentDidMount() {
    const { dispatch, userInfo } = this.props
    let orgCode = userInfo['orgCode']
    let orgLevel = userInfo.orgLevel
    this.setState({
      orgCode: orgCode
    })
    if (orgLevel === '0') {
      dispatch(Module.actions.getCardList({ orgCode: '' }))
    } else if ((orgLevel === '1')) {
      dispatch(Module.actions.getCardList({ orgCode: orgCode }))
    } else if ((orgLevel === '2')) {
      dispatch(ParentModule.actions.getIndustryAndOrgList({ org: { orgCode }})).then(res => {
        if (res.status === 'success') {
          if (!isEmpty(res.result)) {
            let fromOrgId = ''
            if (orgLevel !== '0') {
              fromOrgId = res.result[0].orgs[0].orgCode
              dispatch(Module.actions.getCardList({ orgCode: fromOrgId }))
            }
          }
        }
      })
    }
  }

  // 列表Table Columns信息
  _columns = [
    {
      key: 'title',
      title: '会员卡名称',
      dataIndex: 'title'
    },
    {
      key: 'cardKind',
      title: '会员卡类型',
      dataIndex: 'cardKind',
      render: (text, record) => {
        let cardkindArr = CardKind.filter(item => item && item.cardKind === record.cardKind)
        return !isEmpty(cardkindArr) ? cardkindArr[0].cardKindName : ''
      }
    },
    {
      key: 'count',
      title: '已开卡',
      dataIndex: 'count'
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render: (text, record) => {
        let statusArr = CardStatus.filter(item => item && item.status === record.status)
        return (
          <span style={ record.status === 1 ? { color: 'green' } : { color: '#CC6633' } }>
            {
              !isEmpty(statusArr) ? statusArr[0].name : ''
            }
          </span>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      render: (text, record) => {
        const { auths, match, userInfo } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        const orgLevels = ['0', '1']
        const orgLevel = userInfo['orgLevel']
        return (
          <div>
            {
              <div className={styles['table-option']}>
                {
                  btnRole.includes('edit') && orgLevels.includes(orgLevel) &&
                  <a onClick={ () => { this._checkEditButton(record) }}>
                    编辑
                  </a>
                }
                {
                  btnRole.includes('active') && orgLevels.includes(orgLevel) &&
                  (
                    record.status === 0
                      ? <a href='javascript:;' onClick={() => { this._active(record, 1) }}>启用</a>
                      : <a href='javascript:;' onClick={() => { this._active(record, 0) }}>下架</a>
                  )
                }
                {
                  btnRole.includes('check') &&
                  <Link to={`${MEMBER_CARD_MEMBER_LIST}/${record.cardId}`}>
                    查看会员
                  </Link>
                }
              </div>
            }
          </div>
        )
      }
    }
  ]

  // 激活
  _active = (record, optionStatus) => {
    const { userInfo } = this.props
    this.props.dispatch(Module.actions.active({ cardId: record.cardId, status: optionStatus })).then(res => {
      if (res.status) {
        let orgLevel = userInfo.orgLevel
        if (orgLevel === '0') {
          this.props.dispatch(Module.actions.getCardList({ orgCode: '' }))
        } else {
          this.props.dispatch(Module.actions.getCardList({ orgCode: this.state.orgCode }))
        }
      }
    })
  }

  _checkEditButton = (record) => {
    if (record.status === 0) {
      this.props.dispatch(push(`${MEMBER_CARD_EDIT}/${record.cardId}`))
    } else if (record.status === 1) {
      message.error('已经启用必须下架才能编辑!')
    }
  }

  render() {
    const { cardList, showListSpin, auths, match, userInfo } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    const orgLevels = ['0', '1']
    const orgLevel = userInfo['orgLevel']
    return (
      <div>
        {
          orgLevels.includes(orgLevel) &&
          <div>
            {
              btnRole.includes('add') &&
              (
                <div className={styles['add-option']}>
                  <Link to={MEMBER_CARD_ADD}>
                    <Button type='primary' icon='plus-circle'>创建无门槛会员卡</Button>
                  </Link>
                </div>
              )
            }
          </div>
        }
        <Table
          className={styles['c-table-center']}
          bordered
          pagination={false}
          locale={{
            emptyText: '暂无数据'
          }}
          loading={showListSpin}
          columns={this._columns}
          rowKey='cardId'
          dataSource={cardList}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state['memberCenter.card'],
    showListSpin: state['common.showListSpin'],
    auths: state['common.auths'],
    userInfo: state['common.userInfo'],
  }
}

export default connect(['common.userInfo', 'common.auths', 'common.showListSpin', 'memberCenter.card'], mapStateToProps)(MemberCard)
