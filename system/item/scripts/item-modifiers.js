/* global renderTemplate, Dialog, game */

import { getSelectorsList } from '../../api/get-selectors-list.js'

export const _onAddModifier = async function (event) {
  event.preventDefault()

  // Top-level variables
  const item = this.item

  // Secondary variables
  const bonusData = {
    item,
    bonus: {
      source: game.i18n.localize('WOD5E.Modifier.NewModifier'),
      value: 1,
      paths: [],
      displayWhenInactive: false,
      activeWhen: {
        check: 'always'
      }
    }
  }

  // Render the template
  const bonusTemplate = 'systems/vtm5ec/display/shared/items/parts/modifier-display.hbs'
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
            const activeWhen = {}
            let newModifier = {}

            const source = html.find('[id=modifierSource]').val()
            const value = html.find('[id=modifierValue]').val()
            const displayWhenInactive = html.find('[id=displayModifierWhenInactive]').is(':checked')

            const paths = html.find('[id=modifier]').flexdatalist('value')

            activeWhen.check = html.find('[id=activeWhenCheck]').val()
            activeWhen.path = html.find('[id=activeWhenPath]').val()
            activeWhen.value = html.find('[id=activeWhenValue]').val()

            const unless = html.find('[id=unless]').val()

            newModifier = {
              source,
              value,
              paths,
              unless,
              displayWhenInactive,
              activeWhen
            }

            // Define the existing list of modifiers
            const itemModifiers = item.system.bonuses || []

            // Add the new bonus to the list
            itemModifiers.push(newModifier)

            // Update the item
            await item.update({ 'system.bonuses': itemModifiers })
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize('WOD5E.Cancel')
        }
      },
      default: 'add',
      render: (html) => {
        // Active When Handler
        const activeWhenCheck = html.find('#activeWhenCheck')
        const activeWhenPath = html.find('#activeWhenPath').parent()
        const activeWhenValue = html.find('#activeWhenValue').parent()

        // Input for the list of selectors
        const input = html.find('.modifier-selectors')
        // Handle formatting the input for selectors
        const data = getSelectorsList()
        input.flexdatalist({
          selectionRequired: 1,
          minLength: 1,
          searchIn: ['displayName'],
          multiple: true,
          valueProperty: 'id',
          searchContain: true,
          data
        })

        activeWhenCheck.on('change', function () {
          if (activeWhenCheck.val() === 'isEqual') {
            activeWhenPath.css('visibility', 'visible')
            activeWhenValue.css('visibility', 'visible')
          } else if (activeWhenCheck.val() === 'isPath') {
            activeWhenPath.css('visibility', 'visible')
            activeWhenValue.css('visibility', 'hidden')
          } else {
            activeWhenPath.css('visibility', 'hidden')
            activeWhenValue.css('visibility', 'hidden')
          }
        })
      }
    }
  ).render(true)
}

export const _onDeleteModifier = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const item = this.item
  const key = target.getAttribute('data-bonus')

  // Define the existing list of modifiers
  const itemModifiers = item.system.bonuses || []

  // Remove the bonus from the list
  itemModifiers.splice(key, 1)

  // Update the item
  await item.update({ 'system.bonuses': itemModifiers })
}

export const _onEditModifier = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const item = this.item
  const key = target.getAttribute('data-bonus')

  // Secondary variables
  const bonusData = {
    item,
    bonus: item.system.bonuses[key]
  }

  // Render the template
  const bonusTemplate = 'systems/vtm5ec/display/shared/items/parts/modifier-display.hbs'
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
            const activeWhen = {}

            const source = html.find('[id=modifierSource]').val()
            const value = html.find('[id=modifierValue]').val()
            const displayWhenInactive = html.find('[id=displayModifierWhenInactive]').is(':checked')

            const paths = html.find('[id=modifier]').flexdatalist('value')

            activeWhen.check = html.find('[id=activeWhenCheck]').val()
            activeWhen.path = html.find('[id=activeWhenPath]').val()
            activeWhen.value = html.find('[id=activeWhenValue]').val()

            const unless = html.find('[id=unlessValue]').val()

            // Define the existing list of modifiers
            const itemModifiers = item.system.bonuses

            // Update the existing bonus with the new data
            itemModifiers[key] = {
              source,
              value,
              paths,
              unless,
              displayWhenInactive,
              activeWhen
            }

            // Update the item
            await item.update({ 'system.bonuses': itemModifiers })
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize('WOD5E.Cancel')
        }
      },
      default: 'save',
      render: (html) => {
        // Active When Handler
        const activeWhenCheck = html.find('#activeWhenCheck')
        const activeWhenPath = html.find('#activeWhenPath').parent()
        const activeWhenValue = html.find('#activeWhenValue').parent()

        // Input for the list of selectors
        const input = html.find('.modifier-selectors')
        // Handle formatting the input for selectors
        const data = getSelectorsList()
        input.flexdatalist({
          selectionRequired: 1,
          minLength: 1,
          searchIn: ['displayName'],
          multiple: true,
          valueProperty: 'id',
          searchContain: true,
          data
        })

        activeWhenCheck.on('change', function () {
          if (activeWhenCheck.val() === 'isEqual') {
            activeWhenPath.css('visibility', 'visible')
            activeWhenValue.css('visibility', 'visible')
          } else if (activeWhenCheck.val() === 'isPath') {
            activeWhenPath.css('visibility', 'visible')
            activeWhenValue.css('visibility', 'hidden')
          } else {
            activeWhenPath.css('visibility', 'hidden')
            activeWhenValue.css('visibility', 'hidden')
          }
        })
      }
    }
  ).render(true)
}
