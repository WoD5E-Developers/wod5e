/* global TextEditor */

import { prepareEdgePowers } from './prepare-data.js'

export const prepareEdgesContext = async function (context, actor) {
  const actorData = actor.system

  // Tab data
  context.tab = context.tabs.edges

  // Part-specific data
  context.edges = await prepareEdgePowers(actorData.edges)

  // Get discipline data if any discipline is currently selected
  if (actorData?.selectedEdge) {
    context.selectedEdge = actorData.edges[actorData.selectedEdge]
    context.enrichedSelectedEdgeDescription = await TextEditor.enrichHTML(context.selectedEdge?.description || '')
  }

  // Get power data if any power is currently selected
  if (actorData?.selectedEdgePerk) {
    context.selectedEdgePerk = await actor.items.get(actorData.selectedEdgePerk)

    if (context.selectedEdgePerk?.system?.description) {
      context.selectedEdgePerkDescription = await TextEditor.enrichHTML(context.selectedEdgePerk.system.description)
    }
  }

  return context
}
