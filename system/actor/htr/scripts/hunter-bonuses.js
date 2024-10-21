/* global game */

export const getHunterModifiers = async function (actorData) {
  const bonuses = [
    {
      source: game.i18n.localize('WOD5E.HTR.Drive'),
      value: actorData.desperation.value,
      paths: ['all'],
      unless: ['despair'],
      displayWhenInactive: true,
      applyDiceTo: 'advanced'
    }
  ]

  return bonuses
}
