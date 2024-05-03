import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { type Table as TableType } from "@tanstack/react-table";

type Props<TData> = {
  table: TableType<TData>;
};

export function DataTablePagination<T>({ table }: Props<T>) {
  const perPage = table.getPageCount();
  const page = table.getState().pagination.pageIndex + 1;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={page === 1}
            aria-disabled={page === 1}
            onClick={() => table.setPageIndex(0)}
          />
        </PaginationItem>
        {[...Array(perPage)].map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              aria-current={page === i + 1}
              isActive={page === i + 1}
              onClick={() => table.setPageIndex(i)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={() => table.nextPage()}
            aria-disabled={page === perPage}
            disabled={page === perPage}
            isActive={page === perPage}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
