/* global game, CONST, fromUuidSync */

export const _onPlayerUpdate = async function (actor, data) {
  const playerUpdates = {
    flags: data.flags || {},
    ownership: data.ownership || {},
    prototypeToken: data.prototypeToken || {}
  }

  // If the actor is a player...
  if (actor?.hasPlayerOwner && actor.type !== 'group') {
    // Update disposition to friendly
    playerUpdates.prototypeToken.disposition = CONST.TOKEN_DISPOSITIONS.FRIENDLY

    // If this includes a change to ownership, set overrideOwnership
    if (data?.ownership?.default) {
      // Set the overrideOwnership to false if the default is anything but limited
      // Set to false when ownership default is limited
      playerUpdates.flags.overrideOwnership = data.ownership.default !== CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED
    }

    // If we're allowed to override ownership or it's not already set, set default ownership to limited
    if (actor?.flags?.overrideOwnership || actor?.flags?.overrideOwnership === undefined) {
      playerUpdates.ownership.default = CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED
    }
  }

  return Object.assign(data, playerUpdates)
}

export const _onGroupUpdate = async function (group, data) {
  const groupUpdates = {
    flags: data.flags || {},
    ownership: data.ownership || {}
  }

  // If the actor is a group...
  if (group.type === 'group') {
    // If the group ownership for a specific user gets set, set "overrideGroupOwnership" for that user to false
    if (data?.ownership) {
      for (const playerKey of Object.keys(data.ownership).filter(permissionKey => permissionKey !== 'default')) {
        const user = game.users.get(playerKey)
        // Ignore the gamemaster permission
        if (user.role !== CONST.USER_ROLES.GAMEMASTER) {
          if (data.ownership[playerKey] !== CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED) {
            console.log(`Setting overrideGroupOwnership for ${user.name} to false`)
            groupUpdates.flags.overrideGroupOwnership[playerKey] = false
          }
        }
      }
    }

    // Update the group's permissions to include the group members as limited unless there's an override for it
    // Otherwise keep whatever default ownership the storyteller has set
    if (group.system?.members) {
      for (const memberUuid of group.system.members) {
        const member = fromUuidSync(memberUuid)
        if (!member) {
          console.warn(`Member with UUID ${memberUuid} not found.`)
        }

        if (member.hasPlayerOwner) {
          for (const key of Object.keys(member.ownership).filter(k => k !== 'default' && member.ownership[k] === CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER)) {
            const user = game.users.get(key)
            // Ignore the gamemaster permission
            if (user.role !== CONST.USER_ROLES.GAMEMASTER) {
              // Get the overrideGroupOwnership flag for this user
              const overrideFlag = groupUpdates.flags?.overrideGroupOwnership?.[key] || group.flags?.overrideGroupOwnership?.[key]

              // If the override flag is true or not defined AND the ownership isn't already set to Limited
              // Then update the ownership for this player to Limited
              if ((overrideFlag === undefined || overrideFlag === true) && (member.ownership[key] !== CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED)) {
                console.log(`Setting ownership for ${user.name} to limited`)
                groupUpdates.ownership[key] = CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED
              }
            }
          }
        }
      }
    }
  }

  return Object.assign(data, groupUpdates)
}
