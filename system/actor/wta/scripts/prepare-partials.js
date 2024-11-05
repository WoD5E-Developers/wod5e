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
    context.enrichedSelectedGiftDescription = await TextEditor.enrichHTML(context.selectedGift?.description || '')
  }

  // Get power data if any power is currently selected
  if (actorData?.selectedGiftPower) {
    context.selectedGiftPower = await actor.items.get(actorData.selectedGiftPower)

    if (context.selectedGiftPower?.system?.description) {
      context.selectedGiftPowerDescription = await TextEditor.enrichHTML(context.selectedGiftPower.system.description)
    }
  }

  return context
}

export const prepareWolfContext = async function (context, actor) {
  const actorData = actor.system

  // Tab data
  context.tab = context.tabs.wolf

  // Part-specific data
  context.forms = actorData.forms
  context.balance = actorData.balance
  context.rage = actorData.rage

  return context
}
