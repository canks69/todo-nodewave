import { CheckIcon, PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent } from "../ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Command,  CommandEmpty,  CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../ui/command";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";

export interface FacetedFilterProps {
    key: string
    title?: string
    options?: OptionFilter[]
    selectedValues?: (string | number | boolean)[]
    onValueChange?: (values: (string | number | boolean)[]) => void
    isMultiple?: boolean
}

interface OptionFilter {
    label: string
    value: string | number | boolean
    icon?: React.ReactNode
}

export function FacetedFilter({ 
  title, 
  options = [], 
  selectedValues = [], 
  onValueChange,
  isMultiple = false
}: FacetedFilterProps) {
  
  const handleSelect = (value: string | number | boolean) => {
    let newValues: (string | number | boolean)[];
    
    if (isMultiple) {
      newValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value];
    } else {
      newValues = selectedValues.includes(value) ? [] : [value];
    }
    
    if (onValueChange) {
      onValueChange(newValues);
    }
  };

  const handleClearAll = () => {
    if (onValueChange) {
      onValueChange([]);
    }
  };

  console.log('selectedValues', selectedValues);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 border-dashed'>
          <PlusCircle className='h-4 w-4' />
            {title || 'Add Filter'}
          {selectedValues.length > 0 && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge
                variant='secondary'
                className='rounded-sm px-1 font-normal lg:hidden'
              >
                {selectedValues.length} selected
              </Badge>
              <div className='hidden space-x-1 lg:flex'>
                {selectedValues.map((value, index) => (
                  <Badge key={index} variant='secondary' className='rounded-sm px-1 font-normal'>
                    {options.find(option => option.value === value)?.label || String(value)}
                  </Badge>
                ))}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
       <PopoverContent className='w-[200px] p-0' align='start'>
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
                {options?.map((option) => (
                    <CommandItem 
                      key={`option-${option.value}`} 
                      value={String(option.value)}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <div
                        className={cn(
                          'border-primary flex h-4 w-4 items-center justify-center rounded-sm border',
                          selectedValues.includes(option.value) ? 'bg-primary text-primary-foreground' : 'opacity-50'
                        )}
                      >
                        {selectedValues.includes(option.value) && (
                          <CheckIcon className='h-4 w-4' />
                        )}
                      </div>
                      <span className='ml-2'>{option.label}</span>
                    </CommandItem>
                ))}
            </CommandGroup>
            {selectedValues.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    className='justify-center text-center'
                    onSelect={handleClearAll}
                  >
                    Clear All
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
       </PopoverContent>
    </Popover>
  );
};