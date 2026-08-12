import { useEffect, useState } from 'react'

export function useScrollPercent() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight
      setPct(height > 0 ? Math.round((window.scrollY / height) * 100) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return pct
}
