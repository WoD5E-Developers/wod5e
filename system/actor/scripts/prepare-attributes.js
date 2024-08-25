import { Attributes } from '../../api/def/attributes.js'

export const prepareAttributes = async function (actor, actorData) {
  const attributes = {
    physical: [],
    social: [],
    mental: []
  }

  // Loop through each entry in the attributes list, get the data (if available), and then push to the containers
  const attributesList = Attributes.getList({})
  const actorAttributes = actorData.system?.attributes

  if (actorAttributes) {
    // Clean up non-existent attributes, such as custom ones that no longer exist
    const validAttributes = new Set(Object.keys(attributesList))
    for (const id of Object.keys(actorAttributes)) {
      if (!validAttributes.has(id)) {
        delete actorAttributes[id]
      }
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
        await actor.update({ [`system.attributes.${id}`]: { value: 1 } })

        attributeData = Object.assign({
          id,
          value: 1
        }, value)
      }

      // Push to the container in the appropriate type
      // as long as the attribute isn't "hidden"
      if (!attributeData.hidden) {
        if (!attributes[value.type]) attributes[value.type] = [] // Ensure the type exists
        attributes[value.type].push(attributeData)
      }
    }
  }

  return attributes
}
