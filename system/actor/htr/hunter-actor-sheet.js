/* global foundry */

// Preparation functions
import { prepareBiographyContext, prepareExperienceContext, prepareFeaturesContext, prepareEquipmentContext, prepareNotepadContext, prepareSettingsContext, prepareStatsContext, prepareLimitedContext } from '../scripts/prepare-partials.js'
import { prepareEdgesContext } from './scripts/prepare-partials.js'
// Various button functions
import { _onToggleDespair } from './scripts/toggle-despair.js'
import { _onAddEdge, _onRemoveEdge, _onEdgeToChat, _onSelectEdgePerk, _onSelectEdge } from './scripts/edges.js'
// Base actor sheet to extend from
import { WoDActor } from '../wod-actor-base.js'
// Mixin
const { HandlebarsApplicationMixin } = foundry.applications.api

/**
 * Extend the WoDActor document
 * @extends {WoDActor}
 */
export class HunterActorSheet extends HandlebarsApplicationMixin(WoDActor) {
  static DEFAULT_OPTIONS = {
    classes: ['wod5e', 'actor', 'sheet', 'hunter'],
    actions: {
      toggleDespair: _onToggleDespair,
      addEdge: _onAddEdge,
      removeEdge: _onRemoveEdge,
      edgeChat: _onEdgeToChat,
      selectEdge: _onSelectEdge,
      selectEdgePerk: _onSelectEdgePerk
    }
  }

  static PARTS = {
    header: {
      template: 'systems/vtm5ec/display/htr/actors/hunter-sheet.hbs'
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
    edges: {
      template: 'systems/vtm5ec/display/htr/actors/parts/edges.hbs'
    },
    features: {
      template: 'systems/vtm5ec/display/htr/actors/parts/features.hbs'
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
    edges: {
      id: 'edges',
      group: 'primary',
      title: 'WOD5E.HTR.Edges',
      icon: '<span class="wod5e-symbol hunter">e</span>'
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
    const actorHeaders = actorData.headers

    // Filters for item-specific data
    const driveFilter = actor.items.filter(item => item.type === 'drive')
    const creedFilter = actor.items.filter(item => item.type === 'creed')

    // Prepare hunter-specific items
    data.despairActive = actorData.despair.value > 0
    data.cellname = actorHeaders.cellname
    data.drive = driveFilter[0]
    data.creed = creedFilter[0]

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

      // Experience
      case 'edges':
        return prepareEdgesContext(context, actor)

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
