/* global TextEditor */

import { prepareGiftPowers } from './prepare-data.js'

export const prepareGiftsContext = async function (context, actor) {
  const actorData = actor.system

  // Tab data
  context.tab = context.tabs.gifts

  // Part-specific data
  context.gifts = await prepareGiftPowers(actorData.gifts)
  context.renown = actorData.renown

  // Get gift data if any gift is currently selected
  if (actorData?.selectedGift) {
    context.selectedGift = actorData.gifts[actorData.selectedGift]
  }

  // Get power data if any power is currently selected
  if (actorData?.selectedGiftPower) {
    context.selectedGiftPower = await actor.items.get(actorData.selectedGiftPower)
  }

  return context
}

export const prepareWolfContext = async function (context, actor) {
  const actorData = actor.system

  // Tab data
  context.tab = context.tabs.wolf

  // Filters for item-specific data
  const tribeFilter = context.tribe // Filtering already done in main dataprep

  // Part-specific data
  context.forms = actorData.forms
  context.balance = actorData.balance
  context.rage = actorData.rage
  context.patronSpirit = tribeFilter ? tribeFilter[0]?.system?.patronSpirit : {}
  context.favor = await TextEditor.enrichHTML(context.patronSpirit?.favor)
  context.ban = await TextEditor.enrichHTML(context.patronSpirit?.ban)

  return context
}
