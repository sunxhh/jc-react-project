import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { Button, Table, Form, Row, Col, Radio, DatePicker, Select, Input, Menu, Popconfirm, Popover, Modal, message, Divider } from 'antd'
import {
  getDutyList,
  getSexList,
  getDutyStatusList,
  addDuty,
  getDutyDetail,
  editDuty,
  dutyDelete,
  getBatchNameList,
  getNurseList,
  setQueryPar,
  resetQueryPar,
  getRoomAndService,
  serviceArrange,
} from './reduck'
import { getCenterList } from '../scheduleManage/reduck'
import { showModalForm } from '../../../../components/modal/ModalForm'
import styles from './styles.less'
import { isEmpty } from 'Utils/lang'
import { genPagination } from 'Utils/helper'

const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const SelectOption = Select.Option
const MenuItem = Menu.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

class DutyList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dutyInfo: {},
      modal: {
        title: '',
        visible: false,
        formItemLayout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 16 }
        }
      },
      serviceModal: {
        dutyInfo: {},
        title: '增加服务',
        visible: false,
        selectedDataSource: [],
        selectedTableIds: [],
        selectedTableRows: [],
        roomList: [],
        serviceList: [],
        loading: false,
        selectedRoom: { index: '', value: {}},
        selectedService: { index: '', value: {}},
      }
    }
  }

  static defaultProps = {
    centerList: [],
    nurseGrid: []
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(resetQueryPar())
    this._isMounted = false
  }

  // 生命周期， 初始化表格数据
  componentDidMount() {
    const { dispatch } = this.props
    this._isMounted = true
    document.querySelector('.ant-layout-content').style.background = '#f8f8f8'
    this._getList()
    dispatch(getDutyStatusList())
    dispatch(getSexList())
    dispatch(getCenterList()).then((data) => {
      if (this._isMounted && data.result.length > 0) {
        this.setState({ centerId: data.result[0].id, centerName: data.result[0].orgName }, () => {
          this._getList()
          dispatch(getBatchNameList({ centerId: data.result[0].id }))
          dispatch(getNurseList({ centerId: data.result[0].id }))
        })
      }
    })
  }

  _columns = [
    {
      key: 'key',
      title: '编号',
      dataIndex: 'key',
      render: (text, record, index) => {
        const { pageSize, current } = this.props.page
        return (
          <span>{(current - 1) * pageSize + index + 1}</span>
        )
      }
    },
    {
      key: 'centerName',
      title: '所在中心',
      dataIndex: 'centerName',
      render: (text, record) => (
        <span>{this._getCenterName(record.centerId)}</span>
      )
    },
    {
      key: 'titleName',
      title: '职位',
      dataIndex: 'titleName',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'planName',
      title: '班次名称',
      dataIndex: 'planName',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'nurseName',
      title: '姓名',
      dataIndex: 'nurseName',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'sex',
      title: '性别',
      dataIndex: 'sex',
      render: (text) => {
        const { sex } = this.props
        return (
          <span>{text !== null && this._getCodeName(sex, text.toString())}</span>
        )
      }
    },
    {
      key: 'phoneNumber',
      title: '手机号',
      dataIndex: 'phoneNumber',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'dutyTypeName',
      title: '值班状态',
      dataIndex: 'dutyTypeName',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'arrangeTime',
      title: '创建时间',
      dataIndex: 'arrangeTime',
      render: (text) => {
        return (
          <Popover
            placement='topRight'
            content={<div className={styles['pop']}>{moment(text).format('YYYY-MM-DD HH:mm')}</div>}
            title='创建时间'
          >
            <span>{moment(text).format('YYYY-MM-DD')}</span>
          </Popover>
        )
      }
    },
    {
      key: 'arrangeUserName',
      title: '创建人',
      dataIndex: 'arrangeUserName',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    }, {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 195,
      render: (text, record) => {
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        return (
          <div className={styles['table-ope']}>
            {
              btnRole.includes('check') &&
              <a
                href='javascript:;'
                onClick={(e) => { this._detailShowModal(e, record) }}
              >查看
              </a>
            }
            {
              btnRole.includes('check') && (
                (btnRole.includes('edit') && this._currentGtPlanDate(record)) ||
                (btnRole.includes('service') && record.onDutyType === 0) ||
                btnRole.includes('delete')) &&
                <Divider type='vertical' />
            }
            {
              btnRole.includes('edit') && this._currentGtPlanDate(record) &&
              <a
                href='javascript:;'
                onClick={(e) => { this._editShowModal(e, record) }}
              >编辑
              </a>
            }
            {
              btnRole.includes('edit') && this._currentGtPlanDate(record) && (
                (btnRole.includes('service') && record.onDutyType === 0) ||
                btnRole.includes('delete')) &&
                <Divider type='vertical' />
            }
            {
              (btnRole.includes('service') && record.onDutyType === 0) &&
              <a
                href='javascript:;'
                onClick={(e) => { this._showServiceModal(e, record) }}
              >增加服务
              </a>
            }
            {
              btnRole.includes('service') && record.onDutyType === 0 && btnRole.includes('delete') &&
                <Divider type='vertical' />
            }
            {
              btnRole.includes('delete') &&
              <Popconfirm
                title='确定要删除吗？'
                onConfirm={(e) => { this._handleDelete(e, record) }}
              >
                <a
                  href='javascript:;'
                >删除
                </a>
              </Popconfirm>
            }
          </div>
        )
      }
    }
  ]

  // 增加服务弹层 已选服务表格数据源
  _serviceModalcolumns = [
    {
      key: 'serviceName',
      title: '服务名称',
      dataIndex: 'serviceName',
      width: '80px',
      render: (text, record) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'roomNum',
      title: '服务房间',
      dataIndex: 'roomNum',
      width: '80px',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'customerList',
      title: '客户姓名',
      dataIndex: 'customerList',
      width: '80px',
      render: (arr) => (
        <span>{this._getModalCustomerName(arr)}</span>
      )
    }
  ]

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getParameter(current, pageSize)
    dispatch(getDutyList(arg))
  }

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.page.current, pageSize = this.props.page.pageSize) => {
    const { dispatch, form } = this.props
    const arg = form.getFieldsValue()
    const { centerId } = this.state
    dispatch(setQueryPar(arg))
    return {
      ...arg,
      centerId,
      currentPage: current,
      pageSize: pageSize,
    }
  }

  // 根据centerId获取centerName
  _getCenterName = (centerId) => {
    const { centerList } = this.props
    const center = centerList.find((item) => {
      return centerId === item.id
    })
    return center && center.orgName ? center.orgName : ''
  }

  // 点击查询
  _handleQuery = () => {
    this._getList(1)
  }

  // 禁用开始时间// 禁用开始时间
  _disabledStartDate = (dateStart) => {
    const { getFieldValue } = this.props.form
    const dateEnd = getFieldValue('arrEndTime')
    if (!dateStart || !dateEnd) {
      return false
    }
    return dateStart.valueOf() > dateEnd.valueOf()
  }

  _disabledEndDate = (dateEnd) => {
    const { getFieldValue } = this.props.form
    const dateStart = getFieldValue('arrStartTime')
    if (!dateEnd || !dateStart) {
      return false
    }
    return dateEnd.valueOf() <= dateStart.valueOf()
  }

  // 新增
  _addShowModal = (e) => {
    e.preventDefault()
    const { modal, centerId } = this.state
    const { form, dispatch } = this.props
    dispatch(getNurseList({ centerId }))
    dispatch(getBatchNameList({ centerId }))
    form.setFieldsValue({ centerId })
    this.setState({ modal: { ...modal, visible: true, title: '新增当值人员信息' }})
  }

  // 清除弹层表单
  _clearModalForm = () => {
    const { form } = this.props
    form.resetFields()
    this.setState({ dutyInfo: {}})
  }

  // 获取表单提交参数
  _getParam = (values, dutyInfo) => {
    const { centerList, batchNameList, nurseList } = this.props
    const center = centerList.find((item) => {
      return values.centerId === item.id
    })
    const nurse = nurseList.find((item) => {
      return values.nurseId === item.nurseId
    })
    const batch = batchNameList.find((item) => {
      return values.key === item.id
    })
    if (dutyInfo && dutyInfo.id) {
      values['id'] = dutyInfo.id
    }
    values['planName'] = batch && batch.planName
    values['centerName'] = center.orgName
    values['nurseName'] = nurse.nurseName
    return values
  }

  // 弹层提交（新增修改）
  _handleModalOk = (e, dutyInfo) => {
    e.preventDefault()
    const { dispatch, form } = this.props
    const { modal } = this.state
    form.validateFields((err, values) => {
      if (!err) {
        let submitHandle = dutyInfo && dutyInfo.id ? editDuty : addDuty
        dispatch(submitHandle(this._getParam(values, dutyInfo))).then(res => {
          if (res.status === 'success') {
            this._getList()
            this.setState({ modal: { ...modal, visible: false }})
            this._clearModalForm()
          }
        })
      }
    })
  }

  // 弹层取消（新增修改）
  _handleModalCancel = () => {
    const { modal } = this.state
    this.setState({ modal: { ...modal, visible: false }})
    this._clearModalForm()
  }

  // 弹层月子中心变化联动班次名称、当值人员
  _handleModalCenterChange = (centerId) => {
    const { dispatch, form } = this.props
    dispatch(getNurseList({ centerId }))
    dispatch(getBatchNameList({ centerId }))
    // 清空之前选中的班次名称、当值人员
    form.setFieldsValue({ nurseId: undefined, key: undefined })
  }

  // 详情
  _detailShowModal = (e, record) => {
    const { dispatch, sex } = this.props
    e.preventDefault()
    dispatch(getDutyDetail({
      id: record.id
    })).then(res => {
      const data = res.result
      showModalForm({
        formItemLayout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 16 }
        },
        title: '查看当值人员信息',
        okVisible: false,
        cancelText: '关闭',
        fields: [
          {
            id: 'centerId',
            props: {
              label: '所在中心：'
            },
            element: (
              <p className={styles['item-content']}>{this._getCenterName(data.centerId)}</p>
            )
          },
          {
            id: 'planName',
            props: {
              label: '班次名称：'
            },
            element: (
              <p className={styles['item-content']}>{data.planName}</p>
            )
          },
          {
            id: 'nurseName',
            props: {
              label: '姓名：'
            },
            element: (
              <p className={styles['item-content']}>{data.nurseName}</p>
            )
          },
          {
            id: 'sex',
            props: {
              label: '性别：'
            },
            element: (
              <p className={styles['item-content']}>{this._getCodeName(sex, data.sex)}</p>
            )
          },
          {
            id: 'phoneNumber',
            props: {
              label: '手机号：'
            },
            element: (
              <p className={styles['item-content']}>{data.phoneNumber}</p>
            )
          },
          {
            id: 'dutyTypeName',
            props: {
              label: '当值状态：'
            },
            element: (
              <p className={styles['item-content']}>{data.dutyTypeName}</p>
            )
          },
          {
            id: 'arrangeTime',
            props: {
              label: '创建时间：'
            },
            element: (
              <p className={styles['item-content']}>{moment(data.arrangeTime).format('YYYY-MM-DD HH:mm')}</p>
            )
          },
          {
            id: 'arrangeUserName',
            props: {
              label: '创建人：'
            },
            element: (
              <p className={styles['item-content']}>{data.arrangeUserName}</p>
            )
          },
          {
            id: 'remark',
            props: {
              label: '备注：'
            },
            element: (
              <p className={styles['item-content']}>
                {
                  <Popover
                    placement='topRight'
                    content={<div className={styles['pop']}>{data.remark}</div>}
                    title='备注'
                  >
                    <span>{data.remark && data.remark.length > 80 ? `${data.remark.substring(0, 80)}...` : data.remark}</span>
                  </Popover>
                }
              </p>
            )
          },
        ]
      })
    })
  }

  // 修改
  _editShowModal = (e, record) => {
    const { dispatch } = this.props
    const { modal } = this.state

    e.preventDefault()
    dispatch(getDutyDetail({
      id: record.id
    })).then(res => {
      const dutyInfo = res.result
      const centerId = dutyInfo.centerId
      dispatch(getNurseList({ centerId }))
      dispatch(getBatchNameList({ centerId }))
      this.setState({ dutyInfo }, () => {
        this.setState({ modal: { ...modal, visible: true, title: '编辑当值人员信息' }})
      })
    })
  }

  // 获取数据字典Name
  _getCodeName = (list, value) => {
    if (value !== null) {
      value = value.toString()
    }
    let data = {}
    if (isEmpty(list)) {
      return ''
    } else {
      data = list.find((item) => {
        return value === item.value
      })
    }

    if (data && data.name) {
      return data.name
    } else {
      return ''
    }
  }

  // 点击分页获取列表数据
  _handlePageChange = (pages) => {
    const { page } = this.props
    const arg = { current: page && page.pageSize !== pages.pageSize ? 1 : pages.current, pageSize: pages.pageSize }
    this._getList(arg.current, arg.pageSize)
  }

  // 删除
  _handleDelete = (e, record) => {
    const { dispatch, list, page } = this.props
    let length = list.length
    dispatch(dutyDelete({ id: record.id })).then((res) => {
      if (res.status === 'success') {
        if (length > 1) {
          this._getList()
        } else if (length === 1) {
          let current = page > 1 ? Number(page.current) - 1 : 1
          this._getList(current)
        }
      }
    })
  }

  // 当前日期与班次日期对比
  _currentGtPlanDate = (record) => {
    let curr = moment().toString()
    let endTime = ''
    if (record.planType === '3') {
      endTime = '23:59:59'
    } else {
      endTime = record.endTime
    }
    let planDate = moment(record.planDate).format('YYYY-MM-DD').toString() + ' ' + endTime
    return new Date(planDate).getTime() >= new Date(curr).getTime()
  }

  // 月子中心点击
  _handleMenuClick = (item) => {
    const { centerList, dispatch } = this.props
    const center = centerList.find((val) => {
      return val.id === item.key
    })
    this.setState({ centerId: center.id, centerName: center.orgName, toggleFlag: false }, () => {
      this._getList()
      dispatch(getBatchNameList({ centerId: center.id }))
      dispatch(getNurseList({ centerId: center.id }))
    })
  }

  // 增加服务弹层已选列表复选框事件
  _onSelectTable = (selectedRowKeys, selectedRows) => {
    let { serviceModal } = this.state
    serviceModal.selectedTableIds = selectedRowKeys
    serviceModal.selectedTableRows = selectedRows
    this.setState({ serviceModal })
  }

  // 增加服务弹层显示
  _showServiceModal = (e, record) => {
    const { dispatch } = this.props
    let { serviceModal } = this.state
    const planTime = record.planName.split(':')[0] + ' 12:00:00'
    const centerId = record.centerId
    dispatch(getRoomAndService({ planTime, centerId })).then((data) => {
      serviceModal.roomList = data.result
      serviceModal.visible = true
      serviceModal.dutyInfo = record
      this.setState({ serviceModal })
    })
  }

  // 房间服务选中样式
  _getMenuClass = (record) => {
    const str = 'ant-cascader-menu-item ant-cascader-menu-item-expand '
    return record.isSelected ? `${str}ant-cascader-menu-item-active` : str
  }

  // 房间、服务点击事件
  _handleRoomAndServiceClick = (record, index, type) => {
    let { serviceModal } = this.state
    let newRoomList = []
    if (type === 'room') {
      // 设置房间勾选状态
      newRoomList = isEmpty(serviceModal.roomList) ? []
        : serviceModal.roomList.map((room, i) => {
          if (index === i) {
            room['isSelected'] = true
          } else {
            room['isSelected'] = false
          }
          return room
        })
      serviceModal.roomList = newRoomList
      // 重置服务勾选状态
      serviceModal.serviceList = record.serviceList.map((service) => {
        service['isSelected'] = false
        return service
      })
      serviceModal['selectedRoom'] = { index, value: record }
      // 重置选服务
      serviceModal['selectedService'] = { index: '', value: {}}
      this.setState({
        serviceModal
      })
    } else if (type === 'service') {
      let newServiceList = []
      // 设置服务勾选状态
      newServiceList = isEmpty(serviceModal.serviceList) ? []
        : serviceModal.serviceList.map((service, i) => {
          if (index === i) {
            service['isSelected'] = true
          } else {
            service['isSelected'] = false
          }
          return service
        })
      serviceModal.serviceList = newServiceList
      // 设置选服务
      serviceModal.selectedService = { index, value: record }
      this.setState({
        serviceModal
      })
    }
  }

  // 弹层取消（增加服务）
  _handleServiceModalCancel = () => {
    const { serviceModal } = this.state
    this.setState({ serviceModal: {
      ...serviceModal,
      visible: false,
      selectedDataSource: [],
      selectedTableIds: [],
      selectedTableRows: [],
      roomList: [],
      serviceList: [],
      loading: false,
      selectedRoom: { index: '', value: {}},
      selectedService: { index: '', value: {}},
      dutyInfo: {},
    }})
    this._clearModalForm()
  }

  // 弹层增加（增加服务）
  _handleServiceModalOk = () => {
    const { dispatch } = this.props
    const { serviceModal } = this.state
    const selectedDataSource = serviceModal.selectedDataSource
    dispatch(serviceArrange({ arrangeList: [...selectedDataSource] })).then((data) => {
      if (data.status === 'success') {
        this._handleServiceModalCancel()
      }
    })
  }

  // 获取妈妈宝宝集合
  _getMomAndBaby = (list = [], type) => {
    return list.filter((customer) => {
      return customer.customerType.toString() === type.toString()
    })
  }

  // 添加
  _handleRightClick = () => {
    let { serviceModal } = this.state
    if (isEmpty(serviceModal.selectedRoom.value) || isEmpty(serviceModal.selectedService.value)) {
      message.error('请选择服务！')
      return
    }
    const selectedRoom = serviceModal.selectedRoom.value
    const selectedService = serviceModal.selectedService.value
    const dutyInfo = serviceModal.dutyInfo
    let roomList = serviceModal.roomList
    let serviceList = serviceModal.serviceList
    // ps: 妈妈：1 宝宝：0  妈妈服务：0 宝宝服务：1
    let customerList = []
    if (selectedService.serviceClass === '0') {
      customerList = this._getMomAndBaby(selectedRoom.contractCustomerList, '1')
    } else if (selectedService.serviceClass === '1') {
      customerList = this._getMomAndBaby(selectedRoom.contractCustomerList, '0')
    }
    // 数据源服务项如果没有对应的服务客户给与提示
    if (customerList.length === 0) {
      message.error('当前选中的服务没有对应的服务客户，不可以选择！')
      return
    }

    let data = {}
    // 宝宝服务 根据宝宝数量生成对应的数据源
    // 妈妈服务 妈妈只有一个
    data = {
      customerList,
      serviceType: selectedService.serviceClass,
      planId: dutyInfo.id,
      servicePersonalId: dutyInfo.nurseId,
      servicePersonalName: dutyInfo.nurseName,
      roomId: selectedRoom.roomId,
      roomNum: selectedRoom.roomNum,
      contractNum: selectedRoom.contractNum,
      contractServiceId: selectedService.serviceId,
      serviceName: selectedService.serviceName,
      serviceClass: selectedService.serviceClass,
    }
    serviceModal.selectedDataSource = [...serviceModal.selectedDataSource, data]
    serviceList.splice(serviceModal.selectedService.index, 1)
    roomList[serviceModal.selectedRoom.index].serviceList.splice(serviceModal.selectedService.index, 1)
    if (roomList[serviceModal.selectedRoom.index].serviceList.length === 0) {
      roomList.splice(serviceModal.selectedRoom.index, 1)
      serviceModal.selectedRoom = { index: '', value: {}}
    }
    serviceModal.selectedService = { index: '', value: {}}
    serviceModal.roomList = roomList
    serviceModal.serviceList = serviceList
    // 删除左侧选中的数据源
    this.setState({ serviceModal })
  }

  // 删除
  _handleLeftClick = () => {
    const { serviceModal } = this.state
    const selectedTableRows = serviceModal.selectedTableRows
    let roomList = serviceModal.roomList
    let serviceList = serviceModal.serviceList
    let selectedDataSource = serviceModal.selectedDataSource

    // 通过房间roomId找到对应的房间 如果没有生成一个
    selectedTableRows.forEach((data) => {
      // 查找房间索引
      let index = roomList.findIndex((room) => {
        return room.roomId.toString() === data.roomId.toString()
      })
      if (index === -1) {
        // 没有创建一个房间
        let room = {
          contractId: data.contractNum,
          contractNum: data.contractId,
          roomId: data.roomId,
          roomNum: data.roomNum,
          serviceList: [
            {
              serviceId: data.contractServiceId,
              serviceName: data.serviceName,
              serviceClass: data.serviceClass,
            }
          ],
          contractCustomerList: data.customerList.map((customer) => {
            return {
              customerId: customer.customerId,
              customerName: customer.customerName,
              customerType: customer.customerType
            }
          }),
        }
        roomList.push(room)
      } else {
        let cutomerIndex = -1
        // 直接插入服务信息
        roomList[index].serviceList.push({
          serviceId: data.contractServiceId,
          serviceName: data.serviceName,
          serviceClass: data.serviceClass,
        })

        // 如果左侧房间内没有此客户添加
        data.customerList.forEach((customerR, i) => {
          cutomerIndex = roomList[index].contractCustomerList.findIndex((customerL) => {
            return customerL.customerId === customerR.customerId
          })
          if (cutomerIndex === -1) {
            roomList[index].contractCustomerList.push({
              customerId: customerR.customerId,
              customerName: customerR.customerName,
              customerType: customerR.customerType
            })
          }
        })

        // 如果当前数据与左侧选中房间一致 需要同步服务信息
        if (!isEmpty(serviceModal.selectedRoom.value) &&
        serviceModal.selectedRoom.value.roomId.toString() === data.roomId) {
          serviceList.push({
            serviceId: data.contractServiceId,
            serviceName: data.serviceName,
            serviceClass: data.serviceClass,
          })
        }
      }
    })

    // 删除右侧选中的数据
    const filterData = selectedDataSource.filter((value) => {
      return serviceModal.selectedTableIds.indexOf(value.contractServiceId) === -1
    })

    serviceModal.roomList = roomList
    serviceModal.serviceList = serviceList
    serviceModal.selectedDataSource = filterData
    serviceModal.selectedTableIds = []
    serviceModal.selectedTableRows = []
    this.setState({ serviceModal })
  }

  // 获取服务弹层客户姓名
  _getModalCustomerName = (customerList) => {
    return isEmpty(customerList) ? '' : customerList.map((customer) => {
      return customer.customerName
    }).join(',')
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { centerId, modal, dutyInfo, serviceModal } = this.state
    const { list, showListSpin, page, centerList, batchNameList, nurseList, dutyStatusList, initQueryPar, auths, match, showButtonSpin } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    const rowSelection = {
      selectedRowKeys: serviceModal.selectedTableIds,
      onChange: this._onSelectTable,
    }
    const pages = genPagination({ ...page, records: page.total, pageNo: page.current })
    return (
      <div>
        <Form
          className={styles['parameter-wrap']}
        >
          <Row id='rowUser'>
            <Col span={18}>
              <Row>
                <Col span={10}>
                  <FormItem
                    label='创建时间：'
                    {...formItemLayout}
                  >
                    <Col span={11}>
                      <FormItem>
                        {getFieldDecorator('arrStartTime', {
                          initialValue: initQueryPar.arrStartTime,
                        })(
                          <DatePicker
                            disabledDate={this._disabledStartDate}
                            format='YYYY-MM-DD'
                            placeholder=''
                            allowClear
                            getCalendarContainer={() => document.getElementById('rowUser')}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={2}>
                      <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                      至
                      </span>
                    </Col>
                    <Col span={11}>
                      <FormItem>
                        {getFieldDecorator('arrEndTime', {
                          initialValue: initQueryPar.arrEndTime,
                        })(
                          <DatePicker
                            disabledDate={this._disabledEndDate}
                            format='YYYY-MM-DD'
                            placeholder=''
                            allowClear
                            getCalendarContainer={() => document.getElementById('rowUser')}
                          />
                        )}
                      </FormItem>
                    </Col>
                  </FormItem>
                </Col>
                <Col
                  span={14}
                  style={{ paddingLeft: 65 }}
                >
                  <FormItem>
                    {getFieldDecorator('planType', {
                      initialValue: initQueryPar.planType,
                    })(
                      <RadioGroup>
                        <RadioButton value=''>全部</RadioButton>
                        <RadioButton value='0'>早班</RadioButton>
                        <RadioButton value='1'>午班</RadioButton>
                        <RadioButton value='2'>晚班</RadioButton>
                        <RadioButton value='3'>其他</RadioButton>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem
                    label='值班状态：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('onDutyType', {
                      initialValue: initQueryPar.onDutyType,
                    })(
                      <Select
                        allowClear={false}
                        optionLabelProp='title'
                        filterOption={false}
                        placeholder='请选择值班状态'
                        getPopupContainer={() => document.getElementById('rowUser')}
                      >
                        <SelectOption
                          key=''
                          value=''
                          title='全部'
                        >
                          全部
                        </SelectOption>
                        {!isEmpty(dutyStatusList) ? dutyStatusList.map(d => (
                          <SelectOption
                            key={d.value}
                            value={d.value}
                            title={d.name}
                          >
                            {d.name}
                          </SelectOption>
                        )) : null}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col
              span={6}
            >
              <div className={styles['operate-btn']}>
                <Button
                  type='primary'
                  title='点击查询'
                  onClick={this._handleQuery}
                >
                  查询
                </Button>
                {
                  btnRole.indexOf('add') !== -1 &&
                  <Button
                    type='primary'
                    title='新建'
                    onClick={this._addShowModal}
                  >
                    新建
                  </Button>
                }
              </div>
            </Col>
          </Row>
        </Form>
        <div className={styles['table-wrapper']}>
          <Menu
            onClick={this._handleMenuClick}
            style={{ width: 150 }}
            mode='inline'
            className={styles['menu-list']}
            selectedKeys={[centerId]}
          >
            {
              !isEmpty(centerList) && centerList.map((value) => {
                return (
                  <MenuItem key={value.id}>{value.orgName}</MenuItem>
                )
              })
            }
          </Menu>
          <Table
            className={styles['c-table-center']}
            columns={this._columns}
            rowKey='id'
            dataSource={list}
            bordered={true}
            loading={showListSpin}
            pagination={pages}
            onChange={this._handlePageChange}
          />
        </div>
        <Modal
          title={modal.title}
          visible={modal.visible}
          onCancel={this._handleModalCancel}
          maskClosable={false}
          footer={null}
          destroyOnClose={true}
          style={{ minWidth: '580px' }}
        >
          <Form
            layout='vertical'
            className={styles['jc-modal-form']}
            onSubmit={(e) => { this._handleModalOk(e, dutyInfo) }}
          >
            <FormItem
              {...modal.formItemLayout}
              label='所在中心：'
            >
              {getFieldDecorator('centerId', {
                rules: [{
                  required: true,
                  message: '请选择所在中心!'
                }],
                initialValue: dutyInfo && dutyInfo.centerId
              })(
                <Select
                  placeholder='请选择所在中心'
                  onChange={this._handleModalCenterChange}
                  getPopupContainer={() => document.getElementsByClassName('ant-modal-wrap')[0]}
                >
                  {
                    !isEmpty(centerList) && centerList.map(item => (
                      <SelectOption
                        key={item.id}
                        value={item.id}
                      >
                        {item.orgName}
                      </SelectOption>
                    ))
                  }
                </Select>
              )}
            </FormItem>
            <FormItem
              {...modal.formItemLayout}
              label='班次名称：'
            >
              {getFieldDecorator('key', {
                whitespace: true,
                rules: [{
                  required: true,
                  message: '请选择班次名称!'
                }],
                initialValue: dutyInfo && dutyInfo.key
              })(
                <Select
                  placeholder='请选择班次名称'
                  getPopupContainer={() => document.getElementsByClassName('ant-modal-wrap')[0]}
                >
                  {
                    !isEmpty(batchNameList) && batchNameList.map(item => (
                      <SelectOption
                        key={item.id}
                        value={item.id}
                      >
                        {item.planName}
                      </SelectOption>
                    ))
                  }
                </Select>
              )}
            </FormItem>
            <FormItem
              {...modal.formItemLayout}
              label='当值人员:'
            >
              {getFieldDecorator('nurseId', {
                whitespace: true,
                rules: [{
                  required: true,
                  message: '请选择当值人员!'
                }],
                initialValue: dutyInfo && dutyInfo.nurseId
              })(
                <Select
                  placeholder='请选择当值人员'
                  getPopupContainer={() => document.getElementsByClassName('ant-modal-wrap')[0]}
                >
                  {
                    !isEmpty(nurseList) && nurseList.map(item => (
                      <SelectOption
                        key={item.nurseId}
                        value={item.nurseId}
                      >
                        {item.nurseName}
                      </SelectOption>
                    ))
                  }
                </Select>
              )}
            </FormItem>
            <FormItem
              {...modal.formItemLayout}
              label='备注：'
            >
              {getFieldDecorator('remark', {
                whitespace: true,
                initialValue: dutyInfo && dutyInfo.remark
              })(
                <Input.TextArea
                  maxLength='500'
                  placeholder='请输入备注'
                />
              )}
            </FormItem>
            <FormItem className={styles['jc-modal-form-footer']}>
              {
                <Button
                  key='cancel'
                  size='large'
                  onClick={this._handleModalCancel}
                >{'取消'}
                </Button>
              }
              {
                <Button
                  key='confirm'
                  size='large'
                  type='primary'
                  htmlType='submit'
                  loading={showButtonSpin}
                >{'提交'}
                </Button>
              }
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title={serviceModal.title}
          visible={serviceModal.visible}
          onCancel={this._handleServiceModalCancel}
          maskClosable={false}
          footer={null}
          destroyOnClose={true}
          style={{ minWidth: '900px' }}
        >
          <Form
            layout='vertical'
            className={styles['jc-modal-form']}
          >
            <Row>
              <Col span={24}>
                <Col span={11}>
                  <div style={{ marginBottom: '5px' }}>
                    <ul className={styles['service-table-tit']}><li>房间号</li> <li>服务名称</li></ul>
                    <ul className='ant-cascader-menu' style={{ width: '50%' }}>
                      {
                        !isEmpty(serviceModal.roomList) && serviceModal.roomList.map((record, i) => {
                          return (
                            <li
                              key={`room${i}`}
                              className={this._getMenuClass(record)}
                              title={record.roomNum}
                              onClick={() => { this._handleRoomAndServiceClick(record, i, 'room') }}
                            >
                              {record.roomNum}
                            </li>
                          )
                        })
                      }
                    </ul>
                    <ul className='ant-cascader-menu' style={{ width: '50%' }}>
                      {
                        !isEmpty(serviceModal.serviceList) && serviceModal.serviceList.map((record, j) => {
                          return (
                            <li
                              key={`service${j}`}
                              className={this._getMenuClass(record)}
                              title={record.serviceName}
                              onClick={() => { this._handleRoomAndServiceClick(record, j, 'service') }}
                            >
                              {record.serviceName}
                            </li>
                          )
                        })
                      }
                    </ul>
                  </div>
                </Col>
                <Col span={2}>
                  <Button
                    className={styles['modal-btn']}
                    type='primary'
                    size='small'
                    onClick={this._handleRightClick}
                  >
                    添加
                  </Button>
                  <Button
                    className={styles['modal-btn']}
                    type='primary'
                    size='small'
                    onClick={this._handleLeftClick}
                  >
                    删除
                  </Button>
                </Col>
                <Col span={11}>
                  <Table
                    columns={this._serviceModalcolumns}
                    rowKey='contractServiceId'
                    dataSource={serviceModal.selectedDataSource}
                    bordered={true}
                    rowSelection={rowSelection}
                    loading={serviceModal.loading}
                    pagination={false}
                  />
                </Col>
              </Col>
            </Row>
            <FormItem className={styles['jc-modal-form-footer']}>
              {
                <Button
                  key='cancel'
                  size='large'
                  onClick={this._handleServiceModalCancel}
                >{'取消'}
                </Button>
              }
              {
                <Button
                  disabled={isEmpty(serviceModal.selectedDataSource)}
                  size='large'
                  type='primary'
                  loading={showButtonSpin}
                  onClick={this._handleServiceModalOk}
                >{'提交'}
                </Button>
              }
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.nurseDuty.dutyList,
    centerList: state.nurseSchedule.centerList,
    page: state.nurseDuty.page,
    dutyStatusList: state.nurseDuty.dutyStatusList,
    sex: state.nurseDuty.sex,
    batchNameList: state.nurseDuty.batchNameList,
    nurseList: state.nurseDuty.nurseList,
    initQueryPar: state.nurseDuty.initQueryPar,
    auths: state.common.auths,

    showListSpin: state.common.showListSpin,
    showButtonSpin: state.common.showButtonSpin,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(DutyList))

