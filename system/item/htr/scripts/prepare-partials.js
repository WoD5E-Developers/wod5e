/* global foundry */

export const prepareRedemptionContext = async function (context, item) {
  const itemData = item.system

  // Tab data
  context.tab = context.tabs.redemption

  // Part-specific data
  context.redemption = itemData.redemption
  context.enrichedRedemption = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
    itemData.redemption
  )

  return context
}

export const prepareCreedDetailsContext = async function (context, item) {
  const itemData = item.system

  // Tab data
  context.tab = context.tabs.creedDetails

  context.edges = itemData.edges
  context.drives = itemData.drives
  context.desperationFields = itemData.desperationFields

  return context
}
