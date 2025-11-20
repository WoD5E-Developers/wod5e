// Definition classes
import { ItemTypes } from '../../api/def/itemtypes.js'
import { Disciplines } from '../../api/def/disciplines.js'
import { Edges } from '../../api/def/edges.js'
import { Gifts } from '../../api/def/gifts.js'
import { Features } from '../../api/def/features.js'
import { Weapons } from '../../api/def/weapons.js'
// Localization function
import { generateLocalizedLabel } from '../../api/generate-localization.js'
// Data item format function
import { formatDataItemId } from './format-data-item-id.js'
// Various update functions
import { _updateSelectedPerk } from '../htr/scripts/edges.js'
import { _updateSelectedDisciplinePower } from '../vtm/scripts/disciplines.js'
import { _updateSelectedGiftPower } from '../wta/scripts/gifts.js'

export const _onCreateItem = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const itemsList = ItemTypes.getList({})
  const type = target.getAttribute('data-type')
  const subtype = target.getAttribute('data-subtype')

  // Variables to be defined later
  let itemName = ''
  let selectLabel = ''
  let itemOptions = {}
  let itemData = {}

  // Define the actor's gamesystem, defaulting to "mortal" if it's not in the systems list
  const system = actor.system.gamesystem

  // Generate item options and the select label based on item type
  switch (type) {
    case 'power':
      selectLabel = game.i18n.localize('WOD5E.VTM.SelectDiscipline')
      itemOptions = Disciplines.getList({})
      break
    case 'perk':
      selectLabel = game.i18n.localize('WOD5E.HTR.SelectEdge')
      itemOptions = Edges.getList({})
      break
    case 'gift':
      selectLabel = game.i18n.localize('WOD5E.WTA.SelectGift')
      itemOptions = Gifts.getList({})
      break
    case 'feature':
      selectLabel = game.i18n.localize('WOD5E.ItemsList.SelectFeature')
      itemOptions = Features.getList({})
      break
    case 'weapon':
      selectLabel = game.i18n.localize('WOD5E.EquipmentList.SelectWeaponType')
      itemOptions = Weapons.getList({})
      break
  }

  // Create item if subtype is already defined or not needed
  if (subtype || foundry.utils.isEmpty(itemOptions)) {
    // Generate the item name
    itemName = subtype ? generateLocalizedLabel(subtype, type) : itemsList[type].label

    // Generate item name based on type
    switch (type) {
      case 'power':
        itemName = game.i18n.format('WOD5E.VTM.NewStringPower', { string: itemName })
        break
      case 'perk':
        itemName = game.i18n.format('WOD5E.HTR.NewStringPerk', { string: itemName })
        break
      case 'gift':
        if (subtype && subtype === 'rite') {
          itemName = game.i18n.format('WOD5E.NewString', { string: itemName })
        } else {
          itemName = game.i18n.format('WOD5E.WTA.NewStringGift', { string: itemName })
        }
        break
      case 'edgepool':
        itemName = game.i18n.format('WOD5E.HTR.NewStringEdgePool', { string: itemName })
        break
      case 'feature':
        itemName = game.i18n.format('WOD5E.NewString', { string: itemName })
        break
      case 'weapon':
        itemName = game.i18n.format('WOD5E.EquipmentList.NewStringWeapon', { string: itemName })
        break
      default:
        itemName = game.i18n.format('WOD5E.NewString', { string: itemName })
        break
    }

    // Append subtype data (if one is applicable)
    if (subtype) {
      itemData = await appendSubtypeData(type, subtype, itemData)
    }

    // Create the item
    createItem(actor, itemName, type, itemData)
  } else {
    // Build the options for the select dropdown
    const content = new foundry.data.fields.StringField({
      choices: itemOptions,
      label: selectLabel,
      required: true
    }).toFormGroup(
      {},
      {
        name: 'subtypeSelection'
      }
    ).outerHTML

    // Prompt the dialog to determine which item subtype we're adding
    const subtypeSelection = await foundry.applications.api.DialogV2.prompt({
      window: {
        title: game.i18n.localize('WOD5E.Add')
      },
      classes: ['wod5e', system, 'dialog'],
      content,
      ok: {
        callback: (event, button) =>
          new foundry.applications.ux.FormDataExtended(button.form).object.subtypeSelection
      },
      modal: true
    })

    if (subtypeSelection) {
      itemData = await appendSubtypeData(type, subtypeSelection, itemData)

      // Generate the item name
      itemName = subtypeSelection
        ? generateLocalizedLabel(subtypeSelection, type)
        : itemsList[type].label

      // Generate item name based on type
      switch (type) {
        case 'power':
          itemName = game.i18n.format('WOD5E.VTM.NewStringPower', { string: itemName })
          break
        case 'perk':
          itemName = game.i18n.format('WOD5E.HTR.NewStringPerk', { string: itemName })
          break
        case 'gift':
          if (subtypeSelection === 'rite') {
            itemName = game.i18n.format('WOD5E.NewString', { string: itemName })
          } else {
            itemName = game.i18n.format('WOD5E.WTA.NewStringGift', { string: itemName })
          }
          break
        case 'edgepool':
          itemName = game.i18n.format('WOD5E.HTR.NewStringEdgePool', { string: itemName })
          break
        case 'feature':
          itemName = game.i18n.format('WOD5E.NewString', { string: itemName })
          break
        case 'weapon':
          itemName = game.i18n.format('WOD5E.EquipmentList.NewStringWeapon', { string: itemName })
          break
        default:
          itemName = game.i18n.format('WOD5E.NewString', { string: itemName })
          break
      }

      // Create the item
      createItem(actor, itemName, type, itemData)
    }
  }
}

export const _onItemChat = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  const itemId = target.getAttribute('data-item-id')
  const item = actor.getEmbeddedDocument('Item', itemId)

  foundry.documents.ChatMessage.implementation.create({
    flags: {
      wod5e: {
        name: item.name,
        img: item.img,
        description: item.system?.description || ''
      }
    }
  })
}

export const _onItemEdit = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  const itemId = target.getAttribute('data-item-id')
  const item = actor.getEmbeddedDocument('Item', itemId)
  item.sheet.render(true)
}

export const _onItemDelete = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  // Primary variables
  const itemId = target.getAttribute('data-item-id')
  const item = actor.getEmbeddedDocument('Item', itemId)

  // Define the actor's gamesystem, defaulting to "mortal" if it's not in the systems list
  const system = actor.system.gamesystem

  // Define the content of the Dialog
  const content = `<p>
    ${game.i18n.format('WOD5E.ConfirmDeleteDescription', {
      string: item.name
    })}
  </p>`

  // Prompt a dialog for the user to confirm they want to delete the item
  const confirmItemDelete = await foundry.applications.api.DialogV2.wait({
    window: {
      title: game.i18n.localize('WOD5E.ConfirmDelete')
    },
    classes: ['wod5e', system, 'dialog'],
    content,
    modal: true,
    buttons: [
      {
        label: game.i18n.localize('WOD5E.Confirm'),
        action: true
      },
      {
        label: game.i18n.localize('WOD5E.Cancel'),
        action: false
      }
    ]
  })

  if (confirmItemDelete) {
    actor.deleteEmbeddedDocuments('Item', [itemId])
  }
}

// Create an embedded item document
async function createItem(actor, itemName, type, itemData) {
  const dataItemId = `${type}-${formatDataItemId(itemName)}`

  // Create the item
  const newItem = await Item.create(
    {
      name: itemName,
      type,
      system: itemData,
      flags: {
        wod5e: {
          dataItemId
        }
      }
    },
    {
      parent: actor
    }
  )
  const itemId = newItem.id

  // Handle updating the currently selected power for the actor
  switch (newItem.type) {
    case 'power':
      _updateSelectedDisciplinePower(actor, itemId)
      break
    case 'perk':
      _updateSelectedPerk(actor, itemId)
      break
    case 'gift':
      _updateSelectedGiftPower(actor, itemId)
      break
  }
}

// Append subtype data to the item data based on item type
async function appendSubtypeData(type, subtype, itemData) {
  switch (type) {
    case 'power':
      itemData.discipline = subtype
      break
    case 'perk':
      itemData.edge = subtype
      break
    case 'edgepool':
      itemData.edge = subtype
      break
    case 'gift':
      itemData.giftType = subtype
      break
    case 'feature':
      itemData.featuretype = subtype
      break
    case 'weapon':
      itemData.weaponType = subtype
      break
    default:
      itemData.subtype = subtype
  }

  return itemData
}
