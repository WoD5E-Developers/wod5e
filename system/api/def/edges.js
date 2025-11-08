/* global game, Hooks */

import { BaseDefinitionClass } from './base-definition-class.js'

export class Edges extends BaseDefinitionClass {
  static modsEnabled = true
  static type = 'edges'
  static defCategory = 'Edges'

  // Run any necessary compilation on ready
  static onReady() {
    // Handle adding custom disciplines from the game settings
    let customEdges = game.settings.get('vtm5e', 'customEdges') || {}

    // Handle adding custom disciplines from any active modules
    const activeModules = game.modules.filter(
      (module) => module.active === true && module.flags.wod5e
    )
    activeModules.forEach((module) => {
      if (module.flags.wod5e.customEdges) {
        customEdges = customEdges.concat(module.flags.wod5e.customEdges)

        // Log the custom data in the console
        console.log(
          `World of Darkness 5e | Custom Edges added by ${module.id}: ${JSON.stringify(module.flags.wod5e.customEdges)}`
        )
      }
    })

    if (customEdges) {
      Edges.addCustom(customEdges)
    }

    Edges.setSortAlphabetically()
    Edges.initializeLabels()
  }

  static arsenal = {
    label: 'WOD5E.HTR.Arsenal'
  }

  static fleet = {
    label: 'WOD5E.HTR.Fleet'
  }

  static ordnance = {
    label: 'WOD5E.HTR.Ordnance'
  }

  static library = {
    label: 'WOD5E.HTR.Library'
  }

  static improvisedgear = {
    label: 'WOD5E.HTR.ImprovisedGear'
  }

  static globalaccess = {
    label: 'WOD5E.HTR.GlobalAccess'
  }

  static dronejockey = {
    label: 'WOD5E.HTR.DroneJockey'
  }

  static beastwhisperer = {
    label: 'WOD5E.HTR.BeastWhisperer'
  }

  static sensetheunnatural = {
    label: 'WOD5E.HTR.SenseTheUnnatural'
  }

  static repeltheunnatural = {
    label: 'WOD5E.HTR.RepelTheUnnatural'
  }

  static thwarttheunnatural = {
    label: 'WOD5E.HTR.ThwartTheUnnatural'
  }

  static artifact = {
    label: 'WOD5E.HTR.Artifact'
  }

  static turncoat = {
    label: 'WOD5E.HTR.Turncoat'
  }

  static experimentalmedicine = {
    label: 'WOD5E.HTR.ExperimentalMedicine'
  }

  static cleansetheunnatural = {
    label: 'WOD5E.HTR.CleanseTheUnnatural'
  }

  static greatdestiny = {
    label: 'WOD5E.HTR.GreatDestiny'
  }
}

// Hook to call onReady when the game is ready
Hooks.once('ready', Edges.onReady)
