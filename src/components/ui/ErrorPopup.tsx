interface ErrorPopupProps {
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ErrorPopup: React.FC<ErrorPopupProps> = ({ error, setError }) => {

    return (
            <div>
                {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="p-1 text-red-400 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors"
            aria-label="Close error"
          >
            ✕
          </button>
        </div>
      )}
            </div>
);
}
export default ErrorPopup;