import { useEffect, useState } from 'react'

const WEATHER_CODES: Record<number, string> = {
  0: 'clear',
  1: 'mostly clear',
  2: 'partly cloudy',
  3: 'overcast',
  45: 'fog',
  48: 'fog',
  51: 'drizzle',
  53: 'drizzle',
  55: 'drizzle',
  61: 'rain',
  63: 'rain',
  65: 'heavy rain',
  71: 'snow',
  73: 'snow',
  75: 'heavy snow',
  80: 'showers',
  81: 'showers',
  82: 'heavy showers',
  95: 'thunderstorm',
}

export function useWeather() {
  const [weather, setWeather] = useState('weather: loading...')

  useEffect(() => {
    const load = async (lat: number, lon: number) => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
        )
        const data = await res.json()
        const cw = data.current_weather
        const desc = WEATHER_CODES[cw.weathercode] ?? 'unknown'
        setWeather(`${Math.round(cw.temperature)}°C ${desc}`)
      } catch {
        setWeather('weather: n/a')
      }
    }

    load(52.52, 13.405)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => load(pos.coords.latitude, pos.coords.longitude),
        () => {},
      )
    }
  }, [])

  return weather
}
