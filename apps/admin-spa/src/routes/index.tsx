import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "../components/data-table";
import { columns } from "../components/collumns";
import { trpc } from "../utils/trpc";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    languageId: Number(search?.languageId ?? 1),
  }),
  component: Index,
});

function Index() {
  const search = Route.useSearch();
  const { data, isLoading } =
    trpc.admin.catalog.category.listCategories.useQuery({
      languageId: search.languageId || 1,
    });

  return (
    <div className="container mx-auto py-10">
      <DataTable data={data} columns={columns} isLoading={isLoading} />
    </div>
  );
}
