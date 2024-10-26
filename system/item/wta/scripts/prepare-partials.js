/* global TextEditor */

export const preparePatronSpiritContext = async function (context, item) {
  const itemData = item.system
  const patronSpirit = itemData.patronSpirit

  // Tab data
  context.tab = context.tabs.patronSpirit

  // Part-specific data
  context.patronSpirit = patronSpirit
  context.enrichedPatronSpiritDescription = await TextEditor.enrichHTML(patronSpirit?.description || '')
  context.enrichedFavor = await TextEditor.enrichHTML(patronSpirit?.favor || '')
  context.enrichedBan = await TextEditor.enrichHTML(patronSpirit?.ban || '')

  return context
}
