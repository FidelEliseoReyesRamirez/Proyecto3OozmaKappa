// resources/js/Components/OkButton.tsx

import { ButtonHTMLAttributes } from 'react';

// Define las propiedades del botón
interface OkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    disabled?: boolean;
}

export default function OkButton({ className = '', disabled, children, ...props }: OkButtonProps) {
    
    const baseStyle = "bg-[#B3E10F] text-gray-900 px-2 py-1 rounded-md hover:bg-lime-300 transition duration-150 text-xs sm:text-sm font-bold shadow-md shadow-[#B3E10F]/30";

    return (
        <button
            {...props} 
            className={
                `${baseStyle} ${
                    disabled && 'opacity-50 cursor-not-allowed'
                } ${className}` 
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}