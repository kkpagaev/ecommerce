import { Input } from "./ui/input";
import { trpc } from "../utils/trpc";

function ImageUpload() {
  const utils = trpc.useUtils();
  const mutation = trpc.admin.files.uploadFile.useMutation({
    onSuccess: () => {
      utils.admin.files.listFiles.invalidate();
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

export function ImageManager() {
  const { data } = trpc.admin.files.listFiles.useQuery();

  return (
    <div>
      <ImageUpload />
      {data?.map((file) => {
        return (
          <div>
            <img src={file.url} />
          </div>
        );
      })}
    </div>
  );
}
