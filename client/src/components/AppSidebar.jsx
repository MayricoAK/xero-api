import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authService } from "@/services/authService";
import {
  Home,
  FileText,
  CheckCircle,
  CreditCard,
  RefreshCw,
  User,
  LogOut,
  ChevronUp,
  Check,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useXeroContext } from "@/context/xeroUtils";

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = authService.getUserInfo();
  const { sync, isSyncing, isSynced, lastSyncTime } = useXeroContext();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const handleSync = async () => {
    try {
      await sync();
    } catch (error) {
      console.error("Sync failed:", error);
    }
  };

  const navigation = [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Request to Approval",
      url: "/request-approval",
      icon: FileText,
    },
    {
      title: "Approval & Authorization",
      url: "/approval-authorization",
      icon: CheckCircle,
    },
    {
      title: "Payment Advice",
      url: "/payment-advice",
      icon: CreditCard,
    },
    {
      title: "Xero Bills",
      url: "/bills",
      icon: FileText,
    },
  ];

  const getSyncButtonContent = () => {
    if (isSyncing) {
      return {
        text: "Syncing...",
        icon: RefreshCw,
        variant: "outline",
        disabled: true,
        iconClass: "animate-spin",
      };
    }

    if (isSynced) {
      return {
        text: "Xero Synced",
        icon: Check,
        variant: "outline",
        disabled: true,
        iconClass: "",
      };
    }

    return {
      text: "Sync with Xero",
      icon: RefreshCw,
      variant: "outline",
      disabled: false,
      iconClass: "",
    };
  };

  const syncButtonContent = getSyncButtonContent();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-3 px-4 py-2">
          <img
            src="/icons/xero-icon.png"
            alt="Xero Logo"
            className="h-8 w-auto"
          />
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">
              Payment Approval System
            </h1>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="space-y-3 p-4">
          {/* Sync Button */}
          <div className="space-y-1">
            {lastSyncTime && (
              <p className="text-xs text-muted-foreground text-center">
                Last sync: {new Date(lastSyncTime).toLocaleString()}
              </p>
            )}
            <Button
              variant={syncButtonContent.variant}
              size="sm"
              className={"w-full"}
              onClick={handleSync}
              disabled={syncButtonContent.disabled}
            >
              <syncButtonContent.icon
                className={cn("mr-2 h-4 w-4", syncButtonContent.iconClass)}
              />
              {syncButtonContent.text}
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
                    {userInfo?.userName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium truncate">
                      {userInfo?.userName || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {userInfo?.email || ""}
                    </p>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
