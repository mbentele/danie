import { Metadata } from 'next'
import { Scale, MapPin, Mail, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Rechtliche Informationen und Kontaktdaten von Danies Rezepte.',
}

export default function ImpressumPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="glass p-8 md:p-12 rounded-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-500 text-white rounded-full mb-4">
            <Scale size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-fatfrank text-gray-800 mb-4">
            Impressum
          </h1>
          <p className="font-hoss text-xl text-gray-600">
            Rechtliche Informationen gemäß § 5 TMG
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-fatfrank text-gray-800 mb-4 flex items-center">
              <MapPin className="text-pink-500 mr-3" size={20} />
              Angaben gemäß § 5 TMG
            </h2>
            <div className="glass p-6 rounded-2xl">
              <div className="font-hoss text-gray-700">
                <p className="text-lg font-semibold mb-2">Daniela Bentele</p>
                <p>Mozartweg 9</p>
                <p>88284 Wolpertswende</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-fatfrank text-gray-800 mb-4 flex items-center">
              <Mail className="text-pink-500 mr-3" size={20} />
              Kontakt
            </h2>
            <div className="glass p-6 rounded-2xl">
              <div className="font-hoss text-gray-700">
                <p className="mb-2">
                  <strong>E-Mail:</strong> <a href="mailto:danie@danie.de" className="text-pink-600 hover:text-pink-700">danie@danie.de</a>
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-fatfrank text-gray-800 mb-4">Art der Website</h2>
            <p className="font-hoss text-gray-700">
              Es handelt sich bei dieser Seite um eine private Homepage ohne kommerziellen Hintergrund.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-fatfrank text-gray-800 mb-4">Haftung für Inhalte</h2>
            <p className="font-hoss text-gray-700 mb-4">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <p className="font-hoss text-gray-700">
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-fatfrank text-gray-800 mb-4">Haftung für Links</h2>
            <p className="font-hoss text-gray-700 mb-4">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
            <p className="font-hoss text-gray-700 mb-4">
              Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
            </p>
            <p className="font-hoss text-gray-700">
              Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-fatfrank text-gray-800 mb-4">Urheberrecht</h2>
            <p className="font-hoss text-gray-700 mb-4">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
            <p className="font-hoss text-gray-700 mb-4">
              Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
            </p>
            <p className="font-hoss text-gray-700">
              Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-fatfrank text-gray-800 mb-4">Bildrechte und Markenzeichen</h2>
            <p className="font-hoss text-gray-700 mb-4">
              Alle auf dieser Website verwendeten Fotos sind Privateigentum der Seitenbetreiberin und unterliegen dem Urheberrecht.
            </p>
            <p className="font-hoss text-gray-700">
              Alle verwendeten Markenzeichen und Logos gehören ihren jeweiligen Eigentümern und werden nur zu Informationszwecken verwendet.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-fatfrank text-gray-800 mb-4">Haftungsausschluss für Rezepte</h2>
            <p className="font-hoss text-gray-700">
              Die auf dieser Website veröffentlichten Rezepte wurden nach bestem Wissen und Gewissen zusammengestellt. Eine Haftung für die Richtigkeit der Angaben und eventuelle Schäden durch die Verwendung der Rezepte kann nicht übernommen werden. Die Nutzung der Rezepte erfolgt auf eigene Gefahr.
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