/* global game, WOD5E, FormApplication, foundry */

/* Definitions */
import { Attributes } from '../../api/def/attributes.js'
import { Skills } from '../../api/def/skills.js'
import { Disciplines } from '../../api/def/disciplines.js'
import { Edges } from '../../api/def/edges.js'
import { Gifts } from '../../api/def/gifts.js'

export class StorytellerMenu extends FormApplication {
  static get defaultOptions () {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: game.i18n.localize('WOD5E.Settings.StorytellerMenu'),
      id: 'wod5e-storyteller',
      classes: ['wod5e'],
      template: 'systems/vtm5e/display/ui/storyteller-menu.hbs',
      width: 500,
      height: 450,
      resizable: true,
      closeOnSubmit: true,
      tabs: [{
        navSelector: '.sheet-tabs',
        contentSelector: 'section',
        initial: 'modifications'
      }]
    })
  }

  constructor (application, options) {
    super(application, options)

    this.listKeys = {
      attribute: {
        newModTitle: game.i18n.format('WOD5E.Settings.NewStringModification', {
          string: game.i18n.localize('WOD5E.AttributesList.Label')
        }),
        defCategory: 'Attributes',
        labelCategory: 'AttributesList',
        defClass: Attributes
      },
      skill: {
        newModTitle: game.i18n.format('WOD5E.Settings.NewStringModification', {
          string: game.i18n.localize('WOD5E.SkillsList.Label')
        }),
        defCategory: 'Skills',
        labelCategory: 'SkillsList',
        defClass: Skills
      },
      discipline: {
        newModTitle: game.i18n.format('WOD5E.Settings.NewStringModification', {
          string: game.i18n.localize('WOD5E.VTM.Discipline')
        }),
        defCategory: 'Disciplines',
        labelCategory: 'DisciplinesList',
        defClass: Disciplines
      },
      edge: {
        newModTitle: game.i18n.format('WOD5E.Settings.NewStringModification', {
          string: game.i18n.localize('WOD5E.HTR.Edge')
        }),
        defCategory: 'Edges',
        labelCategory: 'EdgesList',
        defClass: Edges
      },
      gift: {
        newModTitle: game.i18n.format('WOD5E.Settings.NewStringModification', {
          string: game.i18n.localize('WOD5E.WTA.Gift')
        }),
        defCategory: 'Gifts',
        labelCategory: 'GiftsList',
        defClass: Gifts
      }
    }
  }

  /* -------------------------------------------- */

  /** @override */
  async getData () {
    const data = await super.getData()

    data.attributeTypes = {
      physical: 'WOD5E.SPC.Physical',
      social: 'WOD5E.SPC.Social',
      mental: 'WOD5E.SPC.Mental'
    }

    // Grab the modifications from the game settings and add them to the application data
    data.attributeModifications = game.settings.get('vtm5e', 'modifiedAttributes')
    data.skillModifications = game.settings.get('vtm5e', 'modifiedSkills')
    data.disciplineModifications = game.settings.get('vtm5e', 'modifiedDisciplines')
    data.edgeModifications = game.settings.get('vtm5e', 'modifiedEdges')
    data.giftModifications = game.settings.get('vtm5e', 'modifiedGifts')

    // Grab the custom features from the game settings and add them to the application data
    data.customAttributes = game.settings.get('vtm5e', 'customAttributes')
    data.customSkills = game.settings.get('vtm5e', 'customSkills')
    data.customDisciplines = game.settings.get('vtm5e', 'customDisciplines')
    data.customEdges = game.settings.get('vtm5e', 'customEdges')
    data.customGifts = game.settings.get('vtm5e', 'customGifts')

    return data
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners (html) {
    const handleClick = (selector, handler) => {
      html[0].querySelectorAll(selector).forEach(element => {
        element.addEventListener('click', function (event) {
          event.preventDefault()
          const data = event.target.dataset
          handler(data)
        })
      })
    }

    const addCustomItem = async (listKey, label) => {
      const list = await game.settings.get('vtm5e', listKey)
      const newItem = {
        id: foundry.utils.randomID(8),
        label
      }

      // Fill in extra default data for custom attributes/skills
      if (listKey === 'customAttributes' || listKey === 'customSkills') {
        newItem.type = 'physical'
      }

      // Push the default item into the main list and save the new setting
      list.push(newItem)
      await game.settings.set('vtm5e', listKey, list)
    }

    handleClick('.add-mod-button', ({ type }) => this._onGenerateModPrompt(type))
    handleClick('.remove-mod-button', ({ type, id }) => this._onRemoveChange(type, id))

    handleClick('.add-custom-button', async ({ type }) => {
      if (type === 'attribute') {
        await addCustomItem('customAttributes', 'New Attribute')
      } else if (type === 'skill') {
        await addCustomItem('customSkills', 'New Skill')
      } else if (type === 'discipline') {
        await addCustomItem('customDisciplines', 'New Discipline')
      } else if (type === 'edge') {
        await addCustomItem('customEdges', 'New Edge')
      } else if (type === 'gift') {
        await addCustomItem('customGifts', 'New Gift')
      }
    })

    handleClick('.remove-custom-button', ({ type, id }) => this._onRemoveCustom(type, id))

    handleClick('.save-modifications', () => {
      const modifications = {
        attribute: [],
        skill: [],
        discipline: [],
        edge: [],
        gift: []
      }
      const custom = {
        attribute: [],
        skill: [],
        discipline: [],
        edge: [],
        gift: []
      }

      const handleFeature = (feature, list) => {
        const { id, type, label } = feature.dataset
        const rename = $(feature).find('.mod-rename')[0].value
        const hidden = $(feature).find('.mod-hidden')[0].checked
        list[type].push({ id, rename, label, hidden })
      }

      const handleCustomFeature = (feature, customList) => {
        const { id, type } = feature.dataset
        const label = $(feature).find('.label')[0].value
        const attrType = $(feature).find('.attr-type')[0]?.value || ''
        const newItem = { id, label }
        if (type === 'attribute' || type === 'skill') newItem.type = attrType
        customList[type].push(newItem)
      }

      html[0].querySelectorAll('.modification-row').forEach(function (row) {
        handleFeature(row, modifications)
      })

      html[0].querySelectorAll('.customization-row').forEach(function (row) {
        handleCustomFeature(row, custom)
      })

      // Attributes
      game.settings.set('vtm5e', 'modifiedAttributes', modifications.attribute)
      game.settings.set('vtm5e', 'customAttributes', custom.attribute)
      // SKills
      game.settings.set('vtm5e', 'modifiedSkills', modifications.skill)
      game.settings.set('vtm5e', 'customSkills', custom.skill)
      // Disciplines
      game.settings.set('vtm5e', 'modifiedDisciplines', modifications.discipline)
      game.settings.set('vtm5e', 'customDisciplines', custom.discipline)
      // Edges
      game.settings.set('vtm5e', 'modifiedEdges', modifications.edge)
      game.settings.set('vtm5e', 'customEdges', custom.edge)
      // Gifts
      game.settings.set('vtm5e', 'modifiedGifts', modifications.gift)
      game.settings.set('vtm5e', 'customGifts', custom.gift)
    })
  }

  // Function for getting the information necessary for the selection dialog
  async _onGenerateModPrompt (type) {
    const list = await WOD5E[this.listKeys[type].defCategory].getList({})
    this._onRenderPromptDialog(type, list, this.listKeys[type].newModTitle)
  }

  // Function for rendering the dialog for adding a new modification
  async _onRenderPromptDialog (type, list, title) {
    const modifiedKey = `modified${this.listKeys[type].defCategory}`
    const modifiedList = await game.settings.get('vtm5e', modifiedKey)

    const effectiveList = Object.fromEntries(Object.entries(list).filter(item => !modifiedList.some(mod => mod.id === item[0])))

    const template = 'systems/vtm5e/display/ui/select-dialog.hbs'
    const content = await foundry.applications.handlebars.renderTemplate(template, { options: effectiveList })

    const result = await foundry.applications.api.DialogV2.input({
      window: { title },
      content,
      ok: {
        icon: 'fas fa-check',
        label: game.i18n.localize('WOD5E.Add')
      },
      buttons: [
        {
          action: 'cancel',
          icon: 'fas fa-times',
          label: game.i18n.localize('WOD5E.Cancel'),
          type: 'button'
        }
      ]
    })

    if (result !== 'cancel') {
      const id = result.optionSelect
      const label = list[id]?.label || id
      modifiedList.push({ id, label, rename: '', hidden: false })
      await game.settings.set('vtm5e', modifiedKey, modifiedList)
    }
  }

  // Function for removing a change
  async _onRemoveChange (type, id) {
    const modifiedKey = `modified${this.listKeys[type].defCategory}`
    let modifiedList = await game.settings.get('vtm5e', modifiedKey)
    modifiedList = modifiedList.filter(item => item.id !== id)
    await game.settings.set('vtm5e', modifiedKey, modifiedList)
  }

  // Function for removing a custom feature
  async _onRemoveCustom (type, id) {
    const customKey = `custom${this.listKeys[type].defCategory}`
    delete this.listKeys[type].defClass[id]
    let customList = await game.settings.get('vtm5e', customKey)
    customList = customList.filter(item => item.id !== id)
    await game.settings.set('vtm5e', customKey, customList)
  }
}
