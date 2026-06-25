import { prepareSpheresContext, prepareMagickContext } from './scripts/prepare-partials.js'
import {
  _onAddSphere,
  _onSphereToChat,
  _onRemoveSphere,
  _onSelectSphere,
  _onSelectSpherePower
} from './scripts/spheres.js'
import { _onSpendQuintessence } from './scripts/paradox.js'
import { _onAbsorbQuintessence } from './scripts/quintessence.js'
import { WoDActorBase } from '../wod-actor-base.js'

const { HandlebarsApplicationMixin } = foundry.applications.api

/**
 * Mage: the Ascension actor sheet.
 * Extends WoDActorBase exactly as VampireActorSheet and WerewolfActorSheet do.
 */
export class MageActorSheet extends HandlebarsApplicationMixin(WoDActorBase) {
  static DEFAULT_OPTIONS = {
    classes: ['wod5e', 'actor', 'sheet', 'mage'],
    actions: {
      addSphere: _onAddSphere,
      removeSphere: _onRemoveSphere,
      sphereChat: _onSphereToChat,
      selectSphere: _onSelectSphere,
      selectSpherePower: _onSelectSpherePower,
      spendQuintessence: _onSpendQuintessence,
      absorbQuintessence: _onAbsorbQuintessence
    }
  }

  static PARTS = {
    header: {
      template: 'systems/wod5e/display/mta/actors/mage-sheet.hbs'
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
    spheres: {
      template: 'systems/wod5e/display/mta/actors/parts/spheres.hbs'
    },
    magick: {
      template: 'systems/wod5e/display/mta/actors/parts/magick.hbs'
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
    spheres: {
      id: 'spheres',
      group: 'primary',
      title: 'WOD5E.MTA.Spheres',
      icon: '<i class="fa-solid fa-circle-nodes"></i>'
    },
    magick: {
      id: 'magick',
      group: 'primary',
      title: 'WOD5E.MTA.Magick',
      icon: '<i class="fa-solid fa-wand-sparkles"></i>'
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
    const data = await super._prepareContext()
    const actor = this.actor
    const actorData = actor.system

    const traditionFilter = actor.items.filter((item) => item.type === 'tradition')

    data.paradox = actorData.paradox
    data.permanentParadox = actorData.permanentParadox
    data.arete = actorData.arete
    data.quiet = actorData.quiet
    data.hubris = actorData.hubris
    data.tradition = traditionFilter[0]

    // Quintessence per roll exposed for the header display
    const primeSphere = actorData.spheres?.prime?.value ?? 0
    data.quintessencePerRoll = Math.max(1, actorData.arete + primeSphere)

    return data
  }

  async _preparePartContext(partId, context, options) {
    context = { ...(await super._preparePartContext(partId, context, options)) }

    const actor = this.actor

    switch (partId) {
      case 'stats':
        return this.prepareStatsContext(context, actor)

      case 'experience':
        return this.prepareExperienceContext(context, actor)

      case 'spheres':
        return prepareSpheresContext(context, actor)

      case 'magick':
        return prepareMagickContext(context, actor)

      case 'features':
        return this.prepareFeaturesContext(context, actor)

      case 'equipment':
        return this.prepareEquipmentContext(context, actor)

      case 'biography':
        return this.prepareBiographyContext(context, actor)

      case 'notepad':
        return this.prepareNotepadContext(context, actor)

      case 'settings':
        return this.prepareSettingsContext(context, actor)

      case 'limited':
        return this.prepareLimitedContext(context, actor)
    }

    return context
  }
}
