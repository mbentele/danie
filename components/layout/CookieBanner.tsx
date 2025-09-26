'use client'

import { useState, useEffect } from 'react'
import { Cookie, Settings, X, Shield, Eye, Zap, Target } from 'lucide-react'
import { useCookieConsent } from '@/lib/cookie-consent'

export function CookieBanner() {
  const {
    showBanner,
    showPreferences,
    acceptAll,
    acceptNecessary,
    updateConsent,
    openPreferences,
    closePreferences,
    consent,
    isReopen
  } = useCookieConsent()

  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: consent?.functional || false,
    analytics: consent?.analytics || false,
    marketing: consent?.marketing || false,
  })

  // Update preferences when consent changes or modal opens
  useEffect(() => {
    if (showPreferences && consent) {
      setPreferences({
        necessary: true,
        functional: consent.functional,
        analytics: consent.analytics,
        marketing: consent.marketing,
      })
    }
  }, [showPreferences, consent])

  const handlePreferenceChange = (type: keyof typeof preferences) => {
    if (type === 'necessary') return // Can't disable necessary cookies

    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const handleSavePreferences = () => {
    updateConsent(preferences)
  }

  const handleAcceptAll = () => {
    // Set all toggles to active state
    const allPreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    }
    setPreferences(allPreferences)
    // Accept all cookies
    acceptAll()
  }

  if (!showBanner && !showPreferences) return null

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              {/* Icon & Text */}
              <div className="flex-1 flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center">
                  <Cookie size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-fatfrank text-lg text-gray-800 mb-2">
                    Wir verwenden Cookies
                  </h3>
                  <p className="font-hoss text-sm text-gray-600 mb-2">
                    Diese Website verwendet Cookies, um Ihnen die bestmögliche Erfahrung zu bieten.
                    Notwendige Cookies sind für die Grundfunktionen erforderlich, während andere Cookies
                    uns helfen, die Website zu verbessern und Ihnen personalisierte Inhalte anzuzeigen.
                  </p>
                  <a
                    href="/cookies"
                    className="font-hoss text-sm text-pink-600 hover:text-pink-700 underline"
                  >
                    Mehr über Cookies erfahren
                  </a>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <button
                  onClick={openPreferences}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-hoss text-sm"
                >
                  <Settings size={16} />
                  Einstellungen
                </button>
                <button
                  onClick={acceptNecessary}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-hoss text-sm"
                >
                  Nur notwendige
                </button>
                <button
                  onClick={acceptAll}
                  className="px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors font-hoss text-sm font-semibold"
                >
                  Alle akzeptieren
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center">
                  <Cookie size={20} />
                </div>
                <h2 className="text-xl font-fatfrank text-gray-800">Cookie-Einstellungen</h2>
              </div>
              <button
                onClick={closePreferences}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <p className="font-hoss text-gray-600">
                Wählen Sie aus, welche Cookies Sie zulassen möchten. Sie können diese Einstellungen
                jederzeit über den Link im Footer ändern.
              </p>

              {/* Cookie Categories */}
              <div className="space-y-4">
                {/* Necessary */}
                <div className="glass p-4 rounded-2xl">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Shield className="text-green-600" size={20} />
                      <div>
                        <h3 className="font-fatfrank text-gray-800">Notwendige Cookies</h3>
                        <p className="font-hoss text-sm text-gray-600">
                          Erforderlich für die Grundfunktionen der Website
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled={true}
                        className="w-4 h-4 text-green-600 rounded border-gray-300"
                      />
                      <span className="ml-2 font-hoss text-xs text-gray-500">Immer aktiv</span>
                    </div>
                  </div>
                  <p className="font-hoss text-xs text-gray-500 ml-8">
                    Session-Management, Sicherheit, Cookie-Einstellungen
                  </p>
                </div>

                {/* Functional */}
                <div className="glass p-4 rounded-2xl">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Zap className="text-blue-600" size={20} />
                      <div>
                        <h3 className="font-fatfrank text-gray-800">Funktionale Cookies</h3>
                        <p className="font-hoss text-sm text-gray-600">
                          Verbessern die Funktionalität und Personalisierung
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={() => handlePreferenceChange('functional')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                  </div>
                  <p className="font-hoss text-xs text-gray-500 ml-8">
                    Präferenzen, Spracheinstellungen, Layout-Anpassungen
                  </p>
                </div>

                {/* Analytics */}
                <div className="glass p-4 rounded-2xl">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Eye className="text-purple-600" size={20} />
                      <div>
                        <h3 className="font-fatfrank text-gray-800">Analyse-Cookies</h3>
                        <p className="font-hoss text-sm text-gray-600">
                          Helfen uns die Website-Nutzung zu verstehen
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={() => handlePreferenceChange('analytics')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                  </div>
                  <p className="font-hoss text-xs text-gray-500 ml-8">
                    Google Analytics, Besucherstatistiken, Seitenaufrufe
                  </p>
                </div>

                {/* Marketing */}
                <div className="glass p-4 rounded-2xl">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Target className="text-orange-600" size={20} />
                      <div>
                        <h3 className="font-fatfrank text-gray-800">Marketing-Cookies</h3>
                        <p className="font-hoss text-sm text-gray-600">
                          Für personalisierte Werbung und soziale Medien
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={() => handlePreferenceChange('marketing')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                  </div>
                  <p className="font-hoss text-xs text-gray-500 ml-8">
                    Instagram-Integration, Tracking-Pixel, personalisierte Inhalte
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex-1 text-center sm:text-left">
                <a
                  href="/cookies"
                  className="font-hoss text-sm text-pink-600 hover:text-pink-700 underline"
                >
                  Mehr über Cookies erfahren
                </a>
              </div>
              <div className="flex gap-2">
                {isReopen && (
                  <button
                    onClick={closePreferences}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-hoss text-sm"
                  >
                    Schließen
                  </button>
                )}
                <button
                  onClick={acceptNecessary}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-hoss text-sm"
                >
                  Nur notwendige
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-hoss text-sm font-semibold"
                >
                  Alle akzeptieren
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors font-hoss text-sm font-semibold"
                >
                  Einstellungen speichern
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}