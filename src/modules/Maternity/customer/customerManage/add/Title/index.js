import React, { Component } from 'react'
import styles from './Title.less'

class Title extends Component {
  render () {
    const { txt, desc } = this.props
    return (
      <div className={styles['title-wrapper']}>{ txt }<span style={{ fontSize: 12, marginLeft: 8 }}>{ desc || '' }</span></div>
    )
  }
}

export default Title
