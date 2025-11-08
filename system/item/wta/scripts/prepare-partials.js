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
