/* global game, Hooks */

import { BaseDefinitionClass } from './base-definition-class.js'

export class WereForms extends BaseDefinitionClass {
  // Override the initializeLabels method to add extra functionality
  static initializeLabels() {
    super.initializeLabels()

    for (const [, value] of Object.entries(this)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Initialize the nickname label too
        value.nickname = game.i18n.localize(value.nickname)
      }
    }
  }

  // Run any necessary compilation on ready
  static onReady () {
    WereForms.initializeLabels()
  }

  static homid = {
    label: 'WOD5E.WTA.HomidName',
    nickname: 'WOD5E.WTA.HomidTitle',
    cost: 0,
    attributes: ['Silver Immunity']
  }

  static lupus = {
    label: 'WOD5E.WTA.LupusName',
    nickname: 'WOD5E.WTA.LupusTitle',
    cost: 0,
    attributes: ['Silver Immunity', 'Social Tests: Limited to wolves and Garou']
  }

  static hispo = {
    label: 'WOD5E.WTA.HispoName',
    nickname: 'WOD5E.WTA.HispoTitle',
    cost: 1,
    attributes: [
      '(Non-Stealth) Physical Tests: +2',
      'Stealth Tests: -2',
      'Social Tests: Limited to wolves and Garou',
      'Regenerate: 1/Rage Check',
      'Bite: +1 Aggravated'
    ],
    bonuses: [
      {
        source: 'WOD5E.WTA.HispoName',
        value: 2,
        paths: ['attributes.strength', 'attributes.dexterity', 'attributes.stamina'],
        unless: ['skills.stealth'],
        activeWhen: {
          check: 'isEqual',
          path: 'activeForm',
          value: 'hispo'
        }
      },
      {
        source: 'WOD5E.WTA.HispoName',
        value: -2,
        paths: ['skills.stealth'],
        activeWhen: {
          check: 'isEqual',
          path: 'activeForm',
          value: 'hispo'
        }
      }
    ]
  }

  static glabro = {
    label: 'WOD5E.WTA.GlabroName',
    nickname: 'WOD5E.WTA.GlabroTitle',
    cost: 1,
    attributes: ['Physical Tests: +2', 'Social Tests: -2', 'Regenerate: 1/Rage Check'],
    bonuses: [
      {
        source: 'WOD5E.WTA.GlabroName',
        value: 2,
        paths: ['attributes.strength', 'attributes.dexterity', 'attributes.stamina'],
        activeWhen: {
          check: 'isEqual',
          path: 'activeForm',
          value: 'glabro'
        }
      },
      {
        source: 'WOD5E.WTA.GlabroName',
        value: -2,
        paths: ['attributes.charisma', 'attributes.manipulation', 'attributes.composure'],
        activeWhen: {
          check: 'isEqual',
          path: 'activeForm',
          value: 'glabro'
        }
      }
    ]
  }

  static crinos = {
    label: 'WOD5E.WTA.CrinosName',
    nickname: 'WOD5E.WTA.CrinosTitle',
    cost: 2,
    attributes: [
      'Frenzy Risk, 1 Willpower/turn',
      'Physical Tests: +4',
      'Health: +4',
      'Social Tests: Auto-failure',
      'Mental Tests: Auto-failure',
      'Regenerate: 2/Rage Check',
      'Claws: +3',
      'Bite: +1 Aggravated',
      'Causes Delirium'
    ],
    bonuses: [
      {
        source: 'WOD5E.WTA.CrinosName',
        value: 4,
        paths: ['attributes.strength', 'attributes.dexterity', 'attributes.stamina'],
        activeWhen: {
          check: 'isEqual',
          path: 'activeForm',
          value: 'crinos'
        }
      }
    ]
  }
}

Hooks.once('ready', WereForms.onReady)
