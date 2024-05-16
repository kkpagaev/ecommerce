import {
  Link,
  createFileRoute,
  notFound,
  useNavigate,
} from "@tanstack/react-router";
import { z } from "zod";
import { trpcClient } from "@/utils/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "../../lib/utils";
import { Filters } from "../../components/filters";
import { RoutePagination } from "../../components/route-pagination";
import { AddToCartButton } from "../../components/add-to-cart-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export const Route = createFileRoute("/$ln/category/$slug")({
  validateSearch: (search: Record<string, unknown>) => {
    return z
      .object({
        attributes: z.array(z.number()),
        options: z.array(z.number()),
        vendors: z.array(z.number()),
        page: z.number().optional(),
        orderDirection: z.enum(["asc", "desc"]).optional(),
        orderBy: z.enum(["price", "popularity"]).optional(),
      })
      .partial()
      .parse(search);
  },
  loaderDeps: ({ search }) => ({
    attributes: search.attributes || [],
    options: search.options || [],
    vendors: search.vendors || [],
    page: search.page || 1,
    orderDirection: search.orderDirection || "desc",
    orderBy: search.orderBy || "popularity",
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
    const { filters, data, vendors } =
      await trpcClient.web.catalog.product.filter.query({
        categoryId: context.category.id,
        asc: deps.orderDirection === "asc",
        sort: deps.orderBy,
        languageId: context.locale.id,
        options: deps.options,
        page: deps.page,
        attributes: deps.attributes,
        vendors: deps.vendors,
      });

    return {
      attributes: filters.attributes,
      options: filters.options,
      products: data,
      category: context.category,
      vendors: vendors,
      page: deps.page,
      selected: {
        attributes: deps.attributes,
        options: deps.options,
        vendors: deps.vendors,
      },
    };
  },
  component: Home,
});

function Home() {
  const data = Route.useLoaderData();
  const navigate = useNavigate({ from: Route.fullPath });

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">{data.category.name}</h1>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <Filters
                path={Route.fullPath}
                vendors={data.vendors}
                options={data.options}
                attributes={data.attributes}
                selected={data.selected}
              />
            </CardContent>
          </Card>
        </div>

        <div className="w-full grow col-span-9 grid gap-4">
          <div className="flex gap-2 w-full justify-end">
            <Select
              onValueChange={(v) =>
                navigate({
                  search: (prev) => ({
                    ...prev,
                    orderBy: v === "popularity" ? "popularity" : "price",
                    orderDirection: v === "priceAsc" ? "asc" : "desc",
                  }),
                })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priceAsc">Price Low</SelectItem>
                <SelectItem value="priceDesc">Price High</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid-cols-3 grid grid-flow-row">
            {data.products.data.map((p) => {
              return (
                <Card
                  key={p.id}
                  className="p-2 hover:shadow-md w-full transition-shadow"
                >
                  <div className="h-full flex flex-col gap-4 justify-between">
                    <div className="rounded-sm overflow-hidden">
                      <AspectRatio ratio={7 / 8}>
                        <Link
                          to="/$ln/product/$slug"
                          params={(current: any) => ({
                            ln: current.ln,
                            slug: p.slug,
                          })}
                        >
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
                        </Link>
                      </AspectRatio>
                    </div>
                    <div>
                      <Link
                        to="/$ln/product/$slug"
                        params={(current: any) => ({
                          ln: current.ln,
                          slug: p.slug,
                        })}
                      >
                        <h3 className="text-xl text-center">{p.name}</h3>
                      </Link>
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
                    <div>
                      {p.price < p.old_price ? (
                        <>
                          <div className="text-center text-md text-bold">
                            <div className="text-green-500">
                              ${p.price.toFixed(2)}
                            </div>
                            <div className="text-gray-500 line-through">
                              ${p.old_price.toFixed(2)}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-center text-md text-bold">
                            <div className="text-green-500">
                              ${p.price.toFixed(2)}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="text-center">
                      <AddToCartButton
                        stockStatus={p.stock_status}
                        product={{
                          id: p.id,
                          name: p.name,
                          image: p.images[0],
                        }}
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          <RoutePagination
            from={Route.fullPath}
            currentPage={data.page}
            totalPages={Math.ceil(+data.products.count / 20)}
          />
        </div>
      </div>
    </div>
  );
}
