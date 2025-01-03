import { Arts } from '../../../api/def/arts.js'
import { Realms } from '../../../api/def/realms.js'

export const prepareArts = async function (actor) {
    // Secondary variables
    const artsList = Arts.getList({})
    const actorArts = actor.system?.Arts
    const computedArts = {}

    for (const [id, value] of Object.entries(artsList)) {
        let artData = {}

        // If the actor has a art with the key, grab its current values
        if (actorArts && Object.prototype.hasOwnProperty.call(actorArts, id)) {
            artData = Object.assign({
                id,
                value: actorArts[id].value || 0,
                powers: actorArts[id].powers || [],
                description: actorArts[id]?.description || '',
                visible: actorArts[id].visible,
                selected: actorArts[id].selected || false
            }, value)
        } else { // Otherwise, add it to the actor and set it as some default data
            artData = Object.assign({
                id,
                value: 0,
                visible: false,
                description: '',
                powers: [],
                selected: false
            }, value)
        }

        // Ensure the art exists
        if (!computedArts[id]) computedArts[id] = {}
        // Apply the art's data
        computedArts[id] = artData

        // Make it forced invisible if it's set to hidden
        if (artData.hidden) {
            computedArts[id].visible = false
        }

        // Assign all matching powers to the art
        computedArts[id].powers = actor.items.filter(item =>
            item.type === 'power' && item.system.art === id
        )
    }

    return computedArts
}

export const prepareArtsPowers = async function (arts) {
    for (const artType in arts) {
        if (Object.prototype.hasOwnProperty.call(arts, artType)) {
            const art = arts[artType]

            if (art && Array.isArray(art.powers)) {
                // Check if the art has powers
                if (art.powers.length > 0) {
                    // Ensure visibility is set correctly
                    if (!art.visible && !art.hidden) art.visible = true

                    // Sort the art containers by the level of the power
                    art.powers = art.powers.sort(function (power1, power2) {
                        // Ensure power1 and power2 have the necessary properties
                        const level1 = power1.system ? power1.system.level : 0
                        const level2 = power2.system ? power2.system.level : 0

                        // If levels are the same, sort alphabetically instead
                        if (level1 === level2) {
                            return power1.name.localeCompare(power2.name)
                        }

                        // Sort by level
                        return level1 - level2
                    })
                }
            } else {
                console.warn(`Art ${artType} is missing or powers is not an array.`)
            }
        }
    }

    return arts
}

export const prepareRealms = async function (actor) {
    // Secondary variables
    const realmsList = Realms.getList({})
    const actorRealms = actor.system?.Realms
    const computedRealms = {}

    for (const [id, value] of Object.entries(realmsList)) {
        let realmData = {}

        // If the actor has a realm with the key, grab its current values
        if (actorRealms && Object.prototype.hasOwnProperty.call(actorRealms, id)) {
            realmData = Object.assign({
                id,
                value: actorRealms[id].value || 0,
                powers: actorRealms[id].powers || [],
                description: actorRealms[id]?.description || '',
                visible: actorRealms[id].visible,
                selected: actorRealms[id].selected || false
            }, value)
        } else { // Otherwise, add it to the actor and set it as some default data
            realmData = Object.assign({
                id,
                value: 0,
                visible: false,
                description: '',
                powers: [],
                selected: false
            }, value)
        }

        // Ensure the realm exists
        if (!computedRealms[id]) computedRealms[id] = {}
        // Apply the realm's data
        computedRealms[id] = realmData

        // Make it forced invisible if it's set to hidden
        if (realmData.hidden) {
            computedRealms[id].visible = false
        }

        // Assign all matching powers to the realm
        computedRealms[id].powers = actor.items.filter(item =>
            item.type === 'power' && item.system.realm === id
        )
    }

    return computedRealms
}

export const prepareRealmsPowers = async function (realms) {
    for (const realmType in realms) {
        if (Object.prototype.hasOwnProperty.call(realms, realmType)) {
            const realm = realms[realmType]

            if (realm && Array.isArray(realm.powers)) {
                // Check if the realm has powers
                if (realm.powers.length > 0) {
                    // Ensure visibility is set correctly
                    if (!realm.visible && !realm.hidden) realm.visible = true

                    // Sort the realm containers by the level of the power
                    realm.powers = realm.powers.sort(function (power1, power2) {
                        // Ensure power1 and power2 have the necessary properties
                        const level1 = power1.system ? power1.system.level : 0
                        const level2 = power2.system ? power2.system.level : 0

                        // If levels are the same, sort alphabetically instead
                        if (level1 === level2) {
                            return power1.name.localeCompare(power2.name)
                        }

                        // Sort by level
                        return level1 - level2
                    })
                }
            } else {
                console.warn(`Realm ${realmType} is missing or powers is not an array.`)
            }
        }
    }

    return realms
}
