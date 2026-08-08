import LeftSidebar from '../LeftSidebar';
import CollapsibleLeftSidebar from '@/components/blog/CollapsibleLeftSidebar';

export default function BLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex items-start">
      {/* Client shell wraps Server sidebar */}
      <CollapsibleLeftSidebar>
        <LeftSidebar />
      </CollapsibleLeftSidebar>

      <div className="min-w-0 w-full flex-1">
        <div className="w-full px-3 py-6 sm:px-5 lg:px-6 md:py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
