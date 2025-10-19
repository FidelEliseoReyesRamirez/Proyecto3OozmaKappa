// resources/js/Components/RedButton.tsx

import { ButtonHTMLAttributes } from 'react';

// Define las propiedades del botón
interface RedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string; 
    disabled?: boolean;
}

export default function RedButton({ className = '', disabled, children, ...props }: RedButtonProps) {
    
    const baseCommonStyle = "bg-red-700 hover:bg-red-600 px-2 py-1 rounded-md text-xs sm:text-sm font-medium transition duration-150 text-white";
    

    return (
        <button
            {...props} 
            className={
                `${baseCommonStyle} ${
                    disabled && 'opacity-50 cursor-not-allowed' 
                } ${className}`
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}