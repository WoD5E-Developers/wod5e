import { Spheres } from '../../../api/def/spheres.js'

/**
 * Build the full spheres map for an actor, merging the definition list
 * with any stored actor data. Attaches matching 'power' items to each sphere.
 * Mirrors prepareDisciplines() from the VTM system exactly.
 */
export const prepareSpheres = async function (actor) {
  const spheresList = Spheres.getList({})
  const actorSpheres = actor.system?.spheres ?? {}
  const arete = actor.system?.arete ?? 1
  const computedSpheres = {}

  for (const [id, value] of Object.entries(spheresList)) {
    let sphereData = {}

    if (Object.prototype.hasOwnProperty.call(actorSpheres, id)) {
      sphereData = Object.assign(
        {
          id,
          value: actorSpheres[id].value || 0,
          powers: actorSpheres[id].powers || [],
          description: actorSpheres[id]?.description || '',
          visible: actorSpheres[id].visible,
          selected: actorSpheres[id].selected || false
        },
        value
      )
    } else {
      sphereData = Object.assign(
        {
          id,
          value: 0,
          visible: false,
          description: '',
          powers: [],
          selected: false
        },
        value
      )
    }

    if (!computedSpheres[id]) computedSpheres[id] = {}
    computedSpheres[id] = sphereData

    if (sphereData.hidden) {
      computedSpheres[id].visible = false
    }

    // Attach sphere powers (power items whose discipline field matches this sphere id)
    computedSpheres[id].powers = actor.items.filter(
      (item) => item.type === 'power' && item.system.discipline === id
    )

    // Expose whether any powers exceed the current Arete cap
    computedSpheres[id].exceedsArete = sphereData.value > arete
  }

  return computedSpheres
}

/**
 * Sort sphere powers by level, then alphabetically.
 * Mirrors prepareDisciplinePowers() exactly.
 */
export const prepareSpherePowers = async function (spheres) {
  for (const sphereType in spheres) {
    if (Object.prototype.hasOwnProperty.call(spheres, sphereType)) {
      const sphere = spheres[sphereType]

      if (sphere && Array.isArray(sphere.powers)) {
        if (sphere.powers.length > 0) {
          if (!sphere.visible && !sphere.hidden) sphere.visible = true

          sphere.powers = sphere.powers.sort(function (p1, p2) {
            const level1 = p1.system ? p1.system.level : 0
            const level2 = p2.system ? p2.system.level : 0

            if (level1 === level2) return p1.name.localeCompare(p2.name)
            return level1 - level2
          })
        }
      } else {
        console.warn(
          `World of Darkness 5e | Sphere ${sphereType} is missing or powers is not an array.`
        )
      }
    }
  }

  return spheres
}
