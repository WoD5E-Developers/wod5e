/* global WOD5E, TextEditor */
import { Gifts } from '../../../api/def/gifts.js'
import { WereForms } from '../../../api/def/were-forms.js'

export const prepareGifts = async function (actor) {
  // Secondary variables
  const giftsList = Gifts.getList({})
  const gifts = actor.system?.gifts

  // Clean up non-existent gifts, such as custom ones that no longer exist
  const validGifts = new Set(Object.keys(giftsList))
  for (const id of Object.keys(gifts)) {
    if (!validGifts.has(id)) {
      delete gifts[id]
    }
  }

  for (const [id, value] of Object.entries(giftsList)) {
    let giftData = {}

    // If the actor has a gift with the key, grab its current values
    if (Object.prototype.hasOwnProperty.call(gifts, id)) {
      giftData = Object.assign({
        value: gifts[id].value,
        powers: gifts[id].powers || [],
        description: gifts[id].description,
        visible: gifts[id].visible
      }, value)
    } else { // Otherwise, add it to the actor and set it as some default data
      giftData = Object.assign({
        value: 0,
        visible: false,
        description: '',
        powers: []
      }, value)
    }

    // Ensure the gift exists
    if (!gifts[id]) gifts[id] = {}
    // Apply the gift's data
    gifts[id] = giftData

    // Make it forced invisible if it's set to hidden
    if (giftData.hidden) {
      gifts[id].visible = false
    }

    // Localize the gift name
    gifts[id].label = WOD5E.api.generateLabelAndLocalize({ string: id, type: 'gift' })

    // Wipe old gift powers so they doesn't duplicate
    gifts[id].powers = []

    // Enrich gift description
    gifts[id].enrichedDescription = await TextEditor.enrichHTML(gifts[id].description)
  }

  return gifts
}

export const prepareGiftPowers = async function (gifts) {
  for (const giftType in gifts) {
    if (Object.prototype.hasOwnProperty.call(gifts, giftType)) {
      const gift = gifts[giftType]

      if (gift && Array.isArray(gift.powers)) {
        // Check if the gift has powers
        if (gift.powers.length > 0) {
          // Ensure visibility is set correctly
          if (!gift.visible && !gift.hidden) gift.visible = true

          // Sort the gift containers by the level of the power
          gift.powers = gift.powers.sort(function (power1, power2) {
            // Ensure power1 and power2 have the necessary properties
            const level1 = power1.system ? power1.system.level : 0
            const level2 = power2.system ? power2.system.level : 0

            // If levels are the same, sort alphabetically instead
            if (level1 === level2) {
              return power1.name.localeCompare(power2.name)
            }

            // Sort by level
            return level1 - level2
          })
        }
      } else {
        console.warn(`Gift ${giftType} is missing or powers is not an array.`)
      }
    }
  }

  return gifts
}

// Handle form data
export const prepareFormData = async function (formData) {
  const wereForms = WereForms.getList({})

  // Fields to keep from the existing data
  const fieldsToKeep = [
    'description',
    'token'
  ]

  // Merge new form data with existing form data
  const mergedForms = {}
  for (const formKey in wereForms) {
    if (Object.prototype.hasOwnProperty.call(wereForms, formKey)) {
      // Start with the new form data
      mergedForms[formKey] = { ...wereForms[formKey] }

      // Check if the existing form data has additional fields
      if (formData[formKey]) {
        // Add fields to keep from the existing form data
        for (const field of fieldsToKeep) {
          if (formData[formKey][field] !== undefined) {
            mergedForms[formKey][field] = formData[formKey][field]
          }
        }
      }
    }
  }

  return mergedForms
}
