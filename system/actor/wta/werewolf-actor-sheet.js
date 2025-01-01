/* global foundry */

// Preparation functions
import { prepareBiographyContext, prepareExperienceContext, prepareFeaturesContext, prepareEquipmentContext, prepareNotepadContext, prepareSettingsContext, prepareStatsContext, prepareLimitedContext } from '../scripts/prepare-partials.js'
import { prepareGiftsContext, prepareWolfContext } from './scripts/prepare-partials.js'
// Various button functions
import { _onAddGift, _onRemoveGift, _onGiftToChat, _onSelectGift, _onSelectGiftPower } from './scripts/gifts.js'
import { _onFormEdit, _onFormToChat, _onShiftForm, _onLostTheWolf } from './scripts/forms.js'
import { _onBeginFrenzy, _onEndFrenzy } from './scripts/frenzy.js'
import { _onHaranoRoll, _onHaugloskRoll } from './scripts/balance.js'
import { _damageWillpower } from '../../scripts/rolls/willpower-damage.js'
// Base actor sheet to extend from
import { WoDActor } from '../wod-actor-base.js'
// Mixin
const { HandlebarsApplicationMixin } = foundry.applications.api

/**
 * Extend the WoDActor document
 * @extends {WoDActor}
 */
export class WerewolfActorSheet extends HandlebarsApplicationMixin(WoDActor) {
  static DEFAULT_OPTIONS = {
    classes: ['wod5e', 'actor', 'sheet', 'werewolf'],
    actions: {
      addGift: _onAddGift,
      removeGift: _onRemoveGift,
      giftChat: _onGiftToChat,
      shiftForm: _onShiftForm,
      formChat: _onFormToChat,
      editForm: _onFormEdit,
      beginFrenzy: _onBeginFrenzy,
      endFrenzy: _onEndFrenzy,
      haranoRoll: _onHaranoRoll,
      haugloskRoll: _onHaugloskRoll,
      selectGift: _onSelectGift,
      selectGiftPower: _onSelectGiftPower,
      damageWillpower: _damageWillpower
    }
  }

  static PARTS = {
    header: {
      template: 'systems/vtm5ec/display/wta/actors/werewolf-sheet.hbs'
    },
    tabs: {
      template: 'systems/vtm5ec/display/shared/actors/parts/tab-navigation.hbs'
    },
    stats: {
      template: 'systems/vtm5ec/display/shared/actors/parts/stats.hbs'
    },
    experience: {
      template: 'systems/vtm5ec/display/shared/actors/parts/experience.hbs'
    },
    gifts: {
      template: 'systems/vtm5ec/display/wta/actors/parts/gifts-rites.hbs'
    },
    wolf: {
      template: 'systems/vtm5ec/display/wta/actors/parts/wolf.hbs'
    },
    features: {
      template: 'systems/vtm5ec/display/wta/actors/parts/features.hbs'
    },
    equipment: {
      template: 'systems/vtm5ec/display/shared/actors/parts/equipment.hbs'
    },
    biography: {
      template: 'systems/vtm5ec/display/shared/actors/parts/biography.hbs'
    },
    notepad: {
      template: 'systems/vtm5ec/display/shared/actors/parts/notepad.hbs'
    },
    settings: {
      template: 'systems/vtm5ec/display/shared/actors/parts/actor-settings.hbs'
    },
    banner: {
      template: 'systems/vtm5ec/display/shared/actors/parts/type-banner.hbs'
    },
    limited: {
      template: 'systems/vtm5ec/display/shared/actors/limited-sheet.hbs'
    }
  }

  tabs = {
    stats: {
      id: 'stats',
      group: 'primary',
      title: 'WOD5E.Tabs.Stats',
      icon: '<i class="fa-regular fa-chart-line"></i>'
    },
    experience: {
      id: 'experience',
      group: 'primary',
      title: 'WOD5E.Tabs.Experience',
      icon: '<i class="fa-solid fa-file-contract"></i>'
    },
    gifts: {
      id: 'gifts',
      group: 'primary',
      title: 'WOD5E.WTA.GiftsAndRenown',
      icon: '<span class="wod5e-symbol">h</span>'
    },
    wolf: {
      id: 'wolf',
      group: 'primary',
      title: 'WOD5E.WTA.Wolf',
      icon: '<i class="fa-brands fa-wolf-pack-battalion"></i>'
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
    biography: {
      id: 'biography',
      group: 'primary',
      title: 'WOD5E.Tabs.Biography',
      icon: '<i class="fas fa-id-card"></i>'
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

  async _prepareContext () {
    // Top-level variables
    const data = await super._prepareContext()
    const actor = this.actor
    const actorData = actor.system

    // Filters for item-specific data
    const tribeFilter = actor.items.filter(item => item.type === 'tribe')
    const auspiceFilter = actor.items.filter(item => item.type === 'auspice')

    // Prepare werewolf-specific items
    data.tribe = tribeFilter[0]
    data.auspice = auspiceFilter[0]
    data.rage = actorData.rage
    data.frenzyActive = actorData.frenzyActive
    data.lostTheWolf = data.rage.value === 0
    data.crinosHealth = actorData.crinosHealth
    data.activeForm = actorData.activeForm

    // Check if the actor has lost the wolf and they're in a supernatural form
    // If so, trigger onLostTheWolf and prompt a shift down
    const supernaturalForms = ['glabro', 'crinos', 'hispo']
    if (data.lostTheWolf && (supernaturalForms.indexOf(actorData.activeForm) > -1) && !actorData.formOverride) {
      await _onLostTheWolf(actor)
    }

    return data
  }

  async _preparePartContext (partId, context, options) {
    // Inherit any preparation from the extended class
    context = { ...(await super._preparePartContext(partId, context, options)) }

    // Top-level variables
    const actor = this.actor

    // Prepare each page context
    switch (partId) {
      // Stats
      case 'stats':
        return prepareStatsContext(context, actor)

      // Experience
      case 'experience':
        return prepareExperienceContext(context, actor)

      // Gifts
      case 'gifts':
        return prepareGiftsContext(context, actor)

      // Wolf
      case 'wolf':
        return prepareWolfContext(context, actor)

      // Features
      case 'features':
        return prepareFeaturesContext(context, actor)

      // Equipment
      case 'equipment':
        return prepareEquipmentContext(context, actor)

      // Biography
      case 'biography':
        return prepareBiographyContext(context, actor)

      // Notepad
      case 'notepad':
        return prepareNotepadContext(context, actor)

      // Settings
      case 'settings':
        return prepareSettingsContext(context, actor)

      // Limited view
      case 'limited':
        return prepareLimitedContext(context, actor)
    }

    return context
  }
}
