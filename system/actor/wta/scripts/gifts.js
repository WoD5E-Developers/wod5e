/* global game, Dialog, WOD5E */

export const _onAddGift = async function (actor, event) {
  event.preventDefault()

  // Secondary variables
  const selectLabel = game.i18n.localize('WOD5E.WTA.SelectGift')
  const itemOptions = WOD5E.Gifts.getList()

  // Variables yet to be defined
  let options = []
  let giftSelected

  // Prompt a dialog to determine which edge we're adding
  // Build the options for the select dropdown
  for (const [key, value] of Object.entries(itemOptions)) {
    options += `<option value="${key}">${value.displayName}</option>`
  }

  // Template for the dialog form
  const template = `
    <form>
      <div class="form-group">
        <label>${selectLabel}</label>
        <select id="giftSelect">${options}</select>
      </div>
    </form>`

  // Define dialog buttons
  const buttons = {
    submit: {
      icon: '<i class="fas fa-check"></i>',
      label: game.i18n.localize('WOD5E.Add'),
      callback: async (html) => {
        giftSelected = html.find('#giftSelect')[0].value

        // Make the edge visible
        await actor.update({ [`system.gifts.${giftSelected}.visible`]: true })
      }
    },
    cancel: {
      icon: '<i class="fas fa-times"></i>',
      label: game.i18n.localize('WOD5E.Cancel')
    }
  }

  // Display the dialog
  new Dialog({
    title: game.i18n.localize('WOD5E.Add'),
    content: template,
    buttons,
    default: 'submit'
  }, {
    classes: ['wod5e', 'dialog', 'werewolf', 'dialog']
  }).render(true)
}
