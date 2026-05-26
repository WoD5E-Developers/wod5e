export const preparePatronSpiritContext = async function (context, item) {
  const itemData = item.system
  const patronSpirit = itemData.patronSpirit

  // Tab data
  context.tab = context.tabs.patronSpirit

  // Part-specific data
  context.patronSpirit = patronSpirit
  context.enrichedPatronSpiritDescription =
    await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      patronSpirit?.description || ''
    )
  context.enrichedFavor = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
    patronSpirit?.favor || ''
  )
  context.enrichedBan = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
    patronSpirit?.ban || ''
  )

  return context
}

export const prepareGuidingSpiritDetailsContext = async function (context, item) {
  const itemData = item.system

  // Tab data
  context.tab = context.tabs.details

  context.favor = itemData?.favor || ''
  context.ban = itemData?.ban || ''

  // Part-specific data
  context.enrichedFavor = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
    itemData?.favor || ''
  )
  context.enrichedBan = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
    itemData?.ban || ''
  )

  return context
}
