import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { trpcClient } from "@/utils/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "../../lib/utils";
import { Filters } from "../../components/filters";

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
      getTitle: () => category.name,
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
    console.log(data);

    return {
      attributes: filters.attributes,
      options: filters.options,
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

function Home() {
  const data = Route.useLoaderData();
  console.log(data.products);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold">{data.category.name}</h1>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <Filters
                path={Route.fullPath}
                options={data.options}
                attributes={data.attributes}
                selected={data.selected}
              />
            </CardContent>
          </Card>
        </div>

        <div className="w-full grow col-span-9">
          <div className="grid-cols-3 grid grid-flow-row">
            {data.products.map((p) => {
              return (
                <Card
                  key={p.id}
                  className="p-2 hover:shadow-md w-full transition-shadow"
                >
                  <div className="h-full flex flex-col gap-4">
                    <div className="rounded-sm overflow-hidden">
                      <AspectRatio ratio={7 / 8}>
                        <img
                          src={
                            "http://localhost:3000/file-upload?imageId=" +
                            p.images[0]
                          }
                          className={cn(
                            "object-cover w-full h-full",
                            p.stock_status === "in_stock" ? "" : "grayscale",
                          )}
                        />
                      </AspectRatio>
                    </div>
                    <div>
                      <h3 className="text-xl text-center">{p.name}</h3>
                    </div>
                    {p.stock_status === "in_stock" ? (
                      <>
                        <div className="text-center text-md text-bold">
                          <div className="text-green-500">In stock</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center text-md text-bold">
                          <div className="text-red-500">Out of stock</div>
                        </div>
                      </>
                    )}
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
