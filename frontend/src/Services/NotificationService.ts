import { toast } from "react-toastify";

export const NotificationService = {
  showNotification: (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      type: type,
    });
  },
};

// Usage example:
// NotificationService.showNotification('This is a success message!', 'success');
// NotificationService.showNotification('This is an error message!', 'error');
