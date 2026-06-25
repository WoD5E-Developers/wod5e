import { prepareSpheres, prepareSpherePowers } from './prepare-data.js'

/**
 * Prepare context for the Spheres tab.
 * Mirrors prepareDisciplinesContext() from VTM.
 */
export const prepareSpheresContext = async function (context, actor) {
  const actorData = actor.system

  context.tab = context.tabs.spheres

  context.spheres = await prepareSpherePowers(await prepareSpheres(actor))
  context.arete = actorData.arete

  if (actorData?.selectedSphere) {
    context.selectedSphere = actorData.spheres[actorData.selectedSphere]
    context.enrichedSelectedSphereDescription =
      await foundry.applications.ux.TextEditor.implementation.enrichHTML(
        context.selectedSphere?.description || ''
      )
  }

  if (actorData?.selectedSpherePower) {
    context.selectedSpherePower = await actor.items.get(actorData.selectedSpherePower)

    if (context.selectedSpherePower?.system?.description) {
      context.selectedSpherePowerDescription =
        await foundry.applications.ux.TextEditor.implementation.enrichHTML(
          context.selectedSpherePower.system.description
        )
    }
  }

  return context
}

/**
 * Prepare context for the Magick tab (Arete, Paradox, Quintessence, Quiet, Hubris).
 */
export const prepareMagickContext = async function (context, actor) {
  const actorData = actor.system

  context.tab = context.tabs.magick

  context.arete = actorData.arete
  context.paradox = actorData.paradox
  context.permanentParadox = actorData.permanentParadox
  context.quiet = actorData.quiet
  context.hubris = actorData.hubris

  // Expose max Quintessence per roll for display in the tab
  const primeSphere = actorData.spheres?.prime?.value ?? 0
  context.quintessencePerRoll = Math.max(1, actorData.arete + primeSphere)

  return context
}
