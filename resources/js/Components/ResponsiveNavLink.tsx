import { Link, InertiaLinkProps } from "@inertiajs/react";
import { ReactNode } from "react";

interface Props extends InertiaLinkProps {
    href: string;
    active: boolean;
    className?: string;
    children: ReactNode;
}

export default function ResponsiveNavLink({
    href,
    active,
    className = "",
    children,
    ...props
}: Props) {
    return (
        <Link
            href={href}
            data-active={active ? "true" : "false"}
            className={`mobile-link ${className}`}
            {...props}
        >
            {children}
        </Link>
    );
}
