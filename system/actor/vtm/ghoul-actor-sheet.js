/* global game, foundry, renderTemplate, ChatMessage, WOD5E, Dialog */

import { MortalActorSheet } from '../mortal-actor-sheet.js'
import { prepareDisciplines } from './scripts/prepare-disciplines.js'

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {MortalActorSheet}
 */

export class GhoulActorSheet extends MortalActorSheet {
  /** @override */
  static get defaultOptions () {
    // Define the base list of CSS classes
    const classList = ['ghoul-sheet', 'vampire']
    classList.push(...super.defaultOptions.classes)

    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: classList,
      template: 'systems/vtm5e/display/vtm/actors/ghoul-sheet.hbs'
    })
  }

  /** @override */
  get template () {
    if (!game.user.isGM && this.actor.limited) return 'systems/vtm5e/display/shared/actors/limited-sheet.hbs'
    return 'systems/vtm5e/display/vtm/actors/ghoul-sheet.hbs'
  }

  constructor (actor, options) {
    super(actor, options)
    this.hasBoons = true
  }

  /* -------------------------------------------- */

  /** @override */
  async getData () {
    // Top-level variables
    const data = await super.getData()

    // Prepare items
    await this._prepareItems(data)

    return data
  }

  /** Prepare item data for the Ghoul/Vampire actor */
  async _prepareItems (sheetData) {
    // Prepare items
    await super._prepareItems(sheetData)

    // Top-level variables
    const actor = this.actor
    const actorData = sheetData.actor

    // Prepare discipline data
    actorData.system.disciplines = await prepareDisciplines(actor)

    // Iterate through items, allocating to containers
    for (const i of sheetData.items) {
      // Make sure the item is a power and has a discipline
      if (i.type === 'power') {
        // Append to disciplines list
        actorData.system.disciplines[i.system.discipline].powers.push(i)
      }
    }
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

    // Add a new discipline to the sheet
    html.find('.add-discipline').click(this._onAddDiscipline.bind(this))

    // Make Discipline hidden
    html.find('.discipline-delete').click(async ev => {
      const data = $(ev.currentTarget)[0].dataset
      actor.update({ [`system.disciplines.${data.discipline}.visible`]: false })
    })

    // Post Discipline description to the chat
    html.find('.discipline-chat').click(async event => {
      const data = $(event.currentTarget)[0].dataset
      const discipline = actor.system.disciplines[data.discipline]

      renderTemplate('systems/vtm5e/display/ui/chat/chat-message.hbs', {
        name: game.i18n.localize(discipline.label),
        img: 'icons/svg/dice-target.svg',
        description: discipline.description
      }).then(html => {
        ChatMessage.create({
          content: html
        })
      })
    })
  }

  /** Handle adding a new discipline to the sheet */
  async _onAddDiscipline (event) {
    event.preventDefault()

    // Top-level variables
    const actor = this.actor

    // Secondary variables
    const selectLabel = game.i18n.localize('WOD5E.VTM.SelectDiscipline')
    const itemOptions = WOD5E.Disciplines.getList({})

    // Variables yet to be defined
    let options = []
    let disciplineSelected

    // Prompt a dialog to determine which edge we're adding
    // Build the options for the select dropdown
    for (const [key, value] of Object.entries(itemOptions)) {
      if (!value.hidden) {
        options += `<option value="${key}">${value.displayName}</option>`
      }
    }

    // Template for the dialog form
    const template = `
      <form>
        <div class="form-group">
          <label>${selectLabel}</label>
          <select id="disciplineSelect">${options}</select>
        </div>
      </form>`

    // Define dialog buttons
    const buttons = {
      submit: {
        icon: '<i class="fas fa-check"></i>',
        label: game.i18n.localize('WOD5E.Add'),
        callback: async (html) => {
          disciplineSelected = html.find('#disciplineSelect')[0].value

          // Make the edge visible
          await actor.update({ [`system.disciplines.${disciplineSelected}.visible`]: true })
        }
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: game.i18n.localize('WOD5E.Cancel')
      }
    }

    // Display the dialog
    new Dialog({
      title: game.i18n.localize('WOD5E.Add'),
      content: template,
      buttons,
      default: 'submit'
    }, {
      classes: ['wod5e', 'dialog', 'vampire', 'dialog']
    }).render(true)
  }
}
