/* global game, Dialog, WOD5E, renderTemplate, ChatMessage */

/** Handle adding a new discipline to the sheet */
export const _onAddDiscipline = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  // Secondary variables
  const selectLabel = game.i18n.localize('WOD5E.VTM.SelectDiscipline')
  const itemOptions = WOD5E.Disciplines.getList({})

  // Variables yet to be defined
  let options = []
  let disciplineSelected

  // Prompt a dialog to determine which edge we're adding
  // Build the options for the select dropdown
  for (const [key, value] of Object.entries(itemOptions)) {
    if (!value.hidden) {
      options += `<option value="${key}">${value.displayName}</option>`
    }
  }

  // Template for the dialog form
  const template = `
    <form>
      <div class="form-group">
        <label>${selectLabel}</label>
        <select id="disciplineSelect">${options}</select>
      </div>
    </form>`

  // Define dialog buttons
  const buttons = {
    submit: {
      icon: '<i class="fas fa-check"></i>',
      label: game.i18n.localize('WOD5E.Add'),
      callback: async (html) => {
        disciplineSelected = html.find('#disciplineSelect')[0].value

        // Make the discipline visible
        actor.update({ [`system.disciplines.${disciplineSelected}.visible`]: true })

        // Update the currently selected discipline and power
        _updateSelectedDiscipline(actor, disciplineSelected)
        _updateSelectedDisciplinePower(actor, '')
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
    classes: ['wod5e', 'dialog', 'vampire', 'dialog']
  }).render(true)
}

/** Handle removing a discipline from an actor */
export const _onRemoveDiscipline = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const discipline = target.getAttribute('data-discipline')

  actor.update({
    [`system.disciplines.${discipline}.visible`]: false
  })
}

/** Post Discipline description to the chat */
export const _onDisciplineToChat = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const discipline = actor.system.disciplines[target.getAttribute('data-discipline')]

  await renderTemplate('systems/vtm5ec/display/ui/chat/chat-message.hbs', {
    name: discipline.displayName,
    img: 'icons/svg/dice-target.svg',
    description: discipline?.description
  }).then(html => {
    const message = ChatMessage.applyRollMode({ speaker: ChatMessage.getSpeaker({ actor }), content: html }, game.settings.get('core', 'rollMode'))
    ChatMessage.create(message)
  })
}

/** Select a discipline to display */
export const _onSelectDiscipline = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const discipline = target.getAttribute('data-discipline')

  _updateSelectedDiscipline(actor, discipline)
}

/** Select a power to display */
export const _onSelectDisciplinePower = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const power = target.getAttribute('data-power')

  _updateSelectedDisciplinePower(actor, power)
}

export const _updateSelectedDisciplinePower = async function (actor, power) {
  // Variables yet to be defined
  const updatedData = {}

  // Make sure we actually have a valid power defined
  if (power && actor.items.get(power)) {
    const powerItem = actor.items.get(power)
    const discipline = powerItem.system.discipline

    // Update the selected power
    updatedData.selectedDisciplinePower = power
    powerItem.update({
      system: {
        selected: true
      }
    })

    // Update the selected disciplines
    _updateSelectedDiscipline(actor, discipline)
  } else {
    // Revert to an empty string
    updatedData.selectedDisciplinePower = ''
  }

  // Unselect the previously selected power
  const previouslySelectedPower = actor.system?.selectedDisciplinePower
  if (previouslySelectedPower && actor.items.get(previouslySelectedPower) && previouslySelectedPower !== power) {
    actor.items.get(previouslySelectedPower).update({
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

export const _updateSelectedDiscipline = async function (actor, discipline) {
  // Variables yet to be defined
  const updatedData = {}

  // Make sure we actually have a discipline defined
  if (discipline && actor.system.disciplines[discipline]) {
    updatedData.disciplines ??= {}
    updatedData.disciplines[discipline] ??= {}

    // Update the selected disciplines
    updatedData.selectedDiscipline = discipline
    updatedData.disciplines[discipline].selected = true
  } else {
    // Revert to an empty string
    updatedData.selectedDiscipline = ''
  }

  // Unselect the previously selected discipline

  const previouslySelectedDiscipline = actor.system?.selectedDiscipline
  if (previouslySelectedDiscipline && previouslySelectedDiscipline !== discipline) {
    updatedData.disciplines[previouslySelectedDiscipline] ??= {}
    updatedData.disciplines[previouslySelectedDiscipline].selected = false
  }

  // Update the actor data
  actor.update({
    system: updatedData
  })
}
