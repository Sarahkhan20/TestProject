import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Building, 
  Ship, 
  RouterIcon, 
  Shield, 
  Users, 
  List, 
  FileText, 
  UserCog, 
  Plus, 
  User, 
  LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface SidebarProps {
  mobile?: boolean;
  closeMobileMenu?: () => void;
}

export default function Sidebar({ mobile, closeMobileMenu }: SidebarProps) {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();

  const menu = [
    { icon: <LayoutDashboard size={18} />, label: "Dashboard", path: "/" },
    { icon: <Building size={18} />, label: "Tenants", path: "/tenants" },
    { icon: <Ship size={18} />, label: "Fleets", path: "/fleets" },
    { icon: <RouterIcon size={18} />, label: "Routers", path: "/routers" },
    { icon: <Shield size={18} />, label: "Firewall Templates", path: "/firewall" },
    { icon: <Users size={18} />, label: "Hotspot Users", path: "/hotspot-users" },
    { icon: <List size={18} />, label: "Audit Trail", path: "/audit-trail" },
    { icon: <FileText size={18} />, label: "Billing", path: "/billing" },
    { icon: <UserCog size={18} />, label: "Admins", path: "/admins" },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleItemClick = () => {
    if (mobile && closeMobileMenu) {
      closeMobileMenu();
    }
  };

  return (
    <aside className={cn(
      "flex flex-col h-full bg-sidebar border-r border-background-card",
      mobile ? "w-full" : "w-60 hidden md:flex"
    )}>
      <div className="p-6">
        <h1 className="text-xl font-semibold">
          <span className="text-white">future</span>
          <span className="text-primary">konnect</span>
        </h1>
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-1">
        {menu.map((item, index) => (
          <Link 
            key={index} 
            href={item.path}
            onClick={handleItemClick}
          >
            <a className={cn(
              "flex items-center px-4 py-3 rounded-md transition-colors group",
              location === item.path 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-background-card"
            )}>
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          </Link>
        ))}
      </nav>
      
      <div className="p-4">
        <Button 
          variant="outline" 
          className="w-full justify-center bg-background-card hover:bg-background-card/80 text-primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create
        </Button>
      </div>
      
      <div className="p-4 border-t border-background-card space-y-2">
        <Link href="/account" onClick={handleItemClick}>
          <a className="flex items-center px-4 py-2 text-muted-foreground rounded-md hover:bg-background-card transition-colors">
            <User className="mr-3 h-4 w-4" />
            <span>Account</span>
          </a>
        </Link>
        <button 
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="w-full flex items-center px-4 py-2 text-muted-foreground rounded-md hover:bg-background-card transition-colors text-left"
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>{logoutMutation.isPending ? "Logging out..." : "Log Out"}</span>
        </button>
      </div>
    </aside>
  );
}
