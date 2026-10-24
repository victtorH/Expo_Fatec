import React from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface FeedbackBannerProps {
  type: 'error' | 'success';
  message: string;
  details?: string;
  onDismiss?: () => void;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  type,
  message,
  details,
  onDismiss,
}) => {
  const isError = type === 'error';

  return (
    <div
      className={`relative w-full max-w-xl mx-auto my-2 p-3.5 rounded-sm border-2 shadow-md flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200 select-none ${
        isError
          ? 'bg-red-50 border-red-400 text-red-950'
          : 'bg-emerald-50 border-emerald-400 text-emerald-950'
      }`}
      role="alert"
    >
      <div className="shrink-0 mt-0.5">
        {isError ? (
          <AlertTriangle className="w-6 h-6 text-red-600" />
        ) : (
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        )}
      </div>

      <div className="flex-1">
        <h4 className="font-caveat font-bold text-2xl leading-tight">
          {message}
        </h4>
        {details && (
          <p className="font-hand text-base text-slate-700 mt-0.5">
            {details}
          </p>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
          aria-label="Dispensar aviso"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
