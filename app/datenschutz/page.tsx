import { Metadata } from 'next'
import { Shield, Server, Lock, Cookie, Eye, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description: 'Datenschutzerklärung von Danies Rezepte - Informationen zum Umgang mit personenbezogenen Daten gemäß DSGVO.',
}

export default function DatenschutzPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="glass p-8 md:p-12 rounded-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full mb-4">
            <Shield size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-fatfrank text-gray-800 mb-4">
            Datenschutzerklärung
          </h1>
          <p className="font-hoss text-xl text-gray-600">
            Informationen zum Umgang mit personenbezogenen Daten
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-fatfrank text-gray-800 mb-4">1. Datenschutz auf einen Blick</h2>

            <h3 className="text-xl font-fatfrank text-gray-800 mb-3">Allgemeine Hinweise</h3>
            <p className="font-hoss text-gray-700 mb-4">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
            </p>

            <h3 className="text-xl font-fatfrank text-gray-800 mb-3">Datenerfassung auf dieser Website</h3>
            <p className="font-hoss text-gray-700 mb-4">
              <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
            </p>

            <p className="font-hoss text-gray-700 mb-4">
              <strong>Wie erfassen wir Ihre Daten?</strong><br />
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
            </p>

            <p className="font-hoss text-gray-700 mb-4">
              Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-fatfrank text-gray-800 mb-4">2. Hosting</h2>
            <p className="font-hoss text-gray-700 mb-4">
              Diese Website wird auf Servern von Replit gehostet. Replit erhebt in sogenannten Logfiles folgende Daten:
            </p>
            <ul className="font-hoss text-gray-700 mb-4 list-disc ml-6">
              <li>IP-Adresse</li>
              <li>Referrer-URL (die zuvor besuchte Seite)</li>
              <li>Hostname des zugreifenden Rechners (IP-Adresse)</li>
              <li>Uhrzeit der Serveranfrage</li>
              <li>User-Agent</li>
            </ul>
            <p className="font-hoss text-gray-700">
              Rechtsgrundlage für die Datenverarbeitung ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in der Verbesserung, Stabilität, Funktionalität und Sicherheit unserer Website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-fatfrank text-gray-800 mb-4">3. Allgemeine Hinweise und Pflichtinformationen</h2>

            <h3 className="text-xl font-fatfrank text-gray-800 mb-3">Datenschutz</h3>
            <p className="font-hoss text-gray-700 mb-4">
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>

            <h3 className="text-xl font-fatfrank text-gray-800 mb-3">Hinweis zur verantwortlichen Stelle</h3>
            <p className="font-hoss text-gray-700 mb-4">
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
            </p>
            <p className="font-hoss text-gray-700 mb-4">
              Daniela Bentele<br />
              Mozartweg 9<br />
              88284 Wolpertswende<br />
              E-Mail: danie@danie.de
            </p>

            <h3 className="text-xl font-fatfrank text-gray-800 mb-3">Speicherdauer</h3>
            <p className="font-hoss text-gray-700 mb-4">
              Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-fatfrank text-gray-800 mb-4">4. Datenerfassung auf dieser Website</h2>

            <h3 className="text-xl font-fatfrank text-gray-800 mb-3">Server-Log-Dateien</h3>
            <p className="font-hoss text-gray-700 mb-4">
              Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
            </p>
            <ul className="font-hoss text-gray-700 mb-4 list-disc ml-6">
              <li>Browsertyp und Browserversion</li>
              <li>verwendetes Betriebssystem</li>
              <li>Referrer URL</li>
              <li>Hostname des zugreifenden Rechners</li>
              <li>Uhrzeit der Serveranfrage</li>
              <li>IP-Adresse</li>
            </ul>
            <p className="font-hoss text-gray-700">
              Diese Daten werden nicht mit anderen Datenquellen zusammengeführt. Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-fatfrank text-gray-800 mb-4">5. Plugins und Tools</h2>

            <h3 className="text-xl font-fatfrank text-gray-800 mb-3">Adobe Fonts (Typekit)</h3>
            <p className="font-hoss text-gray-700 mb-4">
              Diese Website nutzt zur einheitlichen Darstellung von Schriftarten so genannte Adobe Fonts, die von Adobe Systems Incorporated bereitgestellt werden. Beim Aufruf einer Seite lädt Ihr Browser die benötigten Schriftarten in ihren Browsercache, um Texte und Schriftarten korrekt anzuzeigen.
            </p>
            <p className="font-hoss text-gray-700 mb-4">
              Zu diesem Zweck muss der von Ihnen verwendete Browser Verbindung zu den Servern von Adobe in den USA aufnehmen. Hierdurch erlangt Adobe Kenntnis darüber, dass über Ihre IP-Adresse diese Website aufgerufen wurde.
            </p>
            <p className="font-hoss text-gray-700">
              Rechtsgrundlage für die Nutzung von Adobe Fonts ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in der einheitlichen Darstellung unseres Internetauftritts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-fatfrank text-gray-800 mb-4">6. Ihre Rechte</h2>
            <p className="font-hoss text-gray-700 mb-4">
              Sie haben folgende Rechte:
            </p>
            <ul className="font-hoss text-gray-700 mb-4 list-disc ml-6">
              <li>Recht auf Auskunft über Ihre bei uns gespeicherten personenbezogenen Daten</li>
              <li>Recht auf Berichtigung unrichtiger oder unvollständiger Daten</li>
              <li>Recht auf Löschung Ihrer bei uns gespeicherten Daten</li>
              <li>Recht auf Einschränkung der Datenverarbeitung</li>
              <li>Recht auf Datenübertragbarkeit</li>
              <li>Widerspruchsrecht gegen die Verarbeitung Ihrer Daten bei uns</li>
              <li>Recht auf Beschwerde bei einer Aufsichtsbehörde</li>
            </ul>
            <p className="font-hoss text-gray-700">
              Wenn Sie Fragen zum Datenschutz haben, schreiben Sie uns bitte eine E-Mail an: danie@danie.de
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-fatfrank text-gray-800 mb-4">7. SSL- bzw. TLS-Verschlüsselung</h2>
            <p className="font-hoss text-gray-700 mb-4">
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie zum Beispiel Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von &bdquo;http://&ldquo; auf &bdquo;https://&ldquo; wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
            </p>
            <p className="font-hoss text-gray-700">
              Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen werden.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-fatfrank text-gray-800 mb-4">8. Cookies</h2>
            <p className="font-hoss text-gray-700 mb-4">
              Unsere Website verwendet Cookies. Das sind kleine Textdateien, die von Ihrem Webbrowser auf Ihrem Endgerät zur Speicherung bestimmter Informationen abgelegt werden. Cookies können keine Programme ausführen oder Viren auf Ihren Computer übertragen.
            </p>
            <p className="font-hoss text-gray-700 mb-4">
              Wir verwenden Cookies, um unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen. Einige Cookies sind technisch notwendig für den Betrieb der Website (&bdquo;Session-Cookies&ldquo;).
            </p>
            <p className="font-hoss text-gray-700">
              Detaillierte Informationen zu unserer Cookie-Verwendung finden Sie in unserer <a href="/cookies" className="text-pink-600 hover:text-pink-700">Cookie-Richtlinie</a>.
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