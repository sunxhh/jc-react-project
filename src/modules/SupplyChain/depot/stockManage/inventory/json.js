const sliceArray = (inventoryNo, warehouseName, special, detailList) => {
  // const finalResult = []
  return { 'title': warehouseName + '盘点单', 'docNum': inventoryNo, 'inventoryType': special, 'inventory': detailList }
}

export { sliceArray }
