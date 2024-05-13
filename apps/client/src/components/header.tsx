import { Link } from "@tanstack/react-router";
import { CircleUser, Menu, Package2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

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
      <Link
        to="/$ln"
        activeProps={{
          className: "font-bold",
        }}
        className="text-muted-foreground transition-colors hover:text-foreground"
        params={{
          ln: locale,
        }}
      >
        <Package2 className="h-6 w-6" />
        <span className="sr-only">Acme Inc</span>
      </Link>
      <Link
        to="/$ln/posts"
        params={{
          ln: locale,
        }}
        className="text-muted-foreground transition-colors hover:text-foreground"
        activeProps={{
          className: "font-bold",
        }}
      >
        Posts
      </Link>
      <Link
        to="/$ln/error"
        params={{
          ln: locale,
        }}
        className="text-muted-foreground transition-colors hover:text-foreground"
        activeProps={{
          className: "font-bold",
        }}
      >
        Error
      </Link>
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
function Breadcrumbs() {
  const router = useRouter();
  const breadcrumbs = router.state.matches.map((match) => {
    const { routeContext } = match;
    console.log(match);
    return {
      title: routeContext.getTitle?.(),
      path: match.pathname,
    };
  });

  return breadcrumbs.map((breadcrumb, i) => {
    if (i === breadcrumbs.length - 1) {
      return (
        <div key={i} className="text-sm font-medium">
          {breadcrumb.title}
        </div>
      );
    }
    return (
      <Link to={breadcrumb.path} key={i} className="text-sm font-medium">
        {breadcrumb.title}
      </Link>
    );
  });
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
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Nav locale={locale} categories={categories} />
      </nav>
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
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
    // <header>
    // </header>
  );
}
