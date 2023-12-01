import type { Metadata } from 'next'
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Inter } from 'next/font/google'
import './globals.css'

// Ref: https://stackoverflow.com/a/59429852/3518049
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css';
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; /* eslint-disable import/first */

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fridge Monitor',
  description: 'A dashboard for viewing refrigerator metrics.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <UserProvider>
        <body className={inter.className}>{children}</body>
      </UserProvider>
    </html>
  )
}
