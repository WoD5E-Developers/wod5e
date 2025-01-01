/* global game, Hooks */

import { BaseDefinitionClass } from './base-definition-class.js'

export class Realms extends BaseDefinitionClass {
    static modsEnabled = true
    static type = 'realms'
    static defCategory = 'Realms'

    // Run any necessary compilation on ready
    static onReady() {
        // Handle adding custom Realms from the game settings
        let customRealms = game.settings.get('vtm5ec', 'customRealms') || {}

        // Handle adding custom Realms from any active modules
        const activeModules = game.modules.filter(module => module.active === true && module.flags.wod5e)
        activeModules.forEach((module) => {
            if (module.flags.wod5e.customRealms) {
                customRealms = customRealms.concat(module.flags.wod5e.customRealms)
            }
        })

        if (customRealms) {
            Realms.addCustom(customRealms)
        }

        Realms.setSortAlphabetically()
        Realms.initializeLabels()
        Realms.initializePaths()
    }

    static initializePaths() {
        // Cycle through each entry in the definition file to initialize the paths on each
        // Quickly filter out any non-object, non-null, non-array values
        const definitionEntries = Object.entries(this).filter(([, value]) => typeof value === 'object' && value !== null && !Array.isArray(value))
        for (const [key, value] of definitionEntries) {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // Set the path
                value.path = `system.realms.${key}.value`
            }
        }
    }

    static actor = { label: 'WOD5E.CTD.Actor' }
    static nature = { label: 'WOD5E.CTD.Nature' }
    static prop = { label: 'WOD5E.CTD.Prop' }
    static scene = { label: 'WOD5E.CTD.Scene' }
    static time = { label: 'WOD5E.CTD.Time' }
}

// Hook to call onReady when the game is ready
Hooks.once('ready', Realms.onReady)
