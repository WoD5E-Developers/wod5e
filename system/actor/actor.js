/* global Actor, game, foundry, CONST */

/**
 * Extend the base ActorSheet document and put all our base functionality here
 * @extends {Actor}
 */
export class ActorInfo extends Actor {
  prepareData () {
    super.prepareData()
  }

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

  /** Handle things that need to be done every update or specifically when the actor is being updated */
  async _onUpdate (data, options, user) {
    await super._onUpdate(data, options, user)
    const actor = game.actors.get(data._id)

    // Only run through this for the storyteller
    if (!game.user.isGM) return

    // If the character is a player...
    if (actor?.hasPlayerOwner && actor.type !== 'group') {
      // Update disposition to friendly
      await actor.update({
        'prototypeToken.disposition': CONST.TOKEN_DISPOSITIONS.FRIENDLY
      })

      // If this includes a change to ownership, set overrideOwnership
      if (data?.ownership?.default) {
        await actor.update({
          // Set the overrideOwnership to false if the default is anything but limited
          // Set to false when ownership default is limited
          'flags.overrideOwnership': data.ownership.default !== CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED
        })
      }

      // If we're allowed to override ownership or it's not already set, set default ownership to limited
      if (actor?.flags?.overrideOwnership || actor?.flags?.overrideOwnership === undefined) {
        await actor.update({
          'ownership.default': CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED
        })
      }
    }

    return data
  }
}
