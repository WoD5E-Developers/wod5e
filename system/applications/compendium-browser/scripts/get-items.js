export const getItems = async function ({ types = [], text = '', disabledSources = {} }) {
  let allReturnedItems = []

  /**
   * Handle getting items from compendiums
   * We need to use 'getDocuments' on them first, then filter from there
   */
  const compendiumsItemsList = game.packs.filter(
    (compendium) => compendium.metadata.type === 'Item'
  )
  for (const compendium of compendiumsItemsList) {
    if (disabledSources.includes(`${compendium.metadata.packageName}-${compendium.metadata.name}`))
      continue

    const docs = await compendium.getDocuments()
    const compendiumItems = await filterDocuments(docs, types, text)

    // If there's any items we need from here, push them to our 'all returned items' list
    if (compendiumItems.length > 0) {
      allReturnedItems.push(...compendiumItems)
    }
  }

  /**
   * Handle getting items from the world itself (not in any compendiums)
   * We don't need to be as verbose as we were with the ones inside compendiums
   *
   * Also includes a filter - if 'world' is disabled in sources, we don't need
   * to look up any world items.
   */
  if (!disabledSources.includes('world')) {
    const worldItemsList = await filterDocuments(game.items, types, text)
    allReturnedItems.push(...worldItemsList)
  }

  return allReturnedItems
}

export const filterDocuments = function (documents, types = [], text = '') {
  // Normalize the text provided
  const normalizedText = text.toLowerCase().trim()
  // Map types to something sane to use
  const typeMap = new Map(types.map((type) => [type.id, type]))

  return documents.filter((item) => {
    // Determine which type filter we need to pull from the map
    const typeFilter = typeMap.get(item.type)

    // If type filters exist and this item type is not enabled, exclude it
    if (types.length > 0 && !typeFilter) return false

    // Text filter
    if (normalizedText && !item.name.toLowerCase().includes(normalizedText)) {
      return false
    }

    // Permission filter (must have at least "limited" permissions)
    if (item.permission <= 0) return false

    // If we don't have a type filter, then we don't need subtype filtering and
    // just return the item
    if (!typeFilter) return true

    // If we don't have any subtype filters, just return the item
    if (!typeFilter.subtypes?.length) return true

    // If subtype filters exist but this type has no subtype path, return the item
    if (!typeFilter.subtypePath) return true

    // Grab the subtype value
    const itemSubtype = foundry.utils.getProperty(item.system, typeFilter.subtypePath)

    // Match the subtype against the subtype list
    return typeFilter.subtypes.includes(itemSubtype)
  })
}
