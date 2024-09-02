/* global game, renderTemplate, WOD5E, foundry, Dialog */

export const _onAddExperience = async function () {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  // Define the actor's gamesystem, defaulting to "mortal" if it's not in the systems list
  const system = actor.system.gamesystem in WOD5E.Systems.getList({}) ? actor.system.gamesystem : 'mortal'

  // Render the template
  const experienceTemplate = 'systems/vtm5e/display/shared/actors/parts/experience-display.hbs'
  const experienceData = {
    name: game.i18n.localize('WOD5E.Experience.NewExperience'),
    value: 0
  }
  const experienceContent = await renderTemplate(experienceTemplate, experienceData)

  new Dialog(
    {
      title: game.i18n.localize('WOD5E.Experience.AddExperience'),
      content: experienceContent,
      buttons: {
        add: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize('WOD5E.Add'),
          callback: async html => {
            // Get the source (name) and the value (modifier) from the dialogue
            const name = html.find('[id=xpName]').val()
            const value = html.find('[id=xpValue]').val()

            // Put the new experience into an object
            let newExperience = {}
            newExperience = {
              id: foundry.utils.randomID(8),
              name,
              value
            }

            // Define the existing list of experiences
            const actorExperiences = actor.system.experiences || []

            // Add the new experience to the list
            actorExperiences.push(newExperience)

            // Update the actor
            await actor.update({ 'system.experiences': actorExperiences })
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize('WOD5E.Cancel')
        }
      },
      default: 'add'
    },
    {
      classes: ['wod5e', system, 'dialog']
    }
  ).render(true)
}

export const _onRemoveExperience = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const element = event.currentTarget
  const dataset = Object.assign({}, element.dataset)
  const experienceId = dataset.experienceId

  // Define the actor's gamesystem, defaulting to "mortal" if it's not in the systems list
  const system = actor.system.gamesystem in WOD5E.Systems.getList({}) ? actor.system.gamesystem : 'mortal'
  
  // Define the existing list of experiences
  let actorExperiences = actor.system.experiences || []
  const experienceToDelete = actorExperiences.find(exp => exp.id === experienceId)

  if (!experienceToDelete) {
    console.error(`Experience with ID ${experienceId} not found.`)

    return
  }

  // Variables yet to be defined
  let buttons = {}

  // Define the template to be used
  const template = `
  <form>
      <div class="form-group">
          <label>${game.i18n.format('WOD5E.ConfirmDeleteDescription', {
            string: experienceToDelete.name
          })}</label>
      </div>
  </form>`

  // Define the buttons and push them to the buttons variable
  buttons = {
    delete: {
      label: game.i18n.localize('WOD5E.Delete'),
      callback: async () => {
        // Filter out the experience to be removed
        actorExperiences = actorExperiences.filter(exp => exp.id !== experienceId)
        
        // Update the actor with the new list of experiences
        await actor.update({ 'system.experiences': actorExperiences })
      }
    },
    cancel: {
      label: game.i18n.localize('WOD5E.Cancel')
    }
  }

  new Dialog({
    title: game.i18n.localize('WOD5E.ConfirmDelete'),
    content: template,
    buttons,
    default: 'cancel'
  },
  {
    classes: ['wod5e', system, 'dialog']
  }).render(true)
}

export const _onEditExperience = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const element = event.currentTarget
  const dataset = Object.assign({}, element.dataset)
  const experienceId = dataset.experienceId

  // Define the actor's gamesystem, defaulting to "mortal" if it's not in the systems list
  const system = actor.system.gamesystem in WOD5E.Systems.getList({}) ? actor.system.gamesystem : 'mortal'
  
  // Find the experience to edit
  const experienceToEdit = (actor.system.experiences || []).find(exp => exp.id === experienceId)
  
  if (!experienceToEdit) {
    console.error(`Experience with ID ${experienceId} not found.`)

    return
  }

  // Render the template with the current experience data
  const experienceTemplate = 'systems/vtm5e/display/shared/actors/parts/experience-display.hbs'
  const experienceData = {
    name: experienceToEdit.name,
    value: experienceToEdit.value
  }
  const experienceContent = await renderTemplate(experienceTemplate, experienceData)

  new Dialog(
    {
      title: game.i18n.localize('WOD5E.Experience.EditExperience'),
      content: experienceContent,
      buttons: {
        save: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize('WOD5E.Save'),
          callback: async html => {
            // Get the updated name and value from the dialogue
            const name = html.find('[id=xpName]').val()
            const value = html.find('[id=xpValue]').val()
            
            // Update the experience
            experienceToEdit.name = name
            experienceToEdit.value = value
            
            // Define the existing list of experiences
            let actorExperiences = actor.system.experiences || []
            
            // Replace the old experience with the updated one
            actorExperiences = actorExperiences.map(exp => exp.id === experienceId ? experienceToEdit : exp)
            
            // Update the actor with the modified list
            await actor.update({ 'system.experiences': actorExperiences })
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize('WOD5E.Cancel')
        }
      },
      default: 'save'
    },
    {
      classes: ['wod5e', system, 'dialog']
    }
  ).render(true)
}

export const _onCalculateDerivedExperience = async function (actor) {
  const exp = actor.system.exp
  const experiences = actor.system.experiences

  // If there's no experiences to calculate from, just end the statement early
  if (!experiences) return

  const { totalXP, spentXP } = experiences.reduce((acc, exp) => {
    const value = parseInt(exp.value)

    // If the value is greater than or equal to 0, add it under total XP
    if (value >= 0) {
        acc.totalXP += value
    } else { // Otherwise, track it as spent XP
        acc.spentXP += value
    }

    return acc
  }, {
    totalXP: parseInt(exp.max),
    spentXP: parseInt(-exp.value)
  })

  const remainingXP = totalXP + spentXP

  // Return the derivedXP values
  return {
    totalXP,
    remainingXP
  }
}
