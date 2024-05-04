import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DataTable } from "../components/data-table";
import { columns } from "../components/collumns";
import { trpc } from "../utils/trpc";
import { z } from "zod";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useForm } from "@tanstack/react-form";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => {
    return z
      .object({
        languageId: z.number().optional(),
        name: z.string().optional(),
      })
      .parse(search);
  },
  component: Index,
});

function Search() {
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const form = useForm({
    defaultValues: {
      name: search.name || "",
    },
    onSubmit: (data) => {
      navigate({
        search: (old) => {
          console.log({ data });
          return {
            ...old,
            ...data.value,
          };
        },
        replace: true,
      });
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex items-center space-x-2"
      >
        <form.Field
          name="name"
          children={(field) => (
            <>
              <Input
                placeholder="Name"
                onChange={(e) => field.handleChange(e.target.value)}
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
              />
            </>
          )}
        />
        <Button type="submit">Search</Button>
      </form>
    </div>
  );
}

function Index() {
  const search = Route.useSearch();
  const { data, isLoading } =
    trpc.admin.catalog.category.listCategories.useQuery({
      languageId: search.languageId || 1,
      name: search.name,
    });

  return (
    <div className="container mx-auto py-10">
      <Search />
      <DataTable data={data} columns={columns} isLoading={isLoading} />
    </div>
  );
}
