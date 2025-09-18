/* global foundry */

import { generateLocalizedLabel } from '../../api/generate-localization.js'

export const prepareDescriptionContext = async function (context, item) {
  const itemData = item.system

  // Tab data
  context.tab = context.tabs.description

  // Part-specific data
  context.description = itemData?.description
  context.enrichedDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(itemData?.description)

  return context
}

export const prepareDicepoolContext = async function (context, item) {
  const itemData = item.system

  // Tab data
  context.tab = context.tabs.dicepool

  // Part-specific data
  context.dicepool = itemData.dicepool || {}

  // Localize the dice labels
  if (context.dicepool) {
    for (const [, value] of Object.entries(context.dicepool)) {
      if (value.path) {
        const dicePartials = value.path.split('.')
        const diceCategory = dicePartials[0]
        const diceKey = dicePartials[1]

        value.label = generateLocalizedLabel({
          string: diceKey,
          type: diceCategory
        })
      }
    }
  }

  return context
}

export const prepareMacroContext = async function (context, item) {
  const itemData = item.system

  // Tab data
  context.tab = context.tabs.macro

  // Part-specific data
  context.macroid = itemData.macroid

  return context
}

export const prepareModifiersContext = async function (context, item) {
  const itemData = item.system

  // Tab data
  context.tab = context.tabs.modifiers

  // Part-specific data
  context.bonuses = itemData.bonuses

  return context
}

export const prepareItemSettingsContext = async function (context) {
  // Tab data
  context.tab = context.tabs.settings

  return context
}

export const prepareEffectsContext = async function (context, item) {
  const itemData = item.system

  // Tab data
  context.tab = context.tabs.effects

  // Part-specific data
  context.modeOptions = {
    2: 'WOD5E.ItemsList.Add',
    5: 'WOD5E.ItemsList.Override'
  }
  context.flatSourceOptions = {
    static: 'WOD5E.ItemsList.Static'
  }
  context.effects = Object.entries(itemData.effects).reduce((acc, [key, effect]) => {
    const effectType = effect?.type || ''

    // Push to container if an effect type is set and exists
    if (acc[effectType]) {
      acc[effectType].push({
        id: key,
        ...effect
      })
    }

    return acc
  }, {
    // Containers
    flatModifier: []
  })

  return context
}
