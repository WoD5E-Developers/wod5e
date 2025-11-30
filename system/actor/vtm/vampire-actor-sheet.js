import { prepareDisciplinesContext, prepareBloodContext } from './scripts/prepare-partials.js'
// Various button functions
import {
  _onAddDiscipline,
  _onDisciplineToChat,
  _onRemoveDiscipline,
  _onSelectDiscipline,
  _onSelectDisciplinePower
} from './scripts/disciplines.js'
import { _onFrenzyRoll } from './scripts/frenzy-roll.js'
import { _onEndFrenzy } from './scripts/end-frenzy.js'
import { _onRemorseRoll } from './scripts/roll-remorse.js'
// Base actor sheet to extend from
import { WoDActorBase } from '../wod-actor-base.js'
// Mixin
const { HandlebarsApplicationMixin } = foundry.applications.api

/**
 * Extend the WoDActorBase document
 * @extends {WoDActorBase}
 */
export class VampireActorSheet extends HandlebarsApplicationMixin(WoDActorBase) {
  static DEFAULT_OPTIONS = {
    classes: ['wod5e', 'actor', 'sheet', 'vampire'],
    actions: {
      addDiscipline: _onAddDiscipline,
      removeDiscipline: _onRemoveDiscipline,
      disciplineChat: _onDisciplineToChat,
      selectDiscipline: _onSelectDiscipline,
      selectDisciplinePower: _onSelectDisciplinePower,
      resistFrenzy: _onFrenzyRoll,
      endFrenzy: _onEndFrenzy,
      remorseRoll: _onRemorseRoll
    }
  }

  static PARTS = {
    header: {
      template: 'systems/wod5e/display/vtm/actors/vampire-sheet.hbs'
    },
    tabs: {
      template: 'systems/wod5e/display/shared/actors/parts/tab-navigation.hbs'
    },
    stats: {
      template: 'systems/wod5e/display/shared/actors/parts/stats.hbs'
    },
    experience: {
      template: 'systems/wod5e/display/shared/actors/parts/experience.hbs'
    },
    disciplines: {
      template: 'systems/wod5e/display/vtm/actors/parts/disciplines.hbs'
    },
    blood: {
      template: 'systems/wod5e/display/vtm/actors/parts/blood.hbs'
    },
    features: {
      template: 'systems/wod5e/display/shared/actors/parts/features.hbs'
    },
    equipment: {
      template: 'systems/wod5e/display/shared/actors/parts/equipment.hbs'
    },
    biography: {
      template: 'systems/wod5e/display/shared/actors/parts/biography.hbs'
    },
    notepad: {
      template: 'systems/wod5e/display/shared/actors/parts/notepad.hbs'
    },
    settings: {
      template: 'systems/wod5e/display/shared/actors/parts/actor-settings.hbs'
    },
    banner: {
      template: 'systems/wod5e/display/shared/actors/parts/type-banner.hbs'
    },
    limited: {
      template: 'systems/wod5e/display/shared/actors/limited-sheet.hbs'
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
    disciplines: {
      id: 'disciplines',
      group: 'primary',
      title: 'WOD5E.VTM.Disciplines',
      icon: '<span class="wod5e-symbol">b</span>'
    },
    blood: {
      id: 'blood',
      group: 'primary',
      title: 'WOD5E.VTM.Blood',
      icon: '<i class="fa-solid fa-droplet"></i>'
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

  async _prepareContext() {
    // Top-level variables
    const data = await super._prepareContext()
    const actor = this.actor
    const actorData = actor.system

    // Filters for item-specific data
    const clanFilter = actor.items.filter((item) => item.type === 'clan')

    // Prepare vampire-specific items
    data.domitor = actorData.headers.domitor
    data.humanity = actorData.humanity
    data.hunger = actorData.hunger
    data.clan = clanFilter[0]
    data.frenzyActive = actorData.frenzyActive

    return data
  }

  async _preparePartContext(partId, context, options) {
    // Inherit any preparation from the extended class
    context = { ...(await super._preparePartContext(partId, context, options)) }

    // Top-level variables
    const actor = this.actor

    // Prepare each page context
    switch (partId) {
      // Stats
      case 'stats':
        return this.prepareStatsContext(context, actor)

      // Experience
      case 'experience':
        return this.prepareExperienceContext(context, actor)

      // Disciplines
      case 'disciplines':
        return prepareDisciplinesContext(context, actor)

      // Disciplines
      case 'blood':
        return prepareBloodContext(context, actor)

      // Features
      case 'features':
        return this.prepareFeaturesContext(context, actor)

      // Equipment
      case 'equipment':
        return this.prepareEquipmentContext(context, actor)

      // Biography
      case 'biography':
        return this.prepareBiographyContext(context, actor)

      // Notepad
      case 'notepad':
        return this.prepareNotepadContext(context, actor)

      // Settings
      case 'settings':
        return this.prepareSettingsContext(context, actor)

      // Limited view
      case 'limited':
        return this.prepareLimitedContext(context, actor)
    }

    return context
  }
}
