import React from 'react';

/**
 * Small, reusable button with optional loading indicator.
 * Kept intentionally simple for easy reasoning.
 */
function Button({ onClick, children, disabled = false, variant = 'primary', isLoading = false }) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300',
    secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-400',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}

export default Button;
