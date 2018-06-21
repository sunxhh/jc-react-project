import React, { createElement } from 'react'
import classNames from 'classnames'
import { Button } from 'antd'
import config from './typeConfig'
import styles from './index.less'

export default ({ className, linkElement = 'a', type, title, desc, img, actions, ...rest }) => {
  const pageType = type in config ? type : '404'
  const clsString = classNames(styles.exception, className)
  return (
    <div
      className={clsString}
    >
      <div className={styles['img-block']}>
        <div
          className={styles['img-ele']}
          style={{ backgroundImage: `url(${img || config[pageType].img})` }}
        />
      </div>
      <div className={styles.content}>
        <h1>{title || config[pageType].title}</h1>
        <div className={styles.desc}>{desc || config[pageType].desc}</div>
        <div className={styles.actions}>
          {
            actions ||
            createElement(linkElement, {
              to: '/',
              href: '/',
            }, <Button type='primary'>返回首页</Button>)
          }
        </div>
      </div>
    </div>
  )
}
