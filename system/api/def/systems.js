import { BaseDefinitionClass } from './base-definition-class.js'

export class Systems extends BaseDefinitionClass {
  // Run any necessary compilation on ready
  static onReady() {
    // Handle adding custom disciplines from any active modules
    const activeModules = game.modules.filter(
      (module) => module.active === true && module.flags.wod5e
    )
    let customSystems = []
    activeModules.forEach((module) => {
      if (module.flags.wod5e.customSystems) {
        customSystems = customSystems.concat(module.flags.wod5e.customSystems)

        // Log the custom data in the console
        console.log(
          `World of Darkness 5e | Custom Systems added by ${module.id}: ${JSON.stringify(module.flags.wod5e.customSystems)}`
        )
      }
    })

    if (customSystems) {
      Systems.addCustom(customSystems)
    }

    Systems.setSortAlphabetically()
    Systems.initializeLabels()
  }

  static mortal = {
    label: 'WOD5E.Mortal',
    usesResourceOnAdvancedDice: false
  }

  static vampire = {
    label: 'TYPES.Actor.vampire',
    usesResourceOnAdvancedDice: true,
    resourceValuePath: 'hunger.value',
    resourceUsage: 'add'
  }

  static werewolf = {
    label: 'TYPES.Actor.werewolf',
    usesResourceOnAdvancedDice: true,
    resourceValuePath: 'rage.value',
    resourceUsage: 'subtract'
  }

  static hunter = {
    usesResourceOnAdvancedDice: false,
    label: 'TYPES.Actor.hunter'
  }
}

// Hook to call onReady when the game is ready
Hooks.once('ready', Systems.onReady)
