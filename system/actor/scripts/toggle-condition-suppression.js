export const _onToggleConditionSuppression = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const itemId = target.getAttribute('data-item-id')

  const item = actor.items.get(itemId)
  const suppressed = item.system.suppressed

  // Toggle the suppressed state
  item.update({
    'system.suppressed': !suppressed
  })
}
