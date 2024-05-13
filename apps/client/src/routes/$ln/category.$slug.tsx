import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { trpcClient } from "@/utils/trpc";

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
  loader: async ({ deps, context, params }) => {
    const category = await trpcClient.web.catalog.category.findCategory.query({
      languageId: context.locale.id,
      slug: params.slug,
    });
    if (!category) {
      throw notFound();
    }

    const { filters, data } = await trpcClient.web.catalog.product.filter.query(
      {
        languageId: context.locale.id,
        options: deps.options,
        attributes: deps.attributes,
      },
    );

    return {
      attributes: filters.attributes,
      options: filters.options,
      products: data,
      category,
      selected: {
        attributes: deps.attributes,
        options: deps.options,
      },
    };
  },
  component: Home,
});

function Home() {
  const data = Route.useLoaderData();
  const navigate = useNavigate({ from: Route.fullPath });

  return (
    <>
      <h1>{data.category.name}</h1>
      {data.attributes.map((a) => {
        const isSelected = data.selected.attributes.includes(a.attribute_id);

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
                    ? prev.attributes?.filter((id) => id !== a.attribute_id)
                    : [...(prev.attributes || []), a.attribute_id],
                }),
              });
            }}
          >
            {a.attribute_name} - ({a.product_count})
          </div>
        );
      })}
      {data.options.map((o) => {
        const isSelected = data.selected.options.includes(o.option_id);

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
            {o.option_name} - ({o.product_count})
          </div>
        );
      })}
      {data.products.map((p) => {
        return (
          <div key={p.id}>
            {p.slug} {p.id}
          </div>
        );
      })}
    </>
  );
}
