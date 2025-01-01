/* global Item, Hooks, WOD5E */

/**
 * Extend the base ItemSheet document and put all our base functionality here
 * @extends {Item}
 */
export class WoDItem extends Item {
  prepareData () {
    super.prepareData()
  }

  /**
   * @override
   * Augment the item source data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of item sheets (such as if an item
   * is queried and has a roll executed directly from it).
   */
  async prepareDerivedData () {}
}

// Handle setting default item data
Hooks.on('preCreateItem', (document, data) => {
  const alterations = {}

  // Get default item image based on the item type
  if (!data.img) {
    const itemsList = WOD5E.ItemTypes.getList({})
    const itemImg = itemsList[data.type]?.img || 'systems/vtm5ec/assets/icons/items/item-default.svg'

    // Set the img value to the icon we get back
    alterations.img = itemImg
  }

  // Update the source document
  document.updateSource(alterations)
})
