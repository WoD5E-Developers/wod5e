/* global foundry, TextEditor */

const { HandlebarsApplicationMixin } = foundry.applications.api

// Base actor sheet to extend from
import { WoDActor } from './wod-v5-sheet.js'

/**
 * Extend the WoDActor document
 * @extends {WoDActor}
 */
export class MortalActorSheet extends HandlebarsApplicationMixin(WoDActor) {
  static DEFAULT_OPTIONS = {
    classes: ['wod5e', 'actor', 'sheet', 'mortal'],
    actions: {}
  }

  static PARTS = {
    header: {
      template: 'systems/vtm5e/display/shared/actors/mortal-sheet.hbs'
    },
    tabs: {
      template: 'systems/vtm5e/display/shared/actors/parts/tab-navigation.hbs'
    },
    stats: {
      template: 'systems/vtm5e/display/shared/actors/parts/stats.hbs'
    },
    experience: {
      template: 'systems/vtm5e/display/shared/actors/parts/experience.hbs'
    },
    features: {
      template: 'systems/vtm5e/display/shared/actors/parts/features.hbs'
    },
    biography: {
      template: 'systems/vtm5e/display/shared/actors/parts/biography.hbs'
    },
    notepad: {
      template: 'systems/vtm5e/display/shared/actors/parts/notepad.hbs'
    },
    settings: {
      template: 'systems/vtm5e/display/shared/actors/parts/actor-settings.hbs'
    },
    banner: {
      template: 'systems/vtm5e/display/shared/actors/parts/type-banner.hbs'
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
    features: {
      id: 'features',
      group: 'primary',
      title: 'WOD5E.Tabs.Features',
      icon: '<i class="fas fa-gem"></i>'
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

    return data
  }

  async _preparePartContext(partId, context) {
    const actor = this.actor
    const actorData = actor.system
    const actorHeaders = actorData.headers

    switch (partId) {
      // Stats
      case 'stats':
        // Switch tab
        context.tab = context.tabs.stats

        // Part-specific data
        context.sortedAttributes = actorData.sortedAttributes
        context.sortedSkills = actorData.sortedSkills
        context.customRolls = actorData.customRolls

        break

      // Experience
      case 'experience':
        // Tab data
        context.tab = context.tabs.experience

        // Part-specific data
        context.experiences = actorData.experiences
        context.exp = actorData.exp
        context.derivedXP = actorData.derivedXP

        break

      // Features
      case 'features':
        // Tab data
        context.tab = context.tabs.features

        // Part-specific data
        context.features = actorData.features
        context.tenets = actorHeaders.tenets
        context.enrichedTenets = await TextEditor.enrichHTML(actorHeaders.tenets)

        break

      // Biography
      case 'biography':
        // Tab data
        context.tab = context.tabs.biography

        // Part-specific data
        context.bio = actorData.bio
        context.biography = actorData.biography
        context.enrichedBiography =await TextEditor.enrichHTML(actorData.biography)
        context.appearance = actorData.appearance
        context.enrichedAppearance = await TextEditor.enrichHTML(actorData.appearance)
        context.touchstones = actorHeaders.touchstones
        context.enrichedTouchstones = await TextEditor.enrichHTML(actorHeaders.touchstones)

        break

      // Notepad
      case 'notepad':
        // Tab data
        context.tab = context.tabs.notepad

        // Part-specific data
        context.notes = actorData.notes
        context.enrichedNotes = await TextEditor.enrichHTML(actorData.notes)
        context.privatenotes = actorData.privatenotes
        context.enrichedPrivatenotes = await TextEditor.enrichHTML(actorData.privatenotes)

        break

      // Settings
      case 'settings':
        // Tab data
        context.tab = context.tabs.settings

        // Part-specific data
      

        break
    }

    return context
  }

  async _prepareItems (sheetData) {
    await super._prepareItems(sheetData)
  }

  activateListeners (html) {
    // Activate listeners
    super.activateListeners(html)
  }
}
