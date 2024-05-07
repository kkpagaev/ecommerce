import { Outlet, ToPathOption, useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Dialog, DialogOverlay, DialogPortal } from "./dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";

type Props = {
  path: ToPathOption;
};
export const OutletDialog = ({ path }: Props) => {
  const outlet = <Outlet />;

  const router = useRouter();
  const breadcrumbs = router.state.matches.map((match) => {
    return match.routeId;
  });

  const onBack = () => {
    console.log("foo");
    router.history.go(-1);
  };

  console.log(breadcrumbs[breadcrumbs.length - 1] === path);
  if (breadcrumbs[breadcrumbs.length - 1] === path) return null;

  return (
    <Dialog open={true}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          )}
        >
          {outlet}
          <DialogPrimitive.Close
            onClick={onBack}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};
