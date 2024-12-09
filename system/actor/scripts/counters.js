/* global foundry, game, ui */

// Handle all types of resource changes
export const _onResourceChange = async function (event) {
  event.preventDefault()

  // Top-level variables
  let actor
  const element = event.currentTarget
  const dataset = Object.assign({}, element.dataset)
  const resource = dataset.resource
  if (dataset.actorId) {
    actor = game.actors.get(dataset.actorId)
  } else {
    actor = this.actor
  }
  const actorData = foundry.utils.duplicate(actor)

  // Don't let things be edited if the sheet is locked
  if (actorData.system.locked) {
    ui.notifications.warn(game.i18n.format('WOD5E.Notifications.CannotModifyResourceString', {
      string: actor.name
    }))
    return
  }

  // Handle adding and subtracting the number of boxes
  if (dataset.resourceAction === 'plus') {
    actorData.system[resource].max++
  } else if (dataset.resourceAction === 'minus') {
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
  // Handle updating actor owned items
  if (fields.length === 2 && fields[0] === 'items') {
    const itemId = fields[1]
    const item = actor.items.find(item => item._id === itemId)
    if (item) {
      item.update({
        'system.points': value
      })
    } else {
      console.warn(`Item with ID ${itemId} not found.`)
    }
  } else {
    try {
      actor.update({
        [`${fields.join('.')}`]: value
      })
    } catch (error) {
      console.error(`Error updating actor field: ${error.message}`)
    }
  }
}

/**
 * DOT COUNTERS
 */

// Handle setting up the dot counters
export const _setupDotCounters = async function (html) {
  html.find('.resource-value').each(function () {
    const value = parseInt(this.dataset.value)
    $(this).find('.resource-value-step').each(function (i) {
      if (i + 1 <= value) {
        $(this).addClass('active')
      }
    })
  })
  html.find('.resource-value-static').each(function () {
    const value = parseInt(this.dataset.value)
    $(this).find('.resource-value-static-step').each(function (i) {
      if (i + 1 <= value) {
        $(this).addClass('active')
      }
    })
  })
}

// Handle dot counters
export const _onDotCounterChange = async function (event) {
  event.preventDefault()

  // Top-level variables
  let actor
  const element = event.currentTarget
  const dataset = Object.assign({}, element.dataset)
  if (dataset.actorId) {
    actor = game.actors.get(dataset.actorId)
  } else {
    actor = this.actor
  }

  // Secondary variables
  const index = parseInt(dataset.index)
  const parent = $(element.parentNode)
  const fieldStrings = parent[0].dataset.name
  const fields = fieldStrings.split('.')
  const steps = parent.find('.resource-value-step')

  // Make sure that the dot counter can only be changed if the user has permission
  if (this.actor.permission < 3) {
    ui.notifications.warn(game.i18n.format('WOD5E.Notifications.NoSufficientPermission', {
      string: this.actor.name
    }))
    return
  }

  // Make sure that the dot counter can only be changed if the sheet is
  // unlocked or if it's the hunger/rage track.
  if (this.actor.system.locked && !parent.has('.hunger-value').length && !parent.has('.rage-value').length) {
    ui.notifications.warn(game.i18n.format('WOD5E.Notifications.CannotModifyResourceString', {
      string: actor.name
    }))
    return
  }

  // Don't let us set the counter less than 0 or greater than the max length set
  if (index < 0 || index > steps.length) {
    return
  }

  // Update the actor field
  _assignToActorField(fields, index + 1, actor)
}

// Set dot counters to an empty value
export const _onDotCounterEmpty = async function (event) {
  event.preventDefault()

  // Top-level variables
  let actor
  const element = event.currentTarget
  const dataset = Object.assign({}, element.dataset)
  const parent = $(element.parentNode)
  if (dataset.actorId) {
    actor = game.actors.get(dataset.actorId)
  } else {
    actor = this.actor
  }

  // Secondary variables
  const fieldStrings = parent[0].dataset.name
  const fields = fieldStrings.split('.')
  const steps = parent.find('.resource-value-empty')

  // Make sure that the dot counter can only be changed if the sheet is
  // unlocked or if it's the hunger track.
  // Bypass this if this function is being called from a group sheet
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

/**
 * SQUARE COUNTERS
 */

// Set up the square counters
export const _setupSquareCounters = async function (html) {
  html.find('.resource-counter').each(function () {
    const data = this.dataset
    const states = parseCounterStates(data.states)
    const humanity = data.name === 'system.humanity'
    const despair = data.name === 'system.despair'
    const desperation = data.name === 'system.desperation'
    const danger = data.name === 'system.danger'

    const fulls = parseInt(data[states['-']]) || 0
    const halfs = parseInt(data[states['/']]) || 0
    const crossed = parseInt(data[states.x]) || 0

    let values

    // This is a little messy but it's effective.
    // Effectively we're making sure that each square
    // counter's box-filling tactic is followed properly.
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
      this.dataset.state = ''
      if (this.dataset.index < values.length) {
        this.dataset.state = values[this.dataset.index]
      }
    })
  })
}

// Handle changes to square counters
export const _onSquareCounterChange = async function (event) {
  event.preventDefault()

  const element = event.currentTarget
  const dataset = Object.assign({}, element.dataset)
  const index = parseInt(dataset.index)
  const actor = getActor(dataset.actorId, this.actor)

  // Ensure user has permission
  if (!hasSufficientPermission(this.actor)) return

  const parent = $(element.parentNode)
  const data = parent[0].dataset
  const states = parseCounterStates(data.states)
  const steps = parent.find('.resource-counter-step')

  if (index < 0 || index >= steps.length) return

  const oldState = element.dataset.state || ''
  const allStates = ['', ...Object.keys(states)]
  const currentState = allStates.indexOf(oldState)

  if (currentState < 0) return

  const newState = getNextState(allStates, currentState)
  steps[index].dataset.state = newState

  // Update counters based on old and new state
  updateStateCounters(oldState, newState, data, states, index)

  // Save new state to actor
  const fields = data.name.split('.')
  const newValue = calculateNewValue(states, data)
  _assignToActorField(fields, newValue, actor)
}

// Function to remove square counter value at clicked index
export const _onRemoveSquareCounter = async function (event) {
  event.preventDefault()

  const element = event.currentTarget
  const dataset = Object.assign({}, element.dataset)
  const index = parseInt(dataset.index)
  const actor = getActor(dataset.actorId, this.actor)

  // Ensure user has permission
  if (!hasSufficientPermission(this.actor)) return

  const parent = $(element.parentNode)
  const data = parent[0].dataset
  const states = parseCounterStates(data.states)
  const steps = parent.find('.resource-counter-step')

  if (index < 0 || index >= steps.length) return

  const oldState = element.dataset.state || ''
  const allStates = ['', ...Object.keys(states)]
  const currentState = allStates.indexOf(oldState)

  if (currentState < 0) return

  const newState = resetState(allStates, currentState)
  steps[index].dataset.state = newState

  // Update counters based on old and new state
  updateStateCounters(oldState, newState, data, states, index)

  // Save new state to actor
  const fields = data.name.split('.')
  const newValue = calculateNewValue(states, data)
  _assignToActorField(fields, newValue, actor)
}

/**
 * HELPER FUNCTIONS
 */

// Get actor from dataset or fallback to context actor
function getActor (actorId, fallbackActor) {
  return actorId ? game.actors.get(actorId) : fallbackActor
}

// Check if the actor has sufficient permissions (level 3 or higher)
function hasSufficientPermission (actor) {
  if (actor.permission < 3) {
    ui.notifications.warn(game.i18n.format('WOD5E.Notifications.NoSufficientPermission', {
      string: actor.name
    }))
    return false
  }
  return true
}

// Get the next state from the list of states
function getNextState (allStates, currentState) {
  return allStates[(currentState + 1) % allStates.length]
}

// Get reset the state of the value
function resetState (allStates, currentState) {
  return allStates[(currentState + 1) % 1]
}

// Update state counters when the step changes
function updateStateCounters (oldState, newState, data, states, index) {
  const humanity = data.name === 'system.humanity'
  const despair = data.name === 'system.despair'
  const desperation = data.name === 'system.desperation'
  const danger = data.name === 'system.danger'

  const fulls = parseInt(data[states['-']]) || 0
  const halfs = parseInt(data[states['/']]) || 0
  const crossed = parseInt(data[states.x]) || 0

  if ((oldState !== '' && oldState !== '-') || humanity || desperation || danger) {
    data[states[oldState]] = (parseInt(data[states[oldState]]) || 0) - 1
  }

  // Adjust maximum count if the step was removed
  if (oldState !== '' && newState === '' && !humanity && !despair && !desperation && !danger) {
    data[states['-']] = (parseInt(data[states['-']]) || 0) - 1
  }

  // Increment new state count
  if (newState !== '') {
    data[states[newState]] = (parseInt(data[states[newState]]) || 0) + Math.max(index + 1 - fulls - halfs - crossed, 1)
  }
}

// Calculate new values for all states
function calculateNewValue (states, data) {
  return Object.keys(states).reduce((newValue, stateKey) => {
    newValue[states[stateKey]] = parseInt(data[states[stateKey]]) || 0
    return newValue
  }, {})
}
