import { Metadata } from 'next'
import { Mail, Instagram, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kontakt - danie.de',
  description: 'Kontaktiere Daniela Bentele von danie.de - E-Mail oder Instagram für Fragen zu Rezepten und Kochtipps.',
}

export default function KontaktPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="glass p-8 md:p-12 rounded-3xl">
        <h1 className="text-4xl md:text-5xl font-fatfrank text-gray-800 mb-8 text-center">
          Kontakt
        </h1>

        <div className="text-center mb-12">
          <p className="font-hoss text-xl text-gray-700 mb-4">
            Hast du Fragen zu meinen Rezepten oder möchtest einfach &bdquo;Hallo&ldquo; sagen?
          </p>
          <p className="font-hoss text-lg text-gray-600">
            Ich freue mich über jede Nachricht!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* E-Mail Kontakt */}
          <div className="glass p-6 rounded-2xl text-center group hover:scale-105 transition-transform duration-200">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-500 text-white rounded-full mb-4">
              <Mail size={24} />
            </div>
            <h2 className="text-xl font-fatfrank text-gray-800 mb-3">E-Mail</h2>
            <p className="font-hoss text-gray-600 mb-4">
              Für Rezeptfragen, Feedback oder geschäftliche Anfragen
            </p>
            <a
              href="mailto:danie@danie.de"
              className="inline-flex items-center space-x-2 font-hoss font-semibold text-pink-600 hover:text-pink-700 transition-colors"
            >
              <span>danie@danie.de</span>
            </a>
          </div>

          {/* Instagram */}
          <div className="glass p-6 rounded-2xl text-center group hover:scale-105 transition-transform duration-200">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full mb-4">
              <Instagram size={24} />
            </div>
            <h2 className="text-xl font-fatfrank text-gray-800 mb-3">Instagram</h2>
            <p className="font-hoss text-gray-600 mb-4">
              Folge mir für täglich neue Rezepte und Kücheninspiration
            </p>
            <a
              href="https://instagram.com/daniesrezepte"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 font-hoss font-semibold text-pink-600 hover:text-pink-700 transition-colors"
            >
              <span>@daniesrezepte</span>
            </a>
          </div>
        </div>

        {/* Kontakt-Formular Placeholder */}
        <div className="glass p-8 rounded-2xl">
          <h2 className="text-2xl font-fatfrank text-gray-800 mb-6 text-center">
            Nachricht schreiben
          </h2>

          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block font-hoss font-semibold text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent font-hoss"
                  placeholder="Dein Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block font-hoss font-semibold text-gray-700 mb-2">
                  E-Mail *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent font-hoss"
                  placeholder="deine@email.de"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block font-hoss font-semibold text-gray-700 mb-2">
                Betreff
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent font-hoss"
                placeholder="Worum geht es?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block font-hoss font-semibold text-gray-700 mb-2">
                Nachricht *
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent font-hoss resize-none"
                placeholder="Schreib mir deine Nachricht..."
              ></textarea>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="btn-primary font-hoss font-semibold px-8 py-3 text-lg inline-flex items-center space-x-2"
              >
                <MessageCircle size={20} />
                <span>Nachricht senden</span>
              </button>
            </div>

            <p className="text-sm font-hoss text-gray-500 text-center">
              * Pflichtfelder. Deine Daten werden vertraulich behandelt und nicht an Dritte weitergegeben.
            </p>
          </form>
        </div>

        {/* Zusätzliche Infos */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
          <div className="glass p-6 rounded-2xl">
            <h3 className="font-fatfrank text-gray-800 mb-2">Antwortzeit</h3>
            <p className="font-hoss text-gray-600 text-sm">
              Ich antworte meist innerhalb von 24-48 Stunden
            </p>
          </div>
          <div className="glass p-6 rounded-2xl">
            <h3 className="font-fatfrank text-gray-800 mb-2">Rezeptfragen</h3>
            <p className="font-hoss text-gray-600 text-sm">
              Gerne helfe ich bei Fragen zu meinen Rezepten weiter
            </p>
          </div>
          <div className="glass p-6 rounded-2xl">
            <h3 className="font-fatfrank text-gray-800 mb-2">Feedback</h3>
            <p className="font-hoss text-gray-600 text-sm">
              Ich freue mich über Feedback und Verbesserungsvorschläge
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-12">
          <p className="font-hoss text-sm text-gray-500 text-center">
            Alternativ erreichst du mich auch über die sozialen Medien oder per E-Mail.
          </p>
        </div>
      </div>
    </main>
  )
}