import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../components/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FundSphere - Modern Digital Wallet for BTC & USDT',
  description: 'Revolutionizing global payments with our secure crypto digital wallet. Manage BTC, USDT and your global finances in one place.',
  keywords: 'digital wallet, crypto, bitcoin, usdt, fintech, payments, fundsphere',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-white dark:bg-black transition-colors duration-300`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
