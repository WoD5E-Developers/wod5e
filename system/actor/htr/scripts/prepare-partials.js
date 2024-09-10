import { prepareEdgePowers } from './prepare-data.js'

export const prepareEdgesContext = async function (context, actor) {
  const actorData = actor.system

  // Tab data
  context.tab = context.tabs.edges

  // Part-specific data
  context.edges = await prepareEdgePowers(actorData.edges)

  return context
}
