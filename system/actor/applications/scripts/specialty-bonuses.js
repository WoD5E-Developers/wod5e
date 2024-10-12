/* global renderTemplate, Dialog, game */

import { Skills } from '../../../api/def/skills.js'

export const _onAddBonus = async function (event) {
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
    skillOptions
  }

  // Render the template
  const bonusTemplate = 'systems/vtm5e/display/shared/applications/skill-application/parts/specialty-display.hbs'
  const bonusContent = await renderTemplate(bonusTemplate, bonusData)

  new Dialog(
    {
      title: bonusData.bonus.source,
      content: bonusContent,
      buttons: {
        add: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize('WOD5E.Add'),
          callback: async html => {
            // Get the source (name) and the value (modifier) from the dialogue
            const source = html.find('[id=bonusSource]').val()
            const value = html.find('[id=bonusValue]').val()

            // Handle the bonus pathing and making it into an array
            const paths = html.find('[id=bonusPaths]').flexdatalist('value')

            // displayWhenInactive is ALWAYS true for specialties
            const displayWhenInactive = true

            // Put the new bonus into an object
            let newBonus = {}
            newBonus = {
              source,
              value,
              paths,
              displayWhenInactive
            }

            // Define the existing list of bonuses
            const skillBonuses = actor.system.skills[skill].bonuses || []

            // Add the new bonus to the list
            skillBonuses.push(newBonus)

            // Update the actor and re-render the editor window
            await actor.update({ [`system.skills.${skill}.bonuses`]: skillBonuses })
            this.render(true)
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize('WOD5E.Cancel')
        }
      },
      default: 'add',
      render: (html) => {
        // Input for the list of selectors
        const input = $(html).find('#bonusPaths')
        // List of selectors to choose from
        const skillOptions = Skills.getList({
          prependType: true
        })

        const data = Object.entries(skillOptions).map(([id, obj]) => ({
          id,
          ...obj
        }))

        data.unshift({
          id: 'skills',
          displayName: 'All Skills'
        })

        input.flexdatalist({
          selectionRequired: 1,
          minLength: 1,
          searchIn: ['displayName'],
          multiple: true,
          valueProperty: 'id',
          searchContain: true,
          data
        })
      }
    },
    {
      classes: ['wod5e', system, 'dialog']
    }
  ).render(true)
}

export const _onDeleteBonus = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.data.actor
  const skill = this.data.skill
  const key = target.getAttribute('data-bonus')

  // Define the existing list of bonuses
  const skillBonuses = actor.system.skills[skill].bonuses || []

  // Remove the bonus from the list
  skillBonuses.splice(key, 1)

  // Update the actor and re-render the editor window
  await actor.update({ [`system.skills.${skill}.bonuses`]: skillBonuses })
  await this.render(true)
}

export const _onEditBonus = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.data.actor
  const skill = this.data.skill
  const key = target.getAttribute('data-bonus')

  // Secondary variables
  const bonusData = {
    actor,
    bonus: actor.system.skills[skill].bonuses[key]
  }

  // Define the actor's gamesystem, defaulting to "mortal" if it's not in the systems list
  const system = actor.system.gamesystem

  // Render the template
  const bonusTemplate = 'systems/vtm5e/display/shared/applications/skill-application/parts/specialty-display.hbs'
  const bonusContent = await renderTemplate(bonusTemplate, bonusData)

  new Dialog(
    {
      title: bonusData.bonus.source,
      content: bonusContent,
      buttons: {
        save: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize('WOD5E.Save'),
          callback: async html => {
            // Get the source (name) and the value (modifier) from the dialogue
            const source = html.find('[id=bonusSource]').val()
            const value = html.find('[id=bonusValue]').val()

            // Handle the bonus pathing and making it into an array
            const paths = html.find('[id=bonusPaths]').flexdatalist('value')

            // displayWhenInactive is ALWAYS true for specialties
            const displayWhenInactive = true

            // Define the existing list of bonuses
            const skillBonuses = actor.system.skills[skill].bonuses || []

            // Update the existing bonus with the new data
            skillBonuses[key] = {
              source,
              value,
              paths,
              displayWhenInactive
            }

            // Update the actor and re-render the editor window
            await actor.update({ [`system.skills.${skill}.bonuses`]: skillBonuses })
            await this.render(true)
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize('WOD5E.Cancel')
        }
      },
      render: (html) => {
        // Input for the list of selectors
        const input = $(html).find('#bonusPaths')
        // List of selectors to choose from
        const skillOptions = Skills.getList({
          prependType: true
        })

        const data = Object.entries(skillOptions).map(([id, obj]) => ({
          id,
          ...obj
        }))

        data.unshift({
          id: 'skills',
          displayName: 'All Skills'
        })

        input.flexdatalist({
          selectionRequired: 1,
          minLength: 1,
          searchIn: ['displayName'],
          multiple: true,
          valueProperty: 'id',
          searchContain: true,
          data
        })
      }
    },
    {
      classes: ['wod5e', system, 'dialog']
    }
  ).render(true)
}
