import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordInputProps {
  id: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  showIcon?: boolean;
  autoComplete?: string;
}

export default function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder = "••••••••",
  label = "Contraseña",
  required = false,
  disabled = false,
  className = "",
  showIcon = true,
  autoComplete = "current-password"
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {showIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          name={name || id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`block w-full ${showIcon ? 'pl-11' : 'pl-4'} pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_color focus:border-transparent outline-none transition-all text-gray-800 placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
