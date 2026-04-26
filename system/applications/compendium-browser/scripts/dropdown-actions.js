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
  const filterPriority = target.getAttribute('data-filter-priority')
  const filterOption = target.getAttribute('data-id')
  const subtype = target.getAttribute('data-subtype')
  const checkedStatus = target.checked
  const filterList = this.filters[type].options
  const option = filterList.find((o) => o.id === filterOption)

  // Update primary priority filters
  if (filterPriority === 'primary') {
    if (option) {
      option.enabled = checkedStatus
    }

    if (type === 'splats' && option) {
      const typesToUpdate = this.filters.types.options.filter(
        (itemType) => itemType.splat === filterOption
      )

      typesToUpdate.forEach((itemType) => {
        itemType.hidden = !checkedStatus
      })
    }
  } else if (filterPriority === 'secondary') {
    if (option && option.enabled) {
      const subtypeOption = option.subtypes.find((o) => o.id === subtype)

      if (subtypeOption) {
        subtypeOption.enabled = checkedStatus
      }
    }
  }

  this.render()
}
