import { ReactNode } from "react";
import Footer from "@/components/Footer";
import { FloatingNavbar } from "@/components/ui/FloatingNavbar";
import { HiMiniRectangleGroup } from "react-icons/hi2";
import { FcAbout, FcContacts, FcHome, FcTemplate } from 'react-icons/fc';
import { baseMetadata } from "@/lib/seo/metadata";

export const metadata = baseMetadata;

export default function FrontLayout({ children }: { children: ReactNode; }) {
  return (
    <>
      <header className='relative'>
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
      <main className="relative overflow-x-clip">{children}</main>
      <Footer />
    </>
  );
}
