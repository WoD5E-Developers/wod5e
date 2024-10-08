/* global game, Hooks */

import { BaseDefinitionClass } from './base-definition-class.js'

export class WereForms extends BaseDefinitionClass {
  // Override the initializeLabels method to add extra functionality
  static initializeLabels () {
    super.initializeLabels()

    for (const [, value] of Object.entries(this)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Initialize the nickname label too
        value.nickname = game.i18n.localize(value.nickname)

        // Localize the Werewolf attributes
        value.attributes = value.attributes.map(attribute => {
          return game.i18n.localize(attribute)
        })
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
    attributes: [
      'WOD5E.WTA.SilverImmunity'
    ]
  }

  static glabro = {
    label: 'WOD5E.WTA.GlabroName',
    nickname: 'WOD5E.WTA.GlabroTitle',
    cost: 1,
    attributes: [
      'WOD5E.WTA.GlabroPhysicalTests',
      'WOD5E.WTA.GlabroSocialTests',
      'WOD5E.WTA.GlabroRegenerate'
    ],
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
      'WOD5E.WTA.CrinosFrenzy',
      'WOD5E.WTA.CrinosPhysicalTests',
      'WOD5E.WTA.CrinosHealth',
      'WOD5E.WTA.CrinosSocialTests',
      'WOD5E.WTA.CrinosMentalTests',
      'WOD5E.WTA.CrinosRegenerate',
      'WOD5E.WTA.CrinosClaws',
      'WOD5E.WTA.CrinosBite',
      'WOD5E.WTA.CausesDelirium'
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

  static hispo = {
    label: 'WOD5E.WTA.HispoName',
    nickname: 'WOD5E.WTA.HispoTitle',
    cost: 1,
    attributes: [
      'WOD5E.WTA.HispoPhysicalTests',
      'WOD5E.WTA.HispoStealthTests',
      'WOD5E.WTA.HispoSocialTests',
      'WOD5E.WTA.HispoRegenerate',
      'WOD5E.WTA.HispoBite'
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

  static lupus = {
    label: 'WOD5E.WTA.LupusName',
    nickname: 'WOD5E.WTA.LupusTitle',
    cost: 0,
    attributes: [
      'WOD5E.WTA.SilverImmunity',
      'WOD5E.WTA.LupusSocialTests'
    ]
  }
}

Hooks.once('ready', WereForms.onReady)
