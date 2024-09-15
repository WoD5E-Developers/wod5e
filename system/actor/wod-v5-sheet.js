/* global game, TextEditor, foundry, DragDrop, fromUuidSync */

// Data preparation functions
import { getActorHeader } from './scripts/get-actor-header.js'
import { getActorTypes } from './scripts/get-actor-types.js'
// Roll function
import { _onRoll } from './scripts/roll.js'
// Resource functions
import { _onResourceChange, _setupDotCounters, _setupSquareCounters, _onDotCounterChange, _onDotCounterEmpty, _onSquareCounterChange } from './scripts/counters.js'
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
      resizeable: true
    },
    classes: ['wod5e', 'actor', 'sheet'],
    position: {
      width: 1000,
      height: 700
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
    const controls = super._getHeaderControls()

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

    // Shortcut to the actor headers
    const actorHeaders = actorData.headers

    // Transform any data needed for sheet rendering
    return {
      ...data,

      name: actor.name,
      img: actor.img,

      health: actorData.health,
      willpower: actorData.willpower,

      settings: actorData.settings,

      gamesystem: actorData.gamesystem,
      isOwner: actor.isOwner,
      locked: actorData.locked,
      isCharacter: this.isCharacter,
      hasBoons: this.hasBoons,

      features: actorData.features,

      displayBanner: game.settings.get('vtm5e', 'actorBanner'),

      headerbg: await getActorHeader(actor),

      currentActorType: actorTypeData.currentActorType,
      actorTypePath: actorTypeData.typePath,
      actorOptions: actorTypeData.types,

      equipment: await TextEditor.enrichHTML(actorData.equipment),
      bane: await TextEditor.enrichHTML(actorHeaders.bane),
      creedfields: await TextEditor.enrichHTML(actorHeaders.creedfields)
    }
  }

  async prepareItems (sheetData) {
    // Custom rolls
    sheetData.system.customRolls = sheetData.items.filter(item => 
      item.type === 'customRoll'
    )

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
  }

  static async onSubmitActorForm (event, form, formData) {
    // Process submit data
    const submitData = this._prepareSubmitData(event, form, formData)

    // Overrides
    const overrides = foundry.utils.flattenObject(this.actor.overrides)
    for (let k of Object.keys(overrides)) delete submitData[k]

    // Update the actor data
    await this.actor.update(submitData, {
      render: false
    })

    // Re-render the core parts of the sheet and the current tab
    const currentTab = $(form).find('section.tab.active')[0].getAttribute('data-application-part')

    this.render(false, {
      parts: ['header', 'tabs', 'banner', currentTab]
    })
  }

  _onRender () {
    const html = $(this.element)

    // Update the window title (since ActorSheetV2 doesn't do it automatically)
    $(this.window.title).text(this.title)

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
    if ('link' in event.target.dataset) return

    // Extract the data you need
    let dragData = null

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
        // Create the embedded item from the origin item data
        await this.actor.createEmbeddedDocuments('Item', [
          fromUuidSync(data.uuid)
        ])
        break
    }
  }
}
