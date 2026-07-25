import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Search, X } from 'lucide-react';

const PremiumInput = forwardRef(
  (
    {
      type = 'text',
      label,
      placeholder = '',
      error = '',
      icon: Icon,
      onClear,
      className = '',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
      <div className={`space-y-1 ${className}`}>
        {label && (
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            {label}
          </label>
        )}
        <div
          className={`relative flex items-center bg-[var(--color-bg-secondary)] border rounded-lg transition-all duration-200 ${
            error
              ? 'border-[var(--color-danger)]'
              : isFocused
              ? 'border-[var(--color-accent-primary)] shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
              : 'border-[var(--color-border)]'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {Icon && (
            <div className="absolute left-3 text-[var(--color-text-muted)]">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full bg-transparent text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] py-2.5 px-3 outline-none transition-colors ${
              Icon ? 'pl-10' : 'pl-3'
            } ${onClear ? 'pr-10' : 'pr-3'}`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-[var(--color-danger)]"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

PremiumInput.displayName = 'PremiumInput';

export const SearchInput = ({ onSearch, onClear, ...props }) => {
  return (
    <PremiumInput
      icon={Search}
      onClear={onClear}
      placeholder="Search..."
      {...props}
    />
  );
};

export const TextArea = forwardRef(
  ({ label, placeholder = '', error = '', className = '', rows = 4, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className={`space-y-1 ${className}`}>
        {label && (
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          placeholder={placeholder}
          rows={rows}
          className={`w-full bg-[var(--color-bg-secondary)] border rounded-lg p-3 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none transition-all duration-200 resize-none ${
            error
              ? 'border-[var(--color-danger)]'
              : isFocused
              ? 'border-[var(--color-accent-primary)] shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
              : 'border-[var(--color-border)]'
          }`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-[var(--color-danger)]"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export const Select = forwardRef(
  ({ label, options = [], error = '', className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className={`space-y-1 ${className}`}>
        {label && (
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full bg-[var(--color-bg-secondary)] border rounded-lg p-2.5 text-[var(--color-text-primary)] outline-none transition-all duration-200 ${
            error
              ? 'border-[var(--color-danger)]'
              : isFocused
              ? 'border-[var(--color-accent-primary)] shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
              : 'border-[var(--color-border)]'
          }`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-[var(--color-danger)]"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default PremiumInput;
