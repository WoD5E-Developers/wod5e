/* global foundry */

/**
 * Function to help collect any situational modifiers
 *
 * @param actor                     The actor that the modifiers are being looked up from
 * @param selectors                 All selectors that the function will look for
 */
export async function getSituationalModifiers ({
  actor,
  selectors
}) {
  // Variables
  const data = actor.system
  const allModifiers = getModifiers(data, selectors)
  const activeModifiers = filterModifiers(data, allModifiers)

  // Return the array of modifiers to whatever called for it
  return activeModifiers

  // Function to parse through the actor's data and retrieve any modifiers
  // that match any of the selectors given
  function getModifiers (data, selectors) {
    const modifiers = []

    // Add all modifiers we get from items to start
    if (!foundry.utils.isEmpty(data?.itemModifiers) && Array.isArray(data?.itemModifiers)) {
      // Check for matching modifiers, or 'all'
      const matchingModifiers = data.itemModifiers.filter(bonus =>
        selectors.some(selector => bonus.paths.includes(selector)) || bonus.paths.includes('all')
      )

      // If there are any matching modifiers, push it to the modifiers list
      if (matchingModifiers.length > 0) {
        modifiers.push(...matchingModifiers)
      }
    }

    // Run a search for modifiers within the actor's data
    searchModifiers(data, '')
    function searchModifiers (obj, path) {
      // Ensure that we're receiving a valid object
      if (typeof obj !== 'object' || obj === null) {
        return
      }

      // Don't search items
      if (typeof obj === 'object' && obj.documentName === 'Item') {
        return
      }

      // Check if there's a "bonuses" path that is an array
      if (obj.bonuses && Array.isArray(obj.bonuses)) {
        // Check for matching modifiers, or 'all'
        const matchingModifiers = obj.bonuses.filter(modifier =>
          selectors.some(selector => modifier.paths.includes(selector)) || modifier.paths.includes('all')
        )

        // If there are any matching modifiers, push it to the modifiers list
        if (matchingModifiers.length > 0) {
          modifiers.push(...matchingModifiers)
        }
      }

      // If there are further objects to search, search those for bonuses as well
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key

        if (typeof value === 'object' && value !== null) {
          searchModifiers(value, currentPath)
        }
      })
    }

    return modifiers
  }

  // Filter out only modifiers that apply to the roll we're doing
  function filterModifiers (data, modifiers) {
    return modifiers.filter(modifier => {
      const { check, path, value } = modifier?.activeWhen || {}
      const displayWhenInactive = modifier?.displayWhenInactive || ''
      const unless = modifier?.unless || ''
      let showModifier = false

      // Check if any 'unless' strings are present in the 'selectors' array
      if (unless && unless.some(value => selectors.indexOf(value) !== -1)) {
        modifier.isActive = false
        return false
      }

      // As long as the path is found, the modifier will be active
      if (check === 'always') {
        modifier.isActive = true
        showModifier = true
      }

      // If the path has a qualifier, it's checked for here
      if (check === 'isEqual') {
        const pathValue = path.split('.').reduce((obj, key) => obj[key], data)
        modifier.isActive = true

        // Check both number and string values
        showModifier = String(pathValue) === String(value) || Number(pathValue) === Number(value)
      }

      // If the qualifier is the path, the modifier will be active
      if (check === 'isPath' && selectors.indexOf(path) > -1) {
        modifier.isActive = true
        showModifier = true
      }

      // If the modifier should be shown no matter what, still show it but don't make it active
      if (displayWhenInactive && !modifier.isActive) {
        modifier.isActive = false
        showModifier = true
      }

      return showModifier
    })
  }
}

/**
 * A function that wraps around getSituationalModifiers, but returns
 * the total active modifiers amount as a number instead of an array
 * of all the modifiers as objects
 *
 * @param actor                     The actor that the modifiers are being looked up from
 * @param selectors                 All selectors that the function will look for
 */
export async function getActiveModifiers ({
  actor,
  selectors
}) {
  const situationalModifiers = await getSituationalModifiers({
    actor,
    selectors
  })
  const activeModifiers = situationalModifiers.filter(modifier => modifier.isActive === true)
  let totalValue = 0
  let totalACDValue = 0

  activeModifiers.forEach((modifier) => {
    totalValue += parseInt(modifier.value)

    if (modifier.advancedCheckDice) {
      totalACDValue += parseInt(modifier.advancedCheckDice)
    }
  })

  return {
    totalValue,
    totalACDValue
  }
}
