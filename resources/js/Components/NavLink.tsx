import { Link } from '@inertiajs/react';

export default function NavLink({
    href,
    active = false,
    children,
}: {
    href: string;
    active?: boolean;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className={
                `inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-semibold transition-all duration-150 ease-in-out
                 ${active
                    ? 'bg-[#B3E10F] text-black shadow-md shadow-[#B3E10F]/40'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                 }`
            }
        >
            <span className="text-center leading-tight">{children}</span>
        </Link>
    );
}
