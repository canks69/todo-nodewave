import { TableTodo } from "@/components/table-todo";
export default function DashboardPage() {
  return (
    <>
      <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold'>To do</h1>
        {/* <div className='flex gap-2'>
          <Link
            href='/create'
            className='h-9 px-4 bg-gray-200 hover:bg-gray-100 text-gray-800 font-semibold rounded-lg flex items-center justify-center'
          >
            Create Todo
          </Link>
        </div> */}
      </div>
      <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
        <TableTodo />
      </div>
    </>
  );
}