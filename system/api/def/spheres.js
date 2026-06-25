import { BaseDefinitionClass } from './base-definition-class.js'

export class Spheres extends BaseDefinitionClass {
  static modsEnabled = true
  static type = 'spheres'
  static defCategory = 'Spheres'

  // Run any necessary compilation on ready
  static onReady() {
    // Handle adding custom spheres from game settings
    let customSpheres = game.settings.get('wod5e', 'customSpheres') || {}

    // Handle adding custom spheres from any active modules
    const activeModules = game.modules.filter(
      (module) => module.active === true && module.flags.wod5e
    )
    activeModules.forEach((module) => {
      if (module.flags.wod5e.customSpheres) {
        customSpheres = customSpheres.concat(module.flags.wod5e.customSpheres)

        console.log(
          `World of Darkness 5e | Custom Spheres added by ${module.id}: ${JSON.stringify(module.flags.wod5e.customSpheres)}`
        )
      }
    })

    if (customSpheres) {
      Spheres.addCustom(customSpheres)
    }

    Spheres.setSortAlphabetically()
    Spheres.initializeLabels()
    Spheres.initializePaths()
  }

  static initializePaths() {
    const definitionEntries = Object.entries(this).filter(
      ([, value]) => typeof value === 'object' && value !== null && !Array.isArray(value)
    )
    for (const [key, value] of definitionEntries) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        value.path = `system.spheres.${key}.value`
      }
    }
  }

  // The nine Spheres of Mage: the Ascension
  static correspondence = {
    label: 'WOD5E.MTA.Correspondence'
  }

  static entropy = {
    label: 'WOD5E.MTA.Entropy'
  }

  static forces = {
    label: 'WOD5E.MTA.Forces'
  }

  static life = {
    label: 'WOD5E.MTA.Life'
  }

  static matter = {
    label: 'WOD5E.MTA.Matter'
  }

  static mind = {
    label: 'WOD5E.MTA.Mind'
  }

  static prime = {
    label: 'WOD5E.MTA.Prime'
  }

  static spirit = {
    label: 'WOD5E.MTA.Spirit'
  }

  static time = {
    label: 'WOD5E.MTA.Time'
  }
}

// Hook to call onReady when the game is ready
Hooks.once('ready', Spheres.onReady)
