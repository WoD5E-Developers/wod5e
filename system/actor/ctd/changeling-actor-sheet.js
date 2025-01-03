/* global foundry */

// Preparation functions
import { prepareBiographyContext, prepareExperienceContext, prepareFeaturesContext, prepareEquipmentContext, prepareNotepadContext, prepareSettingsContext, prepareStatsContext, prepareLimitedContext } from '../scripts/prepare-partials.js'
import { preparePowersContext } from './scripts/prepare-partials.js'
// Various button functions
import { _onAddArt, _onArtToChat, _onRemoveArt, _onSelectArt, _onSelectArtPower, _onAddRealm, _onRealmToChat, _onRemoveRealm, _onSelectRealm, _onSelectRealmPower } from '../ctd/scripts/powers.js'
import { _onCreativityRoll } from './scripts/roll-creativity.js'
// Base actor sheet to extend from
import { WoDActor } from '../wod-actor-base.js'
// Mixin
const { HandlebarsApplicationMixin } = foundry.applications.api

/**
 * Extend the WoDActor document
 * @extends {WoDActor}
 */
export class ChangelingActorSheet extends HandlebarsApplicationMixin(WoDActor) {
  static DEFAULT_OPTIONS = {
    classes: ['wod5e', 'actor', 'sheet', 'changeling'],
    actions: {
      addArt: _onAddArt,
      removeArt: _onRemoveArt,
      artChat: _onArtToChat,
      selectArt: _onSelectArt,
      selectArtPower: _onSelectArtPower,
      addRealm: _onAddRealm,
      removeRealm: _onRemoveRealm,
      realmChat: _onRealmToChat,
      selectRealm: _onSelectRealm,
      selectRealmPower: _onSelectRealmPower,
      creativityRoll: _onCreativityRoll
    }
  }

  static PARTS = {
    header: {
      template: 'systems/vtm5ec/display/ctd/actors/changeling-sheet.hbs'
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
    powers: {
      template: 'systems/vtm5ec/display/ctd/actors/parts/powers.hbs'
    },
    features: {
      template: 'systems/vtm5ec/display/shared/actors/parts/features.hbs'
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
    powers: {
      id: 'powers',
      group: 'primary',
      title: 'WOD5E.Tabs.Powers',
      icon: '<span class="wod5e-symbol">e</span>'
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
    const kithFilter = actor.items.filter(item => item.type === 'kith')
    const legacyFilter = actor.items.filter(item => item.type === 'legacy')

    // Prepare changeling-specific items
    data.wyrd = actorData.wyrd
    data.nightmare = actorData.nightmare
    data.kith = kithFilter[0]
    data.legacy = legacyFilter[0]

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

      // Powers
      case 'powers':
        return preparePowersContext(context, actor)

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
