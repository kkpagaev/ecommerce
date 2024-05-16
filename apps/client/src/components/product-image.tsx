import { CircleOff } from "lucide-react";
import { AspectRatio } from "./ui/aspect-ratio";

export function ProductImage({ id }: { id: string }) {
  if (!id)
    return (
      <div className="w-full h-full flex p-32">
        <AspectRatio ratio={1 / 1} className="rounded-md overflow-hidden">
          <CircleOff className="w-full h-full text-gray-300" />
        </AspectRatio>
      </div>
    );
  return (
    <AspectRatio ratio={1 / 1} className="rounded-md overflow-hidden">
      <img
        src={"http://localhost:3000/file-upload?imageId=" + id}
        className={"object-cover w-full h-full"}
      />
    </AspectRatio>
  );
}
