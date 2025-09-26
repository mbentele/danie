import Image from 'next/image'

export const metadata = {
  title: 'Über mich',
  description: 'Erfahre mehr über Danie und ihre Leidenschaft für leckere Rezepte aus der Alltagsküche.',
}

export default function UeberMichPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-fatfrank text-gradient mb-6">
            Über mich
          </h1>
          <p className="text-xl text-gray-600 font-hoss max-w-2xl mx-auto">
            Hallo, ich bin Danie! Schön, dass du hier bist.
          </p>
        </div>

        {/* Content with Image Left and Text Right */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Left */}
          <div className="lg:w-1/3 flex-shrink-0">
            <div className="glass rounded-2xl overflow-hidden">
              <Image
                src="https://www.danie.de/wp-content/uploads/2020/05/6853B3CB-D5E3-4F60-A055-7F74FD544D76.jpeg"
                alt="Danie - Leidenschaftliche Köchin"
                width={440}
                height={550}
                className="w-full h-auto object-cover scale-110"
              />
            </div>
          </div>

          {/* Text Right - Same Height as Image */}
          <div className="lg:w-2/3 space-y-6 font-hoss text-gray-700 leading-relaxed">
            <p>
              Mein Name ist Danie, eigentlich Daniela, ich wohne im schönen Oberschwaben in der Nähe von Ravensburg und bin Jahrgang 1977. Ich bin ein richtiges Landei und kann mir nicht vorstellen, hier jemals ohne triftigen Grund wegzuziehen. Beruflich komme ich aus dem Reisebüro, war zeitweise mit Herz und Seele Mama und Hausfrau, habe aber in den letzten Jahren wieder diverse andere berufliche Erfahrungen gesammelt und bin nun seit Sommer 2018 im Schulsekretariat angekommen, wo ich mich pudelwohl fühle. Mir gefällt der Trubel, die Abwechslung zwischen Kopfarbeit und zwischenmenschlichen Beziehungen am Arbeitsplatz sehr gut und ich möchte diese Aufgabe nicht mehr missen.
            </p>
            <br />
          </div>
        </div>

        {/* Full Width Text Below - DIREKT unter dem Bild */}
        <div className="space-y-6 font-hoss text-gray-700 leading-relaxed mb-16">
          <p>
            Das Kochen ist für mich ein wunderbarer kreativer Ausgleich zur Arbeit, in der Küche komme ich zur Ruhe, kann mich „austoben" und habe dort viel Zeit, um nachzudenken. Auch findet ihr mich viel draußen in der Natur, ich gehe sehr gerne spazieren, wandern… ebenso liebe ich es mich mit Freunden zu treffen, zu reisen, zu lesen und zu malen… ihr seht, immer was zu tun bei mir. Stillsitzen fällt mir schwer und ich bin immer am herumwuseln.
          </p>

          <p>
            Die Leidenschaft für die Küche ist erst mit den Jahren gewachsen. So habe ich, frisch zuhause, mit Anfang 20 zuhause ausgezogen, meine Kochkünste zuerst einmal mit Fix-Produkten zum, Besten gegeben. Nach und nach wurden dann doch die frischen Zutaten mehr, die Experimentierfreude größer… als ich dann mit Mitte 20 das erste Mal Mama wurde, habe ich mich immer mehr mit dem Thema Essen auseinander gesetzt, habe zum ersten Mal selbst Gemüse im Garten angebaut, mich damit beschäftigt, was passt wie zusammen, was kann man gut kombinieren, was tut mir und meiner Familie gut…
          </p>

          <p>
            So gingen die Jahre ins Land und die Fixprodukte habe ich inzwischen „ad acta" gelegt, in der Regel wird frisch gekocht, gebacken und mit kleinen Kniffs und Tricks aus einem einfachen Gericht ein wahrer Gaumenschmaus. Wichtig ist mir in der Küche die Kreativität, das Ausprobieren, das „keine Angst" haben, dass etwas schief geht… ich probiere sehr gerne aus, mixe, würze, teste aus, nur so kommt man darauf, was gut ist und was weniger. Das artet manchmal in ein dezentes Küchenchaos aus, aber meist mit einem leckeren Ergebnis…
          </p>

          <p>
            Mir ist es wichtig, viel mit regionalen und auch saisonalen Produkten zu arbeiten, mit frischen Zutaten soweit als möglich und bei Fleischgerichten achte ich auf hochwertiges Fleisch, das nicht aus der Masse kommt. Deshalb und auch weil ich seit geraumer Zeit für ein Familienmitglied vegetarisch koche, gibt es selten und wenn dann nur Fleisch, von dem ich weiß, woher es kommt.
          </p>

          <p>
            Wie schon auf der Startseite geschrieben, bin ich auch auf Instagram aktiv. Meinen Account{' '}
            <a
              href="https://www.instagram.com/danie77_simple_good_food/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-700 underline"
            >
              @danie77_simple_good_food
            </a>{' '}
            habe ich 2016 anfangen zu füttern… „schuld" war meine Tochter, die damals einen Account wollte und ich als Mama einfach noch einen Blick auf mein Kind haben wollte… dass ich daran so Freude haben werde und auch meine Follower mir immer wieder durch ihr tolles feedback so viel Bestätigung geben, hätte ich niemals für möglich gehalten. Ich habe, für mich selbstverständlich, nie follower gekauft, meine Kooperartionspartner wähle ich nicht nach Profit aus, sondern nach ihrem Produkt! Ich verdiene meinen Lebensunterhalt als Schulsekretärin, nicht als Influencerin. Fast alle Rezepte und noch viele mehr findet Ihr also auf{' '}
            <a
              href="https://www.instagram.com/danie77_simple_good_food/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-700 underline"
            >
              @danie77_simple_good_food
            </a>.
          </p>
        </div>

        {/* Stats Section */}
        <div className="glass rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-fatfrank text-center mb-8 text-gray-800">
            Meine Küchen-Statistik
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-fatfrank text-pink-500 mb-2">500+</div>
              <p className="font-hoss text-gray-600">Erprobte Rezepte</p>
            </div>

            <div>
              <div className="text-4xl font-fatfrank text-pink-500 mb-2">17.7k</div>
              <p className="font-hoss text-gray-600">Treue Follower</p>
            </div>

            <div>
              <div className="text-4xl font-fatfrank text-pink-500 mb-2">∞</div>
              <p className="font-hoss text-gray-600">Liebe zum Kochen</p>
            </div>
          </div>
        </div>

        {/* What You'll Find Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-fatfrank text-center mb-8 text-gray-800">
            Was dich hier erwartet
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass rounded-xl p-6">
              <h4 className="text-xl font-fatfrank text-gray-800 mb-4">Alltagsküche</h4>
              <p className="font-hoss text-gray-700">
                Praktische und leckere Rezepte für den täglichen Bedarf. Schnell, einfach und immer mit dem gewissen Etwas.
              </p>
            </div>

            <div className="glass rounded-xl p-6">
              <h4 className="text-xl font-fatfrank text-gray-800 mb-4">Kuchen & Süßes</h4>
              <p className="font-hoss text-gray-700">
                Von klassischen Kuchen bis zu kreativen Desserts - hier findest du alles für deinen süßen Zahn.
              </p>
            </div>

            <div className="glass rounded-xl p-6">
              <h4 className="text-xl font-fatfrank text-gray-800 mb-4">Frühstück</h4>
              <p className="font-hoss text-gray-700">
                Starte perfekt in den Tag mit nahrhaften und leckeren Frühstücksideen für jeden Geschmack.
              </p>
            </div>

            <div className="glass rounded-xl p-6">
              <h4 className="text-xl font-fatfrank text-gray-800 mb-4">Geschenke aus der Küche</h4>
              <p className="font-hoss text-gray-700">
                Selbstgemachte Leckereien als persönliche Geschenke - mit Liebe zubereitet und verpackt.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center glass rounded-2xl p-8">
          <h3 className="text-2xl font-fatfrank mb-4 text-gray-800">
            Lass uns in Kontakt bleiben
          </h3>
          <p className="font-hoss text-gray-700 mb-6">
            Hast du Fragen zu einem Rezept oder möchtest einfach Hallo sagen? Ich freue mich über jede Nachricht!
          </p>
          <button className="btn-primary">
            Kontakt aufnehmen
          </button>
        </div>
      </div>
    </div>
  )
}