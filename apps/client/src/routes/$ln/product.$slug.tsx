import { Link, createFileRoute, notFound } from "@tanstack/react-router";
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
import { groupBy } from "lodash";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import { ProductImage } from "../../components/product-image";

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

type OptionPickerProps = {
  productId: number;
  current: Array<{
    optionId: number;
    groupId: number;
  }>;
  options: Array<{
    optionGroupId: number;
    optionGroupName: string;
    optionId: number;
    optionName: string;
    productVariantId: number;
    slug: string;
    // stockStatus: "in_stock" | "out_of_stock" | "preorder";
  }>;
};
function OptionPickerForm({ productId, current, options }: OptionPickerProps) {
  const groups = groupBy(options, "optionGroupName");
  const [selected, setSelected] = useState(current.map((c) => ({ ...c })));

  // useEffect(() => {}, [selected]);
  const onClick = (optionId: number, groupId: number) => {
    setSelected((prev) => {
      if (prev.some((s) => s.groupId === groupId)) {
        return prev
          .filter((s) => s.groupId !== groupId)
          .concat({ optionId, groupId });
      } else {
        return prev.concat({ optionId, groupId });
      }
    });
  };

  return (
    <div className="w-full">
      {
        //product options
        Object.entries(groups).map(([name, related]) => {
          const options = groupBy(related, "optionId");
          // const otherGroups = Object.keys(groups).filter((n) => n !== name);

          return (
            <div className="flex gap-2 justify-between">
              <div>{name}</div>
              <div className="flex gap-2">
                {
                  // option values
                  Object.keys(options).map((name) => {
                    const optionValue = options[name][0];
                    const isSelected = selected.some(
                      (s) => s.optionId === optionValue.optionId,
                    );

                    return (
                      <div>
                        <Button
                          key={name}
                          variant={isSelected ? "default" : "outline"}
                          onClick={() =>
                            onClick(
                              optionValue.optionId,
                              optionValue.optionGroupId,
                            )
                          }
                        >
                          {optionValue.optionName}
                        </Button>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          );
        })
      }
    </div>
  );
}
function OptionPicker({ productId, current, options }: OptionPickerProps) {
  const groups = groupBy(options, "optionGroupName");

  if (Object.keys(groups).length === 1) {
    const related = groups[Object.keys(groups)[0]];

    return (
      <div className="flex gap-2">
        {related.map((o) => {
          return (
            <Button
              asChild
              key={o.optionId}
              variant={productId === o.productVariantId ? "default" : "outline"}
            >
              <Link
                to={`/$ln/product/$slug`}
                params={(prev: any) => ({
                  ...prev,
                  slug: o.slug,
                })}
                key={o.optionId}
              >
                {o.optionName}
              </Link>
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <OptionPickerForm
      productId={productId}
      current={current}
      options={options}
    />
  );
}

function ProductComponent() {
  const { product } = Route.useLoaderData();
  console.log(product);

  return (
    <div className="container p-2">
      <div className="md:grid grid-cols-12 gap-16">
        <div className="md:col-span-6">
          <Carousel className="p-6 border-gray-100 border-2 rounded-md">
            <CarouselContent>
              {product.images.length > 0 ? (
                product.images.map((image: string, i) => {
                  return (
                    <CarouselItem key={i}>
                      <ProductImage id={image} />
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
        <div className="md:col-span-6">
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
                withCountPicker
                stockStatus={product.stock_status}
                product={{
                  id: product.id,
                  name: product.name,
                  image: product.images[0],
                  price: product.price,
                }}
              />
            </div>
          </div>
          <div className="text-2xl font-bold mb-8">
            <div className="flex gap-2">
              <OptionPicker
                current={product.options.map((o) => ({
                  optionId: o.option_id,
                  groupId: o.option_group_id,
                }))}
                options={product.related.map((o) => ({
                  optionGroupName: o.option_group_name,
                  optionId: o.option_id,
                  optionGroupId: o.option_group_id,
                  optionName: o.option_name,
                  productVariantId: o.product_variant_id,
                  slug: o.slug,
                  groupId: o.option_group_id,
                }))}
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
          <div className="">
            <h4 className="font-bold">Vendor</h4>
            <p>{product.vendor}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
