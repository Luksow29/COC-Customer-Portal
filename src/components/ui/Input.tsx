import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

export default function Input({ 
  icon, 
  error, 
  className = '', 
  ...props 
}: InputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          {icon}
        </div>
      )}
      <input
        className={`
          block w-full rounded-lg border-gray-300 shadow-sm transition-colors
          ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
            : 'focus:border-blue-500 focus:ring-blue-500'
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}