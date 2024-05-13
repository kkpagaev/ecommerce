import { createFileRoute } from "@tanstack/react-router";
import { ImageManager } from "../components/image-manager";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => ({
    ...context,
    getTitle: () => "Dashboard",
  }),
  component: Index,
});
function Index() {
  return (
    <div>
      <ImageManager
        preview
        onSelectChange={console.log}
        limit={2}
        enableSelect
      />
    </div>
  );
}
