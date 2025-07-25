import {useMutation} from "@tanstack/react-query";
import api from "@/lib/api";
import {LoginFormData} from "@/components/form-login";
import {MAIL_SUFFIX, RegisterFormData} from "@/components/form-register";

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await api.post("/login", data);
      return response.data;
    }
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const email = data.email.includes('@') ? data.email : `${data.email}${MAIL_SUFFIX}`;
      const transformedData = {
        email,
        fullName: `${data.firstName} ${data.lastName}`,
        password: data.password,
      };
      
      const response = await api.post("/register", transformedData);
      return response.data;
    }
  })
}

export function useVerifyToken() {
  return useMutation({
    mutationFn: async (token: string) => {
      const response = await api.post("/verify-token", { token });
      return response.data;
    },
    retry: false,
  });
}