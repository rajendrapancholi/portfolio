import { BlogSearchListener } from "@/components/blog/BlogSearchListener";
import ClientSideElements from "@/components/blog/ClientElements";
import Navbar from "@/components/blog/Navbar";
import Footer from "@/components/Footer";

export default function MainBlogLayout({
    children,
    modal,
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    return (
        <div className="relative">
            <Navbar />
            {children}
            <div className="mx-auto border-b-4 max-w-7xl border-gray-500/20 dark:border-gray-300/20" />
            {modal}
            <BlogSearchListener />
            <Footer />
            <ClientSideElements />
        </div>
    );
}
