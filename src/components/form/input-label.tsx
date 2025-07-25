import * as React from "react"
import {cn} from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  className?: string
  type?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  mailSuffix?: string
  error?: boolean
}

export function InputLabel({ className, type, error, onChange, mailSuffix, ...props }: InputProps) {
  return (
    <div className={cn(
      `w-full relative rounded-lg border px-4 py-3 text-gray-800 text-sm`,
      error 
        ? "border-red-400 focus-within:outline-none focus-within:ring-1 focus-within:ring-red-400" 
        : "border-blue-400 focus-within:ring-1 focus-within:ring-blue-400",
      className,
      )}>
      <input
        type={type}
        className={cn(
          "w-full bg-transparent outline-none",
          props.id === "email" && "pr-32",
        )}
        onChange={(e) => {
          if (onChange) {
            onChange(e);
          }
        }}
        placeholder={props.id === "email" ? "username" : props.placeholder}
        {...props}
      />

      {mailSuffix && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          {mailSuffix}
        </div>
      )}

      {props.label && (
        <label
          htmlFor={props.id}
          className={cn(
            'cursor-text absolute left-4 text-xs transition-all duration-200 font-semibold -top-1/5 bg-white px-1',
            (error ? ' text-red-400' : ' text-blue-400'),
          )}>
          {props.label}
        </label>
      )}
    </div>
  )
}
