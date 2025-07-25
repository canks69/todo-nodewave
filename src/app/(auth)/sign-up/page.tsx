import { FormRegister } from "@/components/form-register";

export default function SignUpPage() {
  return (
    <>
      <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
        Register
      </h1>
      <p className="text-sm text-gray-500 mb-10 max-w-md text-center">
        Let’s Sign up first for enter into Square Website. Uh She Up!
      </p>
      <FormRegister />
    </>
  );
}