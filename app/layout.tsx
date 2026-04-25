import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Sora } from 'next/font/google'
import './globals.css'
import JSquadBadge from './components/JSquadBadge'
import Navbar from './components/Navbar'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
})

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'ThiranziHub Assessment Platform | J-Squad',
  description: 'ThiranziHub communication assessment platform - Developed by J-Squad',
  keywords: 'communication assessment, cognizant test, speaking test, grammar test, J-Squad',
  authors: [{ name: 'J-Squad' }],
  creator: 'J-Squad',
  publisher: 'J-Squad',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${sora.variable}`}>
        <Navbar />
        <div className="page-shell">{children}</div>
        <JSquadBadge />
      </body>
    </html>
  )
}
