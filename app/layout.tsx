import type { Metadata } from 'next';
import '@/styles/globals.css';
import { FcAbout, FcContacts, FcHome, FcTemplate } from 'react-icons/fc';
import { HiMiniRectangleGroup } from 'react-icons/hi2';
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
          <header>
            <FloatingNavbar
              navItems={[
                { name: 'Home', link: '/', icon: <FcHome /> },
                {
                  name: 'Blogs',
                  link: '/blogs',
                  icon: <HiMiniRectangleGroup />,
                },
                { name: 'About', link: '#about', icon: <FcAbout /> },
                { name: 'Projects', link: '#projects', icon: <FcTemplate /> },
                { name: 'Contact', link: '#contact', icon: <FcContacts /> },
              ]}
            />
          </header>
          <main className="mx-auto">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
