/**
 * Handle clicking a Sphere name in the Stats tab.
 *
 * Opens a dedicated Sphere + Skill selection dialog (separate from the
 * standard Skill + Attribute dialog). After selection it calls _onConfirmRoll
 * directly, exactly like the rest of the system does post-selection.
 *
 * Pool = sphere dots + skill dots.
 * Paradox dice replace regular dice up to paradox.value across the full pool.
 */
import { _onConfirmRoll } from '../../actor/scripts/roll.js'

export const _onSphereRoll = async function (event, target) {
  event.preventDefault()

  const actor     = this.actor
  const actorData = actor.system
  const clickedSphere = target.dataset.sphere ?? ''

  // ── Build option lists ───────────────────────────────────────────────────
  const sphereKeys = [
    'correspondence', 'entropy', 'forces', 'life', 'matter',
    'mind', 'prime', 'spirit', 'time'
  ]

  const sphereOpts = sphereKeys.map(k => {
    const label = game.i18n.localize(`WOD5E.MTA.${k.charAt(0).toUpperCase() + k.slice(1)}`)
    const selected = k === clickedSphere ? ' selected' : ''
    return `<option value="${k}"${selected}>${label}</option>`
  }).join('')

  const skillsList = WOD5E.Skills.getList({})
  const skillOpts  = Object.entries(skillsList).map(([id, def]) =>
    `<option value="${id}">${def.displayName ?? id}</option>`
  ).join('')

  // ── Render dialog ────────────────────────────────────────────────────────
  const content = `
    <form class="dialog-contents">
      <div class="selectors-group">
        <div class="primary-selector">
          <div class="selector-title">${game.i18n.localize('WOD5E.MTA.Sphere')}</div>
          <div class="selector-content">
            <select id="sphereSelect" name="sphereSelect">
              <option value="">${game.i18n.localize('WOD5E.None')}</option>
              ${sphereOpts}
            </select>
          </div>
        </div>
        <div class="middle">+</div>
        <div class="primary-selector">
          <div class="selector-title">${game.i18n.localize('WOD5E.SkillsList.Label')}</div>
          <div class="selector-content">
            <select id="skillSelect" name="skillSelect">
              <option value="">${game.i18n.localize('WOD5E.None')}</option>
              ${skillOpts}
            </select>
          </div>
        </div>
      </div>
    </form>`

  const result = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize('WOD5E.RollList.SelectRoll') },
    content,
    ok: {
      icon:  'fas fa-dice',
      label: game.i18n.localize('WOD5E.Confirm')
    },
    buttons: [{
      action: 'cancel',
      icon:   'fas fa-times',
      label:  game.i18n.localize('WOD5E.Cancel')
    }],
    classes: ['wod5e', 'mage']
  })

  if (!result || result === 'cancel') return

  const sphereKey = result.sphereSelect
  const skillKey  = result.skillSelect

  if (!sphereKey && !skillKey) return

  // ── Build label and value paths ──────────────────────────────────────────
  const labelParts  = []
  const valuePaths  = []
  const selectors   = ['mage']

  if (sphereKey) {
    labelParts.push(
      game.i18n.localize(`WOD5E.MTA.${sphereKey.charAt(0).toUpperCase() + sphereKey.slice(1)}`)
    )
    // Sphere values live at actor.system.spheres.<key> — a flat number,
    // so the dot-path is just "spheres.<key>" (no trailing .value)
    valuePaths.push(`spheres.${sphereKey}`)
    selectors.push(`spheres.${sphereKey}`)
  }

  if (skillKey) {
    labelParts.push(skillsList[skillKey]?.displayName ?? skillKey)
    valuePaths.push(`skills.${skillKey}.value`)
    selectors.push('skills', `skills.${skillKey}`)
  }

  // ── Delegate to _onConfirmRoll ───────────────────────────────────────────
  // This is identical to how RollFromDataset calls _onConfirmRoll after
  // building the dataset from the selection dialog result.
  await _onConfirmRoll(
    {
      label:      labelParts.join(' + '),
      valuePaths: valuePaths.join(' '),
      selectors:  selectors.join(' '),
      flavor:     game.i18n.localize('WOD5E.MTA.SpellcastingRoll'),
      quickRoll:  false
    },
    actor
  )
}
