import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { DataTable } from "../../components/data-table";

import { Pencil1Icon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { AdminOutputs } from "@/utils/trpc";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { z } from "zod";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useForm } from "react-hook-form";
import { LanguageSelect } from "../../components/language-select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";

type Language = AdminOutputs["language"]["list"][0];

const columns: ColumnDef<Language>[] = [
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
    accessorKey: "name",
    enableSorting: true,
    cell: ({ row }) => {
      return <div className="capitalize">{row.getValue("name")}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/attribute-groups/$attributeGroupId/edit"
                params={{ attributeGroupId: "" + row.getValue("id") }}
              >
                <Button variant="default">
                  <Pencil1Icon />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];

export const Route = createFileRoute("/attribute-groups/")({
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
    return await context.trpc.admin.catalog.attributeGroup.listAttributeGroups.fetch(
      {
        languageId: deps.languageId,
        name: deps.name,
      },
    );
  },
});

function Index() {
  const data = Route.useLoaderData();

  return (
    <div className="container mx-auto py-10">
      <Search />
      <DataTable
        data={data ? { data: data, count: data.length } : undefined}
        columns={columns}
        isLoading={false}
      />
    </div>
  );
}

function Search() {
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const defaultValues = {
    name: "",
    languageId: 1,
  };
  const form = useForm({
    defaultValues: defaultValues,
    values: { ...defaultValues, ...search },
  });

  const onSubmit = form.handleSubmit((data) => {
    navigate({
      search: (old) => {
        return {
          ...old,
          ...data,
        };
      },
      replace: true,
    });
  });

  return (
    <div className="w-full flex flex-row gap-10">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Filters</AccordionTrigger>
          <AccordionContent>
            <Form {...form}>
              <form onSubmit={onSubmit} className="flex-row space-y-2">
                <div>
                  <FormField
                    control={form.control}
                    name="languageId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <FormControl>
                          <LanguageSelect {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={
                              field.name.toUpperCase()[0] + field.name.slice(1)
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <Button type="submit">Search</Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate({ search: {}, replace: true })}
                  >
                    Clear
                  </Button>
                </div>
              </form>
            </Form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div>
        <Link to={"/attribute-groups/new"}>
          <Button variant="default">New</Button>
        </Link>
      </div>
    </div>
  );
}
