import { useEffect, useState } from 'react'

export function useTypedName(name: string) {
  const [typed, setTyped] = useState('')

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      i++
      setTyped(name.slice(0, i))
      if (i >= name.length) clearInterval(timer)
    }, 90)
    return () => clearInterval(timer)
  }, [name])

  return typed
}
