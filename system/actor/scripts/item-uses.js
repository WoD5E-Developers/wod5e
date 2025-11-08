export const _onExpendItemUse = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const itemId = target.getAttribute('data-item-id')

  const item = actor.items.get(itemId)
  const currentUses = item.system.uses.current
  const newUses = Math.max(currentUses - 1, 0)

  item.update({
    'system.uses.current': newUses
  })
}

export const _onRestoreItemUses = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const itemId = target.getAttribute('data-item-id')

  const item = actor.items.get(itemId)
  const maxUses = item.system.uses.max

  item.update({
    'system.uses.current': maxUses
  })
}
