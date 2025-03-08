import { FormEvent, useState } from 'react'

export const useField = (name: string, type: string, val: string | number='') => {
  const [value, setValue] = useState(val)


  const onChange = (event: FormEvent | string) => {
    if (typeof event === 'string') {
      setValue(event)
    } else {
      setValue((event.target as HTMLInputElement).value)
    }
  }
  const reset = () => setValue('')

  return {
    name,
    value,
    reset,
    type,
    onChange,
    required: true,
  }
}