/** Handle removing an Edge from an actor */
export const _onRemoveEdge = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const element = event.currentTarget
  const dataset = Object.assign({}, element.dataset)
  const edge = dataset.edge

  await actor.update({
    [`system.edges.${edge}.visible`]: false
  })
}
