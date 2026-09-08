"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Draft" },
  { href: "/admin", label: "Admin" },
] as const;

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1" aria-label="Main">
      {LINKS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "rounded px-2.5 py-1 text-sm font-medium text-emerald-800"
                : "rounded px-2.5 py-1 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
