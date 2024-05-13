import { Link } from "@tanstack/react-router";

export function Header({ locale, locales } : { locale: string, locales: string[] }) {
  return <div className="p-2 flex gap-2 text-lg">
    <Link
      to="/$ln"
      activeProps={{
        className: 'font-bold',
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
        className: 'font-bold',
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
        className: 'font-bold',
      }}
    >
      Error
    </Link>
  </div>
}
