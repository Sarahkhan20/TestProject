import { useState } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "@/components/layout/sidebar";
import { useAuth } from "@/hooks/use-auth";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="h-16 bg-sidebar border-b border-background-card flex items-center justify-between px-6">
      <div className="flex items-center">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[300px]">
            <Sidebar mobile closeMobileMenu={closeMobileMenu} />
          </SheetContent>
        </Sheet>
        
        <Link href="/" className="md:hidden">
          <div className="text-xl font-semibold">
            <span className="text-white">future</span>
            <span className="text-primary">konnect</span>
          </div>
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        {user && (
          <>
            <span className="text-muted-foreground text-sm hidden md:inline-block">
              {user.name}
            </span>
            <Avatar className="bg-primary/20 text-primary h-8 w-8">
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
          </>
        )}
      </div>
    </header>
  );
}
