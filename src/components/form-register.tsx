"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form, FormField } from "./ui/form";
import { InputLabel } from "./form/input-label";
import { InputPhone } from "./form/input-phone";
import { SelectLabel } from "./form/select-label";
import { Button } from "./ui/button";
import Link from "next/link";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useRegister } from "@/service/auth-service";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export const MAIL_SUFFIX = "@nodewave.id";

const RegisterSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .min(3, "Username must be at least 3 characters"),
  firstName: z.string()
    .min(1, "First Name is required")
    .min(2, "First Name must be at least 2 characters"),
  lastName: z.string()
    .min(1, "Last Name is required")
    .min(2, "Last Name must be at least 2 characters"),
  phone: z.string()
    .min(1, "Phone number is required")
    .min(10, "Phone number must be at least 10 characters"),
  country: z.string()
    .min(1, "Country is required"),
  password: z.string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
    .min(1, "Confirm Password is required"),
  tellask: z.string()
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof RegisterSchema>;

export function FormRegister() {
  const router = useRouter();
  const register = useRegister();
  const setAuth = useAuthStore(state => state.setAuth);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "",
      password: "",
      confirmPassword: "",
      tellask: "",
    }
  });

  const handleSubmit = async (data: RegisterFormData) => {
    form.clearErrors();
    
    try {
      const response = await register.mutateAsync(data);
      const { user, token } = response.content;
      
      setAuth(user, token);
      
      toast.success('Registration successful!', {
        duration: 3000,
        position: "top-right",
      });
      
      router.push('/');
      
    } catch (error) {
      let errorMessage = "An error occurred during registration";
      
      if (error instanceof AxiosError && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error('Registration failed: ' + errorMessage, {
        duration: 5000,
        position: "top-right",
      });

      if (error instanceof AxiosError && error.response?.data?.errors) {
        const fieldErrors = error.response.data.errors;
        Object.keys(fieldErrors).forEach((field) => {
          form.setError(field as keyof RegisterFormData, {
            type: "server",
            message: fieldErrors[field][0]
          });
        });
      }
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-full md:max-w-1/3 space-y-8"
        >
        <div className="flex flex-row gap-4">
          <FormField
            name={"firstName"}
            control={form.control}
            render={({ field, fieldState }) => (
              <InputLabel
                id="firstName"
                type="text"
                label="First Name"
                error={!!fieldState.error}
                {...field}
              />
            )}
          />
          <FormField
            name={"lastName"}
            control={form.control}
            render={({ field, fieldState }) => (
              <InputLabel
                id="lastName"
                type="text"
                label="Last Name"
                error={!!fieldState.error}
                {...field}
              />
            )}
          />
        </div>
        <div className="flex flex-row gap-4">
          <FormField
            name={"phone"}
            control={form.control}
            render={({ field, fieldState }) => (
              <InputPhone
                id="phone"
                type="tel"
                label="Phone"
                error={!!fieldState.error}
                {...field}
              />
            )}
          />
          <FormField
            name={"country"}
            control={form.control}
            render={({ field, fieldState }) => (
              <SelectLabel
                id="country"
                label="Country"
                error={!!fieldState.error}
                {...field}
              >
                <option value="">Select a country</option>
                <option value="ID">Indonesia</option>
                <option value="MY">Malaysia</option>
                <option value="SG">Singapore</option>
              </SelectLabel>
            )}
          />
        </div>
        <FormField
          name={"email"}
          control={form.control}
          render={({ field, fieldState }) => (
            <InputLabel
              id="email"
              type="text"
              label="Email"
              error={!!fieldState.error}
              mailSuffix={MAIL_SUFFIX}
              {...field}
            />
          )}
        />
        <div className="flex flex-row gap-4">
          <FormField
            name={"password"}
            control={form.control}
            render={({ field, fieldState }) => (
              <InputLabel
                id="password"
                type="password"
                label="Password"
                error={!!fieldState.error}
                {...field}
              />
            )}
          />
          <FormField
            name={"confirmPassword"}
            control={form.control}
            render={({ field, fieldState }) => (
              <InputLabel
                id="confirmPassword"
                type="password"
                label="Confirm Password"
                error={!!fieldState.error}
                {...field}
              />
            )}
          />
        </div>
        <FormField
          name={"tellask"}
          control={form.control}
          render={({ field }) => (
            <>
              <Label
                htmlFor="tellask"
                className="text-sm text-gray-600 mt-0 mb-2"
              >
                Tell us about yourself
              </Label>
              <Textarea
                id="tellask"
                placeholder="Hello, my name is..."
                className="w-full bg-transparent outline-none border rounded-lg px-4 py-3 text-gray-800 text-sm"
                rows={5}
                {...field}
              />
            </>
          )}
        />
        <div className="w-full flex flex-row gap-4">
          <Link
            href="/sign-in"
            className="flex items-center text-md justify-center w-1/3 bg-gray-200 hover:bg-gray-100 font-semibold rounded-lg px-4 py-2 h-12"
          >
            Login
          </Link>
          <Button 
            variant="default"
            type="submit" 
            disabled={register.isPending}
            className="flex-1 text-center text-md font-semibold rounded-lg px-4 py-2 h-12 disabled:opacity-50">
            {register.isPending ? "Registering..." : "Register"}
          </Button>
        </div>
      </form>

    </Form>
  );
}