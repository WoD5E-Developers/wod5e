export const _onToggleCollapse = async function (event, target) {
  event.preventDefault()

  const content = target.closest('.collapsible-container').querySelector('.collapsible-content')

  if (content.css('maxHeight') === '0px') {
    content.style.setProperty('maxHeight', content.prop('scrollHeight') + 'px')
  } else {
    content.style.setProperty('maxHeight', '0px')
  }
}
