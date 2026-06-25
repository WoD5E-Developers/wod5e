/** Handle adding a new sphere to the sheet */
export const _onAddSphere = async function (event) {
  event.preventDefault()

  const actor = this.actor
  const sphereList = WOD5E.Spheres.getList({})

  const content = new foundry.data.fields.StringField({
    choices: sphereList,
    label: game.i18n.localize('WOD5E.MTA.SelectSphere'),
    required: true
  }).toFormGroup({}, { name: 'sphere' }).outerHTML

  const sphereSelected = await foundry.applications.api.DialogV2.prompt({
    window: { title: game.i18n.localize('WOD5E.MTA.AddSphere') },
    classes: ['wod5e', 'dialog', 'mage'],
    content,
    ok: {
      callback: (event, button) =>
        new foundry.applications.ux.FormDataExtended(button.form).object.sphere
    },
    modal: true
  })

  if (sphereSelected) {
    actor.update({ [`system.spheres.${sphereSelected}.visible`]: true })
    _updateSelectedSphere(actor, sphereSelected)
    _updateSelectedSpherePower(actor, '')
  }
}

/** Handle removing a sphere from an actor */
export const _onRemoveSphere = async function (event, target) {
  event.preventDefault()

  const actor = this.actor
  const sphere = target.getAttribute('data-sphere')

  actor.update({ [`system.spheres.${sphere}.visible`]: false })
}

/** Post Sphere description to chat */
export const _onSphereToChat = async function (event, target) {
  event.preventDefault()

  const actor = this.actor
  const sphere = actor.system.spheres[target.getAttribute('data-sphere')]

  foundry.documents.ChatMessage.implementation.create({
    flags: {
      wod5e: {
        name: sphere.displayName,
        img: 'icons/svg/dice-target.svg',
        description: sphere?.description
      }
    }
  })
}

/** Select a sphere to display in the detail pane */
export const _onSelectSphere = async function (event, target) {
  event.preventDefault()

  const actor = this.actor
  const sphere = target.getAttribute('data-sphere')

  _updateSelectedSphere(actor, sphere)
}

/** Select a sphere power to display */
export const _onSelectSpherePower = async function (event, target) {
  event.preventDefault()

  const actor = this.actor
  const power = target.getAttribute('data-power')

  _updateSelectedSpherePower(actor, power)
}

export const _updateSelectedSpherePower = async function (actor, power) {
  const updatedData = {}

  if (power && actor.items.get(power)) {
    const powerItem = actor.items.get(power)
    const sphere = powerItem.system.discipline // powers re-use the 'discipline' field for sphere id

    updatedData.selectedSpherePower = power
    powerItem.update({ system: { selected: true } })
    _updateSelectedSphere(actor, sphere)
  } else {
    updatedData.selectedSpherePower = ''
  }

  const previouslySelected = actor.system?.selectedSpherePower
  if (previouslySelected && actor.items.get(previouslySelected) && previouslySelected !== power) {
    actor.items.get(previouslySelected).update({ system: { selected: false } })
  }

  actor.update({ system: updatedData })
}

export const _updateSelectedSphere = async function (actor, sphere) {
  const updatedData = {}

  if (sphere && actor.system.spheres[sphere]) {
    updatedData.spheres ??= {}
    updatedData.spheres[sphere] ??= {}
    updatedData.selectedSphere = sphere
    updatedData.spheres[sphere].selected = true
  } else {
    updatedData.selectedSphere = ''
  }

  const previouslySelected = actor.system?.selectedSphere
  if (previouslySelected && previouslySelected !== sphere) {
    updatedData.spheres ??= {}
    updatedData.spheres[previouslySelected] ??= {}
    updatedData.spheres[previouslySelected].selected = false
  }

  actor.update({ system: updatedData })
}
