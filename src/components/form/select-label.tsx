import { cn } from "@/lib/utils"

interface SelectLabelProps extends React.ComponentProps<"select"> {
  className?: string
  label?: string
  disabled?: boolean
  required?: boolean
  error?: boolean
}
export function SelectLabel({ className, error, ...props }: SelectLabelProps) {
  return (
    <div className={cn(
      `w-full relative rounded-lg border px-4 py-3 text-gray-800 text-sm`,
      error 
        ? "border-red-400 focus-within:outline-none focus-within:ring-1 focus-within:ring-red-400" 
        : "border-blue-400 focus-within:ring-1 focus-within:ring-blue-400",
      className,
    )}>
      <select
        className="w-full bg-transparent outline-none"
        {...props}
      >
        {props.children}
      </select>
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