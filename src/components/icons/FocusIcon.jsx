import focusIcon from './focus.svg'

function FocusIcon({ className = 'focus-icon' }) {
  return (
    <img
      src={focusIcon}
      alt="Focus"
      className={className}
    />
  )
}

export default FocusIcon
