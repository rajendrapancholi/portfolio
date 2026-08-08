import { BlogSearchListener } from '@/components/blog/BlogSearchListener';
import ClientSideElements from '@/components/blog/ClientElements';
import Navbar from '@/components/blog/Navbar';
import Footer from '@/components/Footer';

export default function MainBlogLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-main-bg text-main-text">
      <Navbar />

      <main className="relative z-10">{children}</main>

      {/* Elegant separator */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />
      </div>

      {modal}
      <BlogSearchListener />
      <Footer />
      <ClientSideElements />
    </div>
  );
}
