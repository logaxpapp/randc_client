// src/components/ui/Button.tsx

import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'link';
  icon?: React.ReactNode; // Optional icon
}

// Tailwind classes for different variants
const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:from-blue-600 hover:to-blue-700 hover:shadow-lg',
  secondary:
    'bg-gray-100 text-gray-800 border border-gray-300 shadow-sm hover:bg-gray-200 hover:shadow-md',
  tertiary:
    'bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-700',
  danger:
    'bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow-md',
  link:
    'text-blue-600 bg-transparent hover:underline border border-yellow-500 hover:border-yellow-600',
};

const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  variant = 'primary',
  fullWidth = false,
  icon,
  disabled,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={clsx(
        'px-4 py-2 rounded font-semibold transition-all duration-200 ease-in-out flex items-center justify-center gap-2',
        variantClasses[variant],
        fullWidth && 'w-full',
        (loading || disabled) && 'opacity-60 cursor-not-allowed'
      )}
    >
      {loading && (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
