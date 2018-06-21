import React from 'react'
import classNames from 'classnames'
import { Card, Row } from 'antd'
import styles from './index.less'

export default ({ className, title, col = 3, layout = 'horizontal',
  children, size }) => {
  const clsString = classNames(styles.descriptionList, styles[layout], className, {
    [styles.small]: size === 'small',
    [styles.large]: size === 'large',
  })
  const column = col > 4 ? 4 : col
  return (
    <Row className='form-detail'>
      <Card className={clsString} title={title ? <div className={styles.title}>{title}</div> : null}>
        {React.Children.map(children, child => React.cloneElement(child, { column }))}
      </Card>
    </Row>
  )
}
