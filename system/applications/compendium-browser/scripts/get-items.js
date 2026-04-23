export const getItems = async function ({ types = [], text = '' }) {
  let allReturnedItems = []
  text = text.toLowerCase()

  /**
   * Handle getting items from compendiums
   * We need to use 'getDocuments' on them first, then filter from there
   */
  const compendiumsItemsList = game.packs.filter(
    (compendium) => compendium.metadata.type === 'Item'
  )
  for (const compendium of compendiumsItemsList) {
    const docs = await compendium.getDocuments()

    const compendiumItems = docs.filter(
      (item) =>
        (types.length === 0 || types.includes(item.type)) &&
        (!text || item.name.toLowerCase().includes(text)) &&
        item?.permission > 0
    )

    // If there's any items we need from here, push them to our 'all returned items' list
    if (compendiumItems.length > 0) {
      allReturnedItems.push(...compendiumItems)
    }
  }

  /**
   * Handle getting items from the world itself (not in any compendiums)
   * We don't need to be as verbose as we were with the ones inside compendiums
   */
  const worldItemsList = game.items.filter(
    (item) =>
      (types.length === 0 || types.includes(item.type)) &&
      (!text || item.name.toLowerCase().includes(text)) &&
      item?.permission > 0
  )
  allReturnedItems.push(...worldItemsList)

  return allReturnedItems
}
