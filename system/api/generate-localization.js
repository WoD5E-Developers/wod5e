/* global game */

import { ActorTypes } from './def/actortypes.js'
import { Attributes } from './def/attributes.js'
import { Skills } from './def/skills.js'
import { Features } from './def/features.js'
import { Weapons } from './def/weapons.js'
import { Disciplines } from './def/disciplines.js'
import { Arts } from './def/arts.js'
import { Realms } from './def/realms.js'
import { Gifts } from './def/gifts.js'
import { WereForms } from './def/were-forms.js'
import { Renown } from './def/renown.js'
import { Edges } from './def/edges.js'

/**
 * Function to handle localization of keys
 * @param string
 * @param type
 */
export const generateLocalizedLabel = function (string = '', type = '') {
  if (type === 'actortypes' || type === 'actortype') { // Actor Types
    const actortypes = ActorTypes.getList({})
    return findLabel(actortypes, string)
  } else if (type === 'attributes' || type === 'attribute') { // Attributes
    const attributes = Attributes.getList({})
    return findLabel(attributes, string)
  } else if (type === 'skills' || type === 'skill') { // Skills
    const skills = Skills.getList({})
    return findLabel(skills, string)
  } else if (type === 'features' || type === 'feature') { // Features
    const features = Features.getList({})
    return findLabel(features, string)
  } else if (type === 'weapons' || type === 'weapon') { // Weapons
    const weapons = Weapons.getList({})
    return findLabel(weapons, string)
  } else if (type === 'disciplines' || type === 'discipline' || type === 'power') { // Disciplines
    const disciplines = Disciplines.getList({})
    return findLabel(disciplines, string)
  } else if (type === 'arts' || type === 'art') { // Arts
    const arts = Arts.getList({})
    return findLabel(arts, string)
  } else if (type === 'realms' || type === 'realm') { // Disciplines
    const realms = Realms.getList({})
    return findLabel(realms, string)
  } else if (type === 'gifts' || type === 'gift') { // Gifts
    const gifts = Gifts.getList({})
    return findLabel(gifts, string)
  } else if (type === 'wereform') { // Wereforms
    const wereforms = WereForms.getList({})
    return findLabel(wereforms, string)
  } else if (type === 'renown') { // Renown
    const renown = Renown.getList({})
    return findLabel(renown, string)
  } else if (type === 'edges' || type === 'edge' || type === 'perk' || type === 'edgepool') { // Edges
    const edges = Edges.getList({})
    return findLabel(edges, string)
  } else if (type === 'grouptype' || type === 'group') {
    const grouptypes = {
      cell: {
        displayName: game.i18n.localize('WOD5E.HTR.Cell')
      },
      coterie: {
        displayName: game.i18n.localize('WOD5E.VTM.Coterie')
      },
      pack: {
        displayName: game.i18n.localize('WOD5E.WTA.Pack')
      }
    }

    return findLabel(grouptypes, string)
  } else { // Return the base localization if nothing else is found
    return game.i18n.localize(`WOD5E.${string}`)
  }

  // Function to actually grab the localized label
  function findLabel (list = {}, str = '') {
    const stringObject = list[str]

    // Return the localized string if found
    if (stringObject?.displayName) return stringObject.displayName
    if (stringObject?.label) return stringObject.label

    // Return nothing
    return ''
  }
}
