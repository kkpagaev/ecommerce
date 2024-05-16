import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$ln/error")({
  component: ErrorComponent,
  loader: async () => {
    if (Math.random() > 0.5) throw new Error("Random error!");
  },
  wrapInSuspense: true,
  errorComponent: ({ error }) => {
    return (
      <div className="p-2">
        <h3>Caught: {(error as Error).message}</h3>
        <p>(This page has a 50% chance of throwing an error)</p>
      </div>
    );
  },
});

function ErrorComponent() {
  return (
    <div className="p-2">
      <h3>The loader of this page has a 50% chance of throwing an error!</h3>
    </div>
  );
}
