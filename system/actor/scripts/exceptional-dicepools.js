/* global game, Dialog */

import { Skills } from '../../api/def/skills.js'

export const _onCreateExceptionalSkill = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  // Variables yet to be defined
  let options = ''
  let buttons = {}

  // Gather and push the list of options to the 'options' variable
  for (const [key, value] of Object.entries(Skills.getList({}))) {
    options = options.concat(`<option value="${key}">${game.i18n.localize(value.displayName)}</option>`)
  }

  // Define the template to be used
  const template = `
    <form>
        <div class="form-group">
            <label>${game.i18n.localize('WOD5E.SPC.SelectSkill')}</label>
            <select id="skillSelect">${options}</select>
        </div>
    </form>`

  // Define any buttons needed and add them to the buttons variable
  buttons = {
    submit: {
      icon: '<i class="fas fa-check"></i>',
      label: game.i18n.localize('WOD5E.Add'),
      callback: async (html) => {
        // Define the skill being used
        const exceptionalskill = html.find('#skillSelect')[0].value

        // If the dicepool wasn't already visible, make it visible
        actor.update({ [`system.exceptionaldicepools.${exceptionalskill}.active`]: true })
      }
    },
    cancel: {
      icon: '<i class="fas fa-times"></i>',
      label: game.i18n.localize('WOD5E.Cancel')
    }
  }

  // Display the dialog
  new Dialog({
    title: game.i18n.localize('WOD5E.SPC.AddSkill'),
    content: template,
    buttons,
    default: 'submit'
  },
  {
    classes: ['wod5e', actor.system.gamesystem, 'dialog']
  }).render(true)
}

export const _onDeleteExceptionalSkill = async function (event, target) {
  const actor = this.actor
  const exceptionalSkill = target.getAttribute('exceptionalskill')

  actor.update({ [`system.exceptionaldicepools.${exceptionalSkill}.active`]: false })
}
