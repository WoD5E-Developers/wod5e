/* global game, Hooks */

import { BaseDefinitionClass } from './base-definition-class.js'

export class Skills extends BaseDefinitionClass {
  static modsEnabled = true
  static defCategory = 'Skills'

  // Run any necessary compilation on ready
  static onReady () {
    const customSkills = game.settings.get('vtm5e', 'customSkills')

    if (customSkills) {
      Skills.addCustom(customSkills)
    }

    Skills.initializeLabels()
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
