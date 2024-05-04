import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DataTable } from "../components/data-table";
import { columns } from "../components/collumns";
import { trpc } from "../utils/trpc";
import { z } from "zod";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { ControllerRenderProps, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import React from "react";

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
    console.log(data);
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
    <Accordion type="single" collapsible>
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
                  onClick={() => form.reset(defaultValues)}
                >
                  Clear
                </Button>
              </div>
            </form>
          </Form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
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
