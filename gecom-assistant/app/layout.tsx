import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GECOM Assistant - Global E-Commerce Cost Calculator',
  description: 'Professional cost calculation and optimization for cross-border e-commerce businesses',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}
