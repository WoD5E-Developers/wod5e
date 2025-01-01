/* global game, Hooks */

import { BaseDefinitionClass } from './base-definition-class.js'

export class Skills extends BaseDefinitionClass {
  static modsEnabled = true
  static type = 'skills'
  static defCategory = 'Skills'

  // Run any necessary compilation on ready
  static onReady () {
    // Handle adding custom disciplines from the game settings
    let customSkills = game.settings.get('vtm5ec', 'customSkills') || {}

    // Handle adding custom disciplines from any active modules
    const activeModules = game.modules.filter(module => module.active === true && module.flags.wod5e)
    activeModules.forEach((module) => {
      if (module.flags.wod5e.customSkills) {
        customSkills = customSkills.concat(module.flags.wod5e.customSkills)
      }
    })

    if (customSkills) {
      Skills.addCustom(customSkills)
    }

    Skills.setSortAlphabetically()
    Skills.initializeLabels()
    Skills.initializePaths()
  }

  static initializePaths () {
    // Cycle through each entry in the definition file to initialize the paths on each
    // Quickly filter out any non-object, non-null, non-array values
    const definitionEntries = Object.entries(this).filter(([, value]) => typeof value === 'object' && value !== null && !Array.isArray(value))
    for (const [key, value] of definitionEntries) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Set the path
        value.path = `system.skills.${key}.value`
      }
    }
  }

  static athletics = {
    label: 'WOD5E.SkillsList.Athletics',
    type: 'physical'
  }

  static animalken = {
    label: 'WOD5E.SkillsList.AnimalKen',
    type: 'social'
  }

  static academics = {
    label: 'WOD5E.SkillsList.Academics',
    type: 'mental'
  }

  static brawl = {
    label: 'WOD5E.SkillsList.Brawl',
    type: 'physical'
  }

  static etiquette = {
    label: 'WOD5E.SkillsList.Etiquette',
    type: 'social'
  }

  static awareness = {
    label: 'WOD5E.SkillsList.Awareness',
    type: 'mental'
  }

  static craft = {
    label: 'WOD5E.SkillsList.Craft',
    type: 'physical'
  }

  static insight = {
    label: 'WOD5E.SkillsList.Insight',
    type: 'social'
  }

  static finance = {
    label: 'WOD5E.SkillsList.Finance',
    type: 'mental'
  }

  static drive = {
    label: 'WOD5E.SkillsList.Drive',
    type: 'physical'
  }

  static intimidation = {
    label: 'WOD5E.SkillsList.Intimidation',
    type: 'social'
  }

  static investigation = {
    label: 'WOD5E.SkillsList.Investigation',
    type: 'mental'
  }

  static firearms = {
    label: 'WOD5E.SkillsList.Firearms',
    type: 'physical'
  }

  static leadership = {
    label: 'WOD5E.SkillsList.Leadership',
    type: 'social'
  }

  static medicine = {
    label: 'WOD5E.SkillsList.Medicine',
    type: 'mental'
  }

  static larceny = {
    label: 'WOD5E.SkillsList.Larceny',
    type: 'physical'
  }

  static performance = {
    label: 'WOD5E.SkillsList.Performance',
    type: 'social'
  }

  static occult = {
    label: 'WOD5E.SkillsList.Occult',
    type: 'mental'
  }

  static melee = {
    label: 'WOD5E.SkillsList.Melee',
    type: 'physical'
  }

  static persuasion = {
    label: 'WOD5E.SkillsList.Persuasion',
    type: 'social'
  }

  static politics = {
    label: 'WOD5E.SkillsList.Politics',
    type: 'mental'
  }

  static stealth = {
    label: 'WOD5E.SkillsList.Stealth',
    type: 'physical'
  }

  static streetwise = {
    label: 'WOD5E.SkillsList.Streetwise',
    type: 'social'
  }

  static science = {
    label: 'WOD5E.SkillsList.Science',
    type: 'mental'
  }

  static survival = {
    label: 'WOD5E.SkillsList.Survival',
    type: 'physical'
  }

  static subterfuge = {
    label: 'WOD5E.SkillsList.Subterfuge',
    type: 'social'
  }

  static technology = {
    label: 'WOD5E.SkillsList.Technology',
    type: 'mental'
  }
}

// Hook to call onReady when the game is ready
Hooks.once('ready', Skills.onReady)
