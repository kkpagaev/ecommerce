import { useCallback, useEffect, useMemo, useState } from "react";
import { CaretSortIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// const columns = React.useMemo<ColumnDef<Attribute>[]>(
//   () => [
//     {
//       id: "drag-handle",
//       header: "Move",
//       cell: ({ row }) => <RowDragHandleCell rowId={+row.id} />,
//       size: 60,
//     },
//     {
//       accessorKey: "id",
//       cell: (info) => info.getValue(),
//     },
//     {
//       accessorFn: (row) => row.name,
//       id: "name",
//       cell: (info) => info.getValue(),
//       header: () => <span>Name</span>,
//     },
//   ],
//   [],
// );

type Props<T> = {
  data: { data: Array<T>; count: number } | undefined;
  columns: ColumnDef<T>[];
  isLoading: boolean;
  visibilityState?: VisibilityState;
  onSelectSubmit?: (selected: T[]) => void;
};
export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading,
  visibilityState = {},
  onSelectSubmit,
}: Props<T>) {
  const [count, setCount] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(visibilityState);
  const [rowSelection, setRowSelection] = useState({});
  const dataMemo = useMemo(() => data?.data ?? [], [data]);

  useEffect(() => {
    if (data) setCount(data.count);
  }, [data]);

  useEffect(() => {
    setRowSelection({});
  }, [data]);

  const pageCount = Math.ceil(count / 10);

  const table = useReactTable({
    data: dataMemo,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    pageCount: pageCount,
  });

  function DataTableBody() {
    if (isLoading) {
      return Array.from({ length: 10 }).map((_, i) =>
        table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={i}>
            {headerGroup.headers.map((header) => {
              return (
                <TableCell key={header.id} className="animate-pulse">
                  <span className="bg-gray-200 rounded-md">
                    <span className="opacity-0">
                      {Math.random().toString(36).slice(4)}
                    </span>
                  </span>
                </TableCell>
              );
            })}
          </TableRow>
        )),
      );
      // return table.getRowModel().rows.map((row) => (
    }
    if (table.getRowModel().rows?.length) {
      return table.getRowModel().rows.map((row) => (
        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ));
    }

    return (
      <TableRow>
        <TableCell colSpan={columns.length} className="text-center">
          No results.
        </TableCell>
      </TableRow>
    );
  }

  return (
    <div className="">
      <div className="flex items-center py-4">
        <Select
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={"" + pageSize}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div>
          {onSelectSubmit && (
            <Button
              variant="default"
              className="ml-auto"
              onClick={() => {
                onSelectSubmit(
                  Object.keys(rowSelection)
                    .map(Number)
                    .map((i) => dataMemo[i]),
                );
              }}
            >
              Select
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const inner = header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      );

                  const column = header.column;
                  if (!column.columnDef.enableSorting) {
                    return <TableHead key={header.id}>{inner}</TableHead>;
                  }

                  return (
                    <TableHead key={header.id}>
                      <Button
                        variant="ghost"
                        onClick={() =>
                          column.toggleSorting(column.getIsSorted() === "asc")
                        }
                      >
                        {inner}
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <DataTableBody />
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center mt-10 justify-end space-x-2">
        {pageCount > 0 && <DataTablePagination table={table} />}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        </div>
      </div>
    </div>
  );
}
