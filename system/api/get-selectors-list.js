/* global WOD5E */

/**
 * Function to handle getting the list of available selectors for any given document
 * @param document
 */
export const getSelectorsList = (document) => {
  const selectorsList = []
  const gamesystem = document.system?.gamesystem || 'mortal'

  // Attributes
  const attributes = WOD5E.Attributes.getList({
    prependType: true
  })
  for (const [key, value] of Object.entries(attributes)) {
    selectorsList.push({
      id: key,
      displayName: value.displayName
    })
  }

  // Skills
  const skills = WOD5E.Skills.getList({
    prependType: true
  })
  for (const [key, value] of Object.entries(skills)) {
    selectorsList.push({
      id: key,
      displayName: value.displayName
    })
  }

  // Vampire
  if (gamesystem === 'vampire') {
    const disciplines = WOD5E.Disciplines.getList({
      prependType: true
    })
    for (const [key, value] of Object.entries(disciplines)) {
      selectorsList.push({
        id: key,
        displayName: value.displayName
      })
    }
  }

  // Werewolf
  if (gamesystem === 'werewolf') {
    const renown = WOD5E.Renown.getList({
      prependType: true
    })
    for (const [key, value] of Object.entries(renown)) {
      selectorsList.push({
        id: key,
        displayName: value.displayName
      })
    }
  }

  return selectorsList
}
