/**
 * Prepare context for the Magick tab.
 * Spheres now live in the Stats tab, so this tab covers only:
 *   Arete, Paradox, Permanent Paradox, Quiet, Hubris, Absorb Quintessence.
 */
export const prepareMagickContext = async function (context, actor) {
  const actorData = actor.system

  context.tab = context.tabs.magick

  context.arete            = actorData.arete
  context.paradox          = actorData.paradox
  context.permanentParadox = actorData.permanentParadox
  context.quiet            = actorData.quiet
  context.hubris           = actorData.hubris

  // Expose per-roll Quintessence dice for any tooltip that needs it
  const primeSphere = actorData.spheres?.prime ?? 0
  context.quintessencePerRoll = Math.max(1, actorData.arete + primeSphere)

  return context
}
