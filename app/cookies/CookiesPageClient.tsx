'use client'

import { Cookie, Shield, Settings, Eye } from 'lucide-react'
import { useCookieConsent } from '@/lib/cookie-consent'

export default function CookiesPageClient() {
  const { openPreferences } = useCookieConsent()

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="glass p-8 md:p-12 rounded-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-500 text-white rounded-full mb-4">
            <Cookie size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-fatfrank text-gray-800 mb-4">
            Cookie-Richtlinie
          </h1>
          <p className="font-hoss text-xl text-gray-600">
            Wie wir Cookies auf danie.de verwenden
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-fatfrank text-gray-800 mb-4">Was sind Cookies?</h2>
            <p className="font-hoss text-gray-700 mb-4">
              Cookies sind kleine Textdateien, die von Websites auf Ihrem Computer oder mobilen Gerät gespeichert werden. Sie ermöglichen es der Website, sich an Ihre Aktionen und Präferenzen zu erinnern und Ihr Nutzererlebnis zu verbessern.
            </p>
            <p className="font-hoss text-gray-700">
              Cookies können keine Programme ausführen, Viren übertragen oder Ihre persönlichen Daten schädigen. Sie sind ein wichtiger Bestandteil moderner Websites und helfen dabei, Ihnen relevante Inhalte und Funktionen zu bieten.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-fatfrank text-gray-800 mb-4">Welche Cookies verwenden wir?</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Notwendige Cookies */}
              <div className="glass p-6 rounded-2xl">
                <div className="flex items-center mb-3">
                  <Shield className="text-green-600 mr-3" size={20} />
                  <h3 className="text-lg font-fatfrank text-gray-800">Notwendige Cookies</h3>
                </div>
                <p className="font-hoss text-gray-600 text-sm mb-3">
                  Diese Cookies sind für die grundlegende Funktionalität der Website erforderlich.
                </p>
                <ul className="font-hoss text-gray-600 text-sm list-disc ml-4 space-y-1">
                  <li>Session-Management</li>
                  <li>Sicherheitstoken</li>
                  <li>Cookie-Einstellungen</li>
                </ul>
                <div className="mt-3 text-xs font-hoss text-gray-500">
                  <strong>Speicherdauer:</strong> Session oder 30 Tage
                </div>
              </div>

              {/* Funktionale Cookies */}
              <div className="glass p-6 rounded-2xl">
                <div className="flex items-center mb-3">
                  <Settings className="text-blue-600 mr-3" size={20} />
                  <h3 className="text-lg font-fatfrank text-gray-800">Funktionale Cookies</h3>
                </div>
                <p className="font-hoss text-gray-600 text-sm mb-3">
                  Diese Cookies verbessern die Funktionalität und Personalisierung der Website.
                </p>
                <ul className="font-hoss text-gray-600 text-sm list-disc ml-4 space-y-1">
                  <li>Präferenzen speichern</li>
                  <li>Spracheinstellungen</li>
                  <li>Layout-Einstellungen</li>
                </ul>
                <div className="mt-3 text-xs font-hoss text-gray-500">
                  <strong>Speicherdauer:</strong> 1 Jahr
                </div>
              </div>

              {/* Analyse Cookies */}
              <div className="glass p-6 rounded-2xl">
                <div className="flex items-center mb-3">
                  <Eye className="text-purple-600 mr-3" size={20} />
                  <h3 className="text-lg font-fatfrank text-gray-800">Analyse-Cookies</h3>
                </div>
                <p className="font-hoss text-gray-600 text-sm mb-3">
                  Diese Cookies helfen uns zu verstehen, wie Besucher die Website nutzen.
                </p>
                <ul className="font-hoss text-gray-600 text-sm list-disc ml-4 space-y-1">
                  <li>Besucherstatistiken</li>
                  <li>Seitenaufrufe</li>
                  <li>Verweildauer</li>
                </ul>
                <div className="mt-3 text-xs font-hoss text-gray-500">
                  <strong>Speicherdauer:</strong> 2 Jahre
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="glass p-6 rounded-2xl">
                <div className="flex items-center mb-3">
                  <Cookie className="text-orange-600 mr-3" size={20} />
                  <h3 className="text-lg font-fatfrank text-gray-800">Marketing-Cookies</h3>
                </div>
                <p className="font-hoss text-gray-600 text-sm mb-3">
                  Diese Cookies werden für Werbezwecke und personalisierte Inhalte verwendet.
                </p>
                <ul className="font-hoss text-gray-600 text-sm list-disc ml-4 space-y-1">
                  <li>Soziale Medien</li>
                  <li>Werbeanzeigen</li>
                  <li>Tracking-Pixel</li>
                </ul>
                <div className="mt-3 text-xs font-hoss text-gray-500">
                  <strong>Speicherdauer:</strong> 1-2 Jahre
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-fatfrank text-gray-800 mb-4">Ihre Cookie-Einstellungen verwalten</h2>
            <p className="font-hoss text-gray-700 mb-4">
              Sie haben verschiedene Möglichkeiten, Cookies zu kontrollieren und zu verwalten:
            </p>

            <div className="space-y-4">
              <div className="glass p-4 rounded-xl">
                <h3 className="font-fatfrank text-gray-800 mb-2">Cookie-Banner</h3>
                <p className="font-hoss text-gray-600 text-sm">
                  Verwenden Sie unser Cookie-Banner beim ersten Besuch der Website, um Ihre Präferenzen festzulegen.
                </p>
              </div>

              <div className="glass p-4 rounded-xl">
                <h3 className="font-fatfrank text-gray-800 mb-2">Browser-Einstellungen</h3>
                <p className="font-hoss text-gray-600 text-sm">
                  Die meisten Browser ermöglichen es Ihnen, Cookies zu blockieren, zu löschen oder Benachrichtigungen für Cookies zu aktivieren.
                </p>
              </div>

              <div className="glass p-4 rounded-xl">
                <h3 className="font-fatfrank text-gray-800 mb-2">Opt-Out-Tools</h3>
                <p className="font-hoss text-gray-600 text-sm">
                  Verwenden Sie spezielle Tools wie das Google Analytics Opt-Out Browser-Add-on, um bestimmte Tracking-Cookies zu deaktivieren.
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                className="btn-primary font-hoss font-semibold px-6 py-3"
                onClick={openPreferences}
              >
                Cookie-Einstellungen ändern
              </button>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-fatfrank text-gray-800 mb-4">Kontakt</h2>
            <p className="font-hoss text-gray-700 mb-4">
              Bei Fragen zu unserer Cookie-Verwendung kontaktieren Sie uns gerne:
            </p>
            <p className="font-hoss text-gray-700">
              E-Mail: <a href="mailto:danie@danie.de" className="text-pink-600 hover:text-pink-700">danie@danie.de</a><br />
              Weitere Informationen finden Sie in unserer <a href="/datenschutz" className="text-pink-600 hover:text-pink-700">Datenschutzerklärung</a>.
            </p>
          </section>

          <div className="border-t border-gray-200 pt-6 mt-12">
            <p className="font-hoss text-sm text-gray-500 text-center">
              Letzte Aktualisierung: {new Date().toLocaleDateString('de-DE')}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}