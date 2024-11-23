/* global Actor, game, foundry, CONST, fromUuidSync */

// Data preparation functions
import { prepareSkills } from './scripts/prepare-skills.js'
import { prepareAttributes } from './scripts/prepare-attributes.js'
import { getDerivedHealth } from './scripts/on-health-change.js'
import { getDerivedWillpower } from './scripts/on-willpower-change.js'
import { getDerivedExperience } from './scripts/experience.js'
import { prepareDisciplines } from './vtm/scripts/prepare-data.js'
import { prepareEdges } from './htr/scripts/prepare-data.js'
import { prepareGifts, prepareFormData } from './wta/scripts/prepare-data.js'
import { prepareExceptionalDicePools } from './scripts/prepare-exceptional-dice-pools.js'
import { getVampireModifiers } from './vtm/scripts/vampire-bonuses.js'
import { getHunterModifiers } from './htr/scripts/hunter-bonuses.js'
import { Disciplines } from '../api/def/disciplines.js'
import { Skills } from '../api/def/skills.js'
import { Attributes } from '../api/def/attributes.js'
import { Renown } from '../api/def/renown.js'

/**
 * Extend the base ActorSheet document and put all our base functionality here
 * @extends {Actor}
 */
export class WoDActor extends Actor {
  /**
   * @override
   * Handle data that happens before the creation of a new actor document
  */
  async _preCreate (data, context, user) {
    await super._preCreate(data, context, user)

    const tokenUpdate = {}

    // Link non-SPC token data by default
    if (data.prototypeToken?.actorLink === undefined && data.type !== 'spc') {
      tokenUpdate.actorLink = true
    }

    if (!foundry.utils.isEmpty(tokenUpdate)) {
      this.prototypeToken.updateSource(tokenUpdate)
    }
  }

  /**
   * @override
   * Prepare data for the actor. Calling the super version of this executes
   * the following, in order: data reset (to clear active effects),
   * prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
   * prepareDerivedData().
   */
  prepareData () {
    super.prepareData()
  }

  /**
   * @override
   * Data modifications in this step occur before processing embedded
   * documents or derived data.
   */
  async prepareBaseData () {
    const actorData = this
    const systemData = actorData.system

    // Prepare the effects from condition items onto the actor
    // Ignore suppressed conditions
    const conditions = actorData.items.filter(item => item.type === 'condition' && !item.system.suppressed)
    conditions.forEach((condition) => {
      // Iterate through each effect on the condition
      for (const [, effect] of Object.entries(condition.system.effects)) {
        // Iterate through each key in the effect
        effect.keys.forEach(key => {
          // If this is for an SPC sheet, we need to alter the key for stats
          if (actorData.type === 'spc' && key.includes('skills')) {
            key = key.replace('skills', 'exceptionaldicepools')
          }

          // Construct the change in a format similar to ActiveEffects
          const change = {
            key,
            mode: effect.mode,
            value: effect.intValue
          }

          if (change.key === 'attributes') {
            // Apply to all Attributes
            change.key = Attributes.getList({ useValuePath: true })
          } else if (change.key === 'skills') {
            // Apply to all skills
            change.key = Skills.getList({ useValuePath: true })
          } else if (change.key === 'disciplines') {
            // Apply to all disciplines
            change.key = Disciplines.getList({ useValuePath: true })
          } else if (change.key === 'renown') {
            // Apply to all renown
            change.key = Renown.getList({ useValuePath: true })
          } else if (change.key === 'physical') {
            if (actorData.type === 'spc') {
              change.key = 'system.standarddicepools.physical.value'
            } else {
              change.key = Attributes.getList({ type: 'physical', useValuePath: true })
            }
          } else if (change.key === 'social') {
            if (actorData.type === 'spc') {
              change.key = 'system.standarddicepools.social.value'
            } else {
              change.key = Attributes.getList({ type: 'social', useValuePath: true })
            }
          } else if (change.key === 'mental') {
            if (actorData.type === 'spc') {
              change.key = 'system.standarddicepools.mental.value'
            } else {
              change.key = Attributes.getList({ type: 'mental', useValuePath: true })
            }
          }

          // Handle going through every key if we're given an array of options
          if (typeof change.key === 'object') {
            for (const [k] of Object.entries(change.key)) {
              updateActorProperty(actorData, k, change.mode, change.value)
            }
          } else {
            // Otherwise, we just need to update the one key
            updateActorProperty(actorData, change.key, change.mode, change.value)
          }
        })
      }
    })

    if (systemData.hasSkillAttributeData) {
      // Handle attribute preparation
      const attributesPrep = await prepareAttributes(actorData)

      // Set attribute data
      systemData.attributes = attributesPrep.attributes
      systemData.sortedAttributes = attributesPrep.sortedAttributes

      // Handle skill preparation
      const skillsPrep = await prepareSkills(actorData)

      // Set skill data
      systemData.skills = skillsPrep.skills
      systemData.sortedSkills = skillsPrep.sortedSkills
    }

    // Handle prepping exceptional dicepools
    if (actorData.type === 'spc') {
      systemData.exceptionaldicepools = await prepareExceptionalDicePools(actorData)
    }
  }

  async prepareEmbeddedDocuments () {
    super.prepareEmbeddedDocuments()
  }

  /**
   * @override
   * Augment the actor source data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  async prepareDerivedData () {
    const actorData = this
    const systemData = actorData.system

    // Defines the mapping of SPC subtypes to gamesystems
    const typeMapping = {
      vampire: 'vampire',
      ghoul: 'vampire',
      hunter: 'hunter',
      werewolf: 'werewolf',
      spirit: 'werewolf'
    }

    // Set gamesystem of an SPC
    if (actorData.type === 'spc') {
      systemData.gamesystem = typeMapping[systemData.spcType] || 'mortal'
    } else if (actorData.type !== 'group') {
      // Set the gamesystem of a non-SPC non-group character
      systemData.gamesystem = typeMapping[actorData.type] || 'mortal'
    }

    // Set discipline data
    if (systemData?.gamesystem === 'vampire') {
      systemData.disciplines = await prepareDisciplines(actorData)
    }

    // Set edge data
    if (systemData?.gamesystem === 'hunter') {
      systemData.edges = await prepareEdges(actorData)
    }

    // Set gift data
    if (systemData?.gamesystem === 'werewolf') {
      systemData.gifts = await prepareGifts(actorData)
      systemData.forms = await prepareFormData(systemData.forms, actorData)

      if (systemData.formOverride && systemData.rage.value > 0) {
        this.update({ 'system.formOverride': false })
      }
    }

    // If the actor is a player, update the default permissions to limited
    if (this.hasPlayerOwner && !this.getFlag('vtm5e', 'manualDefaultOwnership') && game.user.isGM) {
      this.update({ 'ownership.default': CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED })
    }

    // Prepare derived XP values
    if (actorData.type !== 'group' && actorData.type !== 'spc') {
      systemData.derivedXP = await getDerivedExperience(systemData)
    }

    // Prepare derived health and willpower values
    if (actorData.type !== 'group') {
      systemData.health = await getDerivedHealth(systemData)
      systemData.willpower = await getDerivedWillpower(systemData)
    }

    // Get desperation value if the actor has a group set
    if (actorData.type !== 'group') {
      if (systemData.group) {
        const group = game.actors.get(systemData.group)

        if (group) {
          systemData.desperation = group.system?.desperation || { value: 0 }
        }
      }
    }

    // Wipe system-specific bonuses so they don't duplicate
    systemData.bonuses = {}

    // Get bonuses relevant to particular splats
    if (actorData.type === 'vampire') {
      systemData.bonuses = await getVampireModifiers(systemData)
    }

    if (actorData.type === 'hunter') {
      systemData.bonuses = await getHunterModifiers(systemData)
    }

    // Force a ghoul's hunger value to be 0
    if (actorData.type === 'ghoul' && systemData.hunger.value > 0) {
      systemData.hunger.value = 0
    }
  }

  /**
   * @override
   * Handle things that need to be done every update or specifically when the actor is being updated
   */
  async _onUpdate (data, options, user) {
    const actor = game.actors.get(data._id)

    // Handle the actual update
    super._onUpdate(data, options, user)

    // Only run through this for the storyteller
    if (!game.user.isGM) return

    // Make sure the actor exists
    if (!actor) return

    // If the default ownership is ever not limited, update the manualDefaultOwnership flag
    if (actor.ownership.default !== CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED) {
      await actor.setFlag('vtm5e', 'manualDefaultOwnership', true)
    }

    // If the actor is a group...
    if (actor.type === 'group') {
      // Handle updating data that needs to propagate to group members
      if (actor.system?.members) {
        for (const memberUuid of actor.system.members) {
          const member = fromUuidSync(memberUuid)
          if (!member) {
            console.warn(`Member with UUID ${memberUuid} not found.`)
          }

          // Handle updating the group member's Desperation
          if (data.system?.desperation && member.system.gamesystem === 'hunter') {
            member.prepareDerivedData()
          }
        }
      }
    }
  }
}

async function updateActorProperty (actor, key, mode, value) {
  const current = foundry.utils.getProperty(actor, key)
  let updatedData
  if (Number(mode) === CONST.ACTIVE_EFFECT_MODES.ADD) {
    updatedData = Number(current) + Number(value)
  } else if (Number(mode) === CONST.ACTIVE_EFFECT_MODES.OVERRIDE) {
    updatedData = Number(value)
  }

  foundry.utils.setProperty(actor, key, updatedData)
}
