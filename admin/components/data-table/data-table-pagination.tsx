"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";

type Props = {
  page: number;
  count: number;
  limit: number;
};

export function DataTablePagination({ page, count, limit }: Props) {
  const perPage = Math.ceil(count / limit);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function createPageURL(pageNumber: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageURL(page - 1)}
            aria-disabled={page === 1}
          />
        </PaginationItem>
        {[...Array(perPage)].map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              href={createPageURL(i + 1)}
              aria-current={page === i + 1}
              isActive={page === i + 1}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href={createPageURL(page + 1)}
            aria-disabled={page === perPage}
            isActive={false}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
