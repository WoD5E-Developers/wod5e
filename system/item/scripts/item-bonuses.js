/* global renderTemplate, Dialog, game */

import { getSelectorsList } from '../../api/get-selectors-list.js'

export const _onAddBonus = async function (event) {
  event.preventDefault()

  // Top-level variables
  const item = this.item

  // Secondary variables
  const bonusData = {
    item,
    bonus: {
      source: 'New bonus',
      value: 1,
      paths: [],
      displayWhenInactive: false,
      activeWhen: {
        check: 'always'
      }
    }
  }

  // Render the template
  const bonusTemplate = 'systems/vtm5e/display/shared/items/parts/bonus-display.hbs'
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
            let newBonus = {}

            const source = html.find('[id=bonusSource]').val()
            const value = html.find('[id=bonusValue]').val()
            const displayWhenInactive = html.find('[id=displayBonusWhenInactive]').is(':checked')

            const paths = html.find('[id=bonusPaths]').flexdatalist('value')

            activeWhen.check = html.find('[id=activeWhenCheck]').val()
            activeWhen.path = html.find('[id=activeWhenPath]').val()
            activeWhen.value = html.find('[id=activeWhenValue]').val()

            const unless = html.find('[id=unless]').val()

            newBonus = {
              source,
              value,
              paths,
              unless,
              displayWhenInactive,
              activeWhen
            }

            // Define the existing list of bonuses
            const itemBonuses = item.system.bonuses || []

            // Add the new bonus to the list
            itemBonuses.push(newBonus)

            // Update the item
            await item.update({ 'system.bonuses': itemBonuses })
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
        const input = html.find('.bonus-selectors')
        // Handle formatting the input for selectors
        const data = getSelectorsList(item)
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

export const _onDeleteBonus = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const item = this.item
  const key = target.getAttribute('data-bonus')

  // Define the existing list of bonuses
  const itemBonuses = item.system.bonuses || []

  // Remove the bonus from the list
  itemBonuses.splice(key, 1)

  // Update the item
  await item.update({ 'system.bonuses': itemBonuses })
}

export const _onEditBonus = async function (event, target) {
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
  const bonusTemplate = 'systems/vtm5e/display/shared/items/parts/bonus-display.hbs'
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

            const source = html.find('[id=bonusSource]').val()
            const value = html.find('[id=bonusValue]').val()
            const displayWhenInactive = html.find('[id=displayBonusWhenInactive]').is(':checked')

            const paths = html.find('[id=bonusPaths]').flexdatalist('value')

            activeWhen.check = html.find('[id=activeWhenCheck]').val()
            activeWhen.path = html.find('[id=activeWhenPath]').val()
            activeWhen.value = html.find('[id=activeWhenValue]').val()

            const unless = html.find('[id=unlessValue]').val()

            // Define the existing list of bonuses
            const itemBonuses = item.system.bonuses

            // Update the existing bonus with the new data
            itemBonuses[key] = {
              source,
              value,
              paths,
              unless,
              displayWhenInactive,
              activeWhen
            }

            // Update the item
            await item.update({ 'system.bonuses': itemBonuses })
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
        const input = html.find('.bonus-selectors')
        // Handle formatting the input for selectors
        const data = getSelectorsList(item)
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
