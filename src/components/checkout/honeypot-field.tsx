'use client'

interface HoneypotFieldProps {
  readonly id: string
  readonly value: string
  readonly onChange: (value: string) => void
}

/**
 * Hidden from people, irresistible to bots.
 *
 * It sits outside the animated steps so it is in the DOM whichever step is on
 * screen, and it is left out of the progress indicator and the review entirely
 * so nothing on the page ever hints that it exists.
 */
export function HoneypotField({ id, value, onChange }: HoneypotFieldProps) {
  return (
    <div aria-hidden="true" className="visually-hidden">
      <label htmlFor={id}>Leave this field empty</label>
      <input
        id={id}
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
