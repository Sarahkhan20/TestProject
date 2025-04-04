import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ChevronRight, MoveUpLeft, Users, RouterIcon, Ship, Building } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: "data-exchange" | "hotspot-users" | "routers" | "fleets" | "tenants";
  linkTo?: string;
}

export default function StatsCard({ title, value, icon, linkTo }: StatsCardProps) {
  // Determine which icon to display
  const renderIcon = () => {
    switch (icon) {
      case "data-exchange":
        return <MoveUpLeft className="text-primary text-2xl" size={32} />;
      case "hotspot-users":
        return <Users className="text-primary text-2xl" size={32} />;
      case "routers":
        return <RouterIcon className="text-primary text-2xl" size={32} />;
      case "fleets":
        return <Ship className="text-primary text-2xl" size={32} />;
      case "tenants":
        return <Building className="text-primary text-2xl" size={32} />;
      default:
        return null;
    }
  };

  // Generate card content
  const content = (
    <div className="bg-background-card rounded-lg p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md duration-300">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {linkTo && <ChevronRight className="h-5 w-5 text-muted-foreground" />}
      </div>
      <div className="flex items-center">
        {renderIcon()}
        <span className="text-3xl font-semibold ml-4">{value}</span>
      </div>
    </div>
  );

  // Wrap in Link if linkTo is provided
  if (linkTo) {
    return <Link href={linkTo}>{content}</Link>;
  }

  return content;
}
