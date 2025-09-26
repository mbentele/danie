'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type CookieConsent = {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

type CookieConsentContextType = {
  consent: CookieConsent | null
  showBanner: boolean
  acceptAll: () => void
  acceptNecessary: () => void
  updateConsent: (consent: CookieConsent) => void
  openPreferences: () => void
  closePreferences: () => void
  showPreferences: boolean
  isReopen: boolean
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined)

const COOKIE_NAME = 'cookie_consent'
const COOKIE_EXPIRY_DAYS = 365

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [isReopen, setIsReopen] = useState(false)

  useEffect(() => {
    // Check for existing consent
    const savedConsent = getCookieConsent()
    if (savedConsent) {
      setConsent(savedConsent)
      setShowBanner(false)
    } else {
      setShowBanner(true)
    }
  }, [])

  const acceptAll = () => {
    const allAccepted: CookieConsent = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    }
    saveConsent(allAccepted)
    setConsent(allAccepted)
    setShowBanner(false)
    // Only close preferences if it's not a reopen scenario
    if (!isReopen) {
      setShowPreferences(false)
    }
  }

  const acceptNecessary = () => {
    const necessaryOnly: CookieConsent = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    }
    saveConsent(necessaryOnly)
    setConsent(necessaryOnly)
    setShowBanner(false)
    // Only close preferences if it's not a reopen scenario
    if (!isReopen) {
      setShowPreferences(false)
    }
  }

  const updateConsent = (newConsent: CookieConsent) => {
    // Necessary cookies are always required
    const consent = { ...newConsent, necessary: true }
    saveConsent(consent)
    setConsent(consent)
    setShowBanner(false)
    // Only close preferences if it's not a reopen scenario
    if (!isReopen) {
      setShowPreferences(false)
    }
  }

  const openPreferences = () => {
    setShowPreferences(true)
    // Mark as reopen if consent already exists
    if (consent) {
      setIsReopen(true)
    }
  }

  const closePreferences = () => {
    setShowPreferences(false)
    setIsReopen(false)
  }

  return (
    <CookieConsentContext.Provider value={{
      consent,
      showBanner,
      acceptAll,
      acceptNecessary,
      updateConsent,
      openPreferences,
      closePreferences,
      showPreferences,
      isReopen,
    }}>
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext)
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider')
  }
  return context
}

// Helper functions
function getCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null

  try {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${COOKIE_NAME}=`))

    if (!cookie) return null

    const value = cookie.split('=')[1]
    return JSON.parse(decodeURIComponent(value))
  } catch (e) {
    return null
  }
}

function saveConsent(consent: CookieConsent) {
  if (typeof window === 'undefined') return

  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS)

  const cookieValue = encodeURIComponent(JSON.stringify(consent))
  document.cookie = `${COOKIE_NAME}=${cookieValue}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`
}

// Analytics helper
export function shouldLoadAnalytics(): boolean {
  const consent = getCookieConsent()
  return consent?.analytics || false
}

// Marketing helper
export function shouldLoadMarketing(): boolean {
  const consent = getCookieConsent()
  return consent?.marketing || false
}

// Functional helper
export function shouldLoadFunctional(): boolean {
  const consent = getCookieConsent()
  return consent?.functional || false
}