/**
 * 与业务有关联的dom操作
 */

const alterBreadItemName = (...strs) => {
  let breadItems = document.querySelectorAll('.breadcrumb-placeholder>a')
  breadItems = Array.from(breadItems)
  breadItems.forEach((breadItem, index) => {
    breadItem.innerText = strs[index]
  })
}

export default alterBreadItemName

