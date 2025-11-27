import { Link } from "@inertiajs/react";
import { ReactNode } from "react";

export default function NavLink({
    href,
    active,
    children,
}: {
    href: string;
    active: boolean;
    children: ReactNode;
}) {
    return (
        <Link
            href={href}
            data-active={active ? "true" : "false"}
            className="nav-item"
        >
            {children}
        </Link>
    );
}
