/* global game, foundry */

import { WOD5eDice } from '../scripts/system-rolls.js'
import { getActiveBonuses } from '../scripts/rolls/situational-modifiers.js'
import { WoDActor } from './wod-v5-sheet.js'

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {WodActor}
 */

export class ChangelingActorSheet extends WoDActor {
    /** @override */
    static get defaultOptions () {
        const classList = ['wod5e', 'changeling-sheet', 'sheet', 'actor', 'changeling']

        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: classList,
            template: 'systems/vtm5ec/templates/actor/changeling-sheet.hbs',
            width: 940,
            height: 700,
            tabs: [{
              navSelector: '.sheet-tabs',
              contentSelector: '.sheet-body',
              initial: 'stats'
            }]
        })
    }

    constructor (actor, options) {
        super(actor, options)
        this.isCharacter = true
    }

    /** @override */
    get template () {
      if (!game.user.isGM && this.actor.limited) return 'systems/vtm5ec/templates/actor/limited-sheet.hbs'
      return 'systems/vtm5ec/templates/actor/changeling-sheet.hbs'
    }

    /* -------------------------------------------- */
  
    /** @override */
    async getData () {
      const data = await super.getData()
  
      this._prepareItems(data)
  
      return data
    }

    /**
     * Organize and classify Arts and Realms for Changeling sheets.
     * 
     * @param {Object} actorData The actor to prepare.
     * @return {undefined}
     * @override
     */
    async _prepareItems (sheetData) {
        super._prepareItems(sheetData)

        // Top-level variables
        const actorData = sheetData.actor
        const actor = this.actor

        // Variables yet to be defined
        const arts = { 
            autumn: [], 
            chicanery: [], 
            chronos: [], 
            contract: [], 
            dragonsIre: [], 
            legerdemain: [], 
            metamorphosis: [], 
            naming: [],
            oneiromancy: [], 
            primal: [], 
            pyretics: [], 
            skycraft: [], 
            soothsay: [], 
            sovereign: [], 
            spring: [], 
            summer: [],
            wayfare: [],
            winter: []
        }

        const realms = { 
            actor: [], 
            nature: [], 
            prop: [], 
            scene: [], 
            time: []
        }

        for (const i of sheetData.items) {
            if (i.type === "power" && i.system.art) {
                arts[i.system.art].push(i)

                if (!actor.system.arts[i.system.art].visible) {
                    actor.update({ [`system.arts.${i.system.art}.visible`]: true })
                }
            } else if (i.type === "power" && i.system.realm) {
                arts[i.system.art].push(i)

                if (!actor.system.arts[i.system.art].visible) {
                    actor.update({ [`system.arts.${i.system.art}.visible`]: true })
                }
            }
        }

        actorData.system.arts_list = arts
        actorData.system.realms_list = realms
    }

    /* -------------------------------------------- */
  
    /** @override */
    activateListeners (html) {
        // Activate listeners
        super.activateListeners(html)

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return

        // Top-level variables
        const actor = this.actor

        // Make Art hidden
        html.find('.art-delete').click(async ev => {
            const data = $(ev.currentTarget)[0].dataset
            actor.update({ [`system.arts.${data.art}.visible`]: false })
        })

        // Post Art Description to the chat
        html.find('.arts-chat').click(async event => {
            const data = $(event.currentTarget)[0].dataset
            const art = actor.system.arts[data.art]

            renderTemplate('systems/vtm5ec/templates/chat/chat-message.hbs', {
                name: game.i18n.localize(art.name),
                img: 'icons/svg/dice-target.svg',
                description: art.description
            }).then(html => {
                ChatMessage.create({
                    content: html
                })
            })
        })

        // Make Realm hidden
        html.find('.realm-delete').click(async ev => {
            const data = $(ev.currentTarget)[0].dataset
            actor.update({ [`system.realms.${data.realm}.visible`]: false })
        })

        // Post Realm Description to the chat
        html.find('.realms-chat').click(async event => {
            const data = $(event.currentTarget)[0].dataset
            const realm = actor.system.realms[data.realm]

            renderTemplate('systems/vtm5ec/templates/chat/chat-message.hbs', {
                name: game.i18n.localize(realm.name),
                img: 'icons/svg/dice-target.svg',
                description: realm.description
            }).then(html => {
                ChatMessage.create({
                    content: html
                })
            })
        })

        // Roll a Wyrd check for an item
        // TODO!
    }
}