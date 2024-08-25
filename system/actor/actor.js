/* global Actor, game, foundry */

import { _onPlayerUpdate, _onGroupUpdate } from './scripts/ownership-updates.js'

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

    // Handle data updates
    await _onPlayerUpdate(actor, data)
    await _onGroupUpdate(actor, data)

    await actor.update(data)

    return data
  }
}
