/* global TextEditor, fromUuidSync */

export const prepareStatsContext = async function (context, actor) {
  const actorData = actor.system

  // Tab data
  context.tab = context.tabs.stats

  // Part-specific data
  context.sortedAttributes = actorData.sortedAttributes
  context.sortedSkills = actorData.sortedSkills
  context.customRolls = actorData.customRolls
  context.conditions = actorData.conditions

  return context
}

export const prepareExperienceContext = async function (context, actor) {
  const actorData = actor.system

  // Tab data
  context.tab = context.tabs.experience

  // Part-specific data
  if (actorData?.experiences) {
    context.experiences = actorData.experiences.sort(function (xp1, xp2) {
      const timestamp1 = xp1?.timestamp || 0
      const timestamp2 = xp2?.timestamp || 0

      return timestamp2 - timestamp1
    })
  }
  context.exp = actorData.exp
  context.derivedXP = actorData.derivedXP

  return context
}

export const prepareFeaturesContext = async function (context, actor) {
  const actorData = actor.system
  const actorHeaders = actorData.headers

  // Tab data
  context.tab = context.tabs.features

  // Part-specific data
  context.concept = actorHeaders.concept
  context.chronicle = actorHeaders.chronicle
  context.ambition = actorHeaders.ambition
  context.desire = actorHeaders.desire
  context.features = actorData.features
  context.tenets = actorHeaders.tenets
  context.enrichedTenets = await TextEditor.enrichHTML(actorHeaders.tenets)
  context.touchstones = actorHeaders.touchstones
  context.enrichedTouchstones = await TextEditor.enrichHTML(actorHeaders.touchstones)
  context.showAmbitionDesire = actorData.gamesystem !== 'werewolf' && actor.type !== 'group'

  if (actorData.gamesystem === 'werewolf') {
    const tribe = context.tribe

    context.favor = tribe?.system?.patronSpirit?.favor || ''
    context.enrichedFavor = await TextEditor.enrichHTML(context.favor)
    context.ban = tribe?.system?.patronSpirit?.ban || ''
    context.enrichedBan = await TextEditor.enrichHTML(context.ban)
  }

  if (actorData.gamesystem === 'changeling') {
    context.ban = context.legacy?.system?.ban || ''
    context.enrichedBan = await TextEditor.enrichHTML(context.ban)
    
    context.frailty = context.kith?.system?.frailty || ''
    context.enrichedFrailty = await TextEditor.enrichHTML(context.frailty)

    debugger
    context.personalBans = actorHeaders.personalBans
    context.enrichedPersonalBans = await TextEditor.enrichHTML(context.personalBans)
  }

  return context
}

export const prepareEquipmentContext = async function (context, actor) {
  const actorData = actor.system

  // Tab data
  context.tab = context.tabs.equipment

  // Part-specific data
  context.equipment = actorData.equipment
  context.enrichedEquipment = await TextEditor.enrichHTML(actorData.equipment)
  context.equipmentItems = actorData.equipmentItems

  return context
}

export const prepareBiographyContext = async function (context, actor) {
  const actorData = actor.system

  // Tab data
  context.tab = context.tabs.biography

  // Part-specific data
  context.bio = actorData.bio
  context.biography = actorData.biography
  context.enrichedBiography = await TextEditor.enrichHTML(actorData.biography)
  context.appearance = actorData.appearance
  context.enrichedAppearance = await TextEditor.enrichHTML(actorData.appearance)

  return context
}

export const prepareNotepadContext = async function (context, actor) {
  const actorData = actor.system

  // Tab data
  context.tab = context.tabs.notepad

  // Part-specific data
  context.notes = actorData.notes
  context.enrichedNotes = await TextEditor.enrichHTML(actorData.notes)
  context.privatenotes = actorData.privatenotes
  context.enrichedPrivateNotes = await TextEditor.enrichHTML(actorData.privatenotes)

  return context
}

export const prepareSettingsContext = async function (context, actor) {
  const actorData = actor.system
  const actorsWithPowers = ['vampire', 'hunter', 'werewolf', 'changeling']

  // Tab data
  context.tab = context.tabs.settings

  if (context.baseActorType === 'spc' && actorsWithPowers.indexOf(context.currentActorType) === -1) {
    context.showOptionalPowers = true

    context.enableDisciplines = actorData.settings.enableDisciplines
    context.enableEdges = actorData.settings.enableEdges
    context.enableGifts = actorData.settings.enableGifts
  }

  return context
}

export const prepareLimitedContext = async function (context, actor) {
  const actorData = actor.system
  const actorHeaders = actorData.headers

  // Part-specific data
  context.enrichedNotes = await TextEditor.enrichHTML(actorData.notes)
  context.enrichedAppearance = await TextEditor.enrichHTML(actorData.appearance)
  context.enrichedTenets = await TextEditor.enrichHTML(actorHeaders.tenets)
  context.enrichedTouchstones = await TextEditor.enrichHTML(actorHeaders.touchstones)
  context.enrichedBiography = await TextEditor.enrichHTML(actorData.biography)

  return context
}

export const prepareSpcStatsContext = async function (context, actor) {
  const actorData = actor.system

  // Tab data
  context.tab = context.tabs.stats

  // Part-specific data
  context.standardPools = actorData.standarddicepools
  context.exceptionalPools = actorData.exceptionaldicepools

  context.traits = actorData.traits
  context.conditions = actorData.conditions

  if (context.currentActorType === 'vampire' || (context.gamesystem === 'vampire' && context.settings.enableDisciplines === true)) {
    context.showDisciplines = true
    context.disciplines = actorData.disciplines
  }

  if (context.currentActorType === 'hunter' || (context.gamesystem === 'hunter' && context.settings.enableEdges === true)) {
    context.showEdges = true
    context.edges = actorData.edges
  }

  if (context.currentActorType === 'werewolf' || (context.gamesystem === 'werewolf' && context.settings.enableGifts === true)) {
    context.showGifts = true
    context.gifts = actorData.gifts
  }

  if (context.currentActorType === 'changeling' || (context.gamesystem === 'changeling' && context.settings.enableArtsAndRealms === true)) {
    context.showArtsAndRealms = true
    context.arts = actorData.arts
    context.realms = actorData.realms
  }

  if (context.currentActorType === 'spirit') {
    context.manifestation = actorData.manifestation
    context.enrichedManifestation = await TextEditor.enrichHTML(actorData.manifestation)
  }

  return context
}

export const prepareGroupMembersContext = async function (context, actor) {
  const actorData = actor.system

  // Tab data
  context.tab = context.tabs.members

  // Part-specific data
  // Push each group member's data to the groupMembers list\
  context.groupMembers = []
  if (actorData.members) {
    actorData.members.forEach(actorID => {
      const actor = fromUuidSync(actorID)
      context.groupMembers.push(actor)
    })
  }

  return context
}

export const prepareGroupFeaturesContext = async function (context, actor) {
  const actorData = actor.system
  const actorHeaders = actorData.headers

  // Tab data
  context.tab = context.tabs.features

  // Part-specific data
  context.concept = actorHeaders.concept
  context.chronicle = actorHeaders.chronicle
  context.features = actorData.features
  context.tenets = actorHeaders.tenets
  context.enrichedTenets = await TextEditor.enrichHTML(actorHeaders.tenets)
  context.biography = actorData.biography
  context.enrichedBiography = await TextEditor.enrichHTML(actorData.biography)

  return context
}
