/* global game, TextEditor, foundry, DragDrop, Item, SortingHelpers, ui */

// Data preparation functions
import { getActorHeader } from './scripts/get-actor-header.js'
import { getActorBackground } from './scripts/get-actor-background.js'
import { getActorTypes } from './scripts/get-actor-types.js'
// Definition file
import { ItemTypes } from '../api/def/itemtypes.js'
// Roll function
import { _onRoll } from './scripts/roll.js'
// Resource functions
import { _onResourceChange, _setupDotCounters, _setupSquareCounters, _onDotCounterChange, _onDotCounterEmpty, _onSquareCounterChange, _onRemoveSquareCounter } from './scripts/counters.js'
// Various button functions
import { _onRollItem } from './scripts/item-roll.js'
import { _onEditImage } from './scripts/on-edit-image.js'
import { _onToggleLock } from './scripts/on-toggle-lock.js'
import { _onEditSkill } from './scripts/on-edit-skill.js'
import { _onAddExperience, _onRemoveExperience, _onEditExperience } from './scripts/experience.js'
import { _onCreateItem, _onItemChat, _onItemEdit, _onItemDelete } from './scripts/item-actions.js'
import { _onWillpowerRoll } from './scripts/on-willpower-roll.js'
import { _onToggleCollapse } from './scripts/on-toggle-collapse.js'
import { _onToggleLimited } from './scripts/on-toggle-limited.js'
import { _onRestoreItemUses, _onExpendItemUse } from './scripts/item-uses.js'
// Mixin
const { HandlebarsApplicationMixin } = foundry.applications.api

/**
 * Extend the base ActorSheetV2 document
 * @extends {foundry.applications.sheets.ActorSheetV2}
 */
export class WoDActor extends HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2) {
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
      handler: WoDActor.onSubmitActorForm
    },
    window: {
      icon: 'fa-solid fa-dice-d10',
      resizable: true
    },
    classes: ['wod5e', 'actor', 'sheet'],
    position: {
      width: 1000,
      height: 800
    },
    actions: {
      // Rollable actions
      roll: _onRoll,
      willpowerRoll: _onWillpowerRoll,

      // Item actions
      createItem: _onCreateItem,
      rollItem: _onRollItem,
      itemChat: _onItemChat,
      itemEdit: _onItemEdit,
      itemDelete: _onItemDelete,
      expendItemUse: _onExpendItemUse,
      restoreItemUses: _onRestoreItemUses,

      // Various other sheet functions
      editImage: _onEditImage,
      editSkill: _onEditSkill,
      toggleLock: _onToggleLock,
      toggleLimited: _onToggleLimited,
      toggleCollapse: _onToggleCollapse,
      addExperience: _onAddExperience,
      removeExperience: _onRemoveExperience,
      editExperience: _onEditExperience
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

  tabGroups = {
    primary: 'stats'
  }

  tabs = {}

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

    // Determine whether we show legacy XP depending on if the legacy values are filled or not
    const showLegacyXP = actorData.exp ? (Number(actorData.exp.value) || Number(actorData.exp.max)) : false

    // Transform any data needed for sheet rendering
    return {
      ...data,

      name: actor.name,
      img: actor.img,

      health: actorData.health,
      willpower: actorData.willpower,

      settings: actorData.settings,

      hasSkillAttributeData: actorData.hasSkillAttributeData,
      gamesystem: actorData.gamesystem,
      isOwner: actor.isOwner,
      locked: actorData.locked,
      showLegacyXP,

      features: actorData.features,

      displayBanner: game.settings.get('vtm5e', 'actorBanner'),

      headerbg: await getActorHeader(actor),
      actorbg: actor.system?.settings?.background,

      baseActorType: actorTypeData.baseActorType,
      currentActorType: actorTypeData.currentActorType,
      currentTypeLabel: actorTypeData.currentTypeLabel,
      actorTypePath: actorTypeData.typePath,
      actorOptions: actorTypeData.types
    }
  }

  async prepareItems (sheetData) {
    // Make an array to store item-based modifiers
    sheetData.system.itemModifiers = []

    // Do data manipulation we need to do for ALL items here
    sheetData.items.forEach(async (item) => {
      // Enrich item descriptions
      if (item.system?.description) {
        item.system.enrichedDescription = await TextEditor.enrichHTML(item.system.description)
      }

      // Calculate item modifiers and shuffle them into system.itemModifiers
      if (!foundry.utils.isEmpty(item.system.bonuses) && !item?.system?.suppressed) {
        sheetData.system.itemModifiers = sheetData.system.itemModifiers.concat(item.system.bonuses)
      }
    })

    // Custom rolls
    sheetData.system.customRolls = sheetData.items.filter(item =>
      item.type === 'customRoll'
    ).sort(function (roll1, roll2) {
      return roll1.sort - roll2.sort
    })

    // Conditions
    sheetData.system.conditions = sheetData.items.filter(item =>
      item.type === 'condition'
    ).sort(function (roll1, roll2) {
      return roll1.sort - roll2.sort
    })

    // Traits
    sheetData.system.traits = sheetData.items.filter(item =>
      item.type === 'trait'
    ).sort(function (roll1, roll2) {
      return roll1.sort - roll2.sort
    })

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

    // Remove Boons if we have no boons and the actor isn't a vampire
    if (sheetData.system.features.boon.length === 0 && sheetData.system.gamesystem !== 'vampire') delete sheetData.system.features.boon

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
    if (sheetData.system.equipmentItems.talisman.length === 0 && sheetData.system.gamesystem !== 'werewolf') delete sheetData.system.equipmentItems.talisman
  }

  static async onSubmitActorForm (event, form, formData) {
    const target = event.target
    if (target.tagName === 'INPUT') {
      let value

      // Handle numbers and strings properly
      if (target.type === 'number') {
        value = parseInt(target.value)
      } else if (target.type === 'checkbox') {
        value = target.checked
      } else {
        value = target.value
      }

      // Make the update for the field
      this.actor.update({
        [`${target.name}`]: value
      })
    } else {
      // Process submit data
      const submitData = this._prepareSubmitData(event, form, formData)

      // Overrides
      const overrides = foundry.utils.flattenObject(this.actor.overrides)
      for (const k of Object.keys(overrides)) delete submitData[k]

      const submitDataFlat = foundry.utils.flattenObject(submitData)
      const updatedData = {
        [target.name]: submitDataFlat[target.name]
      }
      const expandedData = foundry.utils.expandObject(updatedData)

      // Update the actor data
      await this.actor.update(expandedData)
    }
  }

  _configureRenderOptions (options) {
    super._configureRenderOptions(options)

    // If the document is in limited view, only show the limited view;
    // otherwise, don't include the limited part
    if (this.document.limited) {
      options.parts = ['limited']
    } else {
      options.parts = options.parts.filter(item => item !== 'limited')
    }
  }

  _preRender () {
    this._saveScrollPositions()
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
    html.find('.resource-counter.editable .resource-counter-step').on('contextmenu', _onRemoveSquareCounter.bind(this))
    html.find('.resource-plus').click(_onResourceChange.bind(this))
    html.find('.resource-minus').click(_onResourceChange.bind(this))

    // Activate the setup for the counters
    _setupDotCounters(html)
    _setupSquareCounters(html)

    // Resource dots
    html.find('.resource-value .resource-value-step').click(_onDotCounterChange.bind(this))
    html.find('.resource-value .resource-value-empty').click(_onDotCounterEmpty.bind(this))

    // Drag and drop functionality
    this.#dragDrop.forEach((d) => d.bind(this.element))

    this._restoreScrollPositions()
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

      // Handle limiting only a single type of an item to an actor
      if (itemsList[itemType].limitOnePerActor) {
        // Delete all other types of this item on the actor
        const duplicateItemTypeInstances = this.actor.items.filter(item => item.type === itemType).map(item => item.id)
        this.actor.deleteEmbeddedDocuments('Item', duplicateItemTypeInstances)
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

  // Save the current scroll position
  async _saveScrollPositions () {
    const activeList = this.findActiveList()

    if (activeList.length) {
      this._scroll = activeList.scrollTop()
    }
  }

  // Restore the saved scroll position
  async _restoreScrollPositions () {
    const activeList = this.findActiveList()

    if (activeList.length && this._scroll != null) {
      activeList.scrollTop(this._scroll)
    }
  }

  // Get the scroll area of the currently active tab
  findActiveList () {
    const activeList = $(this.element).find('section.tab.active')

    return activeList
  }
}
