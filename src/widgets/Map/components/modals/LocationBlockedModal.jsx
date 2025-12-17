import { useTranslation } from "react-i18next";
import { Lock, Info } from "lucide-react";

const LocationBlockedModal = ({ onClose }) => {
  const { t } = useTranslation();

  const handleClose = () => {
    if (typeof onClose === "function") onClose();
  };

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center backdrop-blur-sm bg-white/30 dark:bg-black/40">
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6 max-w-md mx-4 border-2 border-[rgba(0,0,0,0.2)]">
        <h2 className="text-xl font-semibold mb-4 text-orange-600 dark:text-orange-400">
          {t("location_blocked_title")}
        </h2>

        <p className="text-gray-700 dark:text-gray-200 mb-4">
          {t("location_blocked_message")}
        </p>

        <ol className="list-decimal list-inside text-gray-700 dark:text-gray-200 mb-4 space-y-2">
          <li>
            {t("location_blocked_step1_prefix")}
            <Lock
              className="inline mx-1.5 text-gray-800 dark:text-gray-100"
              size={15}
              aria-label="lock icon"
            />
            {t("location_blocked_or")}
            <Info
              className="inline mx-1.5 text-gray-800 dark:text-gray-100"
              size={15}
              aria-label="info icon"
            />
            {t("location_blocked_step1_suffix")}
          </li>
          <li>{t("location_blocked_step2")}</li>
          <li>{t("location_blocked_step3")}</li>
          <li>{t("location_blocked_step4")}</li>
        </ol>

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-md transition-colors cursor-pointer"
          >
            {t("location_blocked_ok")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationBlockedModal;
