/* global Actor, game, foundry */

// Data preparation functions
import { prepareSkills } from './scripts/prepare-skills.js'
import { prepareAttributes } from './scripts/prepare-attributes.js'
import { getDerivedHealth } from './scripts/on-health-change.js'
import { getDerivedWillpower } from './scripts/on-willpower-change.js'
import { getDerivedExperience } from './scripts/experience.js'
import { _onPlayerUpdate, _onGroupUpdate } from './scripts/ownership-updates.js'
import { prepareDisciplines } from './vtm/scripts/prepare-data.js'
import { prepareEdges } from './htr/scripts/prepare-data.js'
import { prepareGifts, prepareFormData } from './wta/scripts/prepare-data.js'

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
  async prepareBaseData() {
    const actorData = this
    const systemData = actorData.system

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
      systemData.forms = await prepareFormData(actorData.forms)
    }
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
  async prepareDerivedData() {
    const actorData = this
    const systemData = actorData.system

    // Prepare derived XP values
    if (actorData.type !== 'group' && actorData.type !== 'spc') {
      systemData.derivedXP = await getDerivedExperience(systemData)
    }

    // Prepare derived health and willpower values
    if (actorData.type !== 'group') {
      systemData.health = await getDerivedHealth(systemData)
      systemData.willpower = await getDerivedWillpower(systemData)
    }
  }

  /**
   * @override
   * Handle things that need to be done every update or specifically when the actor is being updated
   */
  async _onUpdate (data, options, user) {
    await super._onUpdate(data, options, user)
    const actor = game.actors.get(data._id)

    // Only run through this for the storyteller
    if (!game.user.isGM) return

    // Handle data updates
    await _onPlayerUpdate(actor, data)
    await _onGroupUpdate(actor, data)

    return data
  }
}
