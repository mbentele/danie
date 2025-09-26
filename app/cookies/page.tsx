import { Metadata } from 'next'
import CookiesPageClient from './CookiesPageClient'

export const metadata: Metadata = {
  title: 'Cookie-Richtlinie - danie.de',
  description: 'Informationen über die Verwendung von Cookies auf danie.de und wie Sie Ihre Cookie-Einstellungen verwalten können.',
}

export default function CookiesPage() {
  return <CookiesPageClient />
}