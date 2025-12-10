import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { X, AlertCircle } from "lucide-react";

const TOAST_DURATION = 3000;

const ErrorToast = ({ statusCode, description, onClose }) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, TOAST_DURATION);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`
        flex items-center gap-3 p-4 min-w-72 max-w-sm
        bg-white bg-clip-padding border-2 border-[rgba(0,0,0,0.2)]
        dark:bg-gray-700
        rounded-sm shadow-sm
        transition-all duration-300 ease-out
        ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}
      `}
      role="alert"
    >
      <AlertCircle
        className="text-red-500 shrink-0 dark:text-red-400"
        size={20}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-red-600 dark:text-red-400">
            {t("error.title")}
          </span>
          {statusCode && (
            <span className="text-gray-500 semibold dark:text-gray-400">
              {statusCode}
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm text-gray-600 truncate dark:text-white">
            {description}
          </p>
        )}
      </div>
      <button
        onClick={handleClose}
        className="p-1 text-gray-400 transition-colors cursor-pointer shrink-0 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        aria-label={t("error.dismiss")}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default ErrorToast;
