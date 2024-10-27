/* global game, Dialog */

import { Disciplines } from '../../api/def/disciplines.js'
import { Edges } from '../../api/def/edges.js'
import { Gifts } from '../../api/def/gifts.js'

export const _onCreatePower = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const powerType = target.getAttribute('data-type')

  // Variables yet to be defined
  let options = ''
  let buttons = {}
  let titleLabel = ''
  let label = ''

  // Gather and push the list of options to the 'options' variable
  if (powerType === 'discipline') {
    const disciplinesList = Disciplines.getList({})
    for (const [key, value] of Object.entries(disciplinesList)) {
      options = options.concat(`<option value="${key}">${value.displayName}</option>`)
    }

    titleLabel = game.i18n.localize('WOD5E.VTM.AddDiscipline')
    label = game.i18n.localize('WOD5E.VTM.SelectDiscipline')
  } else if (powerType === 'gift') {
    const giftsList = Gifts.getList({})
    for (const [key, value] of Object.entries(giftsList)) {
      options = options.concat(`<option value="${key}">${value.displayName}</option>`)
    }

    titleLabel = game.i18n.localize('WOD5E.WTA.AddGift')
    label = game.i18n.localize('WOD5E.WTA.SelectGift')
  } else if (powerType === 'edge') {
    const edgesList = Edges.getList({})
    for (const [key, value] of Object.entries(edgesList)) {
      options = options.concat(`<option value="${key}">${value.displayName}</option>`)
    }

    titleLabel = game.i18n.localize('WOD5E.HTR.AddEdge')
    label = game.i18n.localize('WOD5E.HTR.SelectEdge')
  }

  // Define the template to be used
  const template = `
    <form>
        <div class="form-group">
            <label>${label}</label>
            <select id="powerSelect">${options}</select>
        </div>
    </form>`

  // Define any buttons needed and add them to the buttons variable
  buttons = {
    submit: {
      icon: '<i class="fas fa-check"></i>',
      label: game.i18n.localize('WOD5E.Add'),
      callback: async (html) => {
        // Define the selected discipline
        const power = html.find('#powerSelect')[0].value

        // If the discipline wasn't already visible, make it visible
        actor.update({ [`system.${powerType}s.${power}.visible`]: true })
      }
    },
    cancel: {
      icon: '<i class="fas fa-times"></i>',
      label: game.i18n.localize('WOD5E.Cancel')
    }
  }

  // Display the dialog
  new Dialog({
    title: titleLabel,
    content: template,
    buttons,
    default: 'submit'
  },
  {
    classes: ['wod5e', actor.system.gamesystem, 'dialog']
  }).render(true)
}

export const _onDeletePower = async function (event, target) {
  const actor = this.actor
  const powerType = target.getAttribute('data-type')
  const powerId = target.getAttribute('data-id')

  if (powerType === 'discipline') {
    actor.update({ [`system.disciplines.${powerId}.visible`]: false })
  } else if (powerType === 'edge') {
    actor.update({ [`system.edges.${powerId}.visible`]: false })
  } else if (powerType === 'gift') {
    actor.update({ [`system.gifts.${powerId}.visible`]: false })
  }
}
