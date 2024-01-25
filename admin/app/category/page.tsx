import { DataTable } from "../../components/data-table/data-table";
import { adminApi } from "../../utils/trpc";
import { columns } from "./columns";
import { CategoryCreateForm } from "./category-create-form";

export default async function DemoPage({
  searchParams,
}: {
  searchParams: {
    limit?: string;
    page?: string;
  };
}) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const { data, count } = await adminApi.catalog.category.listCategories.query({
    page: page,
    limit: limit,
  });

  return (
    <div className="container mx-auto py-10">
      <CategoryCreateForm />
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
