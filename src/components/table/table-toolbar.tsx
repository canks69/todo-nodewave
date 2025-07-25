import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {XIcon} from "lucide-react";
import { FacetedFilter, FacetedFilterProps } from "./table-filter";
import { TableFilters, FilterHandler, SearchHandler } from "@/types/table";

interface DataTableToolbarProps {
  searchValue?: string
  onSearchChange?: SearchHandler
  searchPlaceholder?: string
  filters?: TableFilters
  onFiltersChange?: FilterHandler
  onResetFilters?: () => void
  filterOptions?: FacetedFilterProps[]
}

export function TableToolbar({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = {},
  onFiltersChange,
  onResetFilters,
  filterOptions = [],
}: DataTableToolbarProps) {
  const hasFilters = searchValue.length > 0 || Object.keys(filters).length > 0
  
  const handleFilterChange = (key: string, values: (string | number | boolean)[]) => {
    const newFilters = { ...filters };
    
    if (!values || values.length === 0) {
      delete newFilters[key];
    } else {
      newFilters[key] = values.length === 1 ? values[0] : values;
    }
    
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };
  
  const handleReset = () => {
    if (onSearchChange) onSearchChange('')
    if (onFiltersChange) onFiltersChange({})
    if (onResetFilters) onResetFilters()
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {onSearchChange && (
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            className='h-8 w-[150px] lg:w-[250px]'
          />
        )}
        <div className='flex gap-x-2'>
          {filterOptions.map((filterOption) => {
            const currentValue = filters[filterOption.key];
            let selectedValues: (string | number | boolean)[] = [];
            
            if (currentValue !== undefined && currentValue !== null) {
              selectedValues = Array.isArray(currentValue) ? currentValue : [currentValue];
            }
            
            return (
              <FacetedFilter
                key={filterOption.key}
                title={filterOption.title}
                options={filterOption.options}
                selectedValues={selectedValues}
                onValueChange={(values) => handleFilterChange(filterOption.key, values)}
                isMultiple={filterOption.isMultiple}
              />
            );
          })}
        </div>
        {hasFilters && (
          <Button
            variant='ghost'
            onClick={handleReset}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <XIcon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
      </div>
    </div>
  );
};