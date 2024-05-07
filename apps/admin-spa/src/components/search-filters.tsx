import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { LanguageSelect } from "./language-select";
import { Button } from "./ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

type SearchFilterProps = {
  name: string;
  label?: string;
} & (
  | {
      type: "string";
    }
  | {
      type: "languageId";
    }
);

type Props = {
  search: Record<string, unknown>;
  filters: SearchFilterProps[];
  fullPath: string;
};

export function SearchFilters({ search, fullPath, filters }: Props) {
  const navigate = useNavigate({ from: fullPath });
  const form = useForm({
    values: { ...search },
  });

  const onSubmit = form.handleSubmit((data) => {
    navigate({
      search: (old: any) => {
        const res: any = {
          ...old,
          ...data,
        };
        return res;
      },
      replace: true,
    } as any);
  });

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Filters</AccordionTrigger>
        <AccordionContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="flex-row space-y-2">
              {filters.map((filter, i) => (
                <FormField
                  key={i}
                  control={form.control}
                  name={filter.name}
                  render={({ field }) => {
                    if (
                      filter.type === "languageId" &&
                      filter.name === "languageId"
                    ) {
                      return (
                        <FormItem>
                          <FormLabel>Language</FormLabel>
                          <FormControl>
                            <LanguageSelect
                              {...field}
                              name="languageId"
                              value={field.value as number}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }

                    return (
                      <FormItem>
                        <FormLabel>{filter.label || filter.name}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={
                              field.name.toUpperCase()[0] + field.name.slice(1)
                            }
                            {...field}
                            value={(field.value as string) || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              ))}

              <div>
                <Button type="submit">Search</Button>
                <Button
                  type="reset"
                  variant="outline"
                  onClick={() => navigate({ search: () => ({}) } as any)}
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
