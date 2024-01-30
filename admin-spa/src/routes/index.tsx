import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "../components/data-table";
import { columns } from "../components/collumns";
import { api } from "../utils/trpc";
import { DataTablePagination } from "../components/pagination";

export const Route = createFileRoute("/")({
  validateSearch: (search: { page?: string; limit?: string }) => ({
    page: Number(search.page ?? 1),
    limit: Number(search.limit ?? 10),
  }),
  loaderDeps: ({ search: { page, limit } }) => ({ page, limit }),
  loader: ({ deps }) => {
    return api.admin.catalog.category.listCategories.query({
      page: deps.page,
      limit: deps.limit,
    });
  },
  component: Index,
});

function Index() {
  const { data, count } = Route.useLoaderData();
  const { page, limit } = Route.useSearch();

  return (
    <div className="container mx-auto py-10">
      <DataTable
        data={data}
        columns={columns}
        count={count}
        page={page}
        limit={limit}
      />
    </div>
  );
}
