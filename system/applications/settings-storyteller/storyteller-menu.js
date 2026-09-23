import { Attributes } from '../../api/def/attributes.js'
import { Skills } from '../../api/def/skills.js'
import { Disciplines } from '../../api/def/disciplines.js'
import { Edges } from '../../api/def/edges.js'
import { Gifts } from '../../api/def/gifts.js'

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

// Each category owns its editor; additional domain/wereform editors can be separate tabs.
const categories = {
  attribute: { definition: Attributes, label: 'WOD5E.AttributesList.Attributes', typed: true },
  skill: { definition: Skills, label: 'WOD5E.SkillsList.Skills', typed: true },
  discipline: { definition: Disciplines, label: 'WOD5E.VTM.Disciplines' },
  edge: { definition: Edges, label: 'WOD5E.HTR.Edges' },
  gift: { definition: Gifts, label: 'WOD5E.WTA.Gifts' }
}

export class StorytellerMenu extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    tag: 'form',
    id: 'wod5e-storyteller',
    classes: ['wod5e', 'storyteller-menu'],
    window: { title: 'WOD5E.Settings.StorytellerMenu', resizable: true },
    position: { width: 760, height: 640 },
    form: { handler: StorytellerMenu.saveChanges, closeOnSubmit: false },
    actions: {
      addModification: StorytellerMenu.addModification,
      addCustom: StorytellerMenu.addCustom,
      removeEntry: StorytellerMenu.removeEntry
    }
  }

  static TABS = {
    primary: {
      initial: 'attribute',
      tabs: Object.entries(categories).map(([id, { label }]) => ({ id, label }))
    }
  }

  static PARTS = {
    editor: {
      template: 'systems/wod5e/display/ui/storyteller-menu.hbs',
      scrollable: ['.storyteller-panels']
    }
  }

  _draft = null
  _baseline = null
  _saving = false

  _initializeDraft() {
    if (this._draft) return
    this._draft = {}
    for (const [type, { definition }] of Object.entries(categories)) {
      this._draft[type] = {}
      for (const kind of ['modified', 'custom']) {
        this._draft[type][kind] = foundry.utils.deepClone(
          game.settings.get('wod5e', `${kind}${definition.defCategory}`)
        )
      }
    }
    this._baseline = foundry.utils.deepClone(this._draft)
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options)
    this._initializeDraft()

    context.categories = Object.entries(categories).map(([type, config]) => ({
      ...config,
      type,
      tab: context.tabs[type],
      modified: this._draft[type].modified,
      custom: this._draft[type].custom,
      modifiedTitle: `WOD5E.Settings.Modified${config.definition.defCategory}`,
      customTitle: `WOD5E.Settings.Custom${config.definition.defCategory}`,
      addModification: `WOD5E.Settings.Add${type[0].toUpperCase()}${type.slice(1)}Modification`,
      addCustom: `WOD5E.Settings.AddCustom${type[0].toUpperCase()}${type.slice(1)}`,
      typeLabel: `WOD5E.Settings.${type === 'attribute' ? 'Attribute' : 'Skill'}Type`
    }))

    context.attributeTypes = {
      physical: 'WOD5E.SPC.Physical',
      social: 'WOD5E.SPC.Social',
      mental: 'WOD5E.SPC.Mental'
    }
    return context
  }

  // Capture all tabs before any action which re-renders the form.
  _captureDraft(form = this.element) {
    this._initializeDraft()
    for (const row of form?.querySelectorAll('[data-entry]') || []) {
      const { type, kind, id } = row.dataset
      const entry = this._draft[type]?.[kind]?.find((item) => item.id === id)
      if (!entry) continue
      for (const input of row.querySelectorAll('[data-field]')) {
        entry[input.dataset.field] = input.type === 'checkbox' ? input.checked : input.value
      }
    }
  }

  _onChangeForm(formConfig, event) {
    super._onChangeForm(formConfig, event)
    this._captureDraft()
  }

  async close(options) {
    if (this._saving) return this

    await super.close(options)
    this._draft = null
    this._baseline = null
    return this
  }

  static async addModification(event, target) {
    if (this._saving) return

    this._captureDraft()

    const { type } = target.dataset

    const config = categories[type]
    if (!config) return

    const modified = this._draft[type].modified
    const options = Object.fromEntries(
      Object.entries(config.definition.getList({ useRenamedLabel: false })).filter(
        ([id]) => !modified.some((item) => item.id === id)
      )
    )

    if (!Object.keys(options).length) {
      ui.notifications.info(game.i18n.localize('WOD5E.Settings.NoMoreModifications'))
      return
    }

    const content = await foundry.applications.handlebars.renderTemplate(
      'systems/wod5e/display/ui/select-dialog.hbs',
      { options }
    )

    const result = await foundry.applications.api.DialogV2.input({
      window: {
        title: game.i18n.format('WOD5E.Settings.NewStringModification', {
          string: game.i18n.localize(config.label)
        })
      },
      content,
      ok: { label: game.i18n.localize('WOD5E.Add'), icon: 'fas fa-plus' },
      rejectClose: false
    })

    const id = result?.optionSelect
    if (!id || !options[id] || modified.some((entry) => entry.id === id)) return

    this._captureDraft()
    modified.push({ id, label: options[id].label, rename: '', hidden: false })

    await this.render()
  }

  static async addCustom(event, target) {
    if (this._saving) return
    this._captureDraft()
    const { type } = target.dataset
    if (!categories[type]) return
    const entry = { id: foundry.utils.randomID(8), label: '' }
    if (categories[type].typed) entry.type = 'physical'
    this._draft[type].custom.push(entry)
    await this.render()
  }

  static async removeEntry(event, target) {
    if (this._saving) return
    this._captureDraft()
    const { type, kind, id } = target.dataset
    if (!this._draft[type]?.[kind]) return
    this._draft[type][kind] = this._draft[type][kind].filter((entry) => entry.id !== id)
    await this.render()
  }

  static async saveChanges(event, form) {
    if (this._saving || !game.user.isGM) return

    this._captureDraft(form)

    // Custom entries need a usable name, including those on an inactive tab.
    for (const [type, draft] of Object.entries(this._draft)) {
      if (draft.custom.some((entry) => !entry.label.trim())) {
        this.changeTab(type, 'primary')
        ui.notifications.warn(game.i18n.localize('WOD5E.Settings.CustomNameRequired'))
        return
      }
    }

    this._saving = true
    const snapshot = foundry.utils.deepClone(this._draft)
    try {
      for (const [type, { definition }] of Object.entries(categories)) {
        for (const kind of ['custom', 'modified']) {
          const entries = snapshot[type][kind]
          if (JSON.stringify(entries) === JSON.stringify(this._baseline[type][kind])) continue
          await game.settings.set(
            'wod5e',
            `${kind}${definition.defCategory}`,
            foundry.utils.deepClone(entries)
          )
          this._baseline[type][kind] = foundry.utils.deepClone(entries)
        }
      }
      ui.notifications.info(game.i18n.localize('WOD5E.Settings.StorytellerSaved'))
    } catch (error) {
      console.error('World of Darkness 5e | Storyteller settings could not be saved', error)
      ui.notifications.error(game.i18n.localize('WOD5E.Settings.StorytellerSaveFailed'))
    } finally {
      this._saving = false
    }
  }
}
