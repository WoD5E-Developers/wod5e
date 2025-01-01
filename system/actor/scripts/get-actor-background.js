/* global game */

export const getActorBackground = async function (actor) {
  const actorBG = actor.system?.settings?.background || ''
  const settingsBG = game.settings.get('vtm5ec', 'actorBackgroundOverride') || ''

  if (actorBG) { // Always prefer the actor-specific setting override
    return actorBG
  } else if (settingsBG) { // Use the settings header if one is set and the actor field doesn't have one
    return settingsBG
  }

  // Return an empty string, telling Handlebars to use the default background
  return ''
}
