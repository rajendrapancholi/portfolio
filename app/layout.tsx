import type { Metadata } from 'next';
import '@/styles/globals.css';
import { FcAbout, FcContacts, FcHome, FcTemplate } from 'react-icons/fc';
import Providers from '@/components/Providers';
import { FloatingNavbar } from '@/components/ui/FloatingNavbar';
import Footer from '@/components/Footer';
export const metadata: Metadata = {
  title: 'Rajendra Pancholi',
  description: 'This is my porfolio created by rajendra pancholi.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <header className="container">
            <FloatingNavbar
              navItems={[
                { name: 'Home', link: '/', icon: <FcHome /> },
                { name: 'About', link: '#about', icon: <FcAbout /> },
                { name: 'Projects', link: '#projects', icon: <FcTemplate /> },
                { name: 'Contact', link: '#contact', icon: <FcContacts /> },
              ]}
            />
          </header>
          <main className="">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
