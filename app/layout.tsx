import type { Metadata } from 'next'
import './globals.css'
import JSquadBadge from './components/JSquadBadge'

export const metadata: Metadata = {
  title: 'Communication Assessment Test | J-Squad',
  description: 'Cognizant-style Communication Assessment Platform - Developed by J-Squad',
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
      <body>
        {children}
        <JSquadBadge />
      </body>
    </html>
  )
}
