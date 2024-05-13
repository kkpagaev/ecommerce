import { Link, createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/data-table";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { AdminOutputs } from "@/utils/trpc";
import { z } from "zod";
import { SearchFilters } from "@/components/search-filters";
import { AspectRatio } from "../../components/ui/aspect-ratio";

type Variant = Exclude<
  AdminOutputs["catalog"]["productVariant"]["listAll"][0],
  null
>;

const columns: ColumnDef<Variant>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "article",
    enableSorting: true,
    cell: ({ row }) => {
      return <div>{row.getValue("article")}</div>;
    },
  },
  {
    accessorKey: "images",
    enableSorting: false,
    cell: ({ row }) => {
      const ids = row.getValue<string[]>("images");
      if (!ids) {
        return null;
      }
      return (
        <AspectRatio className="w-10 h-10" ratio={1 / 1}>
          <img
            src={"http://localhost:3000/file-upload?imageId=" + ids[0]}
            className="w-full h-full object-cover rounded-md"
          />
        </AspectRatio>
      );
    },
  },
  {
    accessorKey: "name",
    enableSorting: true,
    cell: ({ row }) => {
      return <div>{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "created_at",
    enableSorting: true,
    header: () => <div>Created at</div>,
    cell: ({ row }) => {
      return <div>{new Date(row.getValue("created_at")).toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "category",
    enableSorting: true,
    cell: ({ row }) => {
      return <div className="capitalize">{row.getValue("category")}</div>;
    },
  },
  {
    accessorKey: "price",
    header: () => <div>Price</div>,
    enableSorting: true,
    cell: ({ row }) => {
      return <div>{row.getValue("price")}</div>;
    },
  },

  {
    accessorKey: "old_price",
    header: () => <div>Old price</div>,
    enableSorting: true,
    cell: ({ row }) => {
      return <div>{row.getValue("old_price")}</div>;
    },
  },
  {
    accessorKey: "is_active",
    enableSorting: true,
    header: () => <div>Active</div>,
    cell: ({ row }) => {
      return <div>{row.getValue("is_active") ? "Yes" : "No"}</div>;
    },
  },
  {
    accessorKey: "stock_status",
    header: () => <div>Stock status</div>,
    enableSorting: true,
    cell: ({ row }) => (
      <div>
        {
          {
            in_stock: "In stock",
            out_of_stock: "Out of stock",
            pre_order: "Pre order",
          }[row.getValue("stock_status") as string]
        }
      </div>
    ),
  },
  {
    accessorKey: "vendor",
    header: () => <div>Vendor</div>,
    enableSorting: true,
    cell: ({ row }) => {
      return <div>{row.getValue("vendor")}</div>;
    },
  },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex flex-col gap-2">
  //         <Link
  //           to={"/products/$productId/variants"}
  //           params={{
  //             productId: "" + row.getValue("id"),
  //           }}
  //         >
  //           <Button variant="default">Variants</Button>
  //         </Link>
  //       </div>
  //     );
  //   },
  // },
];

export const Route = createFileRoute("/exports/")({
  component: Index,
  beforeLoad: async ({ context }) => {
    return {
      ...context,
      getTitle: () => "Attribute Groups",
    };
  },
  validateSearch: (search: Record<string, unknown>) => {
    return z
      .object({
        languageId: z.number().optional(),
        name: z.string().optional(),
      })
      .parse(search);
  },
  loaderDeps: ({ search }) => ({
    languageId: search.languageId || 1,
    name: search.name,
  }),
  loader: async ({ context, deps }) => {
    const productVariants =
      await context.trpc.admin.catalog.productVariant.listAll.fetch({
        languageId: deps.languageId,
      });

    console.log(productVariants[0]);
    return { productVariants };
  },
});

function Index() {
  const { productVariants } = Route.useLoaderData();
  const search = Route.useSearch();

  return (
    <div>
      <div className="w-full flex flex-row gap-10">
        <SearchFilters
          search={search}
          fullPath={Route.fullPath}
          filters={[
            {
              name: "name",
              type: "string",
              label: "Name",
            },
            {
              name: "languageId",
              type: "languageId",
            },
          ]}
        />
        <div>
          <Link to={"/products/new"}>
            <Button variant="default">New</Button>
          </Link>
        </div>
        <div></div>
      </div>
      <DataTable
        data={
          productVariants
            ? { data: productVariants, count: productVariants.length }
            : undefined
        }
        columns={columns}
        isLoading={false}
      />
    </div>
  );
}
