"use client"

import {FormLogin} from "@/components/form-login";
import Link from "next/link";

export default function SignInPage() {

  return (
    <>
      <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Sign In</h1>
      <p className="text-sm text-gray-500 mb-10 max-w-md text-center">
        Just sign in if you have an account in here. Enjoy our Website
      </p>
      <FormLogin/>
      <p className="mt-8 text-xs text-blue-600 font-semibold">
        Already have an Square account? <Link href="/sign-up" className="underline">Sign up</Link>
      </p>
    </>
  );
}