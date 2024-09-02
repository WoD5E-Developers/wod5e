import { Attributes } from '../../api/def/attributes.js'

export const prepareAttributes = async function (actor) {
  // Loop through each entry in the attributes list, get the data (if available), and then push to the containers
  const attributesList = Attributes.getList({})
  const attributes = actor.system?.attributes
  const sortedAttributes = {
    physical: [],
    social: [],
    mental: []
  }

  if (attributes) {
    // Clean up non-existent attributes, such as custom ones that no longer exist
    const validAttributes = new Set(Object.keys(attributesList))
    for (const id of Object.keys(attributes)) {
      if (!validAttributes.has(id)) {
        delete attributes[id]
      }
    }

    for (const [id, value] of Object.entries(attributesList)) {
      let attributeData = {}

      // If the actor has an attribute with the key, grab its current values
      if (Object.prototype.hasOwnProperty.call(attributes, id)) {
        attributeData = Object.assign({
          id,
          value: attributes[id].value
        }, value)
      } else { // Otherwise, add it to the actor and set it as some default data
        attributeData = Object.assign({
          id,
          value: 1
        }, value)
      }

      // Push to the container in the appropriate type
      // as long as the attribute isn't "hidden"
      if (!attributeData.hidden) {
        if (!sortedAttributes[value.type]) sortedAttributes[value.type] = [] // Ensure the type exists
        sortedAttributes[value.type].push(attributeData)
      }
    }
  }

  return {
    attributes,
    sortedAttributes
  }
}
