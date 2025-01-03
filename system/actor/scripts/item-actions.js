/* global game, Dialog, renderTemplate, ChatMessage, Item, foundry */

// Definition classes
import { ItemTypes } from '../../api/def/itemtypes.js'
import { Disciplines } from '../../api/def/disciplines.js'
import { Arts } from '../../api/def/arts.js'
import { Realms } from '../../api/def/realms.js'
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

  // Variables to be defined later
  let subtype = target.getAttribute('data-subtype')
  let itemName = ''
  let selectLabel = ''
  let itemOptions = {}
  let itemData = {}
  let options = ''

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

    if (subtype) {
      itemData = await appendSubtypeData(type, subtype, itemData)
    }

    // Create the item
    createItem(actor, itemName, type, itemData)
  } else {
    // Build the options for the select dropdown
    for (const [key, value] of Object.entries(itemOptions)) {
      options += `<option value="${key}">${value.displayName}</option>`
    }

    // Template for the dialog form
    const template = `
      <form>
        <div class="form-group">
          <label>${selectLabel}</label>
          <select id="subtypeSelect">${options}</select>
        </div>
      </form>`

    // Define dialog buttons
    const buttons = {
      submit: {
        icon: '<i class="fas fa-check"></i>',
        label: game.i18n.localize('WOD5E.Add'),
        callback: async (html) => {
          subtype = html.find('#subtypeSelect')[0].value
          itemData = await appendSubtypeData(type, subtype, itemData)

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

          // Create the item
          createItem(actor, itemName, type, itemData)
        }
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: game.i18n.localize('WOD5E.Cancel')
      }
    }

    // Display the dialog
    new Dialog({
      title: game.i18n.localize('WOD5E.Add'),
      content: template,
      buttons,
      default: 'submit'
    }, {
      classes: ['wod5e', system, 'dialog']
    }).render(true)
  }
}

export const _onItemChat = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  const itemId = target.getAttribute('data-item-id')
  const item = actor.getEmbeddedDocument('Item', itemId)
  renderTemplate('systems/vtm5ec/display/ui/chat/chat-message.hbs', {
    name: item.name,
    img: item.img,
    description: item.system?.description || ''
  }).then(html => {
    const message = ChatMessage.applyRollMode({ speaker: ChatMessage.getSpeaker({ actor }), content: html }, game.settings.get('core', 'rollMode'))
    ChatMessage.create(message)
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

  // Variables yet to be defined
  let buttons = {}

  // Define the template to be used
  const template = `
  <form>
      <div class="form-group">
          <label>${game.i18n.format('WOD5E.ConfirmDeleteDescription', {
            string: item.name
          })}</label>
      </div>
  </form>`

  // Define the buttons and push them to the buttons variable
  buttons = {
    delete: {
      label: game.i18n.localize('WOD5E.Delete'),
      callback: async () => {
        actor.deleteEmbeddedDocuments('Item', [itemId])
      }
    },
    cancel: {
      label: game.i18n.localize('WOD5E.Cancel')
    }
  }

  new Dialog({
    title: game.i18n.localize('WOD5E.ConfirmDelete'),
    content: template,
    buttons,
    default: 'cancel'
  },
  {
    classes: ['wod5e', system, 'dialog']
  }).render(true)
}

// Create an embedded item document
async function createItem (actor, itemName, type, itemData) {
  const dataItemId = `${type}-${formatDataItemId(itemName)}`

  // Create the item
  const newItem = await Item.create({
    name: itemName,
    type,
    system: itemData,
    flags: {
      vtm5e: {
        dataItemId
      }
    }
  },
  {
    parent: actor
  })
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
async function appendSubtypeData (type, subtype, itemData) {
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
