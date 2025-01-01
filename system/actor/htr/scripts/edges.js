/* global game, Dialog, WOD5E, renderTemplate, ChatMessage */

/** Handle adding a new edge to the sheet */
export const _onAddEdge = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  // Secondary variables
  const selectLabel = game.i18n.localize('WOD5E.HTR.SelectEdge')
  const itemOptions = WOD5E.Edges.getList({})

  // Variables yet to be defined
  let options = []
  let edgeSelected

  // Prompt a dialog to determine which edge we're adding
  // Build the options for the select dropdown
  for (const [key, value] of Object.entries(itemOptions)) {
    options += `<option value="${key}">${value.displayName}</option>`
  }

  // Template for the dialog form
  const template = `
    <form>
      <div class="form-group">
        <label>${selectLabel}</label>
        <select id="edgeSelect">${options}</select>
      </div>
    </form>`

  // Define dialog buttons
  const buttons = {
    submit: {
      icon: '<i class="fas fa-check"></i>',
      label: game.i18n.localize('WOD5E.Add'),
      callback: async (html) => {
        edgeSelected = html.find('#edgeSelect')[0].value

        // Make the edge visible
        actor.update({ [`system.edges.${edgeSelected}.visible`]: true })

        // Update the currently selected edge and perk
        _updateSelectedEdge(actor, edgeSelected)
        _updateSelectedPerk(actor, '')
      }
    },
    cancel: {
      icon: '<i class="fas fa-times"></i>',
      label: game.i18n.localize('WOD5E.Cancel')
    }
  }

  // Display the dialog
  new Dialog({
    title: game.i18n.localize('WOD5E.Add'),
    content: template,
    buttons,
    default: 'submit'
  }, {
    classes: ['wod5e', 'dialog', 'hunter', 'dialog']
  }).render(true)
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

  await renderTemplate('systems/vtm5ec/display/ui/chat/chat-message.hbs', {
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

  // Make sure we actually have a edge defined
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
