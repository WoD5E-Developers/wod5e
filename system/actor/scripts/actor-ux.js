import { ItemTypes } from '../../api/def/itemtypes.js'
import { _onSortItem } from './on-sort-item.js'

export class ActorUX {
  // Save the current scroll position
  static async _saveScrollPositions(actor) {
    const activeList = this.findActiveList(actor)

    if (activeList.length) {
      actor._scroll = activeList.scrollTop()
    }
  }

  // Restore the saved scroll position
  static async _restoreScrollPositions(actor) {
    const activeList = this.findActiveList(actor)

    if (activeList.length && actor._scroll != null) {
      activeList.scrollTop(actor._scroll)
    }
  }

  // Get the scroll area of the currently active tab
  static findActiveList(actor) {
    const activeList = $(actor.element).find('section.tab.active')

    return activeList
  }

  // Save the maxHeight of all collapsible-content elements if it's greater than 0
  static async _saveCollapsibleStates(actor) {
    // Clear out the old states
    actor._collapsibleStates.clear()

    // Iterate through each collapsible element in the page
    $(actor.element)
      .find('.collapsible-content')
      .each((index, content) => {
        const contentElement = $(content)
        const maxHeight = parseFloat(contentElement.css('maxHeight'))

        // Check if max height is greater than 0, and if it is, we save its maxHeight state
        if (maxHeight > 0) {
          actor._collapsibleStates.set(contentElement.attr('data-id') || index, maxHeight)
        }
      })
  }

  // Restore the maxHeight of previously expanded collapsible-content elements
  static async _restoreCollapsibleStates(actor) {
    $(actor.element)
      .find('.collapsible-content')
      .each((index, content) => {
        const contentElement = $(content)
        const key = contentElement.attr('data-id') || index // Match with saved state

        if (actor._collapsibleStates.has(key)) {
          // Disable the transition property before re-setting the max height
          // This makes it so that on re-render, the user doesn't watch the
          // collapse animation again
          contentElement.css('transition', 'none')
          $(content).css('maxHeight', `${actor._collapsibleStates.get(key)}px`)

          // Force a reflow and then re-enable the transition property
          // We have to tell eslint to ignore the no-void rule because it's genuinely useful here

          void contentElement[0].offsetHeight
          contentElement.css('transition', '')
        }
      })
  }

  static async _onDropItem(event, actor, data) {
    if (!actor.isOwner) return false
    const actorType = actor.type
    const item = await Item.implementation.fromDropData(data)
    const itemData = item.toObject()
    const itemType = itemData.type
    const itemsList = ItemTypes.getList({})

    // Check whether we should allow this item type to be placed on this actor type
    if (itemsList[itemType]) {
      const whitelist = itemsList[itemType].restrictedActorTypes
      const blacklist = itemsList[itemType].excludedActorTypes

      // If the whitelist contains any entries, we can check to make sure this actor type is allowed for the item
      // We go through the base actor type, then subtypes - if we match to any of them, we allow the item to be
      // added to the actor.
      // We don't need to add this logic to the blacklist because the blacklist only needs to check against the base types.
      if (
        !foundry.utils.isEmpty(whitelist) &&
        // This is just a general check against the base actorType
        !whitelist.includes(actorType) &&
        // If the actor is an SPC, check against the spcType
        !(actorType === 'spc' && whitelist.includes(actor.system.spcType)) &&
        // If the actor is a Group sheet, check against the groupType
        !(actorType === 'group' && whitelist.includes(actor.system.groupType))
      ) {
        ui.notifications.warn(
          game.i18n.format('WOD5E.ItemsList.ItemCannotBeDroppedOnActor', {
            string1: itemType,
            string2: actorType
          })
        )

        return false
      }

      // If the blacklist contains any entries, we can check to make sure this actor type isn't disallowed for the item
      if (!foundry.utils.isEmpty(blacklist) && blacklist.indexOf(actorType) > -1) {
        ui.notifications.warn(
          game.i18n.format('WOD5E.ItemsList.ItemCannotBeDroppedOnActor', {
            string1: itemType,
            string2: actorType
          })
        )

        return false
      }

      // Handle limiting only a single type of an item to an actor
      if (itemsList[itemType].limitOnePerActor) {
        // Delete all other types of this item on the actor
        const duplicateItemTypeInstances = actor.items
          .filter((item) => item.type === itemType)
          .map((item) => item.id)

        actor.deleteEmbeddedDocuments('Item', duplicateItemTypeInstances)
      }
    }

    // Handle item sorting within the same Actor
    if (actor.uuid === item.parent?.uuid) return _onSortItem(event, actor, itemData)

    // Create the owned item
    return this._onDropItemCreate(actor, itemData)
  }

  static async _onDropItemCreate(actor, itemData) {
    itemData = itemData instanceof Array ? itemData : [itemData]
    return actor.createEmbeddedDocuments('Item', itemData)
  }
}
