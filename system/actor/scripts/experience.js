/* global game, renderTemplate, WOD5E, foundry, Dialog */

export const _onAddExperience = async function (actor) {
  // Define the actor's gamesystem, defaulting to "mortal" if it's not in the systems list
  const system = actor.system.gamesystem in WOD5E.Systems.getList() ? actor.system.gamesystem : 'mortal'

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
            await actor.update({ ['system.experiences']: actorExperiences })
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
/*
export const _onRemoveExperience = async function (event, actor) {

}

export const _onEditExperience = async function (event, actor) {

}
*/
