import { Transition } from '@headlessui/react';
import { Link, InertiaLinkProps } from '@inertiajs/react';
import {
    createContext,
    Dispatch,
    PropsWithChildren,
    ReactNode,
    SetStateAction,
    useContext,
    useState,
} from 'react';

/* ================================
   CONTEXT TIPADO CORRECTAMENTE
================================ */
type DropdownContextType = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    toggleOpen: () => void;
};

const DropDownContext = createContext<DropdownContextType>({
    open: false,
    setOpen: () => {},
    toggleOpen: () => {},
});

/* ================================
   CONTENEDOR PRINCIPAL
================================ */
const Dropdown = ({ children }: PropsWithChildren) => {
    const [open, setOpen] = useState(false);

    return (
        <DropDownContext.Provider
            value={{
                open,
                setOpen,
                toggleOpen: () => setOpen(o => !o),
            }}
        >
            <div className="relative">{children}</div>
        </DropDownContext.Provider>
    );
};

/* ================================
   TRIGGER
================================ */
const Trigger = ({ children }: PropsWithChildren) => {
    const { open, setOpen, toggleOpen } = useContext(DropDownContext);

    return (
        <>
            <div onClick={toggleOpen}>{children}</div>

            {open && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)}
                ></div>
            )}
        </>
    );
};

/* ================================
   CONTENT
================================ */
const Content = ({
    align = 'right',
    width = '48',
    contentClasses = '',
    children,
}: PropsWithChildren<{
    align?: 'left' | 'right';
    width?: '48';
    contentClasses?: string;
}>) => {
    const { open, setOpen } = useContext(DropDownContext);

    const alignment =
        align === 'left'
            ? 'origin-top-left start-0'
            : 'origin-top-right end-0';

    return (
        <Transition show={open}>
            <div
                className={`absolute z-50 mt-2 rounded-md shadow-lg ${alignment} w-48`}
                onClick={() => setOpen(false)}
            >
                <div className={`dropdown-content rounded-md ring-1 ring-black ring-opacity-5 ${contentClasses}`}>
                    {children}
                </div>
            </div>
        </Transition>
    );
};

/* ================================
   LINK DEL DROPDOWN
================================ */
const DropdownLink = ({
    className = '',
    children,
    ...props
}: InertiaLinkProps & { children: ReactNode }) => {
    return (
        <Link
            {...props}
            className={`dropdown-link ${className}`}
        >
            {children}
        </Link>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
