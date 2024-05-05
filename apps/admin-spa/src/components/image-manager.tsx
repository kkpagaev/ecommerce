import { Input } from "./ui/input";
import { AdminOutputs, trpc } from "../utils/trpc";
import { AspectRatio } from "./ui/aspect-ratio";
import { Button } from "./ui/button";
import { DeleteIcon, TrashIcon } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { DialogHeader } from "./ui/dialog";
import { toast } from "sonner";

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

function ImageCard({ file }: { file: ImageType }) {
  const utils = trpc.useUtils();
  const mutation = trpc.admin.files.deleteFile.useMutation({
    onSuccess: () => {
      utils.admin.files.listFiles.invalidate();
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
        className="relative rounded-md border-black border-2"
      >
        <img src={file.url} className="w-full h-full object-cover" />
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

export function ImageManager() {
  const { data } = trpc.admin.files.listFiles.useQuery();

  return (
    <div>
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Files</DialogTitle>
            <DialogDescription>
              Here you can upload images and delete them
            </DialogDescription>
          </DialogHeader>

          <ImageUpload />
          <div className="mt-4">Files</div>
          <div className="grid md:grid-cols-4 gap-4">
            {data?.map((file) => {
              return <ImageCard key={file.id} file={file} />;
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
