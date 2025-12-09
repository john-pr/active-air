import { createContext, useContext, useState, useCallback, useEffect } from "react";
import ErrorToast from "../shared/ui/ErrorToast";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

let toastIdCounter = 0;
let globalShowError = null;

export const showErrorToast = ({ statusCode, description }) => {
  if (globalShowError) {
    globalShowError({ statusCode, description });
  }
};

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([
    //test toast
    // { id: 0, type: "error", statusCode: 404, description: "Test error toast" }
  ]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showError = useCallback(({ statusCode, description }) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, type: "error", statusCode, description }]);
    return id;
  }, []);

  useEffect(() => {
    globalShowError = showError;
    return () => {
      globalShowError = null;
    };
  }, [showError]);


  return (
    <ToastContext.Provider value={{showError, removeToast}}>
      {children}
      <div className="fixed flex flex-col gap-2 top-2.5 right-2.5 z-1000">
        
        {toasts.map((toast) => (
          <ErrorToast
            key={toast.id}
            statusCode={toast.statusCode}
            description={toast.description}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
