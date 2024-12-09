/* global game */

import { Attributes } from '../../api/def/attributes.js'

export const prepareAttributes = async function (actor) {
  // Loop through each entry in the attributes list, get the data (if available), and then push to the containers
  // Use the sortDefAlphabetically setting to determine if we need to do sorting
  const attributesList = Attributes.getList({
    disableSort: game.settings.get('vtm5e', 'sortDefAlphabetically') === 'default'
  })
  const actorAttributes = actor.system?.attributes
  const computedAttributes = {}
  const sortedAttributes = {
    physical: [],
    social: [],
    mental: []
  }

  for (const [id, value] of Object.entries(attributesList)) {
    let attributeData = {}

    // If the actor has an attribute with the key, grab its current values
    if (Object.prototype.hasOwnProperty.call(actorAttributes, id)) {
      attributeData = Object.assign({
        id,
        value: actorAttributes[id].value
      }, value)
    } else { // Otherwise, add it to the actor and set it as some default data
      attributeData = Object.assign({
        id,
        value: 1
      }, value)
    }

    // Ensure the attribute exists
    if (!computedAttributes[id]) computedAttributes[id] = {}
    // Apply the attribute's data
    computedAttributes[id] = attributeData

    // Push to the container in the appropriate type
    // as long as the attribute isn't "hidden"
    if (!attributeData.hidden) {
      if (!sortedAttributes[value.type]) sortedAttributes[value.type] = [] // Ensure the type exists
      sortedAttributes[value.type].push(attributeData)
    }
  }

  return {
    attributes: computedAttributes,
    sortedAttributes
  }
}
