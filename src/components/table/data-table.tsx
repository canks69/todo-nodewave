"use client";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {useState} from "react";
import { TablePagination } from "./table-pagination";
import { TableToolbar } from "./table-toolbar";
import { FacetedFilterProps } from "./table-filter";
import { FilterValue, FilterValues, Filters, PaginationState, MetaResponse, DataTableParams, TableFilters, FilterHandler, SearchHandler, PaginationHandler } from "@/types/table";

// Re-export types for backward compatibility
export type { FilterValue, FilterValues, Filters, PaginationState, MetaResponse, DataTableParams, TableFilters, FilterHandler, SearchHandler, PaginationHandler };

export interface ColumnProps {
  key: string
  label: string
  header?: (value: unknown) => React.ReactNode
  render?: (value: unknown, item: Record<string, unknown>) => React.ReactNode
}

interface DataTableProps<TData extends Record<string, unknown> & { id?: string | number }> {
  columns: ColumnProps[]
  data?: TData[]
  meta?: MetaResponse
  onPaginationChange?: PaginationHandler
  onSearchChange?: SearchHandler
  onFiltersChange?: FilterHandler
  searchPlaceholder?: string
  datePickerType?: 'date' | 'month'
  isLoading?: boolean
  filterOptions?: FacetedFilterProps[]
}

export function DataTable<TData extends Record<string, unknown> & { id?: string | number }>({
  columns,
  data,
  onPaginationChange,
  onSearchChange,
  onFiltersChange,
  searchPlaceholder,
  meta,
  isLoading = false,
  filterOptions = []
}: DataTableProps<TData>) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<TableFilters>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });

  const handlePaginationChange = (newPagination: PaginationState) => {
    setPagination(newPagination);
    
    if (onPaginationChange) {
      onPaginationChange(newPagination);
    }
  };

  const handleSearchChange = (searchValue: string) => {
    setSearch(searchValue);
    const resetPagination = {
      ...pagination,
      pageIndex: 0
    };
    setPagination(resetPagination);
    
    if (onSearchChange) {
      onSearchChange(searchValue);
    }
    
    if (onPaginationChange) {
      onPaginationChange(resetPagination);
    }
  };

  const handleFiltersChange: FilterHandler = (newFilters) => {
    setFilters(newFilters);
    
    const resetPagination = {
      ...pagination,
      pageIndex: 0
    };
    setPagination(resetPagination);
    
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
    
    if (onPaginationChange) {
      onPaginationChange(resetPagination);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setFilters({});
    
    const resetPagination = {
      ...pagination,
      pageIndex: 0
    };
    setPagination(resetPagination);
    
    if (onSearchChange) {
      onSearchChange('');
    }
    
    if (onFiltersChange) {
      onFiltersChange({});
    }
    
    if (onPaginationChange) {
      onPaginationChange(resetPagination);
    }
  };

  return (
    <div className='space-y-4'>
      <TableToolbar
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder={searchPlaceholder}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onResetFilters={handleResetFilters}
        filterOptions={filterOptions}
      />
      <div className='relative rounded-md border max-h-[80vh] overflow-y-auto'>
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>
                  {column.header ? column.header(column.label) : column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data && data.length > 0 ? (
              data.map((item, index) => (
                <TableRow key={item.id || index} className='group/row hover:bg-accent'>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render 
                        ? column.render(item[column.key], item)
                        : (item[column.key] as React.ReactNode) || '-'
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <p>No results found.</p>
                    {search && <p className="text-sm">Try adjusting your search criteria.</p>}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <TablePagination
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        meta={meta}
      />
    </div>
  );
}
