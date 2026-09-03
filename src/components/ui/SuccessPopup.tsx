interface SuccessPopupProps {
  message: string | null;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

export const SuccessPopup: React.FC<SuccessPopupProps> = ({ message, setMessage }) => {
      return (
            <div>
                {message && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{message}</span>
          </div>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="p-1 text-green-400 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors"
            aria-label="Close message"
          >
            ✕
          </button>
        </div>
      )}
            </div>
);
}

export default SuccessPopup;