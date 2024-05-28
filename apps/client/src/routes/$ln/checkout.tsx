import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ErrorMessage } from "@hookform/error-message";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useCartStore from "@/storages/cart";
import { ProductImage } from "../../components/product-image";
import { getAreas } from "../../api/np";
import { NpSelect } from "../../components/np-select";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { trpc } from "../../utils/trpc";
import { useApiForm } from "../../hooks/useApiForm";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/$ln/checkout")({
  loader: async () => {
    const areas = await getAreas();

    return { areas };
  },
  component: Checkout,
});

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  surname: z.string().min(1, { message: "Surname is required" }),
  phone: z.string().min(1, { message: "Phone is required" }),
  email: z.string().min(1, { message: "Email is required" }).email(),
  warehouse: z.object(
    {
      ref: z.string(),
      description: z.string(),
    },
    {
      message: "Please select warehouse",
    },
  ),
  city: z.object(
    {
      ref: z.string(),
      description: z.string(),
    },
    {
      message: "Please select city",
    },
  ),
  area: z.object(
    {
      ref: z.string(),
      description: z.string(),
    },
    {
      message: "Please select area",
    },
  ),
  description: z.string(),
});

type CheckoutDetails = z.infer<typeof schema>;

function Checkout() {
  type Model = {
    ref: string;
    description: string;
  };
  const navigate = useNavigate({ from: Route.fullPath });
  const mutation = trpc.web.order.create.useMutation({
    onSuccess: () => {
      toast.success("Order created");
      cartStore.clearCart();
      navigate({
        to: "/$ln/thankyou",
      });
    },
  });
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useApiForm<{
    warehouse: Model | undefined;
    city: Model | undefined;
    area: Model | undefined;
    name: string;
    surname: string;
    email: string;
    phone: string;
    description: string;
  }>({
    errorMessage: mutation.error?.message,
    defaultValues: {
      warehouse: undefined,
      city: undefined,
      area: undefined,
      name: "",
      surname: "",
      phone: "",
      email: "",
      description: "",
    },
    resolver: zodResolver(schema),
  });
  console.log(errors);
  const cartStore = useCartStore();
  const { areas } = Route.useLoaderData();

  return (
    <div>
      <form
        onSubmit={handleSubmit((data) => {
          mutation.mutate({
            details: data as CheckoutDetails,
            productVariants: cartStore.items.map((i) => {
              return {
                id: i.id,
                quantity: i.quantity,
              };
            }),
          });
        })}
        className="grid md:grid-cols-2 gap-16"
      >
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex gap-8 w-full">
              <div className="w-full">
                <Label htmlFor="name">Name*</Label>
                <Input required {...register("name")} />
                <ErrorMessage errors={errors} name={"name"} />
              </div>
              <div className="w-full">
                <Label htmlFor="surname">Surname*</Label>
                <Input required {...register("surname")} />
                <ErrorMessage errors={errors} name={"surname"} />
              </div>
            </div>
            <div className="w-full">
              <Label htmlFor="phone">Phone*</Label>
              <Input required {...register("phone")} />
              <ErrorMessage errors={errors} name={"phone"} />
            </div>
            <div className="w-full">
              <Label htmlFor="email">Email*</Label>
              <Input required {...register("email")} />
              <ErrorMessage errors={errors} name={"email"} />
            </div>
            <NpSelect
              areas={areas}
              onCityChange={(city) => {
                setValue(
                  "city",
                  city && {
                    ref: city.Ref,
                    description: city.Description,
                  },
                );
              }}
              onWarehouseChange={(warehouse) => {
                setValue(
                  "warehouse",
                  warehouse && {
                    ref: warehouse.Ref,
                    description: warehouse.Description,
                  },
                );
              }}
              onAreaChange={(area) => {
                setValue(
                  "area",
                  area && { ref: area.Ref, description: area.Description },
                );
              }}
            />
            <ErrorMessage errors={errors} name={"warehouse"} />
            <div className="w-full">
              <Label htmlFor="description">Description</Label>
              <Textarea required {...register("description")} />
              <ErrorMessage errors={errors} name={"description"} />
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col flex-between h-full">
          <CardHeader>
            <CardTitle>Your order</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            {cartStore.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div className="flex gap-2">
                  <div className="h-24 w-24">
                    <ProductImage id={item.image} />
                  </div>
                </div>
                <div className="w-full px-2 flex flex-col gap-2">
                  <div className="text-xl text-bold text-start">
                    {item.name}
                  </div>
                  <div className="text-sm text-end flex justify-between">
                    <div>
                      {item.quantity} x {item.price} ₴ ={" "}
                      {item.price * item.quantity} ₴
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <div className="w-full flex flex-col gap-4">
              {cartStore.items.length > 0 && (
                <div className="text-xl">Total: {cartStore.getTotal()} ₴</div>
              )}
              <div>
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
