import { prepareDisciplinePowers } from './prepare-data.js'

export const prepareDisciplinesContext = async function (context, actor) {
  const actorData = actor.system

  // Tab data
  context.tab = context.tabs.disciplines

  // Part-specific data
  context.disciplines = await prepareDisciplinePowers(actor.items, actorData.disciplines)

  return context
}

export const prepareBloodContext = async function (context, actor) {
  const actorData = actor.system

  // Tab data
  context.tab = context.tabs.blood

  // Part-specific data
  context.blood = actorData.blood

  return context
}
