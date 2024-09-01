/* global game */

import { resetActors } from '../../scripts/reset-actors.js'

export class BaseDefinitionClass {
  static modsEnabled = false
  static defCategory = ''

  // Function to help with quickly grabbing all the listed values
  // Will only retrieve objects (definitions)
  static getList ({
    type = '',
    custom = false
  }) {
    // Filter based on given filters provided with the function, if any
    let filteredEntries = Object.entries(this)
      .filter(([, value]) => typeof value === 'object' && value !== null && !Array.isArray(value) &&
        (!type || value.type === type) && (!custom || value.custom === custom))

    // Sort based on either the displayName or the key
    if (this.sortAlphabetically) {
      filteredEntries.sort(([, value1], [, value2]) => {
        // Assuming displayName is a string, we compare them directly
        return (value1.displayName || '').localeCompare(value2.displayName || '')
      })
    } else {
      filteredEntries.sort(([key1], [key2]) => {
        // Compare the keys directly
        return key1.localeCompare(key2)
      })
    }

    // Reduce into a format the system can work with
    return filteredEntries.reduce((accumulator, [key, value]) => {
      accumulator[key] = value
      return accumulator
    }, {})
  }

  // Localize the labels
  static async initializeLabels () {
    let modifications = []

    // Check if modifications are enabled
    if (this.modsEnabled && this.defCategory) {
      modifications = game.settings.get('vtm5e', `modified${this.defCategory}`)
    }

    // Cycle through each entry in the definition file to initialize the labels on each
    // Quickly filter out any non-object, non-null, non-array values
    const definitionEntries = Object.entries(this).filter(([, value]) => typeof value === 'object' && value !== null && !Array.isArray(value))
    for (const [key, value] of definitionEntries) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // If there are no modifications, use default values
        value.rename = ''
        value.hidden = false

        // If mods are enabled, check for a modification to the definition
        if (this.modsEnabled) {
          const checkModification = modifications.filter(definition => definition.id === key)

          // If there are modifications, update the value's properties
          if (checkModification.length > 0) {
            value.rename = checkModification[0].rename
            value.hidden = checkModification[0].hidden
          }
        }

        value.label = game.i18n.localize(value.label)
      }

      // Handle which label to display
      if (value.rename) {
        value.displayName = value.rename
      } else {
        value.displayName = value.label
      }
    }

    // Reload actorsheets
    resetActors()
  }

  // Method to add extra definitions to a category
  static async addCustom (customDefinitions) {
    for (const [, value] of Object.entries(customDefinitions)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Note this definition as being custom
        value.custom = true

        this[value.id] = value
      }
    }

    // Reload actorsheets
    resetActors()
  }

  static setSortAlphabetically () {
    // This will set the static property on the class that calls this method
    this.sortAlphabetically = game.settings.get('vtm5e', 'sortDefAlphabetically')
  }
}
