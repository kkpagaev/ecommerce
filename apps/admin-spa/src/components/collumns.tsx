"use client";

import { Pencil1Icon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { AdminOutputs } from "@/utils/trpc";
import { AspectRatio } from "./ui/aspect-ratio";
import { TooltipLink } from "./ui/tooltip-link";

type Category =
  AdminOutputs["catalog"]["category"]["listCategories"]["data"][0];

export const columns: ColumnDef<Category>[] = [
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
    accessorKey: "id",
    enableSorting: true,
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "image_url",
    enableSorting: false,
    cell: ({ row }) => {
      const url = row.getValue("image_url");
      if (!url) {
        return null;
      }
      return (
        <AspectRatio
          ratio={4 / 4}
          className={"w-fullrounded-md border-slate-200 border-2"}
        >
          <img
            src={row.getValue("image_url")}
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
      return <div className="capitalize">{row.getValue("name")}</div>;
    },
  },
  // {
  //   accessorKey: "slug",
  //   header: "Slug",
  //   enableSorting: true,
  //   cell: ({ row }) => <div>{row.getValue("slug")}</div>,
  // },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <TooltipLink
          to="/categories/$categoryId/edit"
          params={{ categoryId: "" + row.getValue("id") }}
          text={"Edit"}
        >
          <Button variant="default">
            <Pencil1Icon />
          </Button>
        </TooltipLink>
      );
    },
  },
];
