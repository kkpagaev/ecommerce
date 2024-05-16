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
      {Object.entries(data.attributes).map(([a, attributes]) => {
        return attributes.map((attribute) => {
          const isSelected = data.selected.attributes.includes(attribute.id);

          return (
            <div
              key={attribute.id}
              style={{
                paddingLeft: "1em",
                backgroundColor: isSelected ? "red" : "",
              }}
              onClick={() => {
                navigate({
                  search: (prev) => ({
                    ...prev,
                    attributes: isSelected
                      ? prev.attributes?.filter((id) => id !== attribute.id)
                      : [...(prev.attributes || []), attribute.id],
                  }),
                });
              }}
            >
              {attribute.name}
            </div>
          );
        });
      })}
      {Object.entries(data.options).map(([og, options], i) => {
        return (
          <div key={i}>
            {options.map((o) => {
              const isSelected = data.selected.options.includes(o.id);

              return (
                <div
                  key={i}
                  style={{
                    paddingLeft: "1em",
                    backgroundColor: isSelected ? "red" : "",
                  }}
                  onClick={() => {
                    navigate({
                      search: (prev) => ({
                        ...prev,
                        options: isSelected
                          ? prev.options?.filter((id) => id !== o.id)
                          : [...(prev.options || []), o.id],
                      }),
                    });
                  }}
                >
                  {o.name}
                </div>
              );
            })}
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
