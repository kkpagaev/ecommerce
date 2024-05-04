import { Button } from "./ui/button";
import { Bell, Home, Menu, Package2, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { SignIn, SignedIn, UserButton, useAuth } from "@clerk/clerk-react";

const pathes: Array<
  { name: string; icon: React.ReactNode } & Parameters<typeof Link>[0]
> = [
  {
    to: "/",
    search: {},
    name: "Home",
    icon: <Home className="h-4 w-4" />,
  },
  {
    to: "/about",
    name: "About",
    icon: <Users className="h-4 w-4" />,
  },
];

function NavBar() {
  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {pathes.map((item, i) => {
        return (
          <Link
            key={i}
            to={item.to}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            activeProps={{ className: "bg-muted" }}
          >
            {item.icon}
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return (
      <div className="container">
        <div className="flex justify-center items-center py-20">
          <SignIn />
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to={"/"} className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">Ecommerce</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <NavBar />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <NavBar />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1"></div>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
