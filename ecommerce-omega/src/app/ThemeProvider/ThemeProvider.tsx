'use client'

import { useEffect, ReactNode } from 'react'

type Theme = {
  bg1: string
  bg2: string
  text1: string
  text2: string
  border: string
  border2: string
}

async function fetchTheme(): Promise<Theme> {
  const res = await fetch('/api/theme')
  return res.json()
}

function applyTheme(theme: Theme) {
  Object.entries(theme).forEach(([key, val]) => {
    document.documentElement.style.setProperty(`--color-${key}`, val)
  })
  localStorage.setItem('site-theme', JSON.stringify(theme))
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const cached = localStorage.getItem('site-theme')
    if (cached) applyTheme(JSON.parse(cached))
    fetchTheme().then(applyTheme).catch(() => {})
  }, [])

  return <>{children}</>
}
