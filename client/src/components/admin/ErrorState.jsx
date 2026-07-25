import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorState = ({
  title = 'Something went wrong',
  description = 'An error occurred while loading the data. Please try again.',
  onRetry,
  showRetry = true,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 bg-[rgba(239,68,68,0.1)] rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-[var(--color-error)]" />
      </div>
      <h3 className="text-xl font-semibold text-[var(--color-text-heading)] mb-2">{title}</h3>
      <p className="text-[var(--color-text-muted)] mb-6 max-w-md">{description}</p>
      
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center space-x-2 px-6 py-2 bg-[var(--color-primary-button)] text-white rounded-lg hover:bg-[var(--color-primary-blue-hover)] transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          <span className="text-sm font-medium">Retry</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
