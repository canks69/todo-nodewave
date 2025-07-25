import { cn } from "@/lib/utils"
import { Button } from "../ui/button"

interface InputPhoneProps extends React.ComponentProps<"input"> {
  className?: string
  type?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: boolean
}

export function InputPhone({ className, type, error, ...props }: InputPhoneProps) {
  return (
    <div className="w-full flex flex-row gap-4">
      <Button
        variant="outline"
        type="button"
        className="w-12 h-12 text-blue-400 rounded-l-lg text-xs font-semibold border-blue-400"
        disabled={props.disabled}
      >
        +62
      </Button>
      <div className={cn(
        `w-full relative rounded-lg border px-4 py-3 text-gray-800 text-sm`,
        error 
          ? "border-red-400 focus-within:outline-none focus-within:ring-1 focus-within:ring-red-400" 
          : "border-blue-400 focus-within:ring-1 focus-within:ring-blue-400",
        className,
      )}>
        <input
          type={type}
          className="w-full bg-transparent outline-none"
          {...props}
        />
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
    </div>
  )
}