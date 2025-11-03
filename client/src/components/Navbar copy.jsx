import { Button } from "./ui/button";
import { RefreshCw, User, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navbar = () => {
  const location = useLocation();

  const navigationItems = [
    { name: "Dashboard", path: "/" },
    { name: "Request to Approval", path: "/request-approval" },
    { name: "Approval & Authorization", path: "/approval-authorization" },
    { name: "Payment Advice", path: "/payment-advice" },
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <img
                src="/icons/xero-icon.png"
                alt="Xero Logo"
                className="h-8 w-auto"
              />
              <h1 className="text-xl font-semibold text-gray-900">
                Payment Approval System
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync with Xero
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 focus:outline-none hover:bg-gray-50 rounded-lg p-2 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="hidden md:inline text-sm font-medium text-gray-700">
                    John Doe
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem>Preferences</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="border-t border-gray-200">
          <div className="flex space-x-0 overflow-x-auto">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200
                  ${
                    isActivePath(item.path)
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }
                `}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
