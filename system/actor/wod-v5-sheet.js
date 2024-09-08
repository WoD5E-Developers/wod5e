/* global DEFAULT_TOKEN, game, TextEditor, WOD5E, foundry */

const { HandlebarsApplicationMixin } = foundry.applications.api

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

/**
 * Extend the base ActorSheetV2 document
 * @extends {foundry.applications.sheets.ActorSheetV2}
 */
export class WoDActor extends HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2) {
  get title() {
    return this.actor.isToken ? `[Token] ${this.actor.name}` : this.actor.name
  }

  constructor(options = {}) {
    super(options)
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
    }
  }

  _getHeaderControls() {
    const controls = super._getHeaderControls()

    return controls
  }

  tabGroups = {
    primary: 'stats'
  }

  tabs = {}

  getTabs() {
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

    // Actor types that can be swapped to and daa prep for it
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
    const features = {
      background: [],
      merit: [],
      flaw: [],
      boon: []
    }

    // Initialize containers.
    const customRolls = []
    const equipment = []

    // Iterate through items, allocating to containers
    for (const i of sheetData.items) {
      i.img = i.img || DEFAULT_TOKEN

      // Sort the item into its appropriate place
      if (i.type === 'equipment') {
        // Append to equipment
        equipment[i.system.equipmentType].push(i)
      } else if (i.type === 'feature') {
        // Check the featuretype field and set a default
        const featuretype = i.system.featuretype in WOD5E.Features.getList({}) ? i.system.featuretype : 'background'

        // Append to features
        features[featuretype].push(i)
      } else if (i.type === 'customRoll') {
        // Append to custom rolls
        customRolls.push(i)
      }
    }

    // Assign items to their containers in the actor data
    sheetData.system.customRolls = customRolls
    sheetData.system.equipment = equipment
    sheetData.system.features = features
  }

  static async onSubmitActorForm(event, form, formData) {
    // Process submit data
    const submitData = this._prepareSubmitData(event, form, formData)

    // Overrides
    const overrides = foundry.utils.flattenObject(this.actor.overrides)
    for (let k of Object.keys(overrides)) delete submitData[k]

    // Update the actor data
    await this.actor.update(submitData)
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
  }
}
