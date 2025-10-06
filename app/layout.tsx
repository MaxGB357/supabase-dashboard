import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ["latin"],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Dashboard de Adopción de IA",
  description: "Visualización de resultados de encuestas de adopción de IA por institución",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased font-sans text-gray-800`}>
        {children}
      </body>
    </html>
  );
}
