import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "../components/data-table";
import { columns } from "../components/collumns";
import { trpc } from "../utils/trpc";

export const Route = createFileRoute("/")({
  validateSearch: (search: { languageId?: string }) => ({
    languageId: Number(search.languageId),
  }),
  component: Index,
});

function Index() {
  const { data, isLoading } =
    trpc.admin.catalog.category.listCategories.useQuery({
      languageId: 1,
    });

  return (
    <div className="container mx-auto py-10">
      <DataTable data={data} columns={columns} isLoading={isLoading} />
    </div>
  );
}
