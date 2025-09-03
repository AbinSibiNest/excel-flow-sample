import { useState } from "react";
import {
  Database,
  ChevronRight,
  Briefcase,
  FileText,
  CreditCard,
  Building,
  Users,
  Scale,
  HelpCircle,
  Code,
  FolderOpen,
  MessageSquare,
  PersonStanding,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Cases", icon: Briefcase, url: "/cases" },
  { title: "Requests", icon: FileText },
  { title: "Payments", icon: CreditCard },
  { type: "separator" },
  { title: "Firms", icon: Building , url: "/banking" },
  { title: "Customers", icon: PersonStanding },
  { title: "Defendants", icon: Scale },
  { type: "separator" },
  { title: "Case Types", icon: HelpCircle },
  { title: "Questionnaires", icon: FileText },
  { title: "Snippets", icon: Code },
  { type: "separator" },
  { title: "File Manager", icon: FolderOpen },
  { title: "Communications", icon: MessageSquare },
  { type: "separator" },
  { title: "Users", icon: Users },
  {
    title: "Migration Sync Config",
    icon: Database,
    url: "/migration-sync-config",
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const collapsed = state === "collapsed";

  const handleMenuClick = (item: any) => {
    if (item.url) {
      navigate(item.url);
    }
  };

  const isActive = (item: any) => {
    if (item.url === "/migration-sync-config") {
      return (
        location.pathname === "/migration-sync-config" ||
        location.pathname.startsWith("/firm/")
      );
    }
    if (item.url === "/cases") {
      return location.pathname.startsWith("/cases");
    }
    if (item.url === "/banking") {
      return location.pathname === "/banking";
    }
    return false;
  };

  return (
    <Sidebar
      className={`${
        collapsed ? "w-16" : "w-64"
      } bg-[#1e2328] border-r border-gray-700 mt-16`}
    >
      <SidebarContent className="bg-[#1e2328]">
        <SidebarGroup className="px-3 py-4">
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <div key={index}>
                  {item.type === "separator" ? (
                    <div className="border-t border-gray-600 my-2 mx-3"></div>
                  ) : (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive(item)
                            ? "bg-cyan-600/20 text-grey-400 border border-cyan-600/30"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                        onClick={() => handleMenuClick(item)}
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && (
                          <span className="text-sm">{item.title}</span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
