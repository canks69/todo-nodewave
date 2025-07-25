import { useAuthStore } from "@/store/auth-store";

export const handleUnauthorized = () => {
  // Clear auth state
  useAuthStore.getState().clearAuth();
  
  // Redirect to sign-in page
  if (typeof window !== 'undefined') {
    // Use replace to prevent going back to the previous page
    window.location.replace('/sign-in');
  }
};

// Hook untuk menangani unauthorized error secara manual jika diperlukan
export const useHandleUnauthorized = () => {
  return handleUnauthorized;
};
