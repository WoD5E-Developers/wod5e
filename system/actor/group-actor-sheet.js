/* global foundry, game, TextEditor, DragDrop, Item, SortingHelpers, ui */

// Preparation functions
import { getActorHeader } from './scripts/get-actor-header.js'
import { getActorBackground } from './scripts/get-actor-background.js'
import { getActorTypes } from './scripts/get-actor-types.js'
import { prepareGroupFeaturesContext, prepareEquipmentContext, prepareNotepadContext, prepareSettingsContext, prepareGroupMembersContext } from './scripts/prepare-partials.js'
// Definition file
import { ItemTypes } from '../api/def/itemtypes.js'
// Resource functions
import { _onResourceChange, _setupDotCounters, _setupSquareCounters, _onDotCounterChange, _onDotCounterEmpty, _onSquareCounterChange } from './scripts/counters.js'
// Various button functions
import { _onEditImage } from './scripts/on-edit-image.js'
import { _onToggleLock } from './scripts/on-toggle-lock.js'
import { _onCreateItem, _onItemChat, _onItemEdit, _onItemDelete } from './scripts/item-actions.js'
import { _onToggleCollapse } from './scripts/on-toggle-collapse.js'
import { _addActor, _openActorSheet, _removeActor } from './scripts/group-members.js'
// Mixin
const { HandlebarsApplicationMixin } = foundry.applications.api

/**
 * Extend the WoDActor document
 * @extends {WoDActor}
 */
export class GroupActorSheet extends HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2) {
  get title () {
    return this.actor.isToken ? `[Token] ${this.actor.name}` : this.actor.name
  }

  constructor (options = {}) {
    super(options)

    this.#dragDrop = this.#createDragDropHandlers()
  }

  static DEFAULT_OPTIONS = {
    form: {
      submitOnChange: true,
      handler: GroupActorSheet.onSubmitActorForm
    },
    window: {
      icon: 'fa-solid fa-dice-d10',
      resizable: true
    },
    classes: ['wod5e', 'actor', 'group', 'sheet'],
    position: {
      width: 700,
      height: 600
    },
    actions: {
      // Item actions
      createItem: _onCreateItem,
      itemChat: _onItemChat,
      itemEdit: _onItemEdit,
      itemDelete: _onItemDelete,

      // Members functions
      openActorSheet: _openActorSheet,
      removeMember: _removeActor,

      // Various other sheet functions
      editImage: _onEditImage,
      toggleLock: _onToggleLock,
      toggleCollapse: _onToggleCollapse
    },
    dragDrop: [
      {
        dragSelector: '[data-drag]',
        dropSelector: null
      }
    ]
  }

  _getHeaderControls () {
    const controls = this.options.window.controls

    return controls
  }

  static PARTS = {
    header: {
      template: 'systems/vtm5e/display/shared/actors/group-sheet.hbs'
    },
    tabs: {
      template: 'systems/vtm5e/display/shared/actors/parts/tab-navigation.hbs'
    },
    members: {
      template: 'systems/vtm5e/display/shared/actors/parts/group/group-members.hbs'
    },
    features: {
      template: 'systems/vtm5e/display/shared/actors/parts/group/features.hbs'
    },
    equipment: {
      template: 'systems/vtm5e/display/shared/actors/parts/equipment.hbs'
    },
    notepad: {
      template: 'systems/vtm5e/display/shared/actors/parts/notepad.hbs'
    },
    settings: {
      template: 'systems/vtm5e/display/shared/actors/parts/actor-settings.hbs'
    },
    banner: {
      template: 'systems/vtm5e/display/shared/actors/parts/type-banner.hbs'
    }
  }

  tabGroups = {
    primary: 'members'
  }

  tabs = {
    members: {
      id: 'members',
      group: 'primary',
      title: 'WOD5E.Tabs.Members',
      icon: '<i class="fa-solid fa-person"></i>'
    },
    features: {
      id: 'features',
      group: 'primary',
      title: 'WOD5E.Tabs.Features',
      icon: '<i class="fas fa-gem"></i>'
    },
    equipment: {
      id: 'equipment',
      group: 'primary',
      title: 'WOD5E.Tabs.Equipment',
      icon: '<i class="fa-solid fa-toolbox"></i>'
    },
    notepad: {
      id: 'notepad',
      group: 'primary',
      title: 'WOD5E.Tabs.Notes',
      icon: '<i class="fas fa-sticky-note"></i>'
    },
    settings: {
      id: 'settings',
      group: 'primary',
      title: 'WOD5E.Tabs.Settings',
      icon: '<i class="fa-solid fa-gears"></i>'
    }
  }

  getTabs () {
    const tabs = this.tabs

    for (const tab of Object.values(tabs)) {
      tab.active = this.tabGroups[tab.group] === tab.id
      tab.cssClass = tab.active ? 'active' : ''
    }

    return tabs
  }

  async _prepareContext () {
    // Top-level variables
    const data = await super._prepareContext()
    const actor = this.actor
    const actorData = actor.system

    // Prepare tabs
    data.tabs = this.getTabs()

    // Define the data the template needs

    // Prepare items
    await this.prepareItems(actor)

    // Actor types that can be swapped to and data prep for it
    const actorTypeData = await getActorTypes(actor)

    // Handle figuring out hunting difficulty
    if (actorData.groupType === 'coterie') {
      data.huntingDifficulty = 7 - actorData.chasse.value
    }

    // Transform any data needed for sheet rendering
    return {
      ...data,

      name: actor.name,
      img: actor.img,

      settings: actorData.settings,

      isOwner: actor.isOwner,
      locked: actorData.locked,

      features: actorData.features,

      displayBanner: game.settings.get('vtm5e', 'actorBanner'),

      headerbg: await getActorHeader(actor),
      actorbg: actor.system?.settings?.background,

      baseActorType: actorTypeData.baseActorType,
      currentActorType: actorTypeData.currentActorType,
      currentTypeLabel: actorTypeData.currentTypeLabel,
      actorTypePath: actorTypeData.typePath,
      actorOptions: actorTypeData.types,

      chasse: actorData.chasse,
      lien: actorData.lien,
      portillon: actorData.portillon,

      desperation: actorData.desperation,
      danger: actorData.danger,

      territory: actorData.territory,
      community: actorData.community,
      spirit: actorData.spirit
    }
  }

  async prepareItems (sheetData) {
    // Features
    sheetData.system.features = sheetData.items.reduce((acc, item) => {
      if (item.type === 'feature') {
        // Assign to featuretype container, default to 'background' if unset
        const featuretype = item.system.featuretype || 'background'
        if (acc[featuretype]) {
          acc[featuretype].push(item)
        } else {
          // Create new array if it doesn't exist
          acc[featuretype] = [item]
        }
      }

      return acc
    }, {
      // Containers for features
      background: [],
      merit: [],
      flaw: [],
      boon: []
    })

    // Remove Boons if we have no boons and the actor isn't a coterie
    if (sheetData.system.features.boon.length === 0 && sheetData.type !== 'coterie') delete sheetData.system.features.boon

    // Equipment
    sheetData.system.equipmentItems = sheetData.items.reduce((acc, item) => {
      switch (item.type) {
        case 'armor':
          acc.armor.push(item)
          break
        case 'weapon':
          acc.weapon.push(item)
          break
        case 'gear':
          acc.gear.push(item)
          break
        case 'talisman':
          acc.talisman.push(item)
          break
      }

      return acc
    }, {
      // Containers for equipment
      armor: [],
      weapon: [],
      gear: [],
      talisman: []
    })

    // Remove Talismans if we have no boons and the actor isn't a werewolf
    if (sheetData.system.equipmentItems.talisman.length === 0 && sheetData.type !== 'pack') delete sheetData.system.equipmentItems.talisman
  }

  async _preparePartContext (partId, context, options) {
    // Inherit any preparation from the extended class
    context = { ...(await super._preparePartContext(partId, context, options)) }

    // Top-level variables
    const actor = this.actor

    // Prepare each page context
    switch (partId) {
      // Group members
      case 'members':
        return prepareGroupMembersContext(context, actor)

      // Features
      case 'features':
        return prepareGroupFeaturesContext(context, actor)

      // Equipment
      case 'equipment':
        return prepareEquipmentContext(context, actor)

      // Notepad
      case 'notepad':
        return prepareNotepadContext(context, actor)

      // Settings
      case 'settings':
        return prepareSettingsContext(context, actor)
    }

    return context
  }

  static async onSubmitActorForm (event, form, formData) {
    // Process submit data
    const submitData = this._prepareSubmitData(event, form, formData)

    // Overrides
    const overrides = foundry.utils.flattenObject(this.actor.overrides)
    for (const k of Object.keys(overrides)) delete submitData[k]

    // Update the actor data
    await this.actor.update(submitData)
  }

  async _onRender () {
    const html = $(this.element)

    // Update the window title (since ActorSheetV2 doesn't do it automatically)
    $(this.window.title).text(this.title)

    // Update the actor background if it's not the default
    const actorBackground = await getActorBackground(this.actor)
    if (actorBackground) {
      html.find('section.window-content').css('background', `url("${actorBackground}")`)
    } else {
      html.find('section.window-content').css('background', '')
    }

    html.find('.actor-header-bg-filepicker input').on('focusout', function (event) {
      event.preventDefault()

      const filepicker = event.target.parentElement
      const value = event?.target?.value

      $(filepicker).val(value)
    })

    html.find('.actor-background-filepicker input').on('focusout', function (event) {
      event.preventDefault()

      const filepicker = event.target.parentElement
      const value = event?.target?.value

      $(filepicker).val(value)
    })

    // Toggle whether the sheet is locked or not
    html.toggleClass('locked', this.actor.system.locked)

    // Resource squares (Health, Willpower)
    html.find('.resource-counter.editable .resource-counter-step').click(_onSquareCounterChange.bind(this))
    html.find('.resource-plus').click(_onResourceChange.bind(this))
    html.find('.resource-minus').click(_onResourceChange.bind(this))

    // Activate the setup for the counters
    _setupDotCounters(html)
    _setupSquareCounters(html)

    // Resource dots
    html.find('.resource-value .resource-value-step').click(_onDotCounterChange.bind(this))
    html.find('.resource-value .resource-value-empty').click(_onDotCounterEmpty.bind(this))

    // Add a new sheet styling depending on the type of sheet
    const groupType = this.actor.system.groupType
    if (groupType === 'coterie') {
      html.removeClass('hunter werewolf mortal')
      html.addClass('vampire')
    } else if (groupType === 'cell') {
      html.removeClass('vampire werewolf mortal')
      html.addClass('hunter')
    } else if (groupType === 'pack') {
      html.removeClass('hunter vampire mortal')
      html.addClass('werewolf')
    } else {
      // Default to mortal styling
      html.removeClass('hunter vampire werewolf')
      html.addClass('mortal')
    }

    // Drag and drop functionality
    this.#dragDrop.forEach((d) => d.bind(this.element))
  }

  #createDragDropHandlers () {
    return this.options.dragDrop.map((d) => {
      d.permissions = {
        dragstart: this._canDragStart.bind(this),
        drop: this._canDragDrop.bind(this)
      }

      d.callbacks = {
        dragstart: this._onDragStart.bind(this),
        dragover: this._onDragOver.bind(this),
        drop: this._onDrop.bind(this)
      }
      return new DragDrop(d)
    })
  }

  #dragDrop

  _canDragStart () {
    return this.isEditable
  }

  _canDragDrop () {
    return this.isEditable
  }

  _onDragStart (event) {
    const dataset = event.target.dataset
    if ('link' in dataset) return

    // Extract the data you need
    const dragData = {
      type: dataset.type,
      uuid: dataset.documentUuid
    }

    if (!dragData) return

    // Set data transfer
    event.dataTransfer.setData('text/plain', JSON.stringify(dragData))
  }

  _onDragOver () {}

  async _onDrop (event) {
    const data = TextEditor.getDragEventData(event)

    // Handle different data types
    switch (data.type) {
      case 'Item':
        return this._onDropItem(event, data)
      case 'Actor':
        return _addActor(this.actor, data.uuid)
    }
  }

  async _onDropItem (event, data) {
    if (!this.actor.isOwner) return false
    const actorType = this.actor.type
    const item = await Item.implementation.fromDropData(data)
    const itemData = item.toObject()
    const itemType = itemData.type
    const itemsList = ItemTypes.getList({})

    // Check whether we should allow this item type to be placed on this actor type
    if (itemsList[itemType]) {
      const whitelist = itemsList[itemType].restrictedActorTypes
      const blacklist = itemsList[itemType].excludedActorTypes

      // If the whitelist contains any entries, we can check to make sure this actor type is allowed for the item
      if (!foundry.utils.isEmpty(whitelist) && whitelist.indexOf(actorType) === -1) {
        ui.notifications.warn(game.i18n.format('WOD5E.ItemsList.ItemCannotBeDroppedOnActor', {
          string1: itemType,
          string2: actorType
        }))

        return false
      }

      // If the blacklist contains any entries, we can check to make sure this actor type isn't disallowed for the item
      if (!foundry.utils.isEmpty(blacklist) && blacklist.indexOf(actorType) > -1) {
        ui.notifications.warn(game.i18n.format('WOD5E.ItemsList.ItemCannotBeDroppedOnActor', {
          string1: itemType,
          string2: actorType
        }))

        return false
      }
    }

    // Handle item sorting within the same Actor
    if (this.actor.uuid === item.parent?.uuid) return this._onSortItem(event, itemData)

    // Create the owned item
    return this._onDropItemCreate(itemData, event)
  }

  async _onDropItemCreate (itemData) {
    itemData = itemData instanceof Array ? itemData : [itemData]
    return this.actor.createEmbeddedDocuments('Item', itemData)
  }

  _onSortItem (event, itemData) {
    // Get the drag source and drop target
    const items = this.actor.items
    const source = items.get(itemData._id)
    const dropTarget = event.target.closest('[data-item-id]')
    if (!dropTarget) return
    const target = items.get(dropTarget.dataset.itemId)

    // Don't sort on yourself
    if (source.id === target.id) return

    // Identify sibling items based on adjacent HTML elements
    const siblings = []
    for (const el of dropTarget.parentElement.children) {
      const siblingId = el.dataset.itemId
      if (siblingId && (siblingId !== source.id)) siblings.push(items.get(el.dataset.itemId))
    }

    // Perform the sort
    const sortUpdates = SortingHelpers.performIntegerSort(source, {
      target,
      siblings
    })

    const updateData = sortUpdates.map(u => {
      const update = u.update
      update._id = u.target._id
      return update
    })

    // Perform the update
    return this.actor.updateEmbeddedDocuments('Item', updateData)
  }
}
