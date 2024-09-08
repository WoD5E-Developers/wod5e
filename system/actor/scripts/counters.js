/* global foundry, game, ui */

// Handle all types of resource changes
export const _onResourceChange = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  let actor
  const resource = target.getAttribute('data-resource')
  const actorId = target.getAttribute('data-actor-id')
  
  if (actorId) {
    actor = game.actors.get(actorId)
  } else {
    actor = this.actor
  }
  const actorData = foundry.utils.duplicate(actor)

  // Don't let things be edited if the sheet is locked
  if (this.actor.locked || actorData.locked) {
    ui.notifications.warn(game.i18n.format('WOD5E.Notifications.CannotModifyResourceString', {
      string: actor.name
    }))
    return
  }

  // Handle adding and subtracting the number of boxes
  const resourceAction = target.getAttribute('data-resource-action')
  if (resourceAction === 'plus') {
    actorData.system[resource].max++
  } else if (resourceAction === 'minus') {
    actorData.system[resource].max = Math.max(actorData.system[resource].max - 1, 0)
  }

  if (actorData.system[resource].aggravated + actorData.system[resource].superficial > actorData.system[resource].max) {
    actorData.system[resource].aggravated = actorData.system[resource].max - actorData.system[resource].superficial
    if (actorData.system[resource].aggravated <= 0) {
      actorData.system[resource].aggravated = 0
      actorData.system[resource].superficial = actorData.system[resource].max
    }
  }

  // Update the actor with the new data
  actor.update(actorData)
}

// Handle changes to the dot counters
export const _setupDotCounters = async function (html) {
  html.find('.resource-value').each(function () {
    const value = parseInt(this.getAttribute('data-value'))
    $(this).find('.resource-value-step').each(function (i) {
      if (i + 1 <= value) {
        $(this).addClass('active')
      }
    })
  })
  html.find('.resource-value-static').each(function () {
    const value = parseInt(this.getAttribute('data-value'))
    $(this).find('.resource-value-static-step').each(function (i) {
      if (i + 1 <= value) {
        $(this).addClass('active')
      }
    })
  })
}

// Handle all changes to square counters
export const _setupSquareCounters = async function (html) {
  html.find('.resource-counter').each(function () {
    const states = parseCounterStates(this.getAttribute('data-states'))
    const name = this.getAttribute('data-name')
    const humanity = name === 'system.humanity'
    const despair = name === 'system.despair'
    const desperation = name === 'system.desperation'
    const danger = name === 'system.danger'

    const fulls = parseInt(this.getAttribute(`data-${states['-']}`)) || 0
    const halfs = parseInt(this.getAttribute(`data-${states['/']}`)) || 0
    const crossed = parseInt(this.getAttribute(`data-${states['x']}`)) || 0

    let values

    // This is a little messy but it's effective.
    if (despair) { // Hunter-specific
      values = new Array(fulls)
      values.fill('-', 0, fulls)
    } else if (humanity || desperation || danger) { // Vampire-specific
      values = new Array(fulls + halfs)
      values.fill('-', 0, fulls)
      values.fill('/', fulls, fulls + halfs)
    } else { // General use
      values = new Array(halfs + crossed)
      values.fill('/', 0, halfs)
      values.fill('x', halfs, halfs + crossed)
    }

    // Iterate through the data states now that they're properly defined
    $(this).find('.resource-counter-step').each(function () {
      this.setAttribute('data-state', '')
      if (this.getAttribute('data-index') < values.length) {
        this.setAttribute('data-state', values[this.getAttribute('data-index')])
      }
    })
  })
}

// Handle dot counters
export const _onDotCounterChange = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  let actor
  const actorId = target.getAttribute('data-actor-id')
  if (actorId) {
    actor = game.actors.get(actorId)
  } else {
    actor = this.actor
  }

  // Secondary variables
  const index = parseInt(target.getAttribute('data-index'))
  const parent = $(target.parentNode)
  const fieldStrings = parent[0].getAttribute('data-name')
  const fields = fieldStrings.split('.')
  const steps = parent.find('.resource-value-step')

  // Make sure that the dot counter can only be changed if the user has permission
  if (this.actor.permission < 3) {
    ui.notifications.warn(game.i18n.format('WOD5E.Notifications.NoSufficientPermission', {
      string: this.actor.name
    }))
    return
  }

  // Make sure that the dot counter can only be changed if the sheet is unlocked
  if (this.actor.system.locked && !parent.has('.hunger-value').length && !parent.has('.rage-value').length) {
    ui.notifications.warn(game.i18n.format('WOD5E.Notifications.CannotModifyResourceString', {
      string: actor.name
    }))
    return
  }

  if (index < 0 || index > steps.length) {
    return
  }

  // Handle editing the steps on the dot counter
  steps.removeClass('active')
  steps.each(function (i) {
    if (i <= index) {
      $(this).addClass('active')
    }
  })
  // Update the actor field
  _assignToActorField(fields, index + 1, actor)
}

// Set dot counters to an empty value
export const _onDotCounterEmpty = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  let actor
  const actorId = target.getAttribute('data-actor-id')
  const parent = $(target.parentNode)
  if (actorId) {
    actor = game.actors.get(actorId)
  } else {
    actor = this.actor
  }

  // Secondary variables
  const fieldStrings = parent[0].getAttribute('data-name')
  const fields = fieldStrings.split('.')
  const steps = parent.find('.resource-value-empty')

  // Make sure that the dot counter can only be changed if the sheet is unlocked
  if (!(this.actor.type === 'group') && actor.system.locked && !parent.has('.hunger-value').length && !parent.has('.rage-value')) {
    ui.notifications.warn(game.i18n.format('WOD5E.Notifications.CannotModifyResourceString', {
      string: actor.name
    }))
    return
  }

  // Update the actor field
  steps.removeClass('active')
  _assignToActorField(fields, 0, actor)
}

// Handle square counters
export const _onSquareCounterChange = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  let actor
  const actorId = target.getAttribute('data-actor-id')
  const index = parseInt(target.getAttribute('data-index'))
  if (actorId) {
    actor = game.actors.get(actorId)
  } else {
    actor = this.actor
  }

  // Make sure that the square counter can only be changed if the user has permission
  if (this.actor.permission < 3) {
    ui.notifications.warn(game.i18n.format('WOD5E.Notifications.NoSufficientPermission', {
      string: this.actor.name
    }))
    return
  }

  // Secondary variables
  const oldState = target.getAttribute('data-state') || ''
  const parent = $(target.parentNode)
  const parentElement = parent[0]

  // Access attributes via getAttribute
  const states = parseCounterStates(parentElement.getAttribute('data-states'))
  const fields = parentElement.getAttribute('data-name').split('.')
  const steps = parent.find('.resource-counter-step')
  const fulls = parseInt(parentElement.getAttribute(`data-${states['-']}`)) || 0
  const halfs = parseInt(parentElement.getAttribute(`data-${states['/']}`)) || 0
  const crossed = parseInt(parentElement.getAttribute(`data-${states['x']}`)) || 0

  // Square counter types
  const name = parentElement.getAttribute('data-name')
  const humanity = name === 'system.humanity'
  const despair = name === 'system.despair'
  const desperation = name === 'system.desperation'
  const danger = name === 'system.danger'

  if (index < 0 || index > steps.length) {
    return
  }

  const allStates = ['', ...Object.keys(states)]
  const currentState = allStates.indexOf(oldState)
  if (currentState < 0) {
    return
  }

  const newState = allStates[(currentState + 1) % allStates.length]
  steps[index].setAttribute('data-state', newState)

  // Update counters based on states using getAttribute
  const decrementState = (state) => parseInt(parentElement.getAttribute(`data-${state}`)) - 1
  const incrementState = (state, value) => parseInt(parentElement.getAttribute(`data-${state}`)) + value

  if ((oldState !== '' && oldState !== '-') || (oldState !== '' && humanity) || (oldState !== '' && desperation) || (oldState !== '' && danger)) {
    parentElement.setAttribute(`data-${states[oldState]}`, decrementState(states[oldState]))
  }

  // If the step was removed, subtract from the maximum
  if (oldState !== '' && newState === '' && !humanity && !despair && !desperation && !danger) {
    parentElement.setAttribute(`data-${states['-']}`, decrementState(states['-']))
  }

  if (newState !== '') {
    const addedValue = Math.max(index + 1 - fulls - halfs - crossed, 1)
    parentElement.setAttribute(`data-${states[newState]}`, incrementState(states[newState], addedValue))
  }

  // Prepare the new value to update the actor
  const newValue = Object.keys(states).reduce((obj, key) => {
    obj[key] = parseInt(parentElement.getAttribute(`data-${states[key]}`)) || 0
    return obj
  }, {})

  _assignToActorField(fields, newValue, actor)
}

// Function to help with counter states
function parseCounterStates (states) {
  return states.split(',').reduce((obj, state) => {
    const [k, v] = state.split(':')
    obj[k] = v
    return obj
  }, {})
}

// Handle assigning a new value to the appropriate actor field
export const _assignToActorField = async (fields, value, actor) => {
  const actorData = foundry.utils.duplicate(actor)

  // Handle updating actor owned items
  if (fields.length === 2 && fields[0] === 'items') {
    const itemId = fields[1]
    const item = actorData.items.find(item => item._id === itemId)
    if (item) {
      item.system.points = value
    } else {
      console.warn(`Item with ID ${itemId} not found.`)
    }
  } else {
    try {
      const lastField = fields.pop()
      const target = fields.reduce((data, field) => {
        if (!(field in data)) {
          throw new Error(`Field "${field}" not found in actor data.`)
        }
        return data[field]
      }, actorData)
      target[lastField] = value
    } catch (error) {
      console.error(`Error updating actor field: ${error.message}`)
      return
    }
  }

  // Update the actor with the new data
  await actor.update(actorData)
}
