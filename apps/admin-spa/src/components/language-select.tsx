import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ControllerRenderProps } from "react-hook-form";
import { trpc } from "../utils/trpc";
import React from "react";

export const LanguageSelect = React.forwardRef(
  ({
    ...props
  }: ControllerRenderProps<
    {
      languageId: number;
      name: string;
    },
    "languageId"
  >) => {
    const languages = trpc.admin.language.list.useQuery();

    return (
      <Select
        onValueChange={(v) => {
          props.onChange(+v);
        }}
        value={"" + props.value}
      >
        <SelectTrigger className="w-[80px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent {...props}>
          {languages.data?.map((lan) => (
            <SelectItem key={lan.id} value={"" + lan.id}>
              {lan.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  },
);
