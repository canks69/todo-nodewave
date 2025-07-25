import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronsLeftIcon, ChevronRight, ChevronsRightIcon} from "lucide-react";
import type { MetaResponse, PaginationState } from "./data-table";

interface TablePaginationProps {
  pagination: PaginationState
  onPaginationChange: (pagination: PaginationState) => void
  meta?: MetaResponse
  pageSizeOptions?: number[]
}

export function TablePagination({
  pagination,
  onPaginationChange,
  meta = { totalData: 0, totalPage: 1 },
  pageSizeOptions = [10, 20, 50, 100]
}: TablePaginationProps) {
  const safePagination = {
    pageIndex: pagination?.pageIndex ?? 0,
    pageSize: pagination?.pageSize ?? 10
  }
  
  const totalData = Math.max(meta?.totalData || 0, 0)
  const totalPages = Math.max(meta?.totalPage || 1, 1)
  
  const currentPage = Math.min(safePagination.pageIndex + 1, totalPages)
  
  const startItem = totalData > 0 ? safePagination.pageIndex * safePagination.pageSize + 1 : 0
  const endItem = totalData > 0 ? Math.min(startItem + safePagination.pageSize - 1, totalData) : 0

  const handlePageSizeChange = (newPageSize: number) => {
    const newPagination = {
      pageIndex: 0,
      pageSize: newPageSize
    };
    onPaginationChange(newPagination);
  }

  const handleFirstPage = () => {
    const newPagination = {
      ...safePagination,
      pageIndex: 0
    };
    onPaginationChange(newPagination);
  }

  const handlePreviousPage = () => {
    if (safePagination.pageIndex > 0) {
      const newPageIndex = Math.max(safePagination.pageIndex - 1, 0);
      const newPagination = {
        ...safePagination,
        pageIndex: newPageIndex
      };
      onPaginationChange(newPagination);
    }
  }

  const handleNextPage = () => {
    if (safePagination.pageIndex < totalPages - 1) {
      const newPageIndex = Math.min(safePagination.pageIndex + 1, totalPages - 1);
      const newPagination = {
        ...safePagination,
        pageIndex: newPageIndex
      };
      onPaginationChange(newPagination);
    }
  }

  const handleLastPage = () => {
    const newPageIndex = Math.max(totalPages - 1, 0);
    const newPagination = {
      ...safePagination,
      pageIndex: newPageIndex
    };
    onPaginationChange(newPagination);
  }

  const canPreviousPage = safePagination.pageIndex > 0 && totalData > 0
  const canNextPage = safePagination.pageIndex < totalPages - 1 && totalData > 0

  return (
    <div className='flex items-center justify-end space-x-6 lg:space-x-8 px-2'>
      <div className='flex items-center space-x-2'>
        <p className='text-sm font-medium'>Rows per page</p>
        <Select
          value={safePagination.pageSize.toString()}
          onValueChange={(value) => handlePageSizeChange(Number(value))}
        >
          <SelectTrigger className='h-8 w-[70px]'>
            <SelectValue placeholder={safePagination.pageSize} />
          </SelectTrigger>
          <SelectContent side='top'>
            {pageSizeOptions.map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className='flex w-[120px] items-center justify-center text-sm font-medium'>
        {totalData > 0 ? (
          <span>
            {startItem.toLocaleString()}-{endItem.toLocaleString()} of {totalData.toLocaleString()}
          </span>
        ) : (
          <span>No data</span>
        )}
      </div>
      
      <div className='flex items-center space-x-2'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm font-medium'>
            {totalData > 0 ? `Page ${currentPage} of ${totalPages}` : 'Page 0 of 0'}
          </p>
        </div>
        
        <div className='flex items-center space-x-1'>
          <Button
            variant='outline'
            size='sm'
            onClick={handleFirstPage}
            disabled={!canPreviousPage}
            className='h-8 w-8 p-0'
          >
            <span className='sr-only'>Go to first page</span>
            <ChevronsLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={handlePreviousPage}
            disabled={!canPreviousPage}
            className='h-8 w-8 p-0'
          >
            <span className='sr-only'>Go to previous page</span>
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={handleNextPage}
            disabled={!canNextPage}
            className='h-8 w-8 p-0'
          >
            <span className='sr-only'>Go to next page</span>
            <ChevronRight className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={handleLastPage}
            disabled={!canNextPage}
            className='h-8 w-8 p-0'
          >
            <span className='sr-only'>Go to last page</span>
            <ChevronsRightIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}