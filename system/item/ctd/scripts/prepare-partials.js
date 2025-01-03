/* global TextEditor */

export const prepareLegacyBanContext = async function (context, item) {
    const itemData = item.system
  
    // Tab data
    context.tab = context.tabs.ban
  
    // Part-specific data
    context.ban = itemData.ban
    context.enrichedBan = await TextEditor.enrichHTML(itemData.ban)
  
    return context
  }

  export const prepareKithFrailtyContext = async function (context, item) {
    const itemData = item.system
  
    // Tab data
    context.tab = context.tabs.frailty
  
    // Part-specific data
    context.frailty = itemData.frailty
    context.enrichedFrailty = await TextEditor.enrichHTML(itemData.frailty)
  
    return context
  }
  