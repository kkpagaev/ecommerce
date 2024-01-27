"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="p-4 bg-blue-900 flex justify-center text-white">
      <div className="m-auto">
        <ul className="flex flex-row items-center space-x-4">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/category">Categories</Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
