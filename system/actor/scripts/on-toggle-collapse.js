export const _onToggleCollapse = async function (event) {
  event.preventDefault()

  const target = $(event.currentTarget)

  target.toggleClass('active')

  const content = target.closest('.collapsible-container').find('.collapsible-content')

  if (content.css('maxHeight') === '0px') {
    content.css('maxHeight', content.prop('scrollHeight') + 'px')
  } else {
    content.css('maxHeight', '0px')
  }
}
