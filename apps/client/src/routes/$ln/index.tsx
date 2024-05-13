import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { trpcClient } from "../../utils/trpc";

export const Route = createFileRoute("/$ln/")({
  component: Home,
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
  loader: async ({ deps, context }) => {
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
      selected: {
        attributes: deps.attributes,
        options: deps.options,
      },
    };
  },
});

function Home() {
  const data = Route.useLoaderData();
  const navigate = useNavigate({ from: Route.fullPath });

  return (
    <>
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
