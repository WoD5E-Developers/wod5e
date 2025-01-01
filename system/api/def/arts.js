/* global game, Hooks */

import { BaseDefinitionClass } from './base-definition-class.js'

export class Arts extends BaseDefinitionClass {
    static modsEnabled = true
    static type = 'arts'
    static defCategory = 'Arts'

    // Run any necessary compilation on ready
    static onReady() {
        // Handle adding custom Arts from the game settings
        let customArts = game.settings.get('vtm5ec', 'customArts') || {}

        // Handle adding custom Arts from any active modules
        const activeModules = game.modules.filter(module => module.active === true && module.flags.wod5e)
        activeModules.forEach((module) => {
            if (module.flags.wod5e.customArts) {
                customArts = customArts.concat(module.flags.wod5e.customArts)
            }
        })

        if (customArts) {
            Arts.addCustom(customArts)
        }

        Arts.setSortAlphabetically()
        Arts.initializeLabels()
        Arts.initializePaths()
    }

    static initializePaths() {
        // Cycle through each entry in the definition file to initialize the paths on each
        // Quickly filter out any non-object, non-null, non-array values
        const definitionEntries = Object.entries(this).filter(([, value]) => typeof value === 'object' && value !== null && !Array.isArray(value))
        for (const [key, value] of definitionEntries) {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // Set the path
                value.path = `system.arts.${key}.value`
            }
        }
    }

    static autumn = { label: 'WOD5E.CTD.Autumn' } 
    static chicanery = { label: 'WOD5E.CTD.Chicanery' } 
    static chronos = { label: 'WOD5E.CTD.Chronos' } 
    static contract = { label: 'WOD5E.CTD.Contract' } 
    static dragonsIre = { label: 'WOD5E.CTD.DragonsIre' } 
    static legerdemain = { label: 'WOD5E.CTD.Legerdemain' } 
    static metamorphosis = { label: 'WOD5E.CTD.Metamorphosis' } 
    static naming = { label: 'WOD5E.CTD.Naming' } 
    static oneiromancy = { label: 'WOD5E.CTD.Oneiromancy' } 
    static primal = { label: 'WOD5E.CTD.Primal' } 
    static pyretics = { label: 'WOD5E.CTD.Pyretics' } 
    static skycraft = { label: 'WOD5E.CTD.Skycraft' } 
    static soothsay = { label: 'WOD5E.CTD.Soothsay' } 
    static sovereign = { label: 'WOD5E.CTD.Sovereign' } 
    static spring = { label: 'WOD5E.CTD.Spring' } 
    static summer = { label: 'WOD5E.CTD.Summer' } 
    static wayfare = { label: 'WOD5E.CTD.Wayfare' } 
    static winter = { label: 'WOD5E.CTD.Winter' }
}

// Hook to call onReady when the game is ready
Hooks.once('ready', Arts.onReady)
