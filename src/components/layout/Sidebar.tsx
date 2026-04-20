import { NavLink } from "react-router-dom";
import { LayoutDashboard, Car, Bell, Users, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useVehicles } from "@/contexts/VehicleContext";
import { useNotifications } from "@/hooks/useNotifications";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
  badge?: number;
}

export function Sidebar() {
  const { currentUser, logout } = useAuth();
  const { vehicles } = useVehicles();
  const { criticalCount, warningCount } = useNotifications(vehicles);
  const alertCount = criticalCount + warningCount;

  const navItems: NavItem[] = [
    { label: "Tableau de bord", to: "/dashboard", icon: LayoutDashboard },
    {
      label: "Véhicules",
      to: "/vehicles",
      icon: Car,
      badge: vehicles.length,
    },
    {
      label: "Alertes",
      to: "/alerts",
      icon: Bell,
      badge: alertCount > 0 ? alertCount : undefined,
    },
    { label: "Famille", to: "/family", icon: Users },
  ];

  return (
    <aside className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
          <Car className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">Rappel Entretien</p>
          <p className="text-xs text-sidebar-foreground/60">Famille</p>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to}>
            {({ isActive }) => (
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge
                    variant={item.to === "/alerts" ? "destructive" : "secondary"}
                    className="ml-auto h-5 min-w-5 px-1.5 text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* Footer utilisateur */}
      <div className="p-3">
        <NavLink to="/settings">
          {({ isActive }) => (
            <div
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent"
              )}
            >
              <Settings className="h-4 w-4" />
              <span>Paramètres</span>
            </div>
          )}
        </NavLink>

        <div className="mt-3 flex items-center gap-3 rounded-lg px-3 py-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
              {currentUser?.initials ?? "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{currentUser?.name}</p>
            <p className="truncate text-xs text-sidebar-foreground/60">{currentUser?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            onClick={logout}
            title="Déconnexion"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
