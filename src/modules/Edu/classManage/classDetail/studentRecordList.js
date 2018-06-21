import React from 'react'

import { connect } from 'react-redux'

class StudentRecordList extends React.Component {
  render() {
    const { dataSource } = this.props
    return (
      <div>
        {dataSource.map((item, index) => {

        })}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    list: state.classManage.recordList,
    page: state.classManage.recordPage,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(StudentRecordList)
