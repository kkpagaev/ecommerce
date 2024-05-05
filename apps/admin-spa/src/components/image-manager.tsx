import { Input } from "./ui/input";
import { AdminOutputs, trpc } from "../utils/trpc";
import { AspectRatio } from "./ui/aspect-ratio";
import { Button } from "./ui/button";
import { TrashIcon } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { DialogHeader } from "./ui/dialog";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";

function ImageUpload() {
  const utils = trpc.useUtils();
  const mutation = trpc.admin.files.uploadFile.useMutation({
    onSuccess: () => {
      utils.admin.files.listFiles.invalidate();
      toast.success("Image uploaded");
    },
  });

  // const onLoad = (fileString: string) => {
  //   console.log(fileString);
  // };
  const getBase64 = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      mutation.mutate({
        image: (reader.result as string).split(",")[1],
      });
    };
  };

  return (
    <div>
      <Input
        disabled={mutation.status === "pending"}
        id="picture"
        type="file"
        onChange={(e) => {
          const files = e.target.files;
          const file = files?.[0];
          if (file) getBase64(file);
        }}
      />
    </div>
  );
}

function ImageCard({
  file,
  selected,
  ...props
}: React.DOMAttributes<HTMLDivElement> & {
  selected: boolean;
  file: ImageType;
}) {
  const utils = trpc.useUtils();
  const mutation = trpc.admin.files.deleteFile.useMutation({
    onSuccess: () => {
      utils.admin.files.listFiles.invalidate();
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const onDelete = () => {
    // are you sure alert?
    const sure = confirm("Are you sure you want to delete this image?");

    if (!sure) {
      return;
    }
    mutation.mutate({ id: file.id });
  };
  return (
    <div key={file.id}>
      <AspectRatio
        ratio={4 / 4}
        className={cn(
          "relative rounded-md border-slate-200 border-2",
          selected && "border-blue-500",
        )}
      >
        <div className="w-full h-full" {...props}>
          <div
            className={cn(
              "absolute inset-0 invisible opacity-0 duration-200 transition-all bg-slate-400/50",
              selected && "visible opacity-100",
            )}
          />

          <img src={file.url} className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-2 right-2">
          <Button onClick={onDelete} className="text-sm">
            <TrashIcon />
          </Button>
        </div>
      </AspectRatio>
    </div>
  );
}

type ImageType = AdminOutputs["files"]["listFiles"][number];

type Props = {
  enableSelect?: boolean;
  limit?: number;
  onSelectChange?: (selected: Array<ImageType>) => void;
};
export function ImageManager({ enableSelect, limit, onSelectChange }: Props) {
  const { data } = trpc.admin.files.listFiles.useQuery();
  const [selected, setSelected] = useState<Array<string>>([]);

  useEffect(() => {}, [selected, data, onSelectChange]);

  const toggleSelected = (id: string) => {
    if (!enableSelect) {
      return;
    }
    if (limit && selected.length >= limit && !selected.includes(id)) {
      toast.error("You cannot select more than " + limit + " images");
      return;
    }

    const newSelect = selected.includes(id)
      ? selected.filter((i) => i !== id)
      : [...selected, id];

    if (onSelectChange) {
      onSelectChange(data?.filter((file) => newSelect.includes(file.id)) || []);
    }

    setSelected(newSelect);
  };

  return (
    <Dialog>
      <Button variant="outline" asChild>
        <DialogTrigger>Upload Image</DialogTrigger>
      </Button>
      <DialogContent className="h-[90vh] max-h-[90vh] max-w-[90vw] sm:h-[90vh] sm:max-h-[90vh] sm:max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Files</DialogTitle>
          <DialogDescription>
            Here you can upload images and delete them
          </DialogDescription>
        </DialogHeader>

        <ImageUpload />
        <div className="mt-4">Files</div>
        <div className="overflow-y-scroll">
          <div className="grid md:grid-cols-5 gap-4">
            {data?.map((file) => {
              return (
                <ImageCard
                  key={file.id}
                  file={file}
                  selected={selected.includes(file.id)}
                  onClick={() => toggleSelected(file.id)}
                />
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
