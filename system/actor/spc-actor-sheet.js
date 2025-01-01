/* global foundry */

// Preparation functions
import { prepareBiographyContext, prepareFeaturesContext, prepareEquipmentContext, prepareNotepadContext, prepareSettingsContext, prepareLimitedContext, prepareSpcStatsContext } from './scripts/prepare-partials.js'
// Various button functions
import { _onEditExceptionalPools } from './scripts/exceptional-dicepools.js'
import { _onCreatePower, _onDeletePower } from './scripts/spc-powers.js'
import { _onHaranoRoll, _onHaugloskRoll } from './wta/scripts/balance.js'
// Base actor sheet to extend from
import { WoDActor } from './wod-actor-base.js'
// Mixin
const { HandlebarsApplicationMixin } = foundry.applications.api

/**
 * Extend the WoDActor document
 * @extends {WoDActor}
 */
export class SPCActorSheet extends HandlebarsApplicationMixin(WoDActor) {
  static DEFAULT_OPTIONS = {
    classes: ['wod5e', 'actor', 'spc', 'sheet'],
    actions: {
      createSPCPower: _onCreatePower,
      deleteSPCPower: _onDeletePower,
      editExceptionalPools: _onEditExceptionalPools,
      haranoRoll: _onHaranoRoll,
      haugloskRoll: _onHaugloskRoll
    }
  }

  static PARTS = {
    header: {
      template: 'systems/vtm5ec/display/shared/actors/spc-sheet.hbs'
    },
    tabs: {
      template: 'systems/vtm5ec/display/shared/actors/parts/tab-navigation.hbs'
    },
    stats: {
      template: 'systems/vtm5ec/display/shared/actors/parts/spc/stats.hbs'
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

    // Push the current gamesystem as a class
    this.options.classes.push(actorData.gamesystem)

    if (data.gamesystem === 'vampire') {
      data.humanity = actorData.humanity
      data.hunger = actorData.hunger
      data.bloodpotency = Math.min(Math.max(actorData.blood.potency, 0), 10) // make sure Blood Potency doesn't go over 10 or under 0
    }

    if (data.currentActorType === 'werewolf') {
      data.rage = actorData.rage
      data.lostTheWolf = data.rage.value === 0
    }

    if (data.currentActorType === 'spirit') {
      data.power = actorData.power
    }

    // If an actor type shouldn't have advanced dice, hold that status in noAdvancedDice
    if (data.currentActorType === 'ghoul' || data.currentActorType === 'spirit') {
      data.noAdvancedDice = true
    }

    data.generalDifficultyEnabled = actorData.settings.generalDifficultyEnabled
    data.generaldifficulty = {
      strongest: actorData.generaldifficulty.strongest || 0,
      normal: actorData.generaldifficulty.normal || 0
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
        return prepareSpcStatsContext(context, actor)

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

  _onRender () {
    super._onRender()
    const html = $(this.element)

    // Add a new sheet styling depending on the type of sheet
    const gamesystem = this.actor.system.gamesystem
    if (gamesystem === 'vampire') {
      html.removeClass('hunter werewolf mortal')
      html.addClass('vampire')
    } else if (gamesystem === 'hunter') {
      html.removeClass('vampire werewolf mortal')
      html.addClass('hunter')
    } else if (gamesystem === 'werewolf') {
      html.removeClass('hunter vampire mortal')
      html.addClass('werewolf')
    } else {
      // Default to a mortal sheet
      html.removeClass('hunter vampire werewolf')
      html.addClass('mortal')
    }
  }
}
