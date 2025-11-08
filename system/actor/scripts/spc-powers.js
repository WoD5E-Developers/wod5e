import { Disciplines } from '../../api/def/disciplines.js'
import { Edges } from '../../api/def/edges.js'
import { Gifts } from '../../api/def/gifts.js'

export const _onCreatePower = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const powerType = target.getAttribute('data-type')

  // Variables yet to be defined
  let powersList = {}
  let label = ''
  let titleLabel = ''

  // Gather and push the list of options to the 'options' variable
  if (powerType === 'discipline') {
    powersList = Disciplines.getList({})
    label = game.i18n.localize('WOD5E.VTM.SelectDiscipline')
    titleLabel = game.i18n.localize('WOD5E.VTM.AddDiscipline')
  } else if (powerType === 'gift') {
    powersList = Gifts.getList({})
    label = game.i18n.localize('WOD5E.WTA.SelectGift')
    titleLabel = game.i18n.localize('WOD5E.WTA.AddGift')
  } else if (powerType === 'edge') {
    powersList = Edges.getList({})
    label = game.i18n.localize('WOD5E.HTR.SelectEdge')
    titleLabel = game.i18n.localize('WOD5E.HTR.AddEdge')
  }

  // Build the options for the select dropdown
  const content = new foundry.data.fields.StringField({
    choices: powersList,
    label,
    required: true
  }).toFormGroup(
    {},
    {
      name: 'power'
    }
  ).outerHTML

  // Prompt a dialog to determine which edge we're adding
  const powerSelected = await foundry.applications.api.DialogV2.prompt({
    window: {
      title: titleLabel
    },
    classes: ['wod5e', actor.system.gamesystem, 'dialog'],
    content,
    ok: {
      callback: (event, button) =>
        new foundry.applications.ux.FormDataExtended(button.form).object.power
    },
    modal: true
  })

  if (powerSelected) {
    // If the power wasn't already visible, make it visible
    actor.update({ [`system.${powerType}s.${powerSelected}.visible`]: true })
  }
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
