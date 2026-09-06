import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated' | 'bordered';
  glow?: 'none' | 'yellow' | 'mint' | 'amber' | 'coral' | 'indigo';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'glass',
  glow = 'none',
  ...props
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-200';
  
  let variantClasses = 'bg-[#131926] border border-[#1F2737] shadow-card';
  if (variant === 'glass') {
    variantClasses = 'bg-[#131926]/90 backdrop-blur-xl border border-[#1F2737] shadow-card';
  } else if (variant === 'elevated') {
    variantClasses = 'bg-[#151C2B] border border-[#243046] shadow-xl';
  } else if (variant === 'bordered') {
    variantClasses = 'bg-[#0E131E]/60 border border-[#1F2737]';
  }

  let glowClasses = '';
  if (glow === 'yellow' || glow === 'indigo') glowClasses = 'hover:border-[#EEFC57]/50 hover:shadow-yellow-glow';
  if (glow === 'mint') glowClasses = 'hover:border-emerald-500/50 hover:shadow-glow-mint';
  if (glow === 'amber') glowClasses = 'hover:border-amber-500/50 hover:shadow-glow-amber';
  if (glow === 'coral') glowClasses = 'hover:border-rose-500/50 hover:shadow-glow-coral';

  return (
    <div className={`${baseClasses} ${variantClasses} ${glowClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'mint';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-150 focus:outline-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2.5 gap-2',
    lg: 'text-sm sm:text-base px-6 py-3.5 gap-2.5'
  }[size];

  const variantClasses = {
    primary: 'bg-[#EEFC57] hover:bg-[#E0EE45] text-[#0B0F17] shadow-md hover:shadow-yellow-glow',
    secondary: 'bg-[#1A2336] hover:bg-[#222E46] text-white border border-[#243046]',
    outline: 'border border-[#243046] hover:border-[#EEFC57] text-slate-200 hover:text-[#EEFC57] bg-transparent',
    ghost: 'text-slate-400 hover:text-white hover:bg-[#1A2336] bg-transparent',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-md',
    mint: 'bg-emerald-500 hover:bg-emerald-600 text-[#0B0F17] shadow-md'
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'indigo' | 'mint' | 'amber' | 'coral' | 'slate' | 'outline' | 'yellow';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'indigo',
  size = 'md',
  className = '',
  icon
}) => {
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';
  
  const variantClasses = {
    yellow: 'bg-[#EEFC57]/15 text-[#EEFC57] border border-[#EEFC57]/30 font-bold',
    indigo: 'bg-[#EEFC57]/15 text-[#EEFC57] border border-[#EEFC57]/30 font-bold',
    mint: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold',
    amber: 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold',
    coral: 'bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold',
    slate: 'bg-slate-800 text-slate-300 border border-slate-700 font-medium',
    outline: 'border border-slate-700 text-slate-300 bg-transparent'
  }[variant];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full ${sizeClasses} ${variantClasses} ${className}`}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

interface ProgressBarProps {
  value: number; // 0 to 100+
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dynamicColor?: boolean;
  variant?: 'indigo' | 'mint' | 'amber' | 'coral' | 'yellow';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'md',
  className = '',
  dynamicColor = true,
  variant = 'yellow'
}) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  const rawRatio = value / max;

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5'
  }[size];

  let barColorClass = 'bg-[#EEFC57] shadow-yellow-glow';
  if (dynamicColor) {
    if (rawRatio < 0.8) {
      barColorClass = 'bg-emerald-400 shadow-glow-mint';
    } else if (rawRatio < 1.0) {
      barColorClass = 'bg-amber-400 shadow-glow-amber';
    } else {
      barColorClass = 'bg-rose-500 shadow-glow-coral';
    }
  } else {
    if (variant === 'mint') barColorClass = 'bg-emerald-400';
    if (variant === 'amber') barColorClass = 'bg-amber-400';
    if (variant === 'coral') barColorClass = 'bg-rose-500';
  }

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-1.5">
          <span>{label}</span>
          {showPercentage && (
            <span className={rawRatio >= 1.0 ? 'text-rose-400 font-bold' : rawRatio >= 0.8 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-[#0E131E] border border-[#1F2737] rounded-full overflow-hidden ${heightClasses}`}>
        <div
          className={`${heightClasses} ${barColorClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md'
}) => {
  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl'
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-fade-slide-up">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className={`relative bg-[#131926] rounded-3xl border border-[#243046] shadow-2xl w-full ${maxWidthClass} overflow-hidden z-10 my-8 text-white`}>
        {title && (
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#1F2737]">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white rounded-full p-1.5 hover:bg-[#1A2336] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6 max-h-[85vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
