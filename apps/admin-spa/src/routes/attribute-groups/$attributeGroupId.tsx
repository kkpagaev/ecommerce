import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
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

export const Route = createFileRoute("/attribute-groups/$attributeGroupId")({
  beforeLoad: ({ context }) => ({
    ...context,
    getTitle: () => "View attribute group",
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
    const attributeGroup =
      await context.trpc.admin.catalog.attributeGroup.findOneAttributeGroup.fetch(
        {
          id: Number(params.attributeGroupId),
        },
      );
    if (!attributeGroup) {
      throw new Error("Category not found");
    }

    const attributes =
      await context.trpc.admin.catalog.attribute.findAllGroupAttributes.fetch({
        groupId: attributeGroup.id,
        languageId: deps.languageId,
      });

    return { attributeGroup, attributes, languageId: deps.languageId };
  },
  component: CategoryComponent,
});

type Attribute =
  AdminOutputs["catalog"]["attribute"]["findAllGroupAttributes"][0];

function CategoryComponent() {
  const { attributeGroup, attributes, languageId } = Route.useLoaderData();
  const navigate = useNavigate({ from: Route.fullPath });
  const params = Route.useParams();

  return (
    <div className="container mx-auto py-10">
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
      <h2>
        {
          attributeGroup.descriptions.find((d) => d.language_id === languageId)
            ?.name
        }
      </h2>
      <div>
        <DataTable
          data={{ data: attributes, count: attributes.length }}
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
                      to={`/attribute-groups/$attributeGroupId/attribute/$attributeId/edit`}
                      params={{
                        attributeId: +row.getValue("id"),
                        attributeGroupId: +params.attributeGroupId,
                      }}
                      text="Edit"
                    >
                      foo
                    </TooltipLink>
                  );
                },
              },
            ] as ColumnDef<Attribute>[]
          }
          isLoading={false}
        />
        {attributes.map((a) => {
          return <div>{a.name}</div>;
        })}
      </div>

      <TooltipLink
        to={"/attribute-groups/$attributeGroupId/edit"}
        className="ml-auto"
        text="edit"
      >
        <Button variant="default">
          <Pencil1Icon />
        </Button>
      </TooltipLink>

      <OutletDialog
        path={Route.fullPath}
        getBack={() => navigate({ to: Route.fullPath, params: params })}
      />
    </div>
  );
}
