/* global foundry, Dialog, game */

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
  const bonusTemplate = 'systems/vtm5e/display/shared/items/parts/modifier-display.hbs'
  const bonusContent = await foundry.applications.handlebars.renderTemplate(bonusTemplate, bonusData)

  new Dialog(
    {
      title: bonusData.bonus.source,
      content: bonusContent,
      buttons: {
        add: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize('WOD5E.Add'),
          callback: async html => {
            const dialogHTML = html[0]

            const activeWhen = {}
            let newModifier = {}

            const source = dialogHTML.querySelector('#modifierSource')?.value ?? null
            const value = dialogHTML.querySelector('#modifierValue')?.value ?? null
            const displayWhenInactive = dialogHTML.querySelector('#displayModifierWhenInactive')?.checked ?? false

            const modifierEl = dialogHTML.querySelector('#modifier')
            const paths = modifierEl ? $(modifierEl).flexdatalist('value') : null

            activeWhen.check = dialogHTML.querySelector('#activeWhenCheck')?.value ?? null
            activeWhen.path = dialogHTML.querySelector('#activeWhenPath')?.value ?? null
            activeWhen.value = dialogHTML.querySelector('#activeWhenValue')?.value ?? null

            const unless = dialogHTML.querySelector('#unless')?.value ?? null

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
        const dialogHTML = html[0]

        // Active When Handler
        const activeWhenCheck = dialogHTML.querySelector('#activeWhenCheck')
        const activeWhenPath = dialogHTML.querySelector('#activeWhenPath').parentElement
        const activeWhenValue = dialogHTML.querySelector('#activeWhenValue').parentElement

        // Input for the list of selectors
        const input = dialogHTML.querySelector('.modifier-selectors')
        // Handle formatting the input for selectors
        const data = getSelectorsList()
        $(input).flexdatalist({
          selectionRequired: 1,
          minLength: 1,
          searchIn: ['displayName'],
          multiple: true,
          valueProperty: 'id',
          searchContain: true,
          data
        })

        activeWhenCheck.addEventListener('change', function () {
          if (activeWhenCheck.value === 'isEqual') {
            activeWhenPath.css('visibility', 'visible')
            activeWhenValue.css('visibility', 'visible')
          } else if (activeWhenCheck.value === 'isPath') {
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
  const bonusTemplate = 'systems/vtm5e/display/shared/items/parts/modifier-display.hbs'
  const bonusContent = await foundry.applications.handlebars.renderTemplate(bonusTemplate, bonusData)

  new Dialog(
    {
      title: bonusData.bonus.source,
      content: bonusContent,
      buttons: {
        save: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize('WOD5E.Save'),
          callback: async html => {
            const dialogHTML = html[0]

            const activeWhen = {}

            const source = dialogHTML.querySelector('#modifierSource')?.value ?? null
            const value = dialogHTML.querySelector('#modifierValue')?.value ?? null
            const displayWhenInactive = dialogHTML.querySelector('#displayModifierWhenInactive')?.checked ?? false
            const paths = $(dialogHTML.querySelector('#modifier'))?.flexdatalist('value') ?? null

            activeWhen.check = dialogHTML.querySelector('#activeWhenCheck')?.value ?? null
            activeWhen.path = dialogHTML.querySelector('#activeWhenPath')?.value ?? null
            activeWhen.value = dialogHTML.querySelector('#activeWhenValue')?.value ?? null

            const unless = dialogHTML.querySelector('#unless')?.value ?? null

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
        const dialogHTML = html[0]

        // Active When Handler
        const activeWhenCheck = dialogHTML.querySelector('#activeWhenCheck')
        const activeWhenPath = dialogHTML.querySelector('#activeWhenPath').parentElement
        const activeWhenValue = dialogHTML.querySelector('#activeWhenValue').parentElement

        // Input for the list of selectors
        const input = dialogHTML.querySelector('.modifier-selectors')
        // Handle formatting the input for selectors
        const data = getSelectorsList()
        $(input).flexdatalist({
          selectionRequired: 1,
          minLength: 1,
          searchIn: ['displayName'],
          multiple: true,
          valueProperty: 'id',
          searchContain: true,
          data
        })

        activeWhenCheck.addEventListener('change', function () {
          if (activeWhenCheck.value === 'isEqual') {
            activeWhenPath.css('visibility', 'visible')
            activeWhenValue.css('visibility', 'visible')
          } else if (activeWhenCheck.value === 'isPath') {
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
