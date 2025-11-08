export class WoDHotbar extends foundry.applications.ui.Hotbar {
  /** @override */
  async _onDrop(event) {
    event.preventDefault()
    const li = event.target.closest('.macro')
    const slot = Number(li.dataset.slot)
    const data = foundry.applications.ux.TextEditor.implementation.getDragEventData(event)
    if (Hooks.call('hotbarDrop', this, data, slot) === false) return

    // Forbid overwriting macros if the hotbar is locked.
    const existingMacro = game.macros.get(game.user.hotbar[slot])
    if (existingMacro && this.locked)
      return ui.notifications.warn('MACRO.CannotOverwrite', { localize: true })

    // Get the dropped document
    const cls = getDocumentClass(data.type)
    const doc = await cls?.fromDropData(data)
    if (!doc) return

    // Get the Macro to add to the bar
    let macro
    if (data.type === 'Macro')
      macro = game.macros.has(doc.id) ? doc : await cls.create(doc.toObject())
    else if (data.type === 'Item') macro = await this._createRollableMacro(doc)
    else if (data.type === 'RollTable') macro = await this._createRollTableRollMacro(doc)
    else macro = await this._createDocumentSheetToggle(doc)

    // Assign the macro to the hotbar
    if (!macro) return
    return game.user.assignHotbarMacro(macro, slot, {
      fromSlot: data.slot
    })
  }

  async _createRollableMacro(document) {
    const item = fromUuidSync(document.uuid)

    // Create the macro command
    const command = `WOD5E.api._onRollItemFromMacro('${item.name}')`

    return await Macro.create({
      name: item.name,
      type: 'script',
      img: item.img,
      command
    })
  }
}
