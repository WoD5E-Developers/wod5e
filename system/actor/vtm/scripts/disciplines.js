/* global game, WOD5E, foundry */

/** Handle adding a new discipline to the sheet */
export const _onAddDiscipline = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  // Secondary variables
  const disciplineList = WOD5E.Disciplines.getList({})

  // Build the options for the select dropdown
  const content = new foundry.data.fields.StringField({
    choices: disciplineList,
    label: game.i18n.localize('WOD5E.VTM.SelectDiscipline'),
    required: true
  }).toFormGroup({},
    {
      name: 'discipline'
    }).outerHTML

  // Prompt a dialog to determine which discipline we're adding
  const disciplineSelected = await foundry.applications.api.DialogV2.prompt({
    window: {
      title: game.i18n.localize('WOD5E.VTM.AddDiscipline')
    },
    classes: ['wod5e', 'dialog', 'vampire', 'dialog'],
    content,
    ok: {
      callback: (event, button) => new foundry.applications.ux.FormDataExtended(button.form).object.discipline
    },
    modal: true
  })

  if (disciplineSelected) {
    // Make the discipline visible
    actor.update({ [`system.disciplines.${disciplineSelected}.visible`]: true })

    // Update the currently selected discipline and power
    _updateSelectedDiscipline(actor, disciplineSelected)
    _updateSelectedDisciplinePower(actor, '')
  }
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

  foundry.documents.ChatMessage.implementation.create({
    flags: {
      vtm5e: {
        name: discipline.displayName,
        img: 'icons/svg/dice-target.svg',
        description: discipline?.description
      }
    }
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
