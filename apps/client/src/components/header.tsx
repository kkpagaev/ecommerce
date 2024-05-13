import { Link } from "@tanstack/react-router";

export function Header({
  locale,
  locales,
  categories,
}: {
  locale: string;
  locales: string[];
  categories: Array<{
    slug: string;
    name: string;
  }>;
}) {
  return (
    <header>
      <nav className="p-2 flex gap-2 text-lg">
        <Link
          to="/$ln"
          activeProps={{
            className: "font-bold",
          }}
          params={{
            ln: locale,
          }}
        >
          Home
        </Link>
        <Link
          to="/$ln/posts"
          params={{
            ln: locale,
          }}
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
          activeProps={{
            className: "font-bold",
          }}
        >
          Error
        </Link>
        {categories.map((category) => (
          <Link
            to="/$ln/category/$slug"
            params={{
              ln: locale,
              slug: category.slug,
            }}
          >
            {category.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
