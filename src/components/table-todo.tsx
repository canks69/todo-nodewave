"use client";

import { useTodos } from "@/service/todo-service";
import { ColumnProps, DataTable } from "./table/data-table";
import { PaginationState, FilterHandler } from "@/types/table";
import { Badge } from "./ui/badge";
import { useState } from "react";

interface TodoUser {
    fullName: string;
}

interface TodoItem extends Record<string, unknown> {
    id: string | number;
    user?: TodoUser;
    item: string;
    isDone: boolean;
}

export function TableTodo(){
    const [params, setParams] = useState({
        page: 1,
        limit: 10,
        searchFilters: {},
        sortBy: [],
        filters: {}
    });

    const { data, isLoading } = useTodos(params);

    // Helper function to create search filters for multiple fields
    const createSearchFilters = (searchValue: string) => {
        if (!searchValue.trim()) return {};
        
        const trimmedValue = searchValue.trim();
        return {
            item: trimmedValue,
            "user.fullName": trimmedValue
        };
    };

    const handlePaginationChange = (pagination: PaginationState) => {
        setParams(prev => ({
            ...prev,
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
        }));
    };

    const handleSearchChange = (search: string) => {
        setParams(prev => ({
            ...prev,
            searchFilters: createSearchFilters(search),
            page: 1 
        }));
    };

    const handleFiltersChange: FilterHandler = (filters) => {
        setParams(prev => ({
            ...prev,
            filters: filters,
            page: 1 // Reset to first page when filtering
        }));
    };

    const filterOptions = [
        {
            key: 'isDone',
            title: 'Status',
            options: [
                { label: 'Pending', value: false },
                { label: 'Success', value: true }
            ]
        }
    ];

    const columns: ColumnProps[] = [
        { 
            key: 'user', 
            label: 'Name', 
            render: (_, item) => {
                const todoItem = item as unknown as TodoItem;
                return todoItem.user?.fullName || 'Unknown';
            }
        },
        { key: 'item', label: 'To do' },
        { 
            key: 'isDone', 
            label: 'Status', 
            render: (value) => {
                return (
                    <Badge 
                        variant={'secondary'} 
                        className={`${value ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white`}
                    >
                        {value ? 'Success' : 'Pending'}
                    </Badge>
                );
            } 
        }
    ];

    return (
        <DataTable<TodoItem>
            columns={columns}
            data={data?.content?.entries || []}
            meta={{
                totalData: data?.content?.totalData || 0,
                totalPage: data?.content?.totalPage || 1
            }}
            isLoading={isLoading}
            onPaginationChange={handlePaginationChange}
            onSearchChange={handleSearchChange}
            onFiltersChange={handleFiltersChange}
            searchPlaceholder="Search todos..."
            filterOptions={filterOptions}
        />
    );
}