/* global game */

export const getActorHeader = async function (actor) {
  const actorBG = actor.system?.settings?.headerbg || ''
  const settingsBG = game.settings.get('vtm5ec', 'actorHeaderOverride') || ''

  if (actorBG) { // Always prefer the actor-specific header setting override
    return actorBG
  } else if (settingsBG) { // Use the settings header if one is set and the actor field doesn't have one
    return settingsBG
  }

  // Return an empty string, telling Handlebars to use the default background
  return ''
}
