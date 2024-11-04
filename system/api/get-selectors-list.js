/* global WOD5E, game */

/**
 * Function to handle getting the list of available selectors for any given document
 * @param document
 */
export const getSelectorsList = () => {
  const selectorsList = []

  // Attributes
  const attributes = WOD5E.Attributes.getList({
    prependType: true
  })
  // "All Attributes" selector
  selectorsList.push({
    id: 'attributes',
    displayName: game.i18n.format('WOD5E.Modifier.AllString', {
      string: game.i18n.localize('WOD5E.AttributesList.Attributes')
    })
  })
  // Physical Attributes
  selectorsList.push({
    id: 'physical',
    displayName: game.i18n.format('WOD5E.Modifier.AllStringPools', {
      string: game.i18n.localize('WOD5E.SPC.Physical')
    })
  })
  // Mental Attributes
  selectorsList.push({
    id: 'mental',
    displayName: game.i18n.format('WOD5E.Modifier.AllStringPools', {
      string: game.i18n.localize('WOD5E.SPC.Mental')
    })
  })
  // Social Attributes
  selectorsList.push({
    id: 'social',
    displayName: game.i18n.format('WOD5E.Modifier.AllStringPools', {
      string: game.i18n.localize('WOD5E.SPC.Social')
    })
  })
  // Individual attributes
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
  // "All Skills" selector
  selectorsList.push({
    id: 'skills',
    displayName: game.i18n.format('WOD5E.Modifier.AllString', {
      string: game.i18n.localize('WOD5E.SkillsList.Skills')
    })
  })
  // Individual skills
  for (const [key, value] of Object.entries(skills)) {
    selectorsList.push({
      id: key,
      displayName: value.displayName
    })
  }
  // Willpower
  selectorsList.push({
    id: 'willpower',
    displayName: game.i18n.localize('WOD5E.Willpower')
  })
  // Willpower Re-roll
  selectorsList.push({
    id: 'willpower-reroll',
    displayName: game.i18n.localize('WOD5E.Chat.Willpower')
  })

  // Vampire
  const disciplines = WOD5E.Disciplines.getList({
    prependType: true
  })
  // "All Disciplines" selector
  selectorsList.push({
    id: 'disciplines',
    displayName: game.i18n.format('WOD5E.Modifier.AllString', {
      string: game.i18n.localize('WOD5E.VTM.Disciplines')
    })
  })
  // Individual disciplines
  for (const [key, value] of Object.entries(disciplines)) {
    selectorsList.push({
      id: key,
      displayName: value.displayName
    })
  }
  // Frenzy
  selectorsList.push({
    id: 'frenzy',
    displayName: game.i18n.localize('WOD5E.VTM.Frenzy')
  })
  // Remorse
  selectorsList.push({
    id: 'humanity',
    displayName: game.i18n.localize('WOD5E.VTM.Remorse')
  })

  // Hunter
  const edges = WOD5E.Edges.getList({
    prependType: true
  })
  // "All Edges" selector
  selectorsList.push({
    id: 'edges',
    displayName: game.i18n.format('WOD5E.Modifier.AllString', {
      string: game.i18n.localize('WOD5E.HTR.Edges')
    })
  })
  // Individual edges
  for (const [key, value] of Object.entries(edges)) {
    selectorsList.push({
      id: key,
      displayName: value.displayName
    })
  }

  // Werewolf
  // Renown
  const renown = WOD5E.Renown.getList({
    prependType: true
  })
  // "All Renown" selector
  selectorsList.push({
    id: 'renown',
    displayName: game.i18n.format('WOD5E.Modifier.AllString', {
      string: game.i18n.localize('WOD5E.WTA.Renown')
    })
  })
  // Individual renown
  for (const [key, value] of Object.entries(renown)) {
    selectorsList.push({
      id: key,
      displayName: value.displayName
    })
  }

  // Gifts
  const gifts = WOD5E.Gifts.getList({
    prependType: true
  })
  // "All Gifts" selector
  selectorsList.push({
    id: 'gifts',
    displayName: game.i18n.format('WOD5E.Modifier.AllString', {
      string: game.i18n.localize('WOD5E.WTA.Gifts')
    })
  })
  // Individual gifts
  for (const [key, value] of Object.entries(gifts)) {
    selectorsList.push({
      id: key,
      displayName: value.displayName
    })
  }

  return selectorsList
}
