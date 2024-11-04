/* global WOD5E, game */

/**
 * Function to handle getting the list of available keys
 */
export const getEffectKeys = () => {
  const keysList = []

  // Attributes
  const attributes = WOD5E.Attributes.getList({
    useValuePath: true
  })
  // "All Attributes" key
  keysList.push({
    id: 'attributes',
    displayName: game.i18n.format('WOD5E.Modifier.AllString', {
      string: game.i18n.localize('WOD5E.AttributesList.Attributes')
    })
  })
  // Individual attributes
  for (const [key, value] of Object.entries(attributes)) {
    keysList.push({
      id: key,
      displayName: value.displayName
    })
  }

  // Physical Attributes
  keysList.push({
    id: 'physical',
    displayName: game.i18n.format('WOD5E.Modifier.AllString', {
      string: game.i18n.localize('WOD5E.SPC.Physical')
    })
  })

  // Mental Attributes
  keysList.push({
    id: 'mental',
    displayName: game.i18n.format('WOD5E.Modifier.AllString', {
      string: game.i18n.localize('WOD5E.SPC.Mental')
    })
  })

  // Social Attributes
  keysList.push({
    id: 'social',
    displayName: game.i18n.format('WOD5E.Modifier.AllString', {
      string: game.i18n.localize('WOD5E.SPC.Social')
    })
  })

  // Skills
  const skills = WOD5E.Skills.getList({
    useValuePath: true
  })
  // "All Skills" key
  keysList.push({
    id: 'skills',
    displayName: game.i18n.format('WOD5E.Modifier.AllString', {
      string: game.i18n.localize('WOD5E.SkillsList.Skills')
    })
  })
  // Individual skills
  for (const [key, value] of Object.entries(skills)) {
    keysList.push({
      id: key,
      displayName: value.displayName
    })
  }

  // "Health Max" key
  keysList.push({
    id: 'system.health.max',
    displayName: game.i18n.format('WOD5E.MaxString', {
      string: game.i18n.localize('WOD5E.Health')
    })
  })

  // "Willpower Max" key
  keysList.push({
    id: 'system.willpower.max',
    displayName: game.i18n.format('WOD5E.MaxString', {
      string: game.i18n.localize('WOD5E.Willpower')
    })
  })

  // Vampire
  const disciplines = WOD5E.Disciplines.getList({
    useValuePath: true
  })
  // "All Disciplines" key
  keysList.push({
    id: 'disciplines',
    displayName: game.i18n.format('WOD5E.Modifier.AllString', {
      string: game.i18n.localize('WOD5E.VTM.Disciplines')
    })
  })
  // Individual disciplines
  for (const [key, value] of Object.entries(disciplines)) {
    keysList.push({
      id: key,
      displayName: value.displayName
    })
  }
  // "Hunger Max" key
  keysList.push({
    id: 'system.hunger.max',
    displayName: game.i18n.format('WOD5E.MaxString', {
      string: game.i18n.localize('WOD5E.VTM.Hunger')
    })
  })

  // Werewolf
  // Renown
  const renown = WOD5E.Renown.getList({
    useValuePath: true
  })
  // "All Renown" key
  keysList.push({
    id: 'renown',
    displayName: game.i18n.format('WOD5E.Modifier.AllString', {
      string: game.i18n.localize('WOD5E.WTA.Renown')
    })
  })
  // Individual renown
  for (const [key, value] of Object.entries(renown)) {
    keysList.push({
      id: key,
      displayName: value.displayName
    })
  }
  // "Rage Max" key
  keysList.push({
    id: 'system.rage.max',
    displayName: game.i18n.format('WOD5E.MaxString', {
      string: game.i18n.localize('WOD5E.WTA.Rage')
    })
  })

  return keysList
}
