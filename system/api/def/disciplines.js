/* global game, Hooks */

import { BaseDefinitionClass } from './base-definition-class.js'

export class Disciplines extends BaseDefinitionClass {
  static modsEnabled = true
  static type = 'disciplines'
  static defCategory = 'Disciplines'

  // Run any necessary compilation on ready
  static onReady () {
    // Handle adding custom disciplines from the game settings
    let customDisciplines = game.settings.get('vtm5ec', 'customDisciplines') || {}

    // Handle adding custom disciplines from any active modules
    const activeModules = game.modules.filter(module => module.active === true && module.flags.wod5e)
    activeModules.forEach((module) => {
      if (module.flags.wod5e.customDisciplines) {
        customDisciplines = customDisciplines.concat(module.flags.wod5e.customDisciplines)
      }
    })

    if (customDisciplines) {
      Disciplines.addCustom(customDisciplines)
    }

    Disciplines.setSortAlphabetically()
    Disciplines.initializeLabels()
    Disciplines.initializePaths()
  }

  static initializePaths () {
    // Cycle through each entry in the definition file to initialize the paths on each
    // Quickly filter out any non-object, non-null, non-array values
    const definitionEntries = Object.entries(this).filter(([, value]) => typeof value === 'object' && value !== null && !Array.isArray(value))
    for (const [key, value] of definitionEntries) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Set the path
        value.path = `system.disciplines.${key}.value`
      }
    }
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
