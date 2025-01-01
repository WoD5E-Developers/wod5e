/* global TextEditor */

import { prepareArtsPowers, prepareRealmsPowers } from './prepare-data.js'

export const prepareArtsContext = async function (context, actor) {
  const actorData = actor.system

  // Tab data
  context.tab = context.tabs.arts

  // Part-specific data
  context.arts = await prepareArtsPowers(actorData.arts)

  // Get art data if any art is currently selected
  if (actorData?.selectedArt) {
    context.selectedArt = actorData.arts[actorData.selectedArt]
    context.enrichedSelectedArtDescription = await TextEditor.enrichHTML(context.selectedArt?.description || '')
  }

  // Get power data if any power is currently selected
  if (actorData?.selectedArtPower) {
    context.selectedArtPower = await actor.items.get(actorData.selectedArtPower)

    if (context.selectedArtPower?.system?.description) {
      context.selectedArtPowerDescription = await TextEditor.enrichHTML(context.selectedArtPower.system.description)
    }
  }

  return context
}

export const prepareRealmsContext = async function (context, actor) {
  const actorData = actor.system

  // Tab data
  context.tab = context.tabs.realms

  // Part-specific data
  context.realms = await prepareRealmsPowers(actorData.realms)

  // Get realm data if any realm is currently selected
  if (actorData?.selectedRealm) {
    context.selectedRealm = actorData.realms[actorData.selectedRealm]
    context.enrichedSelectedRealmDescription = await TextEditor.enrichHTML(context.selectedRealm?.description || '')
  }

  // Get power data if any power is currently selected
  if (actorData?.selectedRealmPower) {
    context.selectedRealmPower = await actor.items.get(actorData.selectedRealmPower)

    if (context.selectedRealmPower?.system?.description) {
      context.selectedRealmPowerDescription = await TextEditor.enrichHTML(context.selectedRealmPower.system.description)
    }
  }

  return context
}
