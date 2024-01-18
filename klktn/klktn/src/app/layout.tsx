import './globals.css'
import type { Metadata } from 'next'
import { Inter, Nunito_Sans } from 'next/font/google'

const nunitoSans = Nunito_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Crib v1',
  description: 'The first prototype for Crib',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={nunitoSans.className}>{children}</body>
    </html>
  )
}
