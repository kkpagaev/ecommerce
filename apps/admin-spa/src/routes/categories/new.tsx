import { Label } from "@/components/ui/label";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { useForm, useFieldArray } from "react-hook-form";
import { AdminInputs, AdminOutputs, trpc } from "../../utils/trpc";
import { ImageManager } from "../../components/image-manager";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

type CategoryCreateInputs =
  AdminInputs["catalog"]["category"]["createCategory"];

type LanguageModel = AdminOutputs["language"]["list"][number];

type CategoryFormProps = {
  languages: LanguageModel[];
  onSubmit: (data: CategoryCreateInputs) => void;
};
function CategoryForm({ languages, onSubmit }: CategoryFormProps) {
  const { register, control, handleSubmit } = useForm<CategoryCreateInputs>({
    defaultValues: {
      imageId: undefined,
      descriptions: languages.map((lang) => {
        return {
          languageId: lang.id,
          name: "",
        };
      }),
    },
  });
  const { fields } = useFieldArray({
    control,
    name: "descriptions",
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid md:grid-cols-2 gap-16"
    >
      <Card>
        <CardHeader>
          <CardTitle>Name transtlation</CardTitle>
        </CardHeader>
        <CardContent>
          {fields.map((field, index) => (
            <div key={field.id}>
              <Label>
                {languages.find((lang) => lang.id === field.languageId)?.name}
              </Label>

              <Input
                {...register(`descriptions.${index}.name`)}
                defaultValue={field.name}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <ImageManager
        enableSelect
        limit={1}
        onSelectChange={(images) => {
          if (images.length > 0) {
            register("imageId").onChange({
              target: {
                name: "imageId",
                value: images[0].id,
              },
            });
          }
        }}
      />

      <div className="md:col-span-2">
        <Button type="submit" variant="default" className="w-full md:w-fit">
          Save
        </Button>
      </div>
    </form>
  );
}

export const Route = createFileRoute("/categories/new")({
  beforeLoad: ({ context }) => ({ ...context, getTitle: () => "New Category" }),
  loader: async ({ context }) => {
    const languages = await context.trpc.admin.language.list.fetch();

    return { languages };
  },
  component: CategoryNewComponent,
});

function CategoryNewComponent() {
  const { languages } = Route.useLoaderData();
  const navigate = useNavigate();
  const mutation = trpc.admin.catalog.category.createCategory.useMutation({
    onSuccess: async () => {
      await utils.admin.catalog.category.listCategories.invalidate();
      toast.success("Category created");
      navigate({ to: "/categories" });
    },
  });
  const utils = trpc.useUtils();
  const onSubmit = async (data: CategoryCreateInputs) => {
    mutation.mutate(data);
  };

  return (
    <div className="container mx-auto py-10">
      <CategoryForm languages={languages} onSubmit={onSubmit} />
    </div>
  );
}
