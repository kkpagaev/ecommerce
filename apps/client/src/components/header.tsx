import { Link } from "@tanstack/react-router";
import { Menu, Package2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Cart } from "./cart";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";

function Nav({
  locale,
  categories,
}: {
  locale: string;
  categories: Array<{
    id: number;
    slug: string;
    name: string;
  }>;
}) {
  return (
    <nav className="p-2 flex gap-2 text-lg">
      {categories.map((category) => (
        <Link
          key={category.id}
          to="/$ln/category/$slug"
          className="text-muted-foreground transition-colors hover:text-foreground"
          params={{
            ln: locale,
            slug: category.slug,
          }}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}

export function Header({
  locale,
  locales,
  categories,
}: {
  locale: string;
  locales: string[];
  categories: Array<{
    id: number;
    slug: string;
    name: string;
  }>;
}) {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
      <div className="hidden container justify-between w-full flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Nav locale={locale} categories={categories} />

        <div className="flex items-center gap-4">
          <Cart />
          <div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            <Link href="#" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              Orders
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              Products
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              Customers
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              Analytics
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
    // <header>
    // </header>
  );
}
