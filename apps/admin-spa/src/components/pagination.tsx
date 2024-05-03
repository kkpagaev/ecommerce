import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  page: number;
  count: number;
  limit: number;
};

export function DataTablePagination({ page, count, limit }: Props) {
  const perPage = Math.ceil(count / limit);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={page === 1}
            aria-disabled={page === 1}
            search={{ page: page - 1 }}
          />
        </PaginationItem>
        {[...Array(perPage)].map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              aria-current={page === i + 1}
              isActive={page === i + 1}
              search={(s: any) => ({
                ...s,
                page: i + 1,
              })}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            search={{ page: page + 1 }}
            aria-disabled={page === perPage}
            disabled={page === perPage}
            isActive={false}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
