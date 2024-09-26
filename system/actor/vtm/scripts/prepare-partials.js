/* global TextEditor */

import { prepareDisciplinePowers } from './prepare-data.js'
import { getBloodPotencyText } from './blood-potency.js'

export const prepareDisciplinesContext = async function (context, actor) {
  const actorData = actor.system

  // Tab data
  context.tab = context.tabs.disciplines

  // Part-specific data
  context.disciplines = await prepareDisciplinePowers(actorData.disciplines)

  // Get discipline data if any discipline is currently selected
  if (actorData?.selectedDiscipline) {
    context.selectedDiscipline = actorData.disciplines[actorData.selectedDiscipline]
  }

  // Get power data if any power is currently selected
  if (actorData?.selectedDisciplinePower) {
    context.selectedDisciplinePower = await actor.items.get(actorData.selectedDisciplinePower)
  }

  return context
}

export const prepareBloodContext = async function (context, actor) {
  const actorData = actor.system
  const actorHeaders = actorData.headers

  // Tab data
  context.tab = context.tabs.blood

  // Part-specific data
  context.blood = actorData.blood
  context.sire = actorHeaders.sire
  context.generation = actorHeaders.generation
  context.predator = actorHeaders.predator
  context.bane = actorHeaders.bane
  context.enrichedBane = await TextEditor.enrichHTML(actorHeaders.bane)
  context.bloodpotency = await getBloodPotencyText(actorData.blood.potency)

  return context
}
