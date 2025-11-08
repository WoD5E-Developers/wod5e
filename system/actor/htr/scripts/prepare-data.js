import { Edges } from '../../../api/def/edges.js'

export const prepareEdges = async function (actor) {
  // Secondary variables
  const edgesList = Edges.getList({})
  const actorEdges = actor.system?.edges
  const computedEdges = {}

  for (const [id, value] of Object.entries(edgesList)) {
    let edgeData = {}

    // If the actor has a edge with the key, grab its current values
    if (Object.prototype.hasOwnProperty.call(actorEdges, id)) {
      edgeData = Object.assign(
        {
          id,
          value: actorEdges[id].value,
          perks: actorEdges[id].perks || [],
          pools: actorEdges[id].pools || [],
          description: actorEdges[id]?.description || '',
          visible: actorEdges[id].visible,
          selected: actorEdges[id].selected || false
        },
        value
      )
    } else {
      // Otherwise, add it to the actor and set it as some default data
      edgeData = Object.assign(
        {
          id,
          value: 0,
          visible: false,
          description: '',
          perks: [],
          pools: [],
          selected: false
        },
        value
      )
    }

    // Ensure the edge exists
    if (!computedEdges[id]) computedEdges[id] = {}
    // Apply the edge's data
    computedEdges[id] = edgeData

    // Make it forced invisible if it's set to hidden
    if (edgeData.hidden) {
      computedEdges[id].visible = false
    }

    // Wipe old edge perks so they doesn't duplicate
    computedEdges[id].perks = []

    // Wipe old edge pools so they don't duplicate either
    computedEdges[id].pools = []

    // Assign all matching perks to the edge
    computedEdges[id].perks = actor.items.filter(
      (item) => item.type === 'perk' && item.system.edge === id
    )

    // Assign all matching edgepools to the edge
    computedEdges[id].pools = actor.items.filter(
      (item) => item.type === 'edgepool' && item.system.edge === id
    )
  }

  return computedEdges
}

export const prepareEdgePowers = async function (edges) {
  for (const edgeType in edges) {
    if (Object.prototype.hasOwnProperty.call(edges, edgeType)) {
      const edge = edges[edgeType]

      // Perk Sorting
      if (edge && Array.isArray(edge.perks)) {
        // Check if the edge has perks
        if (edge.perks.length > 0) {
          // Ensure visibility is set correctly
          if (!edge.visible && !edge.hidden) edge.visible = true

          // Sort the edge containers alphabetically
          edge.perks = edge.perks.sort(function (perk1, perk2) {
            return perk1.name.localeCompare(perk2.name)
          })
        }
      } else {
        console.warn(`World of Darkness 5e | Edge ${edgeType} is missing or perks is not an array.`)
      }

      // Edge Pool Sorting
      if (edge && Array.isArray(edge.pools)) {
        // Check if the edge has pools
        if (edge.pools.length > 0) {
          // Sort the edgepools containers alphabetically
          edge.pools = edge.pools.sort(function (pool1, pool2) {
            return pool1.name.localeCompare(pool2.name)
          })
        }
      } else {
        console.warn(`World of Darkness 5e | Edge ${edgeType} is missing or pools is not an array.`)
      }
    }
  }

  return edges
}
