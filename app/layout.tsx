import type { Metadata } from 'next';
import '@/styles/globals.css';
export const metadata: Metadata = {
  title: 'Rajendra Pancholi Portfolio',
  description: 'This is my porfolio created by rajendra pancholi.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
