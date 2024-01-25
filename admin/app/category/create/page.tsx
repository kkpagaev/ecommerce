import { Table } from "lucide-react";
import { TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../../components/ui/table";
import { adminApi } from "../../../utils/trpc";

export default async function CreateCategory() {
  const cats = await adminApi.catalog.category.listCategories.query({});

  return (
    <div>
      {cats.map((c) => (
        <div key={c.id}>{c.name}</div>
      ))}
      Create Category
    </div>
  );
}
