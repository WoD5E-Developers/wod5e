/* global TextEditor */
import { Gifts } from '../../../api/def/gifts.js'
import { WereForms } from '../../../api/def/were-forms.js'

export const prepareGifts = async function (actor) {
  // Secondary variables
  const giftsList = Gifts.getList({})
  const actorGifts = actor.system?.gifts
  const computedGifts = {}

  for (const [id, value] of Object.entries(giftsList)) {
    let giftData = {}

    // If the actor has a gift with the key, grab its current values
    if (Object.prototype.hasOwnProperty.call(actorGifts, id)) {
      giftData = Object.assign({
        id,
        value: actorGifts[id].value,
        powers: actorGifts[id].powers || [],
        description: actorGifts[id].description,
        visible: actorGifts[id].visible,
        selected: actorGifts[id].selected || false
      }, value)
    } else { // Otherwise, add it to the actor and set it as some default data
      giftData = Object.assign({
        id,
        value: 0,
        visible: false,
        description: '',
        powers: [],
        selected: false
      }, value)
    }

    // Ensure the gift exists
    if (!computedGifts[id]) computedGifts[id] = {}
    // Apply the gift's data
    computedGifts[id] = giftData

    // Make it forced invisible if it's set to hidden
    if (giftData.hidden) {
      computedGifts[id].visible = false
    }

    // Enrich gift description
    computedGifts[id].enrichedDescription = await TextEditor.enrichHTML(computedGifts[id].description)

    // Assign all matching powers to the discipline
    computedGifts[id].powers = actor.items.filter(item =>
      item.type === 'gift' && item.system.giftType === id
    )
  }

  return computedGifts
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
export const prepareFormData = async function (formData, actor) {
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
      if (formData && formData[formKey]) {
        // Add fields to keep from the existing form data
        for (const field of fieldsToKeep) {
          if (formData[formKey][field] !== undefined) {
            mergedForms[formKey][field] = formData[formKey][field]
          }
        }
      }
    }

    // Add on some additional rendering data
    // Whether the form is disabled or not
    if (mergedForms[formKey].cost > 0 && actor.system.rage.value === 0) {
      mergedForms[formKey].disabled = true
    } else {
      mergedForms[formKey].disabled = false
    }

    // Whether the form is active or not
    if (formKey === actor.system.activeForm) {
      mergedForms[formKey].active = true
    } else {
      mergedForms[formKey].active = false
    }
  }

  return mergedForms
}
