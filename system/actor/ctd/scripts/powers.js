/* global game, Dialog, WOD5E, renderTemplate, ChatMessage */

/** Handle adding a new art to the sheet */
export const _onAddArt = async function (event) {
    event.preventDefault()
  
    // Top-level variables
    const actor = this.actor
  
    // Secondary variables
    const selectLabel = game.i18n.localize('WOD5E.CTD.SelectArt')
    const itemOptions = WOD5E.Arts.getList({})
  
    // Variables yet to be defined
    let options = []
    let artSelected
  
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
          <select id="artSelect">${options}</select>
        </div>
      </form>`
  
    // Define dialog buttons
    const buttons = {
      submit: {
        icon: '<i class="fas fa-check"></i>',
        label: game.i18n.localize('WOD5E.Add'),
        callback: async (html) => {
          artSelected = html.find('#artSelect')[0].value
  
          // Make the art visible
          actor.update({ [`system.Arts.${artSelected}.visible`]: true })
  
          // Update the currently selected art and power
          _updateSelectedArt(actor, artSelected)
          _updateSelectedArtPower(actor, '')
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
      classes: ['wod5e', 'dialog', 'changeling', 'dialog']
    }).render(true)
  }
  
  /** Handle removing an art from an actor */
  export const _onRemoveArt = async function (event, target) {
    event.preventDefault()
  
    // Top-level variables
    const actor = this.actor
    const art = target.getAttribute('data-art')
  
    actor.update({
      [`system.Arts.${art}.visible`]: false
    })
  }
  
  /** Post Art description to the chat */
  export const _onArtToChat = async function (event, target) {
    event.preventDefault()
  
    // Top-level variables
    const actor = this.actor
    const art = actor.system.Arts[target.getAttribute('data-art')]
  
    await renderTemplate('systems/vtm5ec/display/ui/chat/chat-message.hbs', {
      name: art.displayName,
      img: 'icons/svg/dice-target.svg',
      description: art?.description
    }).then(html => {
      const message = ChatMessage.applyRollMode({ speaker: ChatMessage.getSpeaker({ actor }), content: html }, game.settings.get('core', 'rollMode'))
      ChatMessage.create(message)
    })
  }
  
  /** Select an art to display */
  export const _onSelectArt = async function (event, target) {
    event.preventDefault()
  
    // Top-level variables
    const actor = this.actor
    const art = target.getAttribute('data-art')
  
    _updateSelectedArt(actor, art)
  }
  
  /** Select a power to display */
  export const _onSelectArtPower = async function (event, target) {
    event.preventDefault()
  
    // Top-level variables
    const actor = this.actor
    const power = target.getAttribute('data-power')
  
    _updateSelectedArtPower(actor, power)
  }
  
  export const _updateSelectedArtPower = async function (actor, power) {
    // Variables yet to be defined
    const updatedData = {}
  
    // Make sure we actually have a valid power defined
    if (power && actor.items.get(power)) {
      const powerItem = actor.items.get(power)
      const art = powerItem.system.Art
  
      // Update the selected power
      updatedData.selectedArtPower = power
      powerItem.update({
        system: {
          selected: true
        }
      })
  
      // Update the selected arts
      _updateSelectedArt(actor, art)
    } else {
      // Revert to an empty string
      updatedData.selectedArtPower = ''
    }
  
    // Unselect the previously selected power
    const previouslySelectedPower = actor.system?.selectedArtPower
    if (previouslySelectedPower && actor.items.get(previouslySelectedPower) && previouslySelectedPower !== power) {
      actor.items.get(previouslySelectedPower).update({
        system: {
          selected: false
        }
      })
    }
  
    // Update the actor data
    actor.update({
      system: updatedData
    })
  }
  
  export const _updateSelectedArt = async function (actor, art) {
    // Variables yet to be defined
    const updatedData = {}
  
    // Make sure we actually have an art defined
    if (art && actor.system.arts[art]) {
      updatedData.arts ??= {}
      updatedData.arts[art] ??= {}
  
      // Update the selected arts
      updatedData.selectedArt = art
      updatedData.arts[art].selected = true
    } else {
      // Revert to an empty string
      updatedData.selectedArt = ''
    }
  
    // Unselect the previously selected art
  
    const previouslySelectedArt = actor.system?.selectedArt
    if (previouslySelectedArt && previouslySelectedArt !== art) {
      updatedData.arts[previouslySelectedArt] ??= {}
      updatedData.arts[previouslySelectedArt].selected = false
    }
  
    // Update the actor data
    actor.update({
      system: updatedData
    })
  }
  
  /* global game, Dialog, WOD5E, renderTemplate, ChatMessage */

/** Handle adding a new realm to the sheet */
export const _onAddRealm = async function (event) {
    event.preventDefault()
  
    // Top-level variables
    const actor = this.actor
  
    // Secondary variables
    const selectLabel = game.i18n.localize('WOD5E.CTD.SelectRealm')
    const itemOptions = WOD5E.Realms.getList({})
  
    // Variables yet to be defined
    let options = []
    let realmSelected
  
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
          <select id="realmSelect">${options}</select>
        </div>
      </form>`
  
    // Define dialog buttons
    const buttons = {
      submit: {
        icon: '<i class="fas fa-check"></i>',
        label: game.i18n.localize('WOD5E.Add'),
        callback: async (html) => {
          realmSelected = html.find('#realmSelect')[0].value
  
          // Make the realm visible
          actor.update({ [`system.Realms.${realmSelected}.visible`]: true })
  
          // Update the currently selected realm and power
          _updateSelectedRealm(actor, realmSelected)
          _updateSelectedRealmPower(actor, '')
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
      classes: ['wod5e', 'dialog', 'changeling', 'dialog']
    }).render(true)
  }
  
  /** Handle removing a realm from an actor */
  export const _onRemoveRealm = async function (event, target) {
    event.preventDefault()
  
    // Top-level variables
    const actor = this.actor
    const realm = target.getAttribute('data-realm')
  
    actor.update({
      [`system.Realms.${realm}.visible`]: false
    })
  }
  
  /** Post Realm description to the chat */
  export const _onRealmToChat = async function (event, target) {
    event.preventDefault()
  
    // Top-level variables
    const actor = this.actor
    const realm = actor.system.Realms[target.getAttribute('data-realm')]
  
    await renderTemplate('systems/vtm5ec/display/ui/chat/chat-message.hbs', {
      name: realm.displayName,
      img: 'icons/svg/dice-target.svg',
      description: realm?.description
    }).then(html => {
      const message = ChatMessage.applyRollMode({ speaker: ChatMessage.getSpeaker({ actor }), content: html }, game.settings.get('core', 'rollMode'))
      ChatMessage.create(message)
    })
  }
  
  /** Select a realm to display */
  export const _onSelectRealm = async function (event, target) {
    event.preventDefault()
  
    // Top-level variables
    const actor = this.actor
    const realm = target.getAttribute('data-realm')
  
    _updateSelectedRealm(actor, realm)
  }
  
  /** Select a power to display */
  export const _onSelectRealmPower = async function (event, target) {
    event.preventDefault()
  
    // Top-level variables
    const actor = this.actor
    const power = target.getAttribute('data-power')
  
    _updateSelectedRealmPower(actor, power)
  }
  
  export const _updateSelectedRealmPower = async function (actor, power) {
    // Variables yet to be defined
    const updatedData = {}
  
    // Make sure we actually have a valid power defined
    if (power && actor.items.get(power)) {
      const powerItem = actor.items.get(power)
      const realm = powerItem.system.Realm
  
      // Update the selected power
      updatedData.selectedRealmPower = power
      powerItem.update({
        system: {
          selected: true
        }
      })
  
      // Update the selected realms
      _updateSelectedRealm(actor, realm)
    } else {
      // Revert to an empty string
      updatedData.selectedRealmPower = ''
    }
  
    // Unselect the previously selected power
    const previouslySelectedPower = actor.system?.selectedRealmPower
    if (previouslySelectedPower && actor.items.get(previouslySelectedPower) && previouslySelectedPower !== power) {
      actor.items.get(previouslySelectedPower).update({
        system: {
          selected: false
        }
      })
    }
  
    // Update the actor data
    actor.update({
      system: updatedData
    })
  }
  
  export const _updateSelectedRealm = async function (actor, realm) {
    // Variables yet to be defined
    const updatedData = {}
  
    // Make sure we actually have a realm defined
    if (realm && actor.system.realms[realm]) {
      updatedData.realms ??= {}
      updatedData.realms[realm] ??= {}
  
      // Update the selected realms
      updatedData.selectedRealm = realm
      updatedData.realms[realm].selected = true
    } else {
      // Revert to an empty string
      updatedData.selectedRealm = ''
    }
  
    // Unselect the previously selected realm
  
    const previouslySelectedRealm = actor.system?.selectedRealm
    if (previouslySelectedRealm && previouslySelectedRealm !== realm) {
      updatedData.realms[previouslySelectedRealm] ??= {}
      updatedData.realms[previouslySelectedRealm].selected = false
    }
  
    // Update the actor data
    actor.update({
      system: updatedData
    })
  }
  