"use client";

import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminApi, trpc } from "@/utils/trpc";
import { useApiForm } from "@/utils/use-api-form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function CategoryCreateForm() {
  const form = useApiForm(adminApi.catalog.category.createCategory, {
    name: "",
    description: "",
  });
  const utils = trpc.useUtils();

  const onSubmit = form.handleSubmit(async (data) => {
    await adminApi.catalog.category.createCategory.mutate(data);
    utils.admin.catalog.category.listCategories.invalidate();

    toast.success("Category created", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
  });

  return (
    <Dialog>
      <Button
        onClick={() => {
          toast.success("Create Category");
        }}
      >
        Create Category
      </Button>
      <DialogTrigger>Create Category</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
