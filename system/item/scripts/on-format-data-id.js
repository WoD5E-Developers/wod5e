import { formatDataItemId } from '../../actor/scripts/format-data-item-id.js'

export const _onFormatDataId = async function (event) {
  event.preventDefault()

  // Top-level variables
  const item = this.item

  const dataItemId = `${item.type}-${formatDataItemId(item.name)}`

  item.setFlag('vtm5ec', 'dataItemId', dataItemId)
}
