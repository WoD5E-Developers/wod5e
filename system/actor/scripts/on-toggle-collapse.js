export const _onToggleCollapse = async function (event, target) {
  event.preventDefault()

  const content = target.closest('.collapsible-container').querySelector('.collapsible-content')
  if (content) {
    const computedMaxHeight = parseInt(window.getComputedStyle(content).maxHeight, 10)

    if (computedMaxHeight === 0) {
      content.style.maxHeight = content.scrollHeight + 'px'
    } else {
      content.style.maxHeight = '0px'
    }
  }
}
