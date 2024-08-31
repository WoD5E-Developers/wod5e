export const getActorTypes = async function (actor) {
  const currentActorType = actor.type

  const playerTypes = {
    mortal: 'WOD5E.Mortal',
    vampire: 'WOD5E.VTM.Label',
    ghoul: 'WOD5E.VTM.Ghoul',
    werewolf: 'WOD5E.WTA.Label',
    hunter: 'WOD5E.HTR.Label'
  }

  const spcTypes = {
    mortal: 'WOD5E.Mortal',
    vampire: 'WOD5E.VTM.Label',
    werewolf: 'WOD5E.WTA.Label',
    hunter: 'WOD5E.HTR.Label'
  }

  const groupTypes = {
    coterie: 'WOD5E.VTM.Coterie',
    cell: 'WOD5E.HTR.Cell',
    pack: 'WOD5E.WTA.Pack'
  }

  if (currentActorType in playerTypes) {
    return {
      currentActorType,
      typePath: 'type',
      types: playerTypes
    }
  } else if (currentActorType === 'spc') {
    return {
      currentActorType: actor.system.spcType,
      typePath: 'system.spcType',
      types: spcTypes
    }
  } else if (currentActorType === 'group') {
    return {
      currentActorType: actor.system.groupType,
      typePath: 'system.groupType',
      types: groupTypes
    }
  } else {
    // The default is an object that has only the current type in it
    return {
      currentActorType,
      typePath: 'type',
      types: {
        [currentActorType]: currentActorType
      }
    }
  }
}
