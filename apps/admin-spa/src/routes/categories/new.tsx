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
import { parseErrorSchema } from "../../utils/resolver";
import { useEffect } from "react";
import { ZodError } from "zod";
import { ErrorMessage } from "@hookform/error-message";

type CategoryCreateInputs =
  AdminInputs["catalog"]["category"]["createCategory"];

type LanguageModel = AdminOutputs["language"]["list"][number];

type CategoryFormProps = {
  languages: LanguageModel[];
  onSubmit: (data: CategoryCreateInputs) => void;
  errorMessage?: string;
};
function CategoryForm({
  languages,
  onSubmit,
  errorMessage,
}: CategoryFormProps) {
  const {
    formState: { errors },
    register,
    control,
    setError,
    clearErrors,
    handleSubmit,
  } = useForm<CategoryCreateInputs>({
    shouldFocusError: false,
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

  useEffect(() => {
    if (!errorMessage) return;
    toast.error("Form validation error");
    clearErrors();
    const errors = parseErrorSchema(
      new ZodError(JSON.parse(errorMessage)).errors,
      false,
    );
    for (const [path, error] of Object.entries(errors)) {
      type Path = Parameters<typeof setError>[0];

      setError(path as Path, {
        type: error.type,
        message: error.message,
      });
    }
  }, [errorMessage, clearErrors, setError]);

  const { fields } = useFieldArray({
    control,
    name: "descriptions",
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        clearErrors();
        onSubmit(data);
      })}
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
              <ErrorMessage
                errors={errors}
                name={`descriptions.${index}.name`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div>
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
        <ErrorMessage errors={errors} name={"imageId"} />
      </div>
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
      <CategoryForm
        languages={languages}
        onSubmit={onSubmit}
        errorMessage={mutation.error?.message}
      />
    </div>
  );
}
