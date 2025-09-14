/* global game, foundry */

export const _onEditExceptionalPools = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  // Gather and push the list of options and whether they're checked or not
  let options = ''
  for (const [key, value] of Object.entries(actor.system.exceptionaldicepools)) {
    if (!value.hidden) {
      const checkedStatus = value.active ? ' checked' : ''
      options += `
        <div class="flexrow exceptional-pool">
          ${value.displayName}
          <input type="checkbox" class="exceptional-checkbox" name="${key}"${checkedStatus}>
        </div>`
    }
  }

  // Define the template to be used
  const content = `
    <form>
      <div class="form-group grid grid-3col">
        ${options}
      </div>
    </form>`

  // Prompt the dialog
  const updatedPools = await foundry.applications.api.DialogV2.prompt({
    window: {
      title: game.i18n.localize('WOD5E.SPC.AddSkill')
    },
    classes: ['wod5e', actor.system.gamesystem, 'exceptional-edit', 'dialog'],
    content,
    ok: {
      callback: (event, button) => {
        const formData = new foundry.applications.ux.FormDataExtended(button.form).object
        const exceptionaldicepools = {}

        for (const [id] of Object.entries(actor.system.exceptionaldicepools)) {
          exceptionaldicepools[id] = {
            active: !!formData[id]
          }
        }

        return exceptionaldicepools
      }
    },
    modal: true
  })

  if (updatedPools) {
    await actor.update({
      system: {
        exceptionaldicepools: updatedPools
      }
    })
  }
}
