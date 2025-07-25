"use client"

import {Button} from "@/components/ui/button";
import { InputLabel} from "@/components/form/input-label";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Form, FormField} from "@/components/ui/form";
import {useLogin} from "@/service/auth-service";
import { AxiosError } from "axios";
import {toast} from "sonner";
import { useAuthStore } from "@/store/auth-store";
import {useRouter} from "next/navigation";
import Link from "next/link";

const LoginSchema = z.object({
  email: z.string()
    .min(1, "Email or Username is required")
    .email("Email format is invalid"),
  password: z.string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof LoginSchema>

export function FormLogin() {
  const router = useRouter()
  const login = useLogin()
  const setAuth = useAuthStore(state => state.setAuth)
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    }
  })

  const handleSubmit = async (data: z.infer<typeof LoginSchema>) => {
    form.clearErrors()
    
    try {
      const response = await login.mutateAsync(data)
      const { user, token } = response.content
      setAuth(user, token)
      
      toast.success(response.message || 'Successfully logged in!', {
        duration: 3000,
        position: "top-right",
      })
      router.push('/')

    } catch (error) {
      let errorMessage = "An error occurred during login"
      
      if (error instanceof AxiosError && error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      toast.error('Login failed: ' + errorMessage, {
        duration: 5000,
        position: "top-right",
      })

      form.setError("password", {
        type: "server",
        message: errorMessage
      })
    }
  }

  return (
    <Form {...form}>
      <form
        id={`form-login`}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md space-y-6">
        <FormField
          name={"email"}
          control={form.control}
          render={({field, fieldState}) => (
            <InputLabel
              id="email"
              type="text"
              label="Your Email / Username"
              error={!!fieldState.error}
              {...field}
            />
          )}
        />

        <FormField
          name={"password"}
          control={form.control}
          render={({field, fieldState}) => (
            <InputLabel
              id="password"
              type="password"
              label="Your Password"
              error={!!fieldState.error}
              {...field}
            />
          )}
        />

        <div className="flex items-center justify-between text-sm text-gray-600">
          <FormField
            name={"rememberMe"}
            control={form.control}
            render={({field}) => (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={field.value}
                  onChange={field.onChange}
                  className="w-4 h-4 text-blue-600 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-600">
                  Remember Me
                </label>
              </div>
            )}
          />
          <Link href="/forgot-password" className="text-blue-500 font-medium hover:underline">
            Forgot Password
          </Link>
        </div>
        
        <Button type="submit" className={"w-full"}>
          Login
        </Button>
      </form>
    </Form>
  )
}