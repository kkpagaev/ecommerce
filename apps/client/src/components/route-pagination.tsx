import { useNavigate } from "@tanstack/react-router";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "./ui/pagination";

export function RoutePagination({
  currentPage,
  totalPages,
  from,
}: {
  from: string;
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages < 2) {
    return null;
  }
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={currentPage === 1}
            aria-disabled={currentPage === 1}
            to={from}
            search={(prev: { page?: number }) => ({
              ...prev,
              page: prev.page ? prev.page - 1 : 1,
            })}
          />
        </PaginationItem>
        {[...Array(totalPages)].map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              aria-current={currentPage === i + 1}
              isActive={currentPage === i + 1}
              to={from}
              search={(prev: { page?: number }) => ({
                ...prev,
                page: i + 1,
              })}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            to={from}
            search={(prev: { page?: number }) => ({
              ...prev,
              page: prev.page ? prev.page + 1 : 1,
            })}
            aria-disabled={currentPage === totalPages}
            disabled={currentPage === totalPages}
            isActive={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
