/* global foundry, game */

import { getSelectorsList } from '../../api/get-selectors-list.js'

const bonusTemplate = 'systems/vtm5e/display/shared/items/parts/modifier-display.hbs'

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
    },
    modifierSelectors: getSelectorsList()
  }

  // Render the template
  const bonusContent = await foundry.applications.handlebars.renderTemplate(
    bonusTemplate,
    bonusData
  )

  const result = await foundry.applications.api.DialogV2.input({
    window: {
      title: bonusData.bonus.source
    },
    content: bonusContent,
    ok: {
      icon: 'fas fa-check',
      label: game.i18n.localize('WOD5E.Add')
    },
    buttons: [
      {
        action: 'cancel',
        icon: 'fas fa-times',
        label: game.i18n.localize('WOD5E.Cancel')
      }
    ],
    render: (_event, dialog) => {
      // Initialize flexdataset for each input
      const selectorInputs = dialog.element.querySelectorAll('.modifier-selectors')
      selectorInputs.forEach(function (element) {
        $(element).flexdatalist({
          selectionRequired: true,
          minLength: 1,
          multiple: true,
          valueProperty: 'value',
          searchContain: true
        })
      })

      const activeWhenCheck = dialog.element.querySelector('#activeWhenCheck')
      const activeWhenPath = dialog.element.querySelector('.active-when-path')
      const activeWhenValue = dialog.element.querySelector('.active-when-value')

      activeWhenPath.style.visibility = ['isEqual', 'isPath'].includes(activeWhenCheck.value)
        ? 'visible'
        : 'hidden'
      activeWhenValue.style.visibility = activeWhenCheck.value === 'isEqual' ? 'visible' : 'hidden'

      activeWhenCheck.addEventListener('change', function () {
        activeWhenPath.style.visibility = ['isEqual', 'isPath'].includes(activeWhenCheck.value)
          ? 'visible'
          : 'hidden'
        activeWhenValue.style.visibility =
          activeWhenCheck.value === 'isEqual' ? 'visible' : 'hidden'
      })
    }
  })

  if (result !== 'cancel') {
    const source = result.modifierSource ?? null
    const value = result.modifierValue ?? null
    const displayWhenInactive = result.displayModifierWhenInactive ?? false

    const paths = result.modifier?.split(',') ?? null

    const activeWhen = {
      check: result.activeWhenCheck ?? null,
      path: result.activeWhenPath ?? null,
      value: result.activeWhenValue ?? null
    }

    const unless = result.unless ?? null

    const newModifier = {
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
    bonus: item.system.bonuses[key],
    modifierSelectors: getSelectorsList()
  }

  // Render the template
  const bonusContent = await foundry.applications.handlebars.renderTemplate(
    bonusTemplate,
    bonusData
  )

  const result = await foundry.applications.api.DialogV2.input({
    window: {
      title: bonusData.bonus.source
    },
    content: bonusContent,
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
    render: (_event, dialog) => {
      // Initialize flexdataset for each input
      const selectorInputs = dialog.element.querySelectorAll('.modifier-selectors')
      selectorInputs.forEach(function (element) {
        $(element).flexdatalist({
          selectionRequired: true,
          minLength: 1,
          multiple: true,
          valueProperty: 'value',
          searchContain: true
        })
      })

      const activeWhenCheck = dialog.element.querySelector('#activeWhenCheck')
      const activeWhenPath = dialog.element.querySelector('.active-when-path')
      const activeWhenValue = dialog.element.querySelector('.active-when-value')

      activeWhenPath.style.visibility = ['isEqual', 'isPath'].includes(activeWhenCheck.value)
        ? 'visible'
        : 'hidden'
      activeWhenValue.style.visibility = activeWhenCheck.value === 'isEqual' ? 'visible' : 'hidden'

      activeWhenCheck.addEventListener('change', function () {
        activeWhenPath.style.visibility = ['isEqual', 'isPath'].includes(activeWhenCheck.value)
          ? 'visible'
          : 'hidden'
        activeWhenValue.style.visibility =
          activeWhenCheck.value === 'isEqual' ? 'visible' : 'hidden'
      })
    }
  })

  if (result !== 'cancel') {
    const source = result.modifierSource ?? null
    const value = result.modifierValue ?? null
    const displayWhenInactive = result.displayModifierWhenInactive ?? false

    const paths = result.modifier?.split(',') ?? null

    const activeWhen = {
      check: result.activeWhenCheck ?? null,
      path: result.activeWhenPath ?? null,
      value: result.activeWhenValue ?? null
    }

    const unless = result.unless ?? null

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
}
