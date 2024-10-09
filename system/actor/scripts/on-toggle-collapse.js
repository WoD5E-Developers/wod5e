export const _onToggleCollapse = async function (event, target) {
  event.preventDefault()

  $(target).toggleClass('active')

  const content = $(target).closest('.collapsible-container').find('.collapsible-content')

  if (content.css('maxHeight') === '0px') {
    content.css('maxHeight', content.prop('scrollHeight') + 'px')
  } else {
    content.css('maxHeight', '0px')
  }
}
