import { useAuthStore } from "@/store/auth-store";

export const handleUnauthorized = () => {
  // Clear auth state immediately
  const clearAuth = useAuthStore.getState().clearAuth;
  clearAuth();
  
  // Force immediate redirect without any delay
  if (typeof window !== 'undefined') {
    // Stop any ongoing operations first
    window.stop?.();
    // Use location.href for immediate redirect
    window.location.href = '/sign-in';
  }
};

// Hook untuk menangani unauthorized error secara manual jika diperlukan
export const useHandleUnauthorized = () => {
  return handleUnauthorized;
};
