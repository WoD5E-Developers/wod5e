/* global foundry */

// Handle adding a new section to a dicepool
export const _onAddDice = async function (event) {
  event.preventDefault()

  // Top-level variables
  const item = this.item

  // Secondary variables
  const randomID = foundry.utils.randomID(8)

  // Append a new dice to the dicepool
  const defaultData = {
    path: 'attributes.strength'
  }

  await item.update({ [`system.dicepool.${randomID}`]: defaultData })
}

// Handle removing a section from a dicepool
export const _onRemoveDice = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const item = this.item

  // Secondary variables
  const diceID = target.getAttribute('data-dice-id')

  await item.update({ [`system.dicepool.-=${diceID}`]: null })
}
