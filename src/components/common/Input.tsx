import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-bold text-gray-900">
            {label}
          </label>
        )}
        <div className="relative group">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            </div>
          )}
          <input
            ref={ref}
            className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 font-medium text-gray-900 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 font-medium flex items-center space-x-1">
            <span>❌</span>
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;