/**
 * Prepare context for the Magick tab.
 *
 * Left column: Affiliation/Tradition (Concept/Chronicle style) and
 * Paradigm/Practice/Tools (Tenets/Touchstones style, prose-mirror enriched,
 * no visibility toggle).
 * Right column: Arete, Paradox, Quintessence, Quiet, Hubris — all dot tracks.
 */
export const prepareMagickContext = async function (context, actor) {
  const actorData = actor.system
  const enrich = foundry.applications.ux.TextEditor.implementation.enrichHTML

  context.tab = context.tabs.magick

  context.affiliation = actorData.affiliation
  context.tradition   = actorData.tradition
  context.essence     = actorData.essence

  context.paradigm = actorData.paradigm
  context.enrichedParadigm = await enrich(actorData.paradigm ?? '')

  context.practice = actorData.practice
  context.enrichedPractice = await enrich(actorData.practice ?? '')

  context.tools = actorData.tools
  context.enrichedTools = await enrich(actorData.tools ?? '')

  context.arete        = actorData.arete
  context.paradox      = actorData.paradox
  context.quintessence = actorData.quintessence
  context.quiet        = actorData.quiet
  context.hubris       = actorData.hubris

  return context
}
