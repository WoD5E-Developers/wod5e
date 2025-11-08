// Handle adding an effect
export const _onAddEffect = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const item = this.item
  const type = target.getAttribute('data-type')

  const randomId = foundry.utils.randomID(8)
  const defaultData = {
    keys: [],
    intValue: 0,
    strValue: '',
    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
    flatSource: 'static',
    type
  }

  // Update the item
  item.update({ [`system.effects.${randomId}`]: defaultData })
}

// Handle removing an effect
export const _onRemoveEffect = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const item = this.item

  // Secondary variables
  const effectID = target.getAttribute('data-effect-id')

  item.update({ [`system.effects.-=${effectID}`]: null })
}
