export const _onOpenItem = function (event, target) {
  const itemUuid = target.getAttribute('data-uuid')

  fromUuidSync(itemUuid).sheet.render(true)
}
