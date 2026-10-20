export const GROUP_SHEET_HEADERS = {
  coterie: {
    chasse: 'WOD5E.VTM.Chasse',
    lien: 'WOD5E.VTM.Lien',
    huntingDifficulty: 'WOD5E.VTM.HuntingDifficulty',
    portillon: 'WOD5E.VTM.Portillon'
  },
  cell: {
    danger: 'WOD5E.HTR.Danger',
    desperation: 'WOD5E.HTR.Desperation'
  },
  pack: {
    territory: 'WOD5E.WTA.Territory',
    community: 'WOD5E.WTA.Community',
    spirit: 'WOD5E.WTA.Spirit',
    guidingSpirit: 'WOD5E.WTA.GuidingSpirit'
  }
}

export function getGroupSheetHeaders(actor) {
  const defaults = GROUP_SHEET_HEADERS[actor.system.groupType] ?? {}
  return Object.fromEntries(
    Object.entries(defaults).map(([key, label]) => [
      key,
      actor.system.settings.sheetHeaders?.[key] || game.i18n.localize(label)
    ])
  )
}

export async function manageSheetHeaders() {
  if (!this.isEditable) return
  const actor = this.actor
  const groupType = actor.system.groupType
  const headers = Object.entries(GROUP_SHEET_HEADERS[groupType] ?? {}).map(([key, label]) => ({
    key,
    label: game.i18n.localize(label),
    value: actor.system.settings.sheetHeaders?.[key] ?? ''
  }))

  const content = await foundry.applications.handlebars.renderTemplate(
    'systems/wod5e/display/shared/actors/parts/group/manage-sheet-headers.hbs',
    {
      headers
    }
  )

  return foundry.applications.api.DialogV2.wait({
    window: { title: game.i18n.localize('WOD5E.ActorSettings.ManageSheetHeaders') },
    content,
    rejectClose: false,
    buttons: [
      {
        action: 'save',
        label: game.i18n.localize('WOD5E.Save'),
        default: true,
        callback: async (event, button) => {
          if (!this.isEditable || actor.system.groupType !== groupType) return
          const changes = {}
          for (const { key, value: previousValue } of headers) {
            const value = button.form.elements.namedItem(key).value.trim()
            if (value !== previousValue) changes[`system.settings.sheetHeaders.${key}`] = value
          }
          if (Object.keys(changes).length) await actor.update(changes)
        }
      },
      {
        action: 'cancel',
        label: game.i18n.localize('WOD5E.Cancel')
      }
    ]
  })
}
