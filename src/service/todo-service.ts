"use client";
import { DataTableParams } from "@/types/table";
import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query"

export interface Todo {
    id: string;
    item: string;
    isDone: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTodoData {
    item: string;
}

export interface UpdateTodoData {
    id: string;
    isDone: 'DONE' | 'TODO';
}

export function useTodos(params: DataTableParams) {
    return useQuery({
        queryKey: ['todos', params.page, params.limit, params.searchFilters, params.sortBy, params.filters], // Update query key
        queryFn: async () => {
            const queryParams = new URLSearchParams();
            
            if (params.page) {
                queryParams.append('page', params.page.toString());
            }
            if (params.limit) {
                queryParams.append('rows', params.limit.toString());
            }
            
            if (params.searchFilters && Object.keys(params.searchFilters).length > 0) {
                queryParams.append('searchFilters', JSON.stringify(params.searchFilters));
            }
            if (params.sortBy && params.sortBy.length > 0) {
                params.sortBy.forEach(([field, direction]) => {
                    queryParams.append('sortBy', `${field}:${direction}`);
                });
            }
            
            if (params.filters && Object.keys(params.filters).length > 0) {
                queryParams.append('filters', JSON.stringify(params.filters));
            }
            
            const queryString = queryParams.toString();
            const url = queryString ? `/todos?${queryString}` : '/todos';
            
            const response = await api.get(url);
            return response.data;
        },
        enabled: !!(params.page && params.limit), 
        staleTime: 0,
        gcTime: 1000 * 60 * 5,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        retry: 1
    });
}

export function useInfiniteTodos(params: Omit<DataTableParams, 'page'>) {
    return useInfiniteQuery({
        queryKey: ['infinite-todos', params.limit, params.searchFilters, params.sortBy, params.filters],
        queryFn: async ({ pageParam = 1 }) => {
            const queryParams = new URLSearchParams();
            
            queryParams.append('page', pageParam.toString());
            
            if (params.limit) {
                queryParams.append('rows', params.limit.toString());
            }
            
            if (params.searchFilters && Object.keys(params.searchFilters).length > 0) {
                queryParams.append('searchFilters', JSON.stringify(params.searchFilters));
            }
            if (params.sortBy && params.sortBy.length > 0) {
                params.sortBy.forEach(([field, direction]) => {
                    queryParams.append('sortBy', `${field}:${direction}`);
                });
            }
            
            if (params.filters && Object.keys(params.filters).length > 0) {
                queryParams.append('filters', JSON.stringify(params.filters));
            }
            
            const queryString = queryParams.toString();
            const url = queryString ? `/todos?${queryString}` : '/todos';
            
            const response = await api.get(url);
            return response.data;
        },
        getNextPageParam: (lastPage) => {
            const currentPage = lastPage.content?.currentPage || 1;
            const totalPages = lastPage.content?.totalPage || 1;
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
        initialPageParam: 1,
        staleTime: 0,
        gcTime: 1000 * 60 * 5,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        retry: 1
    });
}

export function useCreateTodo() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: CreateTodoData): Promise<Todo> => {
            const response = await api.post('/todos', {
                item: data.item
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            queryClient.invalidateQueries({ queryKey: ['infinite-todos'] });
        },
        onError: (error) => {
            console.error('Error creating todo:', error);
        }
    });
}

export function useUpdateTodo() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: UpdateTodoData): Promise<Todo> => {
            const response = await api.put(`/todos/${data.id}/mark`, {
                action: data.isDone
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            queryClient.invalidateQueries({ queryKey: ['infinite-todos'] });
        },
        onError: (error) => {
            console.error('Error updating todo:', error);
        }
    });
}

export function useDeleteTodos() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (todoIds: string[]): Promise<void> => {
            await Promise.all(
                todoIds.map(id => api.delete(`/todos/${id}`))
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            queryClient.invalidateQueries({ queryKey: ['infinite-todos'] });
        },
        onError: (error) => {
            console.error('Error deleting todos:', error);
        }
    });
}