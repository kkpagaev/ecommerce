import { Input } from "./ui/input";
import { AdminOutputs, trpc } from "../utils/trpc";
import { AspectRatio } from "./ui/aspect-ratio";
import { Button } from "./ui/button";
import {
  GalleryHorizontalIcon,
  GalleryVerticalIcon,
  TrashIcon,
} from "lucide-react";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";

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
  afterDelete,
  ...props
}: React.DOMAttributes<HTMLDivElement> & {
  selected: boolean;
  file: ImageType;
  afterDelete?: (file: ImageType) => void;
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
    if (afterDelete) {
      afterDelete(file);
    }
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
  defaultSelected?: Array<string>;
  onSelectChange?: (selected: Array<ImageType>) => void;
};
export function ImageManager({
  enableSelect,
  defaultSelected,
  limit,
  onSelectChange,
}: Props) {
  const { data } = trpc.admin.files.listFiles.useQuery();
  const [selected, setSelected] = useState<Array<string>>(
    defaultSelected || [],
  );

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
    <div>
      <Dialog>
        <Button variant="outline" asChild>
          <DialogTrigger className="w-full">
            <div className="flex gap-2 w-full">
              <GalleryHorizontalIcon />
              {limit === 1 ? "Image" : "Images"}
            </div>
          </DialogTrigger>
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
                    afterDelete={(image) => {
                      if (selected.includes(image.id)) {
                        setSelected(selected.filter((i) => i !== image.id));
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {selected.length > 0 && (
        <Carousel>
          <CarouselContent>
            {selected.map((file) => {
              const image = data?.find((i) => i.id === file);
              if (!image) {
                return null;
              }
              return (
                <CarouselItem className="xl:basis-1/3" key={image.id}>
                  <AspectRatio
                    ratio={4 / 4}
                    className={cn(
                      "relative rounded-md border-slate-200 border-2",
                    )}
                  >
                    <div className="w-full h-full">
                      <div
                        className={cn(
                          "absolute inset-0 invisible opacity-0 duration-200 transition-all bg-slate-400/50",
                        )}
                      />

                      <img
                        src={image.url}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </AspectRatio>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </div>
  );
}
