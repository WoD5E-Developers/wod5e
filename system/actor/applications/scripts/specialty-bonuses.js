/* global foundry, game */

import { Skills } from '../../../api/def/skills.js'

const bonusTemplate = 'systems/vtm5e/display/shared/applications/skill-application/parts/specialty-display.hbs'

export const _onAddModifier = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.data.actor
  const skill = this.data.skill
  const skillOptions = Skills.getList({
    prependType: true
  })

  // Define the actor's gamesystem, defaulting to "mortal" if it's not in the systems list
  const system = actor.system.gamesystem

  // Default values for a new specialty
  const bonusData = {
    actor,
    bonus: {
      source: game.i18n.localize('WOD5E.ItemsList.NewSpecialty'),
      value: 1,
      paths: [`skills.${skill}`]
    },
    skillOptions: {
      skills: { displayName: 'All Skills' },
      ...skillOptions
    }
  }

  // Render the template
  const bonusContent = await foundry.applications.handlebars.renderTemplate(bonusTemplate, bonusData)

  const result = await foundry.applications.api.DialogV2.input({
    window: {
      title: bonusData.bonus.source
    },
    content: bonusContent,
    ok: {
      icon: 'fas fa-check',
      label: game.i18n.localize('WOD5E.Add')
    },
    buttons: [
      {
        action: 'cancel',
        icon: 'fas fa-times',
        label: game.i18n.localize('WOD5E.Cancel')
      }
    ],
    render: (_event, dialog) => {
      // Initialize flexdataset for each input
      const modifierInputs = dialog.element.querySelectorAll('#modifier')
      modifierInputs.forEach(function (element) {
        $(element).flexdatalist({
          selectionRequired: true,
          minLength: 1,
          multiple: true,
          searchContain: true,
          valueProperty: 'value'
        })
      })
    },
    classes: ['wod5e', system]
  })

  if (result !== 'cancel') {
    const source = result.modifierSource
    const value = result.modifierValue
    const paths = result.modifier.split(',')

    // displayWhenInactive is ALWAYS true for specialties
    const displayWhenInactive = true

    // Put the new bonus into an object
    const newModifier = {
      source,
      value,
      paths,
      displayWhenInactive
    }

    // Define the existing list of bonuses
    const skillModifiers = actor.system.skills[skill].bonuses || []

    // Add the new bonus to the list
    skillModifiers.push(newModifier)

    // Update the actor and re-render the editor window
    await actor.update({ [`system.skills.${skill}.bonuses`]: skillModifiers })
    this.render(true)
  }
}

export const _onDeleteModifier = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.data.actor
  const skill = this.data.skill
  const key = target.getAttribute('data-bonus')

  // Define the existing list of bonuses
  const skillModifiers = actor.system.skills[skill].bonuses || []

  // Remove the bonus from the list
  skillModifiers.splice(key, 1)

  // Update the actor and re-render the editor window
  await actor.update({ [`system.skills.${skill}.bonuses`]: skillModifiers })
  await this.render(true)
}

export const _onEditModifier = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.data.actor
  const skill = this.data.skill
  const key = target.getAttribute('data-bonus')
  const skillOptions = Skills.getList({
    prependType: true
  })

  // Secondary variables
  const bonusData = {
    actor,
    bonus: actor.system.skills[skill].bonuses[key],
    skillOptions: {
      skills: { displayName: 'All Skills' },
      ...skillOptions
    }
  }

  // Define the actor's gamesystem, defaulting to "mortal" if it's not in the systems list
  const system = actor.system.gamesystem

  // Render the template
  const bonusContent = await foundry.applications.handlebars.renderTemplate(bonusTemplate, bonusData)

  const result = await foundry.applications.api.DialogV2.input({
    window: {
      title: bonusData.bonus.source
    },
    content: bonusContent,
    ok: {
      icon: 'fas fa-check',
      label: game.i18n.localize('WOD5E.Save')
    },
    buttons: [
      {
        action: 'cancel',
        icon: 'fas fa-times',
        label: game.i18n.localize('WOD5E.Cancel')
      }
    ],
    render: (_event, dialog) => {
      // Initialize flexdataset for each input
      const modifierInputs = dialog.element.querySelectorAll('#modifier')
      modifierInputs.forEach(function (element) {
        $(element).flexdatalist({
          selectionRequired: true,
          minLength: 1,
          multiple: true,
          searchContain: true,
          valueProperty: 'value'
        })
      })
    },
    classes: ['wod5e', system]
  })

  if (result !== 'cancel') {
    const source = result.modifierSource
    const value = result.modifierValue
    const paths = result.modifier.split(',')

    // displayWhenInactive is ALWAYS true for specialties
    const displayWhenInactive = true

    // Define the existing list of bonuses
    const skillModifiers = actor.system.skills[skill].bonuses || []

    // Update the existing bonus with the new data
    skillModifiers[key] = {
      source,
      value,
      paths,
      displayWhenInactive
    }

    // Update the actor and re-render the editor window
    await actor.update({ [`system.skills.${skill}.bonuses`]: skillModifiers })
    await this.render(true)
  }
}
