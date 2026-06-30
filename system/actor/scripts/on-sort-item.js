export function _onSortItem(event, actor, itemData) {
  // Get the drag source and drop target
  const items = actor.items
  const source = items.get(itemData._id)
  const dropTarget = event.target.closest('[data-item-id]')
  if (!dropTarget) return
  const target = items.get(dropTarget.dataset.itemId)

  // Don't sort on yourself
  if (source.id === target.id) return

  // Identify sibling items based on adjacent HTML elements
  const siblings = []
  for (const el of dropTarget.parentElement.children) {
    const siblingId = el.dataset.itemId
    if (siblingId && siblingId !== source.id) siblings.push(items.get(el.dataset.itemId))
  }

  // Perform the sort
  const sortUpdates = foundry.utils.performIntegerSort(source, {
    target,
    siblings
  })

  const updateData = sortUpdates.map((u) => {
    const update = u.update
    update._id = u.target._id
    return update
  })

  // Perform the update
  return actor.updateEmbeddedDocuments('Item', updateData)
}
