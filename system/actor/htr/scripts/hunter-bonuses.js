/* global game */

export const getHunterBonuses = async function (actorData) {
  const bonuses = [
    {
      source: game.i18n.localize('WOD5E.HTR.Drive'),
      value: actorData.desperation.value,
      paths: ['all'],
      unless: [],
      displayWhenInactive: true,
      activeWhen: {
        check: 'ifEquals',
        path: 'despair.value',
        value: 0
      },
      applyDiceTo: 'advanced'
    }
  ]

  return bonuses
}
