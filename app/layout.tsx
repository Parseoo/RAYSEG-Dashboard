import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import "./globals.css";

import Providers from "@/lib/Prividers";
// app/layout.tsx
import "leaflet/dist/leaflet.css";

const inter = Manrope({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Administrador RAYSEG',
  description: 'Administrador RAYSEG',
  icons: '/favicon.ico'
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang='en'>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

