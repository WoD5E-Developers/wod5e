/* global game, Dialog */

export const _onEditExceptionalPools = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  // Variables yet to be defined
  let options = ''
  let buttons = {}

  // Gather and push the list of options and whether they're checked or not
  for (const [key, value] of Object.entries(actor.system.exceptionaldicepools)) {
    const checkedStatus = value.active ? ' checked' : ''

    options = options.concat(`<div class="flexrow exceptional-pool" data-id="${key}">
      ${value.displayName}
      <input type="checkbox" class="exceptional-checkbox"${checkedStatus}>
    </div>`)
  }

  // Define the template to be used
  const template = `
    <form>
        <div class="form-group grid grid-3col">
            ${options}
        </div>
    </form>`

  // Define any buttons needed and add them to the buttons variable
  buttons = {
    submit: {
      icon: '<i class="fas fa-check"></i>',
      label: game.i18n.localize('WOD5E.Save'),
      callback: async (html) => {
        // Store the updated variables here
        const exceptionaldicepools = {}
        // Define the list of pools
        const exceptionalPool = html.find('.exceptional-pool')

        // Make a value in the object to store the checked property
        exceptionalPool.each(function (pool) {
          const id = exceptionalPool[pool].dataset.id
          exceptionaldicepools[id] ??= {}
          exceptionaldicepools[id] = {
            active: $(exceptionalPool[pool]).find('.exceptional-checkbox').prop('checked')
          }
        })

        // Update the actor with the new options
        actor.update({
          system: {
            exceptionaldicepools
          }
        })
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
    classes: ['wod5e', actor.system.gamesystem, 'exceptional-edit', 'dialog']
  }).render(true)
}
