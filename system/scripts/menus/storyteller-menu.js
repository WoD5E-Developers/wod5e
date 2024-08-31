/* global game, WOD5E, FormApplication, foundry, renderTemplate, Dialog */

/* Definitions */
import { Attributes } from '../../api/def/attributes.js'
import { Skills } from '../../api/def/skills.js'
import { Disciplines } from '../../api/def/disciplines.js'
import { Edges } from '../../api/def/edges.js'

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
        contentSelector: '.sheet-body',
        initial: 'modifications'
      }]
    })
  }

  constructor (application, options) {
    super(application, options)

    this.listKeys = {
      attribute: {
        defCategory: 'Attributes',
        labelCategory: 'AttributesList',
        defClass: Attributes
      },
      skill: {
        defCategory: 'Skills',
        labelCategory: 'SkillsList',
        defClass: Skills
      },
      discipline: {
        defCategory: 'Disciplines',
        labelCategory: 'DisciplinesList',
        defClass: Disciplines
      },
      edge: {
        defCategory: 'Edges',
        labelCategory: 'EdgesList',
        defClass: Edges
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

    // Grab the custom features from the game settings and add them to the application data
    data.customAttributes = game.settings.get('vtm5e', 'customAttributes')
    data.customSkills = game.settings.get('vtm5e', 'customSkills')
    data.customDisciplines = game.settings.get('vtm5e', 'customDisciplines')
    data.customEdges = game.settings.get('vtm5e', 'customEdges')

    return data
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners (html) {
    const handleClick = (selector, handler) => {
      html.find(selector).click(function (event) {
        event.preventDefault()
        const data = event.target.dataset
        handler(data)
      })
    }

    const addCustomItem = async (type, listKey, label) => {
      const list = await game.settings.get('vtm5e', listKey)
      const newItem = {
        id: foundry.utils.randomID(8),
        label,
        type: 'physical'
      }
      list.push(newItem)
      await game.settings.set('vtm5e', listKey, list)
    }

    handleClick('.add-mod-button', ({ type }) => this._onGenerateModPrompt(type))
    handleClick('.remove-mod-button', ({ type, id }) => this._onRemoveChange(type, id))

    handleClick('.add-custom-button', async ({ type }) => {
      if (type === 'attribute') {
        await addCustomItem('attribute', 'customAttributes', 'New Attribute')
      } else if (type === 'skill') {
        await addCustomItem('skill', 'customSkills', 'New Skill')
      } else if (type === 'discipline') {
        await addCustomItem('discipline', 'customDisciplines', 'New Discipline')
      } else if (type === 'edge') {
        await addCustomItem('edge', 'customEdges', 'New Edge')
      }
    })

    handleClick('.remove-custom-button', ({ type, id }) => this._onRemoveCustom(type, id))

    handleClick('.save-modifications', () => {
      const modifications = {
        attribute: [],
        skill: [],
        discipline: [],
        edge: []
      }
      const custom = {
        attribute: [],
        skill: [],
        discipline: [],
        edge: []
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

      html.find('.modification-row').each(function () {
        handleFeature(this, modifications)
      })

      html.find('.customization-row').each(function () {
        handleCustomFeature(this, custom)
      })

      game.settings.set('vtm5e', 'modifiedAttributes', modifications.attribute)
      game.settings.set('vtm5e', 'customAttributes', custom.attribute)
      game.settings.set('vtm5e', 'modifiedSkills', modifications.skill)
      game.settings.set('vtm5e', 'customSkills', custom.skill)
      game.settings.set('vtm5e', 'modifiedDisciplines', modifications.discipline)
      game.settings.set('vtm5e', 'customDisciplines', custom.discipline)
      game.settings.set('vtm5e', 'modifiedEdges', modifications.edge)
      game.settings.set('vtm5e', 'customEdges', custom.edge)
    })
  }

  // Function for getting the information necessary for the selection dialog
  async _onGenerateModPrompt (type) {
    const list = await WOD5E[this.listKeys[type].defCategory].getList({})
    this._onRenderPromptDialog(type, list, game.i18n.localize(`WOD5E.${this.listKeys[type].labelCategory}.Label`))
  }

  // Function for rendering the dialog for adding a new modification
  async _onRenderPromptDialog (type, list, title) {
    const template = 'systems/vtm5e/display/ui/select-dialog.hbs'
    const content = await renderTemplate(template, { list })

    new Dialog({
      title,
      content,
      buttons: {
        add: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize('WOD5E.Add'),
          callback: async html => {
            const id = html.find('[id=optionSelect]').val()
            const label = list[id]?.label || id
            const modifiedKey = `modified${this.listKeys[type].defCategory}`
            const modifiedList = await game.settings.get('vtm5e', modifiedKey)
            modifiedList.push({ id, label, rename: '', hidden: false })
            await game.settings.set('vtm5e', modifiedKey, modifiedList)
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize('WOD5E.Cancel')
        }
      },
      default: 'add'
    }).render(true)
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
