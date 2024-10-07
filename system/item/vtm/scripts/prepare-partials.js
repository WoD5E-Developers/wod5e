/* global TextEditor */

export const prepareBaneContext = async function (context, item) {
  const itemData = item.system

  // Tab data
  context.tab = context.tabs.bane

  // Part-specific data
  context.bane = itemData.bane
  context.enrichedBane = await TextEditor.enrichHTML(itemData.bane)

  return context
}
