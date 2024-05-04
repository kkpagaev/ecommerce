import { Label } from "@/components/ui/label";
import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/categories/new")({
  beforeLoad: ({ context }) => ({ ...context, getTitle: () => "New Category" }),
  component: CategoryEditComponent,
});

function CategoryEditComponent() {
  return (
    <div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">Picture</Label>
        <Input id="picture" type="file" />
      </div>
    </div>
  );
}
