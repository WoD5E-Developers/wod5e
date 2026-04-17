export const _onToggleDropdown = async function (event, target) {
  event.preventDefault()

  const dropdown = target.closest('.multi-select').querySelector('.multi-select-dropdown')

  dropdown.classList.toggle('hidden')
}

export const _onUpdateFilter = async function (event, target) {
  event.preventDefault()

  const filter = target.closest('.multi-select')
  const type = filter.getAttribute('data-filter-type')
  const filterOption = target.getAttribute('data-id')
  const checkedStatus = target.checked
  const filterList = this.filters[type]

  // Update filter
  const option = filterList.find((o) => o.id === filterOption)
  if (option) {
    option.enabled = checkedStatus
  }

  this.render()
}
