import { _rollItem } from '../actor/scripts/item-roll.js'

// NOTE: This entirely needs to be syncronous
// because the hotbarDrop function will skip over the system
// trying to inject its own macro if we make the function async
export function loadHotbarDrop() {
  Hooks.on('hotbarDrop', (hotbar, data, slot) => {
    const item = fromUuidSync(data.uuid)

    // Check to make sure the item exists
    if (!item) return

    // Do all the item validation logic and creation here
    handleItemDrop(item, data, slot)

    // Prevent Foundry's default handling
    return false
  })
}

export async function handleItemDrop(item, data, slot) {
  let command

  // Check to make sure the item is.. rollable!
  // If it isn't, we fall back to Foundry's default command
  // If it is, we use our system's custom roll command
  if (item.system?.dicepool === undefined) {
    command = `await foundry.applications.ui.Hotbar.toggleDocumentSheet("${data.uuid}")`
  } else {
    command = `WOD5E.api._onRollItemFromMacro(${JSON.stringify(item.name)})`
  }

  // Create the macro
  const macro = await Macro.create({
    name: item.name,
    type: 'script',
    img: item.img,
    command
  })

  // Add the macro to the hotbar
  game.user.assignHotbarMacro(macro, slot, {
    fromSlot: data.slot
  })
}

// Exposed as WOD5E.api._onRollItemFromMacro in main.js.
export function _onRollItemFromMacro(itemName) {
  const speaker = ChatMessage.getSpeaker()
  let actor
  if (speaker.token) actor = game.actors.tokens[speaker.token]
  if (!actor) actor = game.actors.get(speaker.actor)
  const item = actor ? actor.items.find((i) => i.name === itemName) : null
  if (!item)
    return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`)

  _rollItem(actor, item)
}
