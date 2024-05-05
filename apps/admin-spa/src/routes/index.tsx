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
    <div className="container mx-auto py-10">
      <ImageManager onSelectChange={console.log} enableSelect />
    </div>
  );
}
