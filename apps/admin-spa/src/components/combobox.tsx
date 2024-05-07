"use client";

import * as React from "react";
import { CaretSortIcon, CheckboxIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  values: Array<{ value: string; label: string }>;
  onSelect: (value: string) => void;
};
export function Combobox({ values, onSelect }: Props) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState("");

  React.useEffect(() => {
    if (selected) {
      onSelect(selected);
    }
  }, [selected, onSelect]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selected
            ? values.find((v) => v.value === selected)?.label
            : "Select framework..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          filter={(value, search, keywords = []) => {
            const extendValue = value + " " + keywords.join(" ");
            if (extendValue.toLowerCase().includes(search.toLowerCase())) {
              return 1;
            }
            return 0;
          }}
        >
          <CommandInput placeholder="Search category..." className="h-9" />
          <CommandEmpty>Not found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {values.map((v) => (
                <CommandItem
                  className={cn("hover:bg-accent hover:text-accent-foreground")}
                  key={v.value}
                  keywords={[v.label]}
                  value={v.value}
                  onSelect={(value) => {
                    setSelected(value === selected ? "" : value);
                    setOpen(false);
                  }}
                  onClick={(e) => {
                    const value = e.currentTarget.nodeValue;
                    if (value !== null) {
                      setSelected(value === selected ? "" : value);
                    }
                    setOpen(false);
                  }}
                >
                  {v.label}
                  <CheckboxIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selected === v.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
