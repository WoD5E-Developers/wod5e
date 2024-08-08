/* global game WOD5E */

/**
 * Function to handle localization of keys
 * @param string
 * @param type
 */
export const generateLocalizedLabel = (string, type) => {
  // Actor Types
  if (type === 'actortypes') {
    const actortypes = WOD5E.ActorTypes.getList()
    return findLabel(actortypes, string)
  } else
  // Attributes
  if (type === 'abilities') {
    const attributes = WOD5E.Attributes.getList({})
    return findLabel(attributes, string)
  } else
  // Skills
  if (type === 'skills') {
    const skills = WOD5E.Skills.getList({})
    return findLabel(skills, string)
  } else
  // Features
  if (type === 'features') {
    const features = WOD5E.Features.getList()
    return findLabel(features, string)
  } else
  // Disciplines
  if (type === 'disciplines') {
    const disciplines = WOD5E.Disciplines.getList()
    return findLabel(disciplines, string)
  } else
  // Gifts
  if (type === 'gifts') {
    const gifts = WOD5E.Gifts.getList()
    return findLabel(gifts, string)
  } else
  // Renown
  if (type === 'renown') {
    const renown = WOD5E.Renown.getList()
    return findLabel(renown, string)
  } else
  // Edges
  if (type === 'edges') {
    const edges = WOD5E.Edges.getList()
    return findLabel(edges, string)
  } else {
    // Return the base localization if nothing else is found
    const otherLocalizationString = string.capitalize()
    return game.i18n.localize(`WOD5E.${otherLocalizationString}`)
  }

  // Function to actually grab the localized label
  function findLabel (list, str) {
    const stringObject = list[str]

    // Return the localized string if found
    if (stringObject?.displayName) return stringObject.displayName
    if (stringObject?.label) return stringObject.label

    // Return nothing
    return ''
  }
}
