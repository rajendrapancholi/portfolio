'use client';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import { useSession } from 'next-auth/react';

export default function GithubLink({ editUrl }: { editUrl: string }) {
  const { data: session } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const canEdit = role === 'admin' || role === 'author';
  const href = canEdit ? editUrl : editUrl.replace('/edit/', '/blob/');

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted px-4 py-2 rounded-lg transition-all"
    >
      {canEdit ? (
        <>
          <Pencil className="w-4 h-4" />
          <span>Edit on GitHub</span>
        </>
      ) : (
        <>
          <FaGithub className="w-4 h-4" />
          <span>View on GitHub</span>
        </>
      )}
    </Link>
  );
}
