/* global game, Hooks */

import { BaseDefinitionClass } from './base-definition-class.js'

export class Gifts extends BaseDefinitionClass {
  static modsEnabled = true
  static type = 'gifts'
  static defCategory = 'Gifts'

  // Run any necessary compilation on ready
  static onReady () {
    // Handle adding custom disciplines from the game settings
    let customGifts = game.settings.get('vtm5ec', 'customGifts') || {}

    // Handle adding custom disciplines from any active modules
    const activeModules = game.modules.filter(module => module.active === true && module.flags.wod5e)
    activeModules.forEach((module) => {
      if (module.flags.wod5e.customGifts) {
        customGifts = customGifts.concat(module.flags.wod5e.customGifts)
      }
    })

    if (customGifts) {
      Gifts.addCustom(customGifts)
    }

    Gifts.setSortAlphabetically()
    Gifts.initializeLabels()
  }

  static native = {
    label: 'WOD5E.WTA.Native'
  }

  static ragabash = {
    label: 'WOD5E.WTA.Ragabash'
  }

  static theurge = {
    label: 'WOD5E.WTA.Theurge'
  }

  static philodox = {
    label: 'WOD5E.WTA.Philodox'
  }

  static galliard = {
    label: 'WOD5E.WTA.Galliard'
  }

  static ahroun = {
    label: 'WOD5E.WTA.Ahroun'
  }

  static blackfury = {
    label: 'WOD5E.WTA.BlackFury'
  }

  static bonegnawer = {
    label: 'WOD5E.WTA.BoneGnawer'
  }

  static childrenofgaia = {
    label: 'WOD5E.WTA.ChildrenOfGaia'
  }

  static galestalker = {
    label: 'WOD5E.WTA.Galestalker'
  }

  static ghostcouncil = {
    label: 'WOD5E.WTA.GhostCouncil'
  }

  static glasswalker = {
    label: 'WOD5E.WTA.GlassWalker'
  }

  static hartwarden = {
    label: 'WOD5E.WTA.HartWarden'
  }

  static redtalon = {
    label: 'WOD5E.WTA.RedTalon'
  }

  static shadowlord = {
    label: 'WOD5E.WTA.ShadowLord'
  }

  static silentstrider = {
    label: 'WOD5E.WTA.SilentStrider'
  }

  static silverfang = {
    label: 'WOD5E.WTA.SilverFang'
  }

  static rite = {
    label: 'WOD5E.WTA.Rite'
  }
}

// Hook to call onReady when the game is ready
Hooks.once('ready', Gifts.onReady)
