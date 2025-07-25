import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TablePaginationState {
  pageIndex: number;
  pageSize: number;
  search: string;
}

interface TableStore {
  pagination: TablePaginationState;
  setPagination: (pagination: Partial<TablePaginationState>) => void;
  resetPagination: () => void;
}

// Store with persistence
export const useTableStore = create<TableStore>()(
  persist(
    (set) => ({
      pagination: {
        pageIndex: 0,
        pageSize: 10,
        search: ''
      },
      setPagination: (newPagination) =>
        set((state) => ({
          pagination: { ...state.pagination, ...newPagination }
        })),
      resetPagination: () =>
        set(() => ({
          pagination: {
            pageIndex: 0,
            pageSize: 10,
            search: ''
          }
        }))
    }),
    {
      name: 'table-pagination-store'
    }
  )
);

export const useTableMemoryStore = create<TableStore>()((set) => ({
  pagination: {
    pageIndex: 0,
    pageSize: 10,
    search: ''
  },
  setPagination: (newPagination) =>
    set((state) => ({
      pagination: { ...state.pagination, ...newPagination }
    })),
  resetPagination: () =>
    set(() => ({
      pagination: {
        pageIndex: 0,
        pageSize: 10,
        search: ''
      }
    }))
}));
