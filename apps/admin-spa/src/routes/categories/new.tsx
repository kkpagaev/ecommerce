import { Label } from "@/components/ui/label";
import { createFileRoute } from "@tanstack/react-router";
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

type CategoryCreateInputs =
  AdminInputs["catalog"]["category"]["createCategory"];

type LanguageModel = AdminOutputs["language"]["list"][number];

function FieldArray({ languages }: { languages: LanguageModel[] }) {
  // const mutation = trpc.admin.catalog.category.createCategory.useMutation();
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
    <form onSubmit={handleSubmit((data) => console.log(data))}>
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
    </form>
  );
}

export const Route = createFileRoute("/categories/new")({
  beforeLoad: ({ context }) => ({ ...context, getTitle: () => "New Category" }),
  loader: async ({ context }) => {
    const languages = await context.trpc.admin.language.list.fetch();

    return { languages };
  },
  component: CategoryEditComponent,
});

function CategoryEditComponent() {
  const { languages } = Route.useLoaderData();

  return (
    <div className="container mx-auto py-10">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">Picture</Label>
        <ImageManager enableSelect limit={1} />
        <FieldArray languages={languages} />
      </div>
    </div>
  );
}
