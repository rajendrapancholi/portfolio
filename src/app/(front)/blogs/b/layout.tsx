import LeftSidebar from '../LeftSidebar';
import CollapsibleLeftSidebar from '@/components/blog/CollapsibleLeftSidebar';

export default function BLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex items-start">
      {/* Left collapsible sidebar */}
      <CollapsibleLeftSidebar>
        <LeftSidebar />
      </CollapsibleLeftSidebar>

      {/* Main content */}
      <div className="min-w-0 w-full flex-1">
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
