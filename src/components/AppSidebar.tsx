import { useState } from "react";
import {
  Database,
  ChevronRight,
  ChevronDown,
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
  Truck,
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
  { 
    title: "Payments", 
    icon: CreditCard,
    subItems: [
      { title: "Deductions", url: "/deductions" },
      { title: "Settlements", url: "/settlements" }
    ]
  },
  { type: "separator" },
  { title: "Customers", icon: PersonStanding },
  { title: "Defendants", icon: Scale },
  { title: "Vendors", icon: Truck, url: "/vendors" },
  { type: "separator" },
  { title: "Banking", icon: CreditCard, url: "/banking" },
  { type: "separator" },
  { title: "Case Types", icon: HelpCircle },
  { title: "Questionnaires", icon: FileText },
  { title: "Snippets", icon: Code },
  { title: "Migration Sync Configuration", icon: Database, url: "/migration-sync-config" },
  { type: "separator" },
  { title: "File Manager", icon: FolderOpen },
  { title: "Communications", icon: MessageSquare },
  { type: "separator" },
  { title: "Users", icon: Users },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const collapsed = state === "collapsed";
  const [expandedItems, setExpandedItems] = useState<string[]>(["Payments"]);

  const handleMenuClick = (item: any) => {
    if (item.url) {
      navigate(item.url);
    } else if (item.subItems) {
      const isExpanded = expandedItems.includes(item.title);
      if (isExpanded) {
        setExpandedItems(prev => prev.filter(title => title !== item.title));
      } else {
        setExpandedItems(prev => [...prev, item.title]);
      }
    }
  };

  const isActive = (item: any) => {
    if (item.url === "/migration-sync-config") {
      return (
        location.pathname === "/" ||
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
    if (item.url === "/deductions") {
      return location.pathname === "/deductions";
    }
    if (item.url === "/settlements") {
      return location.pathname === "/settlements";
    }
    if (item.url === "/vendors") {
      return location.pathname === "/vendors";
    }
    if (item.subItems) {
      return item.subItems.some((subItem: any) => location.pathname === subItem.url);
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
                    <>
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
                            <>
                              <span className="text-sm flex-1">{item.title}</span>
                              {item.subItems && (
                                expandedItems.includes(item.title) ? 
                                <ChevronDown className="h-3 w-3" /> : 
                                <ChevronRight className="h-3 w-3" />
                              )}
                            </>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      {/* Sub-menu items */}
                      {item.subItems && expandedItems.includes(item.title) && !collapsed && (
                        <div className="ml-6 space-y-1">
                          {item.subItems.map((subItem: any, subIndex: number) => (
                            <SidebarMenuItem key={subIndex}>
                              <SidebarMenuButton
                                className={`flex items-center gap-3 px-3 py-1 rounded-lg transition-colors text-sm ${
                                  location.pathname === subItem.url
                                    ? "bg-cyan-600/20 text-grey-400 border border-cyan-600/30"
                                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                                }`}
                                onClick={() => navigate(subItem.url)}
                              >
                                <span>{subItem.title}</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </div>
                      )}
                    </>
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
