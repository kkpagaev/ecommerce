import { createFileRoute, notFound } from "@tanstack/react-router";
import { trpcClient } from "../../utils/trpc";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { AspectRatio } from "../../components/ui/aspect-ratio";
import { BadgeCheck, BadgeX, CircleOff } from "lucide-react";
import { AddToCartButton } from "../../components/add-to-cart-button";

export const Route = createFileRoute("/$ln/product/$slug")({
  component: ProductComponent,
  beforeLoad: async ({ params, context }) => {
    const product = await trpcClient.web.catalog.product.findProduct.query({
      languageId: context.locale.id,
      slug: params.slug,
    });

    if (!product) {
      throw notFound();
    }
    return { product };
  },
  loader: async ({ context }) => {
    const product = context.product;

    return { product };
  },
});

function ProductComponent() {
  const { product } = Route.useLoaderData();
  console.log(product);

  return (
    <div className="container p-2">
      <div className="grid grid-cols-12 gap-16">
        <div className="col-span-6">
          <Carousel className="p-6 border-gray-100 border-2 rounded-md">
            <CarouselContent>
              {product.images.length > 0 ? (
                product.images.map((image: string) => {
                  return (
                    <CarouselItem>
                      <AspectRatio
                        ratio={1 / 1}
                        className="rounded-md overflow-hidden"
                      >
                        <img
                          src={
                            "http://localhost:3000/file-upload?imageId=" + image
                          }
                          className={"object-cover w-full h-full"}
                        />
                      </AspectRatio>
                    </CarouselItem>
                  );
                })
              ) : (
                <CarouselItem className="">
                  <div className="w-full h-full flex p-32">
                    <AspectRatio
                      ratio={1 / 1}
                      className="rounded-md overflow-hidden"
                    >
                      <CircleOff className="w-full h-full text-gray-300" />
                    </AspectRatio>
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div className="col-span-6">
          <h1 className="text-4xl font-bold mb-8">{product.name}</h1>
          <div className="text-2xl font-bold mb-8">
            <div className="flex gap-2">
              {product.stock_status === "in_stock" && (
                <>
                  <BadgeCheck className="w-8 h-8 text-green-500" />
                  <span className="text-green-600">In Stock</span>
                </>
              )}
              {product.stock_status === "out_of_stock" && (
                <>
                  <BadgeX className="w-8 h-8 text-red-600" />
                  <span className="text-red-600">Out of Stock</span>
                </>
              )}

              {product.stock_status === "preorder" && (
                <>
                  <BadgeX className="w-8 h-8 text-gray-400" />
                  <span className="text-gray-400">Preorder</span>
                </>
              )}
            </div>
          </div>
          <div className="text-2xl font-bold mb-8">
            <div className="flex gap-2">
              <span className="text-gray-600">₴{product.price}</span>
              {product.old_price !== product.price && (
                <span className="text-red-300 line-through">
                  ₴{product.old_price}
                </span>
              )}
            </div>
          </div>
          <div className="text-2xl font-bold mb-8">
            <div className="flex gap-2">
              <AddToCartButton
                stockStatus={product.stock_status}
                productId={product.id}
              />
            </div>
          </div>
          <div className="text-xl mb-8">
            <p>{product.description}</p>
          </div>
          <div className="">
            <h4>
              <div>Options: </div>
            </h4>
          </div>
          <div className="">
            {product.options.map((o) => {
              return (
                <div key={o.option_id}>
                  <h4 className="font-bold">{o.option_group_name}: </h4>
                  <p>{o.name}</p>
                </div>
              );
            })}
          </div>
          <div className="">
            {product.attributes.map((a) => {
              return (
                <div key={a.id}>
                  <h4 className="font-bold">{a.group}: </h4>
                  <p>{a.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
