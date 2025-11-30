// Actor sheets
import { WoDActor } from './actor/actor.js'
import { WoDActorDirectory } from './ui/wod-actor-directory.js'
import { ProseMirrorSettings } from './ui/prosemirror.js'
// Item sheets
import { WoDItem } from './item/item.js'
import { WoDItemBase } from './item/wod-item-base.js'
// Custom UI Classes
import { WoDChatLog } from './ui/wod-chat-log.js'
import { WoDChatMessage } from './ui/wod-chat-message.js'
import { WoDHotbar } from './ui/wod-hotbar.js'
import { WoDSettings } from './ui/wod-settings.js'
import { WoDPause } from './ui/wod-game-pause.js'
// FVTT and module functionality
import { preloadHandlebarsTemplates } from './scripts/templates.js'
import { loadDiceSoNice } from './dice/dice-so-nice.js'
import { loadHelpers } from './scripts/helpers.js'
import {
  loadSettings,
  _updateHeaderFontPreference,
  _updateXpIconOverrides
} from './scripts/settings.js'
// WOD5E functions and classes
import {
  MortalDie,
  VampireDie,
  VampireHungerDie,
  HunterDie,
  HunterDesperationDie,
  WerewolfDie,
  WerewolfRageDie,
  WOD5eDie
} from './dice/splat-dice.js'
import { migrateWorld } from './scripts/migration.js'
import { wod5eAPI } from './api/wod5e-api.js'
import { WOD5eRoll } from './scripts/system-rolls.js'
// WOD5E Definitions
import { Systems } from './api/def/systems.js'
import { Attributes } from './api/def/attributes.js'
import { Skills } from './api/def/skills.js'
import { Features } from './api/def/features.js'
import { ActorTypes } from './api/def/actortypes.js'
import { ItemTypes } from './api/def/itemtypes.js'
import { Disciplines } from './api/def/disciplines.js'
import { Edges } from './api/def/edges.js'
import { Renown } from './api/def/renown.js'
import { WereForms } from './api/def/were-forms.js'
import { Gifts } from './api/def/gifts.js'
import { _rollItem } from './actor/scripts/item-roll.js'
import { _updateCSSVariable, cssVariablesRecord } from './scripts/update-css-variables.js'
import { _updateToken } from './actor/wta/scripts/forms.js'
import { RollPromptSockets } from './sockets/roll-prompt.js'
import { WoDActorBase } from './actor/wod-actor-base.js'

// Register the WOD5E global
window.WOD5E = {
  api: {
    Roll: wod5eAPI.Roll,
    PromptRoll: wod5eAPI.PromptRoll,
    RollFromDataset: wod5eAPI.RollFromDataset,
    getBasicDice: wod5eAPI.getBasicDice,
    getAdvancedDice: wod5eAPI.getAdvancedDice,
    getFlavorDescription: wod5eAPI.getFlavorDescription,
    generateLabelAndLocalize: wod5eAPI.generateLabelAndLocalize,
    migrateWorld,
    _onRollItemFromMacro
  },
  WoDItemBase,
  WoDActorBase,
  Systems,
  Attributes,
  Skills,
  Features,
  ActorTypes,
  ItemTypes,
  Disciplines,
  Edges,
  Renown,
  Gifts,
  WereForms,
  WOD5eDie
}

// Anything that needs to be ran alongside the initialisation of the world
Hooks.once('init', async function () {
  console.log('World of Darkness 5e | Initializing SchreckNet...')

  // Custom document classes
  CONFIG.Actor.documentClass = WoDActor
  CONFIG.Item.documentClass = WoDItem
  CONFIG.ChatMessage.documentClass = WoDChatMessage
  CONFIG.ChatMessage.template = 'systems/wod5e/display/ui/chat/chat-message-default.hbs'
  // Custom UI implementations
  CONFIG.ui.chat = WoDChatLog
  CONFIG.ui.settings = WoDSettings
  CONFIG.ui.hotbar = WoDHotbar
  CONFIG.ui.actors = WoDActorDirectory
  CONFIG.ui.pause = WoDPause
  // Custom dice rolling functionality
  CONFIG.Dice.rolls = [WOD5eRoll]
  CONFIG.Dice.terms.m = MortalDie
  CONFIG.Dice.terms.v = VampireDie
  CONFIG.Dice.terms.g = VampireHungerDie
  CONFIG.Dice.terms.h = HunterDie
  CONFIG.Dice.terms.s = HunterDesperationDie
  CONFIG.Dice.terms.w = WerewolfDie
  CONFIG.Dice.terms.r = WerewolfRageDie

  // Loop through each entry in the actorTypesList and register their sheet classes
  const actorTypesList = ActorTypes.getList({})
  for (const [, value] of Object.entries(actorTypesList)) {
    const { label, types, sheetClass } = value

    foundry.documents.collections.Actors.registerSheet('wod5e', sheetClass, {
      label,
      types,
      makeDefault: true
    })
  }

  // Register item sheet application classes
  // Loop through each entry in the itemTypesList and register their sheet classes
  const itemTypesList = ItemTypes.getList({})
  for (const [, value] of Object.entries(itemTypesList)) {
    const { label, types, sheetClass } = value

    foundry.documents.collections.Items.registerSheet('wod5e', sheetClass, {
      label,
      types,
      makeDefault: true
    })
  }

  // Make Handlebars templates accessible to the system
  preloadHandlebarsTemplates()

  // Make helpers accessible to the system
  loadHelpers()

  // Load settings into Foundry
  loadSettings()

  // Initialize header font preference on game init
  _updateHeaderFontPreference()

  // Initialize the alterations to any XP icons
  _updateXpIconOverrides()

  // Initialize the alterations to ProseMirror
  ProseMirrorSettings()

  // Sockets to register
  RollPromptSockets()
})

// Anything that needs to run once the world is ready
Hooks.once('ready', async function () {
  // Forced panning is intrinsically annoying: change default to false
  game.settings.settings.get('core.chatBubblesPan').default = false

  // Improve discoverability of map notes
  game.settings.settings.get('core.notesDisplayToggle').default = true

  // Apply the currently selected language as a CSS class so we can
  // modify elements based on locale if needed
  document.body.classList.add(game.settings.get('core', 'language'))

  // Set default presets for JS Color
  jscolor.presets.default = {
    format: 'hexa',
    backgroundColor: '#000',
    palette:
      '#FF2B2B80 #650202 #d84343 #f51f1f #D18125 #cc6d28 #ffb762 #ff8f00 #BE660080 #4e2100 #994101 #e97244'
  }

  // Migration functions
  migrateWorld()

  // Set up any splat colour changes
  const cssVariables = cssVariablesRecord()
  Object.keys(cssVariables).forEach((theme) => {
    const settings = cssVariables[theme].settings

    // Go through all the settings in each theme
    Object.keys(settings).forEach((settingKey) => {
      const { settingId, cssVariable } = settings[settingKey]

      // Get the current value of the setting
      const settingValue = game.settings.get('wod5e', settingId)

      // Update the CSS variable
      _updateCSSVariable(settingId, cssVariable, settingValue)
    })
  })
})

// DiceSoNice functionality
Hooks.once('diceSoNiceReady', (dice3d) => {
  loadDiceSoNice(dice3d)
})

Hooks.on('canvasReady', (canvas) => {
  const tokens = canvas.scene.tokens

  tokens.forEach((token) => {
    if (token?.actor && token?.actor?.type === 'werewolf') {
      const activeForm = token.actor.system.activeForm

      _updateToken(token.actor, activeForm)
    }
  })
})

function _onRollItemFromMacro(itemName) {
  const speaker = ChatMessage.getSpeaker()
  let actor
  if (speaker.token) actor = game.actors.tokens[speaker.token]
  if (!actor) actor = game.actors.get(speaker.actor)
  const item = actor ? actor.items.find((i) => i.name === itemName) : null
  if (!item)
    return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`)

  _rollItem(actor, item)
}
