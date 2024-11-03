/* global WOD5E, game */

/**
 * Function to handle getting the list of available dice to add to a dicepool
 * @param document
 */
export const getDicepoolList = async (document) => {
  const masterList = []
  const gamesystem = document.system?.gamesystem || 'mortal'
  const isNotEmbedded = !game.items.get('ScZcmxk1WGC0GAQu').isEmbedded

  // Attributes
  const attributes = WOD5E.Attributes.getList({})
  for (const [key, value] of Object.entries(attributes)) {
    masterList.push({
      value: `attributes.${key}`,
      label: value.displayName,
      group: game.i18n.localize('WOD5E.AttributesList.Attributes')
    })
  }

  // Skills
  const skills = WOD5E.Skills.getList({})
  for (const [key, value] of Object.entries(skills)) {
    masterList.push({
      value: `skills.${key}`,
      label: value.displayName,
      group: game.i18n.localize('WOD5E.SkillsList.Skills')
    })
  }

  // Vampire
  if (gamesystem === 'vampire' || isNotEmbedded) {
    const disciplines = WOD5E.Disciplines.getList({})
    for (const [key, value] of Object.entries(disciplines)) {
      masterList.push({
        value: `disciplines.${key}`,
        label: value.displayName,
        group: game.i18n.localize('WOD5E.VTM.Disciplines')
      })
    }
  }

  // Werewolf
  if (gamesystem === 'werewolf' || isNotEmbedded) {
    const renown = WOD5E.Renown.getList({})
    for (const [key, value] of Object.entries(renown)) {
      masterList.push({
        value: `renown.${key}`,
        label: value.displayName,
        group: game.i18n.localize('WOD5E.WTA.Renown')
      })
    }
  }

  return masterList
}
