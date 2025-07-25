"use client";
import { CheckCircle, CircleX } from "lucide-react";
import { useState, useEffect } from "react";
import { useCreateTodo, useUpdateTodo, useDeleteTodos, useInfiniteTodos, type Todo } from "@/service/todo-service";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CreateTodoPage() {
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedTodos, setSelectedTodos] = useState<string[]>([]);
  const createTodoMutation = useCreateTodo();
  const updateTodoMutation = useUpdateTodo();
  const deleteTodosMutation = useDeleteTodos();
  
  const [searchParams, setSearchParams] = useState({
    limit: 10,
    searchFilters: {},
    sortBy: [],
    filters: {}
  });

  const { 
    data: todosData, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteTodos(searchParams);

  const createSearchFilters = (searchValue: string) => {
    if (!searchValue.trim()) return {};
    
    const trimmedValue = searchValue.trim();
    return {
      item: trimmedValue,
    };
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSearchParams(prev => ({
        ...prev,
        searchFilters: createSearchFilters(taskTitle)
      }));
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [taskTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskTitle.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    try {
      await createTodoMutation.mutateAsync({
        item: taskTitle.trim()
      });
      
      setTaskTitle("");
      toast.success('Todo created successfully!');
    } catch (error) {
      console.error("Failed to create todo:", error);
      toast.error('Failed to create todo. Please try again.');
    }
  };

  const todos: Todo[] = todosData?.pages?.flatMap(page => page.content?.entries || []) || [];
  const totalCount = todosData?.pages?.[0]?.content?.totalData || 0;
  const currentPage = todosData?.pages?.length || 0;
  const totalPages = todosData?.pages?.[0]?.content?.totalPage || 1;

  // Scroll handler for infinite scroll
  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      if (hasNextPage && !isFetchingNextPage && currentPage < totalPages) {
        fetchNextPage();
      }
    }
  };

  const handleCheckboxToggle = async (todo: Todo) => {
    try {
      const newStatus: 'DONE' | 'TODO' = todo.isDone ? 'TODO' : 'DONE';
      
      await updateTodoMutation.mutateAsync({
        id: todo.id,
        isDone: newStatus
      });
      
      toast.success(`Todo marked as ${newStatus === 'DONE' ? 'completed' : 'pending'}!`);
    } catch (error) {
      console.error("Failed to update todo status:", error);
      toast.error('Failed to update todo status. Please try again.');
    }
  };

  const handleTodoSelection = (todoId: string, isSelected: boolean) => {
    setSelectedTodos(prev => {
      if (isSelected) {
        return [...prev, todoId];
      } else {
        return prev.filter(id => id !== todoId);
      }
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedTodos.length === 0) {
      toast.error('Please select todos to delete');
      return;
    }

    try {
      await deleteTodosMutation.mutateAsync(selectedTodos);
      toast.success(`${selectedTodos.length} todo(s) deleted successfully!`);
    } catch (error) {
      console.error("Failed to delete todos:", error);
      toast.error('Failed to delete selected todos. Please try again.');
    }
  };

  const handleSelectAll = () => {
    if (selectedTodos.length === todos.length) {
      setSelectedTodos([]); 
    } else {
      setSelectedTodos(todos.map(todo => todo.id));
    }
  };

  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return text;
    
    const parts = text.split(new RegExp(`(${search.trim()})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === search.trim().toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };
  
  return (
    <div className="w-full h-[85vh] max-h-[85vh] flex flex-col items-center justify-start">
      <h1 className="text-2xl font-bold mb-4">To do</h1>
      <div className="bg-white rounded-xl border border-gray-300 shadow-[20px_20px_40px_rgba(0,0,0,0.1)] max-w-3xl w-full p-8">
        <form className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8" onSubmit={handleSubmit}>
          <label className="block text-gray-600 font-semibold text-sm mb-1 sm:mb-0 sm:mr-4 select-none" htmlFor="new-task">
            Add a new task
          </label>
          <input 
            className="flex-grow border-b border-[#0f4a8a] bg-[#f9fafb] font-extrabold text-lg px-2 py-1 focus:outline-none" 
            id="new-task" 
            type="text"
            value={taskTitle}
            onChange={(e) => {
              setTaskTitle(e.target.value);
            }}
            placeholder="Enter task title or search existing tasks"
            disabled={createTodoMutation.isPending}
            />
          <button 
            className="bg-[#0066ff] text-white font-bold px-6 py-2 rounded-md hover:bg-[#0051cc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            type="submit"
            disabled={createTodoMutation.isPending || !taskTitle.trim()}
          >
            {createTodoMutation.isPending ? "Adding..." : "Add Todo"}
          </button>
        </form>

        {todos.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="outline"
              onClick={handleSelectAll}
              disabled={deleteTodosMutation.isPending}
              className="text-sm"
            >
              {selectedTodos.length === todos.length ? 'Deselect All' : 'Select All'}
            </Button>
            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-500">
                {selectedTodos.length} of {todos.length} selected
              </span>
              <span className="text-xs text-gray-400">
                Page {currentPage} of {totalPages} ({totalCount} total)
              </span>
            </div>
          </div>
        )}

        <ul 
          className="divide-y divide-gray-300 max-h-96 overflow-y-auto px-5"
          onScroll={handleScroll}
        >
          {isLoading ? (
            <li className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading todos...</div>
            </li>
          ) : error ? (
            <li className="flex items-center justify-center py-8">
              <div className="text-red-500">Error loading todos</div>
            </li>
          ) : todos.length === 0 ? (
            <li className="flex items-center justify-center py-8">
              <div className="text-gray-500">
                {taskTitle.trim() ? "No todos found matching your search" : "No todos available"}
              </div>
            </li>
          ) : (
            todos.map((todo) => (
              <li key={todo.id} className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-4">
                  <Checkbox
                    checked={selectedTodos.includes(todo.id)}
                    onCheckedChange={(checked) => handleTodoSelection(todo.id, checked as boolean)}
                    disabled={deleteTodosMutation.isPending}
                    className={cn(
                      "w-7 h-7 rounded-sm cursor-pointer transition-colors ",
                      "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 data-[state=checked]:text-white border-2 border-gray-300 hover:border-green-400"
                    )}
                  />
                  <span className={`text-lg select-text`}>
                    {highlightText(todo.item, taskTitle .trim())}
                  </span>
                </div>
                {todo.isDone ? (
                  <CheckCircle className="text-green-600 w-7 h-7" />
                ) : (
                  <CircleX
                    onClick={() => !updateTodoMutation.isPending && handleCheckboxToggle(todo)}
                    className="cursor-pointer hover:text-red-700 transition-colors text-red-600 w-7 h-7"
                    aria-label="Mark as done"/>
                )}
              </li>
            ))
          )}
          
          {isFetchingNextPage && (
            <li className="flex items-center justify-center py-4">
              <div className="text-gray-500">Loading more todos...</div>
            </li>
          )}
          
          {!hasNextPage && todos.length > 0 && currentPage >= totalPages && (
            <li className="flex items-center justify-center py-4">
              <div className="text-gray-400 text-sm">
                You&apos;ve reached the end of the list ({totalCount} total todos)
              </div>
            </li>
          )}
        </ul>
        
        {todos.length > 0 && (
          <div className="flex justify-between items-center mt-8">
            <Button 
              onClick={handleDeleteSelected}
              disabled={selectedTodos.length === 0 || deleteTodosMutation.isPending}
              className="bg-red-500 text-white font-semibold px-5 py-2 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleteTodosMutation.isPending 
                ? "Deleting..." 
                : `Delete Selected ${selectedTodos.length > 0 ? `(${selectedTodos.length})` : ''}`
              }
            </Button>
            
            {selectedTodos.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setSelectedTodos([])}
                disabled={deleteTodosMutation.isPending}
                className="text-gray-600"
              >
                Clear Selection
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}