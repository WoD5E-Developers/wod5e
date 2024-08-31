/* global game, Hooks */

import { BaseDefinitionClass } from './base-definition-class.js'

export class Edges extends BaseDefinitionClass {
  static modsEnabled = true
  static defCategory = 'Edges'

  // Run any necessary compilation on ready
  static onReady () {
    const customEdges = game.settings.get('vtm5e', 'customEdges')

    if (customEdges) {
      Edges.addCustom(customEdges)
    }

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
}

// Hook to call onReady when the game is ready
Hooks.once('ready', Edges.onReady)
