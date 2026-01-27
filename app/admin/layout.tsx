import { auth } from "@/lib/auth";
import {
    HiMiniUserGroup,
    HiMiniRectangleGroup,
} from "react-icons/hi2";
import {
    MdWork,
    MdAnalytics,
    MdPeople,
} from "react-icons/md";
import { Newspaper, PanelsTopLeftIcon } from "lucide-react";
import Unauthorized from "@/components/admin/Unathorized";
import AdminSidebar from "@/components/sidebars/AdminSidebar";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session) redirect("/signin");

    const isAuthorized = session.user.role === "admin" || session.user.isAdmin;

    if (!isAuthorized) return <Unauthorized />;

    const menuItems = [
        {
            title: "Pages",
            list: [
                {
                    title: "Dashboard",
                    path: "/admin/dashboard",
                    icon: <HiMiniRectangleGroup size={18} />,
                },
                {
                    title: "Projects",
                    path: "/admin/projects",
                    icon: <PanelsTopLeftIcon size={18} />,
                },
                {
                    title: "Blogs",
                    path: "/admin/blogs",
                    icon: <Newspaper size={18} />,
                },
                {
                    title: "Users",
                    path: "/admin/users",
                    icon: <HiMiniUserGroup size={18} />,
                },
            ],
        },
        {
            title: "Analytics",
            list: [
                {
                    title: "Revenue",
                    path: "/dashboard/revenue",
                    icon: <MdWork size={18} />,
                },
                {
                    title: "Reports",
                    path: "/dashboard/reports",
                    icon: <MdAnalytics size={18} />,
                },
                {
                    title: "Teams",
                    path: "/dashboard/teams",
                    icon: <MdPeople size={18} />,
                },
            ],
        },
    ];

    return (
        <div className="flex h-screen overflow-hidden w-full bg-gray-200 dark:bg-slate-900">
            <AdminSidebar menuItems={menuItems} />
            <main className="flex-1 overflow-y-auto px-6">
                {children}
            </main>
        </div>
    );
}
