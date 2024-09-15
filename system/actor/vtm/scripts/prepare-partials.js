import { prepareDisciplinePowers } from './prepare-data.js'
import { getBloodPotencyText } from './blood-potency.js'

export const prepareDisciplinesContext = async function (context, actor) {
  const actorData = actor.system

  // Tab data
  context.tab = context.tabs.disciplines

  // Part-specific data
  context.disciplines = await prepareDisciplinePowers(actorData.disciplines)

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
  context.bloodpotency = await getBloodPotencyText(actorData.blood.potency)

  return context
}
