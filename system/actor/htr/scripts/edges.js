/* global game, WOD5E, foundry, ChatMessage */

/** Handle adding a new edge to the sheet */
export const _onAddEdge = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  // Secondary variables
  const edgeList = WOD5E.Edges.getList({})

  Object.entries(edgeList).map(([key, { label }]) => ({
    label,
    value: key
  }))

  // Variables yet to be defined
  let edgeSelected

  // Build the options for the select dropdown
  const content = new foundry.data.fields.StringField({
    choices: edgeList,
    label: game.i18n.localize('WOD5E.HTR.SelectEdge'),
    required: true
  }).toFormGroup({},
    {
      name: 'edge'
    }).outerHTML

  // Prompt a dialog to determine which edge we're adding
  const updateActorEdges = await foundry.applications.api.DialogV2.prompt({
    window: {
      title: game.i18n.localize('WOD5E.HTR.AddEdge')
    },
    classes: ['wod5e', 'dialog', 'hunter', 'dialog'],
    content,
    ok: {
      callback: (event, button) => new foundry.applications.ux.FormDataExtended(button.form).object.edge
    },
    modal: true
  })

  if (updateActorEdges) {
    edgeSelected = updateActorEdges

    // Make the edge visible
    actor.update({ [`system.edges.${edgeSelected}.visible`]: true })

    // Update the currently selected edge and perk
    _updateSelectedEdge(actor, edgeSelected)
    _updateSelectedPerk(actor, '')
  }
}

/** Handle removing an Edge from an actor */
export const _onRemoveEdge = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const edge = target.getAttribute('data-edge')

  actor.update({
    [`system.edges.${edge}.visible`]: false
  })
}

/** Post an Edge description to the chat */
export const _onEdgeToChat = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const edge = actor.system.edges[target.getAttribute('data-edge')]

  await foundry.applications.handlebars.renderTemplate('systems/vtm5e/display/ui/chat/chat-message.hbs', {
    name: edge.displayName,
    img: 'icons/svg/dice-target.svg',
    description: edge?.description || ''
  }).then(html => {
    const message = ChatMessage.applyRollMode({ speaker: ChatMessage.getSpeaker({ actor }), content: html }, game.settings.get('core', 'rollMode'))
    ChatMessage.create(message)
  })
}

/** Select a edge to display */
export const _onSelectEdge = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const edge = target.getAttribute('data-edge')

  _updateSelectedEdge(actor, edge)
}

/** Select a perk to display */
export const _onSelectEdgePerk = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const perk = target.getAttribute('data-perk')

  _updateSelectedPerk(actor, perk)
}

export const _updateSelectedPerk = async function (actor, perk) {
  // Variables yet to be defined
  const updatedData = {}

  // Make sure we actually have a valid perk defined
  if (perk && actor.items.get(perk)) {
    const perkItem = actor.items.get(perk)
    const edge = perkItem.system.edge

    // Update the selected perk
    updatedData.selectedEdgePerk = perk
    perkItem.update({
      system: {
        selected: true
      }
    })

    // Update the selected edges
    _updateSelectedEdge(actor, edge)
  } else {
    // Revert to an empty string
    updatedData.selectedEdgePerk = ''
  }

  // Unselect the previously selected perk
  const previouslySelectedPerk = actor.system?.selectedEdgePerk
  if (previouslySelectedPerk && actor.items.get(previouslySelectedPerk) && previouslySelectedPerk !== perk) {
    actor.items.get(previouslySelectedPerk).update({
      system: {
        selected: false
      }
    })
  }

  // Update the actor data
  actor.update({
    system: updatedData
  })
}

export const _updateSelectedEdge = async function (actor, edge) {
  // Variables yet to be defined
  const updatedData = {}

  // Make sure we actually have an edge defined
  if (edge && actor.system.edges[edge]) {
    updatedData.edges ??= {}
    updatedData.edges[edge] ??= {}

    // Update the selected edges
    updatedData.selectedEdge = edge
    updatedData.edges[edge].selected = true
  } else {
    // Revert to an empty string
    updatedData.selectedEdge = ''
  }

  // Unselect the previously selected edge
  const previouslySelectedEdge = actor.system?.selectedEdge
  if (previouslySelectedEdge && previouslySelectedEdge !== edge) {
    updatedData.edges[previouslySelectedEdge] ??= {}
    updatedData.edges[previouslySelectedEdge].selected = false
  }

  // Update the actor data
  actor.update({
    system: updatedData
  })
}
