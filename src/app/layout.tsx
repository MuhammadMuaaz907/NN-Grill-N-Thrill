// src/app/layout.tsx (Updated with CartProvider)
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Footer } from '@/components/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RESTAURANT_INFO } from '@/lib/data';

const inter = Inter({ subsets: ['latin'] });

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: `${RESTAURANT_INFO.name} | Café & Restaurant in ${RESTAURANT_INFO.location}`,
  description: `Discover ${RESTAURANT_INFO.name}, a premium café and restaurant in ${RESTAURANT_INFO.location}. Enjoy delicious breakfast, salads, pizzas, and more. Call ${RESTAURANT_INFO.phoneNumber} to order now.`,
  keywords: [
    'restaurant',
    'café',
    'breakfast',
    'food delivery',
    'dining',
    RESTAURANT_INFO.location,
    'pizza',
    'salads',
    'waffles'
  ],
  authors: [{ name: RESTAURANT_INFO.name }],
  creator: RESTAURANT_INFO.name,
  publisher: RESTAURANT_INFO.name,
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://florentine.pk',
    siteName: RESTAURANT_INFO.name,
    title: `${RESTAURANT_INFO.name} - Premium Café & Restaurant`,
    description: `Experience premium dining at ${RESTAURANT_INFO.name} in ${RESTAURANT_INFO.location}`,
    images: [
      {
        url: 'https://florentine.pk/og-image.png',
        width: 1200,
        height: 630,
        alt: `${RESTAURANT_INFO.name} Restaurant`
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: `${RESTAURANT_INFO.name} - Premium Café & Restaurant`,
    description: `Experience premium dining at ${RESTAURANT_INFO.name} in ${RESTAURANT_INFO.location}`,
    images: ['https://florentine.pk/twitter-image.png'],
    creator: '@florentine'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  },
  manifest: '/site.webmanifest'
};

export const viewport = {
  colorScheme: 'light'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="theme-color"
          content="#ec4899"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#be185d"
          media="(prefers-color-scheme: dark)"
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <link rel="dns-prefetch" href="https://cdn.example.com" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Restaurant',
              name: RESTAURANT_INFO.name,
              image: 'https://florentine.pk/logo.png',
              description: `Premium café and restaurant in ${RESTAURANT_INFO.location}`,
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Your Street Address',
                addressLocality: RESTAURANT_INFO.location,
                addressRegion: 'Sindh',
                postalCode: '75600',
                addressCountry: 'PK'
              },
              telephone: RESTAURANT_INFO.phoneNumber,
              priceRange: '$$$',
              servesCuisine: ['International', 'Continental', 'Pakistani'],
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.5',
                reviewCount: '120'
              },
              url: 'https://florentine.pk',
              sameAs: [
                'https://facebook.com/florentine',
                'https://instagram.com/florentine',
                'https://twitter.com/florentine'
              ]
            })
          }}
        />
      </head>

      <body
        className={`${inter.className} ${playfair.variable} bg-white text-gray-900 antialiased`}
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-pink-600 text-white px-4 py-2 z-50"
        >
          Skip to main content
        </a>

        <ErrorBoundary>
          <CartProvider>
            <main id="main-content" className="min-h-screen flex flex-col">
              {children}
            </main>

            <Footer restaurantName={RESTAURANT_INFO.name} />
          </CartProvider>
        </ErrorBoundary>

        {process.env.NEXT_PUBLIC_GA_ID && (
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          />
        )}
      </body>
    </html>
  );
}