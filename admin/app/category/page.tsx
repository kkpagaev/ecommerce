import { DataTable } from "../../components/data-table/data-table";
import { adminApi } from "../../utils/trpc";
import { columns } from "./columns";

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
  console.log({ page, data });

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
