import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { toast } from "sonner";
import { trpc } from "../../utils/trpc";
import { LocationForm } from "../../components/forms/location-form";

export const Route = createFileRoute("/locations/$locationId/edit")({
  beforeLoad: ({ context }) => ({
    ...context,
    getTitle: () => "Edit location",
  }),
  loader: async ({ context, params }) => {
    const location =
      await context.trpc.admin.inventory.location.findOneLocation.fetch({
        id: Number(params.locationId),
      });
    if (!location) {
      throw new Error("Location not found");
    }

    return { location };
  },
  component: LocationComponent,
});

function LocationComponent() {
  const { location } = Route.useLoaderData();
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const router = useRouter();

  const mutation = trpc.admin.inventory.location.updateLocation.useMutation({
    onSuccess: async () => {
      router.invalidate();
      await utils.admin.inventory.location.listLocations.invalidate();
      toast.success("Location updated");
      navigate({ to: "/locations" });
    },
  });

  return (
    <div className="container mx-auto py-10">
      <LocationForm
        edit
        values={location}
        onSubmit={async (data) => {
          mutation.mutate({
            id: location.id,
            ...data,
          });
        }}
        errorMessage={mutation.error?.message}
      />
    </div>
  );
}
