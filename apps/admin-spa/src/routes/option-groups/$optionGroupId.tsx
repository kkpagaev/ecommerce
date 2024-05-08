import { createFileRoute } from "@tanstack/react-router";
import { SearchFilters } from "../../components/search-filters";
import { z } from "zod";
import { DataTable } from "../../components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { AdminOutputs } from "../../utils/trpc";
import { Checkbox } from "../../components/ui/checkbox";
import { TooltipLink } from "../../components/ui/tooltip-link";
import { Button } from "../../components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { OutletDialog } from "../../components/ui/dialog-outlet";
import { PlusIcon } from "lucide-react";

export const Route = createFileRoute("/option-groups/$optionGroupId")({
  beforeLoad: ({ context }) => ({
    ...context,
    getTitle: () => "View option group",
  }),
  validateSearch: (search: Record<string, unknown>) => {
    return z
      .object({
        languageId: z.number().optional(),
      })
      .parse(search);
  },
  loaderDeps: ({ search }) => ({
    languageId: search.languageId || 1,
  }),
  loader: async ({ context, params, deps }) => {
    const optionGroup =
      await context.trpc.admin.catalog.optionGroups.findOptionGroup.fetch({
        id: Number(params.optionGroupId),
      });
    if (!optionGroup) {
      throw new Error("Category not found");
    }

    const options = await context.trpc.admin.catalog.option.listOptions.fetch({
      groupId: optionGroup.id,
      languageId: deps.languageId,
    });

    return { optionGroup, options, languageId: deps.languageId };
  },
  component: CategoryComponent,
});

type Option = AdminOutputs["catalog"]["option"]["listOptions"][0];

function CategoryComponent() {
  const { optionGroup, options, languageId } = Route.useLoaderData();
  const params = Route.useParams();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between">
        <h2>
          {
            optionGroup.descriptions.find((d) => d.language_id === languageId)
              ?.name
          }
        </h2>

        <div className="flex flex-row justify-end gap-1">
          <TooltipLink
            to={"/option-groups/$attributeGroupId/attribute/new"}
            className="ml-auto"
            text="Add option"
          >
            <Button variant="default">
              <PlusIcon />
            </Button>
          </TooltipLink>
          <TooltipLink
            to={"/option-groups/$optionGroupId/edit"}
            params={{ optionGroupId: "" + params.optionGroupId }}
            className="ml-auto"
            text="edit"
          >
            <Button variant="default">
              <Pencil1Icon />
            </Button>
          </TooltipLink>
        </div>
      </div>
      <SearchFilters
        fullPath={Route.fullPath}
        title="Dispay Settings"
        search={Route.useSearch()}
        filters={[
          {
            name: "languageId",
            type: "languageId",
          },
        ]}
      />
      <div>
        <DataTable
          data={{ data: options, count: options.length }}
          columns={
            [
              {
                id: "select",
                header: ({ table }) => (
                  <Checkbox
                    checked={
                      table.getIsAllPageRowsSelected() ||
                      (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) =>
                      table.toggleAllPageRowsSelected(!!value)
                    }
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
                enableSorting: false,
                cell: ({ row }) => <div>{row.getValue("id")}</div>,
              },
              {
                accessorKey: "name",
                enableSorting: true,
                cell: ({ row }) => {
                  return <div>{row.getValue("name")}</div>;
                },
              },
              {
                id: "actions",
                enableHiding: false,
                cell: ({ row }) => {
                  return (
                    <TooltipLink
                      to={`/option-groups/$attributeGroupId/attribute/$attributeId/edit`}
                      params={{
                        optionId: +(row.getValue("id") as string),
                        optionGroupId: +params.optionGroupId,
                      }}
                      text="Edit"
                    >
                      <Button variant="default">
                        <Pencil1Icon />
                      </Button>
                    </TooltipLink>
                  );
                },
              },
            ] as ColumnDef<Option>[]
          }
          isLoading={false}
        />
      </div>
      <OutletDialog path={Route.fullPath} />
    </div>
  );
}
