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

        // Localize the Werewolf attributes
        // This function always localizes the label, and then localizes the
        // hintDescription if one exists
        value.attributes = value.attributes.map((attribute) => {
          return {
            label: game.i18n.localize(attribute.label),
            ...(attribute.hintDescription && {
              hintDescription: game.i18n.localize(attribute.hintDescription)
            }),
            ...(attribute.hintIcon && {
              hintIcon: attribute.hintIcon
            })
          }
        })
      }
    }
  }

  // Run any necessary compilation on ready
  static onReady() {
    WereForms.initializeLabels()
  }

  static homid = {
    label: 'WOD5E.WTA.HomidName',
    nickname: 'WOD5E.WTA.HomidTitle',
    cost: 0,
    glyph: 'systems/vtm5e/assets/icons/werewolf-forms/homid.webp',
    attributes: [{ label: 'WOD5E.WTA.SilverImmunity' }]
  }

  static glabro = {
    label: 'WOD5E.WTA.GlabroName',
    nickname: 'WOD5E.WTA.GlabroTitle',
    cost: 1,
    glyph: 'systems/vtm5e/assets/icons/werewolf-forms/glabro.webp',
    attributes: [
      { label: 'WOD5E.WTA.GlabroPhysicalTests' },
      {
        label: 'WOD5E.WTA.GlabroSocialTests',
        hintIcon: '*',
        hintDescription: 'WOD5E.WTA.GlabroSocialTestExclusion'
      },
      { label: 'WOD5E.WTA.GlabroRegenerate' }
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
        unless: ['skills.intimidation'],
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
    glyph: 'systems/vtm5e/assets/icons/werewolf-forms/crinos.webp',
    attributes: [
      { label: 'WOD5E.WTA.CrinosFrenzy' },
      { label: 'WOD5E.WTA.CrinosPhysicalTests' },
      { label: 'WOD5E.WTA.CrinosHealth' },
      {
        label: 'WOD5E.WTA.CrinosSocialTests',
        hintIcon: '*',
        hintDescription: 'WOD5E.WTA.CrinosSocialTestExclusion'
      },
      { label: 'WOD5E.WTA.CrinosRegenerate' },
      { label: 'WOD5E.WTA.CrinosClaws' },
      { label: 'WOD5E.WTA.CrinosBite' },
      { label: 'WOD5E.WTA.CausesDelirium' }
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
    glyph: 'systems/vtm5e/assets/icons/werewolf-forms/hispo.webp',
    attributes: [
      {
        label: 'WOD5E.WTA.HispoPhysicalTests',
        hintIcon: '*',
        hintDescription: 'WOD5E.WTA.HispoBonusExclusion'
      },
      { label: 'WOD5E.WTA.HispoStealthTests' },
      { label: 'WOD5E.WTA.HispoSocialTests' },
      { label: 'WOD5E.WTA.HispoRegenerate' },
      { label: 'WOD5E.WTA.HispoBite' }
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
    glyph: 'systems/vtm5e/assets/icons/werewolf-forms/lupus.webp',
    attributes: [{ label: 'WOD5E.WTA.SilverImmunity' }, { label: 'WOD5E.WTA.LupusSocialTests' }]
  }
}

Hooks.once('ready', WereForms.onReady)
