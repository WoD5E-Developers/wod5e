/* global foundry, game, foundry */

const experienceTemplate = 'systems/vtm5e/display/shared/actors/parts/experience-display.hbs'

export const _onAddExperience = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const isSpendingXP = target.getAttribute('data-operation') === 'spend'

  // Define the actor's gamesystem, defaulting to "mortal" if it's not in the systems list
  const system = actor.system.gamesystem

  // Render the template
  const experienceData = {
    name: isSpendingXP ? game.i18n.localize('WOD5E.Experience.XPSpent') : game.i18n.localize('WOD5E.Experience.XPGained'),
    value: 0
  }
  const experienceContent = await foundry.applications.handlebars.renderTemplate(experienceTemplate, experienceData)

  const result = await foundry.applications.api.DialogV2.input({
    window: { title: isSpendingXP ? game.i18n.localize('WOD5E.Experience.SpendExperience') : game.i18n.localize('WOD5E.Experience.AddExperience') },
    content: experienceContent,
    ok: {
      icon: 'fas fa-check',
      label: game.i18n.localize('WOD5E.Add')
    },
    buttons: [
      {
        action: 'cancel',
        icon: 'fas fa-times',
        label: game.i18n.localize('WOD5E.Cancel'),
        type: 'button'
      }
    ],
    classes: ['wod5e', system]
  })

  if (result !== 'cancel') {
    // Put the new experience into an object
    const newExperience = {
      id: foundry.utils.randomID(8),
      name: result.xpName,
      value: isSpendingXP ? -Math.abs(result.xpValue) : Math.abs(result.xpValue),
      timestamp: Date.now()
    }

    // Define the existing list of experiences
    const actorExperiences = actor.system.experiences || []

    // Add the new experience to the list
    actorExperiences.push(newExperience)

    // Update the actor
    await actor.update({ 'system.experiences': actorExperiences })
  }
}

export const _onRemoveExperience = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const experienceId = target.getAttribute('data-experience-id')

  // Define the actor's gamesystem, defaulting to "mortal" if it's not in the systems list
  const system = actor.system.gamesystem

  // Define the existing list of experiences
  let actorExperiences = actor.system.experiences || []
  const experienceToDelete = actorExperiences.find(exp => exp.id === experienceId)

  if (!experienceToDelete) {
    console.error(`World of Darkness 5e | Experience with ID ${experienceId} not found.`)

    return
  }

  // Define the template to be used
  const template = `
    <div class="form-group">
        <label>${game.i18n.format('WOD5E.ConfirmDeleteDescription', {
          string: experienceToDelete.name
        })}</label>
    </div>`

  const shouldDelete = await foundry.applications.api.DialogV2.confirm({
    window: { title: game.i18n.localize('WOD5E.ConfirmDelete') },
    content: template,
    yes: {
      label: game.i18n.localize('WOD5E.Delete')
    },
    no: {
      label: game.i18n.localize('WOD5E.Cancel'),
      default: true
    },
    classes: ['wod5e', system]
  })

  if (shouldDelete) {
    // Filter out the experience to be removed
    actorExperiences = actorExperiences.filter(exp => exp.id !== experienceId)

    // Update the actor with the new list of experiences
    await actor.update({ 'system.experiences': actorExperiences })
  }
}

export const _onEditExperience = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const experienceId = target.getAttribute('data-experience-id')

  // Define the actor's gamesystem, defaulting to "mortal" if it's not in the systems list
  const system = actor.system.gamesystem

  // Find the experience to edit
  const experienceToEdit = (actor.system.experiences || []).find(exp => exp.id === experienceId)

  if (!experienceToEdit) {
    console.error(`World of Darkness 5e | Experience with ID ${experienceId} not found.`)

    return
  }

  // Render the template with the current experience data
  const experienceData = {
    name: experienceToEdit.name,
    value: experienceToEdit.value
  }
  const experienceContent = await foundry.applications.handlebars.renderTemplate(experienceTemplate, experienceData)

  const result = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize('WOD5E.Experience.EditExperience') },
    content: experienceContent,
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
    classes: ['wod5e', system]
  })

  if (result !== 'cancel') {
    // Update the experience
    experienceToEdit.name = result.xpName
    experienceToEdit.value = result.xpValue

    // Define the existing list of experiences
    let actorExperiences = actor.system.experiences || []

    // Replace the old experience with the updated one
    actorExperiences = actorExperiences.map(exp => exp.id === experienceId ? experienceToEdit : exp)

    // Update the actor with the modified list
    await actor.update({ 'system.experiences': actorExperiences })
  }
}

export const getDerivedExperience = async function (systemData) {
  const exp = systemData.exp
  const experiences = systemData?.experiences

  // If there's no experiences to calculate from, just end the statement early
  if (!experiences) return

  const { totalXP, remainingXP } = experiences.reduce((acc, exp) => {
    const value = parseInt(exp.value)

    // If the value is greater than or equal to 0, add it under total XP
    if (value >= 0) {
      acc.totalXP += value
    }

    // Accumulate remaining XP by adding the experience value (can be positive or negative)
    acc.remainingXP += value

    return acc
  }, {
    totalXP: parseInt(exp.max) || 0,
    remainingXP: parseInt(exp.value) || 0
  })

  // Return the derived XP values
  return {
    totalXP,
    remainingXP
  }
}
