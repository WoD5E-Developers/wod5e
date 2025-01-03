/* global TextEditor */

import { prepareArtsPowers, prepareRealmsPowers } from './prepare-data.js'

export const preparePowersContext = async function (context, actor) {
  const actorData = actor.system

  // Tab data
  context.tab = context.tabs.powers

  // Part-specific data
  context.arts = await prepareArtsPowers(actorData.arts)
  context.realms = await prepareRealmsPowers(actorData.realms)

  // Get art data if any art is currently selected
  if (actorData?.selectedArt) {
    context.selectedArt = actorData.arts[actorData.selectedArt]
    context.enrichedSelectedArtDescription = await TextEditor.enrichHTML(context.selectedArt?.description || '')
  }

  // Get arts power data if any arts power is currently selected
  if (actorData?.selectedArtPower) {
    context.selectedArtPower = await actor.items.get(actorData.selectedArtPower)

    if (context.selectedArtPower?.system?.description) {
      context.selectedArtPowerDescription = await TextEditor.enrichHTML(context.selectedArtPower.system.description)
    }
  }

  // Get realm data if any realm is currently selected
  if (actorData?.selectedRealm) {
    context.selectedRealm = actorData.realms[actorData.selectedRealm]
    context.enrichedSelectedRealmDescription = await TextEditor.enrichHTML(context.selectedRealm?.description || '')
  }

  // Get realms power data if any realms power is currently selected
  if (actorData?.selectedRealmPower) {
    context.selectedRealmPower = await actor.items.get(actorData.selectedRealmPower)

    if (context.selectedRealmPower?.system?.description) {
      context.selectedRealmPowerDescription = await TextEditor.enrichHTML(context.selectedRealmPower.system.description)
    }
  }

  return context
}
