import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { trpcClient } from "@/utils/trpc";
import { groupBy } from "lodash";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export const Route = createFileRoute("/$ln/category/$slug")({
  validateSearch: (search: Record<string, unknown>) => {
    return z
      .object({
        attributes: z.array(z.number()),
        options: z.array(z.number()),
      })
      .partial()
      .parse(search);
  },
  loaderDeps: ({ search }) => ({
    attributes: search.attributes || [],
    options: search.options || [],
  }),
  beforeLoad: async ({ params, context }) => {
    const category = await trpcClient.web.catalog.category.findCategory.query({
      languageId: context.locale.id,
      slug: params.slug,
    });
    if (!category) {
      throw notFound();
    }

    return {
      ...context,
      category,
    };
  },
  loader: async ({ deps, context }) => {
    const { filters, data } = await trpcClient.web.catalog.product.filter.query(
      {
        categoryId: context.category.id,
        languageId: context.locale.id,
        options: deps.options,
        attributes: deps.attributes,
      },
    );

    return {
      attributes: groupBy(filters.attributes, (a) => a.group_name),
      options: groupBy(filters.options, (a) => a.group_name),
      products: data,
      category: context.category,
      selected: {
        attributes: deps.attributes,
        options: deps.options,
      },
    };
  },
  component: Home,
});

type FiltersProps = {
  attributes: Record<
    string,
    Array<{
      attribute_id: number;
      attribute_name: string;
    }>
  >;
  options: Record<
    string,
    Array<{
      option_id: number;
      option_name: string;
    }>
  >;
  selected: {
    attributes: number[];
    options: number[];
  };
};

function Filters({ attributes, options, selected }: FiltersProps) {
  const navigate = useNavigate({ from: Route.fullPath });

  return (
    <div>
      {Object.entries(attributes).map(([key, attributes]) => {
        return (
          <div key={key}>
            <h2>{key}</h2>
            {attributes.map((a) => {
              const isSelected = selected.attributes.includes(a.attribute_id);

              return (
                <div
                  key={a.attribute_id}
                  style={{
                    paddingLeft: "1em",
                    backgroundColor: isSelected ? "red" : "",
                  }}
                  onClick={() => {
                    navigate({
                      search: (prev) => ({
                        ...prev,
                        attributes: isSelected
                          ? prev.attributes?.filter(
                              (id) => id !== a.attribute_id,
                            )
                          : [...(prev.attributes || []), a.attribute_id],
                      }),
                    });
                  }}
                >
                  {a.attribute_name}
                </div>
              );
            })}
          </div>
        );
      })}
      {Object.entries(options).map(([group, options]) => {
        return (
          <div key={group}>
            <h2>{group}</h2>
            {options.map((o) => {
              const isSelected = selected.options.includes(o.option_id);

              return (
                <div
                  key={o.option_id}
                  style={{
                    paddingLeft: "1em",
                    backgroundColor: isSelected ? "red" : "",
                  }}
                  onClick={() => {
                    navigate({
                      search: (prev) => ({
                        ...prev,
                        options: isSelected
                          ? prev.options?.filter((id) => id !== o.option_id)
                          : [...(prev.options || []), o.option_id],
                      }),
                    });
                  }}
                >
                  {o.option_name}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function Home() {
  const data = Route.useLoaderData();

  return (
    <div className="container mx-auto">
      <h1>{data.category.name}</h1>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <h2>Filters</h2>
            </CardHeader>
            <CardContent>
              <Filters
                options={data.options}
                attributes={data.attributes}
                selected={data.selected}
              />
            </CardContent>
          </Card>
        </div>

        <div className="w-full grow col-span-9">
          <div className="grid-cols-3 grid grid-flow-row gap-4">
            {data.products.map((p) => {
              return (
                <Card
                  key={p.id}
                  className="p-2 hover:shadow-x w-full transition-shadow"
                >
                  <div className="h-full">
                    <AspectRatio className="hover:scale-105">
                      <img
                        src={
                          "http://localhost:3000/file-upload?imageId=" +
                          p.images[0]
                        }
                        className="w-full block f-hull object-cover rounded-md z-auto"
                      />
                    </AspectRatio>
                    <div>
                      {p.slug} {p.id}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
