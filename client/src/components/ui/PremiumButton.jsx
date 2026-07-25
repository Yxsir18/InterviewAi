import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const PremiumButton = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] text-[var(--color-text-heading)] shadow-md hover:shadow-lg hover:-translate-y-0.5',
    secondary: 'bg-[var(--color-surface)] text-[var(--color-text-heading)] border border-[var(--color-border)] hover:bg-[var(--color-bg-card)] hover:border-[var(--color-primary-blue)]',
    outline: 'bg-transparent text-[var(--color-primary-blue)] border border-[var(--color-primary-blue)] hover:bg-[var(--color-hover)]',
    ghost: 'bg-transparent text-[var(--color-text-heading)] hover:bg-[var(--color-hover)]',
    danger: 'bg-[var(--color-error)] text-[var(--color-text-heading)] hover:bg-red-600',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  const disabledClasses = disabled || loading
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : 'cursor-pointer';

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;

  return (
    <motion.button
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
    </motion.button>
  );
};

export const IconButton = ({
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-lg transition-all duration-200 flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] text-[var(--color-text-heading)] shadow-md hover:shadow-lg',
    secondary: 'bg-[var(--color-surface)] text-[var(--color-text-heading)] border border-[var(--color-border)] hover:bg-[var(--color-bg-card)]',
    outline: 'bg-transparent text-[var(--color-primary-blue)] border border-[var(--color-primary-blue)] hover:bg-[var(--color-hover)]',
    ghost: 'bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] hover:bg-[var(--color-hover)]',
    danger: 'bg-transparent text-[var(--color-error)] hover:bg-red-500/10',
  };

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
    xl: 'p-4',
  };

  const disabledClasses = disabled || loading
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : 'cursor-pointer';

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;

  return (
    <motion.button
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Icon className="w-4 h-4" />
      )}
    </motion.button>
  );
};

export default PremiumButton;
