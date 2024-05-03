import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "../components/data-table";
import { columns } from "../components/collumns";
import { trpc } from "../utils/trpc";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  validateSearch: (search: { page?: string; limit?: string }) => ({
    page: Number(search.page ?? 1),
    limit: Number(search.limit ?? 10),
  }),
  loaderDeps: ({ search: { page, limit } }) => ({ page, limit }),
  component: Index,
});

function Index() {
  const { page, limit } = Route.useLoaderDeps();
  const { data } = trpc.admin.catalog.category.listCategories.useQuery({
    languageId: 1,
    page: page,
    limit: limit,
  });
  console.log(125);

  return (
    <div className="container mx-auto py-10">
      <DataTable data={data} columns={columns} page={page} limit={limit} />
    </div>
  );
}
