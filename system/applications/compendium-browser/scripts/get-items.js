export const getItems = async function ({
  types = [],
  text = '',
  disabledSources = [],
  ratingMin = '',
  ratingMax = '',
  sort = 'name'
}) {
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
    const compendiumItems = await filterDocuments(docs, types, text, ratingMin, ratingMax)

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
    const worldItemsList = await filterDocuments(game.items, types, text, ratingMin, ratingMax)
    allReturnedItems.push(...worldItemsList)
  }

  return allReturnedItems.sort((a, b) => {
    if (sort === 'ratingAsc' || sort === 'ratingDesc') {
      const ratingA = getItemRating(a)
      const ratingB = getItemRating(b)

      // Missing ratings always follow rated items, regardless of sort direction.
      if (ratingA === null && ratingB !== null) return 1
      if (ratingB === null && ratingA !== null) return -1
      if (ratingA !== null && ratingB !== null) {
        const difference = sort === 'ratingDesc' ? ratingB - ratingA : ratingA - ratingB
        if (difference) return difference
      }
    }

    return getItemDisplayName(a).localeCompare(getItemDisplayName(b), game.i18n.lang, {
      sensitivity: 'base'
    })
  })
}

export const filterDocuments = function (
  documents,
  types = [],
  text = '',
  ratingMin = '',
  ratingMax = ''
) {
  // Normalize the text provided
  const normalizedText = text.toLowerCase().trim()
  // Map types to something sane to use
  const typeMap = new Map(types.map((type) => [type.id, type]))

  return documents.filter((item) => {
    // Determine which type filter we need to pull from the map
    const typeFilter = typeMap.get(item.type)

    // Exclude disabled types, including when every type is disabled
    if (!typeFilter) return false

    const rating = getItemRating(item)
    if (ratingMin !== '' || ratingMax !== '') {
      if (rating === null) return false
      if (ratingMin !== '' && rating < Number(ratingMin)) return false
      if (ratingMax !== '' && rating > Number(ratingMax)) return false
    }

    // Text filter
    if (normalizedText && !item.name.toLowerCase().includes(normalizedText)) {
      return false
    }

    // Permission filter (must have at least "limited" permissions)
    if (item.permission <= 0) return false

    // An empty selection excludes types that have subtype filters
    if (!typeFilter.subtypes?.length) return !typeFilter.subtypePath

    // If subtype filters exist but this type has no subtype path, return the item
    if (!typeFilter.subtypePath) return true

    // Grab the subtype value
    const itemSubtype = foundry.utils.getProperty(item.system, typeFilter.subtypePath)

    // Match the subtype against the subtype list
    return typeFilter.subtypes.includes(itemSubtype)
  })
}

// Only character-option ratings, never equipment statistics or resource costs.
export const getItemRating = function (item) {
  const field = {
    feature: 'points',
    boon: 'points',
    power: 'level',
    gift: 'level'
  }[item.type]
  const value = field ? item.system?.[field] : null
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

// We do some weird regex here because the compendiums someone made have
// the dot ratings in the name.. which doesn't look good when we display
// the dot ratings in the compendium browser.
// So we do this and try to clear out anything that would look ugly.
export const getItemDisplayName = function (item) {
  return item.name
    .replace(/\(\s*[\u2022\u25cf][\u2022\u25cf\s]*\)/g, '')
    .replace(/[\u2022\u25cf]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}
