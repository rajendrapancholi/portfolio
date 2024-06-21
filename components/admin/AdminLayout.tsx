import { auth } from '@/lib/auth';
import { HiMiniUserGroup, HiMiniRectangleGroup } from 'react-icons/hi2';
import { MdShoppingBag, MdWork, MdAnalytics, MdPeople } from 'react-icons/md';
import AdminLink from './AdminLink';

const AdminLayout = async ({
  activeItem = 'dashboard',
  children,
}: {
  activeItem: string;
  children: React.ReactNode;
}) => {
  const menuItems = [
    {
      title: 'Pages',
      list: [
        {
          title: 'Dashboard',
          slug: 'dashboard',
          path: '/admin/dashboard',
          icon: <HiMiniRectangleGroup />,
        },
        {
          title: 'Projects',
          slug: 'projects',
          path: '/admin/projects',
          icon: <MdShoppingBag />,
        },
        {
          title: 'Users',
          slug: 'users',
          path: '/admin/users',
          icon: <HiMiniUserGroup />,
        },
      ],
    },
    {
      title: 'Analytics',
      list: [
        {
          title: 'Revenue',
          slug: 'revenue',
          path: '/dashboard/revenue',
          icon: <MdWork />,
        },
        {
          title: 'Reports',
          slug: 'reports',
          path: '/dashboard/reports',
          icon: <MdAnalytics />,
        },
        {
          title: 'Teams',
          slug: 'teams',
          path: '/dashboard/teams',
          icon: <MdPeople />,
        },
      ],
    },
  ];

  const session = await auth();
  if (!session || !session.user.isAdmin) {
    return (
      <div className="relative flex flex-grow p-4">
        <div>
          <h1 className="text-2xl">Unauthorized</h1>
          <p>Admin permisson required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex w-full h-full">
      <div className="w-full h-full grid grid-cols-1 gap-2 sm:grid-cols-3 md:grid-cols-8 lg:grid-cols-10">
        <div className="static h-full bg-base-200 max-sm:m-4 rounded-md shadow_cyan md:col-span-2 lg:col-span-2">
          {/* menu links */}
          <ul className="m-2 sticky sm:top-20 sm:h-[85vh] sm:overflow-hidden sm:overflow-y-auto">
            {menuItems.map((cat: any) => (
              <li key={cat}>
                {cat.title}
                <ul className="menu">
                  {cat.list.map((items: any) => (
                    <li key={items} className="m-1">
                      <AdminLink item={items} active={activeItem} />
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-6 lg:col-span-8 sm:col-span-2 px-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
