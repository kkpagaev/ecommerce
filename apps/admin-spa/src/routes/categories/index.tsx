import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/collumns";
import { trpc } from "@/utils/trpc";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ControllerRenderProps, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const LanguageSelect = ({
  ...props
}: ControllerRenderProps<
  {
    languageId: number;
    name: string;
  },
  "languageId"
>) => {
  const languages = trpc.admin.language.list.useQuery();

  return (
    <Select
      onValueChange={(v) => {
        props.onChange(+v);
      }}
      value={"" + props.value}
    >
      <SelectTrigger className="w-[80px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent {...props}>
        {languages.data?.map((lan) => (
          <SelectItem key={lan.id} value={"" + lan.id}>
            {lan.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
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
        <Link to={"/categories/new"}>
          <Button variant="default">New</Button>
        </Link>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/categories/")({
  beforeLoad: ({ context }) => ({ ...context, getTitle: () => "Categories" }),
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
    return await context.trpc.admin.catalog.category.listCategories.fetch({
      name: deps.name,
      languageId: deps.languageId,
    });
  },
  component: Index,
});

function Index() {
  const data = Route.useLoaderData();

  return (
    <div className="container mx-auto py-10">
      <Search />
      <DataTable data={data} columns={columns} isLoading={false} />
    </div>
  );
}
