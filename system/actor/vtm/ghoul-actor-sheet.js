/* global game, foundry, renderTemplate, ChatMessage, TextEditor, WOD5E, Dialog */

import { MortalActorSheet } from '../mortal-actor-sheet.js'
import { Disciplines } from '../../api/def/disciplines.js'

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

    // Prepare discipline data
    data.actor.system.disciplines = await this._prepareDisciplineData(data)

    return data
  }

  /** Prepare item data for the Ghoul/Vampire actor */
  async _prepareItems (sheetData) {
    // Prepare items
    super._prepareItems(sheetData)

    // Top-level variables
    const actor = this.actor

    // Secondary variables
    const disciplinesList = Disciplines.getList({})
    const disciplines = actor.system?.disciplines

    // Clean up non-existent disciplines, such as custom ones that no longer exist
    const validDisciplines = new Set(Object.keys(disciplinesList))
    for (const id of Object.keys(disciplines)) {
      if (!validDisciplines.has(id)) {
        delete disciplines[id]
      }
    }

    for (const [id, value] of Object.entries(disciplinesList)) {
      let disciplineData = {}

      // If the actor has a discipline with the key, grab its current values
      if (Object.prototype.hasOwnProperty.call(disciplines, id)) {
        disciplineData = Object.assign({
          value: disciplines[id].value,
          powers: [],
          description: disciplines[id].description,
          visible: disciplines[id].visible
        }, value)
      } else { // Otherwise, add it to the actor and set it as some default data
        await actor.update({
          [`system.disciplines.${id}`]: {
            value: 0,
            visible: false,
            description: '',
            powers: []
          }
        })

        disciplineData = Object.assign({
          value: 0,
          visible: false,
          description: '',
          powers: []
        }, value)
      }

      // Ensure the discipline exists
      if (!disciplines[id]) disciplines[id] = {}
      // Apply the discipline's data
      disciplines[id] = disciplineData

      // Make it forced invisible if it's set to hidden
      if (disciplineData.hidden) {
        disciplines[id].visible = false
      }

      // Localize the discipline name
      disciplines[id].label = WOD5E.api.generateLabelAndLocalize({ string: id, type: 'discipline' })

      // Wipe old discipline powers so they doesn't duplicate
      disciplines[id].powers = []
    }

    // Iterate through items, allocating to containers
    for (const i of sheetData.items) {
      // Make sure the item is a power and has a discipline
      if (i.type === 'power') {
        // Append to disciplines list
        disciplines[i.system.discipline].powers.push(i)
      }
    }
  }

  // Handle discipline data so we can display it on the actor sheet
  async _prepareDisciplineData (sheetData) {
    const disciplines = sheetData.actor.system.disciplines

    for (const disciplineType in disciplines) {
      if (disciplines[disciplineType].powers.length > 0) {
        // If there are any discipline powers in the list, make them visible
        if (!disciplines[disciplineType].visible && !disciplines[disciplineType].hidden) disciplines[disciplineType].visible = true

        // Sort the discipline containers by the level of the power instead of by creation date
        disciplines[disciplineType].powers = disciplines[disciplineType].powers.sort(function (power1, power2) {
          // If the levels are the same, sort alphabetically instead
          if (power1.system.level === power2.system.level) {
            return power1.name.localeCompare(power2.name)
          }

          // Sort by level
          return power1.system.level - power2.system.level
        })
      }

      // Enrich discipline description
      disciplines[disciplineType].enrichedDescription = await TextEditor.enrichHTML(disciplines[disciplineType].description)
    }

    return disciplines
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
