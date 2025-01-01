export const getActorTypes = async function (actor) {
  const currentActorType = actor.type

  const playerTypes = {
    mortal: 'WOD5E.Mortal',
    vampire: 'TYPES.Actor.vampire',
    ghoul: 'WOD5E.VTM.Ghoul',
    werewolf: 'TYPES.Actor.werewolf',
    hunter: 'TYPES.Actor.hunter',
    changeling: 'TYPES.Actor.changeling'
  }

  const spcTypes = {
    mortal: 'WOD5E.Mortal',
    ghoul: 'WOD5E.VTM.Ghoul',
    vampire: 'TYPES.Actor.vampire',
    werewolf: 'TYPES.Actor.werewolf',
    spirit: 'WOD5E.WTA.Spirit',
    hunter: 'TYPES.Actor.hunter',
    changeling: 'TYPES.Actor.changeling'
  }

  const groupTypes = {
    coterie: 'WOD5E.VTM.Coterie',
    cell: 'WOD5E.HTR.Cell',
    pack: 'WOD5E.WTA.Pack'
  }

  if (currentActorType in playerTypes) {
    return {
      baseActorType: currentActorType,
      currentActorType,
      currentTypeLabel: playerTypes[currentActorType],
      typePath: 'type',
      types: playerTypes
    }
  } else if (currentActorType === 'spc') {
    return {
      baseActorType: 'spc',
      currentActorType: actor.system.spcType,
      currentTypeLabel: spcTypes[actor.system.spcType],
      typePath: 'system.spcType',
      types: spcTypes
    }
  } else if (currentActorType === 'group') {
    return {
      baseActorType: 'group',
      currentActorType: actor.system.groupType,
      currentTypeLabel: groupTypes[actor.system.groupType],
      typePath: 'system.groupType',
      types: groupTypes
    }
  } else {
    // The default is an object that has only the current type in it
    return {
      baseActorType: currentActorType,
      currentActorType,
      currentTypeLabel: currentActorType,
      typePath: 'type',
      types: {
        [currentActorType]: currentActorType
      }
    }
  }
}
