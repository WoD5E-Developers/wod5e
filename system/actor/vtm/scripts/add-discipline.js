/* global game, Dialog, WOD5E */

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

        // Make the edge visible
        await actor.update({ [`system.disciplines.${disciplineSelected}.visible`]: true })
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
