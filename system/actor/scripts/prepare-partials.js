/* global TextEditor */

export const prepareStatsContext = function (context, actor) {
  const actorData = actor.system

  // Tab data
  context.tab = context.tabs.stats

  // Part-specific data
  context.sortedAttributes = actorData.sortedAttributes
  context.sortedSkills = actorData.sortedSkills
  context.customRolls = actorData.customRolls

  return context
}

export const prepareExperienceContext = function (context, actor) {
  const actorData = actor.system

  // Tab data
  context.tab = context.tabs.experience

  // Part-specific data
  context.experiences = actorData.experiences
  context.exp = actorData.exp
  context.derivedXP = actorData.derivedXP

  return context
}

export const prepareFeaturesContext = function (context, actor) {
  const actorData = actor.system
  const actorHeaders = actorData.headers

  // Tab data
  context.tab = context.tabs.features

  // Part-specific data
  context.features = actorData.features
  context.tenets = actorHeaders.tenets
  context.enrichedTenets = TextEditor.enrichHTML(actorHeaders.tenets)

  return context
}

export const prepareBiographyContext = function (context, actor) {
  const actorData = actor.system
  const actorHeaders = actorData.headers

  // Tab data
  context.tab = context.tabs.biography

  // Part-specific data
  context.bio = actorData.bio
  context.biography = actorData.biography
  context.enrichedBiography = TextEditor.enrichHTML(actorData.biography)
  context.appearance = actorData.appearance
  context.enrichedAppearance = TextEditor.enrichHTML(actorData.appearance)
  context.touchstones = actorHeaders.touchstones
  context.enrichedTouchstones = TextEditor.enrichHTML(actorHeaders.touchstones)

  return context
}

export const prepareNotepadContext = function (context, actor) {
  const actorData = actor.system

  // Tab data
  context.tab = context.tabs.notepad

  // Part-specific data
  context.notes = actorData.notes
  context.enrichedNotes = TextEditor.enrichHTML(actorData.notes)
  context.privatenotes = actorData.privatenotes
  context.enrichedPrivatenotes = TextEditor.enrichHTML(actorData.privatenotes)

  return context
}

export const prepareSettingsContext = function (context) {
  // Tab data
  context.tab = context.tabs.settings

  return context
}
