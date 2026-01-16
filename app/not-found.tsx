import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
            <h2 className="text-4xl font-bold mb-4">404 - Page Not Found</h2>
            <p className="text-slate-400 mb-8">
                The resource you are looking for does not exist.
            </p>
            <Link
                href="/"
                className="bg-white text-black px-6 py-2 rounded-xl hover:bg-slate-200 transition-all"
            >
                Return Home
            </Link>
        </main>
    );
}
