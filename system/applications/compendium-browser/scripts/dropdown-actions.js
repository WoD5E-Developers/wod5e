export const _onToggleDropdown = async function (event, target) {
  event.preventDefault()

  // Hide the dropdown
  const filter = target.closest('.multi-select')
  const type = filter.getAttribute('data-filter-type')
  const dropdown = filter.querySelector('.multi-select-dropdown')
  dropdown.classList.toggle('hidden')

  // Toggle the dropdown's state in the application
  const filterObject = this.filters[type]
  const option = filterObject.find((o) => o.id === type)
  if (option) {
    option.open = !option.open
  }

  this.render()
}

export const _onUpdateFilter = async function (event, target) {
  event.preventDefault()

  const filter = target.closest('.multi-select')
  const type = filter.getAttribute('data-filter-type')
  const filterOption = target.getAttribute('data-id')
  const checkedStatus = target.checked
  const filterList = this.filters[type].options

  // Update filter
  const option = filterList.find((o) => o.id === filterOption)
  if (option) {
    option.enabled = checkedStatus
  }

  this.render()
}
