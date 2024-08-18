/* global game, Hooks */

export class Disciplines {
  // Function to help with quickly grabbing all the listed values;
  // Will only retrieve objects (definitions)
  static getList ({
    custom = false
  }) {
    return Object.entries(this)
      // Filter out any entries with improper formats
      .filter(([, value]) => typeof value === 'object' && value !== null && !Array.isArray(value) &&
        // Filter based on given filters provided with the function, if any
        (!custom || value.custom === custom))
      // Reduce into a format the system can work with
      .reduce((accumulator, [key, value]) => {
        accumulator[key] = value
        return accumulator
      }, {})
  }

  // Method to add extra disciplines
  static addCustom (customDisciplines) {
    for (const [, value] of Object.entries(customDisciplines)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Note this feature as being a custom feature
        value.custom = true

        this[value.id] = value
      }
    }
  }

  // Localize the labels
  static initializeLabels () {
    const modifications = game.settings.get('vtm5e', 'modifiedDisciplines')

    for (const [key, value] of Object.entries(this)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const checkModification = modifications.filter(discipline => discipline.id === key)

        value.label = game.i18n.localize(value.label)

        // If there are modifications, update the attribute
        if (checkModification.length > 0) {
          value.rename = checkModification[0].rename
          value.hidden = checkModification[0].hidden
        } else {
          // If there are no modifications, use default values
          value.rename = ''
          value.hidden = false
        }
      }

      // Handle which label to display
      if (value.rename) {
        value.displayName = value.rename
      } else {
        value.displayName = value.label
      }
    }
  }

  // Run any necessary compilation on ready
  static onReady () {
    const customDisciplines = game.settings.get('vtm5e', 'customDisciplines')

    if (customDisciplines) {
      Disciplines.addCustom(customDisciplines)
    }

    Disciplines.initializeLabels()
  }

  static animalism = {
    label: 'WOD5E.VTM.Animalism'
  }

  static auspex = {
    label: 'WOD5E.VTM.Auspex'
  }

  static celerity = {
    label: 'WOD5E.VTM.Celerity'
  }

  static dominate = {
    label: 'WOD5E.VTM.Dominate'
  }

  static fortitude = {
    label: 'WOD5E.VTM.Fortitude'
  }

  static obfuscate = {
    label: 'WOD5E.VTM.Obfuscate'
  }

  static potence = {
    label: 'WOD5E.VTM.Potence'
  }

  static presence = {
    label: 'WOD5E.VTM.Presence'
  }

  static protean = {
    label: 'WOD5E.VTM.Protean'
  }

  static sorcery = {
    label: 'WOD5E.VTM.BloodSorcery'
  }

  static oblivion = {
    label: 'WOD5E.VTM.Oblivion'
  }

  static alchemy = {
    label: 'WOD5E.VTM.ThinBloodAlchemy'
  }

  static rituals = {
    label: 'WOD5E.VTM.Rituals'
  }

  static ceremonies = {
    label: 'WOD5E.VTM.Ceremonies'
  }
}

// Hook to call onReady when the game is ready
Hooks.once('ready', Disciplines.onReady)
